'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Volume2,
  ExternalLink,
  BarChart2,
} from 'lucide-react'
import { cn, formatPrice, formatPct, stockFaviconUrl } from '@/lib/utils'
import { ALL_STOCKS, TICKER_GRADIENTS } from '@/lib/mock-data'
import type { CandleData } from '@/lib/types'

function generateCandles(
  count: number,
  startPrice: number,
  endPrice: number,
  volatility: number
): CandleData[] {
  const candles: CandleData[] = []
  let open = startPrice
  const rng = (seed: number) => Math.abs(Math.sin(seed * 9301 + 49297) % 1)
  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / count
    const target =
      startPrice +
      (endPrice - startPrice) * progress +
      (rng(i * 3) - 0.5) * volatility * startPrice * 2
    const move = (target - open) * 0.6 + (rng(i * 7) - 0.5) * volatility * open
    const close = open + move
    const high = Math.max(open, close) + rng(i * 13) * volatility * open * 0.5
    const low = Math.min(open, close) - rng(i * 17) * volatility * open * 0.5
    candles.push({ open, close, high, low })
    open = close
  }
  return candles
}

function CandlestickChart({
  candles,
  isPositive,
  width = 700,
  height = 220,
}: {
  candles: CandleData[]
  isPositive: boolean
  width?: number
  height?: number
}) {
  const pad = { top: 16, bottom: 16, left: 8, right: 8 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const allValues = candles.flatMap((c) => [c.high, c.low])
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const range = maxVal - minVal || 1
  const toY = (v: number) => pad.top + chartH - ((v - minVal) / range) * chartH
  const candleW = Math.max(2.5, (chartW / candles.length) * 0.55)
  const gap = chartW / candles.length
  const bullColor = '#34C759'
  const bearColor = '#FF453A'
  const linePoints = candles.map(
    (c, i) => `${pad.left + i * gap + gap / 2},${toY(c.close)}`
  )
  const linePath = 'M ' + linePoints.join(' L ')
  const areaPath =
    linePath +
    ` L ${pad.left + (candles.length - 1) * gap + gap / 2},${pad.top + chartH} L ${pad.left + gap / 2},${pad.top + chartH} Z`
  const accentColor = isPositive ? bullColor : bearColor

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Price chart"
      role="img"
    >
      <defs>
        <linearGradient id="areaGradStock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGradStock)" />
      {candles.map((c, i) => {
        const x = pad.left + i * gap + gap / 2
        const isBull = c.close >= c.open
        const color = isBull ? bullColor : bearColor
        const bodyTop = toY(Math.max(c.open, c.close))
        const bodyBot = toY(Math.min(c.open, c.close))
        const bodyH = Math.max(1, bodyBot - bodyTop)
        return (
          <g key={i}>
            <line
              x1={x}
              y1={toY(c.high)}
              x2={x}
              y2={toY(c.low)}
              stroke={color}
              strokeWidth={0.9}
              opacity={0.6}
            />
            <rect
              x={x - candleW / 2}
              y={bodyTop}
              width={candleW}
              height={bodyH}
              fill={color}
              opacity={0.85}
              rx={0.5}
            />
          </g>
        )
      })}
      <path
        d={linePath}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.5}
        opacity={0.5}
      />
    </svg>
  )
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] rounded-xl p-4">
      <span className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark font-semibold uppercase tracking-wide block mb-1">
        {label}
      </span>
      <span
        className={cn(
          'font-outfit font-bold text-[18px] block',
          color ?? 'text-text-primary-light dark:text-text-primary-dark'
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="font-inter text-[11px] text-text-secondary-light/70 dark:text-text-secondary-dark/70">
          {sub}
        </span>
      )}
    </div>
  )
}

const PERIODS = ['Day', 'Week'] as const
type Period = (typeof PERIODS)[number]

export default function StockDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticker = (params?.ticker as string)?.toUpperCase() ?? 'AAPL'
  const [period, setPeriod] = useState<Period>('Day')

  const stock = ALL_STOCKS.find((s) => s.ticker === ticker) ?? ALL_STOCKS[0]

  const candles = useMemo(() => {
    if (period === 'Day')
      return generateCandles(
        48,
        stock.currentPrice * 0.98,
        stock.currentPrice,
        0.004
      )
    return generateCandles(
      45,
      stock.currentPrice * 0.94,
      stock.currentPrice,
      0.012
    )
  }, [period, stock.currentPrice])

  const pctChange = period === 'Day' ? 2.34 : -1.12
  const isPositive = pctChange >= 0
  const high = Math.max(...candles.map((c) => c.high))
  const low = Math.min(...candles.map((c) => c.low))
  const volume = period === 'Day' ? '52.8M' : '312M'

  const insight =
    period === 'Day'
      ? `${ticker} is trading higher today, driven by strong pre-market buying activity and positive analyst commentary. Momentum indicators suggest continued bullish pressure in the short term.`
      : `${ticker} has experienced light selling pressure this week amid broader market uncertainty. Longer-term fundamentals remain solid, with institutional accumulation observed on dips.`

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] font-inter font-semibold
                       text-text-secondary-light dark:text-text-secondary-dark
                       hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        <div className="flex items-start justify-between gap-6 flex-wrap">
          {/* Left: company info */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${(TICKER_GRADIENTS[ticker] ?? ['#7C7C7C', '#3C3C3C'])[0]}, ${(TICKER_GRADIENTS[ticker] ?? ['#7C7C7C', '#3C3C3C'])[1]})`,
              }}
            >
              <img
                src={stockFaviconUrl(ticker.toLowerCase() + '.com')}
                alt={ticker}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-bold text-[24px] text-primary dark:text-white tracking-tight leading-none">
                  {ticker}
                </h1>
                {stock.hasWarning && (
                  <AlertTriangle size={16} className="text-warning" />
                )}
              </div>
              <p className="font-inter text-[14px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                {stock.name}
              </p>
            </div>
          </div>

          {/* Right: price */}
          <div className="flex flex-col items-end">
            <motion.span
              key={period}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-outfit font-bold text-[32px] text-text-primary-light dark:text-text-primary-dark tracking-tight leading-none"
            >
              {formatPrice(stock.currentPrice)}
            </motion.span>
            <div
              className={cn(
                'flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-[13px] font-inter font-bold',
                isPositive ? 'bg-bull/10 text-bull' : 'bg-bear/10 text-bear'
              )}
            >
              {isPositive ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}
              {formatPct(pctChange)}
              <span className="font-normal opacity-70">({period})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
        <div className="max-w-4xl space-y-5">
          {/* Chart card */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-sm overflow-hidden">
            {/* Period tabs */}
            <div className="flex items-center gap-1 px-4 pt-4 pb-2">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-[13px] font-inter font-semibold transition-all',
                    period === p
                      ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white'
                      : 'text-text-secondary-light/60 dark:text-text-secondary-dark/60 hover:text-text-primary-light dark:hover:text-text-primary-dark'
                  )}
                >
                  {p}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark">
                <Volume2 size={13} />
                <span className="font-inter text-[12px] font-semibold">
                  {volume}
                </span>
              </div>
            </div>
            <div className="px-4 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={period}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CandlestickChart
                    candles={candles}
                    isPositive={isPositive}
                    height={220}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Session High" value={formatPrice(high)} />
            <StatCard label="Session Low" value={formatPrice(low)} />
            <StatCard
              label="Target 1"
              value={formatPrice(stock.target1)}
              sub={formatPct(
                ((stock.target1 - stock.currentPrice) / stock.currentPrice) *
                  100
              )}
              color="text-bull"
            />
            <StatCard
              label="Target 2"
              value={formatPrice(stock.target2)}
              sub={formatPct(
                ((stock.target2 - stock.currentPrice) / stock.currentPrice) *
                  100
              )}
              color="text-bull"
            />
          </div>

          {/* AI Insight + CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 bg-white dark:bg-white/[0.03] rounded-2xl border border-primary/10 dark:border-white/[0.08] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                  <Sparkles
                    size={14}
                    className="text-primary dark:text-white"
                  />
                </div>
                <span className="font-outfit font-bold text-[14px] text-primary dark:text-white">
                  Raven AI Insight
                </span>
                <span className="ml-auto font-inter text-[11px] text-text-secondary-light/60 dark:text-text-secondary-dark/60">
                  {period} view
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={period + ticker}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-inter text-[14px] text-text-secondary-light dark:text-text-secondary-dark leading-relaxed"
                >
                  {insight}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(`/dashboard?q=Analyze+${ticker}`)}
                className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
                           bg-primary dark:bg-white text-white dark:text-black
                           border border-primary dark:border-white
                           font-inter font-bold text-[13px] transition-opacity hover:opacity-90"
              >
                <Sparkles size={20} />
                Ask Raven AI
                <span className="font-normal text-[11px] opacity-70">
                  about {ticker}
                </span>
              </button>
              <button
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl
                           bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                           font-inter font-semibold text-[13px] text-text-secondary-light dark:text-text-secondary-dark
                           hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
              >
                <BarChart2 size={14} />
                Full Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
