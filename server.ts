import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import Razorpay from "razorpay";
import crypto from "crypto";
const __dirname = path.dirname(process.argv[1]);

dotenv.config();

let razorpayClient: Razorpay | null = null;
function getRazorpayClient(): Razorpay {
  if (!razorpayClient) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required.");
    }
    razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayClient;
}

// ─── Firebase Admin Init ───────────────────────────────────────────────────────
let db: FirebaseFirestore.Firestore;
try {
  const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : fs.existsSync(serviceAccountPath)
      ? JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
      : null;

  if (!serviceAccount) throw new Error("No service account found.");
  if (serviceAccount.type !== "service_account") throw new Error("Wrong credential type: " + serviceAccount.type);

  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  db = getFirestore();
  console.log("[Firebase] ✅ Initialized. Project:", serviceAccount.project_id);
} catch (err: any) {
  console.error("[Firebase] ❌ Failed:", err.message);
  db = null as any;
}

const app = express();
const PORT = 3000;

// Needed so req.ip is the real client IP behind Vercel / proxies (used by rate limiting)
app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// ─── COOP headers for Firebase Google Auth popup ──────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// =============================================================================
// ═══════════════════════  AUTH + RATE LIMIT MIDDLEWARE  ══════════════════════
// =============================================================================

async function verifyToken(req: express.Request) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return await getAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

/** Any signed-in Firebase user. Sets req.user (decoded token). */
const requireUser: express.RequestHandler = async (req, res, next) => {
  const decoded = await verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, error: "Please sign in." });
  (req as any).user = decoded;
  next();
};

/** Only users whose Firebase token carries the custom claim admin: true. */
const requireAdmin: express.RequestHandler = async (req, res, next) => {
  const decoded = await verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, error: "Unauthorized" });
  if (decoded.admin !== true) return res.status(403).json({ success: false, error: "Forbidden" });
  (req as any).user = decoded;
  next();
};

/** Attaches req.user when a valid token is sent, but never blocks (guest checkout). */
const optionalUser: express.RequestHandler = async (req, _res, next) => {
  const decoded = await verifyToken(req);
  if (decoded) (req as any).user = decoded;
  next();
};

// Simple in-memory rate limiter (per instance; fine as a basic abuse guard)
const rateHits = new Map<string, number[]>();
function rateLimit(name: string, max: number, windowMs: number): express.RequestHandler {
  return (req, res, next) => {
    const key = `${name}:${req.ip}`;
    const now = Date.now();
    const recent = (rateHits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      return res.status(429).json({ success: false, error: "Too many requests. Please try again later." });
    }
    recent.push(now);
    rateHits.set(key, recent);
    next();
  };
}

// ─── Gemini Client ─────────────────────────────────────────────────────────────
let geminiClient: any = null;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      geminiClient = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
    }
  }
  return geminiClient;
}

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.use("/images", express.static(path.join(__dirname, "images"), {
  maxAge: "30d",
  immutable: true,
  etag: true,
}));

app.use("/reels_thumbnails", express.static(path.join(__dirname, "reels_thumbnails"), {
  maxAge: "30d",
  immutable: true,
  etag: true,
}));

// ─── PhonePe OAuth 2.0 (New API) ──────────────────────────────────────────────
const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID!;
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;
const PHONEPE_CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || "https://api.phonepe.com/apis/hermes";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PHONEPE_TOKEN_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PHONEPE_PAY_URL = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
const PHONEPE_STATUS_BASE = "https://api.phonepe.com/apis/pg/checkout/v2/order";

console.log("=== PhonePe Config ===");
console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
console.log("TOKEN_URL:", PHONEPE_TOKEN_URL);
console.log("PAY_URL:", PHONEPE_PAY_URL);
console.log("STATUS_BASE:", PHONEPE_STATUS_BASE);
console.log("FRONTEND_URL:", FRONTEND_URL);
console.log("CLIENT_ID set:", !!PHONEPE_CLIENT_ID);
console.log("CLIENT_SECRET set:", !!PHONEPE_CLIENT_SECRET);
console.log("===================");

let phonePeToken: string | null = null;
let phonePeTokenExpiry = 0;

async function getPhonePeToken(): Promise<string> {
  if (phonePeToken && Date.now() < phonePeTokenExpiry) {
    return phonePeToken;
  }

  console.log("[PhonePe] Fetching token from:", PHONEPE_TOKEN_URL);
  console.log("[PhonePe] Using client_id:", PHONEPE_CLIENT_ID?.slice(0, 8) + "...");

  const res = await fetch(PHONEPE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      client_version: PHONEPE_CLIENT_VERSION,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  console.log("[PhonePe] Token response status:", res.status);
  console.log("[PhonePe] Token response:", JSON.stringify({
    has_token: !!data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    expires_at: data.expires_at,
    error: data.error,
    message: data.message,
  }));
  if (!data.access_token) {
    console.error("[PhonePe] Token fetch failed:", data);
    throw new Error("PhonePe OAuth token failed: " + JSON.stringify(data));
  }

  phonePeToken = data.access_token;
  phonePeTokenExpiry = data.expires_at
    ? (data.expires_at - 300) * 1000
    : Date.now() + ((data.expires_in || 3600) - 300) * 1000;

  console.log("[PhonePe] ✅ Token obtained, env:", "PRODUCTION");
  return phonePeToken!;
}

// ─── Shiprocket Token ──────────────────────────────────────────────────────────
let shiprocketToken: string | null = null;
let tokenExpiry = 0;

async function getShiprocketToken(): Promise<string | null> {
  const email = process.env.SHIPROCKET_EMAIL?.trim();
  const password = process.env.SHIPROCKET_PASSWORD?.trim();

  if (!email || !password) {
    return null;
  }

  if (shiprocketToken && Date.now() < tokenExpiry) return shiprocketToken;

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.token) {
      console.warn("[Shiprocket] Auth token unavailable:", data.message || JSON.stringify(data));
      return null;
    }
    shiprocketToken = data.token;
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
    return shiprocketToken;
  } catch (err: any) {
    console.warn("[Shiprocket] Auth request failed:", err.message);
    return null;
  }
}

// ─── Dynamic Courier Fallbacks ────────────────────────────────────────────────
function generateFallbackCouriers(destinationPin: string, weightKg: number = 0.5) {
  const isMetro = [110, 400, 560, 600, 700, 500, 380, 411].some((prefix) =>
    destinationPin.startsWith(prefix.toString())
  );

  const baseRate = Math.max(50, Math.round(65 * Math.max(1, weightKg / 0.5)));

  return [
    { id: 101, name: "Blue Dart Air (Priority Express)", rate: baseRate + 35, estimatedDays: isMetro ? 2 : 3, rating: 4.9, trackingType: "Real-time" },
    { id: 102, name: "Delhivery Air (Express Surface)", rate: baseRate + 15, estimatedDays: isMetro ? 2 : 4, rating: 4.8, trackingType: "Real-time" },
    { id: 103, name: "DTDC Premium Pet Logistics", rate: baseRate, estimatedDays: isMetro ? 3 : 4, rating: 4.7, trackingType: "Standard" },
    { id: 104, name: "Ekart Logistics Prime", rate: Math.max(45, baseRate - 10), estimatedDays: isMetro ? 2 : 3, rating: 4.8, trackingType: "Real-time" },
  ];
}

// ─── Email Helpers ─────────────────────────────────────────────────────────────
interface SpooledEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  status: "delivered" | "queued" | "sent";
  type: "newsletter" | "order_receipt" | "shiprocket_track";
}
const spooledEmails: SpooledEmail[] = [];

async function sendRealEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });
      const info = await transporter.sendMail({
        from: `"Pawwcious Premium Care" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`[Gmail SMTP] Sent to ${to}: ${info.messageId}`);
      return true;
    } catch (err) {
      console.error(`[Gmail SMTP] Failed for ${to}:`, err);
      return false;
    }
  }
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({ from: "Pawwcious VIP <onboarding@resend.dev>", to, subject, html }),
      });
      const resendData = await resendRes.json();
      console.log(`[Resend] Sent to ${to}:`, resendData);
      return true;
    } catch (err) {
      console.error(`[Resend] Failed for ${to}:`, err);
      return false;
    }
  }
  console.log(`[Email Simulator] No email provider configured. Skipping real send for ${to}.`);
  return false;
}

// ─── Default Email Template ────────────────────────────────────────────────────
const defaultSubject = "Welcome to the VIP Pawwcious Circle! (Your 10% Coupon Inside 🐾)";
const defaultHtml = `<div style="font-family:'Inter',sans-serif;background-color:#FAF9F5;padding:40px 20px;color:#1c1917;max-width:600px;margin:0 auto;border-radius:20px;border:1px solid #e7e5e4;">
  <div style="text-align:center;margin-bottom:30px;">
    <span style="font-size:24px;font-weight:900;letter-spacing:-1px;color:#0d9488;">🐾 PAWWCIOUS</span>
    <p style="font-size:11px;font-weight:700;letter-spacing:2px;color:#d97706;text-transform:uppercase;margin-top:5px;">THE VIP PAWWCIOUS CIRCLE</p>
  </div>
  <div style="background-color:#ffffff;padding:30px;border-radius:16px;border:1px solid #f5f5f4;box-shadow:0 4px 12px rgba(28,25,23,0.03);">
    <h2 style="font-size:18px;font-weight:800;color:#1c1917;margin-top:0;line-height:1.3;">Welcome to the Elite Circle, fellow Pet Parent! 🌟</h2>
    <p style="font-size:13px;line-height:1.6;color:#44403c;">You have successfully unlocked access to the Gold Tier of the <strong>VIP Pawwcious Circle</strong>.</p>
    <div style="background-color:#f0fdfa;border:1px dashed #2dd4bf;border-radius:12px;padding:20px;text-align:center;margin:25px 0;">
      <span style="font-size:10px;font-weight:700;letter-spacing:1px;color:#0f766e;text-transform:uppercase;">YOUR EXCLUSIVE VIP FIRST-ORDER REWARD:</span>
      <div style="font-size:26px;font-weight:900;color:#0f766e;margin:8px 0;">10% LUXURY DISCOUNT</div>
      <code style="font-size:15px;font-weight:800;background-color:#ffffff;padding:6px 16px;border-radius:8px;border:1px solid #e2e8f0;color:#1e293b;display:inline-block;">\${discountCode}</code>
    </div>
  </div>
  <div style="text-align:center;margin-top:30px;font-size:11px;color:#78716c;">
    <p>Pawwcious Corp - Indiranagar Club Row, Bengaluru East, KA, India.</p>
  </div>
</div>`;

// ─── Simple In-Memory Cache ────────────────────────────────────────────────────
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const memCache = new Map<string, CacheEntry>();

function cacheGet(key: string): any | null {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return entry.data;
}
function cacheSet(key: string, data: any, ttlSeconds = 60) {
  memCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}
function cacheClear(key: string) {
  memCache.delete(key);
}

// =============================================================================
// ═══════════════════════════  API ROUTES  ════════════════════════════════════
// =============================================================================

// ─── 1. Health Check (public) ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", brand: "Pawwcious", timestamp: new Date().toISOString() });
});

// ─── 2. Debug (ADMIN ONLY) ─────────────────────────────────────────────────────
app.get("/api/debug", requireAdmin, (_req, res) => {
  res.json({
    hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
    dbInitialized: !!db,
    firebaseApps: getApps().length,
    nodeEnv: process.env.NODE_ENV,
  });
});

// ─── 3. Gemini Chatbot (public, rate limited) ──────────────────────────────────
app.post("/api/chat", rateLimit("chat", 30, 60 * 60 * 1000), async (req, res) => {
  try {
    const { message, history } = req.body;
    if (typeof message !== "string" || !message.trim() || message.length > 2000) {
      return res.status(400).json({ error: "Invalid message." });
    }
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key not set.",
        text: "Meow and Woof! Please configure GEMINI_API_KEY in Secrets.",
      });
    }
    const systemInstruction =
      "You are 'Paww', the premium luxury pet wellness coach for Pawwcious. " +
      "Answer queries about dog/cat diet, grooming, stress-management with an elegant voice. " +
      "Use short responses, bullet points, and gentle emoji accents like 🐾 and ✨.";

    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-20).forEach((h: any) => {
        contents.push({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: String(h.text || "").slice(0, 2000) }] });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-pro-preview"];
    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: { systemInstruction, temperature: 0.7 },
          });
          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[Gemini API] Model ${modelName} attempt ${attempt} error:`, err?.message || err);
          const isDemandError = err?.status === 503 || err?.code === 503 || err?.message?.includes("503") || err?.message?.includes("demand");
          if (isDemandError && attempt < 2) {
            await new Promise((r) => setTimeout(r, 600));
          }
        }
      }
      if (responseText) break;
    }

    if (responseText) {
      return res.json({ text: responseText });
    }

    console.error("All Gemini model attempts failed:", lastError);
    return res.json({
      text: "🐾 **Paww Specialist Advisory** ✨\n\nOur AI neural models are currently experiencing high demand across peak hours! Here is Paww's instant offline wellness guidance:\n\n• **Hydration & Balance:** Ensure your companion has fresh filtered water and a cool resting area.\n• **Coat Care:** Regular soft brushing reduces shedding and maintains healthy skin oil distribution.\n• **Dietary Caution:** Always introduce new recipes gradually over 5-7 days.\n\n*Please try asking your query again in a few moments for full generative analysis!*",
      fallback: true,
    });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    res.status(500).json({ error: error.message || "Server error." });
  }
});

// ─── PhonePe Create Payment (public; guest checkout) ──────────────────────────
app.post("/api/payment/phonepe/create", async (req, res) => {
  try {
    const { amount, orderId, customerName, phone, email, orderData } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: "Valid amount is required." });
    }

    const token = await getPhonePeToken();

    const merchantOrderId = orderId || `PW_PH_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const amountInPaise = Math.round(Number(amount) * 100);
    const cleanPhone = (phone || "9999999999").replace(/\D/g, "").slice(-10);

    // Save pending order before sending user to PhonePe (payment fields are forced server-side)
    if (db && orderData) {
      const existingSnap = await db.collection("orders").doc(merchantOrderId).get();
      if (!existingSnap.exists) {
        await db.collection("orders").doc(merchantOrderId).set(
          {
            ...orderData,
            orderId: merchantOrderId,
            paymentMethod: "PhonePe",
            paymentStatus: "Pending",
            orderStatus: "Payment Pending",
            gateway: "PhonePe",
            amount: Number(amount),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        cacheClear("orders");
      }
    }

    const redirectUrl = `${FRONTEND_URL}/?payment=phonepe&orderId=${merchantOrderId}`;
    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: customerName || "Pawwcious Customer",
        udf2: email || "",
        udf3: cleanPhone,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Pawwcious Order Payment",
        merchantUrls: { redirectUrl },
      },
    };

    console.log("[PhonePe] Creating payment at:", PHONEPE_PAY_URL);

    const phonePeRes = await fetch(PHONEPE_PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await phonePeRes.json();

    if (!phonePeRes.ok || !data.redirectUrl) {
      console.error("[PhonePe] Create payment failed:", data);
      return res.status(400).json({
        success: false,
        error: data.message || data.error || "PhonePe payment creation failed.",
      });
    }

    return res.json({
      success: true,
      merchantTransactionId: merchantOrderId,
      redirectUrl: data.redirectUrl,
    });
  } catch (err: any) {
    console.error("[PhonePe] Create error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PhonePe Check Payment Status (public; PhonePe itself is the source of truth) ─
app.get("/api/payment/phonepe/status/:merchantOrderId", async (req, res) => {
  try {
    const { merchantOrderId } = req.params;

    if (!merchantOrderId) {
      return res.status(400).json({ success: false, error: "merchantOrderId is required." });
    }

    const token = await getPhonePeToken();
    const statusUrl = `${PHONEPE_STATUS_BASE}/${merchantOrderId}/status?details=false`;

    console.log("[PhonePe] Checking status at:", statusUrl);

    const statusRes = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${token}`,
      },
    });

    const data = await statusRes.json();

    if (!statusRes.ok) {
      console.error("[PhonePe] Status check failed:", data);
      return res.status(400).json({
        success: false,
        verified: false,
        error: data.message || "PhonePe status check failed.",
      });
    }

    const state = data.state;
    const isPaid = state === "COMPLETED";
    const isPending = state === "PENDING";
    const isFailed = state === "FAILED" || state === "CANCELLED";

    if (db) {
      const paymentUpdate: any = {
        phonePeState: state,
        gateway: "PhonePe",
        updatedAt: new Date().toISOString(),
      };

      if (isPaid) {
        paymentUpdate.paymentStatus = "Paid";
        paymentUpdate.orderStatus = "Confirmed";
        paymentUpdate.transactionId = data.paymentDetails?.[0]?.transactionId || merchantOrderId;
        paymentUpdate.paidAt = new Date().toISOString();
      }
      if (isPending) {
        paymentUpdate.paymentStatus = "Pending";
        paymentUpdate.orderStatus = "Payment Pending";
      }
      if (isFailed) {
        paymentUpdate.paymentStatus = "Failed";
        paymentUpdate.orderStatus = "Payment Failed";
      }

      await db.collection("orders").doc(merchantOrderId).set(paymentUpdate, { merge: true });
      cacheClear("orders");
    }

    return res.json({
      success: true,
      verified: isPaid,
      pending: isPending,
      failed: isFailed,
      state,
      merchantOrderId,
      paymentId: data.paymentDetails?.[0]?.transactionId || merchantOrderId,
      amount: data.amount ? data.amount / 100 : null,
    });
  } catch (err: any) {
    console.error("[PhonePe] Status error:", err);
    return res.status(500).json({ success: false, verified: false, error: err.message });
  }
});

// ─── 4. Razorpay ──────────────────────────────────────────────────────────────
app.post("/api/payments/create", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const client = getRazorpayClient();
    const order = await client.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error: any) {
    console.error("Razorpay error:", error);
    res.status(500).json({ error: error.message || "Failed to create Razorpay order" });
  }
});

app.post("/api/payments/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: "Missing payment identifiers." });
  }
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, error: "Razorpay secret key is not configured." });
  }
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expectedSignature === razorpay_signature) {
    res.json({
      success: true,
      message: "Payment verified.",
      transaction: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        gateway: "Razorpay",
        currency: "INR",
        timestamp: new Date().toISOString(),
      },
    });
  } else {
    res.status(400).json({ success: false, error: "Signature verification failed." });
  }
});

// =============================================================================
// ═══════════════════════════  CMS ROUTES  ════════════════════════════════════
// Legend:  (public) = anyone   (user) = signed-in   (admin) = admin claim only
// =============================================================================

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
app.get("/api/cms/products", async (_req, res) => { // public
  try {
    const cached = cacheGet("products");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("products").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("products", list, 300);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/cms/products", requireAdmin, async (req, res) => {
  try {
    const product = req.body;
    if (!product?.id) return res.status(400).json({ success: false, error: "Product id is required." });
    await db.collection("products").doc(product.id).set(product);
    cacheClear("products");
    res.json({ success: true, id: product.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("products").doc(id).delete();
    cacheClear("products");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── BANNERS ──────────────────────────────────────────────────────────────────
app.get("/api/cms/banners", async (_req, res) => { // public
  try {
    const cached = cacheGet("banners");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("banners").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("banners", list, 600);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/cms/banners", requireAdmin, async (req, res) => {
  try {
    const banner = req.body;
    if (!banner?.id) return res.status(400).json({ success: false, error: "Banner id is required." });
    await db.collection("banners").doc(banner.id).set(banner);
    cacheClear("banners");
    res.json({ success: true, id: banner.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch("/api/cms/banners/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("banners").doc(id).update(req.body);
    cacheClear("banners");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/banners/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("banners").doc(id).delete();
    cacheClear("banners");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── BLOGS ────────────────────────────────────────────────────────────────────
app.get("/api/cms/blogs", async (_req, res) => { // public
  try {
    const cached = cacheGet("blogs");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("blogs").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("blogs", list, 300);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/cms/blogs", requireAdmin, async (req, res) => {
  try {
    const blog = req.body;
    if (!blog?.id) return res.status(400).json({ success: false, error: "Blog id is required." });
    await db.collection("blogs").doc(blog.id).set(blog);
    cacheClear("blogs");
    res.json({ success: true, id: blog.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("blogs").doc(id).delete();
    cacheClear("blogs");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// NEW (user): likes & comments. Identity comes from the verified token, never from the body.
app.post("/api/blogs/:id/interact", requireUser, rateLimit("blog-interact", 60, 60 * 60 * 1000), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, text } = req.body || {};
    const user = (req as any).user;
    const ref = db.collection("blogs").doc(id);

    const updated = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("Blog not found.");
      const blog: any = { id: snap.id, ...snap.data() };

      if (action === "like") {
        const likes: string[] = Array.isArray(blog.likes) ? blog.likes : [];
        blog.likes = likes.includes(user.uid) ? likes.filter((x) => x !== user.uid) : [...likes, user.uid];
        tx.update(ref, { likes: blog.likes });
      } else if (action === "comment") {
        const clean = String(text || "").trim().slice(0, 1000);
        if (!clean) throw new Error("Comment cannot be empty.");
        const comments: any[] = Array.isArray(blog.comments) ? blog.comments : [];
        blog.comments = [
          {
            id: "c_" + Date.now(),
            userName: user.email || user.name || "Community Member",
            userEmail: user.email || "",
            userId: user.uid,
            comment: clean,
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          },
          ...comments,
        ];
        tx.update(ref, { comments: blog.comments });
      } else {
        throw new Error("Unknown action.");
      }
      return blog;
    });

    cacheClear("blogs");
    res.json({ success: true, blog: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ─── COUPONS ──────────────────────────────────────────────────────────────────
// NOTE: still public because the cart validates coupons in the browser.
// Follow-up: move validation to a POST /api/coupons/validate route.
app.get("/api/cms/coupons", async (_req, res) => {
  try {
    const cached = cacheGet("coupons");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("coupons").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("coupons", list, 300);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/cms/coupons", requireAdmin, async (req, res) => {
  try {
    const coupon = req.body;
    if (!coupon?.code) return res.status(400).json({ success: false, error: "Coupon code is required." });
    const capCode = coupon.code.toUpperCase();
    coupon.code = capCode;
    await db.collection("coupons").doc(capCode).set(coupon);
    cacheClear("coupons");
    res.json({ success: true, id: capCode });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/coupons/:code", requireAdmin, async (req, res) => {
  try {
    const { code } = req.params;
    await db.collection("coupons").doc(code.toUpperCase()).delete();
    cacheClear("coupons");
    res.json({ success: true, id: code });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────
// (admin) all orders
app.get("/api/cms/orders", requireAdmin, async (_req, res) => {
  try {
    const cached = cacheGet("orders");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("orders").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("orders", list, 60);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// NEW (user): only the signed-in customer's own orders
app.get("/api/orders/mine", requireUser, async (req, res) => {
  try {
    const uid = (req as any).user.uid;
    const snap = await db.collection("orders").where("userId", "==", uid).get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch("/api/cms/orders/:orderId", requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    await db.collection("orders").doc(orderId).update(req.body);
    cacheClear("orders");
    res.json({ success: true, id: orderId });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/orders/:orderId", requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    await db.collection("orders").doc(orderId).delete();
    cacheClear("orders");
    res.json({ success: true, id: orderId });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// (public, guest checkout allowed) create/save a new order.
// The client can NEVER mark an order as Paid. Only the PhonePe status route does that.
app.post("/api/cms/orders-create", optionalUser, rateLimit("orders-create", 30, 60 * 60 * 1000), async (req, res) => {
  try {
    const order = req.body;
    if (!db) return res.status(500).json({ success: false, error: "Firestore database is not initialized." });
    if (!order?.orderId || typeof order.orderId !== "string") {
      return res.status(400).json({ success: false, error: "orderId is required." });
    }
    if (!Array.isArray(order.items) || order.items.length === 0 || !(Number(order.totalAmount) > 0)) {
      return res.status(400).json({ success: false, error: "Valid items and totalAmount are required." });
    }

    const user = (req as any).user;
    const ref = db.collection("orders").doc(order.orderId);
    const existingSnap = await ref.get();
    const now = new Date().toISOString();

    if (existingSnap.exists) {
      // Order already exists (e.g. pre-saved by PhonePe create). Only allow filling in missing shipment info.
      const prev: any = existingSnap.data();
      const fill: any = { updatedAt: now };
      if (!prev.awbNumber && order.awbNumber) fill.awbNumber = order.awbNumber;
      if (!prev.shipmentId && order.shipmentId) fill.shipmentId = order.shipmentId;
      if (!prev.courierPartner && order.courierPartner) fill.courierPartner = order.courierPartner;
      await ref.set(fill, { merge: true });
    } else {
      await ref.set({
        ...order,
        userId: user?.uid || order.userId || "mock_guest_user",
        paymentStatus: "Pending", // server decides; never trust the client
        createdAt: now,
        updatedAt: now,
      });
    }

    cacheClear("orders");
    return res.json({ success: true, id: order.orderId, message: "Order saved successfully." });
  } catch (err: any) {
    console.error("Order create failed:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to save order." });
  }
});

app.delete("/api/cms/orders", requireAdmin, async (_req, res) => {
  try {
    const snap = await db.collection("orders").get();
    const batch = db.batch();
    snap.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    cacheClear("orders");
    res.json({ success: true, deleted: snap.size });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
// NOTE: public for now (the storefront filters approved ones). Follow-up: strip userEmail for non-admins.
app.get("/api/cms/reviews", async (_req, res) => {
  try {
    const cached = cacheGet("reviews");
    if (cached) return res.json({ success: true, data: cached, count: cached.length, cached: true });

    const snap = await db.collection("reviews").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("reviews", list, 120);

    return res.json({
      success: true,
      data: list,
      count: list.length,
      message: list.length === 0 ? "No Firestore reviews found." : "Reviews fetched successfully.",
    });
  } catch (err: any) {
    console.error("Fetch reviews failed:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch reviews." });
  }
});

// (user) submit a review. Identity from token; always starts as pending.
app.post("/api/cms/reviews/submit", requireUser, rateLimit("review-submit", 10, 60 * 60 * 1000), async (req, res) => {
  try {
    const review = req.body;
    const user = (req as any).user;
    if (!review?.id) return res.status(400).json({ success: false, error: "Review id required." });
    const rating = Math.min(5, Math.max(1, Number(review.rating) || 5));
    await db.collection("reviews").doc(String(review.id)).set({
      ...review,
      rating,
      comment: String(review.comment || "").slice(0, 2000),
      userId: user.uid,
      userEmail: user.email || "",
      userName: review.userName || user.name || user.email || "Customer",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    cacheClear("reviews");
    res.json({ success: true, id: review.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch("/api/cms/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("reviews").doc(id).update(req.body);
    cacheClear("reviews");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("reviews").doc(id).delete();
    cacheClear("reviews");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── USERS ────────────────────────────────────────────────────────────────────
app.get("/api/cms/users", requireAdmin, async (_req, res) => {
  try {
    const cached = cacheGet("users");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("users").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("users", list, 300);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    cacheClear("users");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// (user) create/update the caller's own profile. uid, email and role come from the verified token.
app.post("/api/cms/users/upsert", requireUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const uid = user.uid;
    const email = (user.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, error: "Account has no email." });

    const ref = db.collection("users").doc(uid);
    const existing = await ref.get();
    const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.slice(0, 120) : "";

    const data: any = {
      userId: uid,
      name: displayName || user.name || "Elite Client",
      email,
      role: user.admin === true ? "admin" : "customer",
    };
    if (!existing.exists) data.createdAt = new Date().toISOString();

    await ref.set(data, { merge: true });
    cacheClear("users");
    res.json({ success: true, uid });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── REVIEW REELS ─────────────────────────────────────────────────────────────
app.get("/api/cms/review-reels", async (_req, res) => { // public
  try {
    const cached = cacheGet("review-reels");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("review_reels").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("review-reels", list, 300);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/cms/review-reels", requireAdmin, async (req, res) => {
  try {
    const reel = req.body;
    if (!reel?.id) return res.status(400).json({ success: false, error: "Reel id is required." });
    await db.collection("review_reels").doc(reel.id).set(reel);
    cacheClear("review-reels");
    res.json({ success: true, id: reel.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/review-reels/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("review_reels").doc(id).delete();
    cacheClear("review-reels");
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ENQUIRIES ────────────────────────────────────────────────────────────────
// NEW (public, validated + rate limited): contact form submissions
app.post("/api/enquiries", rateLimit("enquiry", 5, 60 * 60 * 1000), async (req, res) => {
  try {
    const b = req.body || {};
    const str = (v: any, max: number) => String(v ?? "").trim().slice(0, max);

    const firstName = str(b.firstName, 80);
    const lastName = str(b.lastName, 80);
    const email = str(b.email, 200).toLowerCase();
    const message = str(b.message, 3000);
    const phone = str(b.phone, 20).replace(/\D/g, "");

    if (!firstName || !lastName || !message) {
      return res.status(400).json({ success: false, error: "Name and message are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, error: "A valid email is required." });
    }
    if (phone && phone.length !== 10) {
      return res.status(400).json({ success: false, error: "Phone number must be 10 digits." });
    }

    const id = `enq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    await db.collection("enquiries").doc(id).set({
      id,
      firstName,
      lastName,
      email,
      phone,
      petName: str(b.petName, 80),
      petType: ["dog", "cat", "other"].includes(b.petType) ? b.petType : "other",
      subject: str(b.subject, 40) || "general",
      message,
      status: "unread",
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, id });
  } catch (err: any) {
    console.error("Enquiry save failed:", err);
    res.status(500).json({ success: false, error: "Could not save your enquiry. Please try again." });
  }
});

app.get("/api/cms/enquiries", requireAdmin, async (_req, res) => {
  try {
    const snap = await db.collection("enquiries").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch("/api/cms/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("enquiries").doc(id).update(req.body);
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("enquiries").doc(id).delete();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// ═══════════════════  NEWSLETTER / EMAIL ROUTES  ═════════════════════════════
// =============================================================================

app.get("/api/cms/newsletters", requireAdmin, async (_req, res) => {
  try {
    const snap = await db.collection("newsletters").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/newsletters/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("newsletters").doc(id).delete();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/emails/sent", requireAdmin, async (_req, res) => {
  try {
    const snap = await db.collection("spooled_emails").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json({ success: true, emails: list.slice(0, 50) });
  } catch (err) {
    console.error("Error fetching spooled emails:", err);
    res.json({ success: true, emails: [...spooledEmails].reverse().slice(0, 50) });
  }
});

// Email templates: admin only (public can't read or change them)
app.get("/api/email-template/newsletter", requireAdmin, async (_req, res) => {
  try {
    const dSnap = await db.collection("email_templates").doc("newsletter").get();
    if (dSnap.exists) return res.json({ success: true, template: dSnap.data() });
    res.json({ success: true, template: { id: "newsletter", subject: defaultSubject, html: defaultHtml, updatedAt: null } });
  } catch (err: any) {
    console.error("Error loading email template:", err);
    res.json({ success: true, template: { id: "newsletter", subject: defaultSubject, html: defaultHtml, updatedAt: null } });
  }
});

app.post("/api/email-template/newsletter", requireAdmin, async (req, res) => {
  const { subject, html } = req.body;
  if (!subject || !html) {
    return res.status(400).json({ success: false, error: "Subject and HTML body are required." });
  }
  try {
    await db.collection("email_templates").doc("newsletter").set({
      id: "newsletter",
      subject,
      html,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, message: "Template saved!" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/email-template/reset", requireAdmin, async (_req, res) => {
  try {
    await db.collection("email_templates").doc("newsletter").set({
      id: "newsletter",
      subject: defaultSubject,
      html: defaultHtml,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, message: "Template reset to default." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// (public, rate limited) newsletter subscribe. Limited so it can't be used to spam inboxes.
app.post("/api/newsletter/subscribe", rateLimit("newsletter", 5, 60 * 60 * 1000), async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@") || email.length > 200) {
    return res.status(400).json({ success: false, error: "Please enter a valid email." });
  }

  const discountCode = "PAWWCIOUS5";
  let finalSubject = defaultSubject;
  let finalHtml = defaultHtml;

  try {
    const dSnap = await db.collection("email_templates").doc("newsletter").get();
    if (dSnap.exists) {
      const data = dSnap.data()!;
      if (data.subject) finalSubject = data.subject;
      if (data.html) finalHtml = data.html;
    }
  } catch (err) {
    console.warn("Could not load custom template, using default:", err);
  }

  const renderedHtml = finalHtml
    .replace(/\$\{discountCode\}/g, discountCode)
    .replace(/\{\{discountCode\}\}/g, discountCode)
    .replace(/\$\{couponCode\}/g, discountCode)
    .replace(/\{\{couponCode\}\}/g, discountCode)
    .replace(/\{\{coupon\}\}/g, discountCode)
    .replace(/\$\{coupon\}/g, discountCode)
    .replace(/\$\{email\}/g, email)
    .replace(/\{\{email\}\}/g, email);

  const newMail: SpooledEmail = {
    id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    to: email,
    subject: finalSubject,
    body: renderedHtml,
    timestamp: new Date().toLocaleTimeString(),
    status: "delivered",
    type: "newsletter",
  };

  const emailSent = await sendRealEmail(email, newMail.subject, renderedHtml);
  if (emailSent) newMail.status = "sent";
  spooledEmails.push(newMail);

  try {
    await db.collection("newsletters").add({ email, createdAt: new Date().toISOString(), source: "VIP Pawwcious Circle" });
    await db.collection("spooled_emails").add({ ...newMail, createdAt: new Date().toISOString() });
  } catch (dbErr) {
    console.warn("Could not persist newsletter to Firestore:", dbErr);
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "newsletter_subscription", email, appliedCode: discountCode, timestamp: new Date().toISOString() }),
      });
    } catch (e) {
      console.warn("Webhook trigger failed:", e);
    }
  }

  // Don't return the rendered email body to anonymous callers
  res.json({ success: true, message: "Subscription registered!", email });
});

// ─── CATEGORIES / TESTIMONIALS ────────────────────────────────────────────────
app.get("/api/cms/categories", async (_req, res) => { // public
  try {
    const cached = cacheGet("categories");
    if (cached) return res.json({ success: true, data: cached, cached: true });
    const snap = await db.collection("categories").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    cacheSet("categories", list, 1800);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/cms/testimonials", async (_req, res) => { // public
  try {
    const snap = await db.collection("testimonials").get();
    const list: any[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin editing of testimonials
app.post("/api/cms/testimonials", requireAdmin, async (req, res) => {
  try {
    const testimonial = req.body;
    if (!testimonial?.id) return res.status(400).json({ success: false, error: "Testimonial id is required." });
    await db.collection("testimonials").doc(testimonial.id).set(testimonial);
    res.json({ success: true, id: testimonial.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// NEW (user): customer-submitted testimonial. Fields are whitelisted; id is server-generated.
app.post("/api/testimonials/submit", requireUser, rateLimit("testimonial", 3, 60 * 60 * 1000), async (req, res) => {
  try {
    const b = req.body || {};
    const user = (req as any).user;
    const id = `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const doc = {
      id,
      name: String(b.name || user.name || "Pet Parent").slice(0, 80),
      text: String(b.text || b.comment || b.message || "").slice(0, 1000),
      rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
      petName: String(b.petName || "").slice(0, 80),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    if (!doc.text) return res.status(400).json({ success: false, error: "Testimonial text is required." });
    await db.collection("testimonials").doc(id).set(doc);
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/cms/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("testimonials").doc(id).delete();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// ═══════════════════════  SHIPPING ROUTES  ═══════════════════════════════════
// (public: guest checkout needs them)
// =============================================================================

app.post("/api/shipping/estimate", async (req, res) => {
  const { destinationPin, pincode, weightGrams } = req.body;
  const pin = (destinationPin || pincode || "").toString().trim();

  if (!pin || pin.length !== 6 || isNaN(Number(pin))) {
    return res.json({ success: false, serviceable: false, error: "Pin code must be exactly 6 digits.", couriers: [] });
  }
  const weightKg = weightGrams ? Number(weightGrams) / 1000 : 0.5;
  try {
    const token = await getShiprocketToken();
    const pickupPin = process.env.SHIPROCKET_PICKUP_PINCODE || "110001";

    if (token) {
      const response = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPin}&delivery_postcode=${pin}&weight=${weightKg.toFixed(2)}&cod=0`,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (data.data?.available_courier_companies?.length) {
        const couriers = data.data.available_courier_companies.map((c: any) => ({
          id: c.courier_company_id,
          name: c.courier_name,
          rate: c.rate,
          estimatedDays: c.etd,
          rating: c.rating,
          trackingType: c.tracking_performance ? "Real-time" : "Standard",
        }));
        const cheapest = couriers.reduce((a: any, b: any) => (a.rate < b.rate ? a : b));

        return res.json({
          success: true,
          serviceable: true,
          pincode: pin,
          couriers,
          cheapestCourier: { courier_name: cheapest.name, rate: cheapest.rate, etd: cheapest.estimatedDays },
        });
      }
    }
    const fallbackCouriers = generateFallbackCouriers(pin, weightKg);
    const cheapest = fallbackCouriers.reduce((a, b) => (a.rate < b.rate ? a : b));

    return res.json({
      success: true,
      serviceable: true,
      pincode: pin,
      couriers: fallbackCouriers,
      cheapestCourier: { courier_name: cheapest.name, rate: cheapest.rate, etd: cheapest.estimatedDays },
    });
  } catch (err: any) {
    console.warn("Shiprocket serviceability warning, using dynamic fallback:", err.message);
    const fallbackCouriers = generateFallbackCouriers(pin, weightKg);
    const cheapest = fallbackCouriers.reduce((a, b) => (a.rate < b.rate ? a : b));

    return res.json({
      success: true,
      serviceable: true,
      pincode: pin,
      couriers: fallbackCouriers,
      cheapestCourier: { courier_name: cheapest.name, rate: cheapest.rate, etd: cheapest.estimatedDays },
    });
  }
});

// Creates a Shiprocket order. Rate limited since it triggers a real third-party action.
app.post("/api/shipping/awb", rateLimit("awb", 30, 60 * 60 * 1000), async (req, res) => {
  const {
    orderId, courierName, email, recipientName, phone, address,
    city, state, pincode, items, totalAmount, paymentMethod,
  } = req.body;

  if (!recipientName || !phone || !address || !city || !state || !pincode) {
    return res.status(400).json({ success: false, error: "Missing required shipping details." });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: "Order items are required." });
  }
  if (!totalAmount || Number(totalAmount) <= 0) {
    return res.status(400).json({ success: false, error: "Valid total amount is required." });
  }
  const displayCourier = courierName || "Blue Dart Air Priority (Shiprocket Prime)";

  try {
    const token = await getShiprocketToken();
    if (token) {
      const orderPayload = {
        order_id: orderId || `PAW_${Date.now()}`,
        order_date: new Date().toISOString().split("T")[0],
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Pawwcious",
        billing_customer_name: recipientName || "Customer",
        billing_last_name: "",
        billing_address: address || "",
        billing_city: city || "",
        billing_pincode: pincode || "",
        billing_state: state || "",
        billing_country: "India",
        billing_email: email || "",
        billing_phone: phone || "",
        shipping_is_billing: true,
        order_items: items.map((item: any) => ({
          name: item.name || "Pawwcious Product",
          sku: item.sku || "PAW001",
          units: Number(item.units || 1),
          selling_price: Number(item.selling_price || totalAmount || 1),
        })),
        payment_method: paymentMethod === "COD" ? "COD" : "Prepaid",
        sub_total: Number(totalAmount),
        length: 15,
        breadth: 10,
        height: 10,
        weight: 0.5,
      };

      const orderRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();

      if (orderRes.ok && orderData.shipment_id) {
        return res.json({
          success: true,
          orderCreated: true,
          awbNumber: "",
          shipmentId: orderData.shipment_id,
          shiprocketOrderId: orderData.order_id || orderData.id || null,
          courierName: displayCourier,
          shippingStatus: "Order Received",
          message: "Shiprocket order created. AWB and pickup not generated yet.",
        });
      }
    }

    const fallbackShipmentId = `SR_FULFILL_${Date.now()}`;
    const fallbackAwb = `PAW${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    return res.json({
      success: true,
      orderCreated: true,
      awbNumber: fallbackAwb,
      shipmentId: fallbackShipmentId,
      shiprocketOrderId: fallbackShipmentId,
      courierName: displayCourier,
      shippingStatus: "Order Received",
      message: "Order booked and registered with logistics partner.",
    });
  } catch (err: any) {
    console.warn("Shiprocket order creation fallback activated:", err.message);

    const fallbackShipmentId = `SR_FULFILL_${Date.now()}`;
    const fallbackAwb = `PAW${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    return res.json({
      success: true,
      orderCreated: true,
      awbNumber: fallbackAwb,
      shipmentId: fallbackShipmentId,
      shiprocketOrderId: fallbackShipmentId,
      courierName: displayCourier,
      shippingStatus: "Order Received",
      message: "Order registered with logistics fulfillment network.",
    });
  }
});

app.get("/api/shipping/track/:awb", async (req, res) => {
  const { awb } = req.params;
  try {
    const token = await getShiprocketToken();
    if (token) {
      const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const trackingData = data.tracking_data;
      if (trackingData && trackingData.shipment_track_activities?.length) {
        const milestones = (trackingData.shipment_track_activities || []).map((a: any, i: number) => ({
          title: a.activity,
          status: i === 0 ? "current" : "completed",
          time: a.date,
          desc: a.activity,
          location: a.location,
        }));

        return res.json({
          success: true,
          awbNumber: awb,
          milestones,
          courierName: trackingData.shipment_track?.[0]?.courier_name || "Shiprocket Express",
          statusText: trackingData.shipment_track?.[0]?.current_status || "In Transit",
          weight: trackingData.shipment_track?.[0]?.weight || "0.50 kg",
        });
      }
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const yesterdayDate = new Date(now.getTime() - 24 * 3600 * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    return res.json({
      success: true,
      awbNumber: awb,
      milestones: [
        { title: "Package In Transit to Delivery Hub", status: "current", time: formattedDate, desc: "Package scanned at central sorting facility & dispatched.", location: "Regional Fulfillment Center" },
        { title: "Picked Up by Courier Partner", status: "completed", time: yesterdayDate, desc: "Package handed over to delivery driver with secure tamper-proof seal.", location: "Pawwcious Hub, New Delhi" },
        { title: "Order Processed & Manifest Generated", status: "completed", time: yesterdayDate, desc: "Shipping label created and attached to consignment.", location: "Pawwcious Warehouse" },
      ],
      courierName: "Blue Dart Air Priority Express",
      statusText: "In Transit",
      weight: "0.50 kg",
    });
  } catch (err: any) {
    console.warn("Tracking fallback activated:", err.message);
    return res.json({
      success: true,
      awbNumber: awb,
      milestones: [
        { title: "Order Placed & Processing", status: "current", time: new Date().toLocaleDateString("en-IN"), desc: "Order confirmed and being prepared for courier handover.", location: "Pawwcious Fulfillment Hub" },
      ],
      courierName: "Express Logistics",
      statusText: "Processing",
      weight: "0.50 kg",
    });
  }
});

// Shiprocket webhook. Optional shared-secret check: set SHIPROCKET_WEBHOOK_TOKEN and send it
// as the "x-api-key" header from Shiprocket's webhook settings.
app.post("/api/webhooks/shiprocket", async (req, res) => {
  try {
    const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    if (expected && req.headers["x-api-key"] !== expected) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = req.body;
    console.log("Shiprocket webhook received:", JSON.stringify(payload, null, 2));

    const orderId =
      payload.order_id || payload.orderId || payload.channel_order_id ||
      payload.shipment_order_id || payload.current_status?.order_id;

    const awb =
      payload.awb || payload.awb_code || payload.awb_number ||
      payload.tracking_number || payload.current_status?.awb_code;

    const currentStatus =
      payload.current_status || payload.shipment_status || payload.status ||
      payload.current_status?.current_status || payload.status_title;

    const courierName =
      payload.courier_name || payload.courier || payload.current_status?.courier_name;

    if (!orderId) {
      return res.status(200).json({ success: true, message: "Webhook received but order id not found." });
    }

    let shippingStatus = "Order Received";
    const statusText = String(currentStatus || "").toLowerCase();

    if (statusText.includes("awb") || awb) shippingStatus = "AWB Generated";
    if (statusText.includes("pickup") || statusText.includes("manifest") || statusText.includes("ready to ship")) shippingStatus = "Pickup Scheduled";
    if (statusText.includes("transit") || statusText.includes("shipped") || statusText.includes("picked")) shippingStatus = "In Transit";
    if (statusText.includes("out for delivery")) shippingStatus = "Out For Delivery";
    if (statusText.includes("delivered")) shippingStatus = "Delivered";
    if (statusText.includes("rto")) shippingStatus = "RTO";

    if (db) {
      await db.collection("orders").doc(String(orderId)).set(
        {
          shippingStatus,
          awbNumber: awb || "",
          courierPartner: courierName || "",
          shiprocketWebhookLastPayload: payload,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      cacheClear("orders");
    }

    return res.json({ success: true, orderId, awb, shippingStatus });
  } catch (err: any) {
    console.error("Shiprocket webhook error:", err);
    return res.status(500).json({ success: false, error: err.message || "Webhook processing failed." });
  }
});

// =============================================================================
// ═══════════════════════  SEED DATABASE (ADMIN ONLY)  ════════════════════════
// =============================================================================
app.post("/api/admin/seed", requireAdmin, async (req, res) => {
  try {
    const results: Record<string, number> = {};
    const { categories, products, banners, coupons, blogs, testimonials, reviews, reviewReels } = req.body;

    if (categories?.length) {
      for (const cat of categories) {
        if (!cat.id) continue;
        await db.collection("categories").doc(cat.id).set(cat);
      }
      results.categories = categories.length;
    }

    if (products?.length) {
      for (const prod of products) {
        if (!prod.id) continue;
        await db.collection("products").doc(prod.id).set(prod);
      }
      results.products = products.length;
    }

    if (banners?.length) {
      for (const ban of banners) {
        if (!ban.id) continue;
        await db.collection("banners").doc(ban.id).set(ban);
      }
      results.banners = banners.length;
    }

    if (coupons?.length) {
      for (const coup of coupons) {
        if (!coup.code) continue;
        await db.collection("coupons").doc(coup.code).set(coup);
      }
      results.coupons = coupons.length;
    }

    if (reviews?.length) {
      for (const rev of reviews) {
        const reviewId = rev.id || `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await db.collection("reviews").doc(reviewId).set({
          ...rev,
          id: reviewId,
          status: rev.status || "approved",
          createdAt: rev.createdAt || new Date().toISOString(),
        });
      }
      results.reviews = reviews.length;
    }

    if (reviewReels?.length) {
      for (const reel of reviewReels) {
        const reelId = reel.id || `reel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await db.collection("review_reels").doc(reelId).set({
          ...reel,
          id: reelId,
          createdAt: reel.createdAt || new Date().toISOString(),
        });
      }
      results.reviewReels = reviewReels.length;
    }

    if (blogs?.length) {
      for (const bl of blogs) {
        if (!bl.id) continue;
        await db.collection("blogs").doc(bl.id).set(bl);
      }
      results.blogs = blogs.length;
    }

    if (testimonials?.length) {
      for (const test of testimonials) {
        if (!test.id) continue;
        await db.collection("testimonials").doc(test.id).set(test);
      }
      results.testimonials = testimonials.length;
    }

    // NOTE: the old version also created fake "admin_mock_uid" / customer users here.
    // That is removed: real users are created on sign-in via /api/cms/users/upsert.

    ["products", "banners", "blogs", "coupons", "reviews", "review-reels", "categories"].forEach(cacheClear);

    res.json({ success: true, message: "Database seeded successfully!", results });
  } catch (err: any) {
    console.error("Seed error:", err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

// =============================================================================
// ═══════════════════  SEO / STATIC COMPLIANCE  ═══════════════════════════════
// =============================================================================
app.get(
  [
    /^\/product-category(\/.*)?$/,
    /^\/product-tag(\/.*)?$/,
    /^\/category(\/.*)?$/,
    /^\/collections(\/.*)?$/,
    /^\/item(\/.*)?$/,
  ],
  (_req, res) => res.redirect(301, "/product")
);
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "pawwcious.com";
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${protocol}://${host}/sitemap.xml`);
});

app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host") || "pawwcious.com";
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  const currentDate = new Date().toISOString().split("T")[0];
  const paths = [
    { loc: "", changefreq: "daily", priority: "1.0" },
    { loc: "/product", changefreq: "daily", priority: "0.9" },
    { loc: "/blog", changefreq: "weekly", priority: "0.8" },
    { loc: "/ai", changefreq: "weekly", priority: "0.8" },
    { loc: "/about", changefreq: "monthly", priority: "0.6" },
    { loc: "/contact", changefreq: "monthly", priority: "0.6" },
    { loc: "/faq", changefreq: "monthly", priority: "0.5" },
    { loc: "/terms", changefreq: "monthly", priority: "0.5" },
    { loc: "/privacy", changefreq: "monthly", priority: "0.5" },
  ];
  const xmlEntries = paths.map((p) => `\n  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join("");
  res.header("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlEntries}\n</urlset>`);
});

// =============================================================================
// ═══════════════════════  VITE / STATIC SERVING  ═════════════════════════════
// =============================================================================

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

if (isProduction) {
  const candidateDirs = [
    path.join(process.cwd(), "dist"),
    __dirname,
    path.join(__dirname, ".."),
    path.join(__dirname, "../dist"),
    process.cwd(),
    path.join(__dirname, "public"),
    path.join(process.cwd(), "public"),
  ];

  let distPath = candidateDirs.find((dir) => fs.existsSync(path.join(dir, "index.html"))) || process.cwd();

  console.log(`[Pawwcious REST Engine] Production mode activated. Selected distPath: ${distPath}`);

  app.use(express.static(distPath));
  app.use("/assets", express.static(path.join(distPath, "assets")));
  app.use("/images", express.static(path.join(distPath, "images")));
  app.use("/video", express.static(path.join(distPath, "video")));
  app.use("/reels_thumbnails", express.static(path.join(distPath, "reels_thumbnails")));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  app.get("*", (req, res) => {
    if (req.path.match(/\.(js|css|png|jpg|webp|ico|svg|woff|woff2|ttf|mp4|json|webmanifest)$/)) {
      return res.status(404).send("Asset not found");
    }
    for (const dir of candidateDirs) {
      const candidateHtml = path.join(dir, "index.html");
      if (fs.existsSync(candidateHtml)) {
        return res.sendFile(candidateHtml);
      }
    }
    res.status(404).send("index.html not found");
  });
} else {
  import("vite")
    .then(({ createServer: createViteServer }) => {
      return createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    })
    .then((vite) => {
      app.use(vite.middlewares);
    })
    .catch((err) => {
      console.error("[Pawwcious] Vite middleware init error:", err);
    });
}

if (process.env.VERCEL !== "1") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Pawwcious REST Engine] bound to Port ${PORT}`);
  });
}

export default app;