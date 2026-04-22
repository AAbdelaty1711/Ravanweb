"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BarChart2,
  MessageSquare,
  Menu,
} from "lucide-react";
import { cn, formatPrice, formatPct, stockFaviconUrl } from "@/lib/utils";
import { useSidebar } from "@/components/SidebarContext";
import { INITIAL_WATCHLIST, ALL_STOCKS } from "@/lib/mock-data";
import type { WatchlistItem } from "@/lib/types";
import { useRouter } from "next/navigation";

// ─── Table row ────────────────────────────────────────────────────────────────
function StockRow({
  item,
  index,
  deletionMode,
  onDelete,
  onTap,
}: {
  item: WatchlistItem;
  index: number;
  deletionMode: boolean;
  onDelete: () => void;
  onTap: () => void;
}) {
  const pct = ((item.target1 - item.currentPrice) / item.currentPrice) * 100;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2, delay: index * 0.025 }}
      onClick={() => !deletionMode && onTap()}
      className={cn(
        "group border-b border-gray-100 dark:border-white/[0.04] transition-colors duration-150",
        deletionMode
          ? "bg-red-50/40 dark:bg-red-900/[0.08] cursor-default"
          : "hover:bg-primary/[0.025] dark:hover:bg-white/[0.03] cursor-pointer"
      )}
    >
      {deletionMode && (
        <td className="pl-4 py-3 w-10">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-6 h-6 rounded-full flex items-center justify-center
                       bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors"
          >
            <X size={12} />
          </motion.button>
        </td>
      )}

      <td className="pl-4 py-3.5 w-8">
        <span className="font-inter text-[11px] text-text-secondary-light/40 dark:text-text-secondary-dark/40 tabular-nums">
          {index + 1}
        </span>
      </td>

      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-2.5">
          <CompanyLogo ticker={item.ticker} logoUrl={item.logoUrl} size={34} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark">
                {item.ticker}
              </span>
              {item.hasWarning && <AlertTriangle size={12} className="text-warning" />}
            </div>
            <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark leading-tight">
              {item.name}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3.5 pr-5 text-right">
        <span className="font-inter font-semibold text-[13px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
          {formatPrice(item.currentPrice)}
        </span>
      </td>

      <td className="py-3.5 pr-5 text-right">
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
          item.isUp ? "bg-bull/10 text-bull" : "bg-bear/10 text-bear"
        )}>
          {item.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {formatPct(pct)}
        </span>
      </td>

      <td className="py-3.5 pr-5 text-right hidden md:table-cell">
        <div>
          <span className="font-inter text-[12px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
            {formatPrice(item.target1)}
          </span>
          <span className="ml-1 font-inter text-[10px] text-text-secondary-light/50 dark:text-text-secondary-dark/50 font-bold">T1</span>
        </div>
      </td>

      <td className="py-3.5 pr-5 text-right hidden lg:table-cell">
        <div>
          <span className="font-inter text-[12px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
            {formatPrice(item.target2)}
          </span>
          <span className="ml-1 font-inter text-[10px] text-text-secondary-light/50 dark:text-text-secondary-dark/50 font-bold">T2</span>
        </div>
      </td>

      <td className="py-3.5 pr-4 text-right hidden sm:table-cell">
        <span className={cn(
          "text-[10px] font-inter font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border",
          item.isUp
            ? "bg-bull/8 text-bull border-bull/20"
            : "bg-bear/8 text-bear border-bear/20"
        )}>
          {item.isUp ? "Bullish" : "Bearish"}
        </span>
      </td>

      <td className="py-3.5 pr-4 w-14">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold
                          bg-primary/8 dark:bg-white/8 text-primary dark:text-white">
            <MessageSquare size={10} />
            <span className="hidden xl:inline">Ask AI</span>
          </div>
        </div>
      </td>
    </motion.tr>
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
      (s) => q === "" || s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#111118]
                   rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden market-pattern"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex-1">
            <h2 className="font-outfit font-bold text-[17px] text-primary dark:text-white">Add Stocks</h2>
            <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
              {watchlist.length} currently tracked
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center
                       text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg
                          bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08]">
            <Search size={14} className="text-text-secondary-light dark:text-text-secondary-dark shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ticker or company…"
              className="flex-1 bg-transparent outline-none font-inter text-[13px]
                         text-text-primary-light dark:text-text-primary-dark
                         placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={12} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[380px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-[#0d0d14]">
              <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                <th className="text-left pl-5 py-2 font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/60 dark:text-text-secondary-dark/60">Company</th>
                <th className="text-right pr-4 py-2 font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/60 dark:text-text-secondary-dark/60">Price</th>
                <th className="text-right pr-5 py-2 w-20 font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/60 dark:text-text-secondary-dark/60">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="py-10 text-center">
                  <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark">No results for "{query}"</p>
                </td></tr>
              ) : filtered.map((stock) => {
                const isAdded = watchedTickers.has(stock.ticker);
                return (
                  <tr key={stock.ticker} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-primary/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="pl-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo ticker={stock.ticker} logoUrl={stock.logoUrl} size={30} />
                        <div>
                          <p className="font-outfit font-bold text-[12px] text-text-primary-light dark:text-text-primary-dark">{stock.ticker}</p>
                          <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">{stock.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="pr-4 py-2.5 text-right">
                      <span className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark tabular-nums">{formatPrice(stock.currentPrice)}</span>
                    </td>
                    <td className="pr-5 py-2.5 text-right">
                      <button
                        onClick={() => isAdded ? onRemove(stock.ticker) : onAdd(stock)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors",
                          isAdded
                            ? "bg-bull/10 text-bull border border-bull/20 hover:bg-bull/15"
                            : "bg-primary/8 dark:bg-white/8 text-primary dark:text-white border border-primary/15 dark:border-white/12 hover:bg-primary/14 dark:hover:bg-white/14"
                        )}
                      >
                        {isAdded ? "✓ Added" : "+ Add"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WatchlistPage() {
  const { setMobileOpen } = useSidebar();
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [deletionMode, setDeletionMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRemove = (ticker: string) => setItems((p) => p.filter((i) => i.ticker !== ticker));
  const handleAdd = (item: WatchlistItem) => setItems((p) => p.find((i) => i.ticker === item.ticker) ? p : [...p, item]);

  // Click row → open chat with that ticker
  const handleRowTap = (ticker: string) => {
    router.push(`/?q=Analyze+${ticker}`);
  };

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.06] text-primary dark:text-white"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-outfit font-bold text-[22px] text-primary dark:text-white tracking-tight leading-none">
                Watchlist
              </h1>
              <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                {items.length} stock{items.length !== 1 ? "s" : ""} tracked · tap a row to ask AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {deletionMode ? (
              <button
                onClick={() => setDeletionMode(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                           bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10
                           text-text-secondary-light dark:text-text-secondary-dark
                           font-inter font-semibold text-[12px] transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
              >
                <X size={13} /> Cancel
              </button>
            ) : (
              <>
                <button
                  onClick={() => setDeletionMode(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                             bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10
                             text-text-secondary-light dark:text-text-secondary-dark
                             font-inter font-semibold text-[12px] transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  <Trash2 size={13} /> Manage
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                             bg-primary dark:bg-white text-white dark:text-black
                             font-inter font-semibold text-[12px] transition-opacity hover:opacity-90"
                >
                  <Plus size={13} /> Add
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 py-3 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
              <BarChart2 size={26} className="text-primary/30 dark:text-white/30" />
            </div>
            <div className="text-center">
              <h3 className="font-outfit font-bold text-[17px] text-text-primary-light dark:text-text-primary-dark">
                Your watchlist is empty
              </h3>
              <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Add stocks to start tracking AI signals
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                         bg-primary dark:bg-white text-white dark:text-black
                         font-inter font-semibold text-[13px]"
            >
              <Plus size={14} /> Add First Stock
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                  {deletionMode && <th className="w-10 pl-4" />}
                  <th className="w-8 pl-4 py-2.5 text-left font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">#</th>
                  <th className="py-2.5 pr-4 text-left font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">Company</th>
                  <th className="py-2.5 pr-5 text-right font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">Price</th>
                  <th className="py-2.5 pr-5 text-right font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">To T1</th>
                  <th className="py-2.5 pr-5 text-right hidden md:table-cell font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">Target 1</th>
                  <th className="py-2.5 pr-5 text-right hidden lg:table-cell font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">Target 2</th>
                  <th className="py-2.5 pr-4 text-right hidden sm:table-cell font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">Signal</th>
                  <th className="py-2.5 pr-4 w-14" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <StockRow
                      key={item.ticker}
                      item={item}
                      index={i}
                      deletionMode={deletionMode}
                      onDelete={() => handleRemove(item.ticker)}
                      onTap={() => handleRowTap(item.ticker)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

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
