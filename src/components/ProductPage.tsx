import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  ShoppingBag,
  ShoppingCart, 
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  Package,
  Leaf,
  ChevronRight,
  ChevronLeft,
  MapPin,
  HouseHeart,
  Camera,
} from "lucide-react";
import { Product, CartItem, Review } from "../types";
import { getProductSizePrice, getProductOriginalSizePrice } from "../utils";
import {
  getProductSlug,
  getProductRoute,
  CANONICAL_PRODUCT_CONFIGS,
  normalizeProductDetails,
} from "../productRoutes";
import VideoCard from "./VideoCard";

/* ─────────────────────────────────────────────────────────────────────────
   GALLERY IMAGES — 7 dedicated, separately named images per product.
   File naming convention:  <product_name>_<1-7>.png  inside /assets/images
   ───────────────────────────────────────────────────────────────────────── */

// Furlush Serum
import furlushSerum1 from "../assets/images/furlush_serum_1.png";
import furlushSerum2 from "../assets/images/furlush_serum_2.png";
import furlushSerum3 from "../assets/images/furlush_serum_3.png";
import furlushSerum4 from "../assets/images/furlush_serum_4.png";
import furlushSerum5 from "../assets/images/furlush_serum_5.png";
import furlushSerum6 from "../assets/images/furlush_serum_6.png";
import furlushSerum7 from "../assets/images/furlush_serum_7.png";
import founder from "../assets/images/founder.webp";

// Squeakear Earwash
import squeakearEarwash1 from "../assets/images/squeakear_earwash_1.png";
import squeakearEarwash2 from "../assets/images/squeakear_earwash_2.png";
import squeakearEarwash3 from "../assets/images/squeakear_earwash_3.png";
import squeakearEarwash4 from "../assets/images/squeakear_earwash_4.png";
import squeakearEarwash5 from "../assets/images/squeakear_earwash_5.png";
import squeakearEarwash6 from "../assets/images/squeakear_earwash_6.png";

// Furbreeze Heat Cooling Powder
import furbreezePowder1 from "../assets/images/furbreeze_cooling_powder_1.png";
import furbreezePowder2 from "../assets/images/furbreeze_cooling_powder_2.png";
import furbreezePowder3 from "../assets/images/furbreeze_cooling_powder_3.png";
import furbreezePowder4 from "../assets/images/furbreeze_cooling_powder_4.png";
import furbreezePowder5 from "../assets/images/furbreeze_cooling_powder_5.png";
import furbreezePowder6 from "../assets/images/furbreeze_cooling_powder_6.png";
import furbreezePowder7 from "../assets/images/furbreeze_cooling_powder_7.png";

// Coffee Wood Chew
import coffeeWoodChew1 from "../assets/images/coffee_wood_chew_1.png";
import coffeeWoodChew2 from "../assets/images/coffee_wood_chew_2.png";
import coffeeWoodChew3 from "../assets/images/coffee_wood_chew_3.png";
import coffeeWoodChew4 from "../assets/images/coffee_wood_chew_4.png";
import coffeeWoodChew5 from "../assets/images/coffee_wood_chew_5.png";
import coffeeWoodChew6 from "../assets/images/coffee_wood_chew_6.png";
import coffeeWoodChew7 from "../assets/images/coffee_wood_chew_7.png";

// Complete Grooming Pack
import groomingPack1 from "../assets/images/complete_grooming_pack_1.png";
import groomingPack2 from "../assets/images/complete_grooming_pack_2.png";
import groomingPack3 from "../assets/images/complete_grooming_pack_3.png";
import groomingPack4 from "../assets/images/complete_grooming_pack_4.png";
import groomingPack5 from "../assets/images/complete_grooming_pack_5.png";
import groomingPack6 from "../assets/images/complete_grooming_pack_6.png";
import groomingPack7 from "../assets/images/complete_grooming_pack_7.png";

/* ─────────────────────────────────────────────────────────────────────────
   Roadmap timeline styles.
   Mobile: vertical timeline (unchanged).
   ≥ 768px: the SAME markup turns into a 3-column card grid.
   ───────────────────────────────────────────────────────────────────────── */
const css = `
.roadmap {
  --bg: var(--pp-bg);
  --green-dark: var(--pp-brand);
  --green-mid: var(--pp-mid);
  --green-pale: var(--pp-tint);
  --line: var(--pp-border);
  --muted: var(--pp-muted);

  background: var(--bg);
  padding: 20px 24px;
  max-width: 640px;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Verdana, system-ui, sans-serif;
}
.roadmap .step { display: flex; gap: 20px; }
.roadmap .step-track {
  position: relative; flex: 0 0 52px; display: flex;
  flex-direction: column; align-items: center;
}
.roadmap .step-track b {
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--green-pale); color: var(--green-mid);
  font-size: 18px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.roadmap .step:not(:last-child) .step-track::after {
  content: ""; position: absolute; top: 60px; bottom: -10px;
  width: 2px; border-radius: 2px; background: var(--line);
}
.roadmap .step-text { padding: 4px 0; }
.roadmap .step:last-child .step-text { padding-bottom: 4px; }
.roadmap .step-text h3 {
  margin: 0 0 6px; font-size: 20px; line-height: 1.3;
  font-weight: 700; color: var(--green-dark);
}
.roadmap .step-text p {
  margin: 0; font-size: 14px; line-height: 1.55; color: var(--muted);
}
@media (max-width: 480px) {
  .roadmap { padding: 16px; }
  .roadmap .step { gap: 14px; }
  .roadmap .step-track { flex-basis: 44px; }
  .roadmap .step-track b { width: 44px; height: 44px; font-size: 16px; }
  .roadmap .step:not(:last-child) .step-track::after { top: 52px; }
  .roadmap .step-text h3 { font-size: 18px; }
  .roadmap .step-text p { font-size: 15px; }
}
@media (min-width: 768px) {
  .roadmap {
    background: transparent; padding: 0; max-width: none;
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px;
  }
  .roadmap .step {
    background: #fff; border: 1px solid var(--pp-border);
    border-radius: 24px; padding: 24px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); gap: 14px;
  }
  .roadmap .step-track { flex-basis: 44px; }
  .roadmap .step-track b { width: 44px; height: 44px; font-size: 16px; }
  .roadmap .step:not(:last-child) .step-track::after { display: none; }
  .roadmap .step-text h3 { font-size: 16px; }
  .roadmap .step-text p { font-size: 13px; }
}
`;

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  currentUser: any;
  reviews?: Review[];
  allProducts?: Product[];
  onSelectProduct: (p: Product) => void;
  onInstantCheckout?: (item: CartItem) => void;
    cartCount?: number;        // ✅ NEW
  onOpenCart?: () => void;
}

interface ProductLandingData {
  eyebrow: string;
  heroHeadline: string;
  heroIntro: string;
  displayedSize: string;
  heroImg: string;
  lifestyleBadge: string;
  ingredientPills: { line1: string; line2: string }[];
  roadmapTitle: string;
  // Some products use { step, title, desc }, the default one uses { title, text }
  roadmapSteps: { step?: string; title: string; desc?: string; text?: string }[];
  reviewQuote: string;
  reviewerName: string;
  reviewerSource: string;
  benefits: string[];
  features?: string[];
  bundles: { pack: number; label: string; sizeText: string; savingsText?: string }[];
  comparisons: { frustration: string; approach: string }[];
  formulaItems: { icon: string; title: string; desc: string }[];
  closingLine: string;
  usageSteps: string[];
  specifications: { label: string; value: string }[];
  customerReviews: {
    name: string;
    headline: string;
    quote: string;
    link: string;
    verifiedText: string;
  }[];
  faqs: { q: string; a: string }[];
  coffeeWoodCustom?: CoffeeWoodCustomData;
   groomingPackCustom?: GroomingPackCustomData; 
}


interface GroomingPackCustomData {
  whyPack: { eyebrow: string; title: string; copy: string };
  insidePack: {
    eyebrow: string;
    title: string;
    tiles: { num: string; name: string; img: string; desc: string }[];
  };
  routine: {
    eyebrow: string;
    title: string;
    copy: string;
    steps: { title: string; desc: string }[];
    ctaText: string;
  };
  compare: {
    eyebrow: string;
    title: string;
    rows: { question: string; answer: string }[];
  };
  closing: { title: string; copy: string; ctaText: string };
}



interface GalleryImage {
  src: string;
  /** Unique, product-specific name for this image (used for alt text, tooltips & aria labels) */
  name: string;
}

/** Per-slot suffixes so every image in a product's gallery has its own name */
const GALLERY_SHOT_NAMES = [
  "Product shot",
  "Grooming result",
  "Lifestyle",
  "Formula",
  "30-day routine",
  "Risk-free trial",
  "Customer review",
];

const buildGallery = (productName: string, sources: string[]): GalleryImage[] =>
  sources.slice(0, 7).map((src, i) => ({
    src,
    name: `${productName} – ${GALLERY_SHOT_NAMES[i]}`,
  }));

/**
 * Exactly 7 dedicated images per product, each product with its own separately named files.
 */
const PRODUCT_GALLERIES: Record<string, GalleryImage[]> = {
  "furlush-serum": buildGallery("Furlush Serum", [
    furlushSerum1,
    furlushSerum2,
    furlushSerum3,
    furlushSerum4,
    furlushSerum5,
    furlushSerum6,
  ]),
  "squeakear-earwash": buildGallery("Squeakear Earwash", [
    squeakearEarwash1,
    squeakearEarwash2,
    squeakearEarwash3,
    squeakearEarwash4,
    squeakearEarwash5,
  ]),
  "furbreeze-heat-cooling-powder": buildGallery("Furbreeze Heat Cooling Powder", [
    furbreezePowder1,
    furbreezePowder2,
    furbreezePowder3,
    furbreezePowder4,
    furbreezePowder5,
    furbreezePowder6,
  ]),
  "coffee-wood-chew": buildGallery("Coffee Wood Chew", [
    coffeeWoodChew1,
    coffeeWoodChew2,
    coffeeWoodChew3,
    coffeeWoodChew4,
   
  ]),
  "complete-grooming-pack": buildGallery("Complete Grooming Pack", [
    groomingPack1,
    groomingPack2,
    groomingPack3,
    groomingPack4,
  ]),
};

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// Smooth-scrolls to the pack/size selector, leaving room for the sticky header
const scrollToOffer = (id: string = "offer") => {
  // Falls back to #offer if the requested id doesn't exist (e.g. "desktop-offer")
  const el = document.getElementById(id) || document.getElementById("offer");
  if (!el) return;

  // Header is sticky from md+ (about 80px tall), so leave extra room there
  const headerOffset = window.innerWidth >= 768 ? 96 : 16;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({ top, behavior: "smooth" });
};


const getGalleryImages = (pSlug: string): GalleryImage[] =>
  PRODUCT_GALLERIES[pSlug] || PRODUCT_GALLERIES["furlush-serum"];

interface ProductVideo {
  videoSrc: string;
  poster?: string;
  title: string;
  subtitle: string;
  gradient?: string;
  textColor?: string;
  buttonColor: string;
}

interface CoffeeWoodCustomData {
  everydayMoment: { eyebrow: string; title: string; copy: string };
  fitSection: { id: string; eyebrow: string; title: string; cards: { tag: string; title: string; desc: string }[] };
  decisionGuide: { eyebrow: string; title: string; rows: { concern: string; response: string }[]; ctaText: string };
  endOffer: { title: string; copy: string; ctaText: string };
}
const PRODUCT_VIDEOS: Record<string, ProductVideo[]> = {
  "furlush-serum": [
    {
      videoSrc: "/video/pawwcious_reels_2.mp4",
      poster: "/reels_thumbnails/2.webp",
      title: "Furlush customer reel",
      subtitle: "Indie Pup Daily Care",
      gradient: "from-[#d9e7d4] to-[#8cad8d]",
      textColor: "text-[#2b513c]",
      buttonColor: "text-[#245437]",
    },
    {
      videoSrc: "/video/pawwcious_reels_5.mp4",
      poster: "/reels_thumbnails/5.webp",
      title: "Coat-care routine",
      subtitle: "Golden Retriever Coat",
      gradient: "from-[#e8e4d2] to-[#b3a88c]",
      textColor: "text-[#413824]",
      buttonColor: "text-[#3b321c]",
    },
  ],
  // Add reels for the other products here, e.g.:
  // "squeakear-earwash": [{ videoSrc: "/video/....mp4", poster: "/reels_thumbnails/....webp", title: "...", subtitle: "...", gradient: "from-[#d9e7d4] to-[#8cad8d]", textColor: "text-[#2b513c]", buttonColor: "text-[#245437]" }],
  "furbreeze-heat-cooling-powder": [
     {
      videoSrc: "/video/pawwcious_reels7.mp4",
      poster: "/reels_thumbnails/2.webp",
      title: "Furlush customer reel",
      subtitle: "Indie Pup Daily Care",
      gradient: "from-[#d9e7d4] to-[#8cad8d]",
      textColor: "text-[#2b513c]",
      buttonColor: "text-[#245437]",
    },
    {
      videoSrc: "/video/pawwcious_reels10.mp4",
      poster: "/reels_thumbnails/5.webp",
      title: "Coat-care routine",
      subtitle: "Golden Retriever Coat",
      gradient: "from-[#e8e4d2] to-[#b3a88c]",
      textColor: "text-[#413824]",
      buttonColor: "text-[#3b321c]",
    },
  ],
  "squeakear-earwash": [],
  "coffee-wood-chew": [
        {
      videoSrc: "/video/pawwcious_reels_12.mp4",
      poster: "/reels_thumbnails/1.webp",
      title: "Furlush customer reel",
      subtitle: "Indie Pup Daily Care",
      gradient: "from-[#d9e7d4] to-[#8cad8d]",
      textColor: "text-[#2b513c]",
      buttonColor: "text-[#245437]",
    },
    {
      videoSrc: "/video/pawwcious_reels_8.mp4",
      poster: "/reels_thumbnails/6.webp",
      title: "Coat-care routine",
      subtitle: "Golden Retriever Coat",
      gradient: "from-[#e8e4d2] to-[#b3a88c]",
      textColor: "text-[#413824]",
      buttonColor: "text-[#3b321c]",
    },
  ],
  "complete-grooming-pack": [],
};
const BENEFIT_ICONS = [
  HouseHeart, // 1st benefit
  Sparkles, // 2nd benefit
  Leaf, // 3rd benefit
  Camera, // 4th benefit
];

/* ─────────────────────────────────────────────────────────────────────────
   Landing data per product (unchanged)
   ───────────────────────────────────────────────────────────────────────── */
const getProductLandingData = (pSlug: string): ProductLandingData => {
  if (pSlug === "squeakear-earwash") {
    return {
      eyebrow: "Ayurvedic Ear Wellness",
      heroHeadline: "Ear cleaning feels like guesswork? Try the 4-step Squeakear routine.",
      heroIntro: "Made with aloe vera and neem, Squeakear gives dog parents a clear ear-cleaning routine—from the first drop to the final wipe.",
      displayedSize: "100 ml",
      heroImg: squeakearEarwash1,
      lifestyleBadge: "Clean, fresh ears you love to cuddle",
      ingredientPills: [
        { line1: "Neem +", line2: "tulsi" },
        { line1: "Tea tree", line2: "extract" },
        { line1: "Aloe", line2: "hydrosol" },
      ],
      roadmapTitle: "Your ear-cleansing routine",
      roadmapSteps: [
        { step: "01", title: "Check ear", desc: "Notice wax buildup, redness or odor." },
        { step: "02", title: "Apply & massage", desc: "Gently dispense into ear canal and massage base." },
        { step: "30", title: "Clean canal", desc: "Enjoy calm, comfortable, odor-free ears." },
      ],
      reviewQuote: "“Cleared my cocker spaniel’s chronic ear odor in just 3 days without any stinging!”",
      reviewerName: "Pooja Malhotra",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "Ear-grooming cleanser for dogs",
        "Aloe vera and neem named on the bottle",
        "Four clear steps: drops, massage, shake, wipe",
        "Use only as directed for routine cleaning",
      ],
      bundles: [
        { pack: 1, label: "Pack of 1", sizeText: "100 ml", savingsText: "Standard bottle" },
        { pack: 2, label: "Pack of 2", sizeText: "2 × 100 ml", savingsText: "SAVE ₹78" },
        { pack: 3, label: "Pack of 3", sizeText: "3 × 100 ml", savingsText: "SAVE ₹198" },
      ],
      comparisons: [
        { frustration: "Harsh chemical burn makes pets panic", approach: "Soothing sting-free botanical herbs" },
        { frustration: "Alcohol strips & dries ear canal", approach: "Hydrating aloe and tulsi extracts" },
        { frustration: "Odor & wax return within days", approach: "Balances natural ear flora long term" },
        { frustration: "Messy hard-plastic applicator", approach: "Soft flexible nozzle designed for pets" },
      ],
      formulaItems: [
        { icon: "🌿", title: "Organic Tulsi & Neem", desc: "Natural antimicrobial barrier that halts yeast and bacterial overgrowth." },
        { icon: "💧", title: "Aloe Vera & Witch Hazel", desc: "Dissolves wax deposits and cools irritated inner ear skin." },
        { icon: "🍃", title: "Micro-dose Tea Tree", desc: "Natural deodorizer formulated at veterinary safe dilution." },
      ],
      closingLine: "Gentle ear care for happy ears and calm pets.",
      usageSteps: [
        "When cleaning is appropriate, apply 4–6 drops according to the final bottle directions. Keep the nozzle from touching the ear.",
        "Gently massage the base of the ear for about 30 seconds.",
        "Let your dog shake their head naturally.",
        "Gently wipe visible residue from the outer ear flap with a clean cotton pad or cloth. Do not put cotton buds into the canal.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Squeakiear Earwash" },
        { label: "Product type", value: "Pet ear-grooming cleanser" },
        { label: "Key ingredients", value: "Aloe vera and neem named on the supplied bottle/brochure; add the complete final ingredient list" },
        { label: "Pet type", value: "Dog-focused page; confirm cat suitability against the complete formula and production label" },
        { label: "Size", value: "100 ml" },
        { label: "Origin", value: "Formulated & crafted in India" },
      ],
      customerReviews: [
        {
          name: "Ananya Deshmukh",
          headline: "No more head shaking",
          quote: "My Labrador was constantly shaking his head due to wax build-up. Squeakear cleaned it up in 2 uses!",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Sunil Verma",
          headline: "Sting-free & calm",
          quote: "Normally ear cleaners make him run away. This is cooling and non-stinging, he sits calmly.",
          link: "https://pawwcious.com",
          verifiedText: "Amazon Customer Review",
        },
        {
          name: "Dr. K. Nair",
          headline: "Gentle daily maintenance",
          quote: "Ideal pH balance for tropical breeds prone to ear infections. A regular clinic recommendation.",
          link: "https://pawwcious.com",
          verifiedText: "Consulting Canine Vet",
        },
      ],
      faqs: [
        { q: "Is Squeakear safe for cats?", a: "Yes, Squeakear uses veterinary-calibrated low-concentration botanical extracts safe for both dogs and cats." },
        { q: "How frequently can I use this?", a: "For active ear cleaning, use 2–3 times a week. For routine maintenance, once every 7–10 days is ideal." },
        { q: "Can I use cotton swabs inside the ear?", a: "Never insert cotton swabs into the ear canal. Always use a soft cotton pad to wipe the outer ear only." },
      ],
    };
  }

  if (pSlug === "furbreeze-heat-cooling-powder") {
    return {
      eyebrow: "Ayurvedic Prickly Heat Care",
      heroHeadline: "Not bath day yet? Meet Furbreeze.",
      heroIntro: "A dry grooming powder for the ordinary days when your dog’s coat feels less fresh between baths.",
      displayedSize: "150 g",
      heroImg: furbreezePowder1,
      lifestyleBadge: "Cool, fresh comfort all summer long",
      ingredientPills: [
        { line1: "Vetiver +", line2: "khus" },
        { line1: "Arrowroot", line2: "base" },
        { line1: "Camphor +", line2: "neem" },
      ],
      roadmapTitle: "Your summer cooling routine",
      roadmapSteps: [
        { step: "01", title: "After bath day", desc: "Let the coat dry fully and keep up the usual grooming routine." },
        { step: "02", title: "Between baths", desc: "When appropriate, follow the final Furbreeze label. Show the real amount and finish in a short demo." },
        { step: "30", title: "When a bath or vet is needed", desc: "Powder is not a substitute for bathing, assessing persistent odor, or treating heat illness or skin disease." },
      ],
      reviewQuote: "“Finally a 100% talc-free powder! My Pug gets severe summer rashes, this cools him down instantly.”",
      reviewerName: "Meera Subramanian",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "Dry grooming powder for between-bath coat care",
        "120 g on the supplied label artwork",
        "Lavender and aloe vera named on the supplied pack",
        "update baki h",
      ],
      bundles: [
        { pack: 1, label: "Pack of 1", sizeText: "150 g", savingsText: "Standard bottle" },
        { pack: 2, label: "Pack of 2", sizeText: "2 × 150 g", savingsText: "SAVE ₹99" },
        { pack: 3, label: "Pack of 3", sizeText: "3 × 150 g", savingsText: "SAVE ₹198" },
      ],
      comparisons: [
        { frustration: "“Another bath already?”", approach: "A dry grooming step between baths" },
        { frustration: "“What is in it?”", approach: "Show the complete current ingredient label" },
        { frustration: "“How will it look on fur?”", approach: "Show a real close-up application demo" },
        { frustration: "“How much should I buy?”", approach: "Start with a single pack if you prefer" },
      ],
      formulaItems: [
        { icon: "🌾", title: "Lavender flower extract", desc: "Lavender has natural anti-inflammatory and antihistamine properties that provide rapid relief to dry, irritated skin and bug bites" },
        { icon: "❄️", title: "Aloe vera extract", desc: "It softens the coat, making it easier to brush through dry tangles while reducing dander." },
        { icon: "🛡️", title: "Geranium oils", desc: "Geranium oil helps regulate excess oil production on the skin, preventing the greasy buildup that can cause blocked pores or a dull coat." },
      ],
      closingLine: "Natural heat defense for tropical summers.",
      usageSteps: [
        "Turn the dispenser cap to open the sift holes.",
        "Dust powder lightly over your pet's stomach, groin, underarms, and neck folds.",
        "Gently brush or rub with hands against the hair direction.",
        "Use daily before and after outdoor walks during warm or humid days.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Furbreeze Heat Cooling Powder" },
        { label: "Pet type", value: "Dog-focused page; pack says cats and dogs but eligibility and age must be confirmed" },
        { label: "Key ingredients", value: "Lavender flower extract, aloe vera extract, geranium oils and propoxur. Confirm complete current formula, amounts and classification." },
        { label: "Formula note", value: "100% Talc-free, asbestos-free, lick-safe" },
        { label: "Size", value: "120 g" },
        { label: "Manufacturer / marketer", value: "Formulated & crafted in India" },
      ],
      customerReviews: [
        {
          name: "Rohit Saxena",
          headline: "Lifesaver in Delhi summer",
          quote: "My Golden was constantly panting and developing red heat spots. Furbreeze calmed it immediately.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Kavita R.",
          headline: "Safe when licked",
          quote: "So relieved it has zero talc. She licks her paws often, and this has no toxic chemicals.",
          link: "https://pawwcious.com",
          verifiedText: "Amazon Reviewer",
        },
        {
          name: "Tanvi Bose",
          headline: "Fresh earthy aroma",
          quote: "Smells like pure vetiver, not synthetic perfumed talc. Kept her coat dry through monsoon.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
      ],
      faqs: [
        { q: "Will Furbreeze cool my dog’s body?", a: "No body-temperature change has been established for this page. If your dog is overheating, move them to a cooler place and seek veterinary guidance promptly. Do not rely on grooming powder for heat illness." },
        { q: "Will it leave a white residue?", a: "The finish depends on the amount used and the coat. This page needs a real, unfiltered demonstration on light and dark fur before making a specific finish claim." },
        { q: "Can I use it on my cat or puppy?", a: "The supplied pack depicts cats and dogs, while another product listing differs on suitability. update baki h Pet type and age limits on the final label before this answer goes live." },
        { q: "Does it treat itching, ticks or fleas?", a: "This demo makes no treatment or parasite-control claim. Follow the approved product classification and consult your veterinarian about itching, parasites or persistent skin symptoms." },
        { q: "How often can I use it?", a: "update baki h" },
        { q: "Does it replace bathing?", a: "No. This page presents it as an optional between-bath grooming step." },
      ],
      
    };
  }

  if (pSlug === "coffee-wood-chew") {
    return {
      eyebrow: "100% Natural Dental Chews",
      heroHeadline: "Give them a chew of their own.",
      heroIntro: "A dedicated coffee wood option for supervised chew time. Choose a suitable size and offer it as part of your usual redirection routine.",
      displayedSize: "Small, Medium, Large",
      heroImg: coffeeWoodChew1,
      lifestyleBadge: "Calm chewing joy that saves your furniture",
      ingredientPills: [
        { line1: "100% Coffee", line2: "wood" },
        { line1: "Zero", line2: "calories" },
        { line1: "Non-", line2: "splintering" },
      ],
      roadmapTitle: "Your dental chew journey",
      roadmapSteps: [
        { step: "01", title: "Choose the fit", desc: "Follow the final Pawwcious size guidance for your dog." },
        { step: "02", title: "Offer it while you can watch", desc: "Let your dog investigate at their own pace." },
        { step: "03", title: "Check it as they chew", desc: "Remove it if large or sharp pieces break off or it becomes small enough to swallow." },
        { step: "04", title: "Replace when worn", desc: "Follow the final label’s care and replacement directions." },
      ],
      reviewQuote: "“My Beagle is an aggressive chewer who destroyed 3 wooden chairs. This chew has lasted 3 months!”",
      reviewerName: "Vikram Sengupta",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "A dedicated chew to offer when your dog seeks something to gnaw",
        "Real coffee wood, shown up close",
        "Choose a size that suits your dog",
        "Easy to include in supervised chew time",
      ],
      bundles: [
        { pack: 1, label: "Small Size", sizeText: "For dogs up to 10 kg", savingsText: "Puppies & small breeds" },
        { pack: 2, label: "Medium Size", sizeText: "For dogs 10 – 25 kg", savingsText: "Popular size" },
        { pack: 3, label: "Large Size", sizeText: "For dogs over 25 kg", savingsText: "Strong chewers" },
      ],
      comparisons: [
        { frustration: "Rawhide contains chemicals & chokes pets", approach: "100% Natural plant wood with zero chemicals" },
        { frustration: "Plastic nylon chews ingest microplastics", approach: "Safe, natural cellulose that digests easily" },
        { frustration: "Ordinary garden sticks splinter sharply", approach: "Dense grain flakes into soft gentle threads" },
        { frustration: "High calorie treats cause obesity", approach: "Zero calorie, gluten-free, guilt-free chew" },
      ],
      formulaItems: [
        { icon: "🌳", title: "100% Robusta Coffee Wood", desc: "Dense hardwood harvested only from pruned branches of aged coffee trees." },
        { icon: "🦷", title: "Natural Dental Floss Effect", desc: "Fibers bend and separate to gently scrape away plaque without gum abrasion." },
        { icon: "☕", title: "Naturally Caffeine-Free", desc: "Wood contains zero caffeine, zero sugar, and zero artificial preservatives." },
      ],
      closingLine: "Natural enrichment that channels natural chewing instinct.",
      usageSteps: [
        "Select the correct size based on your dog's weight (Small: <10kg, Medium: 10-25kg, Large: >25kg).",
        "Supervise your pet during chewing sessions.",
        "When chewed down to a small swallowable nub, replace with a fresh stick.",
        "Store in a dry, ventilated area between chewing sessions.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Coffee Wood Chew" },
        { label: "Product type", value: "Natural Wood Dental Dog Chew" },
        { label: "Category", value: "Dental Hygiene & Boredom Relief" },
        { label: "Pet type", value: "Dogs of all breeds & ages" },
        { label: "Key ingredients", value: "100% Natural Pruned Robusta Coffee Wood" },
        { label: "Formula note", value: "Caffeine-free, calorie-free, non-splintering" },
        { label: "Displayed sizes", value: "Small (<10kg), Medium (10-25kg), Large (>25kg)" },
        { label: "Origin", value: "Coorg & Western Ghats, India" },
      ],
      customerReviews: [
        {
          name: "Deepak S.",
          headline: "Saved my wooden dining table",
          quote: "My Indie pup was chewing every piece of wood in the apartment. This stick diverted his energy completely.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Radhika K.",
          headline: "Soft fibers, no sharp shards",
          quote: "Unlike tree branches that shatter dangerously, this just turns into soft powdery fluff that is easy to vacuum.",
          link: "https://pawwcious.com",
          verifiedText: "Amazon Reviewer",
        },
        {
          name: "Gaurav Mehta",
          headline: "Great for teeth",
          quote: "His vet commented on how clean his back molars looked after a month of coffee wood chewing.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
      ],
      faqs: [
        { q: "How do I choose the right size?", a: "Use Pawwcious’s final size chart. Actual dimensions and dog guidance must be added before launch." },
        { q: "How do I introduce it to my dog?", a: "Offer it during a supervised session and let your dog investigate. Interest varies from dog to dog." },
        { q: "Can I leave my dog alone with it?", a: "No. Stay nearby while your dog chews and observe how the product wears." },
        { q: "What if pieces come off?", a: "Remove it if large or sharp pieces break off or your dog tries to swallow chunks. Ask a veterinarian if you suspect an injury or swallowed piece." },
        { q: "When should I replace it?", a: "Remove it once it is cracked, worn beyond label directions or small enough to swallow." },
        { q: "Is it suitable for puppies or dogs with dental problems?", a: "Check the final age and dental guidance on the label. Ask your veterinarian about a dog with dental concerns." },
        { q: "Does it stop furniture chewing or anxiety?", a: "It is a chew option in a supervised redirection routine, not a behaviour treatment." },
        { q: "Does it clean teeth?", a: "No dental efficacy claim is being made for this product. Follow your veterinarian’s dental-care advice." },
        { q: "Is it caffeine-free?", a: "Pawwcious should confirm the material specification before this question is answered on the live page." },
        { q: "What are the delivery, return and refund terms?", a: "Insert Pawwcious’s current policy for the Coffee Wood Chew here. Any delivery charge and serviceability must reflect checkout." },
      ],
      
coffeeWoodCustom: {
        everydayMoment: {
          eyebrow: "The everyday moment",
          title: "Always reaching for the wrong thing?",
          copy: "Chewing is normal for dogs. When yours reaches for a shoe, chair leg or outdoor stick, redirect them to an option intended for their chew routine and stay nearby while they use it.",
        },
        fitSection: {
          id: "fit",
          eyebrow: "Choose with clarity",
          title: "See the chew. Choose the fit.",
          cards: [
            {
              tag: "01 · Material",
              title: "What it is",
              desc: "Coffee wood dog chew. Show the actual product and confirmed material details.",
            },
            {
              tag: "02 · Size",
              title: "Find the right size",
              desc: "Display measured dimensions and approved guidance for dog size and chewing style.",
            },
            {
              tag: "03 · Wear",
              title: "Know when to replace",
              desc: "Use real close-up wear photos and the final label directions.",
            },
          ],
        },
        decisionGuide: {
          eyebrow: "Decision guide",
          title: "What to consider when choosing a chew",
          rows: [
            {
              concern: "What am I buying?",
              response: "Coffee wood with actual product photos and dimensions",
            },
            {
              concern: "Will it suit my dog?",
              response: "Check the approved size guide and chewing style",
            },
            {
              concern: "Can I leave my dog alone with it?",
              response: "Stay nearby during every chew session",
            },
            {
              concern: "What if it wears down?",
              response: "Inspect and replace according to the label",
            },
          ],
          ctaText: "CHOOSE A CHEW FOR MY DOG",
        },
        endOffer: {
          title: "Ready to find their chew?",
          copy: "Choose a suitable size and keep every session supervised.",
          ctaText: "BACK TO SIZE SELECTION",
        },
      },

    };
  }

  if (pSlug === "complete-grooming-pack") {
    return {
      eyebrow: "Ultimate 3-in-1 Ayurvedic Kit",
      heroHeadline: "One pack. A routine that covers more.",
      heroIntro: "Care for your pet's coat, keep grooming days fresh, and make ear hygiene part of the routine—with Furlush Serum, Furbreeze Cooling Powder and Squeakear Ear Wash together.",
      displayedSize: "Contents & individual sizes clearly stated below",
      heroImg: groomingPack1,
      lifestyleBadge: "Head-to-tail holistic Ayurvedic routine",
      ingredientPills: [
        { line1: "Furbreeze", line2: "150 g" },
        { line1: "Squeakear", line2: "100 ml" },
        { line1: "Furlush", line2: "100 ml" },
      ],
      roadmapTitle: "Your complete weekly grooming ritual",
      roadmapSteps: [
        { step: "01", title: "Clean ears", desc: "Use Squeakear Earwash (100 ml) to dissolve wax and eliminate yeast." },
        { step: "02", title: "Dust & cool", desc: "Dust Furbreeze Powder (150 g) to absorb sweat, dampness & prickly heat." },
        { step: "30", title: "Nourish coat", desc: "Mist Furlush Serum (100 ml) and brush for mirror shine & anti-tangle." },
      ],
      reviewQuote: "“This complete 3-in-1 kit replaced 7 different salon visits! My pets smell fresh, clean, and happy.”",
      reviewerName: "Nandini & Arjun Rao",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "Coat care: condition rough-feeling fur with Furlush.",
        "Fresh-feeling grooming: add Furbreeze to the routine.",
        "Ear hygiene: make time for Squeakear.",
        "Three coordinated products in one pack.",
      ],
      bundles: [
        { pack: 1, label: "Complete 3-in-1 Kit", sizeText: "150 g + 100 ml + 100 ml", savingsText: "SAVE ₹148 INSTANTLY" },
        { pack: 2, label: "Twin Pack (2 Kits)", sizeText: "2 × Complete Kits", savingsText: "SAVE ₹398 (BEST VALUE)" },
      ],
      comparisons: [
        { frustration: "Buying separate products from random brands", approach: "Synchronized Ayurvedic head-to-tail routine" },
        { frustration: "Unclear ingredients and mismatched chemicals", approach: "100% Transparent botanical ingredients" },
        { frustration: "Heavy expensive salon bills", approach: "Easy 5-minute home grooming ritual" },
        { frustration: "Synthetic perfumes and artificial dyes", approach: "Pure herbal extracts with zero toxins" },
      ],
      formulaItems: [
        { icon: "🌸", title: "Furlush Serum (100 ml)", desc: "Moroccan Argan, Jojoba & Aloe leave-in coat serum for silkiness and detangling." },
        { icon: "👂", title: "Squeakear Earwash (100 ml)", desc: "Neem, Tulsi & Tea tree non-stinging ear hygiene wash to eliminate wax and odor." },
        { icon: "❄️", title: "Furbreeze Powder (150 g)", desc: "100% Talc-free Vetiver & Camphor cooling powder to prevent heat rashes and ticks." },
      ],
      closingLine: "Everything your pet needs for daily clinical grooming.",
      usageSteps: [
        "Step 1 (Ears): Apply 4-6 drops of Squeakear (100 ml) into ear canal, massage base, and wipe clean.",
        "Step 2 (Skin): Dust Furbreeze Powder (150 g) on belly and armpits to absorb humidity and sweat.",
        "Step 3 (Coat): Mist Furlush Serum (100 ml) evenly across fur and brush gently for silky gloss.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Complete Grooming Pack" },
        { label: "Pack contents", value: "Furbreeze Powder (150 g) + Squeakear Earwash (100 ml) + Furlush Serum (100 ml)" },
        { label: "Total net quantity", value: "350 g / ml combined" },
        { label: "Category", value: "Complete Head-to-Tail Ayurvedic Grooming" },
        { label: "Pet type", value: "Dogs and cats of all breeds" },
        { label: "Key ingredients", value: "Argan Oil, Jojoba, Aloe Vera, Tulsi, Neem, Vetiver, Camphor" },
        { label: "Safety standard", value: "100% Ayurvedic, Talc-free, Silicone-free, Paraben-free" },
        { label: "Origin", value: "Formulated & crafted in India" },
      ],
      customerReviews: [
        {
          name: "Sandesh Kubsad",
          headline: "Golden Retriever experience",
          quote: "This combo is a boon for my furry Golden Retriever. Lovely fragrance and smooth hairs.",
          link: "https://www.amazon.in/portal/customer-reviews/srp/-/R33CXV0SUENCGV",
          verifiedText: "Amazon Reviewer",
        },
        {
          name: "Priyanka N.",
          headline: "All 3 products are fantastic",
          quote: "The powder kept her rash free, the ear drops stopped her head scratching, and the serum made her coat mirror shiny!",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Dr. A. Sen",
          headline: "Holistic preventive care",
          quote: "Grooming isn't cosmetic; it is preventive healthcare. Having all three in one kit makes compliance easy for pet parents.",
          link: "https://pawwcious.com",
          verifiedText: "Veterinary Dermatologist",
        },
      ],
      faqs: [
     { q: "What's included in the Complete Grooming Pack?", a: "One Furlush Serum, one Furbreeze Cooling Powder and one Squeakear Ear Wash. Add the exact sizes from the live product variants." },
{ q: "Do I need to use all three products every day?", a: "No. Each has a different use. Follow the frequency and method on each final label and adapt grooming to your pet's needs." },
{ q: "Is this pack for dogs and cats?", a: "Only state species suitability for each item once the final product labels and formula guidance confirm it. The page must identify any product in the pack that is not suitable for a cat." },
{ q: "How do I use Furlush?", a: "Follow the final bottle directions for applying it to the coat and brushing through. Confirm whether the actual applicator is a mist or palm application before adding a step-by-step video." },
{ q: "How do I use Furbreeze?", a: "Use only as the final label directs. Avoid the eyes, nose and inhalation. It is a grooming powder, not treatment for overheating or heatstroke." },
{ q: "How do I use Squeakear?", a: "Confirm the final ear-wash label's dosage and application instructions. If your pet has pain, discharge, strong odour or repeated head shaking, consult a vet." },
{ q: "What if my pet is itchy or has an ear infection?", a: "These are grooming products. Persistent itching, skin redness or signs of ear illness need veterinary advice." },
{ q: "What are the shipping, return and guarantee terms?", a: "Display the current policy specifically applicable to this pack. Do not reuse a serum-only refund promise unless Pawwcious confirms bundle coverage and its conditions." },
      ],
            groomingPackCustom: {
        whyPack: {
          eyebrow: "Why a pack?",
          title: "Grooming isn't one single task.",
          copy: "A soft-feeling coat, comfortable warm-weather grooming and clean outer ears each call for their own step. This pack puts the three Pawwcious products together, so the routine is easier to keep in one place.",
        },
        insidePack: {
          eyebrow: "Inside the pack",
          title: "Three products. Three clear roles.",
          tiles: [
            {
              num: "01 / COAT",
              name: "Furlush Serum",
              img: furlushSerum1,
              desc: "For rough-feeling fur. Made with ingredients including aloe vera, argan and jojoba; designed to condition the coat without a sticky finish. Follow the final bottle directions.",
            },
            {
              num: "02 / FRESH FEEL",
              name: "Furbreeze Cooling Powder",
              img: furbreezePowder1,
              desc: "A powder for the warm-weather grooming routine and a fresh-feeling coat. Apply only as directed on the final pack label; no body-temperature or heatstroke treatment claim is made.",
            },
            {
              num: "03 / EARS",
              name: "Squeakear Ear Wash",
              img: squeakearEarwash1,
              desc: "For routine ear hygiene. Use the actual label's amount and method, and wipe only where the directions specify. An ear wash is not treatment for an ear infection.",
            },
          ],
        },
        routine: {
          eyebrow: "Use what your pet needs",
          title: "Make it an easy routine.",
          copy: "These are three separate grooming steps. Follow each label's frequency and method rather than applying all three automatically every day.",
          steps: [
            {
              title: "Brush and condition the coat.",
              desc: "Use Furlush on a dry coat as directed, then gently brush with a tool suitable for your pet.",
            },
            {
              title: "Use Furbreeze when appropriate.",
              desc: "Apply the powder only to areas and at the frequency shown on its final label; avoid eyes, nose and inhalation.",
            },
            {
              title: "Keep an eye on the ears.",
              desc: "Use Squeakear according to the bottle directions for routine hygiene. Pain, discharge, strong odour or repeated head-shaking calls for a vet.",
            },
          ],
          ctaText: "GET THE COMPLETE PACK",
        },
        compare: {
          eyebrow: "The practical difference",
          title: "One pack, a clearer routine.",
          rows: [
            { question: "Coat feels rough after grooming?", answer: "Condition and brush with Furlush as directed." },
            { question: "Warm-weather grooming feels incomplete?", answer: "Include Furbreeze when appropriate for your pet." },
            { question: "Ear care keeps getting forgotten?", answer: "Keep Squeakear in the same grooming kit." },
            { question: "Unsure when to use each?", answer: "Follow the individual labels and the simple guide below." },
          ],
        },
        closing: {
          title: "Bring the three steps together.",
          copy: "Coat care, fresh-feeling grooming and ear hygiene in one pack.",
          ctaText: "VIEW COMPLETE PACK",
        },
      },
    };
  }

  // Default: Furlush Serum
  return {
    eyebrow: "Ayurvedic Coat Care",
    heroHeadline: "Rough, dry coat? Try a 30-day Furlush routine.",
    heroIntro: "Made with natural ingredients like aloe vera, argan and jojoba, Furlush makes coat care simple for dogs and cats.",
    displayedSize: "100 ml",
    heroImg: furlushSerum1,
    lifestyleBadge: "A coat you love to cuddle",
    ingredientPills: [
      { line1: "Argan +", line2: "jojoba" },
      { line1: "Aloe", line2: "vera" },
      { line1: "Rose", line2: "hydrosol" },
    ],
    roadmapTitle: "Your coat-care routine",
    roadmapSteps: [
      {
        title: "Day 1 — Start with a photo",
        text: "Note how your pet’s coat looks and feels before Furlush.",
      },
      {
        title: "During the routine — Apply and groom",
        text: "Use Furlush according to the final bottle directions and brush with a tool suited to your pet’s coat.",
      },
      {
        title: "Day 30 — Compare",
        text: "Look back at the photo and notice how the coat feels when you pet and brush them.",
      },
    ],
    reviewQuote: "“The hair serum makes the coat smooth, soft, shiny, and easy to manage.”",
    reviewerName: "Sunikhi Nandan Dansu",
    reviewerSource: "Amazon review",
    benefits: [
      "Argan + jojoba oils to condition rough-feeling fur",
      "Silicone-free formula with no sticky coating",
      "Light, non-greasy feel for easy grooming",
      "Compare Day 1 and Day 30 to see how your pet’s coat changes",
    ],
    features: [
      "Made with natural ingredients including aloe vera, argan and jojoba",
      "Silicone-free coat care formula",
      "Designed to feel light and non-greasy",
      "Intended for dogs and cats, subject to final label confirmation",
    ],
    bundles: [
      { pack: 1, label: "Pack of 1", sizeText: "100 ml", savingsText: "Standard bottle" },
      { pack: 2, label: "Pack of 2", sizeText: "2 × 100 ml", savingsText: "SAVE ₹99" },
      { pack: 3, label: "Pack of 3", sizeText: "3 × 100 ml", savingsText: "SAVE ₹198" },
    ],
    comparisons: [
      { frustration: "Fur feels oily after grooming", approach: "Light, non-greasy feel" },
      { frustration: "Shine comes with a silicone coating", approach: "Silicone-free formula" },
      { frustration: "Unsure what is doing the work", approach: "Named ingredients: aloe vera, argan and jojoba" },
      { frustration: "Grooming feels like another big task", approach: "A simple step in the usual brushing routine" },
    ],
    formulaItems: [
      { icon: "✿", title: "Argan + jojoba oils", desc: "Help condition rough-feeling fur and restore healthy shine." },
      { icon: "❀", title: "Aloe vera + rose hydrosol", desc: "Hydrating botanical base that softens coat texture naturally." },
      { icon: "✧", title: "Silicone-free finish", desc: "Designed to feel light and non-greasy rather than sticky." },
    ],
    closingLine: "Ingredient-led grooming for the coat you touch every day.",
    usageSteps: [
      "Mist lightly across your pet’s dry coat from 8–10 inches away.",
      "Gently brush in the direction of hair growth using a comb or a brush suitable for your pet’s coat.",
      "Pay extra attention to areas that tangle easily, such as behind the ears and around the legs. Don’t pull through tight mats.",
      "During heavier shedding periods, use as often as the bottle label directs. After a bath, wait until the coat is dry.",
    ],
    specifications: [
      { label: "Product name", value: "Pawwcious Furlush Serum" },
      { label: "Product type", value: "Pet coat serum" },
      { label: "Category", value: "Coat and skin grooming" },
      { label: "Pet type", value: "Dogs and cats of all breeds" },
      { label: "Key ingredients", value: "Aloe vera, argan oil, jojoba oil and rose hydrosol" },
      { label: "Formula note", value: "Silicone-free, mineral-oil-free, non-greasy" },
      { label: "Size", value: "Confirm size on final bottle" },
      { label: "Manufacturer, marketer and origin", value: "Add exactly as printed on final label" },
    ],
    customerReviews: [
      {
        name: "Amazon Reviewer",
        headline: "Coat appearance",
        quote: "The hair serum leaves the coat looking healthy, smooth, and shiny.",
        link: "https://www.amazon.in/portal/customer-reviews/srp/-/R3GS3M98RUHKTD",
        verifiedText: "Verified Purchase",
      },
      {
        name: "Sunikhi Nandan Dansu",
        headline: "Easy to manage",
        quote: "The hair serum makes the coat smooth, soft, shiny, and easy to manage.",
        link: "https://www.amazon.in/portal/customer-reviews/srp/-/R2XN88RAGOTCGB",
        verifiedText: "Verified Amazon Review",
      },
      {
        name: "Sandesh Kubsad",
        headline: "Golden Retriever experience",
        quote: "This combo is a boon for my furry Golden Retriever. Lovely fragrance and smooth hairs.",
        link: "https://www.amazon.in/portal/customer-reviews/srp/-/R33CXV0SUENCGV",
        verifiedText: "Verified Amazon Review",
      },
    ],
    faqs: [
      { q: "Will Furlush stop my pet from shedding?", a: "No coat serum can stop normal shedding. Furlush is for coat care; regular brushing helps collect loose fur before it spreads around the home." },
      { q: "Will it make the coat oily or sticky?", a: "Furlush is described as light and non-greasy. Use the amount directed on the bottle and allow it to absorb." },
      { q: "Can I use it on my cat?", a: "The page is intended for dogs and cats. The client should confirm cat suitability on the final formula and label before this answer goes live." },
      { q: "Will it remove knots and mats?", a: "It can be part of a gentle brushing routine, but don’t pull at tight mats. A groomer can help with severe matting." },
      { q: "Does it help if my pet keeps scratching?", a: "Furlush is a grooming product, not a treatment for itching. If scratching persists or you notice redness or hair loss, speak to a vet." },
      { q: "Will every pet’s coat look different after 30 days?", a: "Coats vary. Take a photo when you start, follow the label directions, and compare how the coat looks and feels after 30 days. The routine is an invitation to observe your pet’s experience, not a guaranteed result." },
    ],
    };
  }
/* Shared "page width" wrapper: full-bleed on mobile, centred 7xl container on md+ */
const INNER = "md:max-w-7xl md:mx-auto md:px-8";
/* Shared classes for the small uppercase eyebrow labels */
const EYEBROW = "uppercase text-[11px] md:text-xs font-extrabold tracking-widest text-[color:var(--pp-mid)] mb-1";
/* ─────────────── PER-PRODUCT COLOR THEMES ─────────────── */
// Only the button/brand color is needed; all lighter shades are derived from it.
const PRODUCT_THEMES: Record<string, string> = {
  "furlush-serum": "#123b2d",
  "squeakear-earwash": "#123b2d",
  "furbreeze-heat-cooling-powder": "#4a175d",
  "coffee-wood-chew": "#493020",
  "complete-grooming-pack": "#005f58",
};

const hexToRgb = (hex: string): number[] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// brandShare = how much of the brand color to keep (1 = full, 0.1 = very light)
const mix = (hex: string, brandShare: number, other = "#ffffff"): string => {
  const a = hexToRgb(hex);
  const b = hexToRgb(other);
  return (
    "#" +
    a
      .map((v, i) => Math.round(v * brandShare + b[i] * (1 - brandShare)).toString(16).padStart(2, "0"))
      .join("")
  );
};

const buildThemeVars = (brand: string): React.CSSProperties =>
  ({
    "--pp-brand": brand,                    // buttons, headings, dark text
    "--pp-hover": mix(brand, 0.82),         // button hover
    "--pp-mid": mix(brand, 0.85),           // icons, numbers, selected states, eyebrows
    "--pp-muted": mix(brand, 0.35, "#6b6b6b"), // body/muted text
    "--pp-tint": mix(brand, 0.12),          // icon circles, selected card bg, ribbon
    "--pp-border": mix(brand, 0.18),        // borders, dividers
    "--pp-section": mix(brand, 0.08),       // coloured section backgrounds
    "--pp-bg-alt": mix(brand, 0.06),        // reviews / alt sections
    "--pp-bg": mix(brand, 0.035),           // page background
  } as React.CSSProperties);


export function ProductPage({
  product: rawProduct,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currentUser,
  reviews = [],
  allProducts = [],
  onSelectProduct,
  onInstantCheckout,
    cartCount = 0,       // ✅ NEW
  onOpenCart,    
}: ProductPageProps) {
  const product = normalizeProductDetails(rawProduct);
  const slug = getProductSlug(product);
  const themeVars = buildThemeVars(PRODUCT_THEMES[slug] ?? PRODUCT_THEMES["furlush-serum"]);


  const config = CANONICAL_PRODUCT_CONFIGS[slug] || CANONICAL_PRODUCT_CONFIGS["furlush-serum"];
  const isFurlush = slug === "furlush-serum";

  const isGroomingPack = slug === "complete-grooming-pack";
  
  // Gallery state (one carousel for every screen size)
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Pack / bundle selector state
  const [selectedPack, setSelectedPack] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeVariants?.[0] || config?.sizeVariants?.[0] || "100 ml"
  );
  const [qty, setQty] = useState<number>(1);

  // Interactive feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shiprocket Pincode Check
  const [pincodeInput, setPincodeInput] = useState<string>("");
  const [checkingPin, setCheckingPin] = useState<boolean>(false);
  const [pinResult, setPinResult] = useState<{ available: boolean; text: string } | null>(null);

  // Accordions
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    usage: true, // open by default
    description: false,
    info: false,
    shipping: false,
    money: false,
  });
  const toggleItem = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  // 7 gallery images specific to this product (each with its own name)
  const galleryImages = getGalleryImages(slug);
  const lastSlideIndex = galleryImages.length - 1;

  // Ensure document and body are unlocked for natural page scrolling
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Reset states when product changes
  useEffect(() => {
    setSelectedPack(1);
    setSelectedSize(product.sizeVariants?.[0] || "100 ml");
    setActiveSlide(0);
    setQty(1);
    setPinResult(null);
    setPincodeInput("");
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id, slug]);

  const handleGalleryScroll = () => {
    if (!galleryRef.current) return;
    const { scrollLeft, clientWidth } = galleryRef.current;
    if (clientWidth <= 0) return;
    const newIndex = Math.max(0, Math.min(lastSlideIndex, Math.round(scrollLeft / clientWidth)));
    if (newIndex !== activeSlide) {
      setActiveSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    const safe = Math.max(0, Math.min(lastSlideIndex, index));
    setActiveSlide(safe);
    if (!galleryRef.current) return;
    galleryRef.current.scrollTo({
      left: safe * galleryRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
const videos = PRODUCT_VIDEOS[slug] ?? [];
  const data = getProductLandingData(slug);

  // Pricing calculations based on bundle / size
 const isCoffee = slug === "coffee-wood-chew";
const effectiveSize = isCoffee
  ? product.sizeVariants?.[selectedPack - 1] ?? selectedSize
  : selectedSize;
const packMultiplier = isCoffee ? 1 : selectedPack;

const basePrice = getProductSizePrice(product, effectiveSize);
const baseOriginalPrice = getProductOriginalSizePrice(product, effectiveSize);

let currentPrice = basePrice * packMultiplier;
let currentOriginalPrice = baseOriginalPrice * packMultiplier;
let savingsAmount = Math.max(0, currentOriginalPrice - currentPrice) || 50;

if (packMultiplier === 2) {
  currentPrice = Math.round(basePrice * 1.8);
  currentOriginalPrice = baseOriginalPrice * 2;
  savingsAmount = currentOriginalPrice - currentPrice;
} else if (packMultiplier === 3) {
  currentPrice = Math.round(basePrice * 2.6);
  currentOriginalPrice = baseOriginalPrice * 3;
  savingsAmount = currentOriginalPrice - currentPrice;
}
  // Actions
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

 const buildCartItem = (): CartItem => ({
  product: {
    ...product,
    price: currentPrice / packMultiplier,
    originalPrice: currentOriginalPrice / packMultiplier,
  },
  quantity: qty * packMultiplier,
  selectedSize: isCoffee
    ? `${effectiveSize}`
    : `${data.displayedSize} (Pack of ${packMultiplier})`,
});

  const handlePrimaryBuy = () => {
    onAddToCart(buildCartItem());
    triggerToast(`Added ${selectedPack > 1 ? `Pack of ${selectedPack}` : "1"} ${product.name} to bag!`);
  };

  const handleInstantBuy = () => {
    const item = buildCartItem();
    if (onInstantCheckout) {
      onInstantCheckout(item);
    } else {
      onAddToCart(item);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const canonicalUrl = `${window.location.origin}${getProductRoute(product)}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(canonicalUrl);
        setCopiedLink(true);
        triggerToast("Product link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.trim().length !== 6) {
      setPinResult({
        available: false,
        text: "Please enter a valid 6-digit Indian PIN code.",
      });
      return;
    }
    setCheckingPin(true);
    setTimeout(() => {
      setCheckingPin(false);
      setPinResult({
        available: true,
        text: `Serviceable! Estimated delivery in 2-4 business days to ${pincodeInput}. Free Shipping applied.`,
      });
    }, 450);
  };

  /* Detail accordions — defined once, rendered once, styled responsively */
  const detailItems: { key: string; title: React.ReactNode; body: React.ReactNode }[] = [
    {
      key: "usage",
      title: <>How do I use {product.name}?</>,
      body: (
        <ol className="list-decimal pl-4 md:pl-6 space-y-1.5 md:space-y-2">
          {data.usageSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      ),
    },
    {
      key: "description",
      title: "Product description",
      body: (
        <>
          <p className="mb-2 md:mb-3 font-bold">Features</p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-1.5">
            {(data.features ?? data.benefits).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="mt-2 md:mt-3">
            {isFurlush
              ? "Pawwcious Furlush Serum is a simple addition to your pet’s grooming routine. Its ingredient blend is designed to condition rough-feeling fur and leave the coat feeling softer, without a sticky finish. Brush it through as directed and enjoy a coat you’ll love to cuddle."
              : product.description || data.heroIntro}
          </p>
        </>
      ),
    },
    {
      key: "info",
      title: "Additional information",
      body: (
        <dl className="grid gap-1.5 md:grid-cols-2 md:gap-4">
          {data.specifications.map((spec, i) => (
            <div
              key={i}
              className="flex-col py-1 border-b border-dashed border-[color:var(--pp-border)] md:p-3.5 md:rounded-xl md:bg-[var(--pp-bg)] md:border md:border-solid"
            >
              <dt className="font-bold md:font-extrabold text-[color:var(--pp-brand)] md:mb-1">{spec.label}</dt>
              <dd className="m-0 text-[color:var(--pp-muted)]">{spec.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      key: "shipping",
      title: "Shipping and returns",
      body: (
        <>
          <p>
            Pawwcious ships to serviceable locations across India. Shipping charges are shown at checkout, and tracking is provided after dispatch. Standard delivery is listed as 5–7 business days, with 1–2 business days for order processing. For a return or delivery issue, contact Pawwcious support and refer to the applicable policy.
          </p>
          <p className="underline">
            <a href="https://pawwcious.com" target="_blank" rel="noopener noreferrer">
              Pawwcious website ↗
            </a>
          </p>
        </>
      ),
    },
    {
      key: "money",
      title: "What is the 30-day money-back offer?",
      body: (
        <>
          <p className="mb-1">
            Update baki h
          </p>
          <p>Final eligibility, start date, process and policy link require approval before launch.</p>
        </>
      ),
    },
  ];

  return (
    <div  style={themeVars} className="w-full bg-[var(--pp-bg)] min-h-screen font-sans antialiased text-[color:var(--pp-brand)]">
      {/* Roadmap styles (mobile timeline → desktop cards) */}
      <style>{css}</style>

      {/* Page shell: 520px phone column on mobile, full width from md up */}
      <div className="w-full max-w-[520px] mx-auto min-h-screen bg-[var(--pp-bg)] shadow-[0_12px_36px_rgba(19,57,42,0.12)] md:pb-0 md:max-w-none md:shadow-none">
        {/* Ribbon */}
        <div className="bg-[var(--pp-tint)] text-[color:var(--pp-brand)] py-2 px-4 md:px-8 text-center text-[11px] md:text-xs font-bold tracking-widest uppercase md:border-b md:border-[color:var(--pp-border)]">
          <span className="md:hidden">Pawwcious Clinical Grooming · Free Shipping</span>
          <span className="hidden md:inline">
            Pawwcious Clinical Grooming · Free Express Delivery Across India · 30-Day Money-Back Guarantee
          </span>
        </div>

        {/* Site Header */}
        <header className="bg-white border-b border-[color:var(--pp-border)] md:sticky md:top-0 md:z-40 md:bg-white/95 md:backdrop-blur-md">
          <div className="flex items-center justify-between px-5 py-4 md:max-w-7xl md:mx-auto md:px-8">
             <a href="/" aria-label="Pawwcious home" className="inline-block shrink-0">
  <img
    src="/images/logo.webp"
    width={180}
    height={46}
    alt="Pawwcious logo"
    loading="eager"
    fetchPriority="high"
    decoding="sync"
  />
</a>

            <div className="flex items-center gap-2 md:gap-8 md:flex-1 md:ml-8">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 border border-[color:var(--pp-border)] rounded-full py-1.5 px-3 text-xs font-bold text-[color:var(--pp-brand)] bg-[var(--pp-bg)] md:font-extrabold md:hover:text-[#e78866] transition-colors"
              >
                <ArrowLeft className="hidden md:block w-3.5 h-3.5" />
                <span>
                  <span className="md:hidden">← </span>Products
                </span>
              </button>
              <a
                href="#details"
                className="lg:hidden border border-[color:var(--pp-border)] rounded-full py-1.5 px-3 text-xs font-bold text-[color:var(--pp-brand)] bg-[var(--pp-bg)]"
              >
                Details ↓
              </a>

              <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[color:var(--pp-muted)]">
                <a href="#details" className="hover:text-[color:var(--pp-brand)] transition-colors">Details ↓</a>
                <a href="#comparison" className="hover:text-[color:var(--pp-brand)] transition-colors">Why Pawwcious</a>
                <a href="#formula" className="hover:text-[color:var(--pp-brand)] transition-colors">Formula</a>
                <a href="#roadmap" className="hover:text-[color:var(--pp-brand)] transition-colors">30-Day Routine</a>
                <a href="#reviews" className="hover:text-[color:var(--pp-brand)] transition-colors">Reviews</a>
                <a href="#founder" className="hover:text-[color:var(--pp-brand)] transition-colors">Founder Story</a>
              </nav>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
                className={`p-2.5 rounded-full border border-[color:var(--pp-border)] transition-all ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-300 text-rose-600"
                    : "bg-white text-stone-600 hover:text-stone-900"
                }`}
              >
                <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="p-2.5 rounded-full border border-[color:var(--pp-border)] bg-white text-stone-600 hover:text-stone-900 transition-colors"
                title="Copy product link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
               <button
  id="product-cart-btn"
  type="button"
  aria-label="Open cart"
  onClick={onOpenCart}
  className="p-2.5 rounded-full border border-[color:var(--pp-border)] bg-white text-stone-600 hover:text-stone-900 transition-colors relative"
>
  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-[#e78866] text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
      {cartCount}
    </span>
  )}
</button>
              <button
                onClick={handlePrimaryBuy}
                className="bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-2.5 px-5 rounded-full font-bold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now · ₹{currentPrice}</span>
              </button>
            </div>
          </div>
        </header>

        {/* All page sections live in one flex column so mobile / desktop can use different `order` */}
        <main className="flex flex-col">
          {/* ═════════════ HERO: gallery + purchase panel ═════════════ */}
          <div className="order-1 md:max-w-7xl md:mx-auto md:w-full md:px-8 md:py-10 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
            {/* Gallery */}
            <div className="bg-white md:max-w-xl md:mx-auto md:w-full md:p-6 md:rounded-3xl md:border md:border-[color:var(--pp-border)] md:shadow-sm lg:col-span-6 lg:max-w-none lg:sticky lg:top-24">
              <div className="relative md:rounded-2xl md:overflow-hidden md:border md:border-[color:var(--pp-border)]">
                <div
                  ref={galleryRef}
                  onScroll={handleGalleryScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-y overscroll-x-contain"
                  style={{ scrollbarWidth: "none" }}
                >
                  {galleryImages.map((img, i) => (
                    <div
                      key={`${slug}-slide-${i}`}
                      className={`flex-[0_0_100%] aspect-square snap-start overflow-hidden bg-white md:bg-[var(--pp-bg-alt)] flex items-center justify-center ${
                        i === 0 ? "p-6 md:p-8" : ""
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={img.name}
                        className={`h-full md:w-full ${
                          i === 0 ? "object-contain max-h-[380px] md:max-h-none" : "object-contain"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Arrows (md+) */}
                <button
                  type="button"
                  onClick={() => scrollToSlide(activeSlide - 1)}
                  disabled={activeSlide === 0}
                  className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 text-[color:var(--pp-brand)] shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSlide(activeSlide + 1)}
                  disabled={activeSlide === lastSlideIndex}
                  className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 text-[color:var(--pp-brand)] shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div
                className="flex gap-2 md:gap-2.5 overflow-x-auto p-2.5 md:p-1 md:mt-4 bg-white scrollbar-none"
                style={{ scrollbarWidth: "none" }}
              >
                {galleryImages.map((img, i) => (
                  <button
                    key={`${slug}-thumb-${i}`}
                    type="button"
                    onClick={() => scrollToSlide(i)}
                    title={img.name}
                    aria-label={img.name}
                    className={`relative flex-[0_0_54px] w-[54px] h-[54px] md:flex-[0_0_64px] md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${
                      activeSlide === i
                        ? "border-[color:var(--pp-brand)] ring-1 ring-[color:var(--pp-brand)] md:ring-2 md:ring-[color:var(--pp-brand)]"
                        : "border-[color:var(--pp-border)] opacity-70 md:opacity-75 md:hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.name}
                      className={`w-full h-full ${i === 0 ? "object-contain p-1 bg-white" : "object-cover"}`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Strip */}
              <a
                href="#reviews"
                className="flex items-center gap-2 px-4 py-3 bg-white border-t border-[color:var(--pp-border)] text-xs text-[color:var(--pp-brand)] md:gap-3 md:px-0 md:mt-4 md:pb-0 md:hover:text-[color:var(--pp-brand)]"
              >
                <span className="text-amber-500 font-bold md:text-base">★★★★★</span>
                <strong className="text-sm font-bold text-[color:var(--pp-brand)]">{product.rating || 4.5}/5</strong>
                <span className="text-[color:var(--pp-muted)]">
                  · {product.reviewCount ?? 2} verified{" "}
                  <span className="md:hidden">reviews</span>
                  <span className="hidden md:inline">pet parents across India</span>
                </span>
                <ChevronRight className="hidden md:block w-4 h-4 ml-auto text-stone-400" />
              </a>
            </div>

            {/* Purchase panel */}
            <div className="p-5 pb-0 md:max-w-xl md:mx-auto md:w-full md:mt-10 md:p-8 md:bg-white md:rounded-3xl md:border md:border-[color:var(--pp-border)] md:shadow-sm md:flex md:flex-col md:gap-6 lg:col-span-6 lg:max-w-none lg:mt-0">
              <div>
                <p className="hidden md:block uppercase text-xs font-extrabold tracking-widest text-[color:var(--pp-mid)] mb-2">
                  {data.eyebrow}
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[color:var(--pp-brand)] leading-tight mb-3 md:mb-3">
                  {data.heroHeadline}
                </h1>
                <p className="text-xs md:text-base text-[color:var(--pp-muted)] leading-relaxed mb-5 md:mb-0">
                  {data.heroIntro}
                </p>
              </div>

              {/* Benefits */}
              <ul className="list-none p-0 m-0 grid gap-2.5 mb-6 md:mb-0 md:gap-3">
                {data.benefits.map((benefit, idx) => {
                  const IconComponent = BENEFIT_ICONS[idx] || Check;
                  return (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[color:var(--pp-brand)]"
                    >
                      <span className="w-8 h-8 rounded-full bg-[var(--pp-tint)] text-[color:var(--pp-mid)] flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Complete Grooming Pack contents */}
              {slug === "complete-grooming-pack" && (
                <div className="mb-5 md:mb-0 p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-[var(--pp-tint)] border border-[color:var(--pp-border)] text-xs">
                  <strong className="flex items-center gap-2 font-bold text-[color:var(--pp-brand)] mb-1.5 md:mb-2 uppercase text-[10px] md:text-xs tracking-wider">
                    <Package className="hidden md:block w-4 h-4" />
                    Full-Sized Pack Contents:
                  </strong>
                  <div className="space-y-1">
                    {[
                      { n: "1. Furbreeze Cooling Powder", s: "150 g" },
                      { n: "2. Squeakear Earwash", s: "100 ml" },
                      { n: "3. Furlush Serum", s: "100 ml" },
                    ].map((row) => (
                      <div key={row.n} className="flex justify-between items-center md:py-1">
                        <span className="md:font-bold md:text-[color:var(--pp-brand)]">{row.n}</span>
                        <b className="text-[color:var(--pp-mid)] md:bg-white md:px-2 md:py-0.5 md:rounded-full md:border md:border-[color:var(--pp-border)]">
                          {row.s}
                        </b>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bundles */}
              <fieldset className="border-0 p-0 m-0 mb-5 md:mb-0" id="offer">
                <legend className="font-serif font-bold text-lg text-[color:var(--pp-brand)] mb-2.5 md:mb-3">
                  Choose your pack<span className="hidden md:inline"> / size</span>
                </legend>
                <div className="grid gap-2 md:gap-2.5" id='size_selection'>
                  {data.bundles.map((bundle) => {
                    const isChecked = selectedPack === bundle.pack;
                    return (
                      <label
                        key={bundle.pack}
                        onClick={() => setSelectedPack(bundle.pack)}
                        className={`cursor-pointer flex items-center justify-between gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all ${
                          isChecked
                            ? "bg-[var(--pp-tint)] border-[color:var(--pp-mid)]"
                            : "bg-white border-[color:var(--pp-border)] md:hover:border-[color:var(--pp-border)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              isChecked ? "bg-[var(--pp-mid)] text-white" : "bg-[var(--pp-tint)] text-[color:var(--pp-brand)]"
                            }`}
                          >
                            {bundle.pack}
                          </span>
                          <div>
                            <strong className="block text-xs md:text-sm font-bold text-[color:var(--pp-brand)]">
                              {bundle.label}
                            </strong>
                            <span className="text-[10px] md:text-xs text-[color:var(--pp-muted)]">{bundle.sizeText}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                          {bundle.savingsText && (
                            <span className="text-[10px] md:text-xs font-extrabold px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-[#f4ebd9] text-[#935427] md:border md:border-[#e5d5be]">
                              {bundle.savingsText}
                            </span>
                          )}
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                              isChecked
                                ? "bg-[var(--pp-mid)] border-[color:var(--pp-mid)] text-white"
                                : "border-[color:var(--pp-border)] text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Price banner (md+; mobile shows price in sticky bar) */}
              <div className="hidden md:flex flex-wrap items-baseline gap-4 p-4 bg-[var(--pp-bg)] rounded-2xl border border-[color:var(--pp-border)]">
                <span className="text-4xl font-black text-[color:var(--pp-brand)]">₹{currentPrice}</span>
                <span className="text-base text-stone-400 line-through">₹{currentOriginalPrice}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Save ₹{savingsAmount}
                </span>
                <span className="text-xs text-[color:var(--pp-muted)] ml-auto">Inclusive of all taxes · Free Delivery</span>
              </div>

              {/* PIN code checker (md+) */}
              <div className="hidden md:block p-4 bg-[var(--pp-bg)] rounded-2xl border border-[color:var(--pp-border)]">
                <div className="flex items-center gap-2 text-xs font-bold text-[color:var(--pp-brand)] mb-2">
                  <MapPin className="w-4 h-4 text-[color:var(--pp-mid)]" />
                  <span>Check Express Delivery Timeline</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit Indian PIN code"
                    className="flex-1 min-w-0 px-4 py-2 text-xs bg-white border border-[color:var(--pp-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--pp-brand)]"
                  />
                  <button
                    type="submit"
                    disabled={checkingPin}
                    className="px-5 py-2 text-xs font-bold bg-[var(--pp-brand)] text-white rounded-xl hover:bg-[var(--pp-hover)] transition-colors disabled:opacity-50"
                  >
                    {checkingPin ? "Checking..." : "Verify PIN"}
                  </button>
                </form>
                {pinResult && (
                  <p
                    className={`text-xs font-semibold mt-2 ${
                      pinResult.available ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {pinResult.text}
                  </p>
                )}
              </div>

              {/* Quantity & CTA buttons */}
              <div className="flex gap-3 mb-3 md:mb-0 md:pt-2">
                <div className="hidden md:flex items-center bg-[var(--pp-bg)] border border-[color:var(--pp-border)] rounded-2xl px-3 py-1.5">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 text-lg font-bold text-[color:var(--pp-brand)] hover:bg-[var(--pp-border)] rounded-xl transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[color:var(--pp-brand)]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 text-lg font-bold text-[color:var(--pp-brand)] hover:bg-[var(--pp-border)] rounded-xl transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePrimaryBuy}
                  className="flex-1 bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-3.5 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-wider md:tracking-wide uppercase md:normal-case transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="hidden md:block w-4 h-4" />
                  <span className="md:hidden">
                    BUY {product.name.toUpperCase()} 
                  </span>
                  <span className="hidden md:inline">TRY NOW &amp; SAVE ₹{savingsAmount}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="hidden md:block bg-[#e78866] hover:bg-[#d47755] text-white py-4 px-6 rounded-2xl font-black text-xs tracking-wider uppercase transition-colors shadow-sm"
                >
                  BUY NOW
                </button>
              </div>

              {/* Risk box */}
              <div className="flex items-center gap-2.5 p-3 md:p-3.5 rounded-xl md:rounded-2xl border border-[color:var(--pp-border)] bg-[var(--pp-tint)] text-[color:var(--pp-brand)] text-xs font-bold mb-4 md:mb-0">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[color:var(--pp-mid)]" />
                <span>
                  Try {product.name} 30 days risk-free

                  <p className="font-normal">Money-back terms for this product</p>
                </span>
              </div>

              {/* Trust strip (md+) */}
              <div className="hidden md:flex justify-between gap-3 pt-3 border-t border-[color:var(--pp-border)] text-[color:var(--pp-brand)] text-xs font-bold text-center">
                <span className="flex-1">✓ Free Delivery</span>
                <span className="flex-1">✓ 100% Ayurvedic</span>
                <span className="flex-1">✓ Vet Formulated</span>
                <span className="flex-1">✓ Cruelty Free</span>
              </div>
            </div>
          </div>



{data.coffeeWoodCustom && (
          <div className="order-2 md:order-[2] w-full space-y-12 pb-8">
            {/* Section 1: The everyday moment */}
            <section className="w-full bg-[var(--pp-section)] py-14 border-t border-b border-[color:var(--pp-border)]">
              <div className="w-full max-w-4xl mx-auto px-8 text-center">
                <p className="uppercase text-xs font-extrabold tracking-widest text-[color:var(--pp-mid)] mb-2">
                  {data.coffeeWoodCustom.everydayMoment.eyebrow}
                </p>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[color:var(--pp-brand)] mb-4">
                  {data.coffeeWoodCustom.everydayMoment.title}
                </h2>
                <p className="text-base text-[color:var(--pp-muted)] leading-relaxed max-w-2xl mx-auto">
                  {data.coffeeWoodCustom.everydayMoment.copy}
                </p>
              </div>
            </section>

            {/* Section 2: Choose with clarity (#fit) */}
            <section className="w-full max-w-7xl mx-auto px-8" id="fit">
              <div className="bg-white p-10 lg:p-12 rounded-3xl border border-[color:var(--pp-border)] shadow-sm">
                <p className="uppercase text-xs font-extrabold tracking-widest text-[color:var(--pp-mid)] mb-1">
                  {data.coffeeWoodCustom.fitSection.eyebrow}
                </p>
                <h2 className="text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-8">
                  {data.coffeeWoodCustom.fitSection.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.coffeeWoodCustom.fitSection.cards.map((card, idx) => (
                    <article key={idx} className="p-6 rounded-2xl bg-[var(--pp-bg)] border border-[color:var(--pp-border)] flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-[color:var(--pp-mid)] uppercase tracking-wider mb-2">
                          {card.tag}
                        </p>
                        <h3 className="text-base font-bold text-[color:var(--pp-brand)] mb-2">{card.title}</h3>
                        <p className="text-xs text-[color:var(--pp-muted)] m-0 leading-relaxed">{card.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Decision guide */}
            <section className="w-full bg-[var(--pp-section)] py-14 border-t border-b border-[color:var(--pp-border)]">
              <div className="w-full max-w-4xl mx-auto px-8">
                <div className="text-center mb-8">
                  <p className="uppercase text-xs font-extrabold tracking-widest text-[color:var(--pp-mid)] mb-1">
                    {data.coffeeWoodCustom.decisionGuide.eyebrow}
                  </p>
                  <h2 className="text-3xl font-serif font-bold text-[color:var(--pp-brand)]">
                    {data.coffeeWoodCustom.decisionGuide.title}
                  </h2>
                </div>
                <div className="border border-[color:var(--pp-border)] rounded-2xl overflow-hidden bg-white shadow-sm mb-8 text-sm">
                  {data.coffeeWoodCustom.decisionGuide.rows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 border-b border-[color:var(--pp-border)] last:border-b-0">
                      <div className="p-4 bg-[var(--pp-bg-alt)] text-[#775e50] font-semibold flex items-center">
                        {row.concern}
                      </div>
                      <div className="p-4 bg-white text-[color:var(--pp-brand)] font-bold border-l border-[color:var(--pp-border)] flex items-center">
                        {row.response}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => scrollToOffer("desktop-offer")}
                    className="inline-block bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-4 px-10 rounded-full font-bold text-xs uppercase tracking-wider shadow-md"
                  >
                    {data.coffeeWoodCustom.decisionGuide.ctaText}
                  </button>
                </div>
              </div>
            </section>

          
          </div>
        )}

          {/* ═════════════ COMPLETE GROOMING PACK CUSTOM SECTIONS ═════════════ */}
          {data.groomingPackCustom && (
            <div className="order-2 md:order-2 w-full">
              {/* Why a pack? */}
              <section className="w-full bg-[var(--pp-section)] py-10 md:py-16">
                <div className="max-w-4xl mx-auto px-5 md:px-8">
                  <p className={EYEBROW}>{data.groomingPackCustom.whyPack.eyebrow}</p>
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-4">
                    {data.groomingPackCustom.whyPack.title}
                  </h2>
                  <p className="text-sm md:text-base text-[color:var(--pp-muted)] leading-relaxed max-w-2xl">
                    {data.groomingPackCustom.whyPack.copy}
                  </p>
                </div>
              </section>

              {/* Inside the pack */}
              <section id="inside-pack" className="w-full bg-white py-10 md:py-16">
                <div className="max-w-5xl mx-auto px-5 md:px-8">
                  <p className={EYEBROW}>{data.groomingPackCustom.insidePack.eyebrow}</p>
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-[color:var(--pp-brand)] mb-6 md:mb-8">
                    {data.groomingPackCustom.insidePack.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {data.groomingPackCustom.insidePack.tiles.map((tile) => (
                      <article
                        key={tile.name}
                        className="p-5 md:p-6 rounded-2xl bg-[var(--pp-bg)] border border-[color:var(--pp-border)]"
                      >
                        <span className="text-[11px] font-extrabold tracking-widest text-[color:var(--pp-mid)]">
                          {tile.num}
                        </span>
                        <img src={tile.img} alt={tile.name} className="w-full h-40 object-contain my-3" />
                        <h3 className="font-serif font-bold text-xl md:text-2xl text-[color:var(--pp-brand)] mb-2">
                          {tile.name}
                        </h3>
                        <p className="text-sm text-[color:var(--pp-muted)] leading-relaxed m-0">{tile.desc}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* Routine */}
              <section id="routine" className="w-full bg-[var(--pp-section)] py-10 md:py-16">
                <div className="max-w-4xl mx-auto px-5 md:px-8">
                  <p className={EYEBROW}>{data.groomingPackCustom.routine.eyebrow}</p>
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-4">
                    {data.groomingPackCustom.routine.title}
                  </h2>
                  <p className="text-sm md:text-base text-[color:var(--pp-muted)] leading-relaxed max-w-2xl mb-6">
                    {data.groomingPackCustom.routine.copy}
                  </p>
                  <ol className="list-none p-0 m-0 grid gap-5 mb-8">
                    {data.groomingPackCustom.routine.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="shrink-0 w-9 h-9 rounded-full bg-[var(--pp-border)] text-[color:var(--pp-brand)] font-black flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <strong className="block text-sm md:text-base text-[color:var(--pp-brand)]">{step.title}</strong>
                          <p className="text-sm text-[color:var(--pp-muted)] leading-relaxed m-0 mt-0.5">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    onClick={() => scrollToOffer("size_selection")}
                    className="w-full sm:w-auto bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-3.5 px-8 rounded-xl font-black text-xs tracking-wider uppercase transition-colors shadow-md"
                  >
                    {data.groomingPackCustom.routine.ctaText}
                  </button>
                </div>
              </section>

              {/* Practical difference */}
              <section id="pack-difference" className="w-full bg-[var(--pp-section)] py-10 md:py-16">
                <div className="max-w-5xl mx-auto px-5 md:px-8">
                  <p className={EYEBROW}>{data.groomingPackCustom.compare.eyebrow}</p>
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-[color:var(--pp-brand)] mb-6 md:mb-8">
                    {data.groomingPackCustom.compare.title}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {data.groomingPackCustom.compare.rows.map((row, i) => (
                      <div key={i} className="p-4 md:p-5 rounded-xl bg-white border border-[color:var(--pp-border)]">
                        <strong className="block text-sm md:text-base text-[color:var(--pp-brand)] mb-1">{row.question}</strong>
                        <span className="text-sm text-[color:var(--pp-muted)] leading-relaxed">{row.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ═════════════ DETAILS ACCORDIONS ═════════════ */}
          <section
            id="details"
            className="order-2 md:order-4 p-5 pt-0 border-b border-[color:var(--pp-border)] md:border-0 md:px-0 md:py-16"
          >
            <div className={INNER}>
              <div className="md:bg-white md:p-10 md:rounded-3xl md:border md:border-[color:var(--pp-border)] md:shadow-sm">
                <h2 className=" md:block text-2xl font-serif font-bold text-[color:var(--pp-brand)] mb-6">
                  Everything you need to know
                </h2>
                <div className="border-t border-[color:var(--pp-border)] md:border-t-0 divide-y divide-[color:var(--pp-border)]">
                  {detailItems.map((item) => (
                    <div key={item.key} className="py-3.5 md:py-5">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.key)}
                        aria-expanded={openItems[item.key]}
                        className="w-full flex justify-between items-center gap-3 cursor-pointer font-bold text-sm md:text-lg text-[color:var(--pp-brand)] text-left"
                      >
                        <span>{item.title}</span>
                        <span className="text-lg md:text-2xl text-[color:var(--pp-mid)] shrink-0">
                          {openItems[item.key] ? "−" : "+"}
                        </span>
                      </button>
                      {openItems[item.key] && (
                        <div className="mt-2.5 md:mt-4 text-xs md:text-sm text-[color:var(--pp-muted)] leading-relaxed">
                          {item.body}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═════════════ CUSTOMER REVIEWS ═════════════ */}
          <section
            id="reviews"
            className="order-3 md:order-5 p-5 bg-[var(--pp-bg-alt)] border-b border-[color:var(--pp-border)] md:border-0 md:px-0 md:py-16"
          >
            <div className={INNER}>
              <p className={EYEBROW + " md:mb-1"}>Words from pet parents</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-8">
                What customers noticed
              </h2>
              {isFurlush && (
                <p className="md:hidden">
                  Three excerpts from reviews that discuss the serum, sometimes alongside the ear cleaner.
                </p>
              )}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
                {data.customerReviews.map((rev, i) => (
                  <article
                    key={i}
                    className="flex-[0_0_85%] snap-start bg-white p-4 md:p-6 rounded-xl md:rounded-3xl border border-[color:var(--pp-border)] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 md:gap-3 mb-2.5 md:mb-4">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-[var(--pp-tint)] text-[color:var(--pp-mid)] flex items-center justify-center text-lg md:text-xl shrink-0">
                          🐾
                        </div>
                        <div>
                          <strong className="block text-xs md:text-sm font-bold text-[color:var(--pp-brand)]">{rev.name}</strong>
                          <small className="text-[10px] md:text-xs text-[color:var(--pp-muted)]">{rev.verifiedText}</small>
                        </div>
                      </div>
                      <div className="text-amber-500 text-xs mb-1 md:mb-2">★★★★★</div>
                      <h3 className="text-xs md:text-sm font-bold text-[color:var(--pp-brand)] mb-1 md:mb-2">{rev.headline}</h3>
                      <p className="text-xs text-[color:var(--pp-muted)] leading-relaxed mb-3 md:mb-4">{rev.quote}</p>
                    </div>
                    <a
                      href={rev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] md:text-xs font-bold text-[color:var(--pp-mid)] underline md:no-underline md:hover:underline inline-flex items-center gap-1 mt-auto"
                    >
                      Read original review ↗
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════ FOUNDER ═════════════ */}
          <section
            id="founder"
            className="order-4 md:order-6 p-6 bg-white border-b border-[color:var(--pp-border)] text-center md:bg-transparent md:border-0 md:px-0 md:py-16"
          >
            <div className={INNER}>
              <div className="md:bg-white md:p-12 md:rounded-3xl md:border md:border-[color:var(--pp-border)] md:shadow-sm">
                <img
                  src={founder}
                  alt="Shashwat"
                  className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-full border-4 border-[color:var(--pp-tint)] mx-auto mb-3 md:mb-4"
                />
                <p className="uppercase text-[10px] md:text-xs font-extrabold tracking-widest text-[color:var(--pp-mid)] mb-1">
                  The story behind the routine
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-1">
                  From one pet parent to another
                </h2>
                <p className="text-xs font-bold text-[color:var(--pp-brand)] mb-3 md:mb-4">
                  Shashwat · Co-Founder, Pawwcious
                </p>
                <p className="text-xs md:text-sm text-[color:var(--pp-muted)] md:max-w-2xl md:mx-auto leading-relaxed mb-4 md:mb-6">
                  As a pet parent, Shashwat believes grooming should consider how a product feels for the pet, not just how the coat looks afterward. That thinking helped shape Pawwcious: thoughtful coat care, clear ingredients, and routines that feel comfortable for our dogs and cats.
                </p>
                <div className="border-l-4 border-[#e78866] p-3 md:p-4 text-left bg-[var(--pp-bg)] font-serif italic text-xs md:text-base text-[color:var(--pp-brand)] md:max-w-xl md:mx-auto rounded-r-lg md:rounded-r-xl mb-4 md:mb-6">
                  “A shiny coat catches your eye. A comfortable grooming routine matters every day.”
                </div>
                <button
                  type="button"
                  onClick={() => scrollToId("offer")}
                  className="bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-2.5 px-6 md:py-3 md:px-8 rounded-xl md:rounded-full font-bold text-xs uppercase md:tracking-wider transition-colors"
                >
                  BUY {product.name.toUpperCase()}
                </button>
              </div>
            </div>
          </section>


          {/* ═════════════ COMPARISON + FORMULA (side by side on lg) ═════════════ */}
          <div className="order-5 md:order-2 flex flex-col md:gap-10 lg:grid lg:grid-cols-2 md:max-w-7xl md:mx-auto md:w-full md:px-8 md:py-10">
            {/* Comparison */}
            <section
              id="comparison"
              className="p-5 bg-white border-b border-[color:var(--pp-border)] md:p-8 md:rounded-3xl md:border md:shadow-sm"
            >
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-4">
                What makes {product.name} different?
              </h2>
              <div className="border border-[color:var(--pp-border)] rounded-xl md:rounded-2xl overflow-hidden text-xs md:shadow-sm">
                <div className="grid grid-cols-2 bg-[var(--pp-brand)] text-white font-extrabold p-2.5 md:p-3.5">
                  <span>Common frustration</span>
                  <span className="pl-2 md:pl-3 border-l border-white/20">The Pawwcious approach</span>
                </div>
                {data.comparisons.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 border-t border-[color:var(--pp-border)] leading-snug">
                    <div className="p-3 md:p-3.5 bg-[var(--pp-bg-alt)] text-[#775e50] font-semibold">
                      {row.frustration}
                    </div>
                    <div className="p-3 md:p-3.5 bg-white text-[color:var(--pp-brand)] font-bold border-l border-[color:var(--pp-border)] flex items-center gap-1.5 md:gap-2">
                      <span className="text-emerald-700 font-black shrink-0">
                        <CheckCircle2 className="w-6 h-6 md:w-4 md:h-4" />
                      </span>
                      <span>{row.approach}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Formula */}
            <section
              id="formula"
              className="p-5 bg-white border-b border-[color:var(--pp-border)] md:p-8 md:rounded-3xl md:border md:shadow-sm"
            >
              <p className={EYEBROW}>
                Inside the {isFurlush ? "furlush" : product.name} formula
              </p>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-4">
                {isFurlush ? (
                  <>
                    <span className="md:hidden">What goes into softer-feeling coat?</span>
                    <span className="hidden md:inline">What goes into {product.name}?</span>
                  </>
                ) : (
                  <>What goes into {product.name}?</>
                )}
              </h2>
              <div className="grid gap-2.5 md:gap-3.5">
                {data.formulaItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 md:gap-4 items-start p-3 md:p-4 rounded-xl md:rounded-2xl bg-[var(--pp-tint)] md:border md:border-[color:var(--pp-border)]"
                  >
                    <span className="text-base md:w-10 md:h-10 md:rounded-full md:bg-[var(--pp-tint)] md:flex md:items-center md:justify-center md:shrink-0 md:text-xl">
                      {item.icon}
                    </span>
                    <div>
                      <strong className="block text-xs md:text-sm font-bold text-[color:var(--pp-brand)]">{item.title}</strong>
                      <p className="text-[11px] md:text-xs text-[color:var(--pp-muted)] m-0 md:mt-0.5 md:leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="italic font-serif md:text-sm text-[color:var(--pp-brand)] md:mt-1">{data.closingLine}</p>
              </div>
            </section>
          </div>

          {/* ═════════════ 30-DAY ROADMAP ═════════════ */}
          <section
            id="roadmap"
            className="order-6 md:order-3 p-5 bg-[var(--pp-bg)] border-b border-[color:var(--pp-border)] md:bg-[var(--pp-border)] md:border-0 md:px-0 md:py-16"
          >
            <div className={INNER}>
              <p className={EYEBROW}>Between-bath roadmap</p>
              <h2 className="text-xl md:text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-4 md:mb-8">
                A routine that fits real life
              </h2>
              <div className="roadmap grid gap-3">
                {data.roadmapSteps.map((step, idx) => (
                  <div className="step" key={idx}>
                    <div className="step-track">
                      <b>{idx + 1}</b>
                    </div>
                    <div className="step-text">
                      <h3>{step.title}</h3>
                      <p>{step.text ?? step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════ VIDEO REELS ═════════════ */}
        {videos.length > 0 && (
            <section className="order-7 p-5 bg-[var(--pp-bg)] border-b border-[color:var(--pp-border)] md:border-0 md:border-t md:px-0 md:py-16">
              <div className={INNER}>
                <p className={EYEBROW}>
                  Real routines<span className="hidden md:inline">, real voices</span>
                </p>
                <h2 className="text-xl md:text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-8">
                  See {product.name} <span className="md:hidden">in action</span>
                  <span className="hidden md:inline">in real grooming routines</span>
                </h2>
                <div
                  className={`flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory md:grid md:gap-8 md:overflow-visible md:pb-0 ${
                    videos.length === 1 ? "md:grid-cols-1 md:max-w-md" : "md:grid-cols-2"
                  }`}
                >
                  {videos.map((v) => (
                    <VideoCard
                      key={`${slug}-${v.videoSrc}`}
                      videoSrc={v.videoSrc}
                      poster={v.poster}
                      title={v.title}
                      subtitle={v.subtitle}
                      gradient={v.gradient}
                      textColor={v.textColor}
                      buttonColor={v.buttonColor}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═════════════ FAQs ═════════════ */}
          <section className="order-8 p-5 bg-white border-b border-[color:var(--pp-border)] md:bg-transparent md:border-0 md:px-0 md:py-16">
            <div className={INNER}>
              <div className="md:bg-white md:p-10 md:rounded-3xl md:border md:border-[color:var(--pp-border)] md:shadow-sm">
                <span className="md:hidden uppercase text-xs font-bold">still wondering?</span>
                <h2 className="text-xl md:text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-3 md:mb-6">
                  <span className="md:hidden">
                    More {isFurlush ? "Furlush" : product.name} FAQs
                  </span>
                  <span className="hidden md:inline">Frequently Asked Questions</span>
                </h2>
                <div className="divide-y divide-[color:var(--pp-border)]">
                  {data.faqs.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={i} className="py-2.5 md:py-4 text-xs md:text-sm">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          className="w-full font-bold md:text-base text-[color:var(--pp-brand)] cursor-pointer flex justify-between items-center text-left gap-3"
                        >
                          <span>{faq.q}</span>
                          <span className="text-base md:text-xl text-[color:var(--pp-mid)] shrink-0">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="mt-1.5 md:mt-2 text-[color:var(--pp-muted)] leading-relaxed">{faq.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
{data.coffeeWoodCustom && (
<div className="order-8 md:order-[8] w-full space-y-12 pb-8">
  {/* Section 4: Ready to find their chew? (end-offer) */}
            <section className="w-full max-w-5xl mx-auto px-8">
              <div className="bg-[var(--pp-brand)] text-white p-12 rounded-3xl text-center shadow-lg">
                <h2 className="text-3xl font-serif font-bold text-white mb-3">
                  {data.coffeeWoodCustom.endOffer.title}
                </h2>
                <p className="text-sm text-[#dbe7dc] max-w-md mx-auto mb-6 leading-relaxed">
                  {data.coffeeWoodCustom.endOffer.copy}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToOffer("size_selection")}
                  className="inline-block bg-[#e78866] hover:bg-[#d57754] text-white py-3.5 px-8 rounded-full font-black text-xs uppercase tracking-wider shadow-md"
                >
                  {data.coffeeWoodCustom.endOffer.ctaText}
                </button>
              </div>
            </section>
            </div>
)}

          {data.groomingPackCustom && (
            <section className="order-9 md:order-9 w-full bg-[var(--pp-section)] py-12 md:py-16 text-center">
              <div className="max-w-2xl mx-auto px-5 md:px-8">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[color:var(--pp-brand)] mb-3">
                  {data.groomingPackCustom.closing.title}
                </h2>
                <p className="text-sm md:text-base text-[color:var(--pp-muted)] mb-6">
                  {data.groomingPackCustom.closing.copy}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToOffer("size_selection")}
                  className="w-full sm:w-auto bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-3.5 px-10 rounded-xl font-black text-xs tracking-wider uppercase transition-colors shadow-md"
                >
                  {data.groomingPackCustom.closing.ctaText}
                </button>
              </div>
            </section>
          )}

          {/* ═════════════ RELATED PRODUCTS (md+) ═════════════ */}
          {allProducts && allProducts.length > 1 && (
            <section className="hidden md:block order-9 bg-[var(--pp-bg-alt)] py-16 border-t border-[color:var(--pp-border)]">
              <div className={INNER}>
                <h2 className="text-3xl font-serif font-bold text-[color:var(--pp-brand)] mb-8">
                  Complete Your Pet’s Routine
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {allProducts
                    .filter((p) => p.id !== product.id)
                    .slice(0, 4)
                    .map((relProduct) => {
                      const relPrice = getProductSizePrice(
                        relProduct,
                        relProduct.sizeVariants?.[0] || "Standard"
                      );
                      return (
                        <div
                          key={relProduct.id}
                          onClick={() => onSelectProduct(relProduct)}
                          className="cursor-pointer bg-white p-4 rounded-3xl border border-[color:var(--pp-border)] shadow-sm hover:shadow-md hover:border-[color:var(--pp-brand)] transition-all flex flex-col justify-between group"
                        >
                          <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--pp-bg-alt)] p-4 flex items-center justify-center mb-3">
                            <img
                              src={relProduct.imageUrl}
                              alt={relProduct.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[color:var(--pp-brand)] line-clamp-1 mb-1">
                              {relProduct.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-sm text-[color:var(--pp-brand)]">₹{relPrice}</span>
                              <span className="text-xs font-bold text-[color:var(--pp-mid)] group-hover:underline">
                                View →
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile fixed sticky buy bar */}
        <div className="md:hidden fixed z-[85] bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[color:var(--pp-border)] shadow-[0_-5px_20px_rgba(24,59,45,0.15)] p-3 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] max-w-[520px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-base font-black text-[color:var(--pp-brand)] leading-none">₹{currentPrice}</span>
              <span className="text-[10px] text-emerald-800 font-bold">Save ₹{savingsAmount}</span>
            </div>
            <button
              type="button"
              onClick={handlePrimaryBuy}
              className="flex-1 bg-[var(--pp-brand)] hover:bg-[var(--pp-hover)] text-white py-3 px-4 rounded-xl font-black text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>TRY NOW &amp; SAVE ₹{savingsAmount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed z-[99] bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-32px)] bg-[var(--pp-brand)] text-white rounded-xl py-3 px-4 shadow-2xl text-xs flex items-center justify-between border border-white/10 animate-fade-in">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-3 text-stone-300 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}