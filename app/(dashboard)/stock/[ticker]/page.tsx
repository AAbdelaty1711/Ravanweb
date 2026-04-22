"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Volume2,
} from "lucide-react";
import { cn, formatPrice, formatPct, stockFaviconUrl } from "@/lib/utils";
import { ALL_STOCKS, TICKER_GRADIENTS } from "@/lib/mock-data";
import type { CandleData } from "@/lib/types";

// ─── Mock candle generator (mirrors MockStockService) ────────────────────────
function generateCandles(
  count: number,
  startPrice: number,
  endPrice: number,
  volatility: number
): CandleData[] {
  const candles: CandleData[] = [];
  let open = startPrice;
  // seeded-ish deterministic
  const rng = (seed: number) => Math.abs(Math.sin(seed * 9301 + 49297) % 1);

  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / count;
    const target =
      startPrice +
      (endPrice - startPrice) * progress +
      (rng(i * 3) - 0.5) * volatility * startPrice * 2;
    const move = (target - open) * 0.6 + (rng(i * 7) - 0.5) * volatility * open;
    const close = open + move;
    const high = Math.max(open, close) + rng(i * 13) * volatility * open * 0.5;
    const low  = Math.min(open, close) - rng(i * 17) * volatility * open * 0.5;
    candles.push({ open, close, high, low });
    open = close;
  }
  return candles;
}

// ─── SVG Candlestick chart ───────────────────────────────────────────────────
function CandlestickChart({
  candles,
  isPositive,
  width = 600,
  height = 180,
}: {
  candles: CandleData[];
  isPositive: boolean;
  width?: number;
  height?: number;
}) {
  const pad = { top: 12, bottom: 12, left: 4, right: 4 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const allValues = candles.flatMap((c) => [c.high, c.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  const toY = (v: number) =>
    pad.top + chartH - ((v - minVal) / range) * chartH;

  const candleW = Math.max(2, (chartW / candles.length) * 0.6);
  const gap = chartW / candles.length;

  const bullColor = "#34C759";
  const bearColor = "#FF453A";

  // Line chart path (close prices) — for the faint area fill
  const linePoints = candles.map((c, i) => {
    const x = pad.left + i * gap + gap / 2;
    const y = toY(c.close);
    return `${x},${y}`;
  });
  const linePath = "M " + linePoints.join(" L ");
  const areaPath =
    linePath +
    ` L ${pad.left + (candles.length - 1) * gap + gap / 2},${pad.top + chartH}` +
    ` L ${pad.left + gap / 2},${pad.top + chartH} Z`;

  const accentColor = isPositive ? bullColor : bearColor;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Price chart"
      role="img"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Candles */}
      {candles.map((c, i) => {
        const x = pad.left + i * gap + gap / 2;
        const isBull = c.close >= c.open;
        const color = isBull ? bullColor : bearColor;
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyBot = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(1, bodyBot - bodyTop);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x} y1={toY(c.high)}
              x2={x} y2={toY(c.low)}
              stroke={color}
              strokeWidth={0.8}
              opacity={0.7}
            />
            {/* Body */}
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
        );
      })}

      {/* Line overlay */}
      <path
        d={linePath}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.2}
        opacity={0.4}
      />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-[12px]
                    bg-black/[0.025] dark:bg-white/[0.04]
                    border border-gray-200/50 dark:border-white/[0.06]">
      <span className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark font-medium">
        {label}
      </span>
      <span className="font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark">
        {value}
      </span>
      {sub && (
        <span className="font-inter text-[10px] text-text-secondary-light/70 dark:text-text-secondary-dark/70">
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Period selector ──────────────────────────────────────────────────────────
function PeriodBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-1.5 rounded-[8px] font-inter font-semibold text-[12px]",
        "transition-all duration-200",
        active
          ? "text-primary-DEFAULT dark:text-white"
          : "text-text-secondary-light/60 dark:text-text-secondary-dark/60 hover:text-text-primary-light dark:hover:text-text-primary-dark"
      )}
    >
      {active && (
        <motion.div
          layoutId="period-indicator"
          className="absolute inset-0 rounded-[8px] bg-primary-DEFAULT/8 dark:bg-white/10"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

// ─── Company logo ─────────────────────────────────────────────────────────────
function TickerLogo({ ticker, size = 48 }: { ticker: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const grad = TICKER_GRADIENTS[ticker] ?? ["#7C7C7C", "#3C3C3C"];
  const url = stockFaviconUrl(ticker.toLowerCase() + ".com");

  return (
    <div
      className="rounded-avatar overflow-hidden border border-white/10 shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
      }}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={ticker}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="font-outfit font-bold text-white"
            style={{ fontSize: size * 0.38 }}
          >
            {ticker[0]}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const PERIODS = ["Day", "Week"] as const;
type Period = (typeof PERIODS)[number];

export default function StockDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticker = (params?.ticker as string)?.toUpperCase() ?? "AAPL";
  const [period, setPeriod] = useState<Period>("Day");

  // Find stock info
  const stock = ALL_STOCKS.find((s) => s.ticker === ticker) ?? ALL_STOCKS[0];

  // Generate mock candles deterministically per period
  const candles = useMemo(() => {
    if (period === "Day") {
      return generateCandles(48, stock.currentPrice * 0.98, stock.currentPrice, 0.004);
    }
    return generateCandles(45, stock.currentPrice * 0.94, stock.currentPrice, 0.012);
  }, [period, stock.currentPrice]);

  const pctChange = period === "Day" ? 2.34 : -1.12;
  const isPositive = pctChange >= 0;
  const high = Math.max(...candles.map((c) => c.high));
  const low  = Math.min(...candles.map((c) => c.low));
  const volume = period === "Day" ? "52.8M" : "312M";

  const insight =
    period === "Day"
      ? `${ticker} is trading higher today, driven by strong pre-market buying activity and positive analyst commentary. Momentum indicators suggest continued bullish pressure in the short term.`
      : `${ticker} has experienced light selling pressure this week amid broader market uncertainty. Longer-term fundamentals remain solid, with institutional accumulation observed on dips.`;

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border-light dark:border-[#141414] shrink-0">
        <button
          onClick={() => router.back()}
          className="raven-icon-btn"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-primary-DEFAULT dark:text-white" />
        </button>
        <TickerLogo ticker={ticker} size={38} />
        <div className="flex-1 min-w-0">
          <h1 className="font-outfit font-bold text-[18px] text-primary-DEFAULT dark:text-white tracking-tight leading-none">
            {ticker}
          </h1>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5 truncate">
            {stock.name}
          </p>
        </div>
        {stock.hasWarning && (
          <AlertTriangle size={18} className="text-warning shrink-0" />
        )}
      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 min-h-0">

        {/* ── Price + change ──────────────────────────────────────────── */}
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-5 pb-3"
        >
          <div className="flex items-end gap-3">
            <span className="font-outfit font-bold text-[32px] text-text-primary-light dark:text-text-primary-dark tracking-tight leading-none">
              {formatPrice(stock.currentPrice)}
            </span>
            <div
              className={cn(
                "flex items-center gap-1 mb-1",
                isPositive ? "text-bull" : "text-bear"
              )}
            >
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-inter font-bold text-[14px]">
                {formatPct(pctChange)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Period selector ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1 mb-4">
          {PERIODS.map((p) => (
            <PeriodBtn
              key={p}
              label={p}
              active={period === p}
              onClick={() => setPeriod(p)}
            />
          ))}
        </div>

        {/* ── Candlestick chart ────────────────────────────────────────── */}
        <div className="rounded-card border border-border-light dark:border-[#38383A]
                        bg-card-light dark:bg-card-dark p-3 mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CandlestickChart candles={candles} isPositive={isPositive} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Stats grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <StatCard label="High" value={formatPrice(high)} />
          <StatCard label="Low"  value={formatPrice(low)} />
          <StatCard
            label="Target 1"
            value={formatPrice(stock.target1)}
            sub={formatPct(((stock.target1 - stock.currentPrice) / stock.currentPrice) * 100)}
          />
          <StatCard
            label="Target 2"
            value={formatPrice(stock.target2)}
            sub={formatPct(((stock.target2 - stock.currentPrice) / stock.currentPrice) * 100)}
          />
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mb-5 px-1">
          <Volume2 size={13} className="text-text-secondary-light dark:text-text-secondary-dark" />
          <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
            Volume
          </span>
          <span className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark">
            {volume}
          </span>
        </div>

        {/* ── AI Insight card ──────────────────────────────────────────── */}
        <div className="rounded-card border border-primary-DEFAULT/12 dark:border-white/10
                        bg-primary-DEFAULT/[0.03] dark:bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles size={14} className="text-primary-DEFAULT dark:text-white" />
            <span className="font-outfit font-bold text-[13px] text-primary-DEFAULT dark:text-white">
              Raven AI Insight
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={period + ticker}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark leading-[1.55]"
            >
              {insight}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── Ask AI button ────────────────────────────────────────────── */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/?q=Analyze+${ticker}`)}
          className="w-full mt-4 h-[48px] rounded-[14px] flex items-center justify-center gap-2
                     bg-primary-DEFAULT dark:bg-white
                     text-white dark:text-primary-DEFAULT
                     font-inter font-bold text-[13px]
                     transition-opacity hover:opacity-90"
        >
          <Sparkles size={15} />
          Ask Raven AI about {ticker}
        </motion.button>
      </div>
    </div>
  );
}
