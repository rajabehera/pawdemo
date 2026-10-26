import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Star,
  ArrowRight, Award, Truck, Percent, ShoppingBag,
  ShieldCheck, Check, Mail,
  Leaf, Feather, Smile, ChevronDown,
} from "lucide-react";
import { Product, Banner, Blog, Category, Testimonial, CartItem, Review, ReviewReel } from "../types";
const InteractiveBotanicalApothecary = lazy(() =>
  import("./InteractiveBotanicalApothecary").then((module) => ({
    default: module.InteractiveBotanicalApothecary,
  }))
);
// ─── Apothecary types ─────────────────────────────────────────────────────────


// NOTE: /_vercel/image?url=...&w=...&q=80 returns 404 under this project's
// current vercel.json, because the legacy catch-all route
// ({ "src": "/(.*)", "dest": "/dist/$1" }) intercepts the request before
// Vercel's built-in Image Optimization API can handle it. This was causing
// EVERY image on the site (products, categories, blogs, avatars, hero
// banner, etc.) to fail to load. Returning the direct path here restores all
// images. Properly enabling /_vercel/image would require migrating off the
// legacy builds/routes config to zero-config Vercel — a separate, larger
// task. The `w` param is kept (unused) so call sites don't need to change.
const vImg = (src: string, _w?: number) => src;


// ─── Props ────────────────────────────────────────────────────────────────────

interface HomepageProps {
  banners: Banner[];
  categories: Category[];
  bestSellers: Product[];
  blogs: Blog[];
  testimonials: Testimonial[];
  reviewReels?: ReviewReel[];
  onAddTestimonial?: (t: any) => void;
  onSelectCategory: (catId: string) => void;
  onSelectProduct: (p: Product) => void;
  onSelectView: (viewName: "shop" | "blog" | "about" | "contact") => void;
  onSelectBlog: (b: Blog) => void;
  products?: Product[];
  onAddToCart?: (item: CartItem) => void;
  onInstagramModalToggle?: (isOpen: boolean) => void;
  reviews?: Review[];
  onSelectProductReviews?: (p: Product) => void;
}
const InstagramReelsSection = lazy(() =>
  import("./InstagramReelsSection").then((module) => ({
    default: module.InstagramReelsSection,
  }))
);
// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTitleForMobile = (title: string) => {
  if (!title) return "";
  const words = title.split(" ");
  if (words.length <= 2) return <>{title}</>;
  const mid = Math.floor(words.length / 2);
  return (
    <>
      <span className="block sm:inline">{words.slice(0, mid).join(" ")}</span>
      <span className="hidden sm:inline"> </span>
      <span className="block sm:inline">{words.slice(mid).join(" ")}</span>
    </>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Homepage({
  banners,
  categories,
  bestSellers,
  blogs,
  testimonials,
  reviewReels = [],
  onAddTestimonial,
  onSelectCategory,
  onSelectProduct,
  onSelectView,
  onSelectBlog,
  products = [],
  onAddToCart,
  onInstagramModalToggle,
  reviews = [],
  onSelectProductReviews,
}: HomepageProps) {
  const heroBanners = React.useMemo(() => {
    return [...banners]
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 4);
  }, [banners]);



  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [cartFeedback, setCartFeedback] = useState<Record<string, boolean>>({});
  const [carouselReady, setCarouselReady] = useState(false);
  // Hero carousel swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (stableHeroBanners.length <= 1) return;
    if (touchStartX.current === null || touchEndX.current === null) return;

    const dist = touchStartX.current - touchEndX.current;

    if (dist > 50) {
      setActiveBannerIdx((p) => (p + 1) % stableHeroBanners.length);
    } else if (dist < -50) {
      setActiveBannerIdx((p) => (p - 1 + stableHeroBanners.length) % stableHeroBanners.length);
    }
  };
  useEffect(() => {
    setCarouselReady(true);
  }, []);
  // Auto-rotate hero



  // Review form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewPetName, setReviewPetName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  const handleSubmitLocalReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    const avatars = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ];
    const newTestimonial = {
      id: "user-testimonial-" + Date.now(),
      name: reviewName,
      petName: reviewPetName.trim() || "Indian Pet Parent",
      rating: reviewRating,
      text: reviewText,
      avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
    };
    onAddTestimonial?.(newTestimonial);
    setReviewName(""); setReviewPetName(""); setReviewRating(5); setReviewText("");
    setReviewSuccessMessage("Thank you! Your verified review is now actively flowing in the infinite sliding stream. 💖");
    setTimeout(() => { setReviewSuccessMessage(""); setIsReviewFormOpen(false); }, 3500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    // Note: /api/newsletter/subscribe already persists this to Firestore
    // ("newsletters" collection) server-side — no client-side Firestore
    // write needed here. Removing it also drops firebase/firestore from
    // this route's critical bundle.
    fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then(() => {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
        (window as any).showToast?.("Subscribed successfully to VIP Pawwcious Circle! 📧", "success");
        setTimeout(() => setNewsletterSubscribed(false), 5000);
      })
      .catch(() => {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
        setTimeout(() => setNewsletterSubscribed(false), 4500);
      });
  };
  const fallbackHeroBanner = {
    imageUrl: "/images/pawwcious_serum.webp",
    title: "Powered by Nature. Backed by Care.",
    subtitle: "Premium pet wellness made for everyday grooming comfort.",
    ctaText: "Shop Now",
  };

  const stableHeroBanners =
    heroBanners.length > 0 ? heroBanners : [fallbackHeroBanner];

  const currentHeroBanner =
    stableHeroBanners[activeBannerIdx] || fallbackHeroBanner;
  // ─── Render ───────────────────────────────────────────────────────────────────
  // ✅ Verify your interval useEffect looks like this — 5000ms
  useEffect(() => {
    if (!carouselReady || stableHeroBanners.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveBannerIdx((p) => (p + 1) % stableHeroBanners.length);
    }, 5000); // ← 5 seconds between slides

    return () => window.clearInterval(id);
  }, [carouselReady, stableHeroBanners.length]);
  return (
    <div id="homepage-root" className="space-y-8 py-2">

      {/* 1. Hero Slider — single persistent structure (no unmount/remount
          flash when banners finish loading). The same <img> element is used
          throughout: its src starts at the static fallback image
          (/images/pawwcious_coffeewood.webp, which matches the current
          banner #1) and only changes if the loaded CMS banner differs.
          Text content / CTA / dots are conditionally shown once banners are
          available, but the image itself never unmounts. */}
      <div
        id="homepage-hero-slider"
        className="relative h-[540px] sm:h-[560px] rounded-3xl overflow-hidden bg-stone-950 group border border-stone-850/60 select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/95 via-stone-950/20 to-stone-950/10 sm:bg-gradient-to-r sm:from-stone-950/100 sm:via-stone-950/90 sm:via-transparent sm:to-stone-950/20 z-10" />

       // ✅ REPLACE WITH — sliding strip
        <div
          className="absolute inset-0 flex"
          style={{
            width: `${stableHeroBanners.length * 100}%`,
            transform: `translateX(-${(activeBannerIdx * 100) / stableHeroBanners.length}%)`,
            transition: "transform 700ms cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        >
          {stableHeroBanners.map((banner, idx) => (
            <div
              key={idx}
              className="relative h-full"
              style={{ width: `${100 / stableHeroBanners.length}%` }}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding="async"
                width={1200}
                height={500}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-between py-10 px-6 sm:justify-center sm:py-0 sm:px-14 text-white max-w-xl">

          <div className="flex items-center gap-2 border border-amber-500/20 bg-stone-950/35 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400 stroke-[2.5px]" />
            <span className="text-[9px] font-mono tracking-[0.15em] text-amber-200/90 font-bold uppercase">
              Vet-Approved Wellness
            </span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif tracking-wide leading-tight text-white drop-shadow-md">
              {formatTitleForMobile(currentHeroBanner.title)}
            </h1>
            <div className="flex items-center gap-3 w-full max-w-[200px] py-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
              <Leaf className="h-3 w-3 text-amber-400/80 fill-amber-400/10" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
            </div>


            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans font-light max-w-md">
              {currentHeroBanner.subtitle}
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onSelectView("shop")}
                className="inline-flex items-center gap-2 bg-white hover:bg-amber-400 text-stone-950 font-extrabold text-xs px-6 py-3.5 rounded-2xl transition duration-350 shadow-lg shrink-0 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {currentHeroBanner.ctaText}
                <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
              </button>

              <button
                onClick={() => onSelectView("about")}
                className="hidden sm:inline-flex items-center gap-1.5 bg-stone-900/80 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white font-semibold text-xs px-5 py-3 rounded-2xl transition cursor-pointer"
              >
                Our Botanical Source
              </button>
            </div>
          </div>
        </div>

        {stableHeroBanners.length > 1 && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 z-20 flex gap-2">
            {stableHeroBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show promotion banner ${idx + 1}`}
                aria-current={activeBannerIdx === idx ? "true" : undefined}
                onClick={() => setActiveBannerIdx(idx)}
                className="min-h-11 min-w-11 inline-flex items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeBannerIdx === idx ? "w-8 bg-amber-400" : "w-8.5 bg-white/30"
                    }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Brand Philosophy */}
      <div id="homepage-philosophy-section" className="bg-[#FAF9F5]/40 rounded-3xl border border-stone-200/50 p-2 sm:p-4 space-y-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-40 text-teal-800/10" aria-hidden="true">
          <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
            <path d="M10 90 Q 50 65, 80 10 Q 75 40, 10 90 Z" stroke="currentColor" strokeWidth="0.75" />
            <path d="M45 55 Q 65 35, 75 20 M30 70 Q 50 50, 60 35 M20 80 Q 35 65, 45 50" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="80" cy="10" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute left-4 top-4 pointer-events-none opacity-20 text-teal-800/10" aria-hidden="true">
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
            <path d="M10 10 C 40 40, 60 70, 90 90 M90 90 C 70 60, 40 40, 10 10" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-4xl text-left space-y-4 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full font-bold uppercase block">India's First Pet Brand</span>
            <svg className="h-3 w-3 text-amber-500 animate-pulse" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-950 font-serif tracking-tight leading-tight select-none">
            Pawwcious is <span className="text-stone-400 font-medium line-through decoration-stone-300 decoration-2 font-sans">not a pet grooming brand</span>. It is the <span className="text-teal-950 border-b-2 border-[#115E59]/30 italic font-black">first Pet Wellness brand</span> in India.
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-medium leading-relaxed font-sans max-w-3xl">
            At Pawwcious, we go beyond surface grooming by supporting your pet’s skin barrier. India's humid climate can lead to hot spots, yeast infections, and tick-related skin issues. Our Ayurvedic-inspired wellness formulas use safe, active botanicals to help maintain healthy skin, balanced pH, and natural protection for long-term pet wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
          {[
            { src: "/images/natural_scientific_pillar_1780425068212.webp", alt: "Natural & Scientific Formulation Standards", icon: <Leaf className="h-4 w-4 text-emerald-700" />, title: "Natural & Scientific", desc: "True pet care starts with nature. Our pure plant-based ingredients feed wellness from inside out to protect long-term vitality.", left: "Bio-actives", right: "100% Pure" },
            { src: "/images/vet_approved_hover_1780425681420.webp", alt: "Vet Approved Safety Standards", icon: <ShieldCheck className="h-4 w-4 text-amber-600" />, title: "Vet Approved", desc: "Formulations evaluated and refined alongside top veterinarians for fully trusted, secure pathways.", left: "Clinical Core", right: "Approved" },
            { src: "/images/gentle_safe_hover.webp", alt: "Gentle and Safe Ingredient Standards", icon: <Feather className="h-4 w-4 text-teal-700" />, title: "Gentle and Safe", desc: "Nurturing sensitive claws and delicate skin. Pure, hypoallergenic nourishment with no harsh additives or fillers.", left: "Non-toxic", right: "Hypoallergenic" },
            { src: "/images/everyday_joy_hover_1780425716679.webp", alt: "Everyday Playful Bonding Joy", icon: <Smile className="h-4 w-4 text-indigo-700" />, title: "Everyday Joy", desc: "Pet routines turned into playful family bonding, encouraging happier days, closer ties, and active tail wags.", left: "Sensory Enrichment", right: "Vibrant" },
          ].map((card) => (
            <div key={card.title} className="bg-white/90 backdrop-blur-xs border border-stone-200/70 rounded-2xl overflow-hidden hover:border-[#134E4A]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between whitespace-normal text-left group">
              <div>
                <div className="aspect-square w-full bg-stone-100 overflow-hidden relative">
                  <img src={vImg(card.src, 600)} alt={card.alt} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                  <div className="absolute bottom-3 left-3 bg-[#FAF9F5] w-8 h-8 rounded-lg flex items-center justify-center border border-stone-200/60 shadow-xs z-10">
                    {card.icon}
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-extrabold text-sm text-stone-950 tracking-tight">{card.title}</h3>
                  <p className="text-[11.5px] text-stone-500 mt-2 leading-relaxed font-sans">{card.desc}</p>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-4 mt-auto border-t border-stone-100 pt-3 flex items-center justify-between text-[10px] text-stone-400 font-medium">
                <span>{card.left}</span>
                <span className="text-[#134E4A] font-bold">{card.right}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Best Sellers */}
      <div id="homepage-best-sellers" className="space-y-6 pt-2">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#134E4A] font-bold uppercase block">Popular Curations</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 font-serif italic tracking-wide">Best Sellers Selection</h2>
          </div>
          <button onClick={() => onSelectView("shop")} className="text-[11px] font-bold text-teal-800 hover:text-teal-900 underline underline-offset-4 decoration-teal-600/30 flex items-center gap-1 font-mono uppercase tracking-wider transition-colors cursor-pointer">
            Go to Shop <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex md:grid md:grid-cols-5 gap-4 pb-4 md:pb-2 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none">
          {bestSellers.slice(0, 5).map((prod) => {
            const approvedReviews = reviews.filter((r) => r.productId === prod.id && r.status === "approved");
            const reviewCount = approvedReviews.length;
            const averageRating = reviewCount > 0
              ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
              : (prod.rating || 4.8);
            const orig = prod.originalPrice || 0;
            const sale = prod.price || 0;
            const discountPct = orig > sale && orig > 0 ? Math.round(((orig - sale) / orig) * 100) : 0;

            return (
              <div
                key={prod.id}
                id={`prod-card-${prod.id}`}
                onClick={() => onSelectProduct(prod)}
                className="w-[78vw] sm:w-[45vw] md:w-auto min-w-[260px] md:min-w-0 shrink-0 snap-center bg-white border border-stone-200/80 rounded-2xl p-3.5 hover:shadow-lg cursor-pointer group flex flex-col justify-between hover:border-teal-600/20 transition-all duration-300"
              >
                <div>
                  <div className="aspect-square w-full bg-[#FAF9F5] rounded-xl overflow-hidden relative p-3 flex items-center justify-center">
                    <img src={vImg(prod.imageUrl, 600)} alt={prod.name} className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-[1.03] duration-305 transition-all" referrerPolicy="no-referrer" width={600} height={600} loading="lazy" decoding="async" />
                    {prod.id === "complete-grooming-pack" ? (
                      <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[8px] font-black px-2.5 py-1 rounded font-mono uppercase tracking-widest animate-pulse shadow-sm">🔥 SALE LIVE</span>
                    ) : (
                      <span className="absolute top-2.5 left-2.5 bg-stone-950 text-white text-[8px] font-black px-2 py-1 rounded font-mono uppercase tracking-widest">Best Seller ⭐</span>
                    )}
                    {discountPct > 0 && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider shadow-sm z-10">
                        -{discountPct}% OFF
                      </span>
                    )}
                  </div>
                  <div className="mt-4 space-y-1">
                    <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-widest block">{prod.category}</span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 leading-snug line-clamp-1 group-hover:text-teal-900 transition-colors uppercase tracking-tight">{prod.name}</h3>
                    <div
                      onClick={(e) => { e.stopPropagation(); onSelectProductReviews ? onSelectProductReviews(prod) : onSelectProduct(prod); }}
                      className="flex items-center gap-1 mt-1 hover:bg-stone-50 p-1 -ml-1 rounded-lg w-fit transition cursor-pointer group/rev"
                    >
                      <div className="flex text-amber-500 gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= Math.round(averageRating) ? "fill-current text-amber-500" : "text-stone-200"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-stone-800 font-mono mt-0.5">{averageRating}</span>
                      <span className="text-[10px] text-teal-800 group-hover/rev:text-teal-950 underline font-mono mt-0.5 font-bold">
                        ({reviewCount} verified {reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-400 font-mono line-through">₹{prod.originalPrice}</span>
                      <span className="font-extrabold text-xs sm:text-sm text-stone-950 font-mono">₹{prod.price}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart?.({ product: prod, quantity: 1, selectedSize: prod.sizeVariants?.[0] || "Standard" });
                      setCartFeedback((p) => ({ ...p, [prod.id]: true }));
                      setTimeout(() => setCartFeedback((p) => ({ ...p, [prod.id]: false })), 1500);
                    }}
                    className={`w-full mt-3 py-2 px-4 rounded-xl font-mono text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer border ${cartFeedback[prod.id]
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-teal-800 hover:bg-teal-950 border-teal-700/20 text-white hover:scale-[1.01]"
                      }`}
                  >
                    {cartFeedback[prod.id] ? (
                      <><Check className="h-3.5 w-3.5 stroke-[3]" /> Added to Bag!</>
                    ) : (
                      <><ShoppingBag className="h-3.5 w-3.5" /> Add to cart</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Shop by Concern */}
      <div id="homepage-categories-section" className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#134E4A] font-bold uppercase">Shop by Concern</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-stone-950 font-serif italic tracking-wide">Targeted Wellness Spheres</h2>
          </div>
          <button onClick={() => onSelectView("shop")} className="text-[11px] font-bold text-[#134E4A] hover:text-[#0f3d3a] underline underline-offset-4 font-mono uppercase tracking-wider transition-colors cursor-pointer">
            All Products
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const CATEGORY_IMAGES: Record<string, string> = {
              "grooming-hygiene": "/images/grooming-hygiene.webp",
              "coat-skin-wellness": "/images/coat-skin-wellness.webp",
              "chew-enrichment": "/images/chew-enrichment.webp",
            };
            return (
              <button
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative aspect-square w-full rounded-2xl overflow-hidden border border-stone-200 hover:border-[#134E4A]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-stone-100"
                aria-label={cat.name}
              >
                <img src={vImg(CATEGORY_IMAGES[cat.id] || "/images/logo.webp", 600)} alt={cat.name} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-550 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300 pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Interactive Botanical Apothecary */}
      <Suspense fallback={null}>
        <InteractiveBotanicalApothecary
          products={products}
          bestSellers={bestSellers}
          onSelectProduct={onSelectProduct}
          onSelectView={onSelectView}
        />
      </Suspense>

      {/* 6. Instagram & Reels Cinema — now a standalone component */}
      <Suspense fallback={null}>
        <InstagramReelsSection
          reviewReels={reviewReels}
          onInstagramModalToggle={onInstagramModalToggle}
        />
      </Suspense>
      {/* 7. Benefits row */}
      <div id="homepage-benefits" className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-stone-200/70 py-10">
        {[
          { icon: <Award className="h-5.5 w-5.5 text-emerald-700" />, bg: "bg-emerald-50 border-emerald-100", title: "100% organic", desc: "Sourced directly from 100% organic botanical fields. Zero synthetic fillers." },
          { icon: <ShieldCheck className="h-5.5 w-5.5 text-teal-800" />, bg: "bg-teal-50 border-teal-100", title: "Clinically Vet Evaluated", desc: "Formulated with precise clean measurements. Complete veterinary cellular safety verified." },
          { icon: <Truck className="h-5.5 w-5.5 text-amber-700" />, bg: "bg-amber-50 border-amber-100", title: "Preserved Secure Dispatch", desc: "Packed inside premium protected eco-boxes. Safely retains active botanical potency and pristine purity door-to-door across India." },
        ].map((b) => (
          <div key={b.title} className="flex gap-4 p-2">
            <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center border ${b.bg}`}>{b.icon}</div>
            <div>
              <h4 className="font-extrabold text-sm text-stone-900 tracking-tight">{b.title}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-1 font-sans">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 8. Blog previews */}
      <div id="homepage-blogs-preview" className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#134E4A] font-bold uppercase">Evidence Archives</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 font-serif italic tracking-wide">The Science of Grooming & Nutrition</h2>
          </div>
          <button onClick={() => onSelectView("blog")} className="text-[11px] font-bold text-teal-800 hover:text-teal-900 underline underline-offset-4 flex items-center gap-1 font-mono uppercase tracking-wider transition-colors cursor-pointer">
            All Guides <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div key={b.id} id={`blog-card-${b.id}`} onClick={() => onSelectBlog(b)} className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="h-84 bg-stone-50 overflow-hidden relative">
                <img src={vImg(b.imageUrl, 800)} alt={b.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-505" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                <span className="absolute top-3.5 left-3.5 bg-stone-950 text-white font-mono text-[8px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">{b.category}</span>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[9px] font-mono font-bold text-stone-400">{b.createdAt} • {b.readTime}</span>
                <h3 className="font-extrabold text-sm text-stone-900 leading-snug group-hover:text-teal-850 transition-colors line-clamp-1">{b.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">{b.summary}</p>
              </div>
              <div className="px-5 pb-5 flex items-center gap-1 text-[9px] font-bold text-teal-800 tracking-wider uppercase font-mono group-hover:underline">
                Read Veterinary File <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Testimonials marquee */}
      <div id="homepage-testimonials" className="space-y-8 py-4 relative z-15 select-none overflow-hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes testimonialScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
          .testimonial-marquee { display:flex; width:max-content; gap:1.5rem; animation:testimonialScroll 48s linear infinite; }
          .testimonial-marquee:hover { animation-play-state:paused; }
        ` }} />

        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/60 pb-5">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-block bg-[#EBF5F0] text-[#115E59] text-[9.5px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-full">Verified Google Reviews</span>
                <span className="text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-600 px-2.5 py-0.5 rounded-full font-mono uppercase font-black flex items-center gap-1 select-none">4.9 ★ Rating Page</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 font-serif italic tracking-wide">Loved by India's Modern Pet Parents</h2>
              <p className="text-[11px] text-stone-500 font-sans leading-normal">
                Authentic testimonials gathered via <a href="https://share.google/qNoUyLzfOAMgbFNh8" target="_blank" rel="noreferrer" className="text-[#134E4A] hover:underline font-extrabold">Google search highlights</a>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a href="https://g.page/r/CaeKhrnOdg0PEAE/review" target="_blank" rel="noreferrer" className="bg-stone-900 hover:bg-stone-850 text-white hover:text-amber-300 text-[10px] font-sans font-black uppercase tracking-wider px-4.5 py-3 rounded-2xl transition shadow-sm flex items-center gap-2 group cursor-pointer">
                <span>Write Google Review</span>
                <Star className="h-3.5 w-3.5 fill-current text-stone-200 group-hover:text-amber-300 transition" />
              </a>
              <button type="button" onClick={() => setIsReviewFormOpen(!isReviewFormOpen)} className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-[10px] font-sans font-black uppercase tracking-wider px-4.5 py-3 rounded-2xl transition shadow-sm flex items-center gap-2 cursor-pointer">
                <span>Add Quick Review</span>
                <Smile className="h-3.5 w-3.5 text-teal-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Review form */}
        {isReviewFormOpen && (
          <div className="max-w-xl mx-auto bg-[#FAF9F5]/90 border border-stone-200 rounded-3xl p-6 shadow-md my-4 animate-fade-in relative z-20 text-left">
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-stone-850 mb-1 flex items-center gap-2">
              <span>Write Your Testimonial</span>
              <span className="text-[9px] bg-teal-800/10 border border-teal-800/20 text-teal-800 px-2 rounded-full py-0.5 normal-case font-mono font-medium">Instantly Streams</span>
            </h3>
            <p className="text-[10.5px] text-stone-500 font-sans leading-relaxed mb-4">Your feedback is published directly to the sliding stream on this page.</p>
            {reviewSuccessMessage ? (
              <div className="bg-emerald-950/10 border border-emerald-500/35 text-emerald-800 rounded-2xl p-4 text-xs font-semibold text-center space-y-1">
                <p>{reviewSuccessMessage}</p>
                <p className="text-[10px] font-mono text-stone-400">Closing panel shortly...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLocalReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { label: "Your Full Name", placeholder: "e.g. Priyanshu Sharma", value: reviewName, onChange: setReviewName, required: true },
                    { label: "Pet Breed & City", placeholder: "e.g. Leo, Pug (Bengaluru)", value: reviewPetName, onChange: setReviewPetName, required: false },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[9.5px] font-semibold text-stone-700 uppercase tracking-wider block">{f.label}</label>
                      <input type="text" required={f.required} placeholder={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-semibold text-stone-700 uppercase tracking-wider block">Star Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewRating(s)} className="focus:outline-none transition-transform hover:scale-105">
                        <Star className={`h-5.5 w-5.5 ${s <= reviewRating ? "fill-amber-400 text-amber-500" : "text-stone-300"}`} />
                      </button>
                    ))}
                    <span className="text-[11px] font-mono font-bold text-stone-500 ml-1.5">{reviewRating} out of 5 stars</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-semibold text-stone-700 uppercase tracking-wider block">Review Comments</label>
                  <textarea required rows={3} placeholder="Describe your pet's experience with Pawwcious..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700 resize-none leading-relaxed" />
                </div>
                <div className="flex justify-end gap-2.5 pt-1.5">
                  <button type="button" onClick={() => setIsReviewFormOpen(false)} className="text-[10px] font-bold text-stone-500 hover:text-stone-850 px-4 py-2.5 rounded-xl transition cursor-pointer">Cancel</button>
                  <button type="submit" className="bg-teal-800 hover:bg-teal-900 text-white text-[10px] font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer">Submit Testimonial</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Marquee */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FAF9F5] via-[#FAF9F5]/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FAF9F5] via-[#FAF9F5]/30 to-transparent z-10 pointer-events-none" />
          <div className="testimonial-marquee">
            {[...testimonials, ...testimonials, ...testimonials].map((test, idx) => (
              <div key={`${test.id}-ticker-${idx}`} className="bg-white/95 border border-stone-200/80 rounded-3xl p-5 w-[265px] sm:w-[316px] shrink-0 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-teal-600 hover:ring-1 hover:ring-teal-600/35 transition duration-300 relative select-none text-left">
                <span className="absolute top-4.5 right-4.5 opacity-90 select-none">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                </span>
                <div className="space-y-2.5">
                  <div className="flex text-amber-500 gap-0.5 mt-1">
                    {[...Array(test.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans pr-1">"{test.text}"</p>
                </div>
                <div className="flex items-center gap-3 border-t border-stone-100/90 pt-3.5 mt-4">
                  <img src={vImg(test.avatarUrl, 80)} alt="" className="w-8 h-8 rounded-full object-cover border border-stone-200" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-[11px] text-stone-900 truncate flex items-center gap-1">
                      <span>{test.name}</span>
                      <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-1.5 rounded-full select-none shrink-0 font-medium font-sans">Verified</span>
                    </p>
                    <p className="text-[8px] text-stone-400 font-mono tracking-widest uppercase font-bold mt-0.5 truncate">{test.petName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. FAQ Accordion */}
      <section id="homepage-faq-section" className="py-12 md:py-20 border-t border-b border-stone-200/60" itemScope itemType="https://schema.org/FAQPage">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <div className="space-y-3">
              <span className="inline-block bg-[#EBF5F0] text-[#115E59] text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1.5 rounded-full">KNOWLEDGE MATRIX & SAFETY</span>
              <h2 className="text-2xl sm:text-4xl font-black font-serif italic text-stone-900 tracking-wide leading-none">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">Here's where all your burning questions find their answers. From quirky inquiries to the most technical veterinary ones.</p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 group bg-stone-100">
              <img src={vImg("/images/FAQ.webp", 600)} alt="Happy and healthy pet enjoying daily luxury wellness and care" className="w-full h-[280px] md:h-[380px] object-cover transition duration-705 group-hover:scale-[1.03]" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 to-transparent flex items-end p-5">
                <div className="text-white text-left">
                  <span className="text-[8px] font-mono uppercase text-amber-300 font-bold tracking-widest">TRANSPARENT ETHICS</span>
                  <p className="text-xs font-semibold leading-tight font-sans mt-0.5">Reviewed and endorsed by qualified veterinary scientists</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-[10px]">
            {[
              { q: "What makes Pawwcious products safe for pets?", a: "All Pawwcious products are crafted with natural, plant-based ingredients and carefully reviewed by veterinary experts. We avoid harsh chemicals and focus on gentle, effective solutions suitable for sensitive skin, paws, and ears. Every formulation undergoes strict quality checks to ensure safety. With transparency and trust at our core, pet parents can confidently use our products, knowing they support long-term wellness and daily happiness for their furry companions." },
              { q: "How often should I use Pawwcious products daily?", a: "Usage depends on the product type and your pet's needs. Generally, serums, ear washes, or powders can be used once or twice daily, following label instructions. Observe your pet's reaction and adjust accordingly. For personalized guidance, Pawwcious offers nutrition and wellness consultations, helping pet parents integrate products into daily routines effectively while ensuring safety, comfort, and consistent results in supporting overall health and happiness." },
              { q: "Are Pawwcious products suitable for all pet breeds?", a: "Yes! Our formulations are designed to be gentle and safe for a wide range of dog breeds and sizes. Whether small, medium, or large, sensitive or active, the products support skin, coat, and ear health. We emphasize natural ingredients that minimize risk of irritation. For pets with specific conditions, we recommend consulting our vet-approved guidelines or online support, ensuring every furry friend enjoys wellness safely." },
              { q: "Can Pawwcious help me with my pet's health and wellness?", a: "Absolutely! Pawwcious provides helpful guidance on nutrition, wellness, and product usage to support your pet's daily routine. We share tips on maintaining healthy skin, coat, and overall well-being, along with advice on integrating products safely into your pet's lifestyle. Our goal is to empower pet parents with useful information and ongoing support, helping you make choices that bring joy and comfort to your furry companions." },
              { q: "What should I feed my pet daily?", a: "A balanced diet is key to overall health. Include high-quality protein, healthy fats, fiber, and hydration appropriate for your pet's age, breed, and activity level. Avoid artificial additives or harmful human foods. Pawwcious also offers nutrition guidance and consultation, helping you tailor meals for optimal wellness. Regular monitoring, portion control, and supplementing with gentle, herbal products can support skin, coat, and internal health, keeping your pet active and happy." },
              { q: "Are Pawwcious products suitable for kittens or puppies?", a: "Yes, most Pawwcious products are formulated to be gentle enough for young pets. However, dosage and frequency should be adapted to age and weight. Avoid applying concentrated formulas directly without consultation. We recommend using our vet-guided instructions or online support to ensure safe, effective care for sensitive puppies or kittens. Gentle, herbal wellness products can help them develop healthy skin, coat, and daily comfort from the start." },
              { q: "How do I choose products for my pet?", a: "Start by observing your pet's needs, age, breed, and skin or coat sensitivity. Pawwcious products focus on natural, gentle care for everyday wellness. Look for ingredients that suit your pet's concerns, like dryness, irritation, or overheating. You can also consult our vet-approved guidelines or online experts to select the right products. Consistency ensures safe, effective results for your furry companion." },
              { q: "How often should I groom and bathe my dog naturally?", a: "Dogs should be groomed according to their breed, coat type, and activity level. Most pets do well with weekly brushing to remove loose hair and prevent matting. Bathing once every 2–4 weeks with gentle, herbal products keeps skin and fur healthy without stripping natural oils. Regularly check ears for wax or moisture and clean paws after walks. Combined with proper diet and hydration, this routine maintains healthy fur, strong paws, and clean ears naturally." },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} id={`faq-item-${idx}`} className="border-b border-stone-200/80 pb-[14px] transition-all duration-300" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between text-left gap-4 py-3 group cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-start gap-3.5 font-sans">
                      <span className="text-stone-900 font-mono text-sm leading-6 shrink-0 group-hover:text-[#115E59] transition-colors">{String(idx + 1).padStart(2, "0")}.</span>
                      <span itemProp="name" className={`text-sm sm:text-base font-bold group-hover:text-[#115E59] transition-colors leading-6 ${isOpen ? "text-[#115E59]" : "text-stone-900"}`}>{faq.q}</span>
                    </span>
                    <span className="p-1 rounded-full bg-stone-50 group-hover:bg-stone-100 shrink-0 mt-0.5 transition duration-200">
                      <ChevronDown className={`h-4 w-4 text-stone-500 transition-transform duration-350 ease-out ${isOpen ? "rotate-180 text-stone-900" : ""}`} />
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[350px] opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"}`} itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text" className="text-xs sm:text-sm text-stone-605 leading-relaxed font-sans pl-8 pr-4 select-text">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Newsletter */}
      <div id="homepage-newsletter" className="bg-[#111613] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 max-w-3xl mx-auto border border-yellow-600/30 shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.06),transparent)]" />
        <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Mail className="h-5.5 w-5.5" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto relative z-10">
          <h2 className="text-sm sm:text-lg font-black tracking-widest text-[#FCD34D] uppercase font-mono">The VIP Pawwcious Circle</h2>
          <p className="text-xs text-stone-300 leading-relaxed font-sans font-light">Join India's most exclusive pet wellness society. Receive veterinarian circulars, tailored coat care matrices, and elite front-line priority access to batch drops.</p>
        </div>
        {newsletterSubscribed ? (
          <div className="bg-[#18231C] border border-emerald-500/30 font-mono text-emerald-400 rounded-xl p-3.5 text-xs w-max mx-auto shadow-lg flex items-center gap-2 animate-bounce relative z-10">
            <Check className="h-4 w-4 stroke-[3px]" />
            Your elite position is secured! Welcome. ✨
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-4 relative z-10">
            <input
              type="email"
              required
              placeholder="Your email (e.g. aditya@mumbai.com)..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-805 text-white placeholder-stone-500 text-xs px-4.5 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all text-center sm:text-left"
            />
            <button type="submit" className="bg-amber-400 hover:bg-amber-300 hover:scale-[1.01] active:scale-[0.99] text-stone-950 text-xs font-black px-6 py-3 rounded-2xl shrink-0 transition duration-200">
              Secure Invitation
            </button>
          </form>
        )}
      </div>

      {/* 12. Trust badges */}
      <div className="bg-teal-900 text-white rounded-2xl p-6 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center select-none shadow-md">
        {[
          { icon: <Award className="h-7 w-7 text-amber-300 shrink-0" />, label: "ISO GMP 100% organic Labs" },
          { icon: <ShieldCheck className="h-7 w-7 text-amber-300 shrink-0" />, label: "Razorpay Encrypted Pay" },
          { icon: <Truck className="h-7 w-7 text-amber-300 shrink-0" />, label: "Delhivery Cooler Network" },
          { icon: <Percent className="h-7 w-7 text-amber-300 shrink-0" />, label: "GST Compliant Invoice" },
        ].map((b, i) => (
          <div key={i} className={`flex flex-col items-center space-y-1 ${i > 0 ? "border-l border-teal-700/60 pl-2" : ""}`}>
            {b.icon}
            <p className="text-[10px] sm:text-xs text-teal-100 tracking-wider font-mono uppercase">{b.label}</p>
          </div>
        ))}
      </div>

    </div>
  );
}