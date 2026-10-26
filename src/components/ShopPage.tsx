import React from "react";
import { motion } from "motion/react";
import { ShoppingBag, Star } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { Product, Category, Review, CartItem } from "../types";

type ProductTab = "benefits" | "usage" | "reviews";

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenProduct: (product: Product, tab?: ProductTab) => void;
  onAddToCart: (item: CartItem) => void;
}

const categoryBtnClass = (active: boolean) =>
  `text-xs px-4 py-2 rounded-xl font-bold tracking-wide transition-all border ${
    active
      ? "bg-teal-800 text-white border-teal-800 shadow-sm"
      : "bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50 hover:border-stone-350 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 dark:hover:bg-stone-850"
  }`;

/** Same filter rules as before, kept in one place. */
const matchesCategory = (p: Product, selected: string): boolean => {
  if (selected === "All") return true;
  if (selected === "grooming-hygiene") {
    return p.category === "grooming-hygiene" || p.name.toLowerCase().includes("serum") || p.id.toLowerCase().includes("serum");
  }
  if (selected === "coat-skin-wellness") {
    return p.category === "coat-skin-wellness" || p.name.toLowerCase().includes("powder") || p.id.toLowerCase().includes("powder");
  }
  return p.category === selected;
};

interface ProductCardProps {
  product: Product;
  reviews: Review[];
  onOpenProduct: (product: Product, tab?: ProductTab) => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product: p, reviews, onOpenProduct, onAddToCart }) => {
  const approved = (reviews || []).filter((r) => r.productId === p.id && r.status === "approved");
  const reviewCount = approved.length;
  const averageRating =
    reviewCount > 0
      ? Number((approved.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : p.rating || 4.8;

  return (
    <div
      id={`shop-item-${p.id}`}
      onClick={() => onOpenProduct(p, "benefits")}
      className="bg-white dark:bg-stone-900/40 border border-stone-150 dark:border-stone-850 rounded-2xl p-3 shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="aspect-square w-full bg-stone-50 dark:bg-stone-950 rounded-xl overflow-hidden p-3 relative flex items-center justify-center">
          <img
            src={p.imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          {p.id === "complete-grooming-pack" ? (
            <span className="absolute top-2 right-2 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse shadow-sm">On Sale 🔥</span>
          ) : p.isBestSeller ? (
            <span className="absolute top-2 right-2 bg-teal-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Bestseller</span>
          ) : null}
        </div>

        <div className="mt-3.5 space-y-1">
          <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest block">{p.category}</span>
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-tight truncate">{p.name}</h3>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenProduct(p, "reviews");
            }}
            className="flex items-center gap-1 mt-1 hover:bg-stone-50 dark:hover:bg-stone-0 px-1 -ml-1 rounded-lg w-fit transition group/rev cursor-pointer"
            title="Click to read verified reviews"
          >
            <div className="flex text-amber-500 gap-0.5 animate-fade-in">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.round(averageRating) ? "fill-current text-amber-500" : "text-stone-200 dark:text-stone-705"}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-stone-800 dark:text-stone-300 font-mono mt-0.5">{averageRating}</span>
            <span className="text-[10px] text-teal-850 dark:text-teal-400 group-hover/rev:underline font-mono mt-0.5 font-bold">
              ({reviewCount} verified {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>

          <p className="text-[10px] text-stone-500 dark:text-stone-400 italic line-clamp-1">{p.tagline}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80 pt-2.5 mt-3">
        <span className="font-bold text-xs sm:text-sm dark:text-stone-100">₹{p.price}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart({ product: p, quantity: 1, selectedSize: p.sizeVariants?.[0] || "Standard" });
          }}
          className="mt-3 py-2 px-4 rounded-xl font-mono text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer border bg-teal-800 hover:bg-teal-950 border-teal-700/20 text-white hover:scale-[1.01]"
        >
          Add to Cart →
        </button>
      </div>
    </div>
  );
};

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  reviews,
  selectedCategory,
  onSelectCategory,
  onOpenProduct,
  onAddToCart,
}) => {
  const visible = products.filter((p) => matchesCategory(p, selectedCategory));

  return (
    <MotionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        id="shop-listing-section"
        className="space-y-6"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-stone-900 border border-teal-100 dark:border-teal-900/40 text-teal-850 dark:text-teal-400 text-[10px] font-mono font-semibold tracking-wider uppercase">
            <ShoppingBag className="h-3 w-3 text-teal-600 dark:text-teal-400 animate-pulse" />
            Interactive Storefront
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif italic text-stone-950 dark:text-stone-100 tracking-wide leading-tight mt-1">
            Pawwcious Luxury Apothecary
          </h1>
          <div className="h-[1px] w-12 bg-amber-500/40 mx-auto my-3" />
          <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-400 leading-relaxed max-w-lg mx-auto">
            Formulated with premium botanical essences and clinically approved active organic nutrients for your companion.
          </p>
        </div>

        <div className="relative group overflow-hidden rounded-3xl border border-stone-200/80 shadow-md">
          <img
            src="/images/shop_now_pawwcious.png"
            alt="Pawwcious Luxury Pet Wellness Lifestyle"
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/7] md:aspect-[21/9] object-cover hover:scale-[1.05] transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/45 to-transparent p-4 sm:p-6 flex items-end justify-between text-white">
            <span className="text-[9px] sm:text-xs font-mono tracking-widest uppercase opacity-90 drop-shadow-sm">The Pawwcious Connect</span>
            <span className="text-[8px] sm:text-[10px] font-mono text-stone-200 border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">Nature’s Secret Call</span>
          </div>
        </div>

        {/* Category filter */}
        <div id="shop-categories-filter-bar" className="flex flex-wrap justify-center gap-2 pb-2">
          <button
            id="shop-cat-btn-all"
            onClick={() => onSelectCategory("All")}
            className={categoryBtnClass(selectedCategory === "All")}
          >
            All Concerns 🐾
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`shop-cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={categoryBtnClass(selectedCategory === cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              reviews={reviews}
              onOpenProduct={onOpenProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </motion.div>
    </MotionWrapper>
  );
};

export default ShopPage;
