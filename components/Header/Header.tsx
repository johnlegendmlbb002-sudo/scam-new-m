"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiChevronDown, FiUser, FiLayout, FiSettings, FiLifeBuoy, FiLogOut, FiBarChart2, FiHome, FiGrid, FiLayers, FiGlobe, FiX } from "react-icons/fi";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Dynamic header styles based on scroll
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 0.9]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 16]);
  const headerBorder = useTransform(scrollY, [0, 50], ["rgba(0,0,0,0)", "var(--border)"]);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
        else localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    if (userMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [userMenuOpen]);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && userMenuOpen) {
        // We handle closure via backdrop or button, but keeping it for safety
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  /* ================= ANIMATION VARIANTS ================= */
  const headerVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={`fixed top-0 left-0 w-full ${userMenuOpen ? 'z-[1000]' : 'z-[80]'} transition-colors duration-500`}
      style={{
        backgroundColor: scrolled ? "var(--card)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      {/* Tactical Glow Line (only when scrolled) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent z-10"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 h-11 relative">

        {/* LOGO SECTION */}
        <div className="flex items-center">
          <Link href="/" className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10"
            >
              <Image
                src={logo}
                alt="Logo"
                width={58}
                height={16}
                priority
                className="object-contain ml-1"
              />
            </motion.div>
            <div className="absolute -inset-2 bg-[var(--accent)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          </Link>
        </div>

        {/* DESKTOP NAV - CENTERED */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {[
            { name: "Games", href: "/games", icon: FiGrid },
            { name: "Regions", href: "/regions", icon: FiGlobe }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
            >
              <item.icon className="text-lg opacity-70 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all" />
              <span>{item.name}</span>
              <motion.span
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--accent)] rounded-full origin-left opacity-0 group-hover:opacity-100"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </Link>
          ))}
        </nav>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>


          <ThemeToggle />

          <div className="h-6 w-[1px] bg-[var(--border)] mx-1 hidden sm:block" />

          {/* USER PROFILE / LOGIN */}
          <div className="relative">
            <motion.button
              onClick={() => {
                if (!loading) {
                  setUserMenuOpen(!userMenuOpen);
                }
              }}
              className={`
                flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 mr-2
                ${userMenuOpen ? 'bg-[var(--accent)] ring-2 ring-[var(--accent)]/50' : 'hover:bg-[var(--card)]/50 border border-transparent hover:border-[var(--border)]'}
              `}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-full h-full rounded-full bg-[var(--accent)] flex items-center justify-center overflow-hidden shadow-sm">
                {!loading && user?.avatar && !avatarError ? (
                  <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-white text-[10px] font-black uppercase">
                    {(user?.name || user?.username || user?.email || "U")[0]}
                  </span>
                )}
              </div>
            </motion.button>

            {/* USER SLIDER (SIDEBAR) */}
            <AnimatePresence>
              {userMenuOpen && (
                <>
                  {/* Backdrop Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setUserMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                  />

                  {/* Sidebar Slider */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 35, stiffness: 400 }}
                    className="fixed right-0 top-0 h-[100dvh] w-[75%] sm:w-[320px] bg-[var(--background)] border-l border-[var(--border)] shadow-2xl z-[1001] flex flex-col overflow-hidden"
                  >
                    {/* 🔝 TOP HEADER */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border)] relative z-10 bg-[var(--background)]">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-[var(--accent)] rounded-full" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Menu</h2>
                      </div>
                      <button
                        onClick={() => setUserMenuOpen(false)}
                        className="w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:text-[var(--accent)] transition-all"
                      >
                        <FiX size={16} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar relative z-10">
                      {!user ? (
                        <div className="flex flex-col items-center justify-center text-center h-full">
                          <div className="w-16 h-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
                            <FiUser className="text-3xl text-[var(--accent)]" />
                          </div>
                          <h3 className="text-xl font-black italic uppercase text-[var(--foreground)] mb-1">
                            Hi, <span className="text-[var(--accent)]">Guest</span>
                          </h3>
                          <p className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest mb-6">
                            Login to manage your wallet.
                          </p>
                          <Link href="/login" onClick={() => setUserMenuOpen(false)} className="w-full">
                            <button className="w-full py-3 bg-[var(--accent)] text-black font-black uppercase tracking-widest text-[10px] rounded-xl">
                              Login
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* 👤 USER PROFILE */}
                          <div className="flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] p-3 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--background)] border border-[var(--border)]">
                              {user?.avatar && !avatarError ? (
                                <Image
                                  src={user.avatar}
                                  alt="Avatar"
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                  onError={() => setAvatarError(true)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--accent)]">
                                  <span className="text-white text-sm font-black">
                                    {(user.name || user.username || "U")[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-black italic uppercase text-[var(--foreground)] truncate">
                                {user.name || user.username}
                              </span>
                            </div>
                            <button
                              onClick={handleLogout}
                              className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"
                            >
                              <FiLogOut size={14} />
                            </button>
                          </div>

                          {/* 💳 WALLET */}
                          <div className="bg-[var(--accent)] p-4 rounded-2xl">
                            <p className="text-[8px] font-black uppercase tracking-widest text-black/50 mb-0.5">Balance</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-black italic text-black">₹{user.wallet?.toFixed(1) || "0.0"}</span>
                              <Link href="/dashboard/wallet" onClick={() => setUserMenuOpen(false)}>
                                <button className="px-3 py-1.5 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                                  Top Up
                                </button>
                              </Link>
                            </div>
                          </div>

                          {/* 🧭 LINKS */}
                          <div className="space-y-1.5">
                            <h4 className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50 px-1 mb-2">Links</h4>
                            {[
                              { label: "Dashboard", icon: FiLayout, href: "/dashboard" },
                              { label: "Orders", icon: FiSettings, href: "/dashboard/order" },
                              { label: "Support", icon: FiLifeBuoy, href: "/dashboard/query" },
                              { label: "Leaderboard", icon: FiBarChart2, href: "/leaderboard" },
                            ].map((link) => (
                              <Link key={link.label} href={link.href} onClick={() => setUserMenuOpen(false)}>
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--card)]/50 border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                                  <link.icon className="text-base text-[var(--muted)] group-hover:text-[var(--accent)]" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-[var(--foreground)]">{link.label}</span>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {user.userType === "owner" && (
                            <Link href="/owner-panal" onClick={() => setUserMenuOpen(false)}>
                              <div className="p-3 rounded-xl bg-black border border-white/5 flex items-center justify-between hover:border-[var(--accent)] transition-all">
                                <div className="flex items-center gap-2">
                                  <FiSettings size={12} className="text-[var(--accent)]" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Admin Panel</span>
                                </div>
                              </div>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 🏁 FOOTER */}
                    <div className="p-4 border-t border-[var(--border)] text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] opacity-40">Scammer Store © 2026</p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
