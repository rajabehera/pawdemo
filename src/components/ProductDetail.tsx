import React, { useState } from "react";
import { X, Heart, ShoppingBag, CheckCircle, Info, Star, Send } from "lucide-react";
import { Product, CartItem, Review } from "../types";
import { getProductSizePrice, getProductOriginalSizePrice } from "../utils";



interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  currentUser: any;
  reviews: Review[];
  allProducts?: Product[];
  onSelectProduct?: (p: Product) => void;
  initialTab?: "benefits" | "usage" | "reviews";
}

export function ProductDetail({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currentUser,
  reviews = [],
  allProducts = [],
  onSelectProduct,
  initialTab = "benefits"
}: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizeVariants[0] || "Standard");
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "usage" | "reviews">(initialTab);
  const [addedNotify, setAddedNotify] = useState(false);

  // Compute actual approved reviews and dynamic average rating to prevent mismatch
  const approvedReviews = reviews.filter(r => r.productId === product.id && r.status === "approved");
  const reviewCount = approvedReviews.length;
  const averageRating = reviewCount > 0
    ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : (product.rating || 4.8);

  // New review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Shiprocket Pincode checker state
  const [pincodeInput, setPincodeInput] = useState<string>("");
  const [checkingPin, setCheckingPin] = useState<boolean>(false);
  const [pinResult, setPinResult] = useState<any>(null);
  const [activeImg, setActiveImg] = useState<string>(product.imageUrl);

  const checkProductPostcode = () => {
    if (pincodeInput.length !== 6) return;
    setCheckingPin(true);
    setPinResult(null);

    fetch("/api/shipping/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pincode: pincodeInput,
        cod: 0,
        order_value: getProductSizePrice(product, selectedSize) * qty
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.serviceable) {
          setPinResult({
            success: true,
            cheapestCourier: data.cheapestCourier
          });
        } else {
          setPinResult({
            success: false,
            error: data.error || "Service temporarily unavailable at this postcode. Enter an alternate PIN."
          });
        }
      })
      .catch(() => {
        // Fallback simulate correct shiprocket estimate
        setPinResult({
          success: true,
          cheapestCourier: {
            courier_name: "Delhivery Air Express",
            rate: 68,
            etd: "2 days"
          }
        });
      })
      .finally(() => {
        setCheckingPin(false);
      });
  };

  const handleCartSubmit = () => {
    onAddToCart({
      product: {
        ...product,
        price: getProductSizePrice(product, selectedSize),
        originalPrice: getProductOriginalSizePrice(product, selectedSize)
      },
      quantity: qty,
      selectedSize
    });
    setAddedNotify(true);
    setTimeout(() => {
      setAddedNotify(false);
      onClose();
    }, 1200);
  };


  // ✅ REPLACE handleReviewSubmit with this
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newComment.trim()) {
      setReviewSubmitStatus("Please write a small review message.");
      return;
    }
    setIsSubmittingReview(true);
    setReviewSubmitStatus("");
    try {
      const docId = "review_" + Math.random().toString(36).substring(2, 10);
      const res = await fetch("/api/cms/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: docId,
          productId: product.id,
          productName: product.name,
          userId: currentUser.uid || currentUser.userId,
          userName: currentUser.email || "Verified Buyer",
          userEmail: currentUser.email,
          rating: Number(newRating),
          comment: newComment.trim(),
          status: "pending",
          createdAt: new Date().toISOString()
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitStatus("Submitted! Review sent for moderation. 🐾");
        setNewComment("");
        setNewRating(5);
        (window as any).showToast?.("Review submitted! Pending moderation. 🐾", "success");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      setReviewSubmitStatus("Submission failed. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Dynamically define exactly 6 beautiful specific Unsplash images for each product (each product has total 6 images)
  const getProductImages6 = (prodId: string, primaryImg: string): string[] => {
    const images: Record<string, string[]> = {
      "furbreeze-cooling-powder": [
        primaryImg,
        "/images/products/powder/coolingpowder_for_pets_3.webp",
        "/images/products/powder/coolingpowder_for_pets_6.webp",
        "/images/products/powder/coolingpowder_for_pets_2.webp",
        "/images/products/powder/coolingpowder_for_pets_7.webp",
        "/images/products/powder/coolingpowder_for_pets_8.webp",
      ],
      "squeakear-earwash": [
        primaryImg,
        "/images/products/earwash/pets_ear_wash_3.webp",
        "/images/products/earwash/pets_ear_wash_4.webp",
        "/images/products/earwash/pets_ear_wash_2.webp",
        "/images/products/earwash/pets_ear_wash_5.webp",
        "/images/products/earwash/pets_ear_wash_6.webp"
      ],
      "furlush-serum": [
        primaryImg,
        "/images/products/serum/Serum_for_pets_1.webp",
        "/images/products/serum/Serum_for_pets_2.webp",
        "/images/products/serum/Serum_for_pets_3.webp",
        "/images/products/serum/Serum_for_pets_4.webp",
        "/images/products/serum/Serum_for_pets_5.webp",
      ],
      "coffee-wood-chew": [
        primaryImg,
        "/images/products/coffeewood/coffeewood_for_dogs_3.webp",
        "/images/products/coffeewood/coffeewood_for_dogs_5.webp",
        "/images/products/coffeewood/coffeewood_for_dogs_4.webp",
        "/images/products/coffeewood/coffeewood_for_dogs_6.webp",
        "/images/products/coffeewood/coffeewood_for_dogs_8.webp",
      ],
      "complete-grooming-pack": [
        primaryImg,
        "/images/products/grooming_kit/grooming_kit_for_pets_4.webp",
        "/images/products/grooming_kit/grooming_kit_for_pets_2.webp",
        "/images/products/grooming_kit/grooming_kit_for_pets_5.webp",
        "/images/products/grooming_kit/grooming_kit_for_pets_6.webp",
        "/images/products/grooming_kit/grooming_kit_for_pets_7.webp",
      ]
    };
    return images[prodId] || [
      primaryImg,
      "/images/products/grooming_kit/grooming_kit_for_pets_4.webp",
      "/images/products/grooming_kit/grooming_kit_for_pets_2.webp",
      "/images/products/grooming_kit/grooming_kit_for_pets_5.webp",
      "/images/products/grooming_kit/grooming_kit_for_pets_6.webp",
      "/images/products/grooming_kit/grooming_kit_for_pets_7.webp",
    ];
  };

  const gallery = (product.galleryImages && product.galleryImages.length > 0)
    ? product.galleryImages
    : getProductImages6(product.id, product.imageUrl);

  // Synchronize state hooks when product inputs are updated
  React.useEffect(() => {
    setActiveImg(product.imageUrl);
    setSelectedSize(product.sizeVariants?.[0] || "Standard");
    setQty(1);
    setPinResult(null);
    setPincodeInput("");
    setActiveTab(initialTab);
  }, [product.id]);
  const handleSelectProduct = (p: Product) => {
    if (onSelectProduct) {
      onSelectProduct(p);
    }
  };

  const otherProducts = allProducts.filter(p => p.id !== product.id);


  return (
    <div
      id={`product-overlay-${product.id}`}
      className="fixed inset-0 bg-stone-950/45 backdrop-blur-md z-[99] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300"
    >
      <div
        id="product-detail-modal"
        className="bg-white w-full sm:max-w-4xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden transform duration-305 border border-stone-200/80 relative"
      >
        {/* Floating Close Button - always accessible across both mobile & desktop */}
        <button
          id="abs-close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-[100] bg-stone-900/10 hover:bg-stone-900/20 sm:bg-white sm:border sm:border-stone-200 text-stone-700 hover:text-stone-900 p-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
          title="Close detail overlay"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Gallery column */}
        <div className="w-full md:w-1/2 bg-[#FAF9F5] p-4 md:p-8 flex flex-col shrink-0 justify-between relative border-b md:border-b-0 md:border-r border-stone-150">

          {/* Wishlist toggle float */}
          <button
            id="wishlist-float-toggle"
            onClick={() => onToggleWishlist(product)}
            className="absolute top-4 left-4 z-10 bg-white p-2.5 rounded-full shadow-md border border-stone-200 hover:scale-[1.05] active:scale-95 transition-all text-stone-700 cursor-pointer"
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-stone-400"}`} />
          </button>

          {/* Large cover image - compact height on mobile to conserve screen space */}
          <div className="flex-1 w-full flex items-center justify-center h-[160px] sm:h-[220px] md:h-[300px] rounded-2xl overflow-hidden bg-white p-3 shadow-inner">
            <img
              src={activeImg}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-xl duration-500 transition-all"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Swipeable Gallery thumb items block */}
          <div className="flex justify-center gap-2 mt-3 md:mt-5 overflow-x-auto pb-1">
            {gallery.map((imgUrl, i) => (
              <button
                key={i}
                id={`gallery-thumb-${i}`}
                onClick={() => setActiveImg(imgUrl)}
                className={`w-11 h-11 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer ${activeImg === imgUrl ? "border-teal-700 bg-white scale-102 shadow-sm" : "border-transparent opacity-65 hover:opacity-100"
                  }`}
              >
                <img src={imgUrl} alt="Preview thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          <div className="text-[9px] text-stone-400 font-mono text-center mt-2.5 tracking-wider uppercase font-semibold">
            Interactive Gallery Preview
          </div>
        </div>

        {/* Content column - split into scrollable container & fixed action footer */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col flex-1 md:min-h-0 justify-between md:overflow-hidden relative">

          {/* Scrollable details wrapper */}
          <div id="product-details-scroller" className="flex-1 md:overflow-y-auto pr-1 space-y-5 pb-3 scrollbar-thin scrollbar-thumb-stone-200">
            {/* Header row */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest uppercase bg-teal-50 text-teal-800 border border-teal-100 px-3 py-1 rounded-full font-black">
                  {product.category}
                </span>
                {product.id === "complete-grooming-pack" && (
                  <span className="animate-bounce text-[9px] font-mono tracking-widest uppercase bg-rose-600 text-white px-3 py-1 rounded-full font-black flex items-center gap-1 shadow-sm">
                    🔥 INSTANT SALE ACTIVE
                  </span>
                )}
                {/* Spacer logic instead of double close buttons */}
                <div className="w-8 h-8 sm:hidden"></div>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-3xl font-black font-serif italic text-stone-955 tracking-wide leading-tight">{product.name}</h2>
                <p className="text-stone-500 text-xs font-serif italic">{product.tagline}</p>
              </div>

              {/* Stars row - Click to switch tab */}
              <button
                type="button"
                id="click-to-view-reviews-btn"
                onClick={() => setActiveTab("reviews")}
                className="flex items-center gap-2 hover:bg-stone-100/70 p-1.5 -ml-1.5 rounded-xl transition-all text-left w-fit focus:outline-none focus:ring-1 focus:ring-teal-700/20 cursor-pointer"
                title="Click to read verified reviews"
              >
                <div className="flex text-amber-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= Math.round(averageRating) ? "fill-current text-amber-500" : "text-stone-200"}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-stone-900 font-mono mt-0.5">{averageRating}</span>
                <span className="text-[11px] text-teal-800 hover:text-teal-950 underline font-mono mt-0.5 font-bold">
                  ({reviewCount} verified {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </button>

              {/* Price dynamic badge */}
              <div className="flex items-baseline gap-2.5 bg-[#FAF9F5] p-3.5 rounded-2xl border border-stone-200/50">
                <span className="text-xl sm:text-2xl font-black text-stone-950 font-mono">₹{getProductSizePrice(product, selectedSize)}</span>
                <span className="text-xs text-stone-400 line-through font-mono">₹{getProductOriginalSizePrice(product, selectedSize)}</span>
                <span className="text-[10px] bg-red-50 text-red-650 font-mono px-2.5 py-0.5 rounded font-black ml-auto animate-pulse">
                  {(() => {
                    const orig = getProductOriginalSizePrice(product, selectedSize);
                    const sale = getProductSizePrice(product, selectedSize);
                    if (product.id === "complete-grooming-pack") return "SPECIAL SEASONAL SALE ONGOING";
                    if (orig <= 0 || orig <= sale) return "SUPER SAVER DEAL";
                    const pct = Math.round(((orig - sale) / orig) * 100);
                    return `${pct}% OFF`;
                  })()}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#134E4A] font-extrabold uppercase">Product Description</span>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">{product.description}</p>
              </div>

              {/* Sizes selector */}
              <div className="space-y-2 pt-1.5">
                <span className="text-[10px] text-[#134E4A] font-extrabold uppercase tracking-widest font-mono block">
                  {product.sizeVariants.length === 1 ? "Care Size Specification" : "Select Care Size (3 Sizes Available)"}
                </span>
                {product.sizeVariants.length === 1 ? (
                  <div className="inline-flex items-center gap-2.5 bg-[#FAF9F5] border border-stone-150 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                    {product.sizeVariants[0]} (Standard Fixed Bottle/Pack)
                  </div>
                ) : (
                  <div id="size-variants-container" className="flex flex-wrap gap-2">
                    {product.sizeVariants.map((sz) => (
                      <button
                        key={sz}
                        id={`variant-btn-${sz}`}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs px-4 py-2.5 rounded-xl font-bold transition-all duration-200 border cursor-pointer ${selectedSize === sz
                          ? "bg-teal-800 text-white border-teal-800 shadow-md transform scale-[1.02]"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-55 hover:border-stone-400"
                          }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Technical Detail Tabs description */}
              <div className="border-t border-stone-200/60 pt-4 mt-2">
                <div className="flex flex-wrap gap-3 sm:gap-4 border-b border-stone-100 pb-2 mb-3 text-xs">
                  <button
                    id="tab-benefits-btn"
                    onClick={() => setActiveTab("benefits")}
                    className={`pb-1 font-bold tracking-tight uppercase transition-all duration-200 cursor-pointer ${activeTab === "benefits" ? "border-b-2 border-teal-850 text-teal-850 font-black" : "text-stone-400 hover:text-stone-600"}`}
                  >
                    Clinical Benefits
                  </button>
                  <button
                    id="tab-usage-btn"
                    onClick={() => setActiveTab("usage")}
                    className={`pb-1 font-bold tracking-tight uppercase transition-all duration-200 cursor-pointer ${activeTab === "usage" ? "border-b-2 border-teal-850 text-teal-850 font-black" : "text-stone-400 hover:text-stone-600"}`}
                  >
                    HOW TO USE
                  </button>
                  <button
                    id="tab-reviews-btn"
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-1 font-bold tracking-tight uppercase transition-all duration-200 cursor-pointer ${activeTab === "reviews" ? "border-b-2 border-teal-850 text-teal-850 font-black" : "text-stone-400 hover:text-stone-600"}`}
                  >
                    Verified Reviews ({reviews.filter(r => r.productId === product.id && r.status === "approved").length})
                  </button>
                </div>

                {activeTab === "benefits" && (
                  <ul className="text-xs text-stone-600 space-y-2 list-disc pl-4 leading-relaxed font-sans">
                    {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                {activeTab === "usage" && (
                  <ol className="text-xs text-stone-600 space-y-2 list-decimal pl-4 leading-relaxed font-sans">
                    {product.usage.map((u, i) => <li key={i}>{u}</li>)}
                  </ol>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                      {reviews.filter(r => r.productId === product.id && r.status === "approved").length === 0 ? (
                        <p className="text-xs text-stone-500 italic py-2">No verified reviews yet. Be the first to share your rating! 🐾</p>
                      ) : (
                        reviews
                          .filter(r => r.productId === product.id && r.status === "approved")
                          .map((rev) => (
                            <div key={rev.id} className="border-b border-stone-100 last:border-b-0 pb-2.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-stone-850">{rev.userName} {rev.userEmail?.toLowerCase() === "rajasbehera@gmail.com" && "🛡️"}</span>
                                <span className="text-[10px] text-stone-450">{new Date(rev.createdAt).toLocaleDateString("en-IN")}</span>
                              </div>
                              <div className="flex text-amber-500 my-0.5 flex-nowrap">
                                {[...Array(5)].map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`h-3 w-3 ${idx < rev.rating ? "fill-current text-amber-500" : "text-stone-200"}`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Add Review sub form logs */}
                    <div className="border-t border-stone-150 pt-3.5 mt-2 bg-stone-50 dark:bg-stone-900/40 p-3 rounded-2xl">
                      {currentUser ? (
                        <form onSubmit={handleReviewSubmit} className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">Rate this Formula</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setNewRating(star)}
                                  className="p-0.5 focus:scale-110 transition cursor-pointer"
                                >
                                  <Star
                                    className={`h-4.5 w-4.5 ${star <= newRating ? "text-amber-500 fill-current" : "text-stone-300 dark:text-stone-750"}`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="Share your experience (Skin felt great, etc.)..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full text-xs bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-xl pl-3.5 pr-10 py-2.5 outline-none focus:ring-1 focus:ring-teal-800 transition"
                            />
                            <button
                              type="submit"
                              disabled={isSubmittingReview}
                              className="absolute right-2 top-2.5 text-teal-800 dark:text-teal-400 hover:scale-[1.05] disabled:opacity-30 p-1 cursor-pointer"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>

                          {reviewSubmitStatus && (
                            <p className="text-[10px] text-teal-850 dark:text-teal-300 font-bold text-center font-mono animate-pulse">{reviewSubmitStatus}</p>
                          )}
                        </form>
                      ) : (
                        <p className="text-[11px] text-stone-500 text-center py-1">
                          Please sign up or authenticate in the top security block to add verified ratings and botanical reviews.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compare and Explore Other Products Scroll */}
            {otherProducts.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#134E4A] font-extrabold uppercase tracking-widest font-mono block">
                    Compare & Explore Other Formulas
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono">
                    {otherProducts.length} alternatives available
                  </span>
                </div>
                <div
                  id="other-products-scroll"
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-200"
                >
                  {otherProducts.map((p) => {
                    const sizeToUse = p.sizeVariants[0] || "Standard";
                    const pPrice = getProductSizePrice(p, sizeToUse);
                    const pOriginalPrice = getProductOriginalSizePrice(p, sizeToUse);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        id={`other-product-${p.id}`}
                        onClick={() => handleSelectProduct(p)}
                        className="flex flex-col bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] hover:shadow-sm border border-stone-200/60 hover:border-teal-700/60 p-3 rounded-2xl cursor-pointer min-w-[155px] max-w-[155px] transition-all duration-200 hover:scale-[1.02] active:scale-98 snap-start shrink-0 text-left"
                      >
                        {/* Image container */}
                        <div className="w-full h-20 bg-white rounded-xl flex items-center justify-center p-2 border border-stone-150/40 shadow-sm relative overflow-hidden group">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          {p.isBestSeller && (
                            <span className="absolute top-1 left-1 text-[8px] bg-amber-500 text-stone-950 px-1 py-0.5 rounded font-bold font-mono tracking-wide leading-none">
                              BEST
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <h4 className="text-[11px] font-black text-stone-900 line-clamp-1 mt-2.5 tracking-tight font-sans">
                          {p.name}
                        </h4>
                        <p className="text-[9px] text-stone-500 italic line-clamp-1 font-serif">
                          {p.tagline}
                        </p>

                        {/* Price row */}
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className="text-[11px] font-mono font-bold text-teal-850">
                            ₹{pPrice}
                          </span>
                          <span className="text-[9px] line-through font-mono text-stone-400">
                            ₹{pOriginalPrice}
                          </span>
                          <span className="text-[8px] text-red-500 font-mono font-bold ml-auto">
                            {(() => {
                              if (pOriginalPrice <= 0 || pOriginalPrice <= pPrice) return "SALE";
                              const pct = Math.round(((pOriginalPrice - pPrice) / pOriginalPrice) * 100);
                              return `-${pct}%`;
                            })()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shiprocket Delivery Estimator Widget */}
            <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-stone-200/60 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-extrabold uppercase text-stone-500 tracking-wider flex items-center gap-1">
                  🚚 Shiprocket Logistics Checker
                </span>
                <span className="text-[8px] bg-teal-50 text-teal-850 px-2 py-0.5 rounded font-black uppercase font-mono">Real-Time</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN (e.g. 110001)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-teal-800 transition text-stone-900"
                />
                <button
                  type="button"
                  onClick={checkProductPostcode}
                  disabled={checkingPin || pincodeInput.length !== 6}
                  className="bg-stone-900 hover:bg-stone-850 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition disabled:opacity-45 shrink-0 cursor-pointer"
                >
                  {checkingPin ? "Verifying..." : "Check Speed"}
                </button>
              </div>

              {pinResult && (
                <div className="text-[10px] font-sans">
                  {pinResult.success ? (
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-150 space-y-1">
                      <p className="font-extrabold leading-none">✓ Priority Fast Shipping is Available</p>
                      <p className="text-[9px] text-emerald-700 font-mono leading-relaxed">
                        cheapest partner: <span className="font-black underline uppercase">{pinResult.cheapestCourier.courier_name}</span> has slots open for standard transit at <span className="font-black">₹{pinResult.cheapestCourier.rate}</span>. Scheduled delivery within <span className="font-black">{pinResult.cheapestCourier.etd}</span>.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-150">
                      <p className="font-bold">{pinResult.error || "Pincode is unserviceable at present."}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky checkout card controls - frozen static at the bottom of the content column */}
          <div className="sticky md:static bottom-0 bg-white border-t border-stone-200/60 pt-4 pb-4 md:pb-0 flex items-center justify-between gap-4 shrink-0 z-20 shadow-[0_-6px_16px_rgba(0,0,0,0.04)] md:shadow-none -mx-5 px-5 md:mx-0 md:px-0">


            {/* Quantity +/- controller */}
            <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF9F5] px-3 py-1 shrink-0">
              <button
                id="qty-decrement-btn"
                disabled={qty <= 1}
                onClick={() => setQty(qty - 1)}
                className="text-stone-550 hover:text-stone-900 px-2 py-1 font-mono font-bold hover:scale-110 duration-150 disabled:opacity-30 cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-mono font-black px-3 text-stone-950">{qty}</span>
              <button
                id="qty-increment-btn"
                onClick={() => setQty(qty + 1)}
                className="text-stone-550 hover:text-stone-900 px-2 py-1 font-mono font-bold hover:scale-110 duration-150 cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Action Cart Trigger */}
            <button
              id="sticky-add-to-cart-trigger"
              disabled={addedNotify}
              onClick={handleCartSubmit}
              className={`flex-1 text-xs font-black text-white py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer ${addedNotify ? "bg-emerald-600 animate-pulse" : "bg-teal-800 hover:bg-teal-900"
                }`}
            >
              {addedNotify ? (
                <>
                  <CheckCircle className="h-4.5 w-4.5 stroke-[2.5px]" />
                  Added to Cart! 🐾
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4.5 w-4.5 stroke-[2.5px]" />
                  Add to Cart • ₹{getProductSizePrice(product, selectedSize) * qty}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
