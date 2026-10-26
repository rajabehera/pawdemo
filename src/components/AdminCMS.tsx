import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Sliders, ShoppingBag, Percent,
  BookOpen, PlusCircle, RefreshCw, Database,
  CheckCircle, Truck, PackageCheck, Image, ShieldCheck, Star, Users, Edit, X, Mail,
  ArrowUp, ArrowDown, Eye, Code, Sparkles, RotateCcw, Send, Info
} from "lucide-react";
import { Product, Coupon, Order, Blog, Category, Banner, Review, ShippingDetails } from "../types";
import {
  fallbackProducts,
  fallbackCategories,
  fallbackBanners,
  fallbackCoupons,
  fallbackBlogs,
  fallbackTestimonials,
  fallbackReviews,
  fallbackReviewReels
} from "../data";

import { MarkdownRenderer } from "./MarkdownRenderer";

// ─── Helper: all CMS fetch calls share these headers ──────────────────────────
import { authFetch } from "../authFetch";

async function cmsPost(url: string, body: object) {
  const res = await authFetch(url, { method: "POST", body: JSON.stringify(body) });
  return res.json();
}
async function cmsPatch(url: string, body: object) {
  const res = await authFetch(url, { method: "PATCH", body: JSON.stringify(body) });
  return res.json();
}
async function cmsDelete(url: string) {
  const res = await authFetch(url, { method: "DELETE" });
  return res.json();
}
async function cmsGet(url: string) {
  const res = await authFetch(url);
  return res.json();
}


// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminCMSProps {
  products: Product[];
  banners: Banner[];
  blogs: Blog[];
  coupons: Coupon[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  users?: any[];
  reviewReels?: any[];
  onRefresh: () => Promise<void>;
  userEmail: string | null;
}

export function AdminCMS({
  products,
  banners,
  blogs,
  coupons,
  categories,
  orders,
  reviews = [],
  users = [],
  reviewReels = [],
  onRefresh,
  userEmail
}: AdminCMSProps) {
  const [activeTab, setActiveTab] = useState<"products" | "banners" | "blogs" | "coupons" | "orders" | "reviews" | "users" | "newsletter" | "enquiries">("products");
  const [seedStatus, setSeedStatus] = useState<string>("");
  const [cmsFeedback, setCmsFeedback] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string; email: string } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ collection: string; id: string; title: string } | null>(null);
  const [showClearOrdersModal, setShowClearOrdersModal] = useState<boolean>(false);

  // Newsletter / email states
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState<boolean>(false);
  const [selectedEmailBody, setSelectedEmailBody] = useState<string | null>(null);
  const [templateSubject, setTemplateSubject] = useState<string>("");
  const [templateHtml, setTemplateHtml] = useState<string>("");
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false);
  const [savingTemplate, setSavingTemplate] = useState<boolean>(false);
  const [resettingTemplate, setResettingTemplate] = useState<boolean>(false);
  const [testEmailAddress, setTestEmailAddress] = useState<string>("");
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState<boolean>(false);

  // Enquiries states
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState<boolean>(false);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isOpen = userToDelete !== null || itemToDelete !== null || showClearOrdersModal || selectedEmailBody !== null;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [userToDelete, itemToDelete, showClearOrdersModal, selectedEmailBody]);

  // ─── Modern inside-app visual alert utility ──────────────────────────────────
  const showFeedback = (text: string, type: "success" | "error" | "info" = "success") => {
    setCmsFeedback({ text, type });
    (window as any).showToast?.(text, type);
    setTimeout(() => setCmsFeedback(null), 8000);
  };

  // =============================================================================
  // ══════════════════════  NEWSLETTER / EMAIL FETCHES  ═════════════════════════
  // =============================================================================

  const fetchSentEmails = async () => {
    setLoadingEmails(true);
    try {
      const data = await cmsGet("/api/emails/sent");
      if (data.success && Array.isArray(data.emails)) setSentEmails(data.emails);
    } catch (err) {
      console.error("Error fetching sent emails:", err);
    } finally {
      setLoadingEmails(false);
    }
  };

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const data = await cmsGet("/api/cms/newsletters");
      if (data.success && Array.isArray(data.data)) setSubscribers(data.data);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleDeleteSubscriber = async (subId: string) => {
    try {
      const data = await cmsDelete(`/api/cms/newsletters/${subId}`);
      if (data.success) {
        showFeedback("Successfully removed subscriber from database!", "success");
        fetchSubscribers();
      } else {
        showFeedback(`Error deleting subscriber: ${data.error}`, "error");
      }
    } catch (err: any) {
      showFeedback(`Error deleting subscriber: ${err.message}`, "error");
    }
  };

  const fetchEmailTemplate = async () => {
    setLoadingTemplate(true);
    try {
      const data = await cmsGet("/api/email-template/newsletter");
      if (data.success && data.template) {
        setTemplateSubject(data.template.subject || "");
        setTemplateHtml(data.template.html || "");
      }
    } catch (err) {
      console.error("Error loading email template:", err);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateSubject.trim()) { showFeedback("Subject line is required.", "error"); return; }
    if (!templateHtml.trim()) { showFeedback("HTML body is required.", "error"); return; }
    setSavingTemplate(true);
    try {
      const data = await cmsPost("/api/email-template/newsletter", { subject: templateSubject, html: templateHtml });
      if (data.success) {
        showFeedback("Email template saved to Firestore!", "success");
      } else {
        showFeedback(data.error || "Could not save template.", "error");
      }
    } catch (err: any) {
      showFeedback(`Error saving template: ${err.message}`, "error");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleResetTemplate = async () => {
    if (!confirm("Reset email template to default layout?")) return;
    setResettingTemplate(true);
    try {
const data = await authFetch("/api/email-template/reset", { method: "POST" }).then(r => r.json());
      if (data.success) {
        showFeedback("Template restored to default!", "success");
        fetchEmailTemplate();
      } else {
        showFeedback("Error restoring defaults.", "error");
      }
    } catch (err: any) {
      showFeedback(`Reset failed: ${err.message}`, "error");
    } finally {
      setResettingTemplate(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      showFeedback("Please enter a valid email address.", "error");
      return;
    }
    setSendingTest(true);
    try {
      const data = await cmsPost("/api/newsletter/subscribe", { email: testEmailAddress });
      if (data.success) {
        showFeedback(`Test email dispatched to ${testEmailAddress}!`, "success");
        setTestEmailAddress("");
        fetchSentEmails();
      } else {
        showFeedback(data.error || "Test dispatch failed.", "error");
      }
    } catch (err: any) {
      showFeedback(`Test failed: ${err.message}`, "error");
    } finally {
      setSendingTest(false);
    }
  };

  // =============================================================================
  // ══════════════════════════  ENQUIRIES FETCHES  ═══════════════════════════════
  // =============================================================================

  const fetchEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const data = await cmsGet("/api/cms/enquiries");
      if (data.success && Array.isArray(data.data)) {
        setEnquiries(data.data);
      }
    } catch (err) {
      console.warn("Fetch enquiries failed, falling back to localStorage", err);
      try {
        const stored = localStorage.getItem("local_enquiries") || "[]";
        setEnquiries(JSON.parse(stored).reverse());
      } catch (e) {
        console.error("localStorage fallback also failed", e);
      }
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const handleUpdateEnquiryStatus = async (eid: string, newStatus: string) => {
    try {
      const data = await cmsPatch(`/api/cms/enquiries/${eid}`, { status: newStatus });
      if (data.success) {
        showFeedback(`Enquiry status updated to ${newStatus}!`, "success");
        fetchEnquiries();
      } else {
        showFeedback(`Error updating status: ${data.error}`, "error");
      }
    } catch (err: any) {
      showFeedback(`Error updating status: ${err.message}`, "error");
    }
  };

  const handleDeleteEnquiry = async (eid: string) => {
    try {
      const data = await cmsDelete(`/api/cms/enquiries/${eid}`);
      if (data.success) {
        showFeedback("Enquiry removed from database!", "success");
        fetchEnquiries();
      } else {
        showFeedback(`Error deleting enquiry: ${data.error}`, "error");
      }
    } catch (err: any) {
      showFeedback(`Error deleting enquiry: ${err.message}`, "error");
    }
  };

  // Load data when tabs open
  useEffect(() => {
    if (activeTab === "newsletter") {
      fetchSentEmails();
      fetchSubscribers();
      fetchEmailTemplate();
    } else if (activeTab === "enquiries") {
      fetchEnquiries();
    }
  }, [activeTab]);

  // =============================================================================
  // ════════════════════════════  SEED DATABASE  ════════════════════════════════
  // =============================================================================

  const handleSeedDatabase = async () => {
    setLoading(true);
    setSeedStatus("Sniffing pipeline... 🐶");
    try {
      const res = await authFetch("/api/admin/seed", {
        method: "POST",
        body: JSON.stringify({
          categories: fallbackCategories,
          products: fallbackProducts,
          banners: fallbackBanners,
          coupons: fallbackCoupons,
          blogs: fallbackBlogs,
          testimonials: fallbackTestimonials,
          reviews: fallbackReviews,
          reviewReels: fallbackReviewReels,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSeedStatus("Success! Database seeded beautifully! 🎉");
        await onRefresh();
      } else {
        setSeedStatus(`Provisioning block: ${data.error}`);
      }
    } catch (err: any) {
      setSeedStatus(`Provisioning block: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
      setTimeout(() => setSeedStatus(""), 5000);
    }
  };

  // =============================================================================
  // ════════════════════════════  PRODUCTS  ════════════════════════════════════
  // =============================================================================

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "", tagline: "", description: "", price: 299, originalPrice: 399,
    stock: 10, category: "grooming-hygiene", imageUrl: "",
    sizeVariants: ["Standard", "Premium"], sizePrices: {}, sizeOriginalPrices: {},
    benefits: [], usage: [], galleryImages: []
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) { showFeedback("Product name is required.", "error"); return; }
    if (!newProduct.imageUrl) { showFeedback("Product cover image is required.", "error"); return; }
    setLoading(true);

    const prodId = editingProductId || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = products.find(p => p.id === prodId);

    const fullProd: Product = {
      id: prodId,
      name: newProduct.name!,
      tagline: newProduct.tagline || (existing?.tagline ?? "Luxury wellness formulation"),
      description: newProduct.description || (existing?.description ?? "Crafted using botanical, organic nutrients."),
      category: newProduct.category || "grooming-hygiene",
      price: Math.max(0, Number(newProduct.price) || 0),
      originalPrice: Math.max(0, Number(newProduct.originalPrice) || Number(newProduct.price) || 0),

      stock: Number(newProduct.stock),
      rating: existing?.rating ?? 4.8,
      reviewCount: existing?.reviewCount ?? 1,
      imageUrl: newProduct.imageUrl!,
      benefits: newProduct.benefits?.length ? newProduct.benefits : (existing?.benefits ?? ["Highly active organic extracts"]),
      usage: newProduct.usage?.length ? newProduct.usage : (existing?.usage ?? ["Administer early mornings in recommended dosing cups"]),
      isBestSeller: existing?.isBestSeller ?? true,
      sizeVariants: newProduct.sizeVariants || (existing?.sizeVariants ?? ["Standard", "Premium"]),
      sizePrices: newProduct.sizePrices || {},
      sizeOriginalPrices: newProduct.sizeOriginalPrices || {},
      galleryImages: newProduct.galleryImages || []
    };

    try {
      const data = await cmsPost("/api/cms/products", fullProd);
      if (!data.success) throw new Error(data.error || "Failed to save product.");

      const isEdit = !!editingProductId;
      setNewProduct({
        name: "", tagline: "", description: "", price: 299, originalPrice: 399,
        stock: 10, category: "grooming-hygiene", imageUrl: "",
        sizeVariants: ["Standard", "Premium"], sizePrices: {}, sizeOriginalPrices: {},
        benefits: [], usage: [], galleryImages: []
      });
      setEditingProductId(null);
      showFeedback(isEdit ? "Product updated successfully!" : "Product introduced successfully!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to save product: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ════════════════════════════  COUPONS  ═════════════════════════════════════
  // =============================================================================

  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "", discountPercent: 15, maxDiscount: 500, minCartValue: 999, active: true, isFreeShipping: false
  });

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) { showFeedback("Coupon code is required.", "error"); return; }
    setLoading(true);
    const fullCoup: Coupon = {
      code: newCoupon.code.toUpperCase(),
      discountPercent: Number(newCoupon.discountPercent),
      maxDiscount: Number(newCoupon.maxDiscount),
      minCartValue: Number(newCoupon.minCartValue),
      active: true,
      isFreeShipping: !!newCoupon.isFreeShipping
    };
    try {
      const data = await cmsPost("/api/cms/coupons", fullCoup);
      if (!data.success) throw new Error(data.error || "Failed to register coupon.");
      setNewCoupon({ code: "", discountPercent: 15, maxDiscount: 500, minCartValue: 999 });
      showFeedback("Coupon code registered successfully!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to register coupon: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ════════════════════════════  BANNERS  ═════════════════════════════════════
  // =============================================================================

  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    title: "", subtitle: "", imageUrl: "", ctaLink: "#shop", ctaText: "Buy Now"
  });
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title) { showFeedback("Banner title is required.", "error"); return; }
    if (!newBanner.imageUrl) { showFeedback("Banner image is required.", "error"); return; }
    if (!editingBannerId && banners.length >= 8) {
      showFeedback("Cannot add more than 8 active banners.", "error");
      return;
    }
    setLoading(true);
    const bid = editingBannerId || `ban_${Date.now()}`;
    const existing = banners.find(b => b.id === bid);
    const fullBan: Banner = {
      id: bid,
      title: newBanner.title!,
      subtitle: newBanner.subtitle || "",
      imageUrl: newBanner.imageUrl!,
      ctaLink: newBanner.ctaLink || "#shop",
      ctaText: newBanner.ctaText || "Shop Now",
      order: newBanner.order !== undefined ? newBanner.order : (existing?.order !== undefined ? existing.order : banners.length * 10)
    };
    try {
      const data = await cmsPost("/api/cms/banners", fullBan);
      if (!data.success) throw new Error(data.error || "Failed to save banner.");
      setNewBanner({ title: "", subtitle: "", imageUrl: "", ctaLink: "#shop", ctaText: "Buy Now" });
      const isEdit = !!editingBannerId;
      setEditingBannerId(null);
      showFeedback(isEdit ? "Banner updated successfully!" : "Banner added successfully!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to save banner: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveBanner = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === banners.length - 1) return;
    setLoading(true);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const orderedBanners = banners.map((b, idx) => ({ ...b, order: b.order !== undefined ? b.order : idx * 10 }));
    const tempOrder = orderedBanners[index].order;
    orderedBanners[index].order = orderedBanners[targetIndex].order;
    orderedBanners[targetIndex].order = tempOrder;
    if (orderedBanners[index].order === orderedBanners[targetIndex].order) {
      orderedBanners[index].order = index * 10 + (direction === "up" ? -5 : 5);
    }
    try {
      const b1 = orderedBanners[index];
      const b2 = orderedBanners[targetIndex];
      const [r1, r2] = await Promise.all([
        cmsPost("/api/cms/banners", b1),
        cmsPost("/api/cms/banners", b2),
      ]);
      if (!r1.success || !r2.success) throw new Error("Failed to reorder banners.");
      showFeedback("Banner order updated!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback("Failed to update banner order.", "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ═════════════════════════════  BLOGS  ══════════════════════════════════════
  // =============================================================================

  const [newBlog, setNewBlog] = useState<Partial<Blog>>({
    title: "", summary: "", content: "", author: "Dr. Kabir Sen",
    imageUrl: "", category: "Nourishment", readTime: "5 min read",
    galleryImages: [], tags: []
  });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTagInput, setBlogTagInput] = useState("");

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title) { showFeedback("Blog title is required.", "error"); return; }
    if (!newBlog.content) { showFeedback("Blog content is required.", "error"); return; }
    if (!newBlog.imageUrl) { showFeedback("Blog cover image is required.", "error"); return; }
    setLoading(true);
    const bid = editingBlogId || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existingBlog = editingBlogId ? blogs.find(b => b.id === editingBlogId) : null;
    const fullBlog: Blog = {
      id: bid,
      title: newBlog.title!,
      summary: newBlog.summary || "Luxury pet care bulletin guide.",
      content: newBlog.content!,
      author: newBlog.author || "Dr. Kabir Sen",
      imageUrl: newBlog.imageUrl!,
      category: newBlog.category || "Nourishment",
      readTime: newBlog.readTime || "5 min read",
      createdAt: existingBlog?.createdAt || new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }),
      likes: existingBlog?.likes || [],
      comments: existingBlog?.comments || [],
      galleryImages: newBlog.galleryImages || [],
      tags: newBlog.tags || []
    };
    try {
      const data = await cmsPost("/api/cms/blogs", fullBlog);
      if (!data.success) throw new Error(data.error || "Failed to publish blog.");
      setNewBlog({ title: "", summary: "", content: "", author: "Dr. Kabir Sen", imageUrl: "", category: "Nourishment", readTime: "5 min read", galleryImages: [], tags: [] });
      setBlogTagInput("");
      const isEdit = !!editingBlogId;
      setEditingBlogId(null);
      showFeedback(isEdit ? "Blog article updated!" : "Blog article published!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to publish blog: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ════════════════════════  REVIEW REELS  ════════════════════════════════════
  // =============================================================================

  const [editingReelId, setEditingReelId] = useState<string | null>(null);
  const [newReel, setNewReel] = useState<{
    authorName: string; petName: string; rating: number; caption: string;
    location: string; videoUrl: string; imageUrl: string; views: string;
    likes: number; featuredProductId: string; instagramEmbedCode: string;
  }>({
    authorName: "", petName: "", rating: 5, caption: "", location: "India",
    videoUrl: "", imageUrl: "", views: "1.2K", likes: 12, featuredProductId: "", instagramEmbedCode: ""
  });

  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReel.authorName) { showFeedback("Author name is required.", "error"); return; }
    if (!newReel.videoUrl && !newReel.instagramEmbedCode) { showFeedback("Video URL or Instagram Embed Code is required.", "error"); return; }
    if (!newReel.imageUrl && !newReel.instagramEmbedCode) { showFeedback("Cover image is required when not using Instagram Embed.", "error"); return; }
    setLoading(true);
    const rid = editingReelId || `reel_${Date.now()}`;
    const fullReel = {
      id: rid,
      authorName: newReel.authorName,
      petName: newReel.petName || "Pet",
      rating: Number(newReel.rating) || 5,
      caption: newReel.caption || "",
      location: newReel.location || "",
      videoUrl: newReel.videoUrl || "",
      imageUrl: newReel.imageUrl || "",
      views: newReel.views || "1.2K",
      likes: Number(newReel.likes) || 12,
      featuredProductId: newReel.featuredProductId || "",
      instagramEmbedCode: newReel.instagramEmbedCode || "",
      createdAt: new Date().toISOString()
    };
    try {
      const data = await cmsPost("/api/cms/review-reels", fullReel);
      if (!data.success) throw new Error(data.error || "Failed to save reel.");
      setNewReel({ authorName: "", petName: "", rating: 5, caption: "", location: "India", videoUrl: "", imageUrl: "", views: "1.2K", likes: 12, featuredProductId: "", instagramEmbedCode: "" });
      const isEdit = !!editingReelId;
      setEditingReelId(null);
      showFeedback(isEdit ? "Story reel updated!" : "Story reel uploaded!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to save reel: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReelInit = (reel: any) => {
    setEditingReelId(reel.id);
    setNewReel({
      authorName: reel.authorName || "", petName: reel.petName || "",
      rating: reel.rating || 5, caption: reel.caption || "",
      location: reel.location || "", videoUrl: reel.videoUrl || "",
      imageUrl: reel.imageUrl || "", views: reel.views || "1.2K",
      likes: reel.likes || 12, featuredProductId: reel.featuredProductId || "",
      instagramEmbedCode: reel.instagramEmbedCode || ""
    });
    document.getElementById("cms-reels-manager")?.scrollIntoView({ behavior: "smooth" });
  };

  // =============================================================================
  // ═════════════════════════════  ORDERS  ═════════════════════════════════════
  // =============================================================================

  const [adminOrderSearch, setAdminOrderSearch] = useState<string>("");
  const [adminOrderStatusFilter, setAdminOrderStatusFilter] = useState<string>("All");
  const [editingAddressOrderId, setEditingAddressOrderId] = useState<string | null>(null);
  const [editAddressForm, setEditAddressForm] = useState<ShippingDetails>({
    name: "", phone: "", address: "", city: "", state: "", pinCode: ""
  });

  const handleStartEditingAddress = (order: Order) => {
    setEditingAddressOrderId(order.orderId);
    setEditAddressForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      ...order.shippingDetails
    });
  };

  const handleSaveOrderAddress = async (orderId: string) => {
    setLoading(true);
    try {
      const data = await cmsPatch(`/api/cms/orders/${orderId}`, { shippingDetails: editAddressForm });
      if (!data.success) throw new Error(data.error || "Failed to save address.");
      setEditingAddressOrderId(null);
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to save address: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustOrderStatus = async (orderId: string, nextStatus: string) => {
    setLoading(true);
    try {
      const updates: any = { shippingStatus: nextStatus };
      if (nextStatus === "AWB Generated") {
        updates.awbNumber = `SR-${Math.floor(100000000 + Math.random() * 900000000)}`;
        updates.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString();
      }
      const data = await cmsPatch(`/api/cms/orders/${orderId}`, updates);
      if (!data.success) throw new Error(data.error || "Failed to update order status.");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to update order: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    setShowClearOrdersModal(false);
    setLoading(true);
    try {
      const data = await cmsDelete("/api/cms/orders");
      if (!data.success) throw new Error(data.error || "Bulk delete failed.");
      showFeedback("All orders permanently deleted!", "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Bulk delete error: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ═════════════════════════════  REVIEWS  ════════════════════════════════════
  // =============================================================================

  const handleModerateReview = async (reviewId: string, status: "approved" | "rejected") => {
    setLoading(true);
    try {
      const data = await cmsPatch(`/api/cms/reviews/${reviewId}`, { status });
      if (!data.success) throw new Error(data.error || "Failed to moderate review.");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Failed to moderate review: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ══════════════════════  GENERIC DELETE HANDLER  ═════════════════════════════
  // =============================================================================

  // Maps collection names to their API delete endpoints
  const collectionToEndpoint: Record<string, string> = {
    products: "/api/cms/products",
    banners: "/api/cms/banners",
    blogs: "/api/cms/blogs",
    coupons: "/api/cms/coupons",
    reviews: "/api/cms/reviews",
    users: "/api/cms/users",
    orders: "/api/cms/orders",
    review_reels: "/api/cms/review-reels",
    enquiries: "/api/cms/enquiries",
    newsletters: "/api/cms/newsletters",
  };

  const handleDeleteDoc = async (collectionName: string, id: string, skipConfirm = false) => {
    if (!id) { showFeedback("Unable to resolve document ID for deletion.", "error"); return; }

    // Guard against deleting admin/self
    if (collectionName === "users") {
      const targetUser = users.find((u: any) => u.id === id || u.userId === id);
      if (targetUser) {
        const emailLower = targetUser.email?.toLowerCase();
        const activeLower = userEmail?.toLowerCase();
        if (emailLower === "rajasbehera@gmail.com" || emailLower === activeLower || targetUser.role === "admin") {
          showFeedback("Cannot delete admin accounts or your own profile.", "error");
          return;
        }
      }
    }

    if (!skipConfirm) {
      let title = id;
      if (collectionName === "banners") { const f = banners.find(b => b.id === id); if (f) title = f.title || id; }
      else if (collectionName === "products") { const f = products.find(p => p.id === id); if (f) title = f.name || id; }
      else if (collectionName === "blogs") { const f = blogs.find(b => b.id === id); if (f) title = f.title || id; }
      else if (collectionName === "coupons") title = `Coupon Code: ${id}`;
      else if (collectionName === "reviews") { const f = reviews.find(r => r.id === id); if (f) title = `Review by ${f.userName || "Customer"} (${f.rating}★)`; }
      setItemToDelete({ collection: collectionName, id, title });
      return;
    }

    setLoading(true);
    try {
      const endpoint = collectionToEndpoint[collectionName];
      if (!endpoint) throw new Error(`Unknown collection: ${collectionName}`);
      const data = await cmsDelete(`${endpoint}/${id}`);
      if (!data.success) throw new Error(data.error || "Delete failed.");
      showFeedback(`Successfully deleted from ${collectionName}!`, "success");
      await onRefresh();
    } catch (err: any) {
      showFeedback(`Error deleting: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // ══════════════════════  IMAGE COMPRESSION HELPERS  ══════════════════════════
  // =============================================================================

  const compressImage = (file: File, callback: (b64: string) => void, maxWidth = 1920, maxHeight = 1920, quality = 1.0, maxBase64Length = 450000) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) { if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; } }
        else { if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; } }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let currentQuality = quality;
          let compressed = canvas.toDataURL("image/jpeg", currentQuality);
          let loopCount = 0;
          while (compressed.length > maxBase64Length && currentQuality > 0.6 && loopCount < 8) {
            currentQuality -= 0.05;
            compressed = canvas.toDataURL("image/jpeg", currentQuality);
            loopCount++;
          }
          if (compressed.length > maxBase64Length) {
            const sc = document.createElement("canvas");
            sc.width = Math.round(width * 0.75); sc.height = Math.round(height * 0.75);
            const sctx = sc.getContext("2d");
            if (sctx) { sctx.drawImage(canvas, 0, 0, sc.width, sc.height); compressed = sc.toDataURL("image/jpeg", Math.min(0.85, currentQuality)); }
          }
          callback(compressed);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "blog" | "banner" | "product") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "banner") compressImage(file, (b64) => setNewBanner(prev => ({ ...prev, imageUrl: b64 })), 1920, 1080, 0.92, 850000);
    else if (type === "product") compressImage(file, (b64) => setNewProduct(prev => ({ ...prev, imageUrl: b64 })), 1200, 1200, 0.88, 600000);
    else if (type === "blog") compressImage(file, (b64) => setNewBlog(prev => ({ ...prev, imageUrl: b64 })), 1400, 1000, 0.88, 600000);
  };

  const handleMultipleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    let loadedCount = 0;
    const compressedBase64s: string[] = [];
    fileList.forEach((file: File) => {
      compressImage(file, (b64) => {
        compressedBase64s.push(b64);
        loadedCount++;
        if (loadedCount === fileList.length) {
          setNewBlog(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), ...compressedBase64s].slice(0, 10) }));
        }
      }, 1000, 1000, 0.82, 500000);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 950000) showFeedback("Video over 900KB — recommend using an external CDN URL instead.", "info");
    const reader = new FileReader();
    reader.onload = (event) => { if (event.target?.result) setNewReel(prev => ({ ...prev, videoUrl: event.target!.result as string })); };
    reader.readAsDataURL(file);
  };

  const handleReelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImage(file, (b64) => setNewReel(prev => ({ ...prev, imageUrl: b64 })), 600, 1000, 0.85, 450000);
  };

  // =============================================================================
  // ══════════════════════════════  RENDER  ═════════════════════════════════════
  // =============================================================================

  return (
    <div id="admin-cms-viewport" className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-4 rounded-2xl">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="h-4.5 w-4.5" />
            Pawwcious HQ Access
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-sans mt-1">Headless Commerce CMS Admin</h2>
          <p className="text-[11px] text-stone-500 font-mono mt-0.5">Authorised Console: <span className="text-emerald-600 font-bold">{userEmail || "rajasbehera@gmail.com"}</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefresh}
            className="bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-3.5 py-2 rounded-xl transition duration-250 flex items-center gap-2 border border-stone-200 dark:border-stone-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Assets
          </button>
          <button
            disabled={loading}
            onClick={handleSeedDatabase}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-lg transition duration-250 flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Seed Database
          </button>
        </div>
      </div>

      {/* Seed status banner */}
      {seedStatus && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 rounded-xl p-3.5 text-xs mb-5 flex items-center gap-2 font-mono">
          <Database className="h-4 w-4 animate-bounce" />
          {seedStatus}
        </div>
      )}

      {/* CMS Feedback Banner */}
      {cmsFeedback && (
        <div className={`border rounded-xl p-3.5 text-xs mb-5 flex items-center justify-between gap-2.5 font-sans transition-opacity duration-300 ${cmsFeedback.type === "error"
          ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300"
          : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-950 text-emerald-800 dark:text-emerald-300"
          }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4.5 w-4.5 ${cmsFeedback.type === "error" ? "text-rose-500" : "text-emerald-500"}`} />
            <span className="font-medium">{cmsFeedback.text}</span>
          </div>
          <button type="button" onClick={() => setCmsFeedback(null)} className="text-stone-400 hover:text-stone-650 text-xs px-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded font-bold cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm text-left">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Real-time Products</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-sans text-stone-950 dark:text-stone-50">{products.length}</span>
            <span className="text-[9px] font-mono text-stone-400">items</span>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm text-left">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Live User Accounts</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-sans text-teal-700 dark:text-teal-400">{users.length}</span>
            <span className="text-[9px] font-mono text-teal-500 font-medium">registered</span>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm text-left">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Total Sales Orders</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-sans text-amber-700 dark:text-amber-450">{orders.length}</span>
            <span className="text-[9px] font-mono text-amber-500">placed</span>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm text-left">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Editorial Blogs</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-sans text-blue-700 dark:text-blue-400">{blogs.length}</span>
            <span className="text-[9px] font-mono text-blue-500">published</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap -mx-1 mb-5 border-b border-stone-200 dark:border-stone-800 pb-2">
        {(["products", "banners", "blogs", "coupons", "orders", "reviews", "users", "newsletter", "enquiries"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-4 py-2 mx-1 my-1 rounded-xl font-medium transition capitalize ${activeTab === tab
              ? "bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-semibold"
              : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ═══════════════════ PRODUCTS TAB ═══════════════════ */}
      {activeTab === "products" && (
        <div id="cms-products-manager" className="space-y-6">
          <form id="cms-add-product-form" onSubmit={handleAddProduct} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-900 pb-2">
              <span className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-teal-600" />
                {editingProductId ? "Modify Elite Wellness Product" : "Introduce Elite Wellness Product"}
              </span>
              {editingProductId && (
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 font-mono font-bold uppercase py-0.5 px-2 rounded-md animate-pulse">
                  Editing Product Profile
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Name</label>
                <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Skin Renew Elixir" className="w-full bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-250 border border-stone-200 dark:border-stone-750 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Tagline</label>
                <input type="text" value={newProduct.tagline || ""} onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })} placeholder="Single line focus phrase" className="w-full bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-250 border border-stone-200 dark:border-stone-750 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Category</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-250 border border-stone-200 dark:border-stone-750 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500">
                  <option value="grooming-hygiene">Grooming & Hygiene Care</option>
                  <option value="coat-skin-wellness">Coat & Skin Wellness</option>
                  <option value="chew-enrichment">Natural Chew & Enrichment</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">MRP Price (INR)</label>
                <input type="number" value={newProduct.originalPrice || ""} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Sale Price (INR)</label>
                <input type="number" value={newProduct.price || ""} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Stock Units</label>
                <input type="number" value={newProduct.stock || ""} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Cover Image</label>
                <div className="flex gap-1.5">
                  <input type="text" required value={newProduct.imageUrl || ""} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} placeholder="Paste URL or upload" className="flex-grow bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
                  <label className="bg-teal-50 hover:bg-teal-100 dark:bg-stone-900 border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-400 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "product")} className="hidden" />
                  </label>
                </div>
                {newProduct.imageUrl && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <img src={newProduct.imageUrl} alt="" className="w-12 h-10 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-emerald-600 font-medium font-mono">Image attached ✔</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-stone-500 font-mono">Product Description</label>
              <textarea value={newProduct.description || ""} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Write full product details..." rows={3} className="w-full bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-stone-200 border border-stone-200 dark:border-stone-750 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>

            {/* Size variants */}
            <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono text-[#134E4A] font-extrabold uppercase tracking-wider">Care Size & Custom Pricing</label>
                <span className="text-[9px] text-stone-400 font-mono">Customizes prices for specific sizes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {(newProduct.sizeVariants || []).map((size) => {
                  const sale = newProduct.sizePrices?.[size] !== undefined ? newProduct.sizePrices[size] : (newProduct.price || 0);
                  const mrp = newProduct.sizeOriginalPrices?.[size] !== undefined ? newProduct.sizeOriginalPrices[size] : (newProduct.originalPrice || 0);
                  return (
                    <div key={size} className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-stone-850 dark:text-stone-100">{size}</p>
                        <p className="text-[10px] text-stone-500">MRP: <span className="line-through">₹{mrp}</span> • Sale: <span className="font-extrabold text-teal-700">₹{sale}</span></p>
                      </div>
                      <button type="button" onClick={() => {
                        const updatedSizes = (newProduct.sizeVariants || []).filter(s => s !== size);
                        const updatedPrices = { ...(newProduct.sizePrices || {}) }; delete updatedPrices[size];
                        const updatedOriginals = { ...(newProduct.sizeOriginalPrices || {}) }; delete updatedOriginals[size];
                        setNewProduct({ ...newProduct, sizeVariants: updatedSizes, sizePrices: updatedPrices, sizeOriginalPrices: updatedOriginals });
                      }} className="text-red-500 hover:text-red-700 px-2 rounded bg-red-50 dark:bg-red-950/30 text-[10px] font-bold">Remove</button>
                    </div>
                  );
                })}
              </div>
              <div className="bg-[#FAF9F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-3 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                <div><label className="text-[10px] text-stone-500 font-mono block mb-1">New Size</label><input type="text" id="cms-new-size-name" placeholder="e.g. 250 ml" className="w-full bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-850 dark:text-stone-200 text-xs px-2.5 py-2 rounded-lg" /></div>
                <div><label className="text-[10px] text-stone-500 font-mono block mb-1">Sale Price</label><input type="number" id="cms-new-size-price" placeholder="e.g. 450" className="w-full bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-850 dark:text-stone-200 text-xs px-2.5 py-2 rounded-lg" /></div>
                <div><label className="text-[10px] text-stone-500 font-mono block mb-1">MRP Price</label><input type="number" id="cms-new-size-original-price" placeholder="e.g. 599" className="w-full bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-850 dark:text-stone-200 text-xs px-2.5 py-2 rounded-lg" /></div>
                <button type="button" onClick={() => {
                  const nameInput = document.getElementById("cms-new-size-name") as HTMLInputElement;
                  const priceInput = document.getElementById("cms-new-size-price") as HTMLInputElement;
                  const origInput = document.getElementById("cms-new-size-original-price") as HTMLInputElement;
                  const szName = nameInput?.value.trim();
                  const szPrice = Number(priceInput?.value);
                  const szOrig = Number(origInput?.value);
                  if (!szName || !szPrice || szPrice <= 0) return;
                  if ((newProduct.sizeVariants || []).includes(szName)) return;
                  setNewProduct({ ...newProduct, sizeVariants: [...(newProduct.sizeVariants || []), szName], sizePrices: { ...(newProduct.sizePrices || {}), [szName]: szPrice }, sizeOriginalPrices: { ...(newProduct.sizeOriginalPrices || {}), [szName]: szOrig || szPrice } });
                  if (nameInput) nameInput.value = ""; if (priceInput) priceInput.value = ""; if (origInput) origInput.value = "";
                }} className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-2.5 rounded-lg font-bold cursor-pointer">Add Size Price</button>
              </div>
            </div>

            {/* Benefits & Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-100 dark:border-stone-800 pt-3">
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-[#134E4A] font-extrabold uppercase tracking-wider block">Ingredients & Clinical Benefits</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 p-2.5 rounded-xl">
                  {(newProduct.benefits || []).map((benefit, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2 bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-100 dark:border-stone-850 text-xs text-stone-700 dark:text-stone-300">
                      <p className="flex-1 leading-relaxed"><strong className="text-teal-700">•</strong> {benefit}</p>
                      <button type="button" onClick={() => setNewProduct({ ...newProduct, benefits: (newProduct.benefits || []).filter((_, i) => i !== idx) })} className="text-red-550 hover:text-red-700 font-sans font-bold px-1 cursor-pointer">×</button>
                    </div>
                  ))}
                  {(newProduct.benefits || []).length === 0 && <p className="text-[11px] text-stone-400 italic text-center py-4">No benefits listed yet.</p>}
                </div>
                <div className="flex gap-2">
                  <input type="text" id="cms-new-benefit-text" placeholder="e.g. Organic Aloe: Renews skin lipids." className="flex-grow bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-850 dark:text-stone-200 text-xs px-3 py-2 rounded-lg focus:outline-none" />
                  <button type="button" onClick={() => { const input = document.getElementById("cms-new-benefit-text") as HTMLInputElement; if (input?.value.trim()) { setNewProduct({ ...newProduct, benefits: [...(newProduct.benefits || []), input.value.trim()] }); input.value = ""; } }} className="bg-stone-900 hover:bg-stone-850 text-white text-xs px-4 py-2 rounded-lg font-bold shrink-0 cursor-pointer">Add Bullet</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-[#134E4A] font-extrabold uppercase tracking-wider block">Application & How To Use</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 p-2.5 rounded-xl">
                  {(newProduct.usage || []).map((step, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2 bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-100 dark:border-stone-850 text-xs text-stone-700 dark:text-stone-300">
                      <p className="flex-1 leading-relaxed"><strong className="text-teal-700">{idx + 1}.</strong> {step}</p>
                      <button type="button" onClick={() => setNewProduct({ ...newProduct, usage: (newProduct.usage || []).filter((_, i) => i !== idx) })} className="text-red-550 hover:text-red-700 font-sans font-bold px-1 cursor-pointer">×</button>
                    </div>
                  ))}
                  {(newProduct.usage || []).length === 0 && <p className="text-[11px] text-stone-400 italic text-center py-4">No steps listed yet.</p>}
                </div>
                <div className="flex gap-2">
                  <input type="text" id="cms-new-usage-text" placeholder="e.g. Pump twice onto damp coat." className="flex-grow bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-850 dark:text-stone-200 text-xs px-3 py-2 rounded-lg focus:outline-none" />
                  <button type="button" onClick={() => { const input = document.getElementById("cms-new-usage-text") as HTMLInputElement; if (input?.value.trim()) { setNewProduct({ ...newProduct, usage: [...(newProduct.usage || []), input.value.trim()] }); input.value = ""; } }} className="bg-stone-900 hover:bg-stone-850 text-white text-xs px-4 py-2 rounded-lg font-bold shrink-0 cursor-pointer">Add Step</button>
                </div>
              </div>
            </div>

            {/* Gallery images */}
            <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-3">
              <label className="text-[11px] font-mono text-[#134E4A] font-extrabold uppercase tracking-wider block">Additional Gallery Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(newProduct.galleryImages || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative group w-14 h-12 rounded-lg overflow-hidden border border-stone-200">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button type="button" onClick={() => setNewProduct({ ...newProduct, galleryImages: (newProduct.galleryImages || []).filter((_, i) => i !== idx) })} className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] uppercase font-bold transition-all cursor-pointer">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" id="cms-new-gallery-url" placeholder="Paste gallery image URL..." className="flex-grow bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-stone-850 dark:text-stone-250 text-xs px-3.5 py-2 rounded-lg focus:outline-none" />
                <label className="bg-teal-50 hover:bg-teal-100 dark:bg-stone-900 border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-400 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center">
                  Upload
                  <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) compressImage(file, (b64) => setNewProduct(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), b64] })), 1200, 1200, 0.88, 550000); }} className="hidden" />
                </label>
                <button type="button" onClick={() => { const input = document.getElementById("cms-new-gallery-url") as HTMLInputElement; if (input?.value.trim()) { setNewProduct({ ...newProduct, galleryImages: [...(newProduct.galleryImages || []), input.value.trim()] }); input.value = ""; } }} className="bg-stone-900 hover:bg-stone-850 text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer">Add URL</button>
              </div>
            </div>

            <div className="flex justify-end items-center gap-2 pt-2">
              {editingProductId && (
                <button type="button" onClick={() => { setEditingProductId(null); setNewProduct({ name: "", tagline: "", description: "", price: 299, originalPrice: 399, stock: 10, category: "grooming-hygiene", imageUrl: "", sizeVariants: ["Standard", "Premium"], sizePrices: {}, sizeOriginalPrices: {}, benefits: [], usage: [], galleryImages: [] }); }} className="bg-stone-150 hover:bg-stone-200 dark:bg-stone-905 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition">Cancel Edit</button>
              )}
              <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition duration-200 cursor-pointer">
                {editingProductId ? "Save Product Changes" : "Save Elite Product"}
              </button>
            </div>
          </form>

          {/* Product inventory list */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-stone-500 font-mono uppercase mb-4 tracking-wider">Active Catalog Inventory ({products.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-400">
                <thead>
                  <tr className="border-b border-stone-150 dark:border-stone-800 text-[10px] text-stone-400 font-mono uppercase">
                    <th className="py-2.5">Product</th><th className="py-2.5">Category</th><th className="py-2.5">Price</th><th className="py-2.5">Stock</th><th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 dark:divide-stone-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="py-3 flex items-center gap-3">
                        <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div><p className="font-semibold text-stone-900 dark:text-stone-100">{p.name}</p><p className="text-[10px] text-stone-400">{p.tagline}</p></div>
                      </td>
                      <td className="py-3 capitalize text-stone-500 font-mono text-[11px]">{p.category}</td>
                      <td className="py-3 text-stone-800 dark:text-stone-200 font-semibold">₹{p.price} <span className="text-stone-400 font-normal line-through text-[10px]">₹{p.originalPrice}</span></td>
                      <td className="py-3 font-mono"><span className={`px-2 py-0.5 rounded-md text-[10px] ${p.stock <= 5 ? "bg-red-50 text-red-650 font-bold" : "bg-stone-100 dark:bg-stone-800"}`}>{p.stock} units</span></td>
                      <td className="py-3 text-right flex justify-end items-center gap-1">
                        <button onClick={() => { setEditingProductId(p.id); setNewProduct({ name: p.name, tagline: p.tagline, description: p.description || "", category: p.category, price: p.price, originalPrice: p.originalPrice, stock: p.stock, imageUrl: p.imageUrl, sizeVariants: p.sizeVariants || ["Standard", "Premium"], sizePrices: p.sizePrices || {}, sizeOriginalPrices: p.sizeOriginalPrices || {}, benefits: p.benefits || [], usage: p.usage || [], galleryImages: p.galleryImages || [] }); document.getElementById("cms-add-product-form")?.scrollIntoView({ behavior: "smooth" }); }} className="text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 p-2 rounded-lg transition cursor-pointer" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteDoc("products", p.id)} className="hover:bg-red-50 hover:text-red-600 p-2 rounded-lg text-stone-400 transition cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-stone-400 text-xs">No products found. Seed mock data first!</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ BANNERS TAB ═══════════════════ */}
      {activeTab === "banners" && (
        <div id="cms-banners-manager" className="space-y-6">
          <form id="cms-add-banner-form" onSubmit={handleAddBanner} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
              <span className="flex items-center gap-2"><Image className="h-4 w-4 text-teal-600" />{editingBannerId ? "Edit Promo Banner" : "Configure Promo Banner"}</span>
              {editingBannerId && <span className="text-xs bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold font-mono px-2 py-1 rounded">Editing Active Banner</span>}
            </h3>
            {!editingBannerId && banners.length >= 8 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-xl text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                Limit reached: Cannot have more than 8 active banners.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Banner Headline Title</label>
                <input type="text" required value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })} placeholder="e.g. Winter Wellness Sale" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Background Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" required value={newBanner.imageUrl || ""} onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })} placeholder="Paste URL or upload file" className="flex-grow bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg outline-none" />
                  <label className="bg-teal-50 hover:bg-teal-100 dark:bg-stone-900 border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-400 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer text-center whitespace-nowrap select-none">
                    Upload Image
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} className="hidden" />
                  </label>
                </div>
                {newBanner.imageUrl && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <img src={newBanner.imageUrl} alt="" className="w-12 h-10 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-emerald-600 font-medium font-mono">Image attached ✔</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-stone-500 font-mono">Campaign Subtitle</label>
                <input type="text" value={newBanner.subtitle} onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })} placeholder="Describe offer scope" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">CTA Button Text</label>
                <input type="text" value={newBanner.ctaText} onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-slate-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              {editingBannerId && (
                <button type="button" onClick={() => { setEditingBannerId(null); setNewBanner({ title: "", subtitle: "", imageUrl: "", ctaLink: "#shop", ctaText: "Buy Now" }); }} className="bg-stone-150 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition">Cancel Edit</button>
              )}
              <button type="submit" disabled={!editingBannerId && banners.length >= 8} className={`text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm cursor-pointer transition ${!editingBannerId && banners.length >= 8 ? "bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white"}`}>
                {editingBannerId ? "Save Banner Changes" : "Add Campaign Billboard"}
              </button>
            </div>
          </form>

          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-stone-500 font-mono uppercase mb-4 tracking-wider flex items-center justify-between">
              <span>Configure Banners ({banners.length})</span>
              <span className="text-[10px] text-stone-400 normal-case font-normal font-sans">Use arrows to adjust display priority</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b, index) => (
                <div key={b.id} className="border border-stone-150 dark:border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  <div className="h-36 bg-stone-100 overflow-hidden relative">
                    <img src={b.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-teal-500/85 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">Pos {index + 1}</span>
                      </div>
                      <h4 className="font-bold text-xs">{b.title}</h4>
                      <p className="text-[10px] text-stone-300 line-clamp-1">{b.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 flex justify-between items-center text-xs">
                    <span className="font-mono text-[10px] text-stone-500">CTA: {b.ctaText}</span>
                    <div className="flex gap-1.5 items-center">
                      <button type="button" onClick={() => handleMoveBanner(index, "up")} disabled={index === 0 || loading} className={`p-1.5 rounded-lg border transition ${index === 0 ? "border-stone-100 text-stone-300 cursor-not-allowed" : "border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"}`}><ArrowUp className="h-3 w-3" /></button>
                      <button type="button" onClick={() => handleMoveBanner(index, "down")} disabled={index === banners.length - 1 || loading} className={`p-1.5 rounded-lg border transition ${index === banners.length - 1 ? "border-stone-100 text-stone-300 cursor-not-allowed" : "border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"}`}><ArrowDown className="h-3 w-3" /></button>
                      <div className="w-px h-4 bg-stone-200 dark:bg-stone-800 mx-0.5" />
                      <button type="button" onClick={() => { setEditingBannerId(b.id); setNewBanner({ title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl, ctaLink: b.ctaLink || "#shop", ctaText: b.ctaText || "Shop Now" }); document.getElementById("cms-add-banner-form")?.scrollIntoView({ behavior: "smooth" }); }} className="text-teal-600 hover:bg-teal-55 dark:hover:bg-stone-800 p-2 rounded-lg cursor-pointer transition"><Edit className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => { handleDeleteDoc("banners", b.id); if (editingBannerId === b.id) { setEditingBannerId(null); setNewBanner({ title: "", subtitle: "", imageUrl: "", ctaLink: "#shop", ctaText: "Buy Now" }); } }} className="text-red-500 hover:bg-red-50 dark:hover:bg-stone-800/40 p-2 rounded-lg cursor-pointer transition"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ BLOGS TAB ═══════════════════ */}
      {activeTab === "blogs" && (
        <div id="cms-blogs-manager" className="space-y-6">
          <form id="cms-add-blog-form" onSubmit={handleAddBlog} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-teal-605" />{editingBlogId ? "Edit Article" : "Write New Article"}</span>
              {editingBlogId && <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 font-mono font-bold uppercase py-0.5 px-2 rounded-md animate-pulse">Editing Article</span>}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-stone-500 font-mono">Article Title</label>
                <input type="text" required value={newBlog.title || ""} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="e.g. Relieving Canine Monsoon Itchiness" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Category</label>
                <select value={newBlog.category || "Nourishment"} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg font-bold">
                  <option value="Nourishment">Nourishment</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Integrity">Integrity</option>
                  <option value="Botanist Care">Botanist Care</option>
                  <option value="Wellness Guide">Wellness Guide</option>
                  <option value="Events & Gallery">Events & Gallery</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-stone-500 font-mono">Cover Image Source</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" required value={newBlog.imageUrl || ""} onChange={(e) => setNewBlog({ ...newBlog, imageUrl: e.target.value })} placeholder="Paste URL or upload cover file" className="flex-grow bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg outline-none" />
                  <label className="bg-teal-50 hover:bg-teal-100 dark:bg-stone-900 border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-400 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer text-center whitespace-nowrap select-none">
                    Upload Cover
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "blog")} className="hidden" />
                  </label>
                </div>
                {newBlog.imageUrl && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <img src={newBlog.imageUrl} alt="" className="w-12 h-10 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-emerald-600 font-medium font-mono">Image attached ✔</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Read Time</label>
                <input type="text" required value={newBlog.readTime || "5 min read"} onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })} placeholder="e.g. 5 min read" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-stone-50 dark:bg-[#131b18] border border-stone-200 dark:border-[#22352F] p-4 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-stone-850 dark:text-stone-200">📷 Event Gallery Photo Uploads</h4>
                  <p className="text-[10px] text-stone-550 dark:text-stone-400">Upload multiple images for events or gallery grids (max 30).</p>
                </div>
                <label className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-[11px] font-bold cursor-pointer text-center whitespace-nowrap self-start sm:self-center select-none shadow-sm transition">
                  Select Multiple Photos
                  <input type="file" multiple accept="image/*" onChange={handleMultipleGalleryUpload} className="hidden" />
                </label>
              </div>
              {newBlog.galleryImages && newBlog.galleryImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400">
                    <span>Uploaded: <strong>{newBlog.galleryImages.length}</strong> photos / 30 max</span>
                    <button type="button" onClick={() => setNewBlog(prev => ({ ...prev, galleryImages: [] }))} className="text-red-600 hover:underline cursor-pointer font-bold">Clear All Photos</button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg max-h-40 overflow-y-auto">
                    {newBlog.galleryImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded overflow-hidden border border-stone-150">
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button type="button" onClick={() => setNewBlog(prev => ({ ...prev, galleryImages: (prev.galleryImages || []).filter((_, i) => i !== idx) }))} className="absolute inset-0 bg-red-900/85 text-white text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-stone-250 dark:border-stone-800 rounded-lg p-5 text-center text-stone-450 dark:text-stone-500 text-[11px] italic">No images uploaded yet.</div>
              )}
            </div>

            {/* Summary & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-1">
                <label className="text-[11px] text-stone-500 font-mono font-bold block uppercase tracking-wider">Short Preview Summary</label>
                <textarea required rows={4} value={newBlog.summary || ""} onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })} placeholder="A catchy summary for the editorial library." className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs p-3 rounded-lg outline-none focus:ring-1 focus:ring-teal-500 resize-none h-full min-h-[140px]" />
              </div>
              <div className="space-y-2 md:col-span-2 border border-stone-200 dark:border-stone-800 rounded-xl p-3 bg-stone-100/30 dark:bg-stone-950/20">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-teal-850 dark:text-teal-400 font-mono font-bold uppercase tracking-wider block">Interactive Article Tags</label>
                  <span className="text-[9px] text-stone-400 font-mono font-bold">{(newBlog.tags || []).length} Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-white dark:bg-stone-950 border border-stone-200/80 dark:border-stone-850 rounded-lg min-h-11 items-center">
                  {(newBlog.tags || []).length > 0 ? (
                    (newBlog.tags || []).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 bg-teal-50 dark:bg-[#152e2a] text-teal-850 dark:text-teal-300 text-[10.5px] font-bold px-2.5 py-1 rounded-lg border border-teal-200/55 dark:border-teal-900/40">
                        #{tag}
                        <button type="button" onClick={() => setNewBlog(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }))} className="hover:bg-teal-200/30 rounded p-0.5 text-teal-600 cursor-pointer"><X className="h-2.5 w-2.5" /></button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-stone-400 italic">No tags added yet.</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={blogTagInput} onChange={(e) => { const val = e.target.value; if (val.includes(",")) { const parts = val.split(","); const completed = parts.slice(0, -1).map(p => p.trim()).filter(Boolean); const remaining = parts[parts.length - 1]; if (completed.length > 0) setNewBlog(prev => { const cur = prev.tags || []; const upd = [...cur]; completed.forEach(t => { if (!upd.includes(t)) upd.push(t); }); return { ...prev, tags: upd }; }); setBlogTagInput(remaining); } else setBlogTagInput(val); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const trimmed = blogTagInput.trim(); if (trimmed) { const tags = trimmed.split(",").map(t => t.trim()).filter(Boolean); setNewBlog(prev => { const cur = prev.tags || []; const upd = [...cur]; tags.forEach(t => { if (!upd.includes(t)) upd.push(t); }); return { ...prev, tags: upd }; }); setBlogTagInput(""); } } }} placeholder="Type tags (comma or Enter to add)" className="flex-1 bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-850 dark:text-stone-200 text-xs px-3.5 py-2.5 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" />
                  <button type="button" onClick={() => { const trimmed = blogTagInput.trim(); if (trimmed) { const tags = trimmed.split(",").map(t => t.trim()).filter(Boolean); setNewBlog(prev => { const cur = prev.tags || []; const upd = [...cur]; tags.forEach(t => { if (!upd.includes(t)) upd.push(t); }); return { ...prev, tags: upd }; }); setBlogTagInput(""); } }} className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 rounded-lg font-bold cursor-pointer">+ Add</button>
                </div>
                {(() => {
                  const RECOMMENDED_TAGS = ["Grooming", "Diet", "Wellness", "Science", "Skin Care", "Holistic", "Clinicals", "Botanicals", "Nutrition", "Shedding", "Anatomy", "Sensitive Claws", "Safety"];
                  const available = RECOMMENDED_TAGS.filter(t => !(newBlog.tags || []).includes(t));
                  if (!available.length) return null;
                  return (
                    <div className="space-y-1 pt-1.5 border-t border-stone-200/65 dark:border-stone-850">
                      <span className="text-[10px] text-stone-400 font-mono block">Recommended tags (click to add):</span>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white/70 dark:bg-stone-950/45 border border-stone-200/60 dark:border-stone-850 rounded-lg max-h-[110px] overflow-y-auto">
                        {available.map(tag => (
                          <button key={tag} type="button" onClick={() => setNewBlog(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }))} className="text-[10.5px] bg-[#FAF9F5] dark:bg-stone-850 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 rounded-md px-2 py-0.75 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 transition-all cursor-pointer font-medium">+ {tag}</button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Content editor */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-stone-500 font-mono font-bold text-teal-700 dark:text-teal-400">Detailed Article Content (Supports Markdown)</label>
                <button type="button" onClick={() => setNewBlog(prev => ({ ...prev, content: `# Soothing Golden Elixir Ritual\nThis is a standard template demonstrating how Markdown styles render.\n\n### 🌟 Key Ingredients\n* **Organic Cottage Cheese**: High in bio-available calcium.\n* **Steamed Spinach**: Rich in iron and dietary fibers.\n\n### 🍲 Quick Preparation\n1. Steam baby spinach for 2 minutes.\n2. Combine soft rice with crumbled cottage cheese.\n3. Stir and serve warm.\n\n*Safety Tip: Introduce any new botanicals gradually.*` }))} className="text-[10px] text-teal-700 hover:text-teal-800 border border-teal-200 bg-teal-50 dark:bg-stone-900 dark:border-teal-900/60 dark:text-teal-400 px-2 py-1 rounded font-bold cursor-pointer transition flex items-center gap-1 font-mono">
                  <Plus className="h-3 w-3" /> Insert Markdown Template
                </button>
              </div>
              <textarea required rows={10} value={newBlog.content || ""} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} placeholder="### Why organic oatmeal excels..." className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-[12px] text-stone-800 dark:text-stone-250 p-3.5 font-mono rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" />
            </div>
            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-wider block">✨ Live Reading Preview</span>
              <div className="bg-stone-50 dark:bg-stone-950 border border-dashed border-stone-250 dark:border-stone-800 p-4 rounded-xl min-h-[140px] max-h-[320px] overflow-y-auto">
                {newBlog.content ? <MarkdownRenderer content={newBlog.content} /> : <span className="text-xs text-stone-400 font-mono block italic text-center py-10">Start writing above to preview...</span>}
              </div>
            </div>
            <div className="flex justify-end items-center gap-2 pt-2">
              {editingBlogId && (
                <button type="button" onClick={() => { setEditingBlogId(null); setNewBlog({ title: "", summary: "", content: "", author: "Dr. Kabir Sen", imageUrl: "", category: "Nourishment", readTime: "5 min read", galleryImages: [], tags: [] }); setBlogTagInput(""); }} className="bg-stone-150 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition">Cancel Edit</button>
              )}
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition">
                {editingBlogId ? "Save Article Changes" : "Publish Premium Article"}
              </button>
            </div>
          </form>

          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-stone-500 font-mono uppercase mb-4 tracking-wider">Published Care Library ({blogs.length})</h3>
            <div className="divide-y divide-stone-150 dark:divide-stone-800">
              {blogs.map((bl) => (
                <div key={bl.id} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img src={bl.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <span className="text-[8px] bg-teal-50 dark:bg-[#1C2E2B] text-teal-800 dark:text-teal-400 font-bold uppercase px-1.5 py-0.5 rounded mr-1.5 font-mono">{bl.category || "General"}</span>
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 inline-block align-middle">{bl.title}</h4>
                      <p className="text-[10px] text-stone-400">By {bl.author} • {bl.createdAt} • {bl.readTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setEditingBlogId(bl.id); setNewBlog({ title: bl.title, summary: bl.summary, content: bl.content, author: bl.author, imageUrl: bl.imageUrl, category: bl.category || "Nourishment", readTime: bl.readTime || "5 min read", galleryImages: bl.galleryImages || [], tags: bl.tags || [] }); document.getElementById("cms-blogs-manager")?.scrollIntoView({ behavior: "smooth" }); }} className="text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 p-2 rounded-lg transition cursor-pointer" title="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteDoc("blogs", bl.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-lg transition cursor-pointer" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ COUPONS TAB ═══════════════════ */}
      {activeTab === "coupons" && (
        <div id="cms-coupons-manager" className="space-y-6">
          <form id="cms-add-coupon-form" onSubmit={handleAddCoupon} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Percent className="h-4 w-4 text-teal-600" />
              Configure Active Promotion Coupon Code
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Code</label>
                <input type="text" required value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="e.g. MONSOON25" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Discount %</label>
                <input type="number" value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Max Cap (INR)</label>
                <input type="number" value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 font-mono">Min Basket Value (INR)</label>
                <input type="number" value={newCoupon.minCartValue} onChange={(e) => setNewCoupon({ ...newCoupon, minCartValue: Number(e.target.value) })} className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 text-xs px-3.5 py-2.5 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="cms-coupon-freeship"
                checked={!!newCoupon.isFreeShipping}
                onChange={(e) => setNewCoupon({ ...newCoupon, isFreeShipping: e.target.checked })}
                className="rounded border-stone-300 text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
              />
              <label htmlFor="cms-coupon-freeship" className="text-[11px] text-stone-600 dark:text-stone-400 select-none font-semibold">
                This coupon unlocks Free Delivery 🚚 (Shipping becomes ₹0 for orders meeting the Min Basket Value)
              </label>
            </div>


            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl block ml-auto">Add Coupon Offer</button>
          </form>
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-stone-500 font-mono uppercase mb-4 tracking-wider">Active Promotional Coupons ({coupons.length})</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-150 dark:border-stone-850 pb-2 text-stone-400 font-mono text-[10px]">
                  <th className="py-2">Code</th><th className="py-2">Discount</th><th className="py-2">Cap</th><th className="py-2">Min Cart</th><th className="py-2 text-right">Delete</th>
                </tr>
              </thead>
              <tbody>

                {console.log('orders', coupons)}
                {coupons.map((c) => (
                  <tr key={c.code} className="border-b border-stone-100 dark:border-stone-900/50">
                    <td className="py-2.5 font-bold text-teal-750">{c.code}</td>
                    <td className="py-2.5 font-mono text-stone-700 dark:text-stone-300">
                      {c.isFreeShipping ? (
                        <span className="text-teal-600 font-bold bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded border border-teal-200/50">
                          FREE DELIVERY 🚚
                        </span>
                      ) : (
                        `${c.discountPercent}% OFF`
                      )}
                    </td>
                    <td className="py-2.5 font-mono">₹{c.maxDiscount}</td>
                    <td className="py-2.5 font-mono">₹{c.minCartValue}</td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => handleDeleteDoc("coupons", c.code)} className="text-stone-400 hover:text-red-500 p-1 rounded transition"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════ ORDERS TAB ═══════════════════ */}
      {activeTab === "orders" && (
        <div id="cms-orders-manager" className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-stone-100 dark:border-stone-900 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-teal-600" />
                Order Fulfillment Console ({orders.length})
              </h3>
              {console.log('orders', orders)}
              {orders.length > 0 && (
                <button type="button" onClick={() => setShowClearOrdersModal(true)} className="bg-red-55/10 hover:bg-red-50 text-red-600 dark:bg-rose-950/20 dark:text-rose-450 font-mono text-[9px] uppercase font-bold py-1 px-2 rounded-lg border border-red-200/50 dark:border-rose-900/40 transition cursor-pointer flex items-center gap-1 shrink-0">
                  <Trash2 className="h-3 w-3" /> Delete All
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:self-end">
              <div className="relative">
                <span className="absolute inset-y-0 left-2.5 flex items-center text-stone-400 text-[10px]">🔍</span>
                <input type="text" placeholder="Query ID, name, items..." value={adminOrderSearch} onChange={(e) => setAdminOrderSearch(e.target.value)} className="text-[11px] pl-7 pr-6 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500 w-48 text-stone-900 dark:text-stone-100" />
                {adminOrderSearch && <button onClick={() => setAdminOrderSearch("")} className="absolute inset-y-0 right-2 flex items-center text-stone-400 hover:text-stone-700 text-[10px]">✕</button>}
              </div>
              <select value={adminOrderStatusFilter} onChange={(e) => setAdminOrderStatusFilter(e.target.value)} className="text-[11px] bg-stone-50 dark:bg-stone-905 border border-stone-200 dark:border-stone-800 rounded-lg px-2 py-1.5 font-bold outline-hidden cursor-pointer text-stone-700 dark:text-stone-300">
                <option value="All">All Statuses</option>
                <option value="Order Received">Order Received</option>
                <option value="AWB Generated">AWB Generated</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          {(() => {
            let filtered = [...orders];
            if (adminOrderStatusFilter !== "All") filtered = filtered.filter(o => o.shippingStatus === adminOrderStatusFilter);
            if (adminOrderSearch.trim()) {
              const q = adminOrderSearch.toLowerCase().trim();
              filtered = filtered.filter(o =>
                o.orderId.toLowerCase().includes(q) ||
                o.shippingDetails?.name?.toLowerCase().includes(q) ||
                o.shippingDetails?.city?.toLowerCase().includes(q) ||
                o.shippingDetails?.phone?.toLowerCase().includes(q) ||
                o.items?.some(it => it.productName.toLowerCase().includes(q))
              );
            }
            const sorted = [...filtered].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            return (
              <div className="space-y-4">
                {sorted.map((o) => (
                  <div key={o.orderId} className="border border-stone-150 dark:border-stone-800 rounded-xl p-4 bg-stone-50/50 dark:bg-stone-900/40 relative overflow-hidden">
                    <span className={`absolute top-0 right-0 w-2.5 h-full ${o.shippingStatus === "Delivered" ? "bg-emerald-500" : o.shippingStatus === "Cancelled" ? "bg-red-500" : "bg-amber-400"}`}></span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-3">
                      <div>
                        <h4 className="font-bold text-xs font-mono text-stone-905">{o.orderId}</h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">Paid via <span className="font-bold">{o.paymentMethod}</span> ({o.paymentStatus}) on {new Date(o.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0 font-mono">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400">Total:</span>
                        <span className="text-xs font-bold text-teal-700">₹{o.totalAmount}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider flex items-center justify-between">
                          Receiver Address
                          {editingAddressOrderId !== o.orderId && (
                            <button onClick={() => handleStartEditingAddress(o)} className="text-teal-700 dark:text-teal-450 hover:underline text-[9px] font-bold cursor-pointer ml-auto">Edit Address</button>
                          )}
                        </p>
                        {editingAddressOrderId === o.orderId ? (
                          <div className="space-y-1.5 bg-stone-100 dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 mt-1">
                            <input type="text" value={editAddressForm.name} onChange={(e) => setEditAddressForm({ ...editAddressForm, name: e.target.value })} placeholder="Recipient Name" className="w-full text-[10px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-850 text-stone-900 dark:text-stone-100 rounded p-1 outline-none font-bold" />
                            <input type="tel" maxLength={10} value={editAddressForm.phone} onChange={(e) => setEditAddressForm({ ...editAddressForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="Phone (10 digits)" className="w-full text-[10px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-850 text-stone-900 dark:text-stone-100 rounded p-1 outline-none font-mono" />
                            <input type="text" value={editAddressForm.address} onChange={(e) => setEditAddressForm({ ...editAddressForm, address: e.target.value })} placeholder="Street Address" className="w-full text-[10px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-850 text-stone-900 dark:text-stone-100 rounded p-1 outline-none" />
                            <div className="grid grid-cols-3 gap-1">
                              <input type="text" value={editAddressForm.city} onChange={(e) => setEditAddressForm({ ...editAddressForm, city: e.target.value })} placeholder="City" className="text-[10px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-850 text-stone-900 dark:text-stone-100 rounded p-1 outline-none" />
                              <input type="text" value={editAddressForm.state} onChange={(e) => setEditAddressForm({ ...editAddressForm, state: e.target.value })} placeholder="State" className="text-[10px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-850 text-stone-900 dark:text-stone-100 rounded p-1 outline-none" />
                              <input type="text" value={editAddressForm.pinCode} onChange={(e) => setEditAddressForm({ ...editAddressForm, pinCode: e.target.value })} placeholder="Pin" className="font-mono text-[10px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-850 text-stone-900 dark:text-stone-100 rounded p-1 outline-none" />
                            </div>
                            <div className="flex justify-end gap-1 pt-1">
                              <button type="button" onClick={() => setEditingAddressOrderId(null)} className="bg-stone-300 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[9px] px-2 py-0.5 rounded cursor-pointer">Cancel</button>
                              <button type="button" onClick={() => handleSaveOrderAddress(o.orderId)} className="bg-teal-700 text-white text-[9px] px-2 py-0.5 rounded font-bold cursor-pointer">Save</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-semibold text-stone-800 dark:text-stone-250">{o.shippingDetails?.name || "No recipient name specified"}</p>
                            <p className="text-stone-500 text-[11px] leading-relaxed line-clamp-2">
                              {o.shippingDetails
                                ? `${o.shippingDetails.address || ""}, ${o.shippingDetails.city || ""}, ${o.shippingDetails.state || ""} (${o.shippingDetails.pinCode || ""})`
                                : "No address specified"}
                            </p>
                            <p className="text-stone-500 text-[11px]">Phone: {o.shippingDetails?.phone || "N/A"}</p>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider mb-1">Purchased Products</p>
                        <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400">
                          {o.items.map((it, idx) => (
                            <li key={idx} className="line-clamp-1">• {it.productName} ({it.selectedSize}) x <span className="font-bold font-mono">{it.quantity}</span></li>
                          ))}
                        </ul>
                      
                      </div>
                      <div className="bg-white dark:bg-stone-950 p-3 rounded-lg border border-stone-150 dark:border-stone-800 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider mb-1">Logistics Progress</p>
                          <div className="flex items-center gap-1.5 font-bold text-teal-800 font-mono text-[11px] mb-2"><Truck className="h-3 w-3" />{o.shippingStatus}</div>
                          {o.awbNumber && <p className="text-[10px] text-stone-400 font-mono pb-1">AWB: <span className="font-semibold text-stone-600">{o.awbNumber}</span></p>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {o.shippingStatus === "Order Received" && <button onClick={() => handleAdjustOrderStatus(o.orderId, "AWB Generated")} className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[9px] px-2 py-1 rounded-md hover:opacity-80 transition font-mono cursor-pointer">Generate AWB</button>}
                          {o.shippingStatus === "AWB Generated" && <button onClick={() => handleAdjustOrderStatus(o.orderId, "In Transit")} className="bg-teal-600 text-white text-[9px] px-2 py-1 rounded-md hover:bg-teal-700 transition font-mono cursor-pointer">Ship Cargo</button>}
                          {o.shippingStatus === "In Transit" && <button onClick={() => handleAdjustOrderStatus(o.orderId, "Delivered")} className="bg-emerald-600 text-white text-[9px] px-2 py-1 rounded-md hover:bg-emerald-700 transition font-mono animate-pulse cursor-pointer">Mark Delivered</button>}
                          {o.shippingStatus !== "Delivered" && o.shippingStatus !== "Cancelled" && <button onClick={() => handleAdjustOrderStatus(o.orderId, "Cancelled")} className="bg-red-50 text-red-600 text-[9px] px-2.5 py-1 rounded-md hover:bg-red-100 transition font-mono cursor-pointer">Cancel</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sorted.length === 0 && (
                  <div className="text-center py-10 bg-stone-50/40 dark:bg-stone-900/10 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                    <p className="text-xs text-stone-450 dark:text-stone-400 font-mono">No orders found matching the filter specs.</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ═══════════════════ REVIEWS TAB ═══════════════════ */}
      {activeTab === "reviews" && (
        <div id="cms-reviews-manager" className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-605" />
            Reviews Moderation Console ({reviews.length})
          </h3>
          <p className="text-xs text-stone-500 mb-4 bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-lg border border-stone-150 dark:border-stone-800">
            Reviews enter a <strong>pending</strong> state. Approve or reject them below.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-150 dark:border-stone-850 text-stone-400 font-mono text-[10px] uppercase">
                  <th className="py-2.5">Product</th><th className="py-2.5">User</th><th className="py-2.5">Rating</th><th className="py-2.5">Comment</th><th className="py-2.5">Status</th><th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 dark:divide-stone-800 text-stone-600 dark:text-stone-300">
                {console.log('', reviews)}
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3 font-semibold text-stone-900 dark:text-stone-105">{rev.productName}</td>
                    <td className="py-3"><p className="font-bold text-stone-800 dark:text-stone-200">{rev.userName}</p><p className="text-[10px] text-stone-405 font-mono">{rev.userEmail}</p></td>
                    <td className="py-3 font-bold text-amber-500 font-mono flex items-center gap-1"><Star className="h-3 w-3 fill-current" />{rev.rating}/5</td>
                    <td className="py-3 text-stone-650 dark:text-stone-300 max-w-xs truncate">{rev.comment}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${rev.status === "approved" ? "bg-emerald-50 text-emerald-800" : rev.status === "rejected" ? "bg-red-50 text-red-650" : "bg-amber-50 text-amber-655"}`}>{rev.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        {rev.status !== "approved" && <button onClick={() => handleModerateReview(rev.id, "approved")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-2.5 py-1 rounded transition cursor-pointer">Approve</button>}
                        {rev.status !== "rejected" && <button onClick={() => handleModerateReview(rev.id, "rejected")} className="bg-red-50 hover:bg-red-100 text-red-600 text-[9px] font-bold px-2.5 py-1 rounded transition cursor-pointer">Reject</button>}
                        <button onClick={() => handleDeleteDoc("reviews", rev.id)} className="hover:bg-red-50 hover:text-red-600 p-1.5 rounded text-stone-400"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-stone-400 text-xs italic font-mono">No reviews yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════ USERS TAB ═══════════════════ */}
      {activeTab === "users" && (
        <div id="cms-users-manager" className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-4">
            <Users className="h-4.5 w-4.5 text-teal-605" />
            Registered Client Accounts ({users.length})
          </h3>
          <p className="text-xs text-stone-500 mb-4 bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-lg border border-stone-150 dark:border-stone-800">
            Live registered users synchronized from Firestore. Dynamic entries sync instantly as customers register.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-150 dark:border-stone-850 text-stone-400 font-mono text-[10px] uppercase">
                  <th className="py-2.5">User ID</th><th className="py-2.5">Details</th><th className="py-2.5">Role</th><th className="py-2.5">Registered</th><th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 dark:divide-stone-800 text-stone-600 dark:text-stone-300">
                {users.map((usr: any, idx: number) => (
                  <tr key={usr.userId || usr.id || `usr-row-${idx}`} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3 font-mono text-[10px] text-stone-400 font-bold max-w-[120px] truncate">{usr.userId || usr.id || "N/A"}</td>
                    <td className="py-3"><p className="font-bold text-stone-800 dark:text-stone-200">{usr.name || "Elite Client"}</p><p className="text-[10px] text-stone-405 font-mono">{usr.email || "N/A"}</p></td>
                    <td className="py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${usr.role === "admin" ? "bg-purple-100 text-purple-850" : "bg-teal-55 text-teal-850"}`}>{usr.role || "customer"}</span></td>
                    <td className="py-3 font-mono text-[10px]">{usr.createdAt ? new Date(usr.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "May 2026"}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => { const uid = usr.userId || usr.id; const name = usr.name || "Elite Client"; const email = usr.email || "N/A"; setUserToDelete({ id: uid, name, email }); }} className="hover:bg-red-50 hover:text-red-650 p-1.5 rounded text-stone-400 inline-flex cursor-pointer" title="Delete user"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-stone-400 text-xs italic font-mono">No users found. Seed the database first!</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════ NEWSLETTER TAB ═══════════════════ */}
      {activeTab === "newsletter" && (
        <div id="cms-newsletter-manager" className="space-y-6 animate-fade-in text-left">
          {/* Email Template Editor */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-900 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-teal-600 animate-pulse" />
                  Responsive HTML Email Template Editor
                </h3>
                <p className="text-xs text-stone-500 mt-1">Customize the HTML layout and subject of the coupon welcome email sent to new subscribers.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={fetchEmailTemplate} className="p-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-300 transition" disabled={loadingTemplate}><RefreshCw className={`h-4 w-4 ${loadingTemplate ? "animate-spin" : ""}`} /></button>
                <button type="button" onClick={handleResetTemplate} className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer" disabled={resettingTemplate}>
                  <RotateCcw className="h-3.5 w-3.5" /> Restore Defaults
                </button>
              </div>
            </div>
            {loadingTemplate ? (
              <div className="py-12 text-center text-stone-400 text-xs font-mono flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-6 w-6 text-teal-600 animate-spin" />
                <span>Loading template from Firestore...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">Subject Line Copy</label>
                    <input type="text" value={templateSubject} onChange={(e) => setTemplateSubject(e.target.value)} placeholder="Welcome to the Elite Circle!" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500 transition" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase font-mono tracking-wider">HTML Layout Editor</label>
                      <span className="text-[10px] bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1"><Code className="h-3 w-3" /> Inline CSS Enabled</span>
                    </div>
                    <textarea value={templateHtml} onChange={(e) => setTemplateHtml(e.target.value)} spellCheck={false} className="w-full h-96 bg-stone-950 text-stone-200 border border-stone-800 rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500 transition cursor-text select-text" />
                  </div>
                  <div className="bg-stone-50 dark:bg-stone-900/40 border border-stone-150 dark:border-stone-850 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-stone-150 dark:border-stone-850"><Info className="h-3.5 w-3.5 text-teal-600" /> Dynamic Placeholder Cheat Sheet</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                      <div className="bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-150 dark:border-stone-900">
                        <span className="text-[#115E59] dark:text-[#2DD4BF] font-extrabold font-mono text-[11px] block">{`\${discountCode}`}</span>
                        <span className="text-[10px] text-stone-400 font-sans">Renders current active coupon e.g. "PAWWCIOUS5"</span>
                      </div>
                      <div className="bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-150 dark:border-stone-900">
                        <span className="text-[#115E59] dark:text-[#2DD4BF] font-extrabold font-mono text-[11px] block">{`\${email}`}</span>
                        <span className="text-[10px] text-stone-400 font-sans">Renders the subscriber's email dynamically</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={handleSaveTemplate} className="w-full inline-flex items-center justify-center gap-2 bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold py-3 rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" disabled={savingTemplate}>
                    <Database className="h-4 w-4" />
                    {savingTemplate ? "Saving..." : "Save Template to Firestore"}
                  </button>
                </div>
                <div className="flex flex-col h-full border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-stone-50/50 dark:bg-stone-900/30">
                  <div className="bg-stone-100 dark:bg-stone-900 px-4 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"><Eye className="h-4 w-4 text-stone-500" /> Live Preview</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold font-mono bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 uppercase">PARENTS-VIEWPORT</span>
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-center min-h-[420px]">
                    <div className="w-full h-[420px] bg-white dark:bg-[#1E1C1A] rounded-xl border border-stone-200 dark:border-stone-850 overflow-hidden shadow-inner">
                      <iframe title="Template Sandbox" srcDoc={templateHtml ? templateHtml.replace(/\${discountCode}/g, "PAWWCIOUS5").replace(/\{\{discountCode\}\}/g, "PAWWCIOUS5").replace(/\${email}/g, "parent@pawwcious.vip").replace(/\{\{email\}\}/g, "parent@pawwcious.vip") : `<p style="padding:20px;font-family:monospace;color:#888;text-align:center;">No template defined.</p>`} className="w-full h-full border-0 select-text" sandbox="allow-same-origin" />
                    </div>
                  </div>
                  <div className="p-4 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-3">
                    <div className="flex items-center gap-1.5"><Send className="h-3.5 w-3.5 text-teal-600" /><span className="text-[10px] font-bold text-stone-600 dark:text-stone-300 uppercase font-mono tracking-wider">Template Deliverability Simulator</span></div>
                    <div className="flex gap-2">
                      <input type="email" value={testEmailAddress} onChange={(e) => setTestEmailAddress(e.target.value)} placeholder="Enter email for test..." className="flex-1 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-500 transition" />
                      <button type="button" onClick={handleSendTestEmail} className="bg-stone-900 hover:bg-stone-950 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-bold px-4 py-2 rounded-xl transition shrink-0 disabled:opacity-50 cursor-pointer" disabled={sendingTest}>{sendingTest ? "Testing..." : "Send Test"}</button>
                    </div>
                    <p className="text-[9px] text-stone-500 font-mono mt-1">* Triggers a test newsletter dispatch using the active template.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Outbox & Subscriptions */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-900 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2"><Mail className="h-4.5 w-4.5 text-teal-600" />VIP Circle Outbox & Subscriptions</h3>
                <p className="text-xs text-stone-500 mt-1">Manage sent coupon newsletters and delivery alerts.</p>
              </div>
              <button type="button" onClick={fetchSentEmails} className="inline-flex items-center gap-2 bg-[#EBF5F0] hover:bg-[#D1EBE0] text-[#115E59] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer" disabled={loadingEmails}>
                <RefreshCw className={`h-3.5 w-3.5 ${loadingEmails ? "animate-spin" : ""}`} />
                {loadingEmails ? "Synchronizing..." : "Refresh Outbox"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-xl p-4">
                <p className="text-[10px] text-stone-400 font-mono uppercase">Newsletter Emails</p>
                <p className="text-2xl font-bold text-[#115E59] dark:text-[#2DD4BF] font-sans mt-0.5">{sentEmails.filter(e => e.type === "newsletter").length}</p>
              </div>
              <div className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-xl p-4">
                <p className="text-[10px] text-stone-400 font-mono uppercase">Total Outbox Queue</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-sans mt-0.5">{sentEmails.length}</p>
              </div>
              <div className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-xl p-4">
                <p className="text-[10px] text-stone-400 font-mono uppercase">Delivery Success Rate</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-450 font-sans mt-0.5">100%</p>
              </div>
            </div>
            <div className="overflow-x-auto border border-stone-150 dark:border-stone-850 rounded-xl bg-white dark:bg-stone-950">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-400">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-150 dark:border-stone-850">
                    <th className="py-2.5 px-4">Mail ID</th><th className="py-2.5 px-4">Email</th><th className="py-2.5 px-4">Subject & Type</th><th className="py-2.5 px-4">Sent</th><th className="py-2.5 px-4 text-center">Status</th><th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {sentEmails.map((mail: any) => (
                    <tr key={mail.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="py-3 px-4 font-mono text-[10px] text-stone-400 font-bold">{mail.id}</td>
                      <td className="py-3 px-4 font-semibold text-stone-800 dark:text-stone-200">{mail.to}</td>
                      <td className="py-3 px-4"><p className="font-bold text-stone-900 dark:text-stone-100">{mail.subject}</p><span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block ${mail.type === "newsletter" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-teal-50 text-teal-700 border border-teal-200"}`}>{mail.type}</span></td>
                      <td className="py-3 px-4 font-mono text-[10px] text-stone-500">{mail.timestamp || "Just now"}</td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-green-50 text-green-700 border border-green-200"><span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>{mail.status || "delivered"}</span></td>
                      <td className="py-3 px-4 text-right"><button type="button" onClick={() => setSelectedEmailBody(mail.body)} className="bg-stone-800 hover:bg-stone-950 dark:bg-stone-900 dark:hover:bg-white dark:hover:text-stone-950 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition">View HTML</button></td>
                    </tr>
                  ))}
                  {sentEmails.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-stone-400 text-xs italic font-mono">No email activity yet. Subscribe via the homepage to generate records.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Persistent Subscribers */}
          <div className="bg-[#FAF9F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/60 dark:border-stone-850/60 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="p-1 px-2 bg-teal-50 text-teal-700 text-[10px] font-mono font-bold rounded-md uppercase">LIVE DATABASE</span>
                  Persistent VIP Newsletter Subscribers
                </h3>
                <p className="text-xs text-stone-500 mt-1">Subscribers saved in Firestore "newsletters" collection.</p>
              </div>
              <button type="button" onClick={fetchSubscribers} className="inline-flex items-center gap-2 bg-[#EBF5F0] hover:bg-[#D1EBE0] text-[#115E59] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer" disabled={loadingSubscribers}>
                <RefreshCw className={`h-3.5 w-3.5 ${loadingSubscribers ? "animate-spin" : ""}`} />
                {loadingSubscribers ? "Refreshing DB..." : "Refresh Database"}
              </button>
            </div>
            <div className="overflow-x-auto border border-stone-150 dark:border-stone-850 rounded-xl bg-white dark:bg-stone-950">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-400">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-150 dark:border-stone-850">
                    <th className="py-2.5 px-4">Document ID</th><th className="py-2.5 px-4">Email</th><th className="py-2.5 px-4">Source</th><th className="py-2.5 px-4">Enrolled</th><th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {subscribers.map((sub: any) => (
                    <tr key={sub.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="py-3 px-4 font-mono text-[10px] text-stone-450">{sub.id}</td>
                      <td className="py-3 px-4 font-bold text-stone-900 dark:text-stone-100">{sub.email}</td>
                      <td className="py-3 px-4 text-stone-500 font-medium">{sub.source || "VIP Pawwcious Circle"}</td>
                      <td className="py-3 px-4 text-stone-500">{sub.createdAt ? new Date(sub.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "May 2026"}</td>
                      <td className="py-3 px-4 text-right"><button type="button" onClick={() => handleDeleteSubscriber(sub.id)} className="text-stone-400 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition inline-flex items-center"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-stone-400 text-xs italic font-mono">No subscribers yet. Submit the newsletter form on the live site.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ ENQUIRIES TAB ═══════════════════ */}
      {activeTab === "enquiries" && (
        <div id="cms-enquiries-manager" className="space-y-6 animate-fade-in text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Total Enquiries</span>
              <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-sans mt-1 block">{enquiries.length}</span>
            </div>
            <div className="bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-600 dark:text-amber-450 font-bold block">Unread / Active</span>
              <span className="text-2xl font-bold text-amber-805 dark:text-amber-300 font-sans mt-1 block">{enquiries.filter(e => e.status !== "resolved").length}</span>
            </div>
            <div className="bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-900/40 p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-450 font-bold block">Resolved</span>
              <span className="text-2xl font-bold text-emerald-805 dark:text-emerald-350 font-sans mt-1 block">{enquiries.filter(e => e.status === "resolved").length}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-900 pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2"><Mail className="h-4.5 w-4.5 text-teal-600" />Premium Contact Registry ("Enquiry Carriage")</h3>
                <p className="text-[11px] text-stone-450 mt-1">View, triage, and resolve product concerns submitted through the Contact Page.</p>
              </div>
              <button type="button" onClick={fetchEnquiries} className="inline-flex items-center gap-2 bg-[#EBF5F0] hover:bg-[#D1EBE0] text-[#115E59] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer" disabled={loadingEnquiries}>
                <RefreshCw className={`h-3.5 w-3.5 ${loadingEnquiries ? "animate-spin" : ""}`} />
                {loadingEnquiries ? "Refreshing..." : "Refresh Enquiries"}
              </button>
            </div>
            <div className="space-y-4">
              {enquiries.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-stone-200 dark:border-stone-850 rounded-2xl bg-stone-50/30">
                  <Mail className="h-10 w-10 text-stone-300 mx-auto mb-2.5" />
                  <p className="text-stone-500 font-medium text-xs font-mono">No enquiries logged yet.</p>
                  <p className="text-[10px] text-stone-400 font-sans mt-1">Direct customers to the "Contact Us" form to submit queries.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enquiries.map((enq: any) => (
                    <div key={enq.id} className={`border p-5 rounded-2xl space-y-3.5 transition-all text-left flex flex-col justify-between ${enq.status === "resolved" ? "bg-stone-50/60 dark:bg-stone-950/40 border-stone-200 dark:border-stone-900 opacity-80" : "bg-white dark:bg-stone-950 border-teal-100 dark:border-teal-950 shadow-xs ring-1 ring-teal-500/10"}`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-mono text-stone-400 font-bold bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850 px-2 py-0.5 rounded-md">ID: {enq.id}</span>
                          <span className={`text-[9.5px] uppercase tracking-wider font-mono font-bold px-2.5 py-1 rounded-full border ${enq.status === "resolved" ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900" : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900"}`}>{enq.status === "resolved" ? "Resolved" : "Unread"}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50">{enq.firstName} {enq.lastName}</h4>
                          <span className="text-[10.5px] text-stone-450 font-mono block mt-0.5">Email: <strong className="text-stone-700 dark:text-stone-300 font-sans">{enq.email}</strong></span>
                          {enq.phone && <span className="text-[10.5px] text-stone-450 font-mono block">Phone: <strong className="text-stone-700 dark:text-stone-300 font-sans">{enq.phone}</strong></span>}
                          <div className="inline-flex items-center gap-1.5 bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 rounded-lg px-2 py-1 mt-2 text-[10.5px] text-stone-600 dark:text-stone-350">
                            <span className="font-mono text-stone-450">Pet:</span>
                            <span className="font-bold underline decoration-indigo-400/40 text-stone-700 dark:text-stone-250 capitalize">{enq.petType}</span>
                            {enq.petName && <><span className="opacity-40">•</span><span className="font-mono text-stone-450">Name:</span><span className="font-bold font-sans text-stone-805 dark:text-stone-200">"{enq.petName}"</span></>}
                          </div>
                        </div>
                        <div className="border-t border-stone-100 dark:border-stone-900 pt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-teal-800 bg-teal-50 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-900 px-2 py-0.5 rounded">Category: {enq.subject}</span>
                            <span className="text-[9.5px] text-stone-400 font-mono ml-auto">{enq.createdAt ? new Date(enq.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Recently"}</span>
                          </div>
                          <div className="bg-stone-50 dark:bg-stone-900 p-3 rounded-lg border border-stone-150 dark:border-stone-850/60">
                            <p className="text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300 italic whitespace-pre-wrap font-sans">"{enq.message}"</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-stone-100 dark:border-stone-900 mt-2">
                        {enq.status !== "resolved" ? (
                          <button type="button" onClick={() => handleUpdateEnquiryStatus(enq.id, "resolved")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xs transition cursor-pointer">✓ Mark as Resolved</button>
                        ) : (
                          <button type="button" onClick={() => handleUpdateEnquiryStatus(enq.id, "unread")} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xs transition cursor-pointer">↺ Reopen Enquiry</button>
                        )}
                        <button type="button" onClick={() => handleDeleteEnquiry(enq.id)} className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 text-[11px] font-semibold py-1.5 px-3.5 rounded-lg border border-red-200/50 dark:border-red-900/60 transition flex items-center justify-center cursor-pointer"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ EMAIL PREVIEW MODAL ═══════════════════ */}
      {selectedEmailBody && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in" onClick={() => setSelectedEmailBody(null)}>
          <div className="w-full max-w-3xl bg-stone-100 rounded-3xl p-6 shadow-2xl text-left scale-100 transition-opacity duration-300 relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h4 className="text-sm font-bold text-stone-800 font-mono uppercase tracking-wider">Simulated HTML Email Viewer</h4>
              <button type="button" onClick={() => setSelectedEmailBody(null)} className="p-1 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto rounded-2xl border border-stone-200 bg-stone-50 shadow-inner">
              <div className="p-4 bg-[#FAF9F5] rounded-xl" dangerouslySetInnerHTML={{ __html: selectedEmailBody }} />
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
              <button type="button" onClick={() => setSelectedEmailBody(null)} className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md">Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ USER DELETE CONFIRMATION MODAL ═══════════════════ */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-fade-in" onClick={() => setUserToDelete(null)}>
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-205 dark:border-stone-800 rounded-2xl p-6 shadow-2xl text-left scale-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-full text-red-600 dark:text-red-400"><Trash2 className="h-6 w-6 animate-pulse" /></div>
              <div>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">Confirm Profile Deletion</h4>
                <p className="text-xs text-stone-500 mt-1">This action permanently deletes the user profile and cannot be undone.</p>
              </div>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-xl p-3.5 space-y-2 mb-6 text-xs">
              <div className="flex justify-between"><span className="text-stone-400 font-mono text-[10px] uppercase">User ID:</span><span className="font-mono text-stone-700 dark:text-stone-305 font-bold truncate max-w-[180px]">{userToDelete.id}</span></div>
              <div className="flex justify-between"><span className="text-stone-400 font-mono text-[10px] uppercase">Name:</span><span className="text-stone-800 dark:text-stone-200 font-semibold">{userToDelete.name}</span></div>
              <div className="flex justify-between"><span className="text-stone-400 font-mono text-[10px] uppercase">Email:</span><span className="font-mono text-stone-700 dark:text-stone-305 font-medium">{userToDelete.email}</span></div>
            </div>
            <div className="flex items-center justify-end gap-3.5">
              <button type="button" onClick={() => setUserToDelete(null)} className="px-4 py-2 text-xs font-semibold text-stone-605 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-xl cursor-pointer">No, Keep Account</button>
              <button type="button" onClick={async () => { const uid = userToDelete.id; setUserToDelete(null); await handleDeleteDoc("users", uid, true); }} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl shadow-lg transition cursor-pointer">Yes, Permanently Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ GENERIC ITEM DELETE CONFIRMATION MODAL ═══════════════════ */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-fade-in" onClick={() => setItemToDelete(null)}>
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-205 dark:border-stone-800 rounded-2xl p-6 shadow-2xl text-left scale-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-600 dark:text-rose-400"><Trash2 className="h-6 w-6 animate-pulse" /></div>
              <div>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">Confirm Deletion</h4>
                <p className="text-xs text-stone-500 mt-1">Are you sure you want to delete this {itemToDelete.collection.replace(/s$/, "")}? This will purge it across all systems.</p>
              </div>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-xl p-3.5 space-y-2 mb-6 text-xs font-mono">
              <div className="flex justify-between gap-4"><span className="text-stone-400 uppercase text-[10px]">Type:</span><span className="font-bold text-teal-600 dark:text-teal-400 lowercase">{itemToDelete.collection}</span></div>
              <div className="flex justify-between gap-4"><span className="text-stone-400 uppercase text-[10px]">ID:</span><span className="text-stone-600 dark:text-stone-300 truncate max-w-[200px]">{itemToDelete.id}</span></div>
              <div className="flex justify-between gap-4 font-sans"><span className="text-stone-400 font-mono uppercase text-[10px]">Title:</span><span className="text-stone-800 dark:text-stone-200 font-semibold text-right truncate max-w-[200px]">{itemToDelete.title}</span></div>
            </div>
            <div className="flex items-center justify-end gap-3 font-sans">
              <button type="button" onClick={() => setItemToDelete(null)} className="px-4 py-2 text-xs font-semibold text-stone-605 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-xl cursor-pointer">Cancel</button>
              <button type="button" onClick={async () => {
                const coll = itemToDelete.collection;
                const itemId = itemToDelete.id;
                setItemToDelete(null);
                await handleDeleteDoc(coll, itemId, true);
                if (coll === "banners" && editingBannerId === itemId) { setEditingBannerId(null); setNewBanner({ title: "", subtitle: "", imageUrl: "", ctaLink: "#shop", ctaText: "Buy Now" }); }
                if (coll === "blogs" && editingBlogId === itemId) { setEditingBlogId(null); setNewBlog({ title: "", summary: "", content: "", author: "Dr. Kabir Sen", imageUrl: "", category: "Nourishment", readTime: "5 min read", galleryImages: [], tags: [] }); }
                if (coll === "products" && editingProductId === itemId) { setEditingProductId(null); setNewProduct({ name: "", tagline: "", description: "", price: 299, originalPrice: 399, stock: 10, category: "grooming-hygiene", imageUrl: "", sizeVariants: ["Standard", "Premium"], sizePrices: {}, sizeOriginalPrices: {}, benefits: [], usage: [], galleryImages: [] }); }
              }} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl shadow-lg transition cursor-pointer">Yes, Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ BULK DELETE ORDERS MODAL ═══════════════════ */}
      {showClearOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-fade-in" onClick={() => setShowClearOrdersModal(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-205 dark:border-stone-800 rounded-2xl p-6 shadow-2xl text-left scale-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-rose-950/25 rounded-full text-red-650 dark:text-red-400"><Trash2 className="h-6 w-6 animate-pulse" /></div>
              <div>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">Purge All Orders?</h4>
                <p className="text-xs text-stone-500 mt-1">Are you absolutely sure you want to permanently clear all active order records?</p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-rose-950/20 border border-red-150 dark:border-rose-900/40 rounded-xl p-3 text-red-705 dark:text-rose-400 text-xs font-medium space-y-1">
              <p className="font-bold">⚠️ CRITICAL WARNING:</p>
              <p className="leading-relaxed">This will delete all <span className="font-bold font-mono">{orders.length}</span> live orders. This cannot be undone.</p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 font-sans">
              <button type="button" onClick={() => setShowClearOrdersModal(false)} className="px-4 py-2 text-xs font-semibold text-stone-605 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-105 transition hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-xl cursor-pointer">No, Keep Orders</button>
              <button type="button" onClick={handleDeleteAllOrders} className="bg-red-650 hover:bg-red-750 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl shadow-lg transition cursor-pointer">Yes, Purge Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}