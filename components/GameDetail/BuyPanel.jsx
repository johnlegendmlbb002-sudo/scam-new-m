"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield } from "react-icons/fi";

export default function BuyPanel({
  activeItem,
  onBuy,
  redirecting,
  buyPanelRef,
}) {
  return (
    <motion.div
      ref={buyPanelRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--border)]
      rounded-[2rem] p-5 md:p-6 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full -mr-16 -mt-16" />

      <div className="flex gap-6 items-center mb-6">
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
           <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-2xl rotate-3 scale-105" />
           <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-white/5 bg-[var(--background)]">
              <Image
                src={activeItem.itemImageId?.image || logo}
                alt={activeItem.itemName}
                fill
                className="object-contain p-2"
              />
           </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 mb-1">
             <FiShield className="text-[var(--accent)]" size={12} />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Secured Purchase</span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none text-[var(--foreground)]">
            {activeItem.itemName}
          </h2>

          <div className="flex items-end gap-3 pt-1">
            <div className="flex items-baseline gap-1">
               <span className="text-xs font-black text-[var(--accent)] opacity-50 italic">₹</span>
               <p className="text-3xl font-black italic text-[var(--accent)] tracking-tighter leading-none">
                 {activeItem.sellingPrice}
               </p>
            </div>
            {activeItem.dummyPrice && (
              <p className="text-xs font-bold line-through text-[var(--muted)] opacity-30 mb-1">
                ₹{activeItem.dummyPrice}
              </p>
            )}
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => onBuy(activeItem)}
        disabled={redirecting}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden flex items-center justify-center gap-3 shadow-lg
          ${
            redirecting
              ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
              : "bg-[var(--accent)] text-black"
          }`}
      >
        <span className="relative z-10">{redirecting ? "Processing..." : "Confirm Purchase"}</span>
        {!redirecting && <FiArrowRight className="relative z-10" size={14} />}
      </motion.button>
    </motion.div>
  );
}
