"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiGrid,
    FiShoppingBag,
    FiMessageSquare,
    FiAward,
    FiGlobe,
    FiLifeBuoy
} from "react-icons/fi";
import { useState, useEffect } from "react";

const navItems = [
    { name: "Region", href: "/region", icon: FiGlobe },
    { name: "Games", href: "/games", icon: FiGrid },
    { name: "Rank", href: "/leaderboard", icon: FiAward },
    { name: "Home", href: "/", icon: FiHome, isCenter: true },
    { name: "Orders", href: "/dashboard/order", icon: FiShoppingBag },
    { name: "Help", href: "/dashboard/query", icon: FiLifeBuoy },
    { name: "Chat", href: "#chat", icon: FiMessageSquare, isAction: true },
];

export default function BottomNav() {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const handleStateChange = (e: any) => {
            setIsChatOpen(e.detail.isOpen);
        };
        window.addEventListener('chatbot-state-change', handleStateChange);
        return () => window.removeEventListener('chatbot-state-change', handleStateChange);
    }, []);

    const handleAction = (e: React.MouseEvent, item: any) => {
        if (item.isAction && item.href === "#chat") {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('toggle-chatbot'));
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
            {/* Ultra Slim High-Density Bar */}
            <div className="relative w-full bg-[var(--background)]/80 backdrop-blur-2xl border-t border-[var(--border)]/40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">

                {/* Tactical Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

                <nav className="flex items-center justify-between h-12 relative px-1">
                    {navItems.map((item) => {
                        const isChat = item.isAction && item.href === "#chat";
                        const isActive = isChat ? isChatOpen : (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
                        const Icon = item.icon;

                        if (item.isCenter) {
                            return (
                                <div key={item.name} className="relative flex-1 flex justify-center -translate-y-4">
                                    <Link href={item.href} className="group outline-none">
                                        <motion.div
                                            whileTap={{ scale: 0.9 }}
                                            className="relative"
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="center-glow"
                                                    className="absolute inset-[-10px] bg-[var(--accent)]/20 rounded-full blur-xl"
                                                />
                                            )}

                                            <div className={`
                                                w-12 h-12 rounded-[1rem] flex items-center justify-center relative z-10 transition-all duration-500 transform rotate-45
                                                ${isActive
                                                    ? "bg-[var(--accent)] shadow-[0_8px_20px_rgba(var(--accent-rgb),0.4)]"
                                                    : "bg-[var(--card)] border border-[var(--border)] shadow-lg"
                                                }
                                            `}>
                                                <div className="-rotate-45">
                                                    <Icon className={`text-xl transition-all duration-300 ${isActive ? "text-black" : "text-[var(--foreground)]/40"}`} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <div key={item.name} className="flex-1 flex flex-col items-center justify-center">
                                {item.isAction ? (
                                    <button
                                        onClick={(e) => handleAction(e, item)}
                                        className="flex flex-col items-center group outline-none"
                                    >
                                        <NavItemContent isActive={isActive} Icon={Icon} name={item.name} />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex flex-col items-center group outline-none"
                                    >
                                        <NavItemContent isActive={isActive} Icon={Icon} name={item.name} />
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

function NavItemContent({ isActive, Icon, name }: { isActive: boolean; Icon: any; name: string }) {
    return (
        <div className="flex flex-col items-center relative py-0.5">
            <motion.div
                animate={isActive ? { y: -2 } : { y: 0 }}
                className="relative flex items-center justify-center h-6"
            >
                <Icon
                    className={`text-xl transition-all duration-300 ${isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                        }`}
                />

                {isActive && (
                    <motion.div
                        layoutId="nav-dot"
                        className="absolute -top-1 right-[-4px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                    />
                )}
            </motion.div>

            <span
                className={`text-[7px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive
                    ? "text-[var(--foreground)] opacity-100"
                    : "text-[var(--muted)] opacity-50"
                    }`}
            >
                {name}
            </span>
        </div>
    );
}
