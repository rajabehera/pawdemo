import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ShieldCheck, Loader2, CheckCircle2, Lock, Smartphone, CreditCard } from "lucide-react";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PhonePeCheckoutProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId?: string;
  cartItems?: any[];
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  gstAmount?: number;
}

export default function PhonePeCheckout({
  isOpen, amount, onClose, onSuccess, onFailure,
  customerName = "Pawwcious Customer",
  customerPhone = "9999999999",
  customerEmail = "customer@pawwcious.com",
  orderId,
  cartItems = [], subtotal = 0, discount = 0, shippingFee = 0, gstAmount = 0,
}: PhonePeCheckoutProps) {

  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "done">("idle");
  const [paymentStep, setPaymentStep] = useState("");
  const [error, setError] = useState("");
  const [showBreakup, setShowBreakup] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");

  // ✅ Let user choose which gateway
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "phonepe">("razorpay");
  const rzpInstanceRef = React.useRef<any>(null);

  // ✅ Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("idle");
      setError("");
      setPaymentStep("");
      setSelectedGateway("razorpay");
    }
  }, [isOpen]);
  useEffect(() => {
    if (paymentStatus === "done") {
      const timer = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);


  const startRazorpayPayment = async () => {
    try {
      setError("");
      setPaymentStatus("processing");
      setPaymentStep("Creating secure Razorpay order...");

      const createRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await createRes.json();

      if (!orderData?.id) {
        throw new Error(orderData.error || "Failed to create Razorpay order.");
      }

      setPaymentStep("Loading Razorpay checkout...");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      setPaymentStep("Waiting for payment authorization...");

      const options = {
        // ✅ Uses env variable with fallback
        key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Pawwcious",
        description: "Pawwcious Luxury Pet Care Order",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            setPaymentStatus("processing");
            setPaymentStep("Verifying payment securely...");

            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setSuccessOrderId(verifyData.transaction?.paymentId || response.razorpay_payment_id);
            setPaymentStatus("success");
            setPaymentStep("Payment verified successfully!");
            await new Promise(resolve => setTimeout(resolve, 1800));
            setPaymentStatus("done");
            // ✅ Close Razorpay modal before navigating
            if (rzpInstanceRef.current) {
              rzpInstanceRef.current.close();
              rzpInstanceRef.current = null;
            }

            await new Promise(resolve => setTimeout(resolve, 1200));
            setPaymentStatus("done");
            await new Promise(resolve => setTimeout(resolve, 300));
            onSuccess(verifyData.transaction?.paymentId || response.razorpay_payment_id);
          } catch (verifyErr: any) {
            setPaymentStatus("idle");
            setError(verifyErr.message || "Payment verification failed.");
            onFailure(verifyErr.message);
          }
        },
        // ✅ Uses real customer data passed from App.tsx
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone.replace(/\D/g, "").slice(-10),
        },
        theme: { color: "#0f766e" },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle");
            setError("Payment cancelled.");
            onFailure("Payment cancelled by customer.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzpInstanceRef.current = rzp;
      rzp.open();
    } catch (err: any) {
      setPaymentStatus("idle");
      setError(err.message || "Unable to start payment.");
      onFailure(err.message);
    }
  };

  const startPhonePePayment = async () => {
    try {
      setError("");
      setPaymentStatus("processing");
      setPaymentStep("Starting secure PhonePe payment...");

      const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
      if (!cleanPhone || cleanPhone.length !== 10) {
        throw new Error("Valid 10-digit phone number required for PhonePe.");
      }

      const finalOrderId = orderId || `PW_PH_${Date.now()}`;

      const phonePeOrderData = {
        orderId: finalOrderId,
        customerName,
        phone: cleanPhone,
        email: customerEmail,
        items: cartItems,
        subtotal,
        discount,
        shippingFee,
        gstAmount,
        totalAmount: amount,
        paymentMethod: "PhonePe",
        paymentStatus: "Pending",
        orderStatus: "Payment Pending",
        gateway: "PhonePe",
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("/api/payment/phonepe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          orderId: finalOrderId,
          customerName,
          phone: cleanPhone,
          email: customerEmail,
          orderData: phonePeOrderData,
        }),
      });

      const data = await res.json();

      if (data.success && data.redirectUrl) {
        localStorage.setItem(
          "phonepe_pending",
          JSON.stringify({
            merchantTransactionId: data.merchantTransactionId,
            orderId: finalOrderId,
            customerName,
            customerPhone: cleanPhone,
            customerEmail,
            amount,
            orderData: phonePeOrderData,
          })
        );

        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.error || "Could not start PhonePe payment.");
      }
    } catch (err: any) {
      setPaymentStatus("idle");
      setError(err.message || "Could not start PhonePe payment.");
      onFailure(err.message);
    }
  };
  const handlePayNow = () => {
    if (selectedGateway === "razorpay") {
      startRazorpayPayment();
    } else {
      startPhonePePayment();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-900/60 z-[10000] flex justify-center items-center overflow-y-auto p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 40, scale: 0.96 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 40, scale: 0.96 }}
          transition={{ type: "spring", duration: 0.45 }}
          className="w-full max-w-md bg-[#FAF9F5] rounded-3xl shadow-2xl overflow-hidden text-stone-900 border border-stone-200"
        >
          {/* Header */}
          <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-stone-200">
            <button
              onClick={() => { setPaymentStatus("idle"); onFailure("Payment cancelled"); onClose(); }}
              className="p-1 text-stone-500 hover:text-stone-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/images/apple-touch-icon.webp" alt="logo" width="36" />
              <span className="font-extrabold text-lg tracking-tight text-stone-900">Pawwcious</span>
            </div>
            <div className="w-5" />
          </div>

          <div className="p-6 space-y-5">
            {/* Amount card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-bold">Amount Payable</span>
                <span className="text-2xl font-black font-mono">₹{amount.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBreakup(!showBreakup)}
                className="text-[10px] text-teal-700 font-bold uppercase tracking-wider"
              >
                {showBreakup ? "Hide Breakup" : "View Breakup"}
              </button>
              {showBreakup && (
                <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-left">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span>GST</span><span>₹{gstAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}</span></div>
                  <div className="flex justify-between font-black border-t border-stone-100 pt-2"><span>Total</span><span>₹{amount.toFixed(2)}</span></div>
                </div>
              )}
            </div>

            {/* ✅ Gateway selector — only shown when idle */}
            {paymentStatus === "idle" && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-mono">Choose Payment Method</p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway("razorpay")}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition cursor-pointer ${selectedGateway === "razorpay" ? "border-teal-600 bg-teal-50" : "border-stone-200 bg-white hover:border-stone-300"}`}
                  >
                    <CreditCard className={`h-5 w-5 ${selectedGateway === "razorpay" ? "text-teal-700" : "text-stone-400"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wide ${selectedGateway === "razorpay" ? "text-teal-700" : "text-stone-500"}`}>UPI / Cards</span>
                    <span className="text-[9px] text-stone-400 font-mono">via Razorpay</span>
                  </button>
                  {/*   <button
                    type="button"
                    onClick={() => setSelectedGateway("phonepe")}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition cursor-pointer ${selectedGateway === "phonepe" ? "border-purple-600 bg-purple-50" : "border-stone-200 bg-white hover:border-stone-300"}`}
                  >
                    <Smartphone className={`h-5 w-5 ${selectedGateway === "phonepe" ? "text-purple-700" : "text-stone-400"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wide ${selectedGateway === "phonepe" ? "text-purple-700" : "text-stone-500"}`}>PhonePe</span>
                    <span className="text-[9px] text-stone-400 font-mono">UPI Redirect</span>
                  </button>    */}
                </div>
              </div>
            )}

            {/* Status states */}
            {paymentStatus === "processing" && (
              <div className="bg-[#0C221D] text-white rounded-2xl p-4 space-y-3 text-center">
                <Loader2 className="h-7 w-7 text-amber-300 animate-spin mx-auto" />
                <p className="text-xs font-bold">{paymentStep}</p>
              </div>
            )}
            {paymentStatus === "success" && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 space-y-2 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
                <p className="text-sm font-black">Payment Succeeded!</p>
                <p className="text-xs">Creating your order now...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Pay button */}
            {paymentStatus === "idle" && (
              <button
                type="button"
                onClick={handlePayNow}
                className={`w-full font-black text-xs py-3.5 rounded-2xl uppercase tracking-widest text-white transition ${selectedGateway === "razorpay" ? "bg-teal-700 hover:bg-teal-800" : "bg-purple-700 hover:bg-purple-800"}`}
              >
                Pay ₹{amount.toFixed(2)} via {selectedGateway === "razorpay" ? "Razorpay" : "PhonePe"}
              </button>
            )}

            <p className="text-[9px] text-stone-400 font-bold flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Secured by {selectedGateway === "razorpay" ? "Razorpay" : "PhonePe"}. Order created only after successful verification.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}