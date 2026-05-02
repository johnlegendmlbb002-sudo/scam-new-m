"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiCode, FiArrowRight, FiActivity } from "react-icons/fi";

export default function HomeServices() {
  const whatsappLink = process.env.NEXT_PUBLIC_MADE_BY_URL || "https://wa.me/919178521537";

  return (
    <section className="py-6 px-4 bg-[var(--background)]">
      <div className="max-w-3xl mx-auto relative group">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)]/20 via-transparent to-[var(--accent)]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden text-left">
          {/* Tactical Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)', backgroundSize: '12px 12px' }} />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 w-full">


            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded-[4px] bg-[var(--accent)]/10 text-[var(--accent)] text-[8px] font-black uppercase tracking-widest border border-[var(--accent)]/10">
                  Services
                </span>
                <span className="flex items-center gap-1 text-[8px] font-bold text-muted uppercase tracking-widest opacity-60">
                  <FiActivity className="text-[10px]" /> Online
                </span>
              </div>

              <h2 className="text-xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                Web & App <span className="text-[var(--accent)]">Service</span>
              </h2>

              <p className="text-[11px] font-bold text-muted/80 uppercase tracking-wide max-w-[320px] leading-relaxed">
                We build websites, custom software, and API solutions for you.
              </p>

              <div className="pt-2">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.15em] shadow-xl hover:bg-[var(--accent)] hover:text-white transition-all duration-300 group/btn"
                >
                  <FaWhatsapp size={16} />
                  <span>Contact Us</span>
                  <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
