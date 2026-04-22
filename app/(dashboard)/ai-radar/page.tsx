"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TagPill } from "@/components/ui/TagPill";

import {
  History,
  Bell,
  BellRing,
  ChevronDown,
  ChevronUp,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RADAR_ITEMS } from "@/lib/mock-data";
import type { RadarAnomaly, RadarAction } from "@/lib/types";
import { useRouter } from "next/navigation";

// ─── Action config ────────────────────────────────────────────────────────────
const ACTION_CONFIG: Record<
  RadarAction | "closed",
  { label: string; color: string; bg: string; border: string; strip: string }
> = {
  buy: {
    label: "BUY",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/25",
    strip: "bg-green-500",
  },
  watch: {
    label: "WATCH",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    strip: "bg-slate-400",
  },
  avoid: {
    label: "AVOID",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    strip: "bg-red-500",
  },
  closed: {
    label: "CLOSED",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    border: "border-gray-400/20",
    strip: "bg-gray-400",
  },
};

// ─── Tag pill ─────────────────────────────────────────────────────────────────

// ─── Stock logo ───────────────────────────────────────────────────────────────
function RadarLogo({
  ticker,
  logoUrl,
  actionColor,
}: {
  ticker: string;
  logoUrl: string;
  actionColor: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={ticker}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center rounded-full border",
            ACTION_CONFIG["buy"].bg, // fallback
          )}
          style={{ borderColor: actionColor + "40" }}
        >
          <span className="font-outfit font-bold text-[12px]" style={{ color: actionColor }}>
            {ticker[0]}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Detail item (Time / Entry / Max Return row) ───────────────────────────────
function DetailItem({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-inter text-[8.5px] text-text-secondary-light dark:text-text-secondary-dark font-medium">
        {label}
      </span>
      <span
        className={cn(
          "font-inter font-bold text-[10.5px] mt-0.5",
          valueColor ?? "text-text-primary-light dark:text-text-primary-dark"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Expandable Radar Card ────────────────────────────────────────────────────
function RadarCard({
  anomaly,
  bellActive,
  onBellToggle,
  onAskAI,
  router,
}: {
  anomaly: RadarAnomaly;
  bellActive: boolean;
  onBellToggle: () => void;
  onAskAI: () => void;
  router: any;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfgKey = anomaly.isClosed ? "closed" : anomaly.action;
  const cfg = ACTION_CONFIG[cfgKey];

  const returnColor =
    anomaly.maxReturn > 0
      ? "text-green-500"
      : anomaly.maxReturn < 0
      ? "text-red-500"
      : "text-text-primary-light dark:text-text-primary-dark";

  const returnStr = `${anomaly.maxReturn > 0 ? "+" : ""}${anomaly.maxReturn}%`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative rounded-card overflow-hidden cursor-pointer",
        "border border-border-light dark:border-[#38383A]",
        "bg-card-light dark:bg-card-dark",
        anomaly.isClosed && "opacity-75"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Left action strip */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.strip)} />

      {/* Card content */}
      <div className="pl-5 pr-3 py-3.5">
        {/* Header row */}
        <div className="flex items-center gap-2.5">
          <RadarLogo
            ticker={anomaly.ticker}
            logoUrl={anomaly.logoUrl}
            actionColor={cfg.color.replace("text-", "")}
          />

          {/* Ticker / Name */}
          <div className="flex-1 min-w-0">
            <p className="font-outfit font-bold text-[12px] text-text-primary-light dark:text-text-primary-dark tracking-tight truncate">
              {anomaly.ticker}
            </p>
            <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate">
              {anomaly.name}
            </p>
          </div>

          {/* Action badge */}
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-inter font-bold border",
              cfg.color, cfg.bg, cfg.border
            )}
          >
            {cfg.label}
          </span>

          {/* Bell (active signals only) */}
          {!anomaly.isClosed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBellToggle();
              }}
              className="p-2 -mr-1"
            >
              {bellActive ? (
                <BellRing size={16} className="text-yellow-400" />
              ) : (
                <Bell
                  size={16}
                  className="text-text-secondary-light/45 dark:text-text-secondary-dark/45"
                />
              )}
            </button>
          )}

          {/* Expand chevron */}
          <div className="text-text-secondary-light dark:text-text-secondary-dark">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-2.5">
          <DetailItem
            label={anomaly.isClosed ? "Time Closed" : "Time"}
            value={anomaly.timeAgo.replace("Closed", "").trim()}
          />
          <DetailItem label="Entry" value={`$${anomaly.entryPrice.toFixed(2)}`} />
          <DetailItem
            label="Max Return"
            value={returnStr}
            valueColor={returnColor}
          />
        </div>

        {/* Expandable section */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {anomaly.tags.map((tag) => (
                    <TagPill key={tag} label={tag} />
                  ))}
                </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/stock/${anomaly.ticker.toLowerCase()}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[10px]
                               bg-card-light dark:bg-white/5
                               border border-border-light dark:border-white/10
                               text-text-primary-light dark:text-text-primary-dark
                               transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
                  >
                    <span className="font-inter font-bold text-[10.5px]">
                      View Trading Details
                    </span>
                  </motion.button>

                  {/* Ask AI button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAI();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[10px]
                               bg-primary/7 dark:bg-white/7
                               border border-primary/20 dark:border-white/20
                               text-primary dark:text-white
                               transition-colors hover:bg-primary/12 dark:hover:bg-white/12"
                  >
                    <Sparkles size={13} />
                    <span className="font-inter font-bold text-[10.5px]">
                      Ask Raven AI
                    </span>
                  </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Filter chip ─────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onTap,
}: {
  label: string;
  active: boolean;
  onTap: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className={cn(
        "raven-chip",
        active ? "raven-chip-active" : "raven-chip-inactive"
      )}
    >
      {label}
    </motion.button>
  );
}

// ─── Time filter bottom sheet ─────────────────────────────────────────────────
function TimeFilterSheet({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const options = [
    { label: "Last 24 Hours", value: "24h" },
    { label: "Last 3 Days", value: "3 Days" },
    { label: "Last 7 Days", value: "7 Days" },
    { label: "All Time", value: "All Time" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-card-light dark:bg-card-dark
                   rounded-t-[20px] pb-8 pt-3"
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <p className="font-outfit font-bold text-[14px] text-center text-text-primary-light dark:text-text-primary-dark mb-2">
          Filter by Time
        </p>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onSelect(opt.value); onClose(); }}
            className="w-full flex items-center justify-between px-5 py-3
                       hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span
              className={cn(
                "font-inter text-[13px]",
                current === opt.value
                  ? "font-bold text-primary dark:text-white"
                  : "font-medium text-text-primary-light dark:text-text-primary-dark"
              )}
            >
              {opt.label}
            </span>
            {current === opt.value && (
              <div className="w-2 h-2 rounded-full bg-primary dark:bg-white" />
            )}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Radar Page ──────────────────────────────────────────────────────────
export default function AIRadarPage() {
  const router = useRouter();
  const [actionFilter, setActionFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [historyFilter, setHistoryFilter] = useState("30 Days");
  const [showingHistory, setShowingHistory] = useState(false);
  const [showTimeSheet, setShowTimeSheet] = useState(false);
  const [notifiedTickers, setNotifiedTickers] = useState<Set<string>>(new Set());

  const toggleBell = (ticker: string) => {
    setNotifiedTickers((prev) => {
      const next = new Set(prev);
      next.has(ticker) ? next.delete(ticker) : next.add(ticker);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const now = new Date();
    if (showingHistory) {
      return RADAR_ITEMS.filter((i) => {
        if (!i.isClosed) return false;
        const days = (now.getTime() - i.timestamp.getTime()) / 86400000;
        if (historyFilter === "7 Days") return days <= 7;
        if (historyFilter === "14 Days") return days <= 14;
        return days <= 30;
      });
    }
    return RADAR_ITEMS.filter((i) => {
      if (i.isClosed) return false;
      if (actionFilter !== "All" && i.action !== actionFilter.toLowerCase()) return false;
      if (timeFilter !== "All Time") {
        const hrs = (now.getTime() - i.timestamp.getTime()) / 3600000;
        if (timeFilter === "24h") return hrs <= 24;
        if (timeFilter === "3 Days") return hrs <= 72;
        if (timeFilter === "7 Days") return hrs <= 168;
      }
      return true;
    });
  }, [showingHistory, actionFilter, timeFilter, historyFilter]);

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border-light dark:border-[#141414] shrink-0">
        <div className="flex-1">
          <h1 className="font-outfit font-bold text-[20px] text-primary dark:text-white tracking-tight leading-none">
            AI Radar
          </h1>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            {filtered.length} signal{filtered.length !== 1 ? "s" : ""} detected
          </p>
        </div>

        {/* History toggle */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowingHistory(!showingHistory)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] border transition-all duration-200",
            showingHistory
              ? "bg-primary/12 dark:bg-white/12 border-primary/25 dark:border-white/25 text-primary dark:text-white"
              : "bg-card-light dark:bg-white/[0.06] border-gray-200 dark:border-white/10 text-text-secondary-light dark:text-text-secondary-dark"
          )}
        >
          <History size={13} />
          <span className="font-inter font-semibold text-[11px]">History</span>
        </motion.button>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
          {showingHistory ? (
            ["7 Days", "14 Days", "30 Days"].map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={historyFilter === f}
                onTap={() => setHistoryFilter(f)}
              />
            ))
          ) : (
            ["All", "Buy", "Watch", "Avoid"].map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={actionFilter === f}
                onTap={() => setActionFilter(f)}
              />
            ))
          )}
        </div>

        {/* Time filter button (radar only) */}
        {!showingHistory && (
          <div className="border-l border-gray-200 dark:border-white/10 pl-2 shrink-0">
            <FilterChip
              label="Filter"
              active={timeFilter !== "All Time"}
              onTap={() => setShowTimeSheet(true)}
            />
          </div>
        )}
      </div>

      {/* ── Signal list ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark">
              No signals found.
            </p>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <AnimatePresence>
              {filtered.map((anomaly) => (
                <RadarCard
                  key={anomaly.ticker + anomaly.action}
                  anomaly={anomaly}
                  bellActive={notifiedTickers.has(anomaly.ticker)}
                  onBellToggle={() => toggleBell(anomaly.ticker)}
                  onAskAI={() => {
                    // In full app: inject question into chat
                    console.log(`Ask AI about ${anomaly.ticker}`);
                  }}
                  router={router}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Time filter sheet ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showTimeSheet && (
          <TimeFilterSheet
            current={timeFilter}
            onSelect={setTimeFilter}
            onClose={() => setShowTimeSheet(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}



