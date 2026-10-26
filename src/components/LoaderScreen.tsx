import React from "react";
import { motion } from "motion/react";

interface LoaderScreenProps {
  /** While true the screen covers the viewport; when false it slides away. */
  isLoading: boolean;
  /** Called once the slide-away animation completes. */
  onFinished: () => void;
}

export const LoaderScreen: React.FC<LoaderScreenProps> = ({ isLoading, onFinished }) => {
  return (
    <motion.div
      id="premium-loader-screen"
      initial={{ y: 0 }}
      animate={{ y: isLoading ? 0 : "100%" }}
      transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
      onAnimationComplete={() => {
        if (!isLoading) onFinished();
      }}
      className="fixed inset-0 bg-[#0C221D] z-[10000] flex flex-col justify-center items-center select-none overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(20,83,68,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        {/* Logo with single pulse ring */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-2 rounded-[2.5rem] border border-amber-400/20 animate-pulse" />
          <div className="bg-transparent border border-amber-400/15 px-6 py-5 rounded-[2.25rem] shadow-2xl shadow-stone-950/60">
            <img src="/images/pawwcious_logo.webp" width="56" alt="Pawwcious" className="block" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-amber-400 text-[40px] font-glitch tracking-[0.35em] uppercase"
        >
          Pawwcious
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-teal-400/60 text-[12px] font-mono tracking-[0.35em] uppercase"
        >
          Where Healing Journey Begins
        </motion.p>

        {/* Sweep bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-40 h-[1.5px] bg-teal-900/50 rounded-full overflow-hidden mt-1 relative"
        >
          <div
            className="absolute top-0 bottom-0 w-1/2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
              animation: "loaderSweep 1.6s ease-in-out infinite",
            }}
          />
        </motion.div>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1 w-1 rounded-full bg-amber-400/50"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes loaderSweep {
        0%   { transform: translateX(-100%); opacity: 0; }
        15%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { transform: translateX(280%); opacity: 0; }
      }
    `,
        }}
      />
    </motion.div>
  );
};

export default LoaderScreen;
