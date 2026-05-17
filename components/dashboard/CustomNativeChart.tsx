'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  createChart,
  ColorType,
  CrosshairMode,
} from 'lightweight-charts-line-tools'
import {
  SMA,
  EMA,
  BollingerBands,
  WMA,
  IchimokuCloud,
  PSAR,
  VWAP,
  WEMA,
  RSI,
  MACD,
  Stochastic,
  CCI,
  ADX,
  ATR,
  ROC,
  MFI,
  StochasticRSI,
  AwesomeOscillator,
  WilliamsR,
  OBV,
  TRIX,
  KST,
} from 'technicalindicators'
import {
  ChevronDown,
  Search,
  X,
  Menu,
  MessageSquare,
  Activity,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  MousePointer2,
  Minus,
  TrendingUp,
  Baseline,
  Trash2,
  Square,
  SeparatorVertical,
  ArrowUpRight,
  ArrowRight,
  Circle,
  Triangle,
  PenTool,
  Type,
  Ruler,
  BarChart2,
  ArrowRightToLine,
  Crosshair,
  Highlighter,
} from 'lucide-react'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── User popover ─────────────────────────────────────────────────────────────
function UserPopover({
  onClose,
  triggerRef,
}: {
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const router = useRouter()
  const { dict } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  const items = [
    {
      icon: User,
      label: dict.sidebar.profile,
      action: () => {
        router.push('/dashboard/profile')
        onClose()
      },
    },
    {
      icon: Settings,
      label: dict.sidebar.settings,
      action: () => {
        router.push('/dashboard/profile')
        onClose()
      },
    },
    { icon: CreditCard, label: dict.sidebar.upgrade, action: onClose },
    { icon: HelpCircle, label: dict.sidebar.help, action: onClose },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'absolute top-full left-0 mt-2 z-50',
        'bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl',
        'border border-gray-200 dark:border-white/10',
        'overflow-hidden w-52'
      )}
    >
      <div className="px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/12 dark:bg-white/12 flex items-center justify-center shrink-0">
            <span className="font-outfit font-bold text-[12px] text-primary dark:text-white">
              AA
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark truncate">
              Ahmed Abdelaty
            </p>
            <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate">
              Free Plan
            </p>
          </div>
        </div>
      </div>
      <div className="py-1">
        {items.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-start hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            <Icon
              size={12}
              className="text-text-secondary-light dark:text-text-secondary-dark shrink-0"
            />
            <span className="font-inter text-[12px] text-text-primary-light dark:text-text-primary-dark">
              {label}
            </span>
          </button>
        ))}
      </div>
      <div className="border-t border-gray-100 dark:border-white/[0.06] py-1">
        <button
          onClick={() => {
            document.cookie =
              'raven_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            router.push('/')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-start hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={12} className="text-red-500 shrink-0" />
          <span className="font-inter text-[12px] text-red-500">
            {dict.sidebar.logout}
          </span>
        </button>
      </div>
    </motion.div>
  )
}
import { useTheme } from 'next-themes'
import { useSidebar } from '@/components/SidebarContext'

export default function CustomNativeChart({
  onOpenChat,
}: {
  onOpenChat?: () => void
}) {
  const { mobileOpen, setMobileOpen } = useSidebar()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<any>(null)
  const overlaySeriesRefs = useRef<{ [key: string]: any }>({})
  const historicalDataRef = useRef<any[]>([])

  const syncSource = useRef<string | null>(null);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null)
  const rsiChartRef = useRef<any>(null)
  const macdContainerRef = useRef<HTMLDivElement>(null)
  const macdChartRef = useRef<any>(null)
  const stochContainerRef = useRef<HTMLDivElement>(null)
  const stochChartRef = useRef<any>(null)
  const cciContainerRef = useRef<HTMLDivElement>(null);
  const cciChartRef = useRef<any>(null);
  const adxContainerRef = useRef<HTMLDivElement>(null);
  const adxChartRef = useRef<any>(null);
  const atrContainerRef = useRef<HTMLDivElement>(null);
  const atrChartRef = useRef<any>(null);
  const rocContainerRef = useRef<HTMLDivElement>(null);
  const rocChartRef = useRef<any>(null);
  const mfiContainerRef = useRef<HTMLDivElement>(null);
  const mfiChartRef = useRef<any>(null);
  const stochRsiContainerRef = useRef<HTMLDivElement>(null); const stochRsiChartRef = useRef<any>(null);
  const aoContainerRef = useRef<HTMLDivElement>(null); const aoChartRef = useRef<any>(null);
  const willRContainerRef = useRef<HTMLDivElement>(null); const willRChartRef = useRef<any>(null);
  const obvContainerRef = useRef<HTMLDivElement>(null); const obvChartRef = useRef<any>(null);
  const trixContainerRef = useRef<HTMLDivElement>(null); const trixChartRef = useRef<any>(null);
  const kstContainerRef = useRef<HTMLDivElement>(null); const kstChartRef = useRef<any>(null);

  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false)
  const [indicatorSearch, setIndicatorSearch] = useState('')
  const [activeOverlays, setActiveOverlays] = useState({
    SMA: false,
    EMA: false,
    BB: false,
    WMA: false,
    Ichimoku: false,
    PSAR: false,
    VWAP: false,
    WEMA: false,
  })
  const [activeOscillators, setActiveOscillators] = useState({
    RSI: false,
    MACD: false,
    Stochastic: false,
    CCI: false,
    ADX: false,
    ATR: false,
    ROC: false,
    MFI: false,
    StochRSI: false,
    AO: false,
    WilliamsR: false,
    OBV: false,
    TRIX: false,
    KST: false,
  })
  const [dataLoaded, setDataLoaded] = useState(0)
  const { resolvedTheme } = useTheme()
  const [hoverData, setHoverData] = useState<{
    time: string
    open: number
    high: number
    low: number
    close: number
  } | null>(null)

  const [activeTool, setActiveTool] = useState('cursor')

  const [showUserPopover, setShowUserPopover] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const TIME_INTERVALS = [
    {
      label: 'MINUTES',
      items: [
        { short: '1m', full: '1 minute' },
        { short: '2m', full: '2 minutes' },
        { short: '3m', full: '3 minutes' },
        { short: '5m', full: '5 minutes' },
        { short: '10m', full: '10 minutes' },
        { short: '15m', full: '15 minutes' },
        { short: '30m', full: '30 minutes' },
        { short: '45m', full: '45 minutes' },
      ],
    },
    {
      label: 'HOURS',
      items: [
        { short: '1H', full: '1 hour' },
        { short: '2H', full: '2 hours' },
        { short: '3H', full: '3 hours' },
        { short: '4H', full: '4 hours' },
      ],
    },
    {
      label: 'DAYS',
      items: [
        { short: '1D', full: '1 day' },
        { short: '1W', full: '1 week' },
        { short: '1M', full: '1 month' },
        { short: '3M', full: '3 months' },
        { short: '6M', full: '6 months' },
        { short: '1Y', full: '12 months' },
      ],
    },
  ]

  const [selectedInterval, setSelectedInterval] = useState('1D')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const MOCK_SYMBOLS = [
    {
      symbol: 'XAUUSD',
      name: 'Gold Spot / U.S. Dollar',
      type: 'Forex',
      exchange: 'OANDA',
    },
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', exchange: 'NASDAQ' },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      type: 'Stock',
      exchange: 'NASDAQ',
    },
    {
      symbol: 'BTCUSD',
      name: 'Bitcoin / U.S. Dollar',
      type: 'Crypto',
      exchange: 'BINANCE',
    },
    {
      symbol: 'EURUSD',
      name: 'Euro / U.S. Dollar',
      type: 'Forex',
      exchange: 'FXCM',
    },
    { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Stock', exchange: 'NASDAQ' },
  ]

  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const filteredSymbols = MOCK_SYMBOLS.filter(
    (s) =>
      (activeTab === 'All' || s.type === activeTab) &&
      (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  useEffect(() => {
    if (!chartContainerRef.current) return

    const isDark = resolvedTheme === 'dark'
    const textColor = isDark ? '#9ca3af' : '#4b5563'
    const gridColor = isDark ? '#2e3340' : '#e5e7eb'

    // Initialize the raw chart engine
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor, visible: true },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        borderColor: gridColor,
      },
      rightPriceScale: {
        borderColor: gridColor,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    })

    chartInstanceRef.current = chart

    // Add Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Strict mapper to prevent API crashes
    const getBinanceSymbol = (sym: string) => {
      // Only append 'T' for specific supported crypto pairs we know exist on Binance
      const supportedCrypto = [
        'BTCUSD',
        'ETHUSD',
        'SOLUSD',
        'BNBUSD',
        'ADAUSD',
        'XRPUSD',
      ]
      if (supportedCrypto.includes(sym)) return sym + 'T'

      // If it's literally BTCUSDT already, return it
      if (sym === 'BTCUSDT') return 'BTCUSDT'

      // For everything else (XAUUSD, AAPL, TSLA, etc.), FORCE fallback to BTCUSDT
      return 'BTCUSDT'
    }

    const apiSymbol = getBinanceSymbol(selectedSymbol)
    const streamSymbol = apiSymbol.toLowerCase()

    const getBinanceInterval = (interval: string) => {
      const map: Record<string, string> = {
        '1m': '1m',
        '2m': '1m',
        '3m': '3m',
        '5m': '5m',
        '10m': '5m',
        '15m': '15m',
        '30m': '30m',
        '45m': '30m',
        '1H': '1h',
        '2H': '2h',
        '3H': '2h',
        '4H': '4h',
        '1D': '1d',
        '1W': '1w',
        '1M': '1M',
        '3M': '1M',
        '6M': '1M',
        '1Y': '1M',
      }
      return map[interval] || '1d'
    }

    const apiInterval = getBinanceInterval(selectedInterval)

    // Fetch Initial Historical Data (REST)
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${apiSymbol}&interval=${apiInterval}&limit=100`
    )
      .then((res) => res.json())
      .then((data) => {
        const historicalData = data.map((d: any) => ({
          time: d[0] / 1000, // Convert ms to seconds for lightweight-charts
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
          volume: parseFloat(d[5]),
        }))
        historicalDataRef.current = historicalData
        candlestickSeries.setData(historicalData)
        setDataLoaded((prev) => prev + 1)

        // Set visible range to show the last 80 candles so details are clear
        chart.timeScale().setVisibleLogicalRange({
          from: historicalData.length - 80,
          to: historicalData.length - 1,
        })
      })
      .catch((err) => console.error('Error fetching historical data:', err))

    // Establish Live WebSocket
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;
    let isIntentionalClose = false;

    const connectWebSocket = () => {
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${streamSymbol}@kline_${apiInterval}`
      );

      ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const kline = message.k;
      const candle = {
        time: kline.t / 1000,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
      };

      // 1. Update Main Candlestick Chart
      candlestickSeries.update(candle);

      // 2. Silently update the historical data array for calculations
      const hist = historicalDataRef.current;
      if (hist.length > 0) {
        const lastTime = hist[hist.length - 1].time;
        if (candle.time === lastTime) {
          hist[hist.length - 1] = candle; // Update current forming candle
        } else if (candle.time > lastTime) {
          hist.push(candle); // Add new candle
          if (hist.length > 3000) hist.shift(); // Prevent memory leaks over time
        }
      }

      // 3. Extract fresh data arrays
      const closes = hist.map(d => d.close);
      const highs = hist.map(d => d.high);
      const lows = hist.map(d => d.low);
      const volumes = hist.map(d => d.volume || 0);

      // 4. Direct Injection: Update all active indicators bypassing React State
      const refs = overlaySeriesRefs.current; // We use this as a global dictionary for ALL series
      const t = candle.time as any;

      // --- Overlays ---
      if (refs['SMA']) { const vals = SMA.calculate({ period: 20, values: closes }); refs['SMA'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['EMA']) { const vals = EMA.calculate({ period: 20, values: closes }); refs['EMA'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['BB_Upper']) { 
        const vals = BollingerBands.calculate({ period: 20, stdDev: 2, values: closes }); const last = vals[vals.length - 1];
        refs['BB_Upper'].update({ time: t, value: last.upper }); refs['BB_Middle'].update({ time: t, value: last.middle }); refs['BB_Lower'].update({ time: t, value: last.lower });
      }
      if (refs['WMA']) { const vals = WMA.calculate({ period: 20, values: closes }); refs['WMA'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['PSAR']) { const vals = PSAR.calculate({ high: highs, low: lows, step: 0.02, max: 0.2 }); refs['PSAR'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['VWAP']) { const vals = VWAP.calculate({ high: highs, low: lows, close: closes, volume: volumes }); refs['VWAP'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['WEMA']) { const vals = WEMA.calculate({ period: 20, values: closes }); refs['WEMA'].update({ time: t, value: vals[vals.length - 1] }); }
      
      // --- Oscillators ---
      if (refs['RSI']) { const vals = RSI.calculate({ period: 14, values: closes }); refs['RSI'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['MACD_MACD']) { 
        const vals = MACD.calculate({ values: closes, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, SimpleMAOscillator: false, SimpleMASignal: false }); const last = vals[vals.length - 1];
        if(last.MACD !== undefined) refs['MACD_MACD'].update({ time: t, value: last.MACD });
        if(last.signal !== undefined) refs['MACD_Signal'].update({ time: t, value: last.signal });
        if(last.histogram !== undefined) refs['MACD_Hist'].update({ time: t, value: last.histogram, color: last.histogram > 0 ? '#26a69a' : '#ef5350' });
      }
      if (refs['STOCH_K']) {
        const vals = Stochastic.calculate({ high: highs, low: lows, close: closes, period: 14, signalPeriod: 3 }); const last = vals[vals.length - 1];
        if(last.k !== undefined) refs['STOCH_K'].update({ time: t, value: last.k });
        if(last.d !== undefined) refs['STOCH_D'].update({ time: t, value: last.d });
      }
      if (refs['CCI']) { const vals = CCI.calculate({ high: highs, low: lows, close: closes, period: 20 }); refs['CCI'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['ADX_ADX']) {
        const vals = ADX.calculate({ high: highs, low: lows, close: closes, period: 14 }); const last = vals[vals.length - 1];
        if(last.adx) refs['ADX_ADX'].update({ time: t, value: last.adx });
        if(last.pdi) refs['ADX_PDI'].update({ time: t, value: last.pdi });
        if(last.mdi) refs['ADX_MDI'].update({ time: t, value: last.mdi });
      }
      if (refs['ATR']) { const vals = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 }); refs['ATR'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['ROC']) { const vals = ROC.calculate({ values: closes, period: 9 }); refs['ROC'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['MFI']) { const vals = MFI.calculate({ high: highs, low: lows, close: closes, volume: volumes, period: 14 }); refs['MFI'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['STOCHRSI_K']) {
        const vals = StochasticRSI.calculate({ values: closes, rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3 }); const last = vals[vals.length - 1];
        if (last && last.k !== undefined) refs['STOCHRSI_K'].update({ time: t, value: last.k });
        if (last && last.d !== undefined) refs['STOCHRSI_D'].update({ time: t, value: last.d });
      }
      if (refs['AO']) {
        const vals = AwesomeOscillator.calculate({ high: highs, low: lows, fastPeriod: 5, slowPeriod: 34 }); const last = vals[vals.length - 1]; const prev = vals.length > 1 ? vals[vals.length - 2] : last;
        refs['AO'].update({ time: t, value: last, color: last >= prev ? '#26a69a' : '#ef5350' });
      }
      if (refs['WILLR']) { const vals = WilliamsR.calculate({ high: highs, low: lows, close: closes, period: 14 }); refs['WILLR'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['OBV']) { const vals = OBV.calculate({ close: closes, volume: volumes }); refs['OBV'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['TRIX']) { const vals = TRIX.calculate({ values: closes, period: 18 }); refs['TRIX'].update({ time: t, value: vals[vals.length - 1] }); }
      if (refs['KST_KST']) {
        const vals = KST.calculate({ values: closes, ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30, SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15, signalPeriod: 9 }); const last = vals[vals.length - 1];
        if(last && last.kst !== undefined) refs['KST_KST'].update({ time: t, value: last.kst });
        if(last && last.signal !== undefined) refs['KST_Signal'].update({ time: t, value: last.signal });
      }
    }; // End ws.onmessage

    ws.onclose = () => {
      if (!isIntentionalClose) {
        console.log('WebSocket disconnected. Reconnecting in 3 seconds...');
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
      ws.close();
    };
  };

  connectWebSocket();

    // Crosshair Hover Logic
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.current!.clientHeight
      ) {
        setHoverData(null)
      } else {
        // Lookup the candle data directly from our local state/ref to bypass plugin API discrepancies
        const candleData = historicalDataRef.current.find(
          (d) => d.time === param.time
        )
        if (candleData) {
          setHoverData({
            time: param.time as string,
            open: candleData.open,
            high: candleData.high,
            low: candleData.low,
            close: candleData.close,
          })
        }
      }
    })

    const lineToolFinishedHandler = (params: any) => {
      if (
        params.stage === 'lineToolFinished' ||
        params.stage === 'pathFinished'
      ) {
        setActiveTool('cursor')
      }
    }

    // @ts-ignore
    if (chart.subscribeLineToolsAfterEdit) {
      // @ts-ignore
      chart.subscribeLineToolsAfterEdit(lineToolFinishedHandler)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (
        entries.length === 0 ||
        entries[0].target !== chartContainerRef.current
      )
        return

      const newRect = entries[0].contentRect
      chart.applyOptions({
        width: newRect.width,
        height: newRect.height,
      })
    })

    resizeObserver.observe(chartContainerRef.current)

    return () => {
      isIntentionalClose = true;
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      resizeObserver.disconnect();
      // @ts-ignore
      if (chart.unsubscribeLineToolsAfterEdit)
        chart.unsubscribeLineToolsAfterEdit(lineToolFinishedHandler)
      chart.remove();
      chartInstanceRef.current = null;
      overlaySeriesRefs.current = {};
    }
  }, [selectedSymbol, selectedInterval, resolvedTheme])

  useEffect(() => {
    if (!chartInstanceRef.current || historicalDataRef.current.length === 0)
      return

    const closes = historicalDataRef.current.map((d) => d.close)
    const highs = historicalDataRef.current.map((d) => d.high)
    const lows = historicalDataRef.current.map((d) => d.low)
    const volumes = historicalDataRef.current.map((d) => d.volume || 0)
    const times = historicalDataRef.current.map((d) => d.time)

    const removeSeries = (key: string) => {
      if (overlaySeriesRefs.current[key]) {
        try {
          chartInstanceRef.current.removeSeries(overlaySeriesRefs.current[key])
        } catch (e) {}
        delete overlaySeriesRefs.current[key]
      }
    }

    // --- SMA Logic ---
    if (activeOverlays.SMA) {
      if (!overlaySeriesRefs.current['SMA']) {
        const smaValues = SMA.calculate({ period: 20, values: closes })
        const smaData = smaValues.map((val, i) => ({
          time: times[i + 19],
          value: val,
        }))
        const series = chartInstanceRef.current.addLineSeries({
          color: '#2962FF',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        })
        series.setData(smaData)
        overlaySeriesRefs.current['SMA'] = series
      }
    } else {
      removeSeries('SMA')
    }

    // --- EMA Logic ---
    if (activeOverlays.EMA) {
      if (!overlaySeriesRefs.current['EMA']) {
        const emaValues = EMA.calculate({ period: 20, values: closes })
        const emaData = emaValues.map((val, i) => ({
          time: times[i + 19],
          value: val,
        }))
        const series = chartInstanceRef.current.addLineSeries({
          color: '#FF9800',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        })
        series.setData(emaData)
        overlaySeriesRefs.current['EMA'] = series
      }
    } else {
      removeSeries('EMA')
    }

    // --- Bollinger Bands Logic ---
    if (activeOverlays.BB) {
      if (!overlaySeriesRefs.current['BB_Upper']) {
        const bbValues = BollingerBands.calculate({
          period: 20,
          stdDev: 2,
          values: closes,
        })
        const bbUpperData = bbValues.map((val, i) => ({
          time: times[i + 19],
          value: val.upper,
        }))
        const bbMiddleData = bbValues.map((val, i) => ({
          time: times[i + 19],
          value: val.middle,
        }))
        const bbLowerData = bbValues.map((val, i) => ({
          time: times[i + 19],
          value: val.lower,
        }))

        const upperSeries = chartInstanceRef.current.addLineSeries({
          color: 'rgba(156, 39, 176, 0.5)',
          lineWidth: 1,
        })
        const middleSeries = chartInstanceRef.current.addLineSeries({
          color: 'rgba(156, 39, 176, 1)',
          lineWidth: 1,
        })
        const lowerSeries = chartInstanceRef.current.addLineSeries({
          color: 'rgba(156, 39, 176, 0.5)',
          lineWidth: 1,
        })

        upperSeries.setData(bbUpperData)
        middleSeries.setData(bbMiddleData)
        lowerSeries.setData(bbLowerData)

        overlaySeriesRefs.current['BB_Upper'] = upperSeries
        overlaySeriesRefs.current['BB_Middle'] = middleSeries
        overlaySeriesRefs.current['BB_Lower'] = lowerSeries
      }
    } else {
      removeSeries('BB_Upper')
      removeSeries('BB_Middle')
      removeSeries('BB_Lower')
    }

    // --- WMA Logic ---
    if (activeOverlays.WMA) {
      if (!overlaySeriesRefs.current['WMA']) {
        const wmaValues = WMA.calculate({ period: 20, values: closes })
        const wmaData = wmaValues.map((val, i) => ({
          time: times[i + 19],
          value: val,
        }))
        const series = chartInstanceRef.current.addLineSeries({
          color: '#009688',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        })
        series.setData(wmaData)
        overlaySeriesRefs.current['WMA'] = series
      }
    } else {
      removeSeries('WMA')
    }

    // --- Ichimoku Cloud Logic ---
    if (activeOverlays.Ichimoku) {
      if (!overlaySeriesRefs.current['Ichi_Conversion']) {
        const ichiValues = IchimokuCloud.calculate({
          high: highs,
          low: lows,
          close: closes,
          conversionPeriod: 9,
          basePeriod: 26,
          spanPeriod: 52,
          displacement: 26,
        })

        const conversionData: any[] = []
        const baseData: any[] = []
        const spanAData: any[] = []
        const spanBData: any[] = []

        // Safe mapping to prevent undefined time errors.
        // The max period for Ichimoku is 52, so values align starting from index 52.
        ichiValues.forEach((val, i) => {
          const time = times[i + 52]
          if (time) {
            if (val.conversion)
              conversionData.push({ time, value: val.conversion })
            if (val.base) baseData.push({ time, value: val.base })
            // Note: In a full production app, SpanA and SpanB are projected 26 periods into the future.
            // For this MVP, we map them to existing timestamps to avoid axis projection crashes.
            if (val.spanA) spanAData.push({ time, value: val.spanA })
            if (val.spanB) spanBData.push({ time, value: val.spanB })
          }
        })

        const conversionSeries = chartInstanceRef.current.addLineSeries({
          color: '#2962FF',
          lineWidth: 1,
        }) // Tenkan-sen
        const baseSeries = chartInstanceRef.current.addLineSeries({
          color: '#B71C1C',
          lineWidth: 1,
        }) // Kijun-sen
        const spanASeries = chartInstanceRef.current.addLineSeries({
          color: '#4CAF50',
          lineWidth: 1,
        }) // Senkou Span A
        const spanBSeries = chartInstanceRef.current.addLineSeries({
          color: '#FF5252',
          lineWidth: 1,
        }) // Senkou Span B

        conversionSeries.setData(conversionData)
        baseSeries.setData(baseData)
        spanASeries.setData(spanAData)
        spanBSeries.setData(spanBData)

        overlaySeriesRefs.current['Ichi_Conversion'] = conversionSeries
        overlaySeriesRefs.current['Ichi_Base'] = baseSeries
        overlaySeriesRefs.current['Ichi_SpanA'] = spanASeries
        overlaySeriesRefs.current['Ichi_SpanB'] = spanBSeries
      }
    } else {
      removeSeries('Ichi_Conversion')
      removeSeries('Ichi_Base')
      removeSeries('Ichi_SpanA')
      removeSeries('Ichi_SpanB')
    }

    // --- PSAR Logic ---
    if (activeOverlays.PSAR) {
      if (!overlaySeriesRefs.current['PSAR']) {
        const psarValues = PSAR.calculate({
          high: highs,
          low: lows,
          step: 0.02,
          max: 0.2,
        })
        // Align from the end in case the output length differs slightly
        const psarData = psarValues.map((val, i) => ({
          time: times[times.length - psarValues.length + i],
          value: val,
        }))
        const series = chartInstanceRef.current.addLineSeries({
          color: '#E91E63',
          lineWidth: 2,
          lineStyle: 3, // LargeDashed to simulate dots
          crosshairMarkerVisible: false,
        })
        series.setData(psarData)
        overlaySeriesRefs.current['PSAR'] = series
      }
    } else {
      removeSeries('PSAR')
    }

    // --- VWAP Logic ---
    if (activeOverlays.VWAP) {
      if (!overlaySeriesRefs.current['VWAP']) {
        const vwapValues = VWAP.calculate({
          high: highs,
          low: lows,
          close: closes,
          volume: volumes,
        })
        const vwapData = vwapValues.map((val, i) => ({
          time: times[times.length - vwapValues.length + i],
          value: val,
        }))
        const series = chartInstanceRef.current.addLineSeries({
          color: '#FFC107',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        })
        series.setData(vwapData)
        overlaySeriesRefs.current['VWAP'] = series
      }
    } else {
      removeSeries('VWAP')
    }

    // --- WEMA Logic ---
    if (activeOverlays.WEMA) {
      if (!overlaySeriesRefs.current['WEMA']) {
        const wemaValues = WEMA.calculate({ period: 20, values: closes })
        const wemaData = wemaValues.map((val, i) => ({
          time: times[times.length - wemaValues.length + i],
          value: val,
        }))
        const series = chartInstanceRef.current.addLineSeries({
          color: '#3F51B5',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        })
        series.setData(wemaData)
        overlaySeriesRefs.current['WEMA'] = series
      }
    } else {
      removeSeries('WEMA')
    }
  }, [activeOverlays, dataLoaded])

  // Helper function for boilerplate
  const createSubChart = (container: HTMLDivElement, isDark: boolean) => {
    const textColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2e3340' : '#e5e7eb';
    return createChart(container, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor },
      grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
      width: container.clientWidth, height: container.clientHeight,
      timeScale: { timeVisible: true, borderColor: gridColor },
      rightPriceScale: { borderColor: gridColor }, crosshair: { mode: CrosshairMode.Normal },
    });
  };

  const setupSync = (mainChart: any, subChart: any, sourceName: string, subChartLength?: number) => {
    if (!mainChart || !subChart) return () => {};
    
    const setSyncLock = (source: string) => {
      syncSource.current = source;
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        syncSource.current = null;
      }, 150);
    };

    const mainListener = (range: any) => {
      if (!range) return;
      if (syncSource.current === sourceName) return;
      
      if (!syncSource.current || syncSource.current === 'main') {
        setSyncLock('main');
      }
      
      let subRange = range;
      if (subChartLength !== undefined && historicalDataRef.current) {
         const offset = historicalDataRef.current.length - subChartLength;
         subRange = { from: range.from - offset, to: range.to - offset };
      }
      subChart.timeScale().setVisibleLogicalRange(subRange);
    };
    
    const subListener = (range: any) => {
      if (!range) return;
      if (syncSource.current && syncSource.current !== sourceName) return;
      
      if (!syncSource.current || syncSource.current === sourceName) {
        setSyncLock(sourceName);
      }
      
      let mainRange = range;
      if (subChartLength !== undefined && historicalDataRef.current) {
         const offset = historicalDataRef.current.length - subChartLength;
         mainRange = { from: range.from + offset, to: range.to + offset };
      }
      mainChart.timeScale().setVisibleLogicalRange(mainRange);
    };
    
    mainChart.timeScale().subscribeVisibleLogicalRangeChange(mainListener);
    subChart.timeScale().subscribeVisibleLogicalRangeChange(subListener);
    
    return () => {
      try { mainChart.timeScale().unsubscribeVisibleLogicalRangeChange(mainListener); } catch(e) {}
      try { subChart.timeScale().unsubscribeVisibleLogicalRangeChange(subListener); } catch(e) {}
    };
  };


  useEffect(() => {
    if (!activeOscillators.RSI || !rsiContainerRef.current || !historicalDataRef.current.length) {
      if (rsiChartRef.current) { rsiChartRef.current.remove(); rsiChartRef.current = null; } return;
    }
    const chart = createSubChart(rsiContainerRef.current, resolvedTheme === 'dark');
    rsiChartRef.current = chart;
    const closes = historicalDataRef.current.map(d => d.close);
    const times = historicalDataRef.current.map(d => d.time);
    const vals = RSI.calculate({ period: 14, values: closes });
    const series = chart.addLineSeries({ color: '#9C27B0', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: times[times.length - vals.length + i], value: v })));
    series.createPriceLine({ price: 70, color: '#ef5350', lineWidth: 1, lineStyle: 2, title: 'OB' });
    series.createPriceLine({ price: 30, color: '#26a69a', lineWidth: 1, lineStyle: 2, title: 'OS' });
    overlaySeriesRefs.current['RSI'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'rsi', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === rsiContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(rsiContainerRef.current);
    return () => { delete overlaySeriesRefs.current['RSI']; cleanupSync(); ro.disconnect(); chart.remove(); rsiChartRef.current = null; };
  }, [activeOscillators.RSI, dataLoaded, resolvedTheme])

  useEffect(() => {
    if (!activeOscillators.MACD || !macdContainerRef.current || !historicalDataRef.current.length) {
      if (macdChartRef.current) { macdChartRef.current.remove(); macdChartRef.current = null; } return;
    }
    const chart = createSubChart(macdContainerRef.current, resolvedTheme === 'dark');
    macdChartRef.current = chart;
    const closes = historicalDataRef.current.map(d => d.close);
    const times = historicalDataRef.current.map(d => d.time);
    const vals = MACD.calculate({ values: closes, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, SimpleMAOscillator: false, SimpleMASignal: false });
    const macdData: any[] = [], signalData: any[] = [], histData: any[] = [];
    vals.forEach((v, i) => {
      const time = times[times.length - vals.length + i];
      if (v.MACD !== undefined) macdData.push({ time, value: v.MACD });
      if (v.signal !== undefined) signalData.push({ time, value: v.signal });
      if (v.histogram !== undefined) histData.push({ time, value: v.histogram, color: v.histogram > 0 ? '#26a69a' : '#ef5350' });
    });
    const histSeries = chart.addHistogramSeries({ color: '#26a69a' });
    const macdSeries = chart.addLineSeries({ color: '#2962FF', lineWidth: 2 });
    const signalSeries = chart.addLineSeries({ color: '#FF6D00', lineWidth: 2 });
    histSeries.setData(histData); macdSeries.setData(macdData); signalSeries.setData(signalData);
    overlaySeriesRefs.current['MACD_MACD'] = macdSeries;
    overlaySeriesRefs.current['MACD_Signal'] = signalSeries;
    overlaySeriesRefs.current['MACD_Hist'] = histSeries;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'macd', macdData.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === macdContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(macdContainerRef.current);
    return () => { delete overlaySeriesRefs.current['MACD_MACD']; delete overlaySeriesRefs.current['MACD_Signal']; delete overlaySeriesRefs.current['MACD_Hist']; cleanupSync(); ro.disconnect(); chart.remove(); macdChartRef.current = null; };
  }, [activeOscillators.MACD, dataLoaded, resolvedTheme])

  useEffect(() => {
    if (
      !activeOscillators.Stochastic ||
      !stochContainerRef.current ||
      historicalDataRef.current.length === 0
    ) {
      if (stochChartRef.current) {
        stochChartRef.current.remove()
        stochChartRef.current = null
      }
      return
    }

    const isDark = resolvedTheme === 'dark'
    const textColor = isDark ? '#9ca3af' : '#4b5563'
    const gridColor = isDark ? '#2e3340' : '#e5e7eb'

    const stochChart = createChart(stochContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: stochContainerRef.current.clientWidth,
      height: stochContainerRef.current.clientHeight,
      timeScale: { timeVisible: true, borderColor: gridColor },
      rightPriceScale: { borderColor: gridColor },
      crosshair: { mode: CrosshairMode.Normal },
    })
    stochChartRef.current = stochChart

    const highs = historicalDataRef.current.map((d) => d.high)
    const lows = historicalDataRef.current.map((d) => d.low)
    const closes = historicalDataRef.current.map((d) => d.close)
    const times = historicalDataRef.current.map((d) => d.time)

    const stochValues = Stochastic.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: 14,
      signalPeriod: 3,
    })

    const kData: any[] = []
    const dData: any[] = []

    stochValues.forEach((val, i) => {
      const time = times[times.length - stochValues.length + i]
      if (val.k !== undefined) kData.push({ time, value: val.k })
      if (val.d !== undefined) dData.push({ time, value: val.d })
    })

    const kSeries = stochChart.addLineSeries({ color: '#2962FF', lineWidth: 2 })
    const dSeries = stochChart.addLineSeries({ color: '#FF6D00', lineWidth: 2 })

    kSeries.setData(kData)
    dSeries.setData(dData)

    kSeries.createPriceLine({
      price: 80,
      color: '#ef5350',
      lineWidth: 1,
      lineStyle: 2,
      title: 'OB',
    })
    kSeries.createPriceLine({
      price: 20,
      color: '#26a69a',
      lineWidth: 1,
      lineStyle: 2,
      title: 'OS',
    })
    overlaySeriesRefs.current['STOCH_K'] = kSeries;
    overlaySeriesRefs.current['STOCH_D'] = dSeries;

    const cleanupSync = setupSync(chartInstanceRef.current, stochChart, 'stoch', kData.length);
    const ro = new ResizeObserver((entries) => {
      if (entries.length && entries[0].target === stochContainerRef.current)
        stochChart.applyOptions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        })
    })
    ro.observe(stochContainerRef.current)

    return () => {
      delete overlaySeriesRefs.current['STOCH_K'];
      delete overlaySeriesRefs.current['STOCH_D'];
      cleanupSync()
      ro.disconnect()
      stochChart.remove()
      stochChartRef.current = null
    }
  }, [activeOscillators.Stochastic, dataLoaded, resolvedTheme])

  // CCI Logic
  useEffect(() => {
    if (!activeOscillators.CCI || !cciContainerRef.current || !historicalDataRef.current.length) {
      if (cciChartRef.current) { cciChartRef.current.remove(); cciChartRef.current = null; } return;
    }
    const chart = createSubChart(cciContainerRef.current, resolvedTheme === 'dark');
    cciChartRef.current = chart;
    const h = historicalDataRef.current.map(d => d.high), l = historicalDataRef.current.map(d => d.low), c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = CCI.calculate({ high: h, low: l, close: c, period: 20 });
    const series = chart.addLineSeries({ color: '#009688', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v })));
    series.createPriceLine({ price: 100, color: '#ef5350', lineWidth: 1, lineStyle: 2, title: 'OB' });
    series.createPriceLine({ price: -100, color: '#26a69a', lineWidth: 1, lineStyle: 2, title: 'OS' });
    overlaySeriesRefs.current['CCI'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'cci', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === cciContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(cciContainerRef.current);
    return () => { delete overlaySeriesRefs.current['CCI']; cleanupSync(); ro.disconnect(); chart.remove(); cciChartRef.current = null; };
  }, [activeOscillators.CCI, dataLoaded, resolvedTheme]);

  // ADX Logic
  useEffect(() => {
    if (!activeOscillators.ADX || !adxContainerRef.current || !historicalDataRef.current.length) {
      if (adxChartRef.current) { adxChartRef.current.remove(); adxChartRef.current = null; } return;
    }
    const chart = createSubChart(adxContainerRef.current, resolvedTheme === 'dark');
    adxChartRef.current = chart;
    const h = historicalDataRef.current.map(d => d.high), l = historicalDataRef.current.map(d => d.low), c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = ADX.calculate({ high: h, low: l, close: c, period: 14 });
    const adxSeries = chart.addLineSeries({ color: '#3F51B5', lineWidth: 2 });
    const pdiSeries = chart.addLineSeries({ color: '#4CAF50', lineWidth: 1 });
    const mdiSeries = chart.addLineSeries({ color: '#F44336', lineWidth: 1 });
    const adxData: any[] = [], pdiData: any[] = [], mdiData: any[] = [];
    vals.forEach((v, i) => {
      const time = t[t.length - vals.length + i];
      if(v.adx) adxData.push({ time, value: v.adx });
      if(v.pdi) pdiData.push({ time, value: v.pdi });
      if(v.mdi) mdiData.push({ time, value: v.mdi });
    });
    adxSeries.setData(adxData); pdiSeries.setData(pdiData); mdiSeries.setData(mdiData);
    overlaySeriesRefs.current['ADX_ADX'] = adxSeries;
    overlaySeriesRefs.current['ADX_PDI'] = pdiSeries;
    overlaySeriesRefs.current['ADX_MDI'] = mdiSeries;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'adx', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === adxContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(adxContainerRef.current);
    return () => { delete overlaySeriesRefs.current['ADX_ADX']; delete overlaySeriesRefs.current['ADX_PDI']; delete overlaySeriesRefs.current['ADX_MDI']; cleanupSync(); ro.disconnect(); chart.remove(); adxChartRef.current = null; };
  }, [activeOscillators.ADX, dataLoaded, resolvedTheme]);

  // ATR Logic
  useEffect(() => {
    if (!activeOscillators.ATR || !atrContainerRef.current || !historicalDataRef.current.length) {
      if (atrChartRef.current) { atrChartRef.current.remove(); atrChartRef.current = null; } return;
    }
    const chart = createSubChart(atrContainerRef.current, resolvedTheme === 'dark');
    atrChartRef.current = chart;
    const h = historicalDataRef.current.map(d => d.high), l = historicalDataRef.current.map(d => d.low), c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = ATR.calculate({ high: h, low: l, close: c, period: 14 });
    const series = chart.addLineSeries({ color: '#E91E63', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v })));
    overlaySeriesRefs.current['ATR'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'atr', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === atrContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(atrContainerRef.current);
    return () => { delete overlaySeriesRefs.current['ATR']; cleanupSync(); ro.disconnect(); chart.remove(); atrChartRef.current = null; };
  }, [activeOscillators.ATR, dataLoaded, resolvedTheme]);

  // ROC Logic
  useEffect(() => {
    if (!activeOscillators.ROC || !rocContainerRef.current || !historicalDataRef.current.length) {
      if (rocChartRef.current) { rocChartRef.current.remove(); rocChartRef.current = null; } return;
    }
    const chart = createSubChart(rocContainerRef.current, resolvedTheme === 'dark');
    rocChartRef.current = chart;
    const c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = ROC.calculate({ values: c, period: 9 });
    const series = chart.addLineSeries({ color: '#FFC107', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v })));
    series.createPriceLine({ price: 0, color: '#9e9e9e', lineWidth: 1, lineStyle: 2, title: 'Zero' });
    overlaySeriesRefs.current['ROC'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'roc', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === rocContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(rocContainerRef.current);
    return () => { delete overlaySeriesRefs.current['ROC']; cleanupSync(); ro.disconnect(); chart.remove(); rocChartRef.current = null; };
  }, [activeOscillators.ROC, dataLoaded, resolvedTheme]);

  // MFI Logic
  useEffect(() => {
    if (!activeOscillators.MFI || !mfiContainerRef.current || !historicalDataRef.current.length) {
      if (mfiChartRef.current) { mfiChartRef.current.remove(); mfiChartRef.current = null; } return;
    }
    const chart = createSubChart(mfiContainerRef.current, resolvedTheme === 'dark');
    mfiChartRef.current = chart;
    const h = historicalDataRef.current.map(d => d.high), l = historicalDataRef.current.map(d => d.low), c = historicalDataRef.current.map(d => d.close), v = historicalDataRef.current.map(d => d.volume || 0), t = historicalDataRef.current.map(d => d.time);
    const vals = MFI.calculate({ high: h, low: l, close: c, volume: v, period: 14 });
    const series = chart.addLineSeries({ color: '#10B981', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v })));
    series.createPriceLine({ price: 80, color: '#ef5350', lineWidth: 1, lineStyle: 2, title: 'OB' });
    series.createPriceLine({ price: 20, color: '#26a69a', lineWidth: 1, lineStyle: 2, title: 'OS' });
    overlaySeriesRefs.current['MFI'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'mfi', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === mfiContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });});
    ro.observe(mfiContainerRef.current);
    return () => { delete overlaySeriesRefs.current['MFI']; cleanupSync(); ro.disconnect(); chart.remove(); mfiChartRef.current = null; };
  }, [activeOscillators.MFI, dataLoaded, resolvedTheme]);

  // 1. StochRSI
  useEffect(() => {
    if (!activeOscillators.StochRSI || !stochRsiContainerRef.current || !historicalDataRef.current.length) { if (stochRsiChartRef.current) { stochRsiChartRef.current.remove(); stochRsiChartRef.current = null; } return; }
    const chart = createSubChart(stochRsiContainerRef.current, resolvedTheme === 'dark'); stochRsiChartRef.current = chart;
    const c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = StochasticRSI.calculate({ values: c, rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3 });
    const kSeries = chart.addLineSeries({ color: '#2962FF', lineWidth: 2 }); const dSeries = chart.addLineSeries({ color: '#FF6D00', lineWidth: 2 });
    kSeries.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v.k })));
    dSeries.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v.d })));
    kSeries.createPriceLine({ price: 80, color: '#ef5350', lineWidth: 1, lineStyle: 2 }); kSeries.createPriceLine({ price: 20, color: '#26a69a', lineWidth: 1, lineStyle: 2 });
    overlaySeriesRefs.current['STOCHRSI_K'] = kSeries;
    overlaySeriesRefs.current['STOCHRSI_D'] = dSeries;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'stochrsi', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === stochRsiContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });}); ro.observe(stochRsiContainerRef.current);
    return () => { delete overlaySeriesRefs.current['STOCHRSI_K']; delete overlaySeriesRefs.current['STOCHRSI_D']; ro.disconnect(); if (cleanupSync) cleanupSync(); chart.remove(); stochRsiChartRef.current = null; };
  }, [activeOscillators.StochRSI, dataLoaded, resolvedTheme]);

  // 2. Awesome Oscillator (AO)
  useEffect(() => {
    if (!activeOscillators.AO || !aoContainerRef.current || !historicalDataRef.current.length) { if (aoChartRef.current) { aoChartRef.current.remove(); aoChartRef.current = null; } return; }
    const chart = createSubChart(aoContainerRef.current, resolvedTheme === 'dark'); aoChartRef.current = chart;
    const h = historicalDataRef.current.map(d => d.high), l = historicalDataRef.current.map(d => d.low), t = historicalDataRef.current.map(d => d.time);
    const vals = AwesomeOscillator.calculate({ high: h, low: l, fastPeriod: 5, slowPeriod: 34 });
    const histSeries = chart.addHistogramSeries({});
    histSeries.setData(vals.map((v, i) => { const prev = i > 0 ? vals[i-1] : v; return { time: t[t.length - vals.length + i], value: v, color: v >= prev ? '#26a69a' : '#ef5350' }; }));
    overlaySeriesRefs.current['AO'] = histSeries;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'ao', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === aoContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });}); ro.observe(aoContainerRef.current);
    return () => { delete overlaySeriesRefs.current['AO']; ro.disconnect(); if (cleanupSync) cleanupSync(); chart.remove(); aoChartRef.current = null; };
  }, [activeOscillators.AO, dataLoaded, resolvedTheme]);

  // 3. Williams %R
  useEffect(() => {
    if (!activeOscillators.WilliamsR || !willRContainerRef.current || !historicalDataRef.current.length) { if (willRChartRef.current) { willRChartRef.current.remove(); willRChartRef.current = null; } return; }
    const chart = createSubChart(willRContainerRef.current, resolvedTheme === 'dark'); willRChartRef.current = chart;
    const h = historicalDataRef.current.map(d => d.high), l = historicalDataRef.current.map(d => d.low), c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = WilliamsR.calculate({ high: h, low: l, close: c, period: 14 });
    const series = chart.addLineSeries({ color: '#9C27B0', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v })));
    series.createPriceLine({ price: -20, color: '#ef5350', lineWidth: 1, lineStyle: 2 }); series.createPriceLine({ price: -80, color: '#26a69a', lineWidth: 1, lineStyle: 2 });
    overlaySeriesRefs.current['WILLR'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'willr', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === willRContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });}); ro.observe(willRContainerRef.current);
    return () => { delete overlaySeriesRefs.current['WILLR']; ro.disconnect(); if (cleanupSync) cleanupSync(); chart.remove(); willRChartRef.current = null; };
  }, [activeOscillators.WilliamsR, dataLoaded, resolvedTheme]);

  // 4. OBV
  useEffect(() => {
    if (!activeOscillators.OBV || !obvContainerRef.current || !historicalDataRef.current.length) { if (obvChartRef.current) { obvChartRef.current.remove(); obvChartRef.current = null; } return; }
    const chart = createSubChart(obvContainerRef.current, resolvedTheme === 'dark'); obvChartRef.current = chart;
    const c = historicalDataRef.current.map(d => d.close), v = historicalDataRef.current.map(d => d.volume || 0), t = historicalDataRef.current.map(d => d.time);
    const vals = OBV.calculate({ close: c, volume: v });
    const series = chart.addLineSeries({ color: '#FF9800', lineWidth: 2 });
    series.setData(vals.map((val, i) => ({ time: t[t.length - vals.length + i], value: val })));
    overlaySeriesRefs.current['OBV'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'obv', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === obvContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });}); ro.observe(obvContainerRef.current);
    return () => { delete overlaySeriesRefs.current['OBV']; ro.disconnect(); if (cleanupSync) cleanupSync(); chart.remove(); obvChartRef.current = null; };
  }, [activeOscillators.OBV, dataLoaded, resolvedTheme]);

  // 5. TRIX
  useEffect(() => {
    if (!activeOscillators.TRIX || !trixContainerRef.current || !historicalDataRef.current.length) { if (trixChartRef.current) { trixChartRef.current.remove(); trixChartRef.current = null; } return; }
    const chart = createSubChart(trixContainerRef.current, resolvedTheme === 'dark'); trixChartRef.current = chart;
    const c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = TRIX.calculate({ values: c, period: 18 });
    const series = chart.addLineSeries({ color: '#FFEB3B', lineWidth: 2 });
    series.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v })));
    series.createPriceLine({ price: 0, color: '#9e9e9e', lineWidth: 1, lineStyle: 2 });
    overlaySeriesRefs.current['TRIX'] = series;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'trix', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === trixContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });}); ro.observe(trixContainerRef.current);
    return () => { delete overlaySeriesRefs.current['TRIX']; ro.disconnect(); if (cleanupSync) cleanupSync(); chart.remove(); trixChartRef.current = null; };
  }, [activeOscillators.TRIX, dataLoaded, resolvedTheme]);

  // 6. KST
  useEffect(() => {
    if (!activeOscillators.KST || !kstContainerRef.current || !historicalDataRef.current.length) { if (kstChartRef.current) { kstChartRef.current.remove(); kstChartRef.current = null; } return; }
    const chart = createSubChart(kstContainerRef.current, resolvedTheme === 'dark'); kstChartRef.current = chart;
    const c = historicalDataRef.current.map(d => d.close), t = historicalDataRef.current.map(d => d.time);
    const vals = KST.calculate({ values: c, ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30, SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15, signalPeriod: 9 });
    const kstSeries = chart.addLineSeries({ color: '#2962FF', lineWidth: 2 }); const sigSeries = chart.addLineSeries({ color: '#FF6D00', lineWidth: 2 });
    kstSeries.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v.kst })));
    sigSeries.setData(vals.map((v, i) => ({ time: t[t.length - vals.length + i], value: v.signal })));
    kstSeries.createPriceLine({ price: 0, color: '#9e9e9e', lineWidth: 1, lineStyle: 2 });
    overlaySeriesRefs.current['KST_KST'] = kstSeries;
    overlaySeriesRefs.current['KST_Signal'] = sigSeries;
    const cleanupSync = setupSync(chartInstanceRef.current, chart, 'kst', vals.length);
    const ro = new ResizeObserver(entries => { if(entries.length && entries[0].target === kstContainerRef.current) chart.applyOptions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });}); ro.observe(kstContainerRef.current);
    return () => { delete overlaySeriesRefs.current['KST_KST']; delete overlaySeriesRefs.current['KST_Signal']; ro.disconnect(); if (cleanupSync) cleanupSync(); chart.remove(); kstChartRef.current = null; };
  }, [activeOscillators.KST, dataLoaded, resolvedTheme]);

  useEffect(() => {
    if (!chartInstanceRef.current) return

    if (activeTool !== 'cursor' && activeTool !== 'clear') {
      try {
        chartInstanceRef.current.addLineTool(activeTool as any, [], {})
      } catch (err) {
        console.warn(
          `Drawing tool ${activeTool} not perfectly supported by this plugin version.`,
          err
        )
      }
    }
  }, [activeTool])

  const ToolButton = ({
    tool,
    action,
    icon: Icon,
    title,
    className = '',
  }: any) => {
    const isActive = activeTool === tool && tool !== undefined

    const baseStyle =
      action === 'clear'
        ? 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
        : isActive
          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500'
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'

    return (
      <button
        onClick={() => {
          if (action === 'clear') {
            chartInstanceRef.current?.removeAllLineTools()
          } else if (tool) {
            setActiveTool(tool)
          }
        }}
        className={`p-2 rounded-md transition-colors shrink-0 ${baseStyle} ${className}`}
        title={title}
      >
        <Icon size={18} />
      </button>
    )
  }

  return (
    <div className="w-full h-full flex bg-white dark:bg-[#131722] min-h-0">
      {/* Left Sidebar Toolbar */}
      <div
        className="w-[50px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-2 gap-2 z-20 bg-gray-50 dark:bg-[#1e222d] overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Group 1: Basics */}
        <ToolButton tool="cursor" icon={MousePointer2} title="Cursor" />
        <ToolButton action="clear" icon={Trash2} title="Clear All Drawings" />
        <div className="h-px w-6 bg-gray-300 dark:bg-gray-700 my-1 shrink-0" />
        {/* Group 2: Lines & Rays */}
        <ToolButton tool="TrendLine" icon={TrendingUp} title="Trend Line" />
        <ToolButton
          tool="HorizontalLine"
          icon={Minus}
          title="Horizontal Line"
        />
        <ToolButton
          tool="VerticalLine"
          icon={SeparatorVertical}
          title="Vertical Line"
        />
        <ToolButton tool="CrossLine" icon={Crosshair} title="Cross Line" />
        <ToolButton
          tool="ExtendedLine"
          icon={ArrowRightToLine}
          title="Extended Line"
        />
        <ToolButton tool="RayLine" icon={ArrowRight} title="Ray" />
        <ToolButton
          tool="HorizontalRay"
          icon={ArrowRight}
          title="Horizontal Ray"
        />
        <div className="h-px w-6 bg-gray-300 dark:bg-gray-700 my-1 shrink-0" />
        {/* Group 3: Geometric Shapes */}
        <ToolButton tool="Rectangle" icon={Square} title="Rectangle" />
        <ToolButton tool="Triangle" icon={Triangle} title="Triangle" />
        <ToolButton tool="Circle" icon={Circle} title="Circle" />
        <div className="h-px w-6 bg-gray-300 dark:bg-gray-700 my-1 shrink-0" />
        {/* Group 4: Advanced Analysis */}
        <ToolButton
          tool="FibRetracement"
          icon={Baseline}
          title="Fibonacci Retracement"
        />
        <ToolButton
          tool="ParallelChannel"
          icon={Baseline}
          title="Parallel Channel"
        />
        <ToolButton tool="PriceRange" icon={Ruler} title="Price Range" />
        <ToolButton
          tool="LongPosition"
          icon={BarChart2}
          title="Long Position"
          className="[&>svg]:text-green-500 [&>svg]:opacity-80"
        />
        <ToolButton
          tool="ShortPosition"
          icon={BarChart2}
          title="Short Position"
          className="[&>svg]:text-red-500 [&>svg]:opacity-80 [&>svg]:transform [&>svg]:rotate-180"
        />
        <div className="h-px w-6 bg-gray-300 dark:bg-gray-700 my-1 shrink-0" />
        {/* Group 5: Annotation & Freehand */}
        <ToolButton tool="Brush" icon={PenTool} title="Brush" />
        <ToolButton tool="Path" icon={PenTool} title="Path" />
        <ToolButton tool="Highlighter" icon={Highlighter} title="Highlighter" />
        <ToolButton tool="Text" icon={Type} title="Text" />
        <ToolButton tool="Callout" icon={MessageSquare} title="Callout" />
        <div className="h-4 shrink-0" /> {/* Bottom padding */}
      </div>

      <div className="flex-1 flex flex-col relative min-w-0">
        <style>{`
        /* Ninja hack to hide the TradingView watermark injected by lightweight-charts v4+ */
        .tv-lightweight-charts-watermark,
        #tv-attr-logo,
        a[href*="tradingview.com"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }
      `}</style>

        <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-0 lg:px-0 bg-gray-50 dark:bg-[#1a202c] shrink-0 relative z-50">
          <div className="flex items-center h-full">
            {/* Profile Button */}
            <div className="relative flex items-center h-full border-r border-gray-200 dark:border-gray-800 px-3">
              <button
                ref={triggerRef}
                onClick={() => setShowUserPopover(!showUserPopover)}
                className="w-7 h-7 rounded-full bg-primary/12 dark:bg-white/12 flex items-center justify-center hover:ring-2 ring-primary/20 transition-all focus:outline-none"
              >
                <span className="font-outfit font-bold text-[10px] text-primary dark:text-white">
                  AA
                </span>
              </button>
              <AnimatePresence>
                {showUserPopover && (
                  <UserPopover
                    onClose={() => setShowUserPopover(false)}
                    triggerRef={triggerRef}
                  />
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center h-full gap-1.5 px-3 font-bold text-[13px] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-r border-gray-200 dark:border-gray-800"
            >
              <Search className="w-3.5 h-3.5 text-gray-400" />
              {selectedSymbol}
            </button>

            <div className="relative h-full flex items-center border-r border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center h-full gap-1 px-3 font-bold text-[13px] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                {selectedInterval}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-0.5 w-48 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 z-50 h-max max-h-96 overflow-y-auto">
                  {TIME_INTERVALS.map((group) => (
                    <div key={group.label} className="mb-2 last:mb-0">
                      <div className="px-4 py-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                        {group.label}
                      </div>
                      {group.items.map((item) => (
                        <button
                          key={item.short}
                          onClick={() => {
                            setSelectedInterval(item.short)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${
                            selectedInterval === item.short
                              ? 'text-green-500 bg-green-50 dark:bg-green-500/10 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {item.full}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative h-full flex items-center border-r border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsIndicatorsOpen(true)}
                className={`flex items-center h-full gap-1.5 px-3 font-bold text-[13px] transition-colors ${Object.values(activeOverlays).some(Boolean) ? 'text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <Activity
                  className={`w-4 h-4 ${Object.values(activeOverlays).some(Boolean) ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400'}`}
                />
                Indicators
              </button>
            </div>
          </div>

          {/* Mobile Actions: Sidebar Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-white/[0.06] text-primary dark:text-white shrink-0 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col" style={{ scrollbarWidth: 'thin' }}>
          <div
            className="w-full relative z-10 min-h-[400px] flex-1 shrink-0"
            ref={chartContainerRef}
          >
          {/* Dynamic Legend Overlay */}
          <div className="absolute top-3 left-4 z-10 flex flex-col gap-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px] text-gray-900 dark:text-white">
                {MOCK_SYMBOLS.find((s) => s.symbol === selectedSymbol)?.name ||
                  selectedSymbol}
              </span>
              <span className="text-[12px] font-medium px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {selectedInterval}
              </span>
            </div>

            {hoverData && (
              <div className="flex items-center gap-3 font-mono text-[13px]">
                <span className="text-gray-500">
                  O
                  <span
                    className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {hoverData.open.toFixed(2)}
                  </span>
                </span>
                <span className="text-gray-500">
                  H
                  <span
                    className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {hoverData.high.toFixed(2)}
                  </span>
                </span>
                <span className="text-gray-500">
                  L
                  <span
                    className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {hoverData.low.toFixed(2)}
                  </span>
                </span>
                <span className="text-gray-500">
                  C
                  <span
                    className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {hoverData.close.toFixed(2)}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Oscillator Sub-pane */}
        {activeOscillators.RSI && (
          <div
            className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10"
            ref={rsiContainerRef}
          >
            <div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-purple-600 dark:text-purple-400">
              RSI (14)
            </div>
          </div>
        )}

        {/* MACD Sub-pane */}
        {activeOscillators.MACD && (
          <div
            className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10"
            ref={macdContainerRef}
          >
            <div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-blue-600 dark:text-blue-400">
              MACD (12, 26, 9)
            </div>
          </div>
        )}

        {/* Stochastic Sub-pane */}
        {activeOscillators.Stochastic && (
          <div
            className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10"
            ref={stochContainerRef}
          >
            <div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-orange-600 dark:text-orange-400">
              Stoch (14, 3, 3)
            </div>
          </div>
        )}

        {/* CCI Sub-pane */}
        {activeOscillators.CCI && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={cciContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-teal-600 dark:text-teal-400">CCI (20)</div></div>}
        {/* ADX Sub-pane */}
        {activeOscillators.ADX && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={adxContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-indigo-600 dark:text-indigo-400">ADX (14)</div></div>}
        {/* ATR Sub-pane */}
        {activeOscillators.ATR && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={atrContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-pink-600 dark:text-pink-400">ATR (14)</div></div>}
        {/* ROC Sub-pane */}
        {activeOscillators.ROC && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={rocContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-yellow-600 dark:text-yellow-400">ROC (9)</div></div>}
        {/* MFI Sub-pane */}
        {activeOscillators.MFI && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={mfiContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-emerald-600 dark:text-emerald-400">MFI (14)</div></div>}
        {activeOscillators.StochRSI && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={stochRsiContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-purple-600 dark:text-purple-400">StochRSI</div></div>}
        {activeOscillators.AO && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={aoContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-green-600 dark:text-green-400">Awesome Oscillator</div></div>}
        {activeOscillators.WilliamsR && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={willRContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-blue-600 dark:text-blue-400">Williams %R</div></div>}
        {activeOscillators.OBV && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={obvContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-orange-600 dark:text-orange-400">OBV</div></div>}
        {activeOscillators.TRIX && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={trixContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-yellow-600 dark:text-yellow-400">TRIX</div></div>}
        {activeOscillators.KST && <div className="h-[150px] w-full border-t border-gray-200 dark:border-gray-800 shrink-0 relative z-10" ref={kstContainerRef}><div className="absolute top-2 left-4 z-20 pointer-events-none font-bold text-[12px] text-red-600 dark:text-red-400">KST</div></div>}

        </div>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-[#1a202c] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-[70vh]">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#131722] overflow-x-auto shrink-0">
                {['All', 'Stock', 'Crypto', 'Forex'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-green-500 text-green-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {filteredSymbols.length > 0 ? (
                  filteredSymbols.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => {
                        setSelectedSymbol(item.symbol)
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <CompanyLogo
                          ticker={item.symbol}
                          logoUrl=""
                          size={32}
                        />
                        <div className="flex items-baseline gap-2 truncate">
                          <span className="font-outfit font-bold text-[13px] text-gray-900 dark:text-white">
                            {item.symbol}
                          </span>
                          <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 shrink-0">
                        {item.exchange}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No symbols found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isIndicatorsOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e222d] w-[600px] h-[450px] rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Modal Header & Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Indicators, metrics, and strategies
                  </h2>
                  <button
                    onClick={() => setIsIndicatorsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <svg
                    className="w-4 h-4 absolute left-3 top-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search indicators..."
                    value={indicatorSearch}
                    onChange={(e) => setIndicatorSearch(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-[#2a2e39] text-gray-900 dark:text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Body (Sidebar + Content) */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-50 dark:bg-[#131722] border-r border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
                  <div className="text-xs font-bold text-gray-400 mb-2 mt-2 px-2">
                    BUILT-IN
                  </div>
                  <button className="w-full text-left px-2 py-1.5 rounded bg-gray-200 dark:bg-[#2a2e39] text-sm text-gray-900 dark:text-white font-medium">
                    Technicals
                  </button>
                </div>

                {/* Content (Indicators List) */}
                <div className="flex-1 p-2 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-2 px-3 tracking-wider">
                      OVERLAYS (ON-CHART)
                    </h3>
                    {/* SMA Button */}
                    {('Simple Moving Average (SMA 20)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          SMA: !prev.SMA,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.SMA ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Simple Moving Average (SMA 20)</span>
                      {activeOverlays.SMA && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </button>
)}

                    {/* EMA Button */}
                    {('Exponential Moving Average (EMA 20)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          EMA: !prev.EMA,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.EMA ? 'text-orange-500 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Exponential Moving Average (EMA 20)</span>
                      {activeOverlays.EMA && (
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </button>
)}

                    {/* Bollinger Bands Button */}
                    {('Bollinger Bands (20, 2)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({ ...prev, BB: !prev.BB }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.BB ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Bollinger Bands (20, 2)</span>
                      {activeOverlays.BB && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </button>
)}

                    {/* WMA Button */}
                    {('Weighted Moving Average (WMA 20)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          WMA: !prev.WMA,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.WMA ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Weighted Moving Average (WMA 20)</span>
                      {activeOverlays.WMA && (
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                      )}
                    </button>
)}

                    {/* Ichimoku Cloud Button */}
                    {('Ichimoku Cloud (9, 26, 52, 26)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          Ichimoku: !prev.Ichimoku,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.Ichimoku ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Ichimoku Cloud (9, 26, 52, 26)</span>
                      {activeOverlays.Ichimoku && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </button>
)}

                    {/* PSAR Button */}
                    {('Parabolic SAR (0.02, 0.2)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          PSAR: !prev.PSAR,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.PSAR ? 'text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Parabolic SAR (0.02, 0.2)</span>
                      {activeOverlays.PSAR && (
                        <div className="w-2 h-2 rounded-full bg-pink-500" />
                      )}
                    </button>
)}

                    {/* VWAP Button */}
                    {('Volume Weighted Average Price (VWAP)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          VWAP: !prev.VWAP,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.VWAP ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Volume Weighted Average Price (VWAP)</span>
                      {activeOverlays.VWAP && (
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      )}
                    </button>
)}

                    {/* WEMA Button */}
                    {('Wilder\'s Smoothing (WEMA 20)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOverlays((prev) => ({
                          ...prev,
                          WEMA: !prev.WEMA,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOverlays.WEMA ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Wilder's Smoothing (WEMA 20)</span>
                      {activeOverlays.WEMA && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      )}
                    </button>
)}
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-2 px-3 tracking-wider">
                      OSCILLATORS (SUB-PANE)
                    </h3>
                    {/* RSI Button */}
                    {('Relative Strength Index (RSI 14)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOscillators((prev) => ({
                          ...prev,
                          RSI: !prev.RSI,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.RSI ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Relative Strength Index (RSI 14)</span>
                      {activeOscillators.RSI && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </button>
)}

                    {/* MACD Button */}
                    {('MACD (12, 26, 9)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOscillators((prev) => ({
                          ...prev,
                          MACD: !prev.MACD,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.MACD ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>MACD (12, 26, 9)</span>
                      {activeOscillators.MACD && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </button>
)}

                    {/* Stochastic Button */}
                    {('Stochastic (14, 3, 3)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button
                      onClick={() => {
                        setActiveOscillators((prev) => ({
                          ...prev,
                          Stochastic: !prev.Stochastic,
                        }))
                        setIsIndicatorsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.Stochastic ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>Stochastic (14, 3, 3)</span>
                      {activeOscillators.Stochastic && (
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </button>
)}

                    {/* CCI Button */}
                    {('Commodity Channel Index (CCI 20)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, CCI: !prev.CCI })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.CCI ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span>Commodity Channel Index (CCI 20)</span>{activeOscillators.CCI && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                    </button>
)}

                    {/* ADX Button */}
                    {('Average Directional Index (ADX 14)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, ADX: !prev.ADX })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.ADX ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span>Average Directional Index (ADX 14)</span>{activeOscillators.ADX && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </button>
)}

                    {/* ATR Button */}
                    {('Average True Range (ATR 14)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, ATR: !prev.ATR })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.ATR ? 'text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span>Average True Range (ATR 14)</span>{activeOscillators.ATR && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                    </button>
)}

                    {/* ROC Button */}
                    {('Rate of Change (ROC 9)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, ROC: !prev.ROC })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.ROC ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span>Rate of Change (ROC 9)</span>{activeOscillators.ROC && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                    </button>
)}

                    {/* MFI Button */}
                    {('Money Flow Index (MFI 14)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, MFI: !prev.MFI })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.MFI ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span>Money Flow Index (MFI 14)</span>{activeOscillators.MFI && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
)}
                    {/* StochRSI */}
                    {('Stochastic RSI'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, StochRSI: !prev.StochRSI })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.StochRSI ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}><span>Stochastic RSI</span>{activeOscillators.StochRSI && <div className="w-2 h-2 rounded-full bg-purple-500" />}</button>
)}
                    {/* AO */}
                    {('Awesome Oscillator'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, AO: !prev.AO })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.AO ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}><span>Awesome Oscillator</span>{activeOscillators.AO && <div className="w-2 h-2 rounded-full bg-green-500" />}</button>
)}
                    {/* Williams %R */}
                    {('Williams %R'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, WilliamsR: !prev.WilliamsR })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.WilliamsR ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}><span>Williams %R</span>{activeOscillators.WilliamsR && <div className="w-2 h-2 rounded-full bg-blue-500" />}</button>
)}
                    {/* OBV */}
                    {('On-Balance Volume (OBV)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, OBV: !prev.OBV })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.OBV ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}><span>On-Balance Volume (OBV)</span>{activeOscillators.OBV && <div className="w-2 h-2 rounded-full bg-orange-500" />}</button>
)}
                    {/* TRIX */}
                    {('TRIX'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, TRIX: !prev.TRIX })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.TRIX ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}><span>TRIX</span>{activeOscillators.TRIX && <div className="w-2 h-2 rounded-full bg-yellow-500" />}</button>
)}
                    {/* KST */}
                    {('Know Sure Thing (KST)'.toLowerCase().includes(indicatorSearch.toLowerCase())) && (
<button onClick={() => { setActiveOscillators(prev => ({ ...prev, KST: !prev.KST })); setIsIndicatorsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2e39] ${activeOscillators.KST ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}><span>Know Sure Thing (KST)</span>{activeOscillators.KST && <div className="w-2 h-2 rounded-full bg-red-500" />}</button>
)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
