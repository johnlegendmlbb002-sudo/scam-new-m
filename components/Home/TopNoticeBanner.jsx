"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageCircle, Crown, Flame } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "hide_notice_banner";
const ROTATE_INTERVAL = 6000;

/* ================= ENV ================= */
const SUPPORT_WHATSAPP_URL = "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129";

/* ================= BANNERS ================= */
const BANNERS = [
  {
    id: "channel",
    title: "WHATSAPP CHANNEL",
    subtitle: "Get daily deals and giveaway updates.",
    cta: "JOIN NOW",
    link: SUPPORT_WHATSAPP_URL,
    icon: MessageCircle,
    glow: "rgba(16, 185, 129, 0.08)",
  },

];

export default function TopNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    if (!hidden) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const banner = BANNERS[index];
  const Icon = banner.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="relative z-[40] bg-[var(--card)] border-b border-[var(--border)] shadow-sm overflow-hidden"
        >
          {/* ⚡ Tactical Accent Line */}
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

          <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between gap-6">
            
            {/* 🏷️ Status Tag */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Live Now</span>
            </div>

            {/* 📣 Rotating Message */}
            <Link 
              href={banner.link} 
              className="flex-1 flex items-center justify-center gap-3 group transition-all"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-center"
                >
                  <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                    <Icon size={12} strokeWidth={2.5} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--foreground)] italic">
                      {banner.title}:
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors uppercase tracking-[0.05em]">
                      {banner.subtitle}
                    </span>
                  </div>
                  <ArrowRight size={10} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.div>
              </AnimatePresence>
            </Link>

            {/* ✖️ Close Action */}
            <button
              onClick={() => {
                setVisible(false);
                localStorage.setItem(STORAGE_KEY, "true");
              }}
              className="w-7 h-7 rounded-lg bg-[var(--foreground)]/[0.03] hover:bg-[var(--foreground)]/[0.08] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-all border border-[var(--border)]"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
