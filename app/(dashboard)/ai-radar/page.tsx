"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TagPill } from "@/components/ui/TagPill";
import {
  History,
  Bell,
  BellRing,
  Sparkles,
  Zap,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/SidebarContext";
import { RADAR_ITEMS } from "@/lib/mock-data";
import type { RadarAnomaly, RadarAction } from "@/lib/types";
import { useRouter } from "next/navigation";

const ACTION_CONFIG: Record<
  RadarAction | "closed",
  { label: string; color: string; bg: string; border: string; strip: string }
> = {
  buy: {
    label: "BUY",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-200 dark:border-green-500/25",
    strip: "bg-green-500",
  },
  watch: {
    label: "WATCH",
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-400/10",
    border: "border-slate-200 dark:border-slate-400/20",
    strip: "bg-slate-400",
  },
  avoid: {
    label: "AVOID",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/25",
    strip: "bg-red-500",
  },
  closed: {
    label: "CLOSED",
    color: "text-gray-400 dark:text-gray-500",
    bg: "bg-gray-50 dark:bg-gray-400/10",
    border: "border-gray-200 dark:border-gray-400/20",
    strip: "bg-gray-300 dark:bg-gray-600",
  },
};

// ─── Radar card ───────────────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "bg-white dark:bg-white/[0.03] rounded-2xl border overflow-hidden",
        "shadow-sm hover:shadow-md dark:shadow-none transition-shadow",
        anomaly.isClosed
          ? "border-gray-100 dark:border-white/[0.04] opacity-70"
          : "border-gray-200 dark:border-white/[0.06]"
      )}
    >
      {/* Action color strip */}
      <div className={cn("h-[3px]", cfg.strip)} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            <img
              src={anomaly.logoUrl}
              alt={anomaly.ticker}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-outfit font-bold text-[14px] text-text-primary-light dark:text-text-primary-dark">
                {anomaly.ticker}
              </span>
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[9px] font-inter font-bold border",
                cfg.color, cfg.bg, cfg.border
              )}>
                {cfg.label}
              </span>
              <span className="ml-auto font-inter text-[11px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 shrink-0">
                {anomaly.timeAgo}
              </span>
            </div>
            <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5 truncate">
              {anomaly.name}
            </p>
          </div>

          {!anomaly.isClosed && (
            <button
              onClick={onBellToggle}
              className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              {bellActive
                ? <BellRing size={14} className="text-amber-500" />
                : <Bell size={14} className="text-text-secondary-light/35 dark:text-text-secondary-dark/35" />
              }
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-white/[0.04]">
          <div className="flex flex-col">
            <span className="font-inter text-[9px] text-text-secondary-light/55 dark:text-text-secondary-dark/55 font-bold uppercase tracking-wide">
              Entry
            </span>
            <span className="font-inter font-bold text-[12px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
              ${anomaly.entryPrice.toFixed(2)}
            </span>
          </div>
          <div className="w-px h-7 bg-gray-100 dark:bg-white/[0.06]" />
          <div className="flex flex-col">
            <span className="font-inter text-[9px] text-text-secondary-light/55 dark:text-text-secondary-dark/55 font-bold uppercase tracking-wide">
              Max Return
            </span>
            <span className={cn("font-inter font-bold text-[12px] tabular-nums", returnColor)}>
              {returnStr}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {anomaly.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        {/* Ask Raven AI button — always visible, no expand */}
        <button
          onClick={() => router.push(`/?q=Analyze+${anomaly.ticker}`)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold
                     bg-primary/7 dark:bg-white/7 border border-primary/18 dark:border-white/14
                     text-primary dark:text-white
                     hover:bg-primary/12 dark:hover:bg-white/12 transition-colors"
        >
          <Sparkles size={12} /> Ask Raven AI
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIRadarPage() {
  const { setMobileOpen } = useSidebar();
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

  const activeFilters = showingHistory ? ["7 Days", "14 Days", "30 Days"] : ["All", "Buy", "Watch", "Avoid"];
  const currentFilter = showingHistory ? historyFilter : actionFilter;
  const setCurrentFilter = showingHistory ? setHistoryFilter : setActionFilter;
  const timeFilters = ["All Time", "24h", "3 Days", "7 Days"];

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* Header */}
      <div className="px-5 pt-5 pb-3.5 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.06] text-primary dark:text-white"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-bold text-[22px] text-primary dark:text-white tracking-tight leading-none">
                  AI Radar
                </h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-inter font-semibold text-[10px] text-green-600 dark:text-green-400">Live</span>
                </div>
              </div>
              <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                {filtered.length} signal{filtered.length !== 1 ? "s" : ""} active
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowingHistory(!showingHistory)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-inter font-semibold text-[12px] transition-all shrink-0",
              showingHistory
                ? "bg-primary/10 dark:bg-white/10 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                : "bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.07]"
            )}
          >
            <History size={13} /> History
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setCurrentFilter(f)}
              className={cn(
                "px-3 py-1 rounded-xl text-[12px] font-inter font-semibold border transition-all",
                currentFilter === f
                  ? "bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                  : "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.07]"
              )}
            >
              {f}
            </button>
          ))}
          {!showingHistory && (
            <>
              <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-0.5" />
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[11px] font-inter font-semibold border transition-all",
                    timeFilter === f
                      ? "bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                      : "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-text-secondary-light/70 dark:text-text-secondary-dark/70 hover:bg-gray-50 dark:hover:bg-white/[0.07]"
                  )}
                >
                  {f}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
              <Zap size={22} className="text-primary/30 dark:text-white/30" />
            </div>
            <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark">
              No signals match your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
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
