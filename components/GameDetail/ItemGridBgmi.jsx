"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Image from "next/image";

export default function ItemGridBgmi({
  items,
  gameLogo,
  activeItem,
  setActiveItem,
  buyPanelRef,
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
      className="max-w-6xl mx-auto mb-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      {items.map((item, index) => {
        const isSelected = activeItem?.itemSlug === item.itemSlug;
        const discount = item.dummyPrice
          ? Math.round(((item.dummyPrice - item.sellingPrice) / item.dummyPrice) * 100)
          : 0;

        return (
          <motion.div
            key={item.itemSlug}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveItem(item);
              buyPanelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
            className={`
              relative overflow-hidden group
              rounded-xl border transition-all duration-300
               flex flex-col justify-between min-h-[80px] p-2.5 cursor-pointer
              ${isSelected
                ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                : "border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/60"
              }
            `}
          >
            {/* Glossy Shimmer Effect on Hover */}
            {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer pointer-events-none" />}

            {/* Selection Indicator Glow */}
            {isSelected && (
              <motion.div
                layoutId="active-bgmi-glow-main"
                className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--accent)]/5 pointer-events-none"
              />
            )}

            {/* Background Watermark Logo */}
            <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.03] grayscale pointer-events-none group-hover:scale-110 transition-all duration-700">
               <Image src={item.itemImageId?.image || gameLogo} alt="" fill className="object-contain" />
            </div>

            {/* Header: Name & Discount */}
            <div className="relative z-10 flex flex-col gap-0.5">
              <div className="flex justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                   <div className="w-5 h-5 relative rounded-md overflow-hidden flex-shrink-0 border border-[var(--border)]">
                      <Image src={item.itemImageId?.image || gameLogo} alt="logo" fill className="object-cover" />
                   </div>
                   <p className={`font-bold text-[11px] tracking-tight leading-tight transition-colors duration-300 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                     {item.itemName}
                   </p>
                </div>
                {discount > 0 && (
                  <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0 leading-none h-4 flex items-center rounded-full uppercase tracking-tighter shadow-sm">
                    {discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6 bg-[var(--accent)]/30 rounded-full" />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-[var(--accent)] text-white p-0.5 rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                  >
                    <FiCheck size={10} strokeWidth={4} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer: Price */}
            <div className="relative z-10 mt-auto pt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-medium text-[var(--muted)]">₹</span>
                  <p className="text-base font-black text-[var(--foreground)] tracking-tight">
                    {item.sellingPrice}
                  </p>
                </div>
              </div>
            </div>

            {/* Corner Accent Decor (Tactical Look) */}
            <div className={`absolute top-0 right-0 w-8 h-8 opacity-40 transition-opacity duration-300 pointer-events-none border-t border-r border-[var(--accent)] group-hover:opacity-100 rounded-tr-lg`} />

            {/* Floating Particle Decor (Selected Only) - Simplified */}
            {isSelected && (
              <div className="absolute bottom-2 right-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-[var(--accent)]/60 rotate-45 border border-white/10"
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
