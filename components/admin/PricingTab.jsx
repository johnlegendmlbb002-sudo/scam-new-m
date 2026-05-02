"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Percent,
  Coins,
  Search,
  Trash2,
  RefreshCcw,
  Gamepad2,
  Save,
  ChevronRight,
  Info,
  Package,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_BASE = "https://game-off-ten.vercel.app/api/v1";

export default function PricingTab({
  pricingType,
  setPricingType,
  slabs,
  setSlabs,
  overrides,
  setOverrides,
  gameOverrides,
  setGameOverrides,
  savingPricing,
  onSave,
}) {
  const [pricingMode, setPricingMode] = useState("percent");
  const [games, setGames] = useState([]);
  const [itemsByGame, setItemsByGame] = useState({});
  const [selectedGameSlug, setSelectedGameSlug] = useState("");
  const [gameSearch, setGameSearch] = useState("");
  const [loadingItems, setLoadingItems] = useState(false);

  // Fetch games on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/games/list`);
        const json = await res.json();
        if (json.success) {
          const fetchedGames = json.data.games;
          setGames(fetchedGames);
          if (fetchedGames.length > 0 && !selectedGameSlug) {
            setSelectedGameSlug(fetchedGames[0].gameSlug);
          }
        }
      } catch (e) {
        console.error("Game fetch failed", e);
      }
    })();
  }, []);

  // Fetch items when game selection changes
  useEffect(() => {
    if (pricingMode === "fixed" && selectedGameSlug) {
      fetchItemsForGame(selectedGameSlug);
    }
  }, [selectedGameSlug, pricingMode]);

  const fetchItemsForGame = async (gameSlug) => {
    if (!gameSlug) return;
    if (itemsByGame[gameSlug]) return;

    setLoadingItems(true);
    try {
      const res = await fetch(`${API_BASE}/games/${gameSlug}/items`);
      const json = await res.json();
      if (json.success) {
        setItemsByGame((p) => ({ ...p, [gameSlug]: json.data.items || [] }));
      }
    } catch (e) {
      console.error("Item fetch failed", e);
    } finally {
      setLoadingItems(false);
    }
  };

  const filteredGames = useMemo(() => {
    return games.filter((g) =>
      g.gameName.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [games, gameSearch]);

  const currentItems = useMemo(() => {
    return itemsByGame[selectedGameSlug] || [];
  }, [itemsByGame, selectedGameSlug]);

  // Helpers for State Updates
  const updateSlab = (i, key, value) => {
    const next = [...slabs];
    next[i][key] = Math.max(0, parseFloat(value) || 0);
    setSlabs(next);
  };

  const addSlab = () => setSlabs([...slabs, { min: 0, max: 0, percent: 0 }]);
  const deleteSlab = (i) => setSlabs(slabs.filter((_, idx) => idx !== i));

  const getOverride = (itemSlug) => {
    return overrides.find(
      (o) => o.gameSlug === selectedGameSlug && o.itemSlug === itemSlug
    );
  };

  const updateOverride = (itemSlug, itemName, updates) => {
    const existingIdx = overrides.findIndex(
      (o) => o.gameSlug === selectedGameSlug && o.itemSlug === itemSlug
    );

    let next = [...overrides];
    if (existingIdx > -1) {
      next[existingIdx] = { ...next[existingIdx], ...updates };
    } else {
      // Find original item to get base price
      const item = currentItems.find((i) => i.itemSlug === itemSlug);
      next.push({
        gameSlug: selectedGameSlug,
        itemSlug,
        itemName: itemName || itemSlug,
        fixedPrice: Number(item?.sellingPrice) || 0,
        useOverride: false,
        inStock: true,
        ...updates,
      });
    }
    setOverrides(next);
  };

  const getGameOverride = (slug) => {
    return gameOverrides.find((go) => go.gameSlug === slug);
  };

  const updateGameOverride = (slug, updates) => {
    const existingIdx = gameOverrides.findIndex((go) => go.gameSlug === slug);
    let next = [...gameOverrides];
    if (existingIdx > -1) {
      next[existingIdx] = { ...next[existingIdx], ...updates };
    } else {
      next.push({ gameSlug: slug, inStock: true, ...updates });
    }
    setGameOverrides(next);
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* ================= HEADER AREA ================= */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">
            PRICING <span className="text-[var(--accent)]">CONFIG</span>
          </h2>
          <p className="text-[10px] font-bold text-[var(--muted)]/60 uppercase tracking-[0.2em]">
            Manage profit margins and fixed item prices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* MODE SWITCH */}
          <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)]">
            <button
              onClick={() => setPricingMode("percent")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                pricingMode === "percent"
                  ? "bg-[var(--accent)] text-black"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Percent size={14} />
              Markup
            </button>
            <button
              onClick={() => setPricingMode("fixed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                pricingMode === "fixed"
                  ? "bg-[var(--accent)] text-black"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Coins size={14} />
              Fixed
            </button>
          </div>

          {/* ROLE SWITCH */}
          <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)]">
            {["user", "member", "admin"].map((type) => (
              <button
                key={type}
                onClick={() => setPricingType(type)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  pricingType === type
                    ? "bg-[var(--accent)] text-black"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={onSave}
            disabled={savingPricing}
            className="px-8 h-11 rounded-xl bg-[var(--accent)] text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent)]/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {savingPricing ? (
              <RefreshCcw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <AnimatePresence mode="wait">
        {pricingMode === "percent" ? (
          <motion.div
            key="percent-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Percent size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase text-[var(--foreground)]">
                    PROFIT <span className="text-[var(--accent)]">MARKUP</span>
                  </h3>
                  <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">
                    Set percentage profit based on price ranges
                  </p>
                </div>
              </div>
              <button
                onClick={addSlab}
                className="px-5 h-10 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all"
              >
                + Add Range
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-4 text-[9px] font-black text-[var(--muted)]/40 uppercase tracking-widest">
                <div className="col-span-4">Minimum Price (₹)</div>
                <div className="col-span-4">Maximum Price (₹)</div>
                <div className="col-span-3">Add Profit (%)</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-3">
                {slabs.map((slab, i) => (
                  <motion.div
                    key={i}
                    layout
                    className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/[0.02] hover:border-[var(--accent)]/30 transition-all"
                  >
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={slab.min}
                        onChange={(e) => updateSlab(i, "min", e.target.value)}
                        className="w-full h-14 px-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-bold text-lg outline-none focus:border-[var(--accent)]/50 transition-all"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={slab.max}
                        onChange={(e) => updateSlab(i, "max", e.target.value)}
                        className="w-full h-14 px-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-bold text-lg outline-none focus:border-[var(--accent)]/50 transition-all"
                      />
                    </div>
                    <div className="col-span-3 relative">
                      <input
                        type="number"
                        value={slab.percent}
                        onChange={(e) => updateSlab(i, "percent", e.target.value)}
                        className="w-full h-14 px-6 pr-12 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-[var(--accent)] font-black text-xl outline-none focus:border-[var(--accent)] transition-all"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--accent)] font-bold opacity-40">
                        %
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => deleteSlab(i)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fixed-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]"
          >
            {/* SIDEBAR: GAMES LIST */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              <div className="p-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Gamepad2 size={16} className="text-[var(--accent)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">
                    GAMES
                  </span>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]/40"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xs font-bold outline-none focus:border-[var(--accent)]/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {filteredGames.map((game) => {
                  const isActive = selectedGameSlug === game.gameSlug;
                  const gOverride = getGameOverride(game.gameSlug);
                  const isStocked = gOverride ? gOverride.inStock : true;

                  return (
                    <div
                      key={game.gameSlug}
                      onClick={() => setSelectedGameSlug(game.gameSlug)}
                      className={`group p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 shadow-lg shadow-[var(--accent)]/5"
                          : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--muted)]"
                      }`}
                    >
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-black uppercase tracking-tight truncate ${
                            isActive ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                          }`}
                        >
                          {game.gameName}
                        </p>
                        <p className="text-[9px] font-mono text-[var(--muted)]/40 uppercase truncate">
                          {game.gameSlug}
                        </p>
                      </div>

                      <div
                        className="flex flex-col items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            updateGameOverride(game.gameSlug, { inStock: !isStocked })
                          }
                          className={`w-10 h-6 rounded-full transition-all relative p-1 ${
                            isStocked ? "bg-emerald-500" : "bg-red-500/20"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                              isStocked ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[7px] font-black uppercase tracking-tighter ${
                            isStocked ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {isStocked ? "STOCK" : "OUT"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MAIN AREA: ITEMS GRID */}
            <div className="flex-1 flex flex-col gap-4">
              {loadingItems ? (
                <div className="flex-1 rounded-[3rem] border border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center opacity-40">
                  <Loader2 size={32} className="animate-spin text-[var(--accent)] mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">
                    Syncing Assets...
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max">
                  {currentItems.map((item) => {
                    const override = getOverride(item.itemSlug);
                    const useOverride = override?.useOverride || false;
                    const inStock = override?.inStock !== false;
                    const sellingPrice = override?.fixedPrice ?? Number(item.sellingPrice);

                    return (
                      <div
                        key={item.itemSlug}
                        className="p-5 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/20 transition-all flex flex-col gap-5 group"
                      >
                        {/* ITEM TOP */}
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-[var(--foreground)] truncate">
                              {item.itemName}
                            </h4>
                            <p className="text-[9px] font-mono text-[var(--muted)]/40 uppercase truncate">
                              {item.itemSlug}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* IN STOCK TOGGLE */}
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={() =>
                                  updateOverride(item.itemSlug, item.itemName, {
                                    inStock: !inStock,
                                  })
                                }
                                className={`w-8 h-4 rounded-full transition-all relative p-0.5 ${
                                  inStock ? "bg-emerald-500" : "bg-[var(--foreground)]/[0.1]"
                                }`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full bg-white transition-all ${
                                    inStock ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <span className="text-[7px] font-black text-[var(--muted)]/40 uppercase">
                                IN STOCK
                              </span>
                            </div>

                            {/* USE OVERRIDE TOGGLE */}
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={() =>
                                  updateOverride(item.itemSlug, item.itemName, {
                                    useOverride: !useOverride,
                                  })
                                }
                                className={`w-8 h-4 rounded-full transition-all relative p-0.5 ${
                                  useOverride ? "bg-[var(--accent)]" : "bg-[var(--foreground)]/[0.1]"
                                }`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full bg-white transition-all ${
                                    useOverride ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <span className="text-[7px] font-black text-[var(--muted)]/40 uppercase">
                                OVERRIDE
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* PRICE INPUT */}
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">
                            Selling Price (INR)
                          </label>
                          <div className="relative group/input">
                            <input
                              type="number"
                              disabled={!useOverride}
                              value={sellingPrice}
                              onChange={(e) =>
                                updateOverride(item.itemSlug, item.itemName, {
                                  fixedPrice: Number(e.target.value),
                                })
                              }
                              className={`w-full h-14 px-6 rounded-2xl bg-[var(--background)] border font-bold text-xl outline-none transition-all ${
                                useOverride
                                  ? "border-[var(--accent)]/40 text-[var(--foreground)] focus:border-[var(--accent)]"
                                  : "border-[var(--border)] text-[var(--muted)]/20 cursor-not-allowed opacity-50"
                              }`}
                            />
                            {!useOverride && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]/40 bg-[var(--background)]/80 px-4 py-1 rounded-full backdrop-blur-sm">
                                  % Markup Active
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!currentItems.length && !loadingItems && (
                    <div className="col-span-full h-full flex flex-col items-center justify-center opacity-40 border-2 border-dashed border-[var(--border)] rounded-[3rem]">
                      <Package size={48} className="mb-4 opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest">
                        Select a game to manage assets
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-rgb), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--accent-rgb), 0.3);
        }
      `}</style>
    </div>
  );
}
