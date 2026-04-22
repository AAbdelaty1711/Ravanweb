"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

import {
  Plus,
  Trash2,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn, formatPrice, formatPct, stockFaviconUrl } from "@/lib/utils";
import { INITIAL_WATCHLIST, ALL_STOCKS, TICKER_GRADIENTS } from "@/lib/mock-data";
import type { WatchlistItem } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";


// ─── Individual stock card ────────────────────────────────────────────────────
function StockCard({
  item,
  deletionMode,
  onDelete,
  onTap,
}: {
  item: WatchlistItem;
  deletionMode: boolean;
  onDelete: () => void;
  onTap: () => void;
}) {
  const pct = ((item.target1 - item.currentPrice) / item.currentPrice) * 100;
  const pctStr = formatPct(pct);
  const trendColor = item.isUp ? "text-bull" : "text-bear";
  const trendBg = item.isUp ? "bg-bull/12 border-bull/18" : "bg-bear/12 border-bear/18";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, x: -20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: deletionMode ? 1 : 1.005 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !deletionMode && onTap()}
      className={cn(
        "flex items-center gap-3 px-4 py-4 rounded-card",
        "bg-card-light dark:bg-card-dark",
        "border transition-all duration-200",
        deletionMode
          ? "border-red-400/40 dark:border-red-500/30 cursor-default"
          : "border-border-light dark:border-[#38383A] cursor-pointer hover:border-primary/20 dark:hover:border-white/15",
        "shadow-card-light dark:shadow-none"
      )}
    >
      {/* Delete button */}
      <AnimatePresence>
        {deletionMode && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                       bg-red-500/10 border border-red-500/35
                       text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Column 1: Logo + Ticker + Name (flex 4) */}
      <div className="flex items-center gap-3 flex-[4] min-w-0">
        <CompanyLogo ticker={item.ticker} logoUrl={item.logoUrl} size={40} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-outfit font-semibold text-ticker text-text-primary-light dark:text-text-primary-dark tracking-tight">
              {item.ticker}
            </span>
            {item.hasWarning && (
              <AlertTriangle size={14} className="text-warning shrink-0" />
            )}
          </div>
          <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark truncate mt-0.5 leading-tight">
            {item.name}
          </p>
        </div>
      </div>

      {/* Column 2: Price + % to target (flex 3) */}
      <div className="flex flex-col items-center flex-[3]">
        <span className="font-inter font-semibold text-price text-text-primary-light dark:text-text-primary-dark tracking-tight">
          {formatPrice(item.currentPrice)}
        </span>
        <div
          className={cn(
            "mt-1.5 px-2 py-1 rounded-lg border text-[10px] font-semibold font-inter",
            trendBg, trendColor
          )}
        >
          {pctStr}
        </div>
      </div>

      {/* Column 3: Targets (flex 3) */}
      <div className="flex flex-col items-end flex-[3]">
        <div className="flex items-center gap-1">
          <span className="font-inter text-[9.5px] font-semibold text-text-secondary-light/60 dark:text-text-secondary-dark/60 tracking-wide">
            T1
          </span>
          <span className="font-inter text-target text-text-secondary-light dark:text-gray-400">
            {formatPrice(item.target1)}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="font-inter text-[9.5px] font-semibold text-text-secondary-light/60 dark:text-text-secondary-dark/60 tracking-wide">
            T2
          </span>
          <span className="font-inter text-target text-text-secondary-light dark:text-gray-400">
            {formatPrice(item.target2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Add Stock Row (inside modal) ─────────────────────────────────────────────
function AddStockRow({
  item,
  isAdded,
  onToggle,
}: {
  item: WatchlistItem;
  isAdded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-card mb-3",
        "bg-card-light dark:bg-card-dark",
        "border transition-all duration-200",
        isAdded
          ? "border-bull/40 dark:border-bull/35"
          : "border-border-light dark:border-[#38383A]"
      )}
    >
      <CompanyLogo ticker={item.ticker} logoUrl={item.logoUrl} size={40} />

      <div className="flex-1 min-w-0">
        <span className="font-outfit font-semibold text-[13px] text-text-primary-light dark:text-text-primary-dark">
          {item.ticker}
        </span>
        <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark truncate">
          {item.name}
        </p>
      </div>

      <div className="flex flex-col items-end mr-3">
        <span className="font-inter font-semibold text-[13px] text-text-primary-light dark:text-text-primary-dark">
          {formatPrice(item.currentPrice)}
        </span>
        <div className="flex items-center gap-0.5 mt-0.5">
          {item.isUp ? (
            <TrendingUp size={10} className="text-bull" />
          ) : (
            <TrendingDown size={10} className="text-bear" />
          )}
          <span
            className={cn(
              "font-inter text-[10px] font-semibold",
              item.isUp ? "text-bull" : "text-bear"
            )}
          >
            {item.isUp ? "Bullish" : "Bearish"}
          </span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        className={cn(
          "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
          "border transition-all duration-250",
          isAdded
            ? "bg-bull/12 border-bull/40 text-bull"
            : "bg-primary/8 dark:bg-white/6 border-gray-200 dark:border-white/12 text-primary dark:text-white"
        )}
      >
        {isAdded ? <CheckCircle2 size={18} /> : <Plus size={18} />}
      </motion.button>
    </motion.div>
  );
}

// ─── Add Stock Modal ──────────────────────────────────────────────────────────
function AddStockModal({
  watchlist,
  onClose,
  onAdd,
  onRemove,
}: {
  watchlist: WatchlistItem[];
  onClose: () => void;
  onAdd: (item: WatchlistItem) => void;
  onRemove: (ticker: string) => void;
}) {
  const [query, setQuery] = useState("");
  const watchedTickers = new Set(watchlist.map((w) => w.ticker));

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_STOCKS.filter(
      (s) =>
        q === "" ||
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 w-full sm:max-w-md sm:mx-4",
          "bg-background-muted dark:bg-background-dark",
          "rounded-t-[24px] sm:rounded-[24px]",
          "h-[85vh] sm:h-[70vh] flex flex-col overflow-hidden",
          "market-pattern"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0">
          <button
            onClick={onClose}
            className="raven-icon-btn"
            aria-label="Close"
          >
            <X size={16} className="text-primary dark:text-white" />
          </button>
          <h2 className="font-outfit font-bold text-[20px] text-primary dark:text-white tracking-tight">
            Add Stocks
          </h2>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 shrink-0">
          <div
            className={cn(
              "flex items-center gap-2 px-3 h-12 rounded-input",
              "bg-black/[0.035] dark:bg-white/[0.04]",
              "border border-transparent focus-within:border-primary/40 dark:focus-within:border-white/25",
              "transition-all duration-150"
            )}
          >
            <Search size={18} className="text-text-secondary-light dark:text-text-secondary-dark shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ticker or company"
              className="flex-1 bg-transparent outline-none font-inter text-[14px]
                         text-text-primary-light dark:text-text-primary-dark
                         placeholder:text-text-secondary-light/55 dark:placeholder:text-text-secondary-dark/55"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
            )}
          </div>
        </div>

        {/* Stock list */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 min-h-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-text-secondary-light dark:text-text-secondary-dark">
              <p className="font-inter text-[13px]">No results for "{query}"</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((stock) => (
                <AddStockRow
                  key={stock.ticker}
                  item={stock}
                  isAdded={watchedTickers.has(stock.ticker)}
                  onToggle={() => {
                    if (watchedTickers.has(stock.ticker)) {
                      onRemove(stock.ticker);
                    } else {
                      onAdd(stock);
                    }
                  }}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Column Headers ───────────────────────────────────────────────────────────
function ColumnHeaders({ deletionMode }: { deletionMode: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center px-4 py-2.5 mx-4 mb-2 rounded-[12px]",
        "bg-white/85 dark:bg-white/[0.04]",
        "border border-gray-200 dark:border-white/10"
      )}
    >
      <AnimatePresence>
        {deletionMode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 44, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex-[4]">
        <span className="font-inter text-[10px] font-semibold tracking-[0.35px] text-gray-500 dark:text-gray-500">
          SYM
        </span>
      </div>
      <div className="flex-[3] text-center">
        <span className="font-inter text-[10px] font-semibold tracking-[0.35px] text-gray-500 dark:text-gray-500">
          PRICE
        </span>
      </div>
      <div className="flex-[3] text-right">
        <span className="font-inter text-[10px] font-semibold tracking-[0.35px] text-gray-500 dark:text-gray-500">
          TARGETS
        </span>
      </div>
    </div>
  );
}

// ─── Empty Watchlist State ────────────────────────────────────────────────────
function EmptyWatchlist({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center flex-1 px-8 pb-16"
    >
      <div className="w-16 h-16 rounded-full bg-primary/[0.07] dark:bg-white/[0.07]
                      flex items-center justify-center mb-5">
        <TrendingUp size={28} className="text-primary/25 dark:text-white/25" />
      </div>
      <h3 className="font-outfit font-bold text-[18px] text-gray-500 dark:text-gray-400 text-center mb-2">
        No stocks tracked yet
      </h3>
      <p className="font-inter text-[13px] text-gray-400 dark:text-gray-500 text-center mb-6">
        Tap + to add your first stock
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-btn
                   bg-primary dark:bg-white
                   text-white dark:text-black
                   font-inter font-semibold text-[13px]"
      >
        <Plus size={16} />
        Add Stocks
      </motion.button>
    </motion.div>
  );
}

// ─── Main Watchlist Page ──────────────────────────────────────────────────────
export default function WatchlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [deletionMode, setDeletionMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRemove = (ticker: string) => {
    setItems((prev) => prev.filter((i) => i.ticker !== ticker));
  };

  const handleAdd = (item: WatchlistItem) => {
    setItems((prev) =>
      prev.find((i) => i.ticker === item.ticker) ? prev : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border-light dark:border-[#141414] shrink-0">
        <div className="flex-1">
          <h1 className="font-outfit font-bold text-[20px] text-primary dark:text-white tracking-tight leading-none">
            Watchlist
          </h1>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            {items.length} stock{items.length !== 1 ? "s" : ""} tracked
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {deletionMode ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => setDeletionMode(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[12px]
                         bg-red-500/8 dark:bg-red-500/12 border border-red-500/25
                         text-red-400 font-inter font-semibold text-[13px]
                         transition-colors hover:bg-red-500/15"
            >
              <X size={14} />
              Cancel
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="raven-icon-btn"
                aria-label="Add stock"
              >
                <Plus size={18} className="text-primary dark:text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeletionMode(true)}
                className="raven-icon-btn"
                aria-label="Delete stocks"
              >
                <Trash2 size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* ── Column headers ────────────────────────────────────────────── */}
      {items.length > 0 && (
        <div className="pt-3">
          <ColumnHeaders deletionMode={deletionMode} />
        </div>
      )}

      {/* ── Stock list ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 min-h-0">
        {items.length === 0 ? (
          <EmptyWatchlist onAdd={() => setShowAddModal(true)} />
        ) : (
          <motion.div layout className="space-y-3 pt-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <StockCard
                  key={item.ticker}
                  item={item}
                  deletionMode={deletionMode}
                  onDelete={() => handleRemove(item.ticker)}
                  onTap={() => {
                    router.push(`/stock/${item.ticker.toLowerCase()}`);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Add Stock Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <AddStockModal
            watchlist={items}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        )}
      </AnimatePresence>
    </div>
  );
}



