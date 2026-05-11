'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import {
  Plus,
  Trash2,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart2,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cn, formatPrice, formatPct, stockFaviconUrl } from '@/lib/utils'
import {
  INITIAL_WATCHLIST,
  ALL_STOCKS,
  TICKER_GRADIENTS,
} from '@/lib/mock-data'
import type { WatchlistItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

function MobileCompanyLogo({
  ticker,
  logoUrl,
}: {
  ticker: string
  logoUrl: string
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const grad = TICKER_GRADIENTS[ticker] ?? ['#7C7C7C', '#3C3C3C']
  return (
    <div
      className="shrink-0 w-8 h-8 rounded-[9px] overflow-hidden border border-white/10 dark:border-white/12"
      style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
    >
      {!imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={ticker}
          width={40}
          height={40}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-outfit font-bold text-white text-[11px]">
            {ticker[0]}
          </span>
        </div>
      )}
    </div>
  )
}

function StockRow({
  item,
  index,
  deletionMode,
  onDelete,
  onTap,
}: {
  item: WatchlistItem
  index: number
  deletionMode: boolean
  onDelete: () => void
  onTap: () => void
}) {
  const pct = ((item.target1 - item.currentPrice) / item.currentPrice) * 100

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2, delay: index * 0.025 }}
      onClick={() => !deletionMode && onTap()}
      className={cn(
        'group border-b border-gray-100 dark:border-white/[0.04] transition-colors duration-150',
        deletionMode
          ? 'bg-red-50/40 dark:bg-red-900/[0.08] cursor-default'
          : 'hover:bg-primary/[0.025] dark:hover:bg-white/[0.03] cursor-pointer'
      )}
    >
      {deletionMode && (
        <td className="pl-4 py-3 w-10">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center
                       bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors"
          >
            <X size={10} />
          </motion.button>
        </td>
      )}

      <td className="pl-4 py-3 w-8">
        <span className="font-inter text-[10px] text-text-secondary-light/40 dark:text-text-secondary-dark/40 tabular-nums">
          {index + 1}
        </span>
      </td>

      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <CompanyLogo ticker={item.ticker} logoUrl={item.logoUrl} size={30} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-bold text-[12px] text-text-primary-light dark:text-text-primary-dark">
                {item.ticker}
              </span>
              {item.hasWarning && (
                <AlertTriangle size={10} className="text-warning" />
              )}
            </div>
            <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark leading-tight">
              {item.name}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3 pe-5">
        <div className="flex items-center justify-center gap-1.5">
          <span
            className={cn(
              'font-inter font-semibold text-[12px]',
              item.isUp ? 'text-bull' : 'text-bear'
            )}
          >
            {item.isUp ? 'Up' : 'Down'}
          </span>
          {item.isUp ? (
            <TrendingUp size={12} className="text-bull" />
          ) : (
            <TrendingDown size={12} className="text-bear" />
          )}
        </div>
      </td>

      <td className="py-3 pe-5">
        <div className="flex justify-end">
          <span className="font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark tabular-nums tracking-[-0.3px]">
            {formatPrice(item.currentPrice)}
          </span>
        </div>
      </td>

      <td className="py-3 pe-5">
        <div className="flex justify-end">
          <div
            className={cn(
              'flex items-center justify-center px-2 py-0.5 rounded-[6px] border',
              item.isUp
                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
            )}
          >
            <span className="font-inter font-bold text-[10px] tabular-nums tracking-tight">
              {pct >= 0 ? '+' : ''}
              {pct.toFixed(1)}%
            </span>
          </div>
        </div>
      </td>

      <td className="py-3 pr-4 w-14">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
                          bg-primary/8 dark:bg-white/8 text-primary dark:text-white"
          >
            <MessageSquare size={10} />
            <span className="hidden xl:inline">Ask AI</span>
          </div>
        </div>
      </td>
    </motion.tr>
  )
}

function AddStockModal({
  watchlist,
  onClose,
  onAdd,
  onRemove,
}: {
  watchlist: WatchlistItem[]
  onClose: () => void
  onAdd: (item: WatchlistItem) => void
  onRemove: (ticker: string) => void
}) {
  const [query, setQuery] = useState('')
  const watchedTickers = new Set(watchlist.map((w) => w.ticker))
  const { dict } = useLanguage()

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_STOCKS.filter(
      (s) =>
        q === '' ||
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-[#111118]
                   rounded-t-[24px] sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden market-pattern"
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex-1">
            <h2 className="font-outfit font-bold text-[15px] text-primary dark:text-white">
              {dict.watchlist.addStock}
            </h2>
            <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
              {dict.watchlist.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center
                       text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <X size={11} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
          <div
            className="flex items-center gap-2 px-3 h-9 rounded-lg
                          bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08]"
          >
            <Search
              size={12}
              className="text-text-secondary-light dark:text-text-secondary-dark shrink-0"
            />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ticker or company…"
              className="flex-1 bg-transparent outline-none font-inter text-[12px]
                         text-text-primary-light dark:text-text-primary-dark
                         placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X
                  size={10}
                  className="text-text-secondary-light dark:text-text-secondary-dark"
                />
              </button>
            )}
          </div>
        </div>

        <div className="hidden sm:block overflow-y-auto max-h-[380px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-[#0d0d14]">
              <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                <th className="text-start ps-5 py-2 font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/60 dark:text-text-secondary-dark/60">
                  {dict.watchlist.company}
                </th>
                <th className="text-end pe-4 py-2 font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/60 dark:text-text-secondary-dark/60">
                  {dict.watchlist.price}
                </th>
                <th className="text-end pe-5 py-2 w-20 font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/60 dark:text-text-secondary-dark/60">
                  {dict.watchlist.add}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center">
                    <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
                      No results for "{query}"
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((stock) => {
                  const isAdded = watchedTickers.has(stock.ticker)
                  return (
                    <tr
                      key={stock.ticker}
                      className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-primary/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="pl-5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <CompanyLogo
                            ticker={stock.ticker}
                            logoUrl={stock.logoUrl}
                            size={30}
                          />
                          <div>
                            <p className="font-outfit font-bold text-[11px] text-text-primary-light dark:text-text-primary-dark">
                              {stock.ticker}
                            </p>
                            <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                              {stock.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="pe-4 py-2.5 text-end">
                        <span className="font-inter font-semibold text-[11px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
                          {formatPrice(stock.currentPrice)}
                        </span>
                      </td>
                      <td className="pe-5 py-2.5 text-end">
                        <button
                          onClick={() =>
                            isAdded ? onRemove(stock.ticker) : onAdd(stock)
                          }
                          className={cn(
                            'px-3 py-1 rounded-lg text-[10px] font-semibold transition-colors',
                            isAdded
                              ? 'bg-bull/10 text-bull border border-bull/20 hover:bg-bull/15'
                              : 'bg-primary/8 dark:bg-white/8 text-primary dark:text-white border border-primary/15 dark:border-white/12 hover:bg-primary/14 dark:hover:bg-white/14'
                          )}
                        >
                          {isAdded
                            ? `✓ ${dict.watchlist.added}`
                            : `+ ${dict.watchlist.add}`}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden overflow-y-auto max-h-[55vh] px-4 py-2 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark py-10">
              No results for "{query}"
            </p>
          ) : (
            filtered.map((stock) => {
              const isAdded = watchedTickers.has(stock.ticker)
              return (
                <div
                  key={stock.ticker}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-[16px] border transition-all',
                    isAdded
                      ? 'border-bull/40 bg-bull/[0.03] dark:bg-bull/[0.05]'
                      : 'border-gray-200 dark:border-[#38383A] bg-white dark:bg-[#000000]'
                  )}
                >
                  <MobileCompanyLogo
                    ticker={stock.ticker}
                    logoUrl={stock.logoUrl}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-outfit font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark">
                      {stock.ticker}
                    </p>
                    <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate">
                      {stock.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end mr-2">
                    <span className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
                      {formatPrice(stock.currentPrice)}
                    </span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {stock.isUp ? (
                        <ArrowUpRight size={10} className="text-bull" />
                      ) : (
                        <ArrowDownRight size={10} className="text-bear" />
                      )}
                      <span
                        className={cn(
                          'font-inter text-[10px] font-semibold',
                          stock.isUp ? 'text-bull' : 'text-bear'
                        )}
                      >
                        {stock.isUp
                          ? dict.watchlist.bullish
                          : dict.watchlist.bearish}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      isAdded ? onRemove(stock.ticker) : onAdd(stock)
                    }
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center border transition-all shrink-0',
                      isAdded
                        ? 'bg-bull/12 border-bull/40 text-bull'
                        : 'bg-primary/8 dark:bg-white/[0.06] border-gray-200 dark:border-white/12 text-primary dark:text-white'
                    )}
                  >
                    {isAdded ? (
                      <span className="text-[16px] font-bold leading-none">
                        ✓
                      </span>
                    ) : (
                      <Plus size={14} />
                    )}
                  </button>
                </div>
              )
            })
          )}
          <div className="h-4" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function DesktopWatchlist({
  items,
  deletionMode,
  setDeletionMode,
  setShowAddModal,
  handleRemove,
  handleRowTap,
}: {
  items: WatchlistItem[]
  deletionMode: boolean
  setDeletionMode: (v: boolean) => void
  setShowAddModal: (v: boolean) => void
  handleRemove: (ticker: string) => void
  handleRowTap: (ticker: string) => void
}) {
  const { dict } = useLanguage()
  return (
    <div className="hidden lg:flex flex-col h-full market-pattern">
      <div className="sticky top-0 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-4 h-[64px] flex justify-between items-center">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">
          {dict.watchlist.title}
        </h2>
        <div className="flex items-center gap-2">
          {deletionMode ? (
            <button
              onClick={() => setDeletionMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                         bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10
                         text-text-secondary-light dark:text-text-secondary-dark
                         font-inter font-semibold text-[11px] transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
            >
              <X size={11} /> {dict.watchlist.cancel}
            </button>
          ) : (
            <>
              <button
                onClick={() => setDeletionMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                           bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10
                           text-text-secondary-light dark:text-text-secondary-dark
                           font-inter font-semibold text-[11px] transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
              >
                <Trash2 size={11} /> {dict.watchlist.manage}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                           bg-primary dark:bg-white text-white dark:text-black
                           font-inter font-semibold text-[11px] transition-opacity hover:opacity-90"
              >
                <Plus size={11} /> {dict.watchlist.add}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <div className="p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
                <BarChart2
                  size={22}
                  className="text-primary/30 dark:text-white/30"
                />
              </div>
              <div className="text-center">
                <h3 className="font-outfit font-bold text-[15px] text-text-primary-light dark:text-text-primary-dark">
                  {dict.watchlist.emptyTitle}
                </h3>
                <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {dict.watchlist.emptyDesc}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-primary dark:bg-white text-white dark:text-black
                           font-inter font-semibold text-[12px]"
              >
                <Plus size={12} /> {dict.watchlist.addFirst}
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                    {deletionMode && <th className="w-10 pl-4" />}
                    <th className="w-8 ps-4 py-2.5 text-start font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">
                      #
                    </th>
                    <th className="py-2.5 pe-4 text-start font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">
                      {dict.watchlist.company}
                    </th>
                    <th className="py-2.5 text-center font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">
                      Direction
                    </th>
                    <th className="py-2.5 pe-5 text-end font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">
                      {dict.watchlist.price}
                    </th>
                    <th className="py-2.5 pe-5 text-end font-inter text-[10px] font-bold uppercase tracking-wider text-text-secondary-light/50 dark:text-text-secondary-dark/50">
                      Change
                    </th>

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
      </div>
    </div>
  )
}

function MobileColumnHeaders({ deletionMode }: { deletionMode: boolean }) {
  return (
    <div className="mb-1.5">
      <div
        className="flex items-center px-3 py-2 rounded-[10px] border
                      border-gray-200 dark:border-white/10
                      bg-white/85 dark:bg-white/[0.04]"
      >
        {deletionMode && <div className="w-9 shrink-0" />}
        <div className="flex-[1.5] text-start">
          <span className="font-inter font-semibold text-[10px] text-text-secondary-light dark:text-text-secondary-dark tracking-[0.35px]">
            SYM
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="font-inter font-semibold text-[10px] text-text-secondary-light dark:text-text-secondary-dark tracking-[0.35px]">
            DIRECTION
          </span>
        </div>
        <div className="flex-1 text-end">
          <span className="font-inter font-semibold text-[10px] text-text-secondary-light dark:text-text-secondary-dark tracking-[0.35px]">
            PRICE
          </span>
        </div>
        <div className="flex-1 text-end">
          <span className="font-inter font-semibold text-[10px] text-text-secondary-light dark:text-text-secondary-dark tracking-[0.35px]">
            CHANGE
          </span>
        </div>
      </div>
    </div>
  )
}

function MobileWatchCard({
  item,
  deletionMode,
  onDelete,
  onTap,
}: {
  item: WatchlistItem
  deletionMode: boolean
  onDelete: () => void
  onTap: () => void
}) {
  const [pressed, setPressed] = useState(false)
  const pct = ((item.target1 - item.currentPrice) / item.currentPrice) * 100
  const pctStr = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onTapStart={() => !deletionMode && setPressed(true)}
      onTap={() => {
        setPressed(false)
        !deletionMode && onTap()
      }}
      onTapCancel={() => setPressed(false)}
      className={cn(
        'overflow-hidden rounded-[13px] border transition-all',
        deletionMode
          ? 'border-red-500/40 bg-white dark:bg-[#000000]'
          : 'border-gray-200 dark:border-[#38383A] bg-white dark:bg-[#000000]',
        pressed && 'scale-[0.985]'
      )}
    >
      <div className="flex items-center px-3 py-[10px] gap-0">
        {deletionMode && (
          <motion.button
            initial={{ scale: 0, width: 0 }}
            animate={{ scale: 1, width: 36 }}
            exit={{ scale: 0, width: 0 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="shrink-0 mr-2 w-6 h-6 rounded-full flex items-center justify-center
                       bg-red-500/10 border border-red-500/40 text-red-500"
          >
            <X size={11} />
          </motion.button>
        )}

        <div className="flex-[1.5] flex items-center gap-2 min-w-0 pr-1">
          <MobileCompanyLogo ticker={item.ticker} logoUrl={item.logoUrl} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-semibold text-[10px] text-text-primary-light dark:text-text-primary-dark tracking-[-0.2px]">
                {item.ticker}
              </span>
              {item.hasWarning && (
                <AlertTriangle size={11} className="text-warning shrink-0" />
              )}
            </div>
            <p className="font-inter text-[9.5px] text-text-secondary-light dark:text-text-secondary-dark truncate leading-tight mt-0.5">
              {item.name}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-1 pr-1">
          <span
            className={cn(
              'font-inter font-semibold text-[10px]',
              item.isUp ? 'text-bull' : 'text-bear'
            )}
          >
            {item.isUp ? 'Up' : 'Down'}
          </span>
          {item.isUp ? (
            <TrendingUp size={10} className="text-bull" />
          ) : (
            <TrendingDown size={10} className="text-bear" />
          )}
        </div>

        <div className="flex-1 flex justify-end pr-2">
          <span className="font-inter font-bold text-[11px] text-text-primary-light dark:text-text-primary-dark tabular-nums tracking-[-0.3px]">
            {formatPrice(item.currentPrice)}
          </span>
        </div>

        <div className="flex-1 flex justify-end">
          <div
            className={cn(
              'flex items-center justify-center px-1.5 py-0.5 rounded-[6px] border',
              item.isUp
                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
            )}
          >
            <span className="font-inter font-bold text-[9px] tabular-nums tracking-tight">
              {pctStr}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MobileWatchlist({
  items,
  deletionMode,
  setDeletionMode,
  setShowAddModal,
  handleRemove,
  handleRowTap,
  compact,
}: {
  items: WatchlistItem[]
  deletionMode: boolean
  setDeletionMode: (v: boolean) => void
  setShowAddModal: (v: boolean) => void
  handleRemove: (ticker: string) => void
  handleRowTap: (ticker: string) => void
  compact?: boolean
}) {
  const { dict } = useLanguage()

  return (
    <div
      className={cn(
        'flex flex-col h-full market-pattern',
        compact ? undefined : 'lg:hidden'
      )}
    >
      <div className="sticky top-0 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-4 h-[64px] flex justify-between items-center">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">
          {dict.watchlist.title}
        </h2>
        <div className="flex items-center gap-2">
          {deletionMode ? (
            <button
              onClick={() => setDeletionMode(false)}
              className="flex items-center gap-1 px-3 py-[7px] rounded-[10px] border
                         bg-red-500/8 dark:bg-red-500/12 border-red-500/28 text-red-400
                         font-inter font-semibold text-[10px]"
            >
              <X size={11} /> {dict.watchlist.cancel}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/10"
              >
                <Plus size={13} className="text-primary dark:text-white" />
              </button>
              <button
                onClick={() => setDeletionMode(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/10"
              >
                <Trash2
                  size={12}
                  className="text-text-secondary-light dark:text-text-secondary-dark"
                />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 flex flex-col gap-4">
          <MobileColumnHeaders deletionMode={deletionMode} />

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 px-8">
              <BarChart2
                size={34}
                className="text-primary/22 dark:text-white/22"
              />
              <div className="text-center">
                <p className="font-outfit font-bold text-[15px] text-text-secondary-light dark:text-text-secondary-dark">
                  {dict.watchlist.emptyTitle}
                </p>
                <p className="font-inter font-medium text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-2">
                  {dict.watchlist.addFirst}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <MobileWatchCard
                    key={item.ticker}
                    item={item}
                    deletionMode={deletionMode}
                    onDelete={() => handleRemove(item.ticker)}
                    onTap={() => handleRowTap(item.ticker)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WatchlistPanel({ compact }: { compact?: boolean }) {
  const router = useRouter()
  const [items, setItems] = useState<WatchlistItem[]>(INITIAL_WATCHLIST)
  const [deletionMode, setDeletionMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleRemove = (ticker: string) =>
    setItems((p) => p.filter((i) => i.ticker !== ticker))

  const handleAdd = (item: WatchlistItem) =>
    setItems((p) =>
      p.find((i) => i.ticker === item.ticker) ? p : [...p, item]
    )

  const handleRowTap = (ticker: string) => {
    router.push(`/dashboard?q=Analyze+${ticker}`)
  }

  const sharedProps = {
    items,
    deletionMode,
    setDeletionMode,
    setShowAddModal,
    handleRemove,
    handleRowTap,
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      {!compact && (
        <>
          <DesktopWatchlist {...sharedProps} />
          <MobileWatchlist {...sharedProps} />
        </>
      )}

      {compact && <MobileWatchlist {...sharedProps} compact />}

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
  )
}
