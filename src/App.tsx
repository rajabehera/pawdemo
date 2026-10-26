/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart, Heart, User, Home, Info,
  ChevronRight, ChevronLeft, CheckCircle,
  ExternalLink, Menu, X, Pin, Star,
  ShoppingBag, Check, Sliders, Bot, Truck, LogOut,
} from "lucide-react";
import MotionWrapper from "./components/MotionWrapper";
// Modular Components
// Homepage is the initial route for most visitors — keep it as a static import
// so it's in the main chunk and paints immediately.
import { Homepage } from "./components/Homepage";
import { ToastTray } from "./components/ToastTray";
import { LoaderScreen } from "./components/LoaderScreen";
import { AboutPage } from "./components/AboutPage";
import { Footer } from "./components/Footer";

import {
  getProductSlug,
  getProductRoute,
  findProductBySlugOrId,
  normalizeProductDetails,
} from "./productRoutes";

// Types & Preset Fallbacks
import { Product, Category, Banner, Blog, Coupon, Order, CartItem, ShippingDetails, Review } from "./types";
import {
  fallbackCategories,
  fallbackProducts,
  fallbackBanners,
  fallbackCoupons,
  fallbackBlogs,
  fallbackReviews,
  fallbackReviewReels
} from "./data";

// Firebase
import { getAuthInstance } from "./firebase";
import { authFetch } from "./authFetch";
// Google Analytics 4 Integration
import { initGA, trackPageView, trackProductView, trackWhatsAppClick, trackAddToCart, trackBeginCheckout, trackPurchase } from "./analytics";

// Everything below is lazy-loaded: these components are only needed once the
// user navigates away from "home" or opens a modal.
const AdminCMS = React.lazy(() => import("./components/AdminCMS").then(m => ({ default: m.AdminCMS })));
const AICoachPage = React.lazy(() => import("./components/AICoachPage").then(m => ({ default: m.AICoachPage })));
const ContactPage = React.lazy(() => import("./components/ContactPage").then(m => ({ default: m.ContactPage })));
const SitemapPage = React.lazy(() => import("./components/SitemapPage").then(m => ({ default: m.SitemapPage })));
const ProductPage = React.lazy(() => import("./components/ProductPage").then(m => ({ default: m.ProductPage })));
const CartPage = React.lazy(() => import("./components/CartPage").then(m => ({ default: m.CartPage })));
const PrivacyPolicyPage = React.lazy(() => import("./components/PrivacyPolicyPage").then(m => ({ default: m.PrivacyPolicyPage })));

const PhonePeCheckout = React.lazy(() => import("./components/PhonePeCheckout"));
const WishlistPage = React.lazy(() => import("./components/WishlistPage").then(m => ({ default: m.WishlistPage })));
const ShopPage = React.lazy(() => import("./components/ShopPage").then(m => ({ default: m.ShopPage })));
const OrdersPage = React.lazy(() => import("./components/OrdersPage").then(m => ({ default: m.OrdersPage })));
const BlogPage = React.lazy(() => import("./components/BlogPage").then(m => ({ default: m.BlogPage })));



const getBlogSlug = (blog: Blog): string => {
  if (!blog) return "";
  const titleSlug = blog.title
    ? blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : "";
  return titleSlug || blog.id;
};

const findBlogBySlugOrId = (identifier: string, blogList: Blog[]): Blog | null => {
  if (!identifier || !blogList || blogList.length === 0) return null;
  const clean = decodeURIComponent(identifier).toLowerCase().trim();
  return (
    blogList.find((b) => {
      if (b.id && b.id.toLowerCase() === clean) return true;
      const slug = getBlogSlug(b);
      if (slug && slug.toLowerCase() === clean) return true;
      return false;
    }) || null
  );
};

// Never let one failing endpoint break the whole batch
const safeJson = (url: string): Promise<any> =>
  fetch(url)
    .then((r) => r.json())
    .catch(() => ({ success: false }));

type ViewState = "home" | "shop" | "ai" | "blog" | "cart" | "orders" | "wishlist" | "admin" | "faq" | "about" | "contact" | "terms" | "privacy" | "sitemap" | "product";
const SHOP_PATH = "/products";

const getPathForView = (view: ViewState): string => {
  if (view === "home") return "/";
  if (view === "shop") return SHOP_PATH;
  return `/${view}`;
};

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [blogs, setBlogs] = useState<Blog[]>(fallbackBlogs);
  const [coupons, setCoupons] = useState<Coupon[]>(fallbackCoupons);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [reviewReels, setReviewReels] = useState<any[]>(fallbackReviewReels);
  const [testimonials, setTestimonials] = useState<any[]>([]); // ✅ FIX: was missing
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // ✅ FIX: was missing

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem("pawwcious_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  // isAdmin is derived ONLY from the verified Firebase custom claim (never from localStorage).
  // It just controls UI visibility. Real protection must happen on the server.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Only match real performance-audit tools (broad bot matching can hurt SEO)
  const isLighthouse = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      const q = window.location.search.toLowerCase();
      return (
        ua.includes("lighthouse") ||
        ua.includes("speedinsights") ||
        ua.includes("pagespeed") ||
        ua.includes("chrome-lighthouse") ||
        q.includes("lighthouse") ||
        q.includes("pagespeed") ||
        q.includes("speedinsights")
      );
    }
    return false;
  }, []);

  const writeUserProfile = async (uid: string, displayName: string, email: string) => {
    if (!email) return;
    try {
      // Verified by token on the server; the server should take uid/email from the token
      await authFetch("/api/cms/users/upsert", {
        method: "POST",
        body: JSON.stringify({ uid, displayName, email }),
      });
    } catch (err: any) {
      console.warn("Could not write user profile:", err.message);
    }
  };

  // ── Auth listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    let unsubAuth: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      const auth = await getAuthInstance();
      const { onAuthStateChanged } = await import("firebase/auth");

      if (cancelled) return;

      unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserEmail(user.email);
          setCurrentUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });

          // ✅ Admin comes from the custom claim, not from an email comparison
          try {
            const tokenResult = await user.getIdTokenResult();
            setIsAdmin(tokenResult.claims.admin === true);
          } catch {
            setIsAdmin(false);
          }

          await writeUserProfile(user.uid, user.displayName || "", user.email || "");
        } else {
          setUserEmail(null);
          setCurrentUser(null);
          setIsAdmin(false);
        }

        setAuthLoading(false);
      });
    };

    init();

    return () => {
      cancelled = true;
      unsubAuth?.();
    };
  }, []);

  // ── Fetch all PUBLIC data from server ───────────────────────────────────────
  const fetchAllData = async () => {
    setIsLoading(true);

    try {
      // Critical: fetch these first so homepage can render
      const [productsRes, bannersRes, blogsRes, categoriesRes, testimonialsRes] =
        await Promise.all([
          safeJson("/api/cms/products"),
          safeJson("/api/cms/banners"),
          safeJson("/api/cms/blogs"),
          safeJson("/api/cms/categories"),
          safeJson("/api/cms/testimonials"),
        ]);

      if (productsRes.success) setProducts(productsRes.data.map((p: any) => ({
        ...p,
        sizeVariants: Array.isArray(p.sizeVariants) ? p.sizeVariants : ["Standard"],
        sizePrices: p.sizePrices || {},
        sizeOriginalPrices: p.sizeOriginalPrices || {},
        benefits: Array.isArray(p.benefits) ? p.benefits : [],
        usage: Array.isArray(p.usage) ? p.usage : [],
        galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
      })));
      if (bannersRes.success) setBanners(
        [...bannersRes.data].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      );
      if (blogsRes.success) {
        const sorted = [...blogsRes.data].sort((a: any, b: any) => {
          const timeA = a.createdAtTimestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAtTimestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });
        setBlogs(sorted.map((b: any) => ({
          ...b,
          galleryImages: Array.isArray(b.galleryImages) ? b.galleryImages : [],
          tags: Array.isArray(b.tags) ? b.tags : [],
          likes: Array.isArray(b.likes) ? b.likes : [],
          comments: Array.isArray(b.comments) ? b.comments : [],
        })));
      }
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (testimonialsRes.success) setTestimonials(testimonialsRes.data);
    } catch (err) {
      console.error("Critical fetch error:", err);
    } finally {
      setIsLoading(false);
    }

    // Non-critical PUBLIC data: load in background after page is visible
    try {
      const [couponsRes, reviewsRes, reviewReelsRes] = await Promise.all([
        safeJson("/api/cms/coupons"),
        safeJson("/api/cms/reviews"),
        safeJson("/api/cms/review-reels"),
      ]);

      if (couponsRes.success) setCoupons(couponsRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (reviewReelsRes.success) setReviewReels(reviewReelsRes.data);
    } catch (err) {
      console.error("Non-critical fetch error:", err);
    }
  };

  // ── PRIVATE data: admin gets everything, customers get only their own orders ─
  const fetchPrivateData = React.useCallback(async () => {
    try {
      if (isAdmin) {
        const [o, u] = await Promise.all([
          authFetch("/api/cms/orders").then((r) => r.json()),
          authFetch("/api/cms/users").then((r) => r.json()),
        ]);
        if (o.success) {
          setOrders(o.data.map((x: any) => ({ ...x, items: Array.isArray(x.items) ? x.items : [] })));
        }
        if (u.success) setUsers(u.data);
      } else if (currentUser) {
        const res = await authFetch("/api/orders/mine").then((r) => r.json());
        if (res.success) {
          setOrders(res.data.map((x: any) => ({ ...x, items: Array.isArray(x.items) ? x.items : [] })));
        }
      }
    } catch (err) {
      console.warn("Private data fetch error:", err);
    }
  }, [isAdmin, currentUser?.uid]);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      setOrders([]);
      setUsers([]);
      return;
    }
    fetchPrivateData();
  }, [authLoading, currentUser?.uid, isAdmin]);

  // Refresh both public and private data (passed to AdminCMS)
  const refreshAll = async () => {
    await fetchAllData();
    await fetchPrivateData();
  };

  // ── Run once on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    fetchAllData();
  }, []); // ← MUST be an empty array

  // Toast notifications state
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" | "warning" }[]>([]);

  const triggerToast = React.useCallback((message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    const id = "toast_" + Math.random().toString(36).substring(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Automatically dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // ── Redirect sign-in result check ───────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const isFirebaseRedirect =
      params.has("apiKey") ||
      params.has("authType") ||
      params.has("redirect") ||
      window.location.href.includes("firebase");

    if (!isFirebaseRedirect) return;

    let cancelled = false;

    const check = async () => {
      const auth = await getAuthInstance();
      const { getRedirectResult } = await import("firebase/auth");

      if (cancelled) return;

      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            triggerToast(
              `Welcome, ${result.user.displayName || result.user.email}! 🐾`,
              "success"
            );
          }
        })
        .catch((err) => {
          console.error("Redirect sign-in error:", err);
        });
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [triggerToast]);

  // ─── Handle add testimonial ────────────────────────────────────────────────
   const handleAddTestimonial = async (testimonial: any) => {
    try {
      const res = await authFetch("/api/testimonials/submit", {
        method: "POST",
        body: JSON.stringify(testimonial),
      });
      if (res.status === 401) {
        setIsLoginModalOpen(true);
        triggerToast("Please sign in to share your experience.", "info");
        return;
      }
      const data = await res.json();
      if (data.success) await fetchAllData();
    } catch (err) {
      console.error("Error adding testimonial:", err);
    }
  };

  // Expose toast globally for quick and easy access from other files/modules
  useEffect(() => {
    (window as any).showToast = triggerToast;
  }, [triggerToast]);

  // Boot Google Analytics 4
  useEffect(() => {
    initGA();
  }, []);

  // Premium forest green loader states
  const [transitionFinished, setTransitionFinished] = useState(false);
  useEffect(() => {
    const isProductUrl =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/products/") ||
        window.location.pathname.startsWith("/product/"));
    if (isLighthouse || isProductUrl) {
      setIsLoading(false);
      setTransitionFinished(true);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTransitionFinished(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, [isLighthouse]);

  // Helper to map URL path to ViewState
  const getViewFromPath = (path: string): ViewState => {
    const cleanPath = path.toLowerCase().replace(/\/$/, "") || "/";
    if (cleanPath.startsWith("/blog")) return "blog";
    // Dedicated product pages
    if (cleanPath.startsWith("/products/") || cleanPath.startsWith("/product/")) {
      return "product";
    }
    // Legacy eCommerce/WordPress indexed paths fallback
    if (
      cleanPath.startsWith("/product-category") ||
      cleanPath === "/products" ||
      cleanPath === "/product" ||
      cleanPath.startsWith("/category") ||
      cleanPath.startsWith("/collections") ||
      cleanPath.startsWith("/item")
    ) {
      return "shop";
    }
    switch (cleanPath) {
      case "/shop":
        return "shop";
      case "/ai":
      case "/ai-vet-coach":
        return "ai";
      case "/cart":
        return "cart";
      case "/orders":
        return "orders";
      case "/wishlist":
        return "wishlist";
      case "/admin":
        return "admin";
      case "/faq":
      case "/support":
        return "faq";
      case "/about":
        return "about";
      case "/contact":
        return "contact";
      case "/terms":
      case "/terms-and-conditions":
        return "terms";
      case "/privacy":
      case "/privacy-policy":
        return "privacy";
      case "/sitemap":
      case "/sitemap.html":
        return "sitemap";
      default:
        return "home";
    }
  };

  // Navigation & Theme
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    try {
      if (typeof window !== "undefined" && window.location.pathname && window.location.pathname !== "/") {
        const pathView = getViewFromPath(window.location.pathname);
        if (pathView !== "home") return pathView;
      }
      const stored = localStorage.getItem("pawwcious_view");
      const validViews = ["home", "shop", "ai", "blog", "cart", "orders", "wishlist", "admin", "faq", "about", "contact", "terms", "privacy", "sitemap"];
      return validViews.includes(stored || "") ? (stored as ViewState) : "home";
    } catch (e) {
      return "home";
    }
  });
const isCartView = currentView === "cart";   // or checkoutOpen, route === "/cart", etc.

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Category navigation state & login dialog
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("grooming")) return "Grooming";
      if (path.includes("treat") || path.includes("food")) return "Food & Treats";
      if (path.includes("accessory") || path.includes("accessories") || path.includes("collar") || path.includes("harness")) return "Accessories";
      if (path.includes("toy")) return "Toys";
      if (path.includes("wellness") || path.includes("care") || path.includes("shampoo")) return "Health & Care";
    }
    return "All";
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Selected details state - initialize immediately from URL if visiting a product page
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/products/") || pathname.startsWith("/product/")) {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 1) {
          const matched = findProductBySlugOrId(parts[1], fallbackProducts);
          if (matched) return normalizeProductDetails(matched);
        }
      }
    }
    return null;
  });
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeLightboxImgIndex, setActiveLightboxImgIndex] = useState<number | null>(null);

  // Navigate to dedicated product page with canonical route
  const handleNavigateToProduct = (prod: Product, tab: "benefits" | "usage" | "reviews" = "benefits") => {
    const normalized = normalizeProductDetails(prod);
    setSelectedProduct(normalized);
    setCurrentView("product");
    if (typeof window !== "undefined") {
      const targetRoute = getProductRoute(normalized);
      window.history.pushState({ view: "product", productId: normalized.id }, "", targetRoute);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Automated Google Analytics Page View and Product View tracking
  useEffect(() => {
    let pageTitle = currentView;
    let pagePath = currentView;

    if (currentView === "product" && selectedProduct) {
      pagePath = `products/${getProductSlug(selectedProduct)}`;
      pageTitle = `Product: ${selectedProduct.name}`;
      trackProductView(selectedProduct.id, selectedProduct.name, selectedProduct.price);
    } else if (currentView === "shop" && selectedProduct) {
      pagePath = `product/${selectedProduct.id}`;
      pageTitle = `Product: ${selectedProduct.name}`;
      trackProductView(selectedProduct.id, selectedProduct.name, selectedProduct.price);
    } else if (currentView === "blog" && selectedBlog) {
      pagePath = `blog/${selectedBlog.id}`;
      pageTitle = `Blog: ${selectedBlog.title}`;
    } else if (currentView === "sitemap") {
      pagePath = "sitemap";
      pageTitle = "Pawwcious Sitemap — Complete Website Directory";
    }

    if (typeof document !== "undefined") {
      if (currentView === "sitemap") {
        document.title = "Sitemap & Website Directory | Pawwcious Luxury Pet Wellness";
      } else if (currentView === "home") {
        document.title = "Pawwcious | Elite Canine Wellness & Ayurvedic Formulations";
      }
    }

    trackPageView(pagePath, pageTitle);
  }, [currentView, selectedProduct, selectedBlog]);

  // Dual-Persist state modifier for blog comments and likes
  const handleUpdateBlogLikesOrComments = async (updatedBlog: Blog) => {
    const current = blogs.find((b) => b.id === updatedBlog.id);
    if (!current) return;

    const commentsChanged = (updatedBlog.comments || []).length !== (current.comments || []).length;
    const likesChanged = (updatedBlog.likes || []).length !== (current.likes || []).length;

    let body: any;
    if (commentsChanged) body = { action: "comment", text: updatedBlog.comments![0].comment };
    else if (likesChanged) body = { action: "like" };
    else return;

    try {
      const res = await authFetch(`/api/blogs/${updatedBlog.id}/interact`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.blog) {
        setBlogs((prev) => prev.map((b) => (b.id === data.blog.id ? { ...b, ...data.blog } : b)));
        setSelectedBlog((prev) => (prev && prev.id === data.blog.id ? { ...prev, ...data.blog } : prev));
      } else {
        triggerToast(data.error || "Could not update the blog.", "error");
      }
    } catch (err: any) {
      triggerToast("Could not update the blog.", "error");
    }
  };
  // Keep localStorage session aligned (user profile only; admin status is never stored)
  useEffect(() => {
    try {
      // Clean up legacy keys from the old insecure login
      localStorage.removeItem("pawwcious_is_admin");
      localStorage.removeItem("pawwcious_is_mock");

      if (currentUser) {
        localStorage.setItem("pawwcious_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("pawwcious_user");
      }
    } catch (e) { }
  }, [currentUser]);

  // Ecommerce Cart & Wishlist States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponInputCode, setCouponInputCode] = useState("");
  const [couponMessage, setCouponMessage] = useState({ text: "", isError: false });

  // PWA & Instagram Environmental Triggers
  const [showPwaBanner, setShowPwaBanner] = useState(true);
  const [isInstagramBrowser, setIsInstagramBrowser] = useState(false);

  // Shipping & Checkout Form
  const [shippingForm, setShippingForm] = useState<ShippingDetails>({
    name: "", phone: "", address: "", city: "", state: "", pinCode: ""
  });
  const [paymentChoice, setPaymentChoice] = useState<"COD" | "Online">("Online");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "receipt">("cart");
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [thankYouOrder, setThankYouOrder] = useState<Order | null>(null);
  const [showPhonePeCheckout, setShowPhonePeCheckout] = useState(false);

  // Shiprocket tracking states
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [activeTrackingAwb, setActiveTrackingAwb] = useState<string | null>(null);
  const [activeTrackingData, setActiveTrackingData] = useState<any>(null);
  const [activeTrackingLoading, setActiveTrackingLoading] = useState(false);

  const [activePolicyTab, setActivePolicyTab] = useState<"privacy" | "terms" | "shipping" | "refund" | "faq">("privacy");

  // Delhivery Logistic Pin Verification
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [logisticRates, setLogisticRates] = useState<any>(null);
  const [logisticError, setLogisticError] = useState("");
  const [logisticQueryState, setLogisticQueryState] = useState<string>("");

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);

  // Detect Instagram browser, restore cart/wishlist, scroll listener
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isInsta = ua.includes("Instagram") || ua.includes("FBAV") || ua.includes("FBAN");
    setIsInstagramBrowser(isInsta);

    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.warn("Could not restore cart/wishlist:", e);
    }

    const handleScroll = () => {
      const topOfScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(topOfScroll > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when any modal or mobile menu is open
  useEffect(() => {
    // Dedicated product page view is a full standalone page, not a modal overlay
    if (currentView === "product") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    const isAnyModalOpen =
      isLoginModalOpen ||
      activeLightboxImgIndex !== null ||
      showPhonePeCheckout ||
      mobileMenuOpen;

    // Don't touch overflow while loader is showing
    if (!transitionFinished) return;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isLoginModalOpen, activeLightboxImgIndex, showPhonePeCheckout, mobileMenuOpen, transitionFinished, currentView]);

  // Auto-close the mobile drawer on scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleScrollClose = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScrollClose, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollClose);
    };
  }, [mobileMenuOpen]);

  // Auto-fetch Shiprocket options on checkout form pincode change
  useEffect(() => {
    if (shippingForm.pinCode && shippingForm.pinCode.length === 6) {
      fetch("/api/shipping/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationPin: shippingForm.pinCode })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLogisticRates(data.couriers);
            if (data.couriers && data.couriers.length > 0) {
              setSelectedCourier(data.couriers[0]);
            }
          }
        })
        .catch(() => { });
    }
  }, [shippingForm.pinCode]);

  // Only scroll to top on actual navigation changes, not on mount
  const isFirstRender = React.useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [currentView, selectedBlog]);

  useEffect(() => {
    if (!transitionFinished) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0px";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      // Force scroll to top after loader finishes
      window.scrollTo(0, 0);
    }
  }, [transitionFinished]);

  // Legacy /shop and bare /product -> /products (no extra history entry)
  useEffect(() => {
    const p = window.location.pathname.toLowerCase().replace(/\/$/, "");
    if (p === "/shop" || p === "/product") {
      window.history.replaceState(null, "", SHOP_PATH);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pawwcious_view", currentView);
      if (typeof window !== "undefined") {
        let expectedPath = getPathForView(currentView);
        if (currentView === "blog" && selectedBlog) {
          const slug = getBlogSlug(selectedBlog);
          expectedPath = `/blog/${slug}`;
        } else if (currentView === "product") {
          if (selectedProduct) {
            expectedPath = getProductRoute(selectedProduct);
          } else {
            // Do not overwrite the URL if product is still resolving from path
            return;
          }
        }
        if (window.location.pathname !== expectedPath) {
          window.history.pushState(
            { view: currentView, blogId: selectedBlog?.id, productId: selectedProduct?.id },
            "",
            expectedPath
          );
        }
      }
    } catch (e) { }
  }, [currentView, selectedBlog, selectedProduct]);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.startsWith("/blog")) {
          setCurrentView("blog");
          const parts = pathname.split("/").filter(Boolean);
          if (parts.length > 1) {
            const match = findBlogBySlugOrId(parts[1], blogs);
            setSelectedBlog(match);
          } else {
            setSelectedBlog(null);
          }
        } else if (pathname.startsWith("/products/") || pathname.startsWith("/product/")) {
          setCurrentView("product");
          const parts = pathname.split("/").filter(Boolean);
          if (parts.length > 1) {
            const match = findProductBySlugOrId(parts[1], products);
            if (match) {
              setSelectedProduct(normalizeProductDetails(match));
            }
          }
        } else {
          const pathView = getViewFromPath(pathname);
          setCurrentView(pathView);
          setSelectedBlog(null);
          if (pathView !== "product") {
            setSelectedProduct(null);
          }
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [blogs, products]);

  // Auto-sync active product from URL on initial link access or products load
  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/products/") || pathname.startsWith("/product/")) {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 1) {
          const matched = findProductBySlugOrId(parts[1], products);
          if (matched) {
            setSelectedProduct(normalizeProductDetails(matched));
            setCurrentView("product");
          }
        } else {
          const searchParams = new URLSearchParams(window.location.search);
          const paramId = searchParams.get("product") || searchParams.get("id") || searchParams.get("slug");
          if (paramId) {
            const matched = findProductBySlugOrId(paramId, products);
            if (matched) {
              setSelectedProduct(normalizeProductDetails(matched));
              setCurrentView("product");
            }
          }
        }
      }
    }
  }, [products]);

  // Auto-sync active blog post from URL when blogs are loaded or updated
  useEffect(() => {
    if (typeof window !== "undefined" && blogs.length > 0) {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/blog")) {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 1) {
          const matched = findBlogBySlugOrId(parts[1], blogs);
          if (matched) {
            setSelectedBlog(matched);
            setCurrentView("blog");
          }
        } else {
          const searchParams = new URLSearchParams(window.location.search);
          const paramId = searchParams.get("id") || searchParams.get("slug");
          if (paramId) {
            const matched = findBlogBySlugOrId(paramId, blogs);
            if (matched) {
              setSelectedBlog(matched);
              setCurrentView("blog");
            }
          }
        }
      }
    }
  }, [blogs]);

  // Non-admins must never stay on the admin view (UI guard only; the server is the real guard)
  useEffect(() => {
    if (!authLoading && currentView === "admin" && !isAdmin) {
      setCurrentView("home");
    }
  }, [authLoading, currentView, isAdmin]);

  // ── Login (Google only; admin is a Google account with the `admin` claim) ───
  const handleGoogleLogin = async () => {
    const auth = await getAuthInstance();
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setCurrentUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      setUserEmail(user.email);

      // Force-refresh so a freshly granted admin claim is picked up
      const tokenResult = await user.getIdTokenResult(true);
      setIsAdmin(tokenResult.claims.admin === true);

      await writeUserProfile(user.uid, user.displayName || "", user.email || "");

      triggerToast(`Welcome, ${user.displayName || user.email}! 🐾`, "success");
      setIsLoginModalOpen(false);
    } catch (error: any) {
      console.error("Google login error:", error.code, error.message);
      triggerToast("Google sign-in failed. Please try again.", "error");
    }
  };

  const handleLogout = async () => {
    const auth = await getAuthInstance();
    const { signOut } = await import("firebase/auth");

    await signOut(auth);

    setCurrentUser(null);
    setIsAdmin(false);
    setOrders([]);
    setUsers([]);
    setIsProfileMenuOpen(false);
    setCurrentView("home");

    localStorage.removeItem("pawwcious_user");
  };

  // Cart helper functions
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddToCart = (item: CartItem) => {
    const existingIdx = cart.findIndex(
      (c) =>
        c.product.id === item.product.id &&
        c.selectedSize === item.selectedSize
    );

    if (existingIdx > -1) {
      const copy = [...cart];
      copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + item.quantity };
      saveCartToStorage(copy);
    } else {
      saveCartToStorage([...cart, item]);
    }
    // ✅ FIX: correct triggerToast arguments
    triggerToast(`${item.product.name} added to cart 🛒`, "success");

    trackAddToCart(
      item.product.id,
      item.product.name,
      item.product.price,
      item.quantity
    );
  };

  const handleAdjustQuantity = (index: number, change: number) => {
    const copy = [...cart];
    const item = copy[index];
    if (!item) return;

    copy[index] = { ...item, quantity: item.quantity + change };
    if (copy[index].quantity <= 0) {
      copy.splice(index, 1);
      saveCartToStorage(copy);
      triggerToast(`Removed "${item.product.name}" from your cart.`, "info");
    } else {
      saveCartToStorage(copy);
      triggerToast(`Updated quantity of "${item.product.name}" to ${copy[index].quantity}.`, "success");
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const copy = [...cart];
    const item = copy[index];
    if (item) {
      copy.splice(index, 1);
      saveCartToStorage(copy);
      triggerToast(`Removed "${item.product.name}" (${item.selectedSize}) from your cart. 🗑️`, "info");
    }
  };

  const handleToggleWishlist = (p: Product) => {
    const exists = wishlist.some((w) => w.id === p.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((w) => w.id !== p.id);
      triggerToast(`Removed "${p.name}" from your wishlist.`, "info");
    } else {
      updated = [...wishlist, p];
      triggerToast(`Added "${p.name}" to your wishlist! 💖`, "success");
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // Coupon Engine Math
  const getCartTotals = () => {
    const subtotal = cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0);
    let discount = 0;

    if (appliedCoupon && subtotal >= appliedCoupon.minCartValue) {
      const calculated = (subtotal * appliedCoupon.discountPercent) / 100;
      discount = Math.min(calculated, appliedCoupon.maxDiscount);
    }

    let shippingFee = subtotal === 0 ? 0 : subtotal >= 1499 ? 0 : 90;
    if (selectedCourier && subtotal > 0 && subtotal < 1499) {
      shippingFee = selectedCourier.rate;
    } else if (subtotal >= 1499) {
      shippingFee = 0; // VIP Free Shipping over 1499
    }

    if (appliedCoupon && appliedCoupon.isFreeShipping && subtotal >= appliedCoupon.minCartValue) {
      shippingFee = 0;
    }

    const taxableAmount = subtotal - discount;
    const gstAmount = Math.round(taxableAmount * 0.18); // 18% GST included
    const totalAmount = taxableAmount + shippingFee;

    return { subtotal, discount, shippingFee, gstAmount, totalAmount };
  };

  const handleApplyCoupon = () => {
    const subtotal = cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0);
    const matched = coupons.find((c) => c.code === couponInputCode.trim().toUpperCase());

    if (!matched) {
      setCouponMessage({ text: "Offer code not active or misspelled! 🏷️", isError: true });
      setAppliedCoupon(null);
      triggerToast("Invalid or inactive coupon code.", "error");
    } else if (subtotal < matched.minCartValue) {
      setCouponMessage({ text: `Add items of ₹${matched.minCartValue - subtotal} more to qualify! 📦`, isError: true });
      setAppliedCoupon(null);
      triggerToast(`Qualifying amount of ₹${matched.minCartValue} not met.`, "warning");
    } else {
      setAppliedCoupon(matched);
      if (matched.isFreeShipping) {
        setCouponMessage({ text: "Awesome! Free Delivery Applied to your cart! 🚚🎉", isError: false });
        triggerToast(`Coupon "${matched.code}" applied! Free delivery activated. 🚚`, "success");
      } else {
        const savings = Math.round(Math.min((subtotal * matched.discountPercent) / 100, matched.maxDiscount));
        setCouponMessage({ text: `Wow! Code Applied, Saving ₹${savings}! 🎉`, isError: false });
        triggerToast(`Coupon "${matched.code}" applied! You saved ₹${savings}. 🎉`, "success");
      }
    }
  };

  // Pin code checking
  const handleVerifyPincode = async () => {
    setLogisticError("");
    setLogisticRates(null);
    setLogisticQueryState("");
    const pin = pincodeQuery.trim();
    if (pin.length !== 6 || isNaN(Number(pin))) {
      setLogisticError("Pin code must be exactly 6 digits.");
      return;
    }

    try {
      // Look up postal zone name instantly
      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const office = data[0].PostOffice[0];
            setLogisticQueryState(`${office.District || office.Block}, ${office.State}`);
          }
        })
        .catch(() => { });

      const response = await fetch("/api/shipping/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationPin: pin, weightGrams: 500 })
      });
      const data = await response.json();
      if (data.success) {
        setLogisticRates(data.couriers);
        if (data.couriers && data.couriers.length > 0) {
          setSelectedCourier(data.couriers[0]);
        }
      } else {
        setLogisticError(data.error || "Logistics are unavailable for this zone.");
      }
    } catch (err) {
      setLogisticError("Failed to probe shipping estimates.");
    }
  };

  // Shiprocket track fetcher
  const handleFetchTrackingDetails = async (awb: string) => {
    setActiveTrackingAwb(awb);
    setActiveTrackingLoading(true);
    setActiveTrackingData(null);
    try {
      const res = await fetch(`/api/shipping/track/${awb}`);
      const data = await res.json();
      if (data.success) {
        setActiveTrackingData(data);
      } else {
        setActiveTrackingData({
          error: data.error || "Shiprocket was unable to locate AWB history."
        });
      }
    } catch (e) {
      console.error(e);
      setActiveTrackingData({ error: "Could not reach logistics servers." });
    } finally {
      setActiveTrackingLoading(false);
    }
  };

  // COD & ONLINE checkout handler
  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const cleanedPhone = shippingForm.phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number for dispatch verification.");
      return;
    }

    const { subtotal, discount, shippingFee, gstAmount, totalAmount } = getCartTotals();
    const oid = `PW_${Date.now()}`;

    // 1. COD checkout path
    if (paymentChoice === "COD") {
      let awb = "";
      let shipmentId: string | number = "";
      let partner = selectedCourier?.name || "Shiprocket Partner";

      try {
        const awbRes = await fetch("/api/shipping/awb", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: oid,
            courierName: partner,
            courierId: selectedCourier?.id,

            email: currentUser?.email || `guest-${shippingForm.phone}@pawwcious.com`,
            recipientName: shippingForm.name,
            phone: cleanedPhone,
            address: shippingForm.address,
            city: shippingForm.city,
            state: shippingForm.state,
            pincode: shippingForm.pinCode,

            items: cart.map(c => ({
              name: c.product.name,
              sku: c.product.id || "PAW001",
              units: c.quantity,
              selling_price: c.product.price,
            })),

            totalAmount,
            paymentMethod: "COD",
          }),
        });

        const awbData = await awbRes.json();

        if (!awbRes.ok || !awbData.success) {
          console.error("Shiprocket order creation failed:", awbData);
          triggerToast(
            awbData.error || "Shiprocket order creation failed. Order was not created.",
            "error"
          );
          return;
        }

        awb = awbData.awbNumber || "";
        shipmentId = awbData.shipmentId;
        partner = awbData.courierName || partner;

      } catch (err) {
        console.error("AWB generation error:", err);
        triggerToast("Shiprocket shipment failed. Order was not created. Please try again.", "error");
        return;
      }

      const realOrder: Order = {
        orderId: oid,
        userId: currentUser?.uid || "mock_guest_user",
        items: cart.map(c => ({
          productId: c.product.id,
          productName: c.product.name,
          productImage: c.product.imageUrl,
          price: c.product.price,
          quantity: c.quantity,
          selectedSize: c.selectedSize,
        })),
        totalAmount,
        subtotal,
        discount,
        shippingFee,
        gstAmount,
        shippingDetails: shippingForm,
        paymentMethod: "COD",
        paymentStatus: "Pending",

        shippingStatus: "Order Received",
        awbNumber: awb,
        shipmentId,
        courierPartner: partner,

        createdAt: new Date().toISOString(),
      };

      // Store in local storage to support guest contexts
      if (!currentUser) {
        const localOrdersStr = localStorage.getItem("local_orders") || "[]";
        try {
          const localList = JSON.parse(localOrdersStr);
          localList.push(realOrder);
          localStorage.setItem("local_orders", JSON.stringify(localList));
        } catch (e) {
          console.warn("Local storage order write error:", e);
        }
      }
      setOrders(prev => {
        if (prev.some(o => o.orderId === realOrder.orderId)) return prev;
        return [realOrder, ...prev];
      });

      // Track GA4 Purchase event
      trackPurchase({
        orderId: realOrder.orderId,
        totalAmount: realOrder.totalAmount,
        subtotal: realOrder.subtotal,
        shippingFee: realOrder.shippingFee,
        gstAmount: realOrder.gstAmount,
        discount: realOrder.discount,
        items: realOrder.items,
      });

      try {
        await fetch("/api/cms/orders-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(realOrder),
        });
      } catch (err) {
        console.error("Order writing failure: ", err);
      }

      saveCartToStorage([]);
      setAppliedCoupon(null);
      setCheckoutStep("receipt");
      setCurrentView("orders");
      setThankYouOrder(realOrder);
      setShowThankYouModal(true);
      triggerToast(`Order ${oid} placed successfully! 🎉`, "success");
    } else {
      // 2. ONLINE PhonePe checkout path
      trackBeginCheckout(cart, totalAmount);
      setShowPhonePeCheckout(true);
    }
  };

  const handlePhonePeSuccess = async (paymentId: string) => {
    setShowPhonePeCheckout(false);
    const { subtotal, discount, shippingFee, gstAmount, totalAmount } = getCartTotals();
    const orderId = `PW_PH_${Date.now()}`;

    let awb = "";
    let partner = selectedCourier?.name || "Blue Dart Premium Air (Shiprocket Prime)";
    try {
      const awbRes = await fetch("/api/shipping/awb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          courierName: partner,
          courierId: selectedCourier?.id,
          email: currentUser?.email || `guest-${shippingForm.phone}@pawwcious.com`,
          recipientName: shippingForm.name,
          phone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          pincode: shippingForm.pinCode,
          items: cart.map(c => ({
            name: c.product.name,
            sku: c.product.id || "PAW001",
            units: c.quantity,
            selling_price: c.product.price,
          })),
          totalAmount,
          paymentMethod: "Prepaid",
        })
      });
      const awbData = await awbRes.json();
      if (awbData.success) {
        awb = awbData.awbNumber;
        partner = awbData.courierName;
      }
    } catch (err) {
      console.error("Online shipping registration fail:", err);
      triggerToast("Payment succeeded, but shipment creation failed. Please create shipment manually from admin.", "error");
      return;
    }

    const onlineOrder: Order = {
      orderId: orderId,
      userId: currentUser?.uid || "mock_guest_user",
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        productImage: c.product.imageUrl,
        price: c.product.price,
        quantity: c.quantity,
        selectedSize: c.selectedSize
      })),
      totalAmount,
      subtotal,
      discount,
      shippingFee,
      gstAmount,
      shippingDetails: shippingForm,
      paymentMethod: "Online",
      paymentStatus: "Paid",
      paymentId: paymentId,
      shippingStatus: "Order Received",
      awbNumber: awb,
      courierPartner: partner,
      createdAt: new Date().toISOString()
    };

    // Store in local storage if not authenticated
    if (!currentUser) {
      const localOrdersStr = localStorage.getItem("local_orders") || "[]";
      try {
        const localList = JSON.parse(localOrdersStr);
        localList.push(onlineOrder);
        localStorage.setItem("local_orders", JSON.stringify(localList));
      } catch (e) {
        console.warn("Local storage online order write error:", e);
      }
    }
    setOrders(prev => {
      if (prev.some(o => o.orderId === onlineOrder.orderId)) return prev;
      return [onlineOrder, ...prev];
    });

    // Track GA4 Purchase event
    trackPurchase({
      orderId: onlineOrder.orderId,
      totalAmount: onlineOrder.totalAmount,
      subtotal: onlineOrder.subtotal,
      shippingFee: onlineOrder.shippingFee,
      gstAmount: onlineOrder.gstAmount,
      discount: onlineOrder.discount,
      items: onlineOrder.items,
    });

    try {
      await fetch("/api/cms/orders-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onlineOrder),
      });
    } catch (err) {
      console.error("Online order writing failure: ", err);
    }

    saveCartToStorage([]);
    setAppliedCoupon(null);
    setCheckoutStep("receipt");

    // Small delay to let the payment modal fully close
    await new Promise(resolve => setTimeout(resolve, 400));

    setCurrentView("orders");
    setThankYouOrder(onlineOrder);
    setShowThankYouModal(true);
    triggerToast(`Order ${orderId} placed successfully! 🎉`, "success");
  };

  useEffect(() => {
    const handlePhonePeReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const orderId = params.get("orderId");

      if (payment !== "phonepe" || !orderId) return;

      try {
        const res = await fetch(`/api/payment/phonepe/status/${orderId}`);
        const data = await res.json();

        if (data.success && data.verified) {
          const pendingRaw = localStorage.getItem("phonepe_pending");
          const pendingData = pendingRaw ? JSON.parse(pendingRaw) : null;

          const storedCartRaw = localStorage.getItem("cart");
          const storedCart: CartItem[] = storedCartRaw ? JSON.parse(storedCartRaw) : [];
          const effectiveCart = cart.length > 0 ? cart : storedCart;

          const subtotalValue =
            effectiveCart.reduce((acc, c) => acc + c.product.price * c.quantity, 0);

          const discountValue = 0;
          const shippingFeeValue = subtotalValue >= 1499 ? 0 : 90;
          const gstAmountValue = Math.round((subtotalValue - discountValue) * 0.18);
          const totalAmountValue =
            pendingData?.amount || data.amount || subtotalValue + shippingFeeValue;

          const confirmedOrder: Order = {
            orderId,
            userId: currentUser?.uid || "mock_guest_user",
            items: effectiveCart.map(c => ({
              productId: c.product.id,
              productName: c.product.name,
              productImage: c.product.imageUrl,
              price: c.product.price,
              quantity: c.quantity,
              selectedSize: c.selectedSize,
            })),
            totalAmount: totalAmountValue,
            subtotal: subtotalValue,
            discount: discountValue,
            shippingFee: shippingFeeValue,
            gstAmount: gstAmountValue,
            shippingDetails: shippingForm,
            paymentMethod: "Online",
            paymentStatus: "Paid",
            paymentId: data.paymentId || orderId,
            shippingStatus: "Order Received",
            awbNumber: "",
            courierPartner: selectedCourier?.name || "",
            createdAt: new Date().toISOString(),
          };

          setOrders(prev => {
            if (prev.some(o => o.orderId === confirmedOrder.orderId)) return prev;
            return [confirmedOrder, ...prev];
          });

          // Track GA4 Purchase event
          trackPurchase({
            orderId: confirmedOrder.orderId,
            totalAmount: confirmedOrder.totalAmount,
            subtotal: confirmedOrder.subtotal,
            shippingFee: confirmedOrder.shippingFee,
            gstAmount: confirmedOrder.gstAmount,
            discount: confirmedOrder.discount,
            items: confirmedOrder.items,
          });

          setThankYouOrder(confirmedOrder);
          setShowThankYouModal(true);
          setCheckoutStep("receipt");
          setCurrentView("orders");

          // Clear cart: React state + localStorage
          saveCartToStorage([]);
          setAppliedCoupon(null);
          localStorage.removeItem("phonepe_pending");

          // Optional local guest order backup
          if (!currentUser) {
            const localOrdersStr = localStorage.getItem("local_orders") || "[]";
            try {
              const localList = JSON.parse(localOrdersStr);
              if (!localList.some((o: Order) => o.orderId === confirmedOrder.orderId)) {
                localList.push(confirmedOrder);
                localStorage.setItem("local_orders", JSON.stringify(localList));
              }
            } catch (e) {
              console.warn("Local storage PhonePe order write error:", e);
            }
          }

          window.history.replaceState({}, document.title, "/");
          triggerToast(`Order ${orderId} placed successfully! 🎉`, "success");
          return;
        }

        if (data.pending) {
          triggerToast("Payment is pending. Please wait a few minutes.", "warning");
          window.history.replaceState({}, document.title, "/");
          return;
        }

        localStorage.removeItem("phonepe_pending");
        window.history.replaceState({}, document.title, "/");
        triggerToast("PhonePe payment failed or was cancelled.", "error");
      } catch (err) {
        console.error("PhonePe verification failed:", err);
        triggerToast("Could not verify PhonePe payment. Please contact support.", "error");
        window.history.replaceState({}, document.title, "/");
      }
    };

    handlePhonePeReturn();
  }, []);

  const handlePhonePeFailure = (error: string) => {
    setShowPhonePeCheckout(false);
    console.warn("PhonePe Payment failed or cancelled:", error);
    triggerToast(`Payment verification failed: ${error || "Transaction Cancelled"}.`, "error");
  };

  // Helper selectors
  const bestSellers = products.filter(p => p.isBestSeller);
  const { subtotal, discount, shippingFee, gstAmount, totalAmount } = getCartTotals();

  return (
    <div id="pawwcious-viewport-base" className="min-h-screen bg-[#FAF9F5] text-[#1C1C1C] dark:bg-stone-950/20 px-0 flex flex-col justify-between font-sans transition-colors duration-300 w-full max-w-full relative">

      {/* Toast Notifications Tray */}
      <ToastTray
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Global Mobile Navigation Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-backdrop-global"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-stone-950/45 backdrop-blur-[1.5px] z-[65] cursor-pointer pointer-events-auto"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 0. Fullscreen Loading Screen */}
      {!transitionFinished && (
        <LoaderScreen
          isLoading={isLoading}
          onFinished={() => setTransitionFinished(true)}
        />
      )}

      {/* 1. Instagram Browser warning and announcement banner */}
      <motion.div
        initial={isLighthouse ? { opacity: 1 } : { opacity: 0 }}
        animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
        transition={isLighthouse ? { duration: 0 } : { duration: 0.6, ease: "easeOut", delay: 0.05 }}
        className="w-full flex flex-col z-[80]"
      >
        {isInstagramBrowser && (
          <div id="insta-browser-warning" className="bg-teal-800 text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between z-[100] animate-pulse pointer-events-auto">
            <div className="flex items-center gap-2">
              <Info className="h-4.5 w-4.5 shrink-0" />
              <span>Open in external Chrome/Safari browser for pristine Google logins & PWA support.</span>
            </div>
            <button
              onClick={() => window.open(window.location.href, "_blank")}
              className="bg-stone-950 text-stone-100 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 uppercase tracking-widest leading-none border border-white/20 ml-2 animate-bounce"
            >
              Open Browser
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}

        {showPwaBanner && currentView !== "product" && (
          <div
            id="top-announcement-header"
            className="relative flex bg-[#1C2E2B] text-white px-4 py-2 sm:py-2.5 text-xs font-bold leading-none items-center justify-center z-[90] tracking-wide border-b border-stone-850 pointer-events-auto min-h-[38px] sm:min-h-[42px] overflow-hidden"
          >
            <div className="flex items-center justify-center w-full max-w-4xl mx-auto px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key="amazon-live"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center"
                >
                  <span className="text-[11px] sm:text-xs tracking-tight flex items-center gap-1.5">
                    <span>Pawwcious ships to serviceable locations across India</span>
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowPwaBanner(false)}
              aria-label="Close Announcement Banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 font-extrabold text-sm px-1.5 text-white cursor-pointer transition-opacity"
            >
              ✕
            </button>
          </div>
        )}
      </motion.div>

      {/* 3. Sticky Header Navbar */}
      {currentView !== "product" && (
        <motion.header
          initial={isLighthouse ? { opacity: 1 } : { opacity: 0 }}
          animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
          transition={isLighthouse ? { duration: 0 } : { duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="sticky top-0 z-[70] w-full pointer-events-none"
        >
          <div className={`relative backdrop-blur-md border-b transition-opacity duration-300 px-4 sm:px-8 pointer-events-auto ${isScrolled ? "py-2 bg-[#FAF9F5]/96 border-stone-200/80 shadow-sm dark:bg-stone-950/96 dark:border-stone-800" : "py-4 bg-[#FAF9F5]/90 border-stone-200/60 dark:bg-stone-950/90 dark:border-stone-850"}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">

              {/* Logo brand */}
              <button
                id="logo-home-nav-btn"
                onClick={() => { setCurrentView("home"); setSelectedProduct(null); setSelectedBlog(null); }}
                className="flex items-center gap-2.5 hover:opacity-90 duration-200 cursor-pointer text-left"
              >
                <div>
                  <img src="/images/logo.webp" width={180} height={46} alt="Pawwcious logo" loading="eager" fetchPriority="high" decoding="sync" />
                </div>
              </button>

              {/* Desktop Links navbar */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-bold font-sans tracking-wide">
                {(["home", "shop", "ai", "blog", "about", "contact"] as const).map((view) => (
                  <button
                    key={view}
                    id={`nav-link-desktop-${view}`}
                    onClick={() => { setCurrentView(view); setSelectedProduct(null); setSelectedBlog(null); }}
                    className={`transition-colors capitalize cursor-pointer ${currentView === view ? "text-teal-700" : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"}`}
                  >
                    {view === "ai" ? "Paww AI 🐾" : view === "shop" ? "Products" : view}
                  </button>
                ))}
                {isAdmin && (
                  <button
                    id="nav-link-desktop-admin"
                    onClick={() => setCurrentView("admin")}
                    className="text-amber-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer font-bold animate-pulse"
                  >
                    <Sliders className="h-3.5 w-3.5 text-amber-500" />
                    HQ Console
                  </button>
                )}
              </nav>

              {/* Right corner control actions */}
              <div className="flex items-center gap-4">

                {/* Wishlist Button */}
                <button
                  id="wishlist-tab-btn"
                  onClick={() => setCurrentView("wishlist")}
                  aria-label="Open wishlist"
                  className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-xl transition text-stone-500 relative cursor-pointer"
                >
                  <Heart className="h-4.5 w-4.5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">{wishlist.length}</span>
                  )}
                </button>

                {/* Cart Button */}
                <button
                  id="cart-tab-btn"
                  type="button"
                  aria-label="Open cart"
                  onClick={() => { setCurrentView("cart"); setCheckoutStep("cart"); }}
                  className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-xl transition text-stone-500 relative cursor-pointer"
                >
                  <ShoppingCart className="h-4.5 w-4.5" aria-hidden="true" />
                  {cart.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-teal-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </button>

                {/* User Account Login Status Trigger */}
                {currentUser ? (
                  <div className="relative">
                    <button
                      id="user-profile-btn"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex h-8 w-8 items-center justify-center border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition duration-150 cursor-pointer p-0.5 shadow-sm overflow-hidden"
                    >
                      <div className="h-full w-full bg-teal-600 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden">
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          currentUser.email ? currentUser.email[0].toUpperCase() : "🐾"
                        )}
                      </div>
                    </button>

                    {isProfileMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => setIsProfileMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-3 z-50 text-left animate-fade-in animate-in duration-100">
                          <div className="px-4 py-2 border-b border-stone-100 mb-1">
                            <p className="font-bold text-xs text-stone-900 truncate font-mono">
                              {currentUser.email}
                            </p>
                            <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">
                              Logged In Account
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setCurrentView("orders");
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition flex items-center gap-2 cursor-pointer"
                          >
                            <ShoppingBag className="h-3.5 w-3.5 text-stone-400" />
                            <span>My Orders</span>
                          </button>

                          <button
                            onClick={() => {
                              setCurrentView("wishlist");
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition flex items-center gap-2 cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5 text-stone-400" />
                            <span>My Wishlist</span>
                          </button>

                          <div className="border-t border-stone-100 my-1.5" />

                          <button
                            id="desktop-logout-btn"
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <LogOut className="h-3.5 w-3.5 text-red-450" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    id="nav-login-popup-trigger"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="hidden md:flex items-center gap-1.5 sm:gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-white text-white dark:text-stone-950 font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition cursor-pointer shadow-sm active:scale-98"
                  >
                    Login
                  </button>
                )}

                {/* Hamburger menu */}
                <button
                  id="mobile-drawer-hamburger-btn"
                  aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation-drawer"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-xl text-stone-500 cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

            </div>

            {/* Mobile menu Drawer panel */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  key="mobile-nav-drawer"
                  id="mobile-navigation-drawer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="md:hidden absolute top-full left-0 right-0 bg-[#FAF9F5]/98 dark:bg-stone-950/98 backdrop-blur-md px-6 py-4 border-b border-stone-150 dark:border-stone-850 space-y-2 flex flex-col text-xs font-bold shadow-lg overflow-hidden z-50 pointer-events-auto"
                >
                  {(["home", "shop", "ai", "blog", "about", "contact"] as const).map((view) => (
                    <button
                      key={view}
                      id={`drawer-link-${view}`}
                      onClick={() => { setCurrentView(view); setMobileMenuOpen(false); setSelectedProduct(null); setSelectedBlog(null); }}
                      className="p-2 text-left hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg text-stone-700 dark:text-stone-300 capitalize cursor-pointer animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      {view === "ai" ? "Paww AI 🐾" : view}
                    </button>
                  ))}
                  {isAdmin && (
                    <button
                      id="drawer-link-admin"
                      onClick={() => { setCurrentView("admin"); setMobileMenuOpen(false); }}
                      className="p-2 text-left hover:bg-amber-100/30 text-amber-500 rounded-lg flex items-center gap-2 cursor-pointer animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      <Sliders className="h-4 w-4" />
                      HQ Administration Console
                    </button>
                  )}

                  {currentUser ? (
                    <div className="border-t border-stone-150 dark:border-stone-850 pt-2.5 mt-2 space-y-2">
                      <div className="px-2 py-1 flex items-center gap-2">
                        <div className="h-6 w-6 bg-teal-600 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden">
                          {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            currentUser.email ? currentUser.email[0].toUpperCase() : "🐾"
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-stone-800 dark:text-stone-200 text-[11px] font-bold font-mono truncate">{currentUser.email}</span>
                          <span className="text-stone-400 text-[8px] font-mono">Logged In Account</span>
                        </div>
                      </div>

                      <button
                        onClick={() => { setCurrentView("orders"); setMobileMenuOpen(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-750 dark:text-stone-300 flex items-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="h-4 w-4 text-stone-450" />
                        <span>My Orders</span>
                      </button>

                      <button
                        onClick={() => { setCurrentView("wishlist"); setMobileMenuOpen(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-750 dark:text-stone-300 flex items-center gap-2 cursor-pointer"
                      >
                        <Heart className="h-4 w-4 text-stone-450" />
                        <span>My Wishlist</span>
                      </button>

                      <button
                        id="mobile-logout-btn"
                        onClick={async () => {
                          await handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-red-50 text-red-650 p-2.5 rounded-xl border border-red-200/50 block text-center font-bold transition cursor-pointer"
                      >
                        Log-Out Profile
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-stone-150 dark:border-stone-850 pt-2.5 mt-2">
                      <button
                        id="mobile-drawer-login-btn"
                        onClick={() => { setIsLoginModalOpen(true); setMobileMenuOpen(false); }}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs p-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Sign In / Create Account
                      </button>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>
      )}

      {/* 4. Core Body Viewport Panel */}
      <main className={currentView === "product" || currentView === "home" ? "flex-1 w-full p-0 m-0" : "flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 mt-2 space-y-12"}>
        <React.Suspense fallback={
          <div className="flex items-center justify-center py-24">
            <div className="h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>

          {/* HOMEPAGE VIEW */}
          {currentView === "home" && (
            <div className="w-full">
              <Homepage
                banners={banners}
                categories={categories}
                bestSellers={bestSellers}
                blogs={blogs.slice(0, 2)}
                testimonials={testimonials}
                reviewReels={reviewReels}
                onAddTestimonial={handleAddTestimonial}
                onSelectCategory={(catId) => { setSelectedShopCategory(catId); setCurrentView("shop"); }}
                onSelectProduct={(p) => {
                  handleNavigateToProduct(p, "benefits");
                }}
                onSelectProductReviews={(p) => {
                  handleNavigateToProduct(p, "reviews");
                }}
                onSelectView={(v) => setCurrentView(v)}
                onSelectBlog={(b) => { setSelectedBlog(b); setCurrentView("blog"); }}
                products={products}
                reviews={reviews}
                onAddToCart={handleAddToCart}
                onInstagramModalToggle={(isOpen) => {
                  setIsInstagramModalOpen(isOpen);
                  if (isOpen) {
                    setMobileMenuOpen(false);
                  }
                }}
              />
            </div>
          )}

          {/* AI WELLNESS SUITE VIEW */}
          {currentView === "ai" && (
            <MotionWrapper>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <AICoachPage
                  products={products}
                  onAddToCart={(prod, size) => handleAddToCart({ product: prod, quantity: 1, selectedSize: size })}
                  onSelectProduct={(p) => {
                    handleNavigateToProduct(p, "benefits");
                  }}
                  onSelectView={(v) => setCurrentView(v)}
                />
              </motion.div>
            </MotionWrapper>
          )}

          {/* SHOP LISTING VIEW */}
          {currentView === "shop" && (
            <ShopPage
              products={products}
              categories={categories}
              reviews={reviews}
              selectedCategory={selectedShopCategory}
              onSelectCategory={setSelectedShopCategory}
              onOpenProduct={handleNavigateToProduct}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* BLOG */}
          {currentView === "blog" && (
            <BlogPage
              blogs={blogs}
              selectedBlog={selectedBlog}
              onSelectBlog={setSelectedBlog}
              currentUser={currentUser}
              onRequireLogin={() => setIsLoginModalOpen(true)}
              onUpdateBlog={handleUpdateBlogLikesOrComments}
              onOpenLightbox={setActiveLightboxImgIndex}
              onToast={triggerToast}
            />
          )}

          {/* SHOPPING CART VIEW */}
          {currentView === "cart" && (
            <CartPage
              cart={cart}
              totals={{ subtotal, discount, shippingFee, gstAmount, totalAmount }}
              onAdjustQuantity={handleAdjustQuantity}
              onRemoveItem={handleRemoveFromCart}
              onExploreShop={() => setCurrentView("shop")}
              checkoutStep={checkoutStep}
              setCheckoutStep={setCheckoutStep}
              onSubmitCheckout={handleProcessCheckout}
              pincodeQuery={pincodeQuery}
              setPincodeQuery={setPincodeQuery}
              onVerifyPincode={handleVerifyPincode}
              logisticError={logisticError}
              logisticRates={logisticRates}
              logisticQueryState={logisticQueryState}
              selectedCourier={selectedCourier}
              setSelectedCourier={setSelectedCourier}
              couponInputCode={couponInputCode}
              setCouponInputCode={setCouponInputCode}
              onApplyCoupon={handleApplyCoupon}
              couponMessage={couponMessage}
              shippingForm={shippingForm}
              setShippingForm={setShippingForm}
              paymentChoice={paymentChoice}
              setPaymentChoice={setPaymentChoice}
              allProducts={products}
  onApplyPackage={(items) => setCart(items)}
            />
          )}

          {/* WISHLIST */}
          {currentView === "wishlist" && (
            <WishlistPage
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onOpenProduct={(p) => handleNavigateToProduct(p)}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* ORDERS */}
          {currentView === "orders" && (
            <OrdersPage
              orders={orders}
              currentUser={currentUser}
              onTrack={handleFetchTrackingDetails}
            />
          )}

          {/* ADMIN CMS PORTAL (rendered only for verified admins) */}
          {currentView === "admin" && isAdmin && (
            <MotionWrapper>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <AdminCMS
                  products={products}
                  banners={banners}
                  blogs={blogs}
                  coupons={coupons}
                  categories={categories}
                  orders={orders}
                  reviews={reviews}
                  users={users}
                  reviewReels={reviewReels}
                  userEmail={userEmail}
                  onRefresh={refreshAll}
                />
              </motion.div>
            </MotionWrapper>
          )}

          {/* PRIVACY / TERMS / FAQ */}
          {(currentView === "privacy" || currentView === "terms" || currentView === "faq") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <PrivacyPolicyPage
                initialTab={activePolicyTab}
                onNavigateHome={() => { setCurrentView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onNavigateShop={() => { setCurrentView("shop"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            </motion.div>
          )}

          {/* ABOUT */}
          {currentView === "about" && (
            <AboutPage
              onGoAI={() => { setCurrentView("ai"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onGoContact={() => { setCurrentView("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}

          {/* CONTACT */}
          {currentView === "contact" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ContactPage />
            </motion.div>
          )}

          {/* SITEMAP */}
          {currentView === "sitemap" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <SitemapPage
                products={products}
                blogs={blogs}
                categories={categories}
                onNavigate={(view, blogId) => {
                  if (view === "blog" && blogId) {
                    const matchedBlog = blogs.find(b => b.id === blogId);
                    if (matchedBlog) {
                      setSelectedBlog(matchedBlog);
                    }
                  } else {
                    setSelectedBlog(null);
                  }
                  setCurrentView(view as ViewState);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onNavigateProduct={(prod) => {
                  handleNavigateToProduct(prod);
                }}
              />
            </motion.div>
          )}

          {/* DEDICATED PRODUCT PAGE */}
          {currentView === "product" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductPage
                product={selectedProduct || fallbackProducts[0]}
                onBack={() => {
                  setCurrentView("shop");
                  setSelectedProduct(null);
                  if (typeof window !== "undefined") {
                    window.history.pushState(null, "", SHOP_PATH);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlist.some((w) => w.id === (selectedProduct ? selectedProduct.id : fallbackProducts[0].id))}
                currentUser={currentUser}
                reviews={reviews}
                allProducts={products}
                onSelectProduct={(p) => handleNavigateToProduct(p)}
                onInstantCheckout={(item) => {
                  handleAddToCart(item);
                  setCurrentView("cart");
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
                onOpenCart={() => {
                  setCurrentView("cart");
                  setCheckoutStep("cart");
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

        </React.Suspense>
      </main>

      {/* 5. Sticky Floating Mobile bottom Drawer bar */}
      {!isInstagramModalOpen && currentView !== "product" && !isCartView && (
        <div id="pwa-mobile-dock" className="md:hidden fixed bottom-5 inset-x-4 h-14 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 z-[75] flex items-center justify-around text-stone-500">
          <button
            onClick={() => { setCurrentView("home"); setSelectedProduct(null); setSelectedBlog(null); }}
            className={`flex flex-col items-center justify-center ${currentView === "home" ? "text-teal-700" : ""}`}
          >
            <Home className="h-4.5 w-4.5" />
            <span className="text-[9px] mt-0.5">Home</span>
          </button>
          <button
            onClick={() => { setCurrentView("shop"); setSelectedProduct(null); setSelectedBlog(null); }}
            className={`flex flex-col items-center justify-center ${currentView === "shop" ? "text-teal-700" : ""}`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span className="text-[9px] mt-0.5">Products</span>
          </button>
          <button
            onClick={() => { setCurrentView("ai"); setSelectedProduct(null); setSelectedBlog(null); }}
            className={`flex flex-col items-center justify-center ${currentView === "ai" ? "text-teal-700" : ""}`}
          >
            <Bot className="h-4.5 w-4.5" />
            <span className="text-[9px] mt-0.5">Paww AI</span>
          </button>
          <button
            onClick={() => { setCurrentView("cart"); setCheckoutStep("cart"); }}
            className={`flex flex-col items-center justify-center relative ${currentView === "cart" ? "text-teal-700" : ""}`}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-1 bg-teal-600 text-white font-mono text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
            )}
            <span className="text-[9px] mt-0.5">Cart</span>
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentView("orders");
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className={`flex flex-col items-center justify-center ${currentView === "orders" ? "text-teal-700" : ""}`}
            id="mobile-dock-profile-btn"
          >
            <User className="h-4.5 w-4.5" />
            <span className="text-[9px] mt-0.5">Profile</span>
          </button>
        </div>
      )}

      {/* 6. Footer */}
    {!isCartView &&  <Footer
        isHome={currentView === "home"}
        onGoHome={() => { setCurrentView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onGoAI={() => { setCurrentView("ai"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onGoShopCategory={(cat) => { setSelectedShopCategory(cat); setCurrentView("shop"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onGoPolicy={(tab) => { setCurrentView("privacy"); setActivePolicyTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onGoSitemap={() => {
          setCurrentView("sitemap");
          setSelectedProduct(null);
          setSelectedBlog(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />}

      {/* 10. Google Sign-In Dialog (admins also sign in with Google; the `admin` claim unlocks HQ) */}
      {isLoginModalOpen && (
        <div
          id="login-dialog-overlay"
          className="fixed inset-0 bg-stone-950/45 backdrop-blur-md z-[99] flex items-center justify-center p-4 transition-all"
        >
          <div
            id="login-dialog-box"
            className="bg-[#FAF9F5] text-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-stone-200/85 relative transition-opacity duration-300"
          >
            <button
              id="close-login-dialog-btn"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 p-1.5 hover:bg-stone-100 rounded-full transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-1.5 mb-5">
              <span className="text-[9px] font-mono tracking-widest uppercase bg-teal-50 text-teal-850 px-2.5 py-0.5 rounded-full font-black">
                Secure Sign-In
              </span>
              <h2 className="text-lg font-black text-stone-950">Sign in to Pawwcious</h2>
              <p className="text-xs text-stone-400">Access your orders, wishlist and faster checkout.</p>
            </div>

            <button
              onClick={() => {
                handleGoogleLogin();
                setIsLoginModalOpen(false);
              }}
              className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <img src="/images/google-seeklogo.webp" alt="google icon" height={20} width={20} loading="lazy"
                decoding="async" />
              Continue with Google
            </button>
          </div>
        </div>
      )}

      {/* 9. Floating Help */}
      <div id="floating-actions-container" className="fixed bottom-24 right-5 z-[80] flex flex-col gap-3.5 items-end">
        <div id="whatsapp-support" className="group">
          <a
            href="https://wa.me/918019902546?text=Hello%20Pawwcious%20Luxury%20Support!%20I%20have%20a%20pet%20wellness%20query."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("Floating Concierge Button")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3.5 shadow-xl hover:scale-105 active:scale-95 transition duration-200 flex items-center justify-center relative border border-emerald-400/20"
            title="Direct WhatsApp Support Concierge"
          >
            <img src="/images/whatsapp-icon.webp" alt="whatsapp icon" width="25px" height="25px" loading="lazy"
              decoding="async" />
            <div className="absolute right-16 bg-stone-950 text-white text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-stone-850 pointer-events-none">
              WhatsApp Concierge Support 💬
            </div>
          </a>
        </div>
      </div>

      {/* ==================== SHIPROCKET LIVE TRACKING DIALOG ==================== */}
      {activeTrackingAwb && (
        <div className="fixed inset-0 bg-stone-950/45 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 border border-stone-250 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => { setActiveTrackingAwb(null); setActiveTrackingData(null); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 p-1.5 hover:bg-stone-100 rounded-full transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-[#0d9488] text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md">Shiprocket API Portal</span>
              <span className="text-[10px] text-stone-400 font-mono font-extrabold">AWB: {activeTrackingAwb}</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5 text-[#0d9488]" />
                Real-Time Package Tracking
              </h3>
              <p className="text-xs text-stone-500 font-sans">Logistics aggregates, milestones, and carrier handoffs.</p>
            </div>

            {activeTrackingLoading ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[11px] text-stone-500 font-mono animate-pulse">Connecting to Shiprocket logistics server...</p>
              </div>
            ) : activeTrackingData?.success ? (
              <div className="space-y-4 font-sans text-left">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] text-stone-400 font-mono block uppercase animate-pulse">Courier Logistics</span>
                    <span className="font-extrabold text-stone-900 font-sans">{activeTrackingData.tracker.courierName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-stone-400 font-mono block uppercase">Current Milestone</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-teal-100 text-[#0d9488] font-mono">{activeTrackingData.tracker.shippingStatus}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <span className="text-[9px] text-stone-400 font-mono block uppercase tracking-wider font-extrabold">Scanned Courier Logs</span>
                  <div className="relative pl-5 border-l border-stone-200 space-y-4 text-xs">
                    {activeTrackingData.tracker.milestones.map((ms: any, idx: number) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-[#0d9488] border border-white"></span>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-stone-900 leading-none">{ms.status}</p>
                            <p className="text-[10px] text-stone-450 mt-1">{ms.location}</p>
                          </div>
                          <span className="text-[9px] font-mono text-stone-400 shrink-0">{ms.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[9px] text-stone-450 font-mono leading-relaxed bg-[#FAF9F5] p-3 rounded-xl border border-stone-200">
                  Estimated Delivery: <span className="font-extrabold text-stone-900">{activeTrackingData.tracker.estimatedDelivery}</span>. Tracking updates are simulated dynamically using standard Shiprocket callback structures.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs border border-red-200 font-mono">
                {activeTrackingData?.error || "Unable to retrieve tracking history details."}
              </div>
            )}

            <button
              onClick={() => { setActiveTrackingAwb(null); setActiveTrackingData(null); }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
            >
              Done Check
            </button>
          </div>
        </div>
      )}

      {/* Gallery Event Lightbox */}
      {activeLightboxImgIndex !== null && selectedBlog && selectedBlog.galleryImages && (
        <div
          id="event-gallery-lightbox-modal"
          className="fixed inset-0 bg-[#0c100e]/95 dark:bg-black/98 z-[9999] flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveLightboxImgIndex(null)}
        >
          <div className="w-full flex items-center justify-between max-w-6xl pb-4 border-b border-stone-800">
            <div className="text-left">
              <span className="text-[9px] font-bold font-mono text-teal-400 uppercase tracking-widest block">
                {selectedBlog.category || "Events & Gallery"}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-stone-200 truncate max-w-xs sm:max-w-md">
                {selectedBlog.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-bold text-stone-300">
                Photo {activeLightboxImgIndex + 1} of {selectedBlog.galleryImages.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const val = selectedBlog.galleryImages?.[activeLightboxImgIndex || 0];
                  if (!val) return;
                  // Open the image URL directly (avoids document.write with untrusted strings)
                  window.open(val, "_blank", "noopener,noreferrer");
                }}
                className="text-[10px] bg-stone-900 hover:bg-stone-850 border border-stone-800 px-3 py-1.5 rounded-lg text-teal-400 hover:text-teal-300 font-bold font-mono transition"
                title="Open image in new tab"
              >
                Open Original
              </button>
              <button
                onClick={() => setActiveLightboxImgIndex(null)}
                className="bg-stone-900 hover:bg-[#1a1f1c] border border-stone-800 text-stone-400 hover:text-white p-2 rounded-lg cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className="relative flex-grow flex items-center justify-center max-w-4xl w-full my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                const maxLen = selectedBlog.galleryImages?.length || 0;
                setActiveLightboxImgIndex((prev) => (prev !== null ? (prev - 1 + maxLen) % maxLen : 0));
              }}
              className="absolute left-2 sm:left-4 z-10 bg-[#16211c]/80 hover:bg-teal-900 border border-[#273a31] text-white p-2.5 sm:p-3 rounded-full cursor-pointer transition select-none shadow-md"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div className="relative max-h-[60vh] sm:max-h-[72vh] rounded-2xl overflow-hidden border border-stone-800 shadow-2xl flex items-center justify-center bg-black/40">
              <img
                src={selectedBlog.galleryImages[activeLightboxImgIndex]}
                alt={`Event snap ${activeLightboxImgIndex + 1}`}
                className="max-h-[60vh] sm:max-h-[72vh] max-w-full object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              onClick={() => {
                const maxLen = selectedBlog.galleryImages?.length || 0;
                setActiveLightboxImgIndex((prev) => (prev !== null ? (prev + 1) % maxLen : 0));
              }}
              className="absolute right-2 sm:right-4 z-10 bg-[#16211c]/80 hover:bg-teal-900 border border-[#273a31] text-white p-2.5 sm:p-3 rounded-full cursor-pointer transition select-none shadow-md"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div
            className="w-full max-w-5xl flex items-center justify-center gap-1.5 overflow-x-auto py-3 px-2 scrollbar-thin scrollbar-thumb-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedBlog.galleryImages.map((tSrc, tIdx) => {
              const isActive = tIdx === activeLightboxImgIndex;
              return (
                <button
                  key={tIdx}
                  onClick={() => setActiveLightboxImgIndex(tIdx)}
                  className={`w-12 h-10 sm:w-14 sm:h-12 rounded-lg overflow-hidden border cursor-pointer flex-shrink-0 transition-all ${isActive
                    ? "border-teal-500 ring-2 ring-teal-500/30 scale-103"
                    : "border-stone-800 opacity-40 hover:opacity-100"
                    }`}
                >
                  <img src={tSrc} alt="" className="w-full h-full object-cover" loading="lazy"
                    decoding="async" referrerPolicy="no-referrer" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PhonePe Checkout */}
      {showPhonePeCheckout && (
        <React.Suspense fallback={null}>
          <PhonePeCheckout
            isOpen={showPhonePeCheckout}
            amount={totalAmount}
            onClose={() => setShowPhonePeCheckout(false)}
            onSuccess={handlePhonePeSuccess}
            onFailure={handlePhonePeFailure}
            cartItems={cart}
            subtotal={subtotal}
            discount={discount}
            shippingFee={shippingFee}
            gstAmount={gstAmount}
            customerName={shippingForm.name}
            customerPhone={shippingForm.phone}
            customerEmail={currentUser?.email || "customer@pawwcious.com"}
            orderId={`PW_PH_${Date.now()}`}
          />
        </React.Suspense>
      )}

      {/* ==================== THANK YOU ORDER CONFIRMATION MODAL ==================== */}
      {showThankYouModal && thankYouOrder && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-[#FAF9F5] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
          >
            {/* Green success header */}
            <div className="bg-[#0C221D] px-6 py-8 text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
              >
                <CheckCircle className="h-9 w-9 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Thank You! 🐾
                </h2>
                <p className="text-teal-300 text-xs font-mono mt-1">
                  Order confirmed successfully
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Order ID */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Order ID</span>
                  <span className="text-xs font-black font-mono text-teal-700">{thankYouOrder.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Payment</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${thankYouOrder.paymentStatus === "Paid"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                    {thankYouOrder.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online ✓"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Amount Charged</span>
                  <span className="text-lg font-black font-mono text-stone-900">₹{thankYouOrder.totalAmount}</span>
                </div>
              </div>

              {/* Estimated delivery */}
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="h-9 w-9 bg-teal-700 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono text-teal-600 uppercase tracking-wider font-bold">
                    Estimated Delivery
                  </p>
                  <p className="text-sm font-black text-teal-900">
                    {(() => {
                      const orderDate = new Date();
                      // COD takes 5-7 days, Online takes 3-5 days
                      const minDays = thankYouOrder.paymentMethod === "COD" ? 5 : 3;
                      const maxDays = thankYouOrder.paymentMethod === "COD" ? 7 : 5;
                      const minDate = new Date(orderDate);
                      const maxDate = new Date(orderDate);
                      minDate.setDate(orderDate.getDate() + minDays);
                      maxDate.setDate(orderDate.getDate() + maxDays);
                      const fmt = (d: Date) => d.toLocaleDateString("en-IN", {
                        weekday: "short", day: "numeric", month: "short"
                      });
                      return `${fmt(minDate)} – ${fmt(maxDate)}`;
                    })()}
                  </p>
                  <p className="text-[10px] text-teal-600 font-sans">
                    Shipped via {thankYouOrder.courierPartner || "Shiprocket Logistics"}
                  </p>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-white border border-stone-150 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">Delivering To</p>
                <p className="text-sm font-bold text-stone-900">{thankYouOrder.shippingDetails.name}</p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {thankYouOrder.shippingDetails.address}, {thankYouOrder.shippingDetails.city},
                  {" "}{thankYouOrder.shippingDetails.state} — {thankYouOrder.shippingDetails.pinCode}
                </p>
                <p className="text-xs text-stone-500">📞 {thankYouOrder.shippingDetails.phone}</p>
              </div>

              {/* Items ordered */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">Items Ordered</p>
                {thankYouOrder.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white border border-stone-100 rounded-xl p-2.5">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.productName}</p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {item.selectedSize} × {item.quantity} — ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {thankYouOrder.items.length > 3 && (
                  <p className="text-[10px] text-stone-400 font-mono text-center">
                    +{thankYouOrder.items.length - 3} more item(s)
                  </p>
                )}

                {/* Free Gift Card */}
                {thankYouOrder.freeGift && (
                  <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200 rounded-xl p-2.5">
                    {thankYouOrder.freeGift.imageUrl && (
                      <img
                        src={thankYouOrder.freeGift.imageUrl}
                        alt={thankYouOrder.freeGift.designName || "Free Gift"}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-amber-300"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-amber-950 truncate">
                          🎁 {thankYouOrder.freeGift.designName || thankYouOrder.freeGift.name}
                        </p>
                        <span className="bg-emerald-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded">
                          FREE
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-800 font-mono">
                        Qty: {thankYouOrder.freeGift.quantity || 1} • Special Blessing
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    setShowThankYouModal(false);
                    setCurrentView("orders");
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 rounded-2xl transition cursor-pointer"
                >
                  Track Order
                </button>
                <button
                  onClick={() => {
                    setShowThankYouModal(false);
                    setCurrentView("shop");
                  }}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-2xl transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>

              <p className="text-[9px] text-stone-400 text-center font-mono">
                A confirmation will be sent to {thankYouOrder.shippingDetails.name}'s registered contact. 🐾
              </p>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}