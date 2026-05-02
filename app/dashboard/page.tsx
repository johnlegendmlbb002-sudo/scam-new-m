"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
import { motion } from "framer-motion";
import { 
  FiPackage, 
  FiCreditCard, 
  FiSettings, 
  FiHelpCircle, 
  FiArrowRight, 
  FiUser, 
  FiZap,
  FiShield
} from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        setUserDetails({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });

        setWalletBalance(data.user.wallet || 0);
      });
  }, [token]);

  const dashboardCards = [
    {
      key: "orders",
      label: "Orders",
      icon: <FiPackage />,
      route: "/dashboard/order",
      description: "Manage your purchases"
    },
    {
      key: "wallet",
      label: "Wallet",
      icon: <FiCreditCard />,
      route: "/dashboard/wallet",
      description: "Recharge & History"
    },
    {
      key: "account",
      label: "Account",
      icon: <FiSettings />,
      route: "/dashboard/account",
      description: "Profile settings"
    },
    {
      key: "query",
      label: "Support",
      icon: <FiHelpCircle />,
      route: "/dashboard/query",
      description: "Get instant help"
    },
  ];

  return (
    <AuthGuard>
      <section className="min-h-screen px-4 py-8 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PREMIUM HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
             <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[9px] font-black uppercase tracking-widest">
                   <FiZap size={10} className="animate-pulse" />
                   Active Session
                </div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-none">
                   Welcome, <span className="text-[var(--accent)]">{userDetails.name || "Player"}</span>
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em] opacity-60">
                   Control Center • {userDetails.email}
                </p>
             </div>

             {/* WALLET WIDGET */}
             <motion.div 
               whileHover={{ y: -2 }}
               onClick={() => router.push("/dashboard/wallet")}
               className="relative overflow-hidden cursor-pointer bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--border)] p-4 rounded-3xl min-w-[200px] group shadow-2xl"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)]/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-[var(--accent)]/20 transition-colors" />
                
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-black shadow-lg shadow-[var(--accent)]/20">
                      <FiCreditCard size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted)]">Balance</p>
                      <p className="text-2xl font-black italic text-[var(--foreground)] tracking-tighter">₹{walletBalance.toFixed(2)}</p>
                   </div>
                   <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiArrowRight size={14} className="text-[var(--accent)]" />
                   </div>
                </div>
             </motion.div>
          </div>

          {/* QUICK LINKS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {dashboardCards.map((card, idx) => (
               <motion.div
                 key={card.key}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 onClick={() => router.push(card.route)}
                 className="relative overflow-hidden group cursor-pointer bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-[2rem] p-6 hover:border-[var(--accent)]/50 transition-all duration-500 shadow-xl"
               >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-2xl text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all duration-500 shadow-inner">
                        {card.icon}
                     </div>
                     
                     <div className="flex-1">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-none mb-1">
                           {card.label}
                        </h3>
                        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-60">
                           {card.description}
                        </p>
                     </div>

                     <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all">
                        <FiArrowRight size={14} />
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>

          {/* RECENT ACTIVITY PLACEHOLDER OR FOOTER INFO */}
          <div className="bg-[var(--card)]/20 rounded-3xl border border-[var(--border)] p-6 text-center">
             <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-50">
                <FiShield size={12} />
                Secure Dashboard Environment
             </div>
          </div>

        </div>
      </section>
    </AuthGuard>
  );
}
