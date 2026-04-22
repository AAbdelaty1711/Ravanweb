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
  TrendingUp,
  TrendingDown,
  Zap,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RADAR_ITEMS } from "@/lib/mock-data";
import type { RadarAnomaly, RadarAction } from "@/lib/types";
import { useRouter } from "next/navigation";

const ACTION_CONFIG: Record<
  RadarAction | "closed",
  { label: string; color: string; bg: string; border: string; strip: string; dot: string }
> = {
  buy: {
    label: "BUY",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-200 dark:border-green-500/25",
    strip: "bg-green-500",
    dot: "bg-green-500",
  },
  watch: {
    label: "WATCH",
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-400/10",
    border: "border-slate-200 dark:border-slate-400/20",
    strip: "bg-slate-400",
    dot: "bg-slate-400",
  },
  avoid: {
    label: "AVOID",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/25",
    strip: "bg-red-500",
    dot: "bg-red-500",
  },
  closed: {
    label: "CLOSED",
    color: "text-gray-400 dark:text-gray-500",
    bg: "bg-gray-50 dark:bg-gray-400/10",
    border: "border-gray-200 dark:border-gray-400/20",
    strip: "bg-gray-300 dark:bg-gray-600",
    dot: "bg-gray-400",
  },
};

// ─── Summary bar ─────────────────────────────────────────────────────────────
function SummaryPill({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border", color)}>
      <span className="font-outfit font-bold text-[20px] leading-none">{count}</span>
      <span className="font-inter text-[12px] font-semibold">{label}</span>
    </div>
  );
}

// ─── Radar card (web style) ───────────────────────────────────────────────────
function RadarCard({
  anomaly,
  bellActive,
  onBellToggle,
  router,
}: {
  anomaly: RadarAnomaly;
  bellActive: boolean;
  onBellToggle: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfgKey = anomaly.isClosed ? "closed" : anomaly.action;
  const cfg = ACTION_CONFIG[cfgKey];
  const returnColor =
    anomaly.maxReturn > 0 ? "text-green-600 dark:text-green-400" :
    anomaly.maxReturn < 0 ? "text-red-600 dark:text-red-400" :
    "text-text-primary-light dark:text-text-primary-dark";
  const returnStr = `${anomaly.maxReturn > 0 ? "+" : ""}${anomaly.maxReturn}%`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "bg-white dark:bg-white/[0.03] rounded-2xl border overflow-hidden",
        "shadow-sm hover:shadow-md dark:shadow-none transition-shadow",
        anomaly.isClosed
          ? "border-gray-100 dark:border-white/[0.04] opacity-70"
          : "border-gray-200 dark:border-white/[0.06]"
      )}
    >
      {/* Top action strip */}
      <div className={cn("h-1", cfg.strip)} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
            <img
              src={anomaly.logoUrl}
              alt={anomaly.ticker}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-outfit font-bold text-[15px] text-text-primary-light dark:text-text-primary-dark">
                {anomaly.ticker}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-inter font-bold border",
                  cfg.color, cfg.bg, cfg.border
                )}
              >
                {cfg.label}
              </span>
              <span className="font-inter text-[11px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 ml-auto">
                {anomaly.timeAgo}
              </span>
            </div>
            <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5 truncate">
              {anomaly.name}
            </p>
          </div>

          {/* Bell */}
          {!anomaly.isClosed && (
            <button
              onClick={onBellToggle}
              className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              {bellActive ? (
                <BellRing size={15} className="text-amber-500" />
              ) : (
                <Bell size={15} className="text-text-secondary-light/40 dark:text-text-secondary-dark/40" />
              )}
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-white/[0.04]">
          <div className="flex flex-col">
            <span className="font-inter text-[10px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 font-semibold uppercase tracking-wide">
              Entry
            </span>
            <span className="font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
              ${anomaly.entryPrice.toFixed(2)}
            </span>
          </div>
          <div className="w-px h-8 bg-gray-100 dark:bg-white/[0.06]" />
          <div className="flex flex-col">
            <span className="font-inter text-[10px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 font-semibold uppercase tracking-wide">
              Max Return
            </span>
            <span className={cn("font-inter font-bold text-[13px] tabular-nums", returnColor)}>
              {returnStr}
            </span>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold
                         bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08]
                         text-text-secondary-light dark:text-text-secondary-dark
                         hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
            >
              {expanded ? "Less" : "Details"}
              {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {anomaly.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        {/* Expanded actions */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => router.push(`/stock/${anomaly.ticker.toLowerCase()}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold
                             bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08]
                             text-text-primary-light dark:text-text-primary-dark
                             hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  View Chart
                </button>
                <button
                  onClick={() => router.push(`/?q=Analyze+${anomaly.ticker}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold
                             bg-primary/8 dark:bg-white/8 border border-primary/20 dark:border-white/15
                             text-primary dark:text-white
                             hover:bg-primary/14 dark:hover:bg-white/14 transition-colors"
                >
                  <Sparkles size={12} /> Ask Raven AI
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main AI Radar Page ───────────────────────────────────────────────────────
export default function AIRadarPage() {
  const router = useRouter();
  const [actionFilter, setActionFilter] = useState("All");
  const [showingHistory, setShowingHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("30 Days");
  const [timeFilter, setTimeFilter] = useState("All Time");
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

  const activeItems = RADAR_ITEMS.filter((i) => !i.isClosed);
  const buyCount = activeItems.filter((i) => i.action === "buy").length;
  const watchCount = activeItems.filter((i) => i.action === "watch").length;
  const avoidCount = activeItems.filter((i) => i.action === "avoid").length;

  const filters = showingHistory
    ? ["7 Days", "14 Days", "30 Days"]
    : ["All", "Buy", "Watch", "Avoid"];
  const activeFilter = showingHistory ? historyFilter : actionFilter;
  const setFilter = showingHistory ? setHistoryFilter : setActionFilter;

  const timeFilters = ["All Time", "24h", "3 Days", "7 Days"];

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit font-bold text-[26px] text-primary dark:text-white tracking-tight leading-none">
                AI Radar
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-inter font-semibold text-[11px] text-green-600 dark:text-green-400">
                  Live
                </span>
              </div>
            </div>
            <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Real-time anomaly detection · {filtered.length} signals active
            </p>
          </div>

          <button
            onClick={() => setShowingHistory(!showingHistory)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl border font-inter font-semibold text-[13px] transition-all",
              showingHistory
                ? "bg-primary/10 dark:bg-white/10 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                : "bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.08]"
            )}
          >
            <History size={14} />
            Signal History
          </button>
        </div>

        {/* Summary pills */}
        {!showingHistory && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <SummaryPill
              label="Buy Signals"
              count={buyCount}
              color="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
            />
            <SummaryPill
              label="Watch"
              count={watchCount}
              color="bg-slate-50 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20 text-slate-600 dark:text-slate-400"
            />
            <SummaryPill
              label="Avoid"
              count={avoidCount}
              color="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
            />
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-[12px] font-inter font-semibold border transition-all",
                activeFilter === f
                  ? "bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                  : "bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08] text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.08]"
              )}
            >
              {f}
            </button>
          ))}

          {!showingHistory && (
            <>
              <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[11px] font-inter font-semibold border transition-all",
                    timeFilter === f
                      ? "bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                      : "bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08] text-text-secondary-light/70 dark:text-text-secondary-dark/70 hover:bg-gray-50 dark:hover:bg-white/[0.08]"
                  )}
                >
                  {f}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Signal grid ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
              <Zap size={24} className="text-primary/30 dark:text-white/30" />
            </div>
            <p className="font-inter text-[14px] text-text-secondary-light dark:text-text-secondary-dark">
              No signals match your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((anomaly) => (
                <RadarCard
                  key={anomaly.ticker + anomaly.action}
                  anomaly={anomaly}
                  bellActive={notifiedTickers.has(anomaly.ticker)}
                  onBellToggle={() => toggleBell(anomaly.ticker)}
                  router={router}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
