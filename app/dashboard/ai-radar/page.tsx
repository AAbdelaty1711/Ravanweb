'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TagPill } from '@/components/ui/TagPill'
import {
  History,
  Bell,
  BellRing,
  Sparkles,
  Zap,
  Menu,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Filter,
  Clock,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/SidebarContext'
import { RADAR_ITEMS } from '@/lib/mock-data'
import type { RadarAnomaly, RadarAction } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── Action config (shared) ───────────────────────────────────────────────────
const ACTION_CONFIG: Record<
  RadarAction | 'closed',
  {
    label: string
    color: string
    bg: string
    border: string
    strip: string
    badge: string
  }
> = {
  buy: {
    label: 'BUY',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/25',
    strip: 'bg-green-500',
    badge: 'bg-green-500',
  },
  watch: {
    label: 'WATCH',
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-400/10',
    border: 'border-slate-200 dark:border-slate-400/20',
    strip: 'bg-slate-400',
    badge: 'bg-slate-400',
  },
  avoid: {
    label: 'AVOID',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/25',
    strip: 'bg-red-500',
    badge: 'bg-red-500',
  },
  closed: {
    label: 'CLOSED',
    color: 'text-gray-400 dark:text-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-400/10',
    border: 'border-gray-200 dark:border-gray-400/20',
    strip: 'bg-gray-300 dark:bg-gray-600',
    badge: 'bg-gray-400',
  },
}

// ─── Shared state types ───────────────────────────────────────────────────────
interface RadarPageState {
  actionFilter: string
  setActionFilter: (v: string) => void
  showingHistory: boolean
  setShowingHistory: (v: boolean) => void
  historyFilter: string
  setHistoryFilter: (v: string) => void
  timeFilter: string
  setTimeFilter: (v: string) => void
  notifiedTickers: Set<string>
  toggleBell: (ticker: string) => void
  filtered: RadarAnomaly[]
  router: ReturnType<typeof useRouter>
}

// ─── DESKTOP: Premium widget card ────────────────────────────────────────────
function DesktopRadarCard({
  anomaly,
  bellActive,
  onBellToggle,
  router,
}: {
  anomaly: RadarAnomaly
  bellActive: boolean
  onBellToggle: () => void
  router: ReturnType<typeof useRouter>
}) {
  const cfgKey = anomaly.isClosed ? 'closed' : anomaly.action
  const cfg = ACTION_CONFIG[cfgKey]
  const returnPositive = anomaly.maxReturn > 0
  const returnStr = `${returnPositive ? '+' : ''}${anomaly.maxReturn}%`
  const { dict } = useLanguage()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className={cn(
        'group relative bg-white dark:bg-white/[0.03] rounded-2xl border overflow-hidden',
        'shadow-sm hover:shadow-md dark:shadow-none',
        'transition-all duration-200 hover:-translate-y-0.5',
        anomaly.isClosed
          ? 'border-gray-100 dark:border-white/[0.04] opacity-70'
          : 'border-gray-200 dark:border-white/[0.06]'
      )}
    >
      {/* Top color strip */}
      <div className={cn('h-[3px] w-full', cfg.strip)} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={anomaly.logoUrl}
              alt={anomaly.ticker}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>

          {/* Ticker / name / badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-outfit font-bold text-[15px] text-text-primary-light dark:text-text-primary-dark">
                {anomaly.ticker}
              </span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[9px] font-inter font-bold border',
                  cfg.color,
                  cfg.bg,
                  cfg.border
                )}
              >
                {cfg.label}
              </span>
            </div>
            <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark truncate">
              {anomaly.name}
            </p>
          </div>

          {/* Bell + time */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {!anomaly.isClosed && (
              <button
                onClick={onBellToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                {bellActive ? (
                  <BellRing size={14} className="text-amber-500" />
                ) : (
                  <Bell
                    size={14}
                    className="text-text-secondary-light/35 dark:text-text-secondary-dark/35"
                  />
                )}
              </button>
            )}
            <span className="font-inter text-[10px] text-text-secondary-light/55 dark:text-text-secondary-dark/55">
              {anomaly.timeAgo.replace('Closed', '').replace('ago', '').trim()}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
          <div className="flex-1 text-center border-e border-gray-200 dark:border-white/[0.06] pe-2">
            <p className="font-inter text-[9px] text-text-secondary-light/55 dark:text-text-secondary-dark/55 font-bold uppercase tracking-wide mb-0.5">
              {dict.radar.entry}
            </p>
            <p className="font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
              ${anomaly.entryPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex-1 text-center ps-2">
            <p className="font-inter text-[9px] text-text-secondary-light/55 dark:text-text-secondary-dark/55 font-bold uppercase tracking-wide mb-0.5">
              {dict.radar.maxReturn}
            </p>
            <p
              className={cn(
                'font-inter font-bold text-[13px] tabular-nums',
                returnPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {returnStr}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {anomaly.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        {/* Ask AI button */}
        <button
          onClick={() =>
            router.push(
              `/dashboard?q=What+is+your+AI+outlook+on+${anomaly.ticker}+based+on+signals:+${anomaly.tags.join(',+')}`
            )
          }
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                     bg-primary/[0.07] dark:bg-white/[0.07]
                     border border-primary/20 dark:border-white/20
                     text-primary dark:text-white
                     font-inter font-bold text-[11px]
                     transition-all hover:bg-primary/12 dark:hover:bg-white/12
                     group-hover:border-primary/30 dark:group-hover:border-white/30"
        >
          <Sparkles size={12} />
          {dict.watchlist.askAi}
        </button>
      </div>
    </motion.div>
  )
}

// ─── DESKTOP layout ───────────────────────────────────────────────────────────
function DesktopAiRadar({ state }: { state: RadarPageState }) {
  const { dict, isRTL } = useLanguage()
  const {
    actionFilter,
    setActionFilter,
    showingHistory,
    setShowingHistory,
    historyFilter,
    setHistoryFilter,
    timeFilter,
    setTimeFilter,
    notifiedTickers,
    toggleBell,
    filtered,
    router,
  } = state

  const activeFilters = showingHistory
    ? [
        { key: '7 Days', label: dict.radar['7Days'] },
        { key: '14 Days', label: dict.radar['14Days'] },
        { key: '30 Days', label: dict.radar['30Days'] },
      ]
    : [
        { key: 'All', label: dict.radar.all },
        { key: 'Buy', label: dict.radar.buy },
        { key: 'Watch', label: dict.radar.watch },
        { key: 'Avoid', label: dict.radar.avoid },
      ]
  const currentFilter = showingHistory ? historyFilter : actionFilter
  const setCurrentFilter = showingHistory ? setHistoryFilter : setActionFilter
  const timeFilters = [
    { key: 'All Time', label: dict.radar.allTime },
    { key: '24h', label: dict.radar['24h'] },
    { key: '3 Days', label: dict.radar['3Days'] },
    { key: '7 Days', label: dict.radar['7Days'] },
  ]

  const buyCnt = RADAR_ITEMS.filter(
    (i) => !i.isClosed && i.action === 'buy'
  ).length
  const watchCnt = RADAR_ITEMS.filter(
    (i) => !i.isClosed && i.action === 'watch'
  ).length
  const avoidCnt = RADAR_ITEMS.filter(
    (i) => !i.isClosed && i.action === 'avoid'
  ).length

  return (
    <div className="hidden lg:flex flex-col h-full market-pattern">
      {/* ── Desktop header ─────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-outfit font-bold text-[24px] text-primary dark:text-white tracking-tight leading-none">
                {dict.radar.title}
              </h1>
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-inter font-semibold text-[10px] text-green-600 dark:text-green-400">
                  {dict.radar.live}
                </span>
              </div>
            </div>
            <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark">
              {filtered.length} {dict.radar.subtitle}
            </p>
          </div>

          <button
            onClick={() => setShowingHistory(!showingHistory)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl border font-inter font-semibold text-[12px] transition-all shrink-0',
              isRTL && 'flex-row-reverse',
              showingHistory
                ? 'bg-primary/10 dark:bg-white/10 border-primary/25 dark:border-white/20 text-primary dark:text-white'
                : 'bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.07]'
            )}
          >
            <History size={14} />{' '}
            {showingHistory ? dict.radar.liveSignals : dict.radar.history}
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter
              size={12}
              className="text-text-secondary-light/50 dark:text-text-secondary-dark/50"
            />
            {activeFilters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCurrentFilter(key)}
                className={cn(
                  'px-3 py-1 rounded-xl text-[12px] font-inter font-semibold border transition-all',
                  currentFilter === key
                    ? 'bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white'
                    : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.07]'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {!showingHistory && (
            <>
              <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Clock
                  size={12}
                  className="text-text-secondary-light/50 dark:text-text-secondary-dark/50"
                />
                {timeFilters.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTimeFilter(key)}
                    className={cn(
                      'px-3 py-1 rounded-xl text-[11px] font-inter font-semibold border transition-all',
                      timeFilter === key
                        ? 'bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white'
                        : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-text-secondary-light/70 dark:text-text-secondary-dark/70 hover:bg-gray-50 dark:hover:bg-white/[0.07]'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
              <Zap size={26} className="text-primary/30 dark:text-white/30" />
            </div>
            <div className="text-center">
              <h3 className="font-outfit font-bold text-[18px] text-text-primary-light dark:text-text-primary-dark">
                {dict.radar.noSignals}
              </h3>
              <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {dict.radar.noSignalsDesc}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((anomaly) => (
                <DesktopRadarCard
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
  )
}

// ─── MOBILE: Expandable card (Flutter exact clone) ────────────────────────────
function MobileExpandableCard({
  anomaly,
  bellActive,
  onBellToggle,
  router,
}: {
  anomaly: RadarAnomaly
  bellActive: boolean
  onBellToggle: () => void
  router: ReturnType<typeof useRouter>
}) {
  const [expanded, setExpanded] = useState(false)
  const cfgKey = anomaly.isClosed ? 'closed' : anomaly.action
  const cfg = ACTION_CONFIG[cfgKey]
  const returnPositive = anomaly.maxReturn > 0
  const returnStr = `${returnPositive ? '+' : ''}${anomaly.maxReturn}%`
  const returnColor = returnPositive ? 'text-green-500' : 'text-red-500'
  const { dict } = useLanguage()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setExpanded((p) => !p)}
      className={cn(
        'relative overflow-hidden rounded-[16px] border cursor-pointer transition-colors',
        anomaly.isClosed
          ? 'bg-white/70 dark:bg-[#000000]/70 border-gray-200 dark:border-[#38383A]'
          : 'bg-white dark:bg-[#000000] border-gray-200 dark:border-[#38383A]'
      )}
    >
      {/* Left colored strip — Flutter exact */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1', cfg.strip)} />

      <div className="pl-4 pr-2 pt-[10px] pb-[10px]">
        {/* Header: Logo / Ticker / Name / Bell / Chevron */}
        <div className="flex items-center gap-2.5 mb-2.5">
          {/* Logo — circular, Flutter exact */}
          <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={anomaly.logoUrl}
              alt={anomaly.ticker}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.style.display = 'none'
                const parent = el.parentElement
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="font-outfit font-bold text-[11px]" style="color:${anomaly.action === 'buy' ? '#22c55e' : anomaly.action === 'avoid' ? '#ef4444' : '#64748b'}">${anomaly.ticker[0]}</span></div>`
                }
              }}
            />
          </div>

          {/* Names */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-bold text-[12px] text-text-primary-light dark:text-text-primary-dark tracking-[-0.2px]">
                {anomaly.ticker}
              </span>
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[8px] font-inter font-bold border',
                  cfg.color,
                  cfg.bg,
                  cfg.border
                )}
              >
                {cfg.label}
              </span>
            </div>
            <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate leading-tight mt-0.5">
              {anomaly.name}
            </p>
          </div>

          {/* Bell (active signals only) */}
          {!anomaly.isClosed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBellToggle()
              }}
              className="p-2.5 -my-1"
            >
              {bellActive ? (
                <BellRing size={15} className="text-amber-500" />
              ) : (
                <Bell
                  size={15}
                  className="text-text-secondary-light/35 dark:text-text-secondary-dark/35"
                />
              )}
            </button>
          )}

          {/* Expand chevron */}
          <div className="pr-1">
            {expanded ? (
              <ChevronUp
                size={15}
                className="text-text-secondary-light dark:text-text-secondary-dark"
              />
            ) : (
              <ChevronDown
                size={15}
                className="text-text-secondary-light dark:text-text-secondary-dark"
              />
            )}
          </div>
        </div>

        {/* Financial data row — always visible */}
        <div className="flex items-start justify-between gap-2">
          {/* Time */}
          <div>
            <p className="font-inter text-[8.5px] text-text-secondary-light dark:text-text-secondary-dark font-medium mb-0.5">
              {anomaly.isClosed ? 'Time Closed' : 'Time'}
            </p>
            <p className="font-inter font-bold text-[10.5px] text-text-primary-light dark:text-text-primary-dark">
              {anomaly.timeAgo.replace('Closed ', '').trim()}
            </p>
          </div>
          {/* Entry */}
          <div>
            <p className="font-inter text-[8.5px] text-text-secondary-light dark:text-text-secondary-dark font-medium mb-0.5">
              {dict.radar.entry}
            </p>
            <p className="font-inter font-bold text-[10.5px] text-text-primary-light dark:text-text-primary-dark tabular-nums">
              ${anomaly.entryPrice.toFixed(2)}
            </p>
          </div>
          {/* Max Return */}
          <div>
            <p className="font-inter text-[8.5px] text-text-secondary-light dark:text-text-secondary-dark font-medium mb-0.5">
              {dict.radar.maxReturn}
            </p>
            <p
              className={cn(
                'font-inter font-bold text-[10.5px] tabular-nums',
                returnColor
              )}
            >
              {returnStr}
            </p>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {anomaly.tags.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>

              {/* Ask Raven AI button — full width */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(
                    `/dashboard?q=What+is+your+AI+outlook+on+${anomaly.ticker}+(${cfg.label})+based+on+signals:+${anomaly.tags.join(',+')}`
                  )
                }}
                className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 rounded-[10px]
                           bg-primary/[0.07] dark:bg-white/[0.07]
                           border border-primary/25 dark:border-white/25
                           text-primary dark:text-white
                           font-inter font-bold text-[10.5px]
                           transition-colors hover:bg-primary/12 dark:hover:bg-white/12"
              >
                <Sparkles size={13} />
                {dict.watchlist.askAi}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── MOBILE: Filter chip (Flutter _FilterChip exact) ─────────────────────────
function MobileFilterChip({
  label,
  isSelected,
  onTap,
}: {
  label: string
  isSelected: boolean
  onTap: () => void
}) {
  return (
    <button
      onClick={onTap}
      className={cn(
        'shrink-0 px-3 py-[5px] rounded-[10px] font-inter font-semibold text-[10.5px] transition-colors',
        isSelected
          ? 'bg-primary/12 dark:bg-white/12 text-primary dark:text-white'
          : 'bg-gray-200 dark:bg-gray-800 text-text-primary-light/65 dark:text-text-primary-dark/75'
      )}
    >
      {label}
    </button>
  )
}

// ─── MOBILE layout ────────────────────────────────────────────────────────────
function MobileAiRadar({ state }: { state: RadarPageState }) {
  const { setMobileOpen } = useSidebar()
  const { dict } = useLanguage()
  const {
    actionFilter,
    setActionFilter,
    showingHistory,
    setShowingHistory,
    historyFilter,
    setHistoryFilter,
    timeFilter,
    setTimeFilter,
    notifiedTickers,
    toggleBell,
    filtered,
    router,
  } = state

  const activeFilters = showingHistory
    ? [
        { key: '7 Days', label: dict.radar['7Days'] },
        { key: '14 Days', label: dict.radar['14Days'] },
        { key: '30 Days', label: dict.radar['30Days'] },
      ]
    : [
        { key: 'All', label: dict.radar.all },
        { key: 'Buy', label: dict.radar.buy },
        { key: 'Watch', label: dict.radar.watch },
        { key: 'Avoid', label: dict.radar.avoid },
      ]
  const currentFilter = showingHistory ? historyFilter : actionFilter
  const setCurrentFilter = showingHistory ? setHistoryFilter : setActionFilter
  const timeFilters = [
    { key: 'All Time', label: dict.radar.allTime },
    { key: '24h', label: dict.radar['24h'] },
    { key: '3 Days', label: dict.radar['3Days'] },
    { key: '7 Days', label: dict.radar['7Days'] },
  ]

  return (
    <div className="lg:hidden flex flex-col h-full market-pattern">
      {/* Header — Flutter exact */}
      <div className="shrink-0">
        <div className="flex items-center px-4 pt-[14px] pb-1 gap-3">
          {/* Menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 shrink-0"
          >
            <Menu size={14} className="text-primary dark:text-white" />
          </button>

          {/* Title */}
          <h1 className="flex-1 font-outfit font-bold text-[15px] text-primary dark:text-white tracking-[-0.4px] leading-tight">
            Raven Radar
            <span className="block font-inter text-[10px] font-medium text-text-secondary-light dark:text-text-secondary-dark tracking-normal">
              AI Radar
            </span>
          </h1>

          {/* History toggle */}
          <button
            onClick={() => setShowingHistory(!showingHistory)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-[8px] border transition-all',
              showingHistory
                ? 'bg-primary/12 dark:bg-white/12 border-primary/30 dark:border-white/30 text-primary dark:text-white'
                : 'bg-white dark:bg-white/[0.06] border-gray-200 dark:border-white/10 text-text-secondary-light dark:text-text-secondary-dark'
            )}
          >
            <History size={12} />
            <span className="font-inter font-semibold text-[10px]">
              {showingHistory ? dict.radar.history : dict.radar.liveSignals}
            </span>
          </button>
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-0 px-4 pt-2.5 pb-1.5">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              {activeFilters.map(({ key, label }) => (
                <MobileFilterChip
                  key={key}
                  label={label}
                  isSelected={currentFilter === key}
                  onTap={() => setCurrentFilter(key)}
                />
              ))}
            </div>
          </div>

          {/* Time filter (radar only) — Flutter "Filter" button */}
          {!showingHistory && (
            <div className="flex items-center gap-1.5 pl-2 ml-2 border-l border-gray-200 dark:border-white/12 shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {timeFilters.map(({ key, label }) => (
                  <MobileFilterChip
                    key={key}
                    label={label}
                    isSelected={timeFilter === key}
                    onTap={() => setTimeFilter(key)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto px-4 pt-1 pb-8 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark">
              {dict.radar.noSignals}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((anomaly) => (
                <MobileExpandableCard
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
  )
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
export default function AIRadarPage() {
  const router = useRouter()

  // ── Shared state ──────────────────────────────────────────────────────────
  const [actionFilter, setActionFilter] = useState('All')
  const [showingHistory, setShowingHistory] = useState(false)
  const [historyFilter, setHistoryFilter] = useState('30 Days')
  const [timeFilter, setTimeFilter] = useState('All Time')
  const [notifiedTickers, setNotifiedTickers] = useState<Set<string>>(new Set())

  const toggleBell = (ticker: string) => {
    setNotifiedTickers((prev) => {
      const next = new Set(prev)
      next.has(ticker) ? next.delete(ticker) : next.add(ticker)
      return next
    })
  }

  // ── Shared filter logic ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const now = new Date()

    if (showingHistory) {
      return RADAR_ITEMS.filter((i) => {
        if (!i.isClosed) return false
        const days = (now.getTime() - i.timestamp.getTime()) / 86400000
        if (historyFilter === '7 Days') return days <= 7
        if (historyFilter === '14 Days') return days <= 14
        return days <= 30
      })
    }

    return RADAR_ITEMS.filter((i) => {
      if (i.isClosed) return false
      if (
        actionFilter &&
        actionFilter !== 'All' &&
        i.action !== actionFilter.toLowerCase()
      )
        return false
      if (timeFilter && timeFilter !== 'All Time') {
        const hrs = (now.getTime() - i.timestamp.getTime()) / 3600000
        if (timeFilter === '24h') return hrs <= 24
        if (timeFilter === '3 Days') return hrs <= 72
        if (timeFilter === '7 Days') return hrs <= 168
        return false // If it's not All Time and doesn't match any period, filter it out
      }
      return true
    })
  }, [showingHistory, actionFilter, timeFilter, historyFilter])

  // ── Shared state object passed to both layouts ────────────────────────────
  const sharedState: RadarPageState = {
    actionFilter,
    setActionFilter,
    showingHistory,
    setShowingHistory,
    historyFilter,
    setHistoryFilter,
    timeFilter,
    setTimeFilter,
    notifiedTickers,
    toggleBell,
    filtered,
    router,
  }

  return (
    <div className="h-full">
      {/* Desktop SaaS grid layout */}
      <DesktopAiRadar state={sharedState} />
      {/* Mobile Flutter clone */}
      <MobileAiRadar state={sharedState} />
    </div>
  )
}
