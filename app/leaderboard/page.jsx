"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiUser,
  FiShoppingBag,
  FiAward,
  FiActivity,
  FiZap,
  FiShield,
  FiStar
} from "react-icons/fi";
import { FaTrophy, FaCrown } from "react-icons/fa";
import AuthGuard from "@/components/AuthGuard";

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("thisMonth"); // thisMonth | prevMonth

  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    fetch(`/api/leaderboard?limit=${limit}&range=${range}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.success ? res.data : []);
      })
      .finally(() => setLoading(false));
  }, [range]);

  const getRankStyle = (rank) => {
    if (rank === 1) return { color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10", border: "border-[var(--accent)]/50", icon: FaCrown };
    if (rank === 2) return { color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/50", icon: FiAward };
    if (rank === 3) return { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/50", icon: FiAward };
    return { color: "text-[var(--muted)]", bg: "bg-[var(--card)]/50", border: "border-[var(--border)]", icon: FiUser };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const podiumData = data.slice(0, 3);
  const remainingData = data.slice(3);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--background)] py-10 px-4 relative overflow-hidden">
        {/* AMBIENT BACKGROUND */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">

          {/* SIMPLE HEADER */}
          <div className="text-center space-y-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 shadow-xl"
             >
                <FiStar className="text-[var(--accent)] animate-pulse" size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Top Rankings</span>
             </motion.div>
             
             <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-none">
                Top <span className="text-[var(--accent)]">Spenders</span>
             </h1>
             
             <div className="flex flex-col items-center gap-4">
                <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] opacity-60">
                   {range === 'thisMonth' ? 'This Month' : 'Last Month'} Rankings
                </p>
                
                {/* RANGE TOGGLE */}
                <div className="inline-flex p-1 bg-[var(--card)]/30 backdrop-blur-xl border border-[var(--border)] rounded-2xl">
                  {[{ id: "thisMonth", label: "This Month" }, { id: "prevMonth", label: "Prev Month" }].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRange(r.id)}
                      className={`relative px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${range === r.id ? "text-black" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
                    >
                      <span className="relative z-10">{r.label}</span>
                      {range === r.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-[var(--accent)] rounded-xl shadow-lg shadow-[var(--accent)]/20"
                        />
                      )}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {loading ? (
            <div className="space-y-4 max-w-2xl mx-auto py-20">
               <div className="flex justify-center">
                  <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
               </div>
            </div>
          ) : data.length === 0 ? (
            <div className="py-20 text-center bg-[var(--card)]/20 border border-dashed border-[var(--border)] rounded-[2rem] backdrop-blur-sm">
               <FiActivity size={40} className="mx-auto mb-4 text-[var(--muted)] opacity-20" />
               <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">No data detected in current range</p>
            </div>
          ) : (
            <div className="space-y-10">

              {/* PODIUM SECTION */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end">
                {/* 2nd Place */}
                <div className="order-1">
                  {podiumData[1] && <PodiumCard user={podiumData[1]} rank={2} style={getRankStyle(2)} />}
                </div>

                {/* 1st Place */}
                <div className="order-2 transform -translate-y-2 md:-translate-y-4">
                  {podiumData[0] && <PodiumCard user={podiumData[0]} rank={1} style={getRankStyle(1)} isMain={true} />}
                </div>

                {/* 3rd Place */}
                <div className="order-3">
                  {podiumData[2] && <PodiumCard user={podiumData[2]} rank={3} style={getRankStyle(3)} />}
                </div>
              </div>

              {/* LIST SECTION */}
              {remainingData.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="max-w-2xl mx-auto space-y-2"
                >
                  <div className="flex items-center justify-between px-6 py-2">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-40">Rankings</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-40">Total Spent</span>
                  </div>

                  {remainingData.map((item, index) => {
                    const rank = index + 4;
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="group flex items-center justify-between p-3 bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-2xl hover:border-[var(--accent)]/50 transition-all duration-500 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-[10px] font-black italic text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                             #{rank}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[13px] font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-none mb-1">
                                {item.user?.name || "Anonymous User"}
                             </span>
                             <span className="text-[7px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-40">Verified User</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                           <span className="text-sm font-black italic tracking-tighter text-[var(--accent)] leading-none">
                              ₹{item.totalSpent}
                           </span>
                           <span className="text-[6px] font-black text-[var(--muted)] uppercase tracking-widest opacity-30">Amount spent</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

function PodiumCard({ user, rank, style, isMain = false }) {
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative group p-3 sm:p-4 rounded-3xl border ${style.border} ${style.bg} backdrop-blur-2xl transition-all duration-700 flex flex-col items-center text-center shadow-2xl ${isMain ? 'ring-1 ring-[var(--accent)]/20' : ''}`}
    >
      {/* GLOW EFFECT */}
      {isMain && (
         <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      )}

      {/* RANK ICON */}
      <div className={`relative z-10 mb-2 w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-black/40 border ${style.border} flex items-center justify-center ${style.color} group-hover:scale-110 transition-transform duration-700 shadow-inner`}>
         <Icon size={isMain ? 32 : 24} className="drop-shadow-lg" />
         <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-black border border-inherit flex items-center justify-center text-[9px] sm:text-xs font-black italic text-white shadow-xl">
            #{rank}
         </div>
      </div>

      {/* USER DATA */}
      <div className="relative z-10 space-y-0.5 w-full overflow-hidden">
         <h3 className={`font-black italic uppercase tracking-tighter text-[var(--foreground)] truncate ${isMain ? 'text-base sm:text-xl' : 'text-[11px] sm:text-base'}`}>
            {user.user?.name || "Player"}
         </h3>
         <p className="text-[7px] sm:text-[8px] font-black text-[var(--muted)] uppercase tracking-[0.2em] opacity-60">
            Top Spender
         </p>
      </div>

      <div className="relative z-10 w-full mt-2 pt-2 border-t border-white/5 flex flex-col gap-1">
         <span className="text-[7px] sm:text-[8px] font-black text-[var(--muted)] uppercase tracking-widest opacity-40">Spent</span>
         <span className={`text-base sm:text-xl font-black italic tracking-tighter ${style.color}`}>₹{user.totalSpent}</span>
      </div>
      
      {/* CORNER ACCENTS */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/5 group-hover:border-[var(--accent)]/40 transition-colors" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/5 group-hover:border-[var(--accent)]/40 transition-colors" />
    </motion.div>
  );
}

