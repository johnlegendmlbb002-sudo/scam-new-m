"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

export default function ItemGrid({
  items,
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
              rounded-2xl border transition-all duration-300
              flex flex-col justify-between min-h-[100px] p-4 cursor-pointer
              ${isSelected
                ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                : "border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/40"
              }
            `}
          >
            {/* Header: Name & Discount */}
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <p className={`font-black italic uppercase text-[12px] tracking-tight leading-tight transition-colors duration-300 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                  {item.itemName}
                </p>
                {discount > 0 && (
                  <span className="text-[9px] font-black bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
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
              <p className={`text-2xl font-black italic tracking-tighter ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                {item.sellingPrice}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
