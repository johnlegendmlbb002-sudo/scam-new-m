"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Image from "next/image";

export default function ItemGrid({
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
              if (item.itemAvailablity === false) return;
              setActiveItem(item);
              buyPanelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
            className={`
              relative overflow-hidden group
              rounded-2xl border transition-all duration-300
               flex flex-col justify-between min-h-[85px] p-3 cursor-pointer
              ${isSelected
                ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                : "border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/40"
              }
              ${item.itemAvailablity === false ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {/* Background Watermark Logo */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] grayscale pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700">
               <Image src={item.itemImageId?.image || gameLogo} alt="" fill className="object-contain" />
            </div>

            {item.itemAvailablity === false && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                <span className="bg-red-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                  Out of Stock
                </span>
              </div>
            )}
            {/* Header: Name & Discount */}
            <div className="relative z-10 flex flex-col gap-1.5">
              <div className="flex justify-between items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 relative rounded-lg overflow-hidden flex-shrink-0 border border-[var(--border)] shadow-sm">
                    <Image
                      src={item.itemImageId?.image || gameLogo}
                      alt="logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className={`font-black italic uppercase text-[12px] tracking-tight leading-tight transition-colors duration-300 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                    {item.itemName}
                  </p>
                </div>
                {discount > 0 && (
                  <span className="text-[9px] font-black bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                    {discount}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`h-1 w-8 rounded-full transition-colors ${isSelected ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="bg-[var(--accent)] text-white p-1 rounded-full shadow-lg shadow-[var(--accent)]/40"
                  >
                    <FiCheck size={12} strokeWidth={4} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="relative z-10 flex items-baseline gap-1 mt-auto">
              <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-[var(--accent)]/50' : 'text-[var(--muted)]'}`}>₹</span>
              <p className={`text-xl font-black italic tracking-tighter ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                {item.sellingPrice}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
