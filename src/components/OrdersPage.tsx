import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Truck } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { Order } from "../types";

interface OrdersPageProps {
  orders: Order[];
  currentUser: { uid?: string } | null;
  onTrack: (awb: string) => void;
}

const STATUS_FILTERS = ["All", "Order Received", "AWB Generated", "In Transit", "Delivered", "Cancelled"];

const stepDot = (done: boolean) =>
  `h-3.5 w-3.5 rounded-full flex items-center justify-center text-white text-[7px] ${done ? "bg-teal-600" : "bg-stone-300 dark:bg-stone-700"}`;

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders, currentUser, onTrack }) => {
  // Filter state lives here now (it was only used by this view)
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sortedOrders = useMemo(() => {
    // 1. Ownership
    let filtered = orders.filter((o) =>
      currentUser ? o.userId === currentUser.uid : o.userId === "mock_guest_user"
    );

    // 2. Status
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.shippingStatus === statusFilter);
    }

    // 3. Search
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter((o) => {
        const oIdMatch = o.orderId.toLowerCase().includes(q);
        const partnerMatch = o.courierPartner?.toLowerCase().includes(q) || false;
        const nameMatch = o.shippingDetails?.name?.toLowerCase().includes(q) || false;
        const cityMatch = o.shippingDetails?.city?.toLowerCase().includes(q) || false;
        const itemsMatch = o.items?.some((it) => it.productName.toLowerCase().includes(q)) || false;
        return oIdMatch || partnerMatch || nameMatch || cityMatch || itemsMatch;
      });
    }

    // 4. Newest first
    return [...filtered].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [orders, currentUser, statusFilter, searchQuery]);

  return (
    <MotionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        id="orders-customer-panel"
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase">Track Orders</span>
          <h1 className="text-xl sm:text-2xl font-bold font-sans">Purchases & Shipping Logs</h1>
          <p className="text-xs text-stone-500">Track dynamic Delhivery couriers, AWB entries, and active invoices.</p>
        </div>

        {/* Filters */}
        <div className="bg-[#fcfdfd] dark:bg-[#131b18] border border-stone-200 dark:border-[#22352F] p-4 rounded-2xl space-y-3 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-stone-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search order ID, partner, phone, name or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-teal-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {STATUS_FILTERS.map((status) => {
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`text-[10px] sm:text-xs px-3 py-2 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                      ? "bg-[#1f2d29] dark:bg-[#2c3e38] text-white border-[#1f2d29] shadow-xs"
                      : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-50"
                      }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {sortedOrders.map((o) => {
            const awbDone = ["AWB Generated", "In Transit", "Delivered"].includes(o.shippingStatus);
            const shippedDone = ["In Transit", "Delivered"].includes(o.shippingStatus);
            const deliveredDone = o.shippingStatus === "Delivered";

            return (
              <div key={o.orderId} className="border border-stone-150 dark:border-stone-850 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/50 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-150 p-3 bg-stone-50/50 dark:bg-stone-900 rounded-xl">
                  <div>
                    <p className="text-[10px] text-stone-400 font-mono uppercase">Order Invoice</p>
                    <h4 className="font-bold text-xs font-mono text-stone-900 dark:text-stone-100">{o.orderId}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-405 font-mono uppercase">Delivery Status</p>
                    <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-100/55 px-2.5 py-1 rounded-full">{o.shippingStatus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-mono text-[9px] text-stone-450 uppercase mb-1">Shipping Details</p>
                    <p className="font-bold text-stone-900 dark:text-stone-300">{o.shippingDetails?.name || "No recipient name"}</p>
                    <p className="text-stone-500 text-[11px] line-clamp-1">
                      {o.shippingDetails
                        ? `${o.shippingDetails.address || ""}, ${o.shippingDetails.city || ""}`
                        : "No address specified"}
                    </p>
                    <p className="text-stone-500 text-[11px]">Phone: {o.shippingDetails?.phone || "N/A"}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-[9px] text-stone-455 uppercase mb-1">Receipt Summary</p>
                    <p className="text-stone-500">Subtotal: ₹{o.subtotal}</p>
                    {o.discount > 0 && <p className="text-emerald-600">Saved Coupon: -₹{o.discount}</p>}
                    <p className="font-bold text-stone-900 dark:text-stone-100 mt-1">Charged: ₹{o.totalAmount}</p>
                  </div>
                </div>

                {/* Free gift */}
                {o.freeGift && (
                  <div className="flex items-center gap-2.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 p-2.5 rounded-xl">
                    {o.freeGift.imageUrl && (
                      <img
                        src={o.freeGift.imageUrl}
                        alt={o.freeGift.designName || "Free Gift"}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-amber-300 dark:border-amber-700"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-950 dark:text-amber-200 truncate">
                          🎁 Free Gift: {o.freeGift.designName || o.freeGift.name}
                        </span>
                        <span className="bg-emerald-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded">FREE</span>
                      </div>
                      <p className="text-[10px] text-amber-800 dark:text-amber-400 font-mono">
                        Quantity: {o.freeGift.quantity || 1} • Festive blessing included
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-150 dark:border-stone-850">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">Fulfillment Timeline (Shiprocket Aggregator)</p>
                    {o.courierPartner && (
                      <span className="bg-amber-150 text-amber-900 dark:bg-[#1C2E2B] dark:text-teal-400 text-[8px] font-mono px-2 py-0.5 rounded font-black uppercase">{o.courierPartner}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono relative mt-1 select-none">
                    <div className="absolute top-1.5 left-2 right-2 h-0.5 bg-stone-200 dark:bg-stone-800 z-0" />

                    <div className="flex flex-col items-center z-10">
                      <div className={stepDot(true)}>✓</div>
                      <span className="text-[8px] text-stone-400 mt-1">Received</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <div className={stepDot(awbDone)}>{awbDone ? "✓" : "2"}</div>
                      <span className="text-[8px] text-stone-400 mt-1">AWB Tracked</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <div className={stepDot(shippedDone)}>{shippedDone ? "✓" : "3"}</div>
                      <span className="text-[8px] text-stone-400 mt-1">Shipped</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <div className={stepDot(deliveredDone)}>{deliveredDone ? "✓" : "4"}</div>
                      <span className="text-[8px] text-stone-400 mt-1">Delivered</span>
                    </div>
                  </div>

                  {o.awbNumber && (
                    <div className="mt-3.5 pt-2.5 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-[10px] font-mono text-stone-450 dark:text-stone-400">
                      <div className="flex flex-col text-left">
                        <span>Partner: {o.courierPartner || "Delhivery Air (Shiprocket)"}</span>
                        <span className="font-extrabold text-stone-900 dark:text-stone-100 uppercase">AWB: {o.awbNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onTrack(o.awbNumber!)}
                        className="bg-teal-600 hover:bg-teal-750 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition active:scale-95"
                      >
                        <Truck className="h-3 w-3 animate-bounce" />
                        Live Track
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sortedOrders.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-[#1c221e] p-6 rounded-2xl border border-stone-150 dark:border-stone-850">
              <ShoppingBag className="h-8 w-8 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-xs text-stone-550 dark:text-stone-400 mt-2">No transaction histories matched this query or status.</p>
            </div>
          )}
        </div>
      </motion.div>
    </MotionWrapper>
  );
};

export default OrdersPage;
