'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { ChevronDown, Search, X, Menu, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSidebar } from '@/components/SidebarContext';

export default function CustomNativeChart({ onOpenChat }: { onOpenChat?: () => void }) {
  const { setMobileOpen } = useSidebar();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [hoverData, setHoverData] = useState<{ time: string, open: number, high: number, low: number, close: number } | null>(null);

  const TIME_INTERVALS = [
    {
      label: 'MINUTES',
      items: [
        { short: '1m', full: '1 minute' },
        { short: '5m', full: '5 minutes' },
        { short: '15m', full: '15 minutes' },
        { short: '30m', full: '30 minutes' }
      ]
    },
    {
      label: 'HOURS',
      items: [
        { short: '1H', full: '1 hour' },
        { short: '4H', full: '4 hours' }
      ]
    },
    {
      label: 'DAYS',
      items: [
        { short: '1D', full: '1 day' },
        { short: '1W', full: '1 week' },
        { short: '1M', full: '1 month' },
        { short: '1Y', full: '1 year' }
      ]
    }
  ];

  const [selectedInterval, setSelectedInterval] = useState('1D');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const MOCK_SYMBOLS = [
    { symbol: 'XAUUSD', name: 'Gold Spot / U.S. Dollar', type: 'Forex', exchange: 'OANDA' },
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', exchange: 'NASDAQ' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock', exchange: 'NASDAQ' },
    { symbol: 'BTCUSD', name: 'Bitcoin / U.S. Dollar', type: 'Crypto', exchange: 'BINANCE' },
    { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', type: 'Forex', exchange: 'FXCM' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Stock', exchange: 'NASDAQ' },
  ];

  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredSymbols = MOCK_SYMBOLS.filter(s => 
    (activeTab === 'All' || s.type === activeTab) &&
    (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = resolvedTheme === 'dark';
    const textColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2e3340' : '#e5e7eb';

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
    });

    // Add Candlestick Series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // DUMMY DATA GENERATOR (1 year of data)
    const generateData = () => {
      const res = [];
      let currentPrice = 120.01;
      let currentTimestamp = new Date('2023-01-01T00:00:00Z').getTime();
      
      for (let i = 0; i < 300; i++) {
        let d = new Date(currentTimestamp);
        // Skip weekends
        while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
          currentTimestamp += 24 * 60 * 60 * 1000;
          d = new Date(currentTimestamp);
        }
        
        const time = d.toISOString().split('T')[0];
        const open = currentPrice;
        // Random volatility between 0.5% and 2%
        const volatility = currentPrice * (0.005 + Math.random() * 0.015);
        const high = open + Math.random() * volatility;
        const low = open - Math.random() * volatility;
        const close = low + Math.random() * (high - low);
        
        res.push({ 
          time, 
          open: Number(open.toFixed(2)), 
          high: Number(high.toFixed(2)), 
          low: Number(low.toFixed(2)), 
          close: Number(close.toFixed(2)) 
        });
        
        currentPrice = close;
        currentTimestamp += 24 * 60 * 60 * 1000;
      }
      return res;
    };
    
    const data = generateData();

    candlestickSeries.setData(data);
    
    // Set visible range to show the last 80 candles so details are clear
    chart.timeScale().setVisibleLogicalRange({
      from: data.length - 80,
      to: data.length - 1,
    });

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
        setHoverData(null);
      } else {
        const candleData = param.seriesData.get(candlestickSeries) as any;
        if (candleData) {
          setHoverData({
            time: param.time as string,
            open: candleData.open,
            high: candleData.high,
            low: candleData.low,
            close: candleData.close,
          });
        }
      }
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      
      const newRect = entries[0].contentRect;
      chart.applyOptions({ 
        width: newRect.width, 
        height: newRect.height 
      });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [resolvedTheme]);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#131722] min-h-0">
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
      
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-2 lg:px-4 bg-gray-50 dark:bg-[#1a202c] shrink-0 relative z-30">
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-primary dark:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-colors shrink-0"
          >
            <Menu size={16} />
          </button>

          <button 
            onClick={() => setIsSearchOpen(true)}
            className="font-bold text-[14px] lg:text-[15px] text-gray-900 dark:text-white hover:text-green-500 transition-colors flex items-center gap-1.5 lg:gap-2"
          >
            {selectedSymbol}
            <Search className="w-3.5 h-3.5 text-gray-400"/>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              {selectedInterval}
              <ChevronDown className={`w-4 h-4 ml-1 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 z-50 h-max max-h-96 overflow-y-auto">
                {TIME_INTERVALS.map((group) => (
                  <div key={group.label} className="mb-2 last:mb-0">
                    <div className="px-4 py-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                      {group.label}
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item.short}
                        onClick={() => { setSelectedInterval(item.short); setIsDropdownOpen(false); }}
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
        </div>

        {/* Mobile Chat Toggle */}
        <div className="flex items-center">
          <button 
            onClick={onOpenChat}
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 dark:bg-white/[0.06] text-primary dark:text-white shrink-0 hover:bg-primary/20 transition-colors"
          >
            <MessageSquare size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-10 min-h-0" ref={chartContainerRef}>
        {/* Dynamic Legend Overlay */}
        <div className="absolute top-3 left-4 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px] text-gray-900 dark:text-white">{MOCK_SYMBOLS.find(s => s.symbol === selectedSymbol)?.name || selectedSymbol}</span>
            <span className="text-[12px] font-medium px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{selectedInterval}</span>
          </div>
          
          {hoverData && (
            <div className="flex items-center gap-3 font-mono text-[13px]">
              <span className="text-gray-500">O<span className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}>{hoverData.open.toFixed(2)}</span></span>
              <span className="text-gray-500">H<span className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}>{hoverData.high.toFixed(2)}</span></span>
              <span className="text-gray-500">L<span className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}>{hoverData.low.toFixed(2)}</span></span>
              <span className="text-gray-500">C<span className={`ml-1 font-medium ${hoverData.open > hoverData.close ? 'text-red-500' : 'text-green-500'}`}>{hoverData.close.toFixed(2)}</span></span>
            </div>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1a202c] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-[70vh]">
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400"/>
              <input 
                type="text" 
                autoFocus
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="flex items-center gap-4 px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#131722] overflow-x-auto shrink-0">
              {['All', 'Stock', 'Crypto', 'Forex'].map(tab => (
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
                filteredSymbols.map(item => (
                  <button 
                    key={item.symbol}
                    onClick={() => {
                      setSelectedSymbol(item.symbol);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{item.symbol}</span>
                      <span className="text-xs text-gray-500">{item.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{item.exchange}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No symbols found for "{searchQuery}"</div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
