import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  Truck,
  Gift,
  Tag,
  Check,
} from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { CartItem, Product, ShippingDetails } from "../types";
import { getProductSizePrice, getProductOriginalSizePrice } from "../utils";
import { getProductSlug } from "../productRoutes";

export type CheckoutStep = "cart" | "address" | "receipt";

export interface CartTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  gstAmount: number;
  totalAmount: number;
}

interface CartPageProps {
  // Cart
  cart: CartItem[];
  totals: CartTotals;
  onAdjustQuantity: (index: number, change: number) => void;
  onRemoveItem: (index: number) => void;
  onExploreShop: () => void;

  /** NEW – full catalogue, used to build the package offers (kit, combos) */
  allProducts?: Product[];
  /** NEW – called when the user picks a package. Parent should REPLACE the cart with these items. */
  onApplyPackage?: (items: CartItem[]) => void;

  // Checkout flow
  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;
  onSubmitCheckout: (e: React.FormEvent) => void;

  // Pincode / shipping
  pincodeQuery: string;
  setPincodeQuery: (v: string) => void;
  onVerifyPincode: () => void;
  logisticError: string;
  logisticRates: any[] | null;
  logisticQueryState: string;
  selectedCourier: any;
  setSelectedCourier: (c: any) => void;

  // Coupon
  couponInputCode: string;
  setCouponInputCode: (v: string) => void;
  onApplyCoupon: () => void;
  couponMessage: { text: string; isError: boolean };

  // Address + payment
  shippingForm: ShippingDetails;
  setShippingForm: (f: ShippingDetails) => void;
  paymentChoice: "COD" | "Online";
  setPaymentChoice: (p: "COD" | "Online") => void;
}

const FREE_SHIPPING_THRESHOLD = 1199;
/** Discount applied to each product in a "X + Y" combo. Change to taste. */
const COMBO_DISCOUNT = 0.1;

/* ───────────── helpers ───────────── */
const rupee = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const pctOff = (original: number, price: number) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

const getOriginal = (item: CartItem) => {
  const o = (item.product as any).originalPrice as number | undefined;
  return o && o > item.product.price ? o : item.product.price;
};

/* ───────────── package offers ───────────── */
interface OfferLine {
  product: Product;
  qty: number;
  unitPrice: number;
  unitOriginal: number;
  size: string;
}

interface PackageOffer {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  lines: OfferLine[];
  total: number;
  originalTotal: number;
}

const SINGLES = ["furlush-serum", "squeakear-earwash", "furbreeze-heat-cooling-powder"];
const KIT = "complete-grooming-pack";
const PARTNER: Record<string, string> = {
  "furlush-serum": "squeakear-earwash",
  "squeakear-earwash": "furlush-serum",
  "furbreeze-heat-cooling-powder": "furlush-serum",
};

const unitOf = (p: Product) => {
  const size = p.sizeVariants?.[0] || "100 ml";
  return {
    price: getProductSizePrice(p, size),
    original: getProductOriginalSizePrice(p, size),
    size,
  };
};

const signatureOfLines = (lines: { slug: string; qty: number }[]) => {
  const map: Record<string, number> = {};
  lines.forEach((l) => (map[l.slug] = (map[l.slug] || 0) + l.qty));
  return Object.keys(map)
    .sort()
    .map((k) => `${k}:${map[k]}`)
    .join("|");
};

const buildOffers = (cart: CartItem[], allProducts: Product[]): PackageOffer[] => {
  const bySlug = (slug: string) => allProducts.find((p) => getProductSlug(p) === slug);

  const anchorItem =
    cart.find((i) => SINGLES.includes(getProductSlug(i.product))) ||
    cart.find((i) => getProductSlug(i.product) === KIT);
  if (!anchorItem) return [];

  const anchorSlug = getProductSlug(anchorItem.product);
  // Use the catalogue product for base prices (cart items may already carry pack prices)
  const anchor = bySlug(anchorSlug) || anchorItem.product;
  const a = unitOf(anchor);

  const mk = (id: string, title: string, subtitle: string, lines: OfferLine[], total: number, tag?: string): PackageOffer => ({
    id,
    title,
    subtitle,
    tag,
    lines,
    total,
    originalTotal: lines.reduce((s, l) => s + l.unitOriginal * l.qty, 0),
  });

  const packLine = (qty: number, total: number): OfferLine => ({
    product: anchor,
    qty,
    unitPrice: total / qty,
    unitOriginal: a.original,
    size: a.size,
  });

  const offers: PackageOffer[] = [];

  // Kit anchor → single kit and twin kit
  if (anchorSlug === KIT) {
    offers.push(mk("one", "Complete Kit", "1 Complete Grooming Pack", [packLine(1, a.price)], a.price));
    const t = Math.round(a.price * 1.8);
    offers.push(mk("two", "Twin Pack", "2 Complete Grooming Packs", [packLine(2, t)], t, "Best value"));
    return offers;
  }

  // Single-product anchor
  const kit = bySlug(KIT);
  if (kit) {
    const k = unitOf(kit);
    offers.push(
      mk(
        "kit",
        "Complete Grooming Kit",
        "Serum + Ear Wash + Cooling Powder",
        [{ product: kit, qty: 1, unitPrice: k.price, unitOriginal: k.original, size: k.size }],
        k.price,
        "Complete routine"
      )
    );
  }

  const partner = PARTNER[anchorSlug] ? bySlug(PARTNER[anchorSlug]) : undefined;
  if (partner) {
    const p = unitOf(partner);
    const aPrice = Math.round(a.price * (1 - COMBO_DISCOUNT));
    const pPrice = Math.round(p.price * (1 - COMBO_DISCOUNT));
    offers.push(
      mk(
        "combo",
        `${anchor.name} + ${partner.name}`,
        "Two products, one routine",
        [
          { product: anchor, qty: 1, unitPrice: aPrice, unitOriginal: a.original, size: a.size },
          { product: partner, qty: 1, unitPrice: pPrice, unitOriginal: p.original, size: p.size },
        ],
        aPrice + pPrice
      )
    );
  }

  const two = Math.round(a.price * 1.8);
  const three = Math.round(a.price * 2.6);
  offers.push(mk("two", `Buy 2 ${anchor.name}`, "Pack of 2", [packLine(2, two)], two, "Popular"));
  offers.push(mk("three", `Buy 3 ${anchor.name}`, "Pack of 3", [packLine(3, three)], three));
  offers.push(mk("one", `Buy 1 ${anchor.name}`, "Single bottle", [packLine(1, a.price)], a.price));

  return offers;
};

const offerToCartItems = (offer: PackageOffer): CartItem[] =>
  offer.lines.map((l) => ({
    product: { ...l.product, price: l.unitPrice, originalPrice: l.unitOriginal } as Product,
    quantity: l.qty,
    selectedSize:
      l.qty > 1 && offer.lines.length === 1 ? `${l.size} (Pack of ${l.qty})` : l.size,
  }));

/* ───────────── Order summary (the ACTUAL cart) ───────────── */
interface OrderSummaryProps {
  cart: CartItem[];
  totals: CartTotals;
  selectedCourier: any;
  logisticRates: any[] | null;
  editable?: boolean;
  onAdjustQuantity?: (index: number, change: number) => void;
  onRemoveItem?: (index: number) => void;
  children?: React.ReactNode;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  totals,
  selectedCourier,
  logisticRates,
  editable = false,
  onAdjustQuantity,
  onRemoveItem,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const { subtotal, discount, shippingFee, totalAmount } = totals;
// Prices already include 18% GST, so extract it from the payable total
const gstAmount = (totalAmount * 18) / 118;
  const regularShipping: number | undefined =
    selectedCourier?.rate ?? logisticRates?.[0]?.rate ?? undefined;

  const originalTotal = cart.reduce((s, i) => s + getOriginal(i) * i.quantity, 0);
  const totalSaved = Math.max(0, originalTotal - subtotal) + discount;

  return (
    <aside id="order-summary" className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-5 pt-5">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900">ORDER SUMMARY</h2>
      </div>

      {/* Mobile toggle row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="lg:hidden mt-4 w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-y border-stone-200 bg-stone-50 text-sm text-stone-600"
      >
        <span className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          {open ? "Hide" : "Show"} order summary
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="font-semibold text-stone-900">{rupee(totalAmount)}</span>
      </button>
      <div className="hidden lg:block mt-4 border-t border-stone-200" />

      <div className={`${open ? "block" : "hidden"} lg:block`}>
        <ul className="px-4 sm:px-5 py-4 space-y-4">
          {cart.map((item, i) => {
            const original = getOriginal(item);
            const off = pctOff(original, item.product.price);
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt=""
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-stone-200 object-cover bg-white"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-stone-500 text-white text-[11px] font-semibold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-800 leading-snug break-words">{item.product.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{item.selectedSize}</p>
                  {editable && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-stone-300 rounded-md select-none">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => onAdjustQuantity?.(i, -1)}
                          className="h-6 w-6 text-stone-600 hover:text-stone-900"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => onAdjustQuantity?.(i, 1)}
                          className="h-6 w-6 text-stone-600 hover:text-stone-900"
                        >
                          +
                        </button>
                      </div>
                      <button
                        id={`remove-cart-item-${i}`}
                        type="button"
                        onClick={() => onRemoveItem?.(i)}
                        className="text-xs font-semibold text-stone-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {off > 0 && (
                    <p className="text-xs font-bold text-rose-700 line-through">{rupee(original)} each</p>
                  )}
                  <p className="text-sm font-bold text-stone-900">{rupee(item.product.price)} each</p>
                  {off > 0 && <p className="text-xs font-bold text-emerald-700">You Save {off}%</p>}
                </div>
              </li>
            );
          })}

          {/* Shipping */}
          <li className="flex items-center gap-3">
            <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-stone-200 bg-amber-50 flex items-center justify-center">
              <Truck className="h-6 w-6 text-amber-700" />
            </div>
            <p className="flex-1 text-sm text-stone-800">{shippingFee === 0 ? "Free Shipping" : "Shipping"}</p>
            <div className="text-right shrink-0">
              {shippingFee === 0 ? (
                <>
                  {regularShipping ? (
                    <p className="text-xs text-stone-500 line-through">{rupee(regularShipping)}</p>
                  ) : null}
                  <p className="text-sm font-bold text-stone-900">Free</p>
                </>
              ) : (
                <p className="text-sm font-bold text-stone-900">{rupee(shippingFee)}</p>
              )}
            </div>
          </li>

          {discount > 0 && (
            <li className="flex items-center gap-3">
              <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <Tag className="h-6 w-6 text-emerald-700" />
              </div>
              <p className="flex-1 text-sm text-stone-800">Coupon discount</p>
              <p className="text-sm font-bold text-emerald-700 shrink-0">-{rupee(discount)}</p>
            </li>
          )}
        </ul>

        {children}
      </div>

      {/* Totals */}
           {/* Bill details */}
      <div className="px-4 sm:px-5 py-4 border-t border-stone-200">
        <h3 className="text-base font-extrabold text-stone-900 mb-4">Bill details</h3>

        <div className="space-y-3.5 text-sm">
          {/* Items total */}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-stone-800">
              <ShoppingBag className="h-4 w-4 text-stone-500" />
              Items total
              {originalTotal > subtotal && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  Saved {rupee(originalTotal - subtotal)}
                </span>
              )}
            </span>
            <span className="flex items-baseline gap-2">
              {originalTotal > subtotal && (
                <span className="text-xs text-stone-400 line-through">{rupee(originalTotal)}</span>
              )}
              <span className="font-bold text-stone-900">{rupee(subtotal)}</span>
            </span>
          </div>

          {/* Coupon discount */}
          {discount > 0 && (
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-stone-800">
                <Tag className="h-4 w-4 text-stone-500" />
                Coupon discount
              </span>
              <span className="font-bold text-emerald-700">-{rupee(discount)}</span>
            </div>
          )}

          {/* Delivery charge */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-stone-800">
                <Truck className="h-4 w-4 text-stone-500" />
                Delivery charge
              </span>
              <span className="flex items-baseline gap-2">
                {shippingFee === 0 ? (
                  <>
                    {regularShipping ? (
                      <span className="text-xs text-stone-400 line-through">{rupee(regularShipping)}</span>
                    ) : null}
                    <span className="font-bold text-emerald-700">FREE</span>
                  </>
                ) : (
                  <span className="font-bold text-stone-900">{rupee(shippingFee)}</span>
                )}
              </span>
            </div>
            {shippingFee > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="mt-1 pl-6 text-xs font-medium text-orange-600">
                Add {rupee(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery
              </p>
            )}
          </div>

          {/* GST (already inside the prices) */}
          <div className="flex items-center justify-between gap-3 text-xs text-stone-500">
            <span className="pl-6">Includes 18% GST</span>
            <span>₹{((totalAmount * 18) / 118).toFixed(2)}</span>
          </div>
        </div>

        {/* Grand total */}
        <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-base font-extrabold text-stone-900 border-b border-dashed border-stone-400">
            Grand total
          </span>
          <span className="text-xl font-extrabold text-stone-900">{rupee(totalAmount)}</span>
        </div>

        {totalSaved > 0 && (
          <p className="mt-2 text-xs font-semibold text-emerald-700 text-right">
            You're saving {rupee(totalSaved)} on this order
          </p>
        )}
      </div>
    </aside>
  );
};

/* ───────────── Package option card (left column) ───────────── */
const PackageCard: React.FC<{
  offer: PackageOffer;
  checked: boolean;
  onSelect: () => void;
}> = ({ offer, checked, onSelect }) => {
  const units = offer.lines.reduce((s, l) => s + l.qty, 0);
  const each = offer.total / units;
  const eachOriginal = offer.originalTotal / units;
  const off = pctOff(offer.originalTotal, offer.total);
  const images = Array.from(new Set(offer.lines.map((l) => l.product.imageUrl))).slice(0, 3);

  return (
    <label
      className={`relative flex items-center gap-3 sm:gap-4 rounded-2xl border-2 p-3 sm:p-4 cursor-pointer transition-colors ${
        checked ? "border-teal-600 bg-teal-50/60" : "border-stone-200 bg-white hover:border-stone-300"
      }`}
    >
      <input
        type="radio"
        name="package-offer"
        checked={checked}
        onChange={onSelect}
        className="h-5 w-5 shrink-0 accent-teal-600"
      />

      <div className="flex -space-x-3 shrink-0">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg border-2 border-white object-cover bg-white"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-bold text-sm sm:text-base text-stone-900 leading-snug">{offer.title}</p>
          {offer.tag && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
              {offer.tag}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-0.5">{offer.subtitle}</p>
      </div>

      <div className="text-right shrink-0">
        <div className="flex items-center justify-end gap-2">
          {off > 0 && (
            <span className="rounded-full bg-rose-700 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white">
              {off}% OFF
            </span>
          )}
          {eachOriginal > each && (
            <span className="hidden sm:inline text-xs font-bold text-rose-700 line-through">
              {rupee(eachOriginal)} each
            </span>
          )}
        </div>
        <p className="mt-1 text-base sm:text-lg font-extrabold text-stone-900">
          {rupee(each)} <span className="text-xs font-semibold text-stone-500">each</span>
        </p>
        <p className="text-[11px] text-stone-500">Total {rupee(offer.total)}</p>
      </div>
    </label>
  );
};

/* ───────────── Main page ───────────── */
export const CartPage: React.FC<CartPageProps> = ({
  cart,
  totals,
  onAdjustQuantity,
  onRemoveItem,
  onExploreShop,
  allProducts = [],
  onApplyPackage,
  checkoutStep,
  setCheckoutStep,
  onSubmitCheckout,
  pincodeQuery,
  setPincodeQuery,
  onVerifyPincode,
  logisticError,
  logisticRates,
  logisticQueryState,
  selectedCourier,
  setSelectedCourier,
  couponInputCode,
  setCouponInputCode,
  onApplyCoupon,
  couponMessage,
  shippingForm,
  setShippingForm,
  paymentChoice,
  setPaymentChoice,
}) => {
  const { subtotal, totalAmount } = totals;

  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Package offers depend on what is in the cart
  const offers = useMemo(
    () => (onApplyPackage ? buildOffers(cart, allProducts) : []),
    [cart, allProducts, onApplyPackage]
  );

  // The selected package is whichever one matches the cart contents
  const cartSignature = signatureOfLines(
    cart.map((i) => ({ slug: getProductSlug(i.product), qty: i.quantity }))
  );
  const activeOfferId = offers.find(
    (o) => signatureOfLines(o.lines.map((l) => ({ slug: getProductSlug(l.product), qty: l.qty }))) === cartSignature
  )?.id;

  const totalSavedByPacks = cart.reduce((s, i) => s + (getOriginal(i) - i.product.price) * i.quantity, 0);

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "cart", label: "Cart" },
    { key: "address", label: "Delivery" },
    { key: "receipt", label: "Invoice" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === checkoutStep);

  const inputCls =
    "w-full bg-white border border-stone-300 text-sm px-3.5 py-2.5 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600";

  const hasOffers = offers.length > 0;

  return (
    <MotionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        id="shopping-cart-view"
        className={`space-y-5 sm:space-y-6 ${checkoutStep === "cart" && cart.length > 0 ? "pb-24 lg:pb-0" : ""}`}
      >
        {/* Step indicator */}
        <nav aria-label="Checkout steps" className="flex items-center gap-2 text-xs sm:text-sm">
          {steps.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <React.Fragment key={s.key}>
                <span className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      active
                        ? "bg-teal-600 text-white"
                        : done
                        ? "bg-teal-100 text-teal-700"
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={active ? "font-bold text-stone-900" : "text-stone-500"}>{s.label}</span>
                </span>
                {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />}
              </React.Fragment>
            );
          })}
        </nav>

        {/* ───────── STEP 1: CART ───────── */}
        {checkoutStep === "cart" && (
          <>
            {cart.length === 0 ? (
              <div className="text-center py-12 bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <ShoppingBag className="h-10 w-10 text-stone-300 mx-auto" />
                <p className="text-sm text-stone-500">Your cart is empty.</p>
                <button
                  id="empty-cart-shop-btn"
                  onClick={onExploreShop}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl"
                >
                  Explore products
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-5 lg:gap-8 items-start ${
                  hasOffers ? "lg:grid-cols-[minmax(0,1fr)_400px]" : "max-w-xl mx-auto"
                }`}
              >
                {/* LEFT: package offers for the product in the cart */}
                {hasOffers && (
                  <section aria-labelledby="packages-heading" className="space-y-4">
                    <div>
                      <h2 id="packages-heading" className="text-lg sm:text-xl font-extrabold text-stone-900">
                        Save more with a package
                      </h2>
                      <p className="text-sm text-stone-500 mt-1">
                        Pick a package and your order updates automatically.
                      </p>
                    </div>

                    <div className="space-y-3" role="radiogroup" aria-label="Package offers">
                      {offers.map((offer) => (
                        <PackageCard
                          key={offer.id}
                          offer={offer}
                          checked={activeOfferId === offer.id}
                          onSelect={() => onApplyPackage?.(offerToCartItems(offer))}
                        />
                      ))}
                    </div>

                    {/* Free gifts box */}
                    <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                        <Gift className="h-4 w-4 text-teal-700" />
                        {remainingForFree === 0
                          ? "You've unlocked free shipping"
                          : `Add ${rupee(remainingForFree)} more to unlock free shipping`}
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white overflow-hidden border border-teal-100">
                        <div
                          className="h-full rounded-full bg-teal-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div
                          className={`rounded-xl border border-dashed p-3 text-center ${
                            remainingForFree === 0 ? "border-teal-600 bg-white" : "border-stone-300 bg-white/60"
                          }`}
                        >
                          <span className="mx-auto mb-1 block w-fit rounded bg-rose-700 px-2 py-0.5 text-[10px] font-bold text-white">
                            FREE
                          </span>
                          <p className="text-xs font-semibold text-stone-800">Shipping</p>
                          <p className="text-[11px] text-stone-500">on orders over {rupee(FREE_SHIPPING_THRESHOLD)}</p>
                        </div>
                        <div
                          className={`rounded-xl border border-dashed p-3 text-center ${
                            totalSavedByPacks > 0 ? "border-teal-600 bg-white" : "border-stone-300 bg-white/60"
                          }`}
                        >
                          <span className="mx-auto mb-1 block w-fit rounded bg-rose-700 px-2 py-0.5 text-[10px] font-bold text-white">
                            {totalSavedByPacks > 0 ? `SAVE ${rupee(totalSavedByPacks)}` : "SAVE MORE"}
                          </span>
                          <p className="text-xs font-semibold text-stone-800">Package savings</p>
                          <p className="text-[11px] text-stone-500">
                            {totalSavedByPacks > 0 ? "applied to your order" : "choose a package above"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* RIGHT: actual cart / order summary */}
                <div className="lg:sticky lg:top-24 space-y-4">
                  <OrderSummary
                    cart={cart}
                    totals={totals}
                    selectedCourier={selectedCourier}
                    logisticRates={logisticRates}
                    editable
                    onAdjustQuantity={onAdjustQuantity}
                    onRemoveItem={onRemoveItem}
                  >
                    <div className="px-4 sm:px-5 pb-4 space-y-4">
                      {/* Pincode */}
                      <div className="rounded-xl bg-stone-50 border border-stone-200 p-3">
                        <label
                          htmlFor="cart-pincode"
                          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          Check delivery to your PIN code
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="cart-pincode"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="e.g. 400001"
                            value={pincodeQuery}
                            onChange={(e) => setPincodeQuery(e.target.value.replace(/\D/g, ""))}
                            className={`${inputCls} flex-1 min-w-0`}
                          />
                          <button
                            id="check-pincode-btn"
                            type="button"
                            onClick={onVerifyPincode}
                            className="shrink-0 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 rounded-lg"
                          >
                            Check
                          </button>
                        </div>
                        {logisticError && <p className="text-xs text-red-600 mt-2">{logisticError}</p>}
                        {logisticRates && (
                          <div id="pincode-rates-panel" className="mt-3 space-y-1.5 text-xs text-stone-700">
                            <p className="font-bold text-teal-800">Delivery to {logisticQueryState || pincodeQuery}</p>
                            {logisticRates.map((c: any) => (
                              <div key={c.id} className="flex justify-between gap-2">
                                <span>
                                  {c.name} · {c.estimatedDays}
                                </span>
                                <span className="font-bold">{rupee(c.rate)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Coupon */}
                      <div>
                        <label htmlFor="cart-coupon" className="text-xs font-bold text-stone-700 block mb-2">
                          Discount code
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="cart-coupon"
                            type="text"
                            placeholder="Try PAWWCIOUS5"
                            value={couponInputCode}
                            onChange={(e) => setCouponInputCode(e.target.value)}
                            className={`${inputCls} flex-1 min-w-0`}
                          />
                          <button
                            id="apply-coupon-btn"
                            type="button"
                            onClick={onApplyCoupon}
                            className="shrink-0 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 rounded-lg"
                          >
                            Apply
                          </button>
                        </div>
                        {couponMessage.text && (
                          <p
                            className={`text-xs mt-2 font-medium ${
                              couponMessage.isError ? "text-red-600" : "text-emerald-700"
                            }`}
                          >
                            {couponMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </OrderSummary>

                  <button
                    id="proceed-checkout-btn"
                    type="button"
                    onClick={() => setCheckoutStep("address")}
                    className="hidden lg:block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-4 rounded-xl shadow-md transition-colors"
                  >
                    Continue to delivery · {rupee(totalAmount)}
                  </button>
                  <p className="hidden lg:flex items-center justify-center gap-1.5 text-xs text-stone-500">
                    <ShieldCheck className="h-4 w-4 text-teal-700" />
                    Secure checkout · 18% GST included
                  </p>
                </div>
              </div>
            )}

            {/* Mobile sticky checkout bar */}
            {cart.length > 0 && (
              <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
                <div className="mx-auto max-w-xl flex items-center gap-3">
                  <div className="leading-tight">
                    <p className="text-[11px] text-stone-500">Total</p>
                    <p className="text-lg font-extrabold text-stone-900">{rupee(totalAmount)}</p>
                  </div>
                  <button
                    id="proceed-checkout-btn-mobile"
                    type="button"
                    onClick={() => setCheckoutStep("address")}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3.5 rounded-xl"
                  >
                    Continue to delivery
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ───────── STEP 2: ADDRESS ───────── */}
        {checkoutStep === "address" && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 lg:gap-8 items-start">
            <div className="lg:order-2 lg:sticky lg:top-24">
              <OrderSummary
                cart={cart}
                totals={totals}
                selectedCourier={selectedCourier}
                logisticRates={logisticRates}
              />
            </div>

            <div className="lg:order-1 bg-white border border-stone-200 p-4 sm:p-7 rounded-2xl">
              <button
                id="checkout-panel-back-btn"
                type="button"
                onClick={() => setCheckoutStep("cart")}
                className="text-sm font-semibold text-stone-500 flex items-center gap-1.5 mb-5 hover:text-stone-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to cart
              </button>

              <h2 className="text-lg font-bold text-stone-900 mb-4">Delivery details</h2>

              <form id="checkout-shipping-address-form" onSubmit={onSubmitCheckout} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">Full name</label>
                    <input
                      type="text"
                      required
                      placeholder="Aditya Roy"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">Phone (10 digits)</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="9876543210"
                      value={shippingForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setShippingForm({ ...shippingForm, phone: val });
                      }}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">Street address & landmark</label>
                  <input
                    type="text"
                    required
                    placeholder="Royal Residences, 4B Park Street"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">City / town</label>
                    <input
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">State</label>
                    <input
                      type="text"
                      required
                      placeholder="Maharashtra"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">PIN code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      placeholder="400001"
                      value={shippingForm.pinCode}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, pinCode: e.target.value.replace(/\D/g, "") })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Courier selection */}
                {shippingForm.pinCode && shippingForm.pinCode.length === 6 && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">Choose a courier</span>
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Serviceable
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">Weight: 480 g</span>
                    </div>

                    {!logisticRates ? (
                      <div className="text-xs text-stone-500 animate-pulse flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                        Fetching courier rates…
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {logisticRates.map((courier: any) => {
                          const isSelected = selectedCourier?.id === courier.id;
                          const actualRate = subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : rupee(courier.rate);
                          return (
                            <button
                              type="button"
                              key={courier.id}
                              onClick={() => setSelectedCourier(courier)}
                              aria-pressed={isSelected}
                              className={`text-left p-3 rounded-xl border-2 text-xs flex flex-col justify-between transition relative ${
                                isSelected ? "bg-white border-teal-600" : "bg-white border-stone-200 hover:border-stone-300"
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                              <div className="pr-6">
                                <h4 className="font-bold text-sm text-stone-900 truncate">{courier.name}</h4>
                                <span className="text-stone-500 block mt-0.5">{courier.estimatedDays}</span>
                              </div>
                              <div className="mt-3 flex justify-between items-center border-t border-stone-100 pt-2">
                                <span className="text-amber-600 font-semibold">★ {courier.rating}</span>
                                <span className="font-extrabold text-stone-900">{actualRate}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Rates come from Shiprocket (Delhivery, Blue Dart, DTDC, India Post). Orders over ₹1,199 ship
                      free automatically.
                    </p>
                  </div>
                )}

                {/* Payment choice */}
                <fieldset className="space-y-2 pt-2">
                  <legend className="text-xs font-medium text-stone-600 mb-2">Payment method</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "pay-choice-online", value: "Online" as const, Icon: ShieldCheck, title: "UPI & cards", sub: "Pay securely with Razorpay" },
                      { id: "pay-choice-cod", value: "COD" as const, Icon: Truck, title: "Cash on delivery", sub: "Pay the courier at your door" },
                    ].map(({ id, value, Icon, title, sub }) => {
                      const active = paymentChoice === value;
                      return (
                        <button
                          key={id}
                          id={id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setPaymentChoice(value)}
                          className={`p-4 border-2 rounded-xl flex items-center gap-3 text-left transition ${
                            active
                              ? "bg-teal-50 border-teal-600 text-teal-900"
                              : "bg-white border-stone-200 hover:bg-stone-50 text-stone-700"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span>
                            <span className="block font-bold text-sm">{title}</span>
                            <span className="block text-xs opacity-75">{sub}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <button
                  id="submit-payment-btn"
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-4 rounded-xl mt-2 shadow-md transition-colors"
                >
                  Confirm & pay · {rupee(totalAmount)}
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </MotionWrapper>
  );
};

export default CartPage;