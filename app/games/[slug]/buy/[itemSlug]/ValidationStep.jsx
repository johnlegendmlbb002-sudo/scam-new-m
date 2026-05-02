import HelpImagePopup from "../../../../../components/HelpImage/HelpImagePopup";
import RecentVerifiedPlayers from "../../../../region/RecentVerifiedPlayers";
import { FiUser, FiLayers, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ValidationStep({
  playerId,
  setPlayerId,
  zoneId,
  setZoneId,
  onValidate,
  loading,
  showZoneId = true,
  label = "Player Check",
  placeholder = "Enter Player ID",
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-4 bg-[var(--accent)] rounded-full" />
           <h2 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">{label}</h2>
        </div>
        <HelpImagePopup />
      </div>

      <div className="space-y-4">
        {/* PLAYER ID INPUT */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors">
            <FiUser size={18} />
          </div>
          <input
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] focus:border-[var(--accent)]/50 focus:bg-[var(--card)]/60 transition-all outline-none font-bold text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:opacity-60"
            disabled={loading}
          />
        </div>

        {/* ZONE ID INPUT */}
        {showZoneId && (
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors">
              <FiLayers size={18} />
            </div>
            <input
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="Enter Zone ID"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] focus:border-[var(--accent)]/50 focus:bg-[var(--card)]/60 transition-all outline-none font-bold text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:opacity-60"
              disabled={loading}
            />
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onValidate}
        disabled={loading}
        className={`py-4 rounded-2xl w-full font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-lg
          ${
            loading
              ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
              : "bg-[var(--accent)] text-black"
          }`}
      >
        <span>{loading ? "Validating..." : "Continue"}</span>
        {!loading && <FiArrowRight size={14} />}
      </motion.button>

      <RecentVerifiedPlayers
        limit={10}
        onSelect={(player) => {
          setPlayerId(player.playerId);
          if (showZoneId) setZoneId(player.zoneId);
        }}
      />
    </div>
  );
}
