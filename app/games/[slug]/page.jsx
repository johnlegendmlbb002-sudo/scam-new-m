"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import logo from "@/public/logo.png";

const Loader = dynamic(() => import("@/components/Loader/Loader"), { ssr: false });
const MLBBPurchaseGuide = dynamic(() => import("../../../components/HelpImage/MLBBPurchaseGuide"), { ssr: false });
const ItemGrid = dynamic(() => import("@/components/GameDetail/ItemGrid"), { ssr: false });
const BuyPanel = dynamic(() => import("@/components/GameDetail/BuyPanel"), { ssr: false });

export default function GameDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const buyPanelRef = useRef(null);

  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  /* ================= FETCH ALL GAMES ================= */
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        setAllGames(data?.data?.games || []);
      });
  }, []);

  /* ================= FETCH GAME ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`/api/games/${slug}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = [...(data?.data?.itemId || [])].sort(
          (a, b) => a.sellingPrice - b.sellingPrice
        );

        setGame({
          ...data.data,
          allItems: items,
        });

        setActiveItem(items[0] || null);
      });
  }, [slug]);

  /* ================= LOADING ================= */
  if (!game || !activeItem) {
    return <Loader />;
  }

  const isBGMI =
    game?.gameName?.toLowerCase() === "pubg mobile" || game?.gameName?.toLowerCase() === "bgmi";

  /* ================= BUY HANDLER ================= */
  const goBuy = (item) => {
    if (redirecting) return;
    setRedirecting(true);

    const query = new URLSearchParams({
      name: item.itemName,
      price: item.sellingPrice?.toString() || "",
      dummy: item.dummyPrice?.toString() || "",
      image: item.itemImageId?.image || "",
    });

    // Always use generic path
    const basePath = `/games/${slug}/buy`;

    router.push(
      `${basePath}/${item.itemSlug}?${query.toString()}`
    );
  };

  return (
    <section className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 🎮 SELECT GAME - COMPACT & VERTICAL LABELS */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-3 bg-[var(--accent)] rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Game Switch</h2>
           </div>
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
             {allGames.map((g) => {
               const isActive = g.gameSlug === slug;
               return (
                 <button
                   key={g.gameSlug}
                   onClick={() => router.push(`/games/${g.gameSlug}`)}
                   className={`
                     flex items-center gap-2 flex-shrink-0 px-3 py-1.5 rounded-xl border transition-all duration-300 group
                     ${isActive ? "bg-[var(--accent)]/10 border-[var(--accent)] shadow-sm" : "bg-[var(--card)]/50 border-[var(--border)] opacity-60 hover:opacity-100"}
                   `}
                 >
                   <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                     <Image
                       src={g.gameImageId?.image || logo}
                       alt={g.gameName}
                       fill
                       className="object-cover"
                     />
                   </div>
                   <span className={`
                      text-[8px] font-black uppercase tracking-widest whitespace-nowrap
                      ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}
                   `}>
                      {g.gameName === "PUBG Mobile" ? "BGMI" : g.gameName}
                   </span>
                 </button>
               );
             })}
           </div>
        </div>

        {/* 🏆 GAME HEADING - ULTRA COMPACT */}
        <div className="flex items-center gap-4 py-2 px-1">
           <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-xl overflow-hidden shadow-lg border border-[var(--border)] flex-shrink-0">
             <Image
               src={game?.gameImageId?.image || logo}
               alt={game?.gameName || "Game"}
               fill
               priority
               className="object-cover"
             />
           </div>

           <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-none mb-1">
                {isBGMI ? "BGMI" : game?.gameName}
              </h1>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-60">
                    {game?.gameFrom}
                 </span>
                 <div className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-30" />
                 <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">
                    Verified
                 </span>
              </div>
           </div>
        </div>

        {/* 📦 CONTENT GRID */}
        <div className="space-y-8">
           <ItemGrid
             items={game.allItems}
             activeItem={activeItem}
             setActiveItem={setActiveItem}
             buyPanelRef={buyPanelRef}
           />

           <BuyPanel
             activeItem={activeItem}
             onBuy={goBuy}
             redirecting={redirecting}
             buyPanelRef={buyPanelRef}
           />
        </div>

      </div>
    </section>
  );
}

