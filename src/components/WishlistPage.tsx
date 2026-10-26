import React from "react";
import { motion } from "motion/react";
import MotionWrapper from "./MotionWrapper";
import { Product, CartItem } from "../types";

interface WishlistPageProps {
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
  onAddToCart: (item: CartItem) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlist,
  onToggleWishlist,
  onOpenProduct,
  onAddToCart,
}) => {
  return (
    <MotionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        id="wishlist-listing-section"
        className="space-y-6"
      >
        <div className="text-center space-y-1 max-w-sm mx-auto">
          <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase">My Favorites</span>
          <h1 className="text-xl sm:text-2xl font-bold">Luxury Pet Wishlist</h1>
          <p className="text-xs text-stone-405">Reserved, organic, and smart selections for your loving pet health companions.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map((p) => (
            <div
              key={p.id}
              id={`wishlist-item-${p.id}`}
              className="bg-white dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-2xl p-3 shadow-sm hover:shadow-md cursor-pointer relative group flex flex-col justify-between"
            >
              <button
                id={`remove-wish-${p.id}`}
                onClick={() => onToggleWishlist(p)}
                aria-label={`Remove ${p.name} from wishlist`}
                className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-white rounded-full text-red-500 shadow-sm border"
              >
                ✕
              </button>

              <div onClick={() => onOpenProduct(p)}>
                <div className="h-28 sm:h-36 bg-stone-50 rounded-xl overflow-hidden p-1 relative">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="w-full h-full object-contain rounded-lg shrink-0"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-3.5 space-y-1">
                  <span className="text-[9px] font-mono text-stone-400 uppercase block">{p.category}</span>
                  <h3 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{p.name}</h3>
                  <p className="text-[10px] text-stone-500 font-serif italic line-clamp-1">{p.tagline}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-900 pt-2.5 mt-3">
                <span className="font-bold text-xs sm:text-sm">₹{p.price}</span>
                <button
                  id={`wish-add-cart-${p.id}`}
                  onClick={() => onAddToCart({ product: p, quantity: 1, selectedSize: p.sizeVariants?.[0] || "Standard" })}
                  className="text-[10px] bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

          {wishlist.length === 0 && (
            <div className="text-center col-span-2 md:col-span-4 py-12 text-stone-450 text-xs">
              Your premium pet wishlist is empty. Tap hearts on catalog formulas to list them here.
            </div>
          )}
        </div>
      </motion.div>
    </MotionWrapper>
  );
};

export default WishlistPage;
