import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ShieldAlert, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastTrayProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastTray: React.FC<ToastTrayProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-tray"
      className="fixed top-24 right-4 sm:right-6 z-[999] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";
          const isInfo = toast.type === "info";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -25, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.22 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full bg-[#FAF9F5]/95 dark:bg-stone-900/95 border border-stone-200/95 dark:border-stone-800/95 shadow-2xl rounded-2xl p-4 flex items-start gap-4.5 relative overflow-hidden backdrop-blur-md"
            >
              {/* Colored side indicator */}
              <div
                className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  isSuccess ? "bg-emerald-600" :
                  isError ? "bg-red-600" :
                  isWarning ? "bg-amber-500" : "bg-teal-700"
                }`}
              />

              {/* Icon */}
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isSuccess ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" :
                  isError ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
                  isWarning ? "bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400" :
                  "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                }`}
              >
                {isSuccess && <CheckCircle className="h-4 w-4" />}
                {isError && <ShieldAlert className="h-4 w-4" />}
                {isWarning && <ShieldAlert className="h-4 w-4" />}
                {isInfo && <Info className="h-4 w-4" />}
              </div>

              <div className="flex-1 space-y-0.5 text-left pr-4">
                <p className="text-[10px] font-mono tracking-widest uppercase font-black text-stone-900/80 dark:text-[#FAF9F5] leading-none">
                  {isSuccess ? "Success Action" :
                    isError ? "System Alert" :
                    isWarning ? "Caution Required" : "Notification"}
                </p>
                <p className="text-[11px] text-stone-700 dark:text-stone-300 font-semibold leading-relaxed font-sans pr-1">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="text-stone-400 hover:text-stone-900 dark:hover:text-[#FAF9F5] p-1.5 rounded-full hover:bg-stone-100/60 dark:hover:bg-stone-800/60 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastTray;
