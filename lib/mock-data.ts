import { WatchlistItem, RadarAnomaly, RavenNotification } from "./types";
import { stockFaviconUrl } from "./utils";

// ─── Watchlist mock data (from watchlist_page.dart + add_stock_page.dart) ─────

export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    ticker: "AAPL", name: "Apple Inc.", currentPrice: 189.30,
    target1: 198.00, target2: 210.50, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("apple.com"),
  },
  {
    ticker: "NVDA", name: "NVIDIA Corp.", currentPrice: 875.20,
    target1: 920.00, target2: 980.00, isUp: true, hasWarning: true,
    logoUrl: stockFaviconUrl("nvidia.com"),
  },
  {
    ticker: "TSLA", name: "Tesla Inc.", currentPrice: 248.50,
    target1: 230.00, target2: 215.00, isUp: false, hasWarning: true,
    logoUrl: stockFaviconUrl("tesla.com"),
  },
  {
    ticker: "MSFT", name: "Microsoft Corp.", currentPrice: 415.80,
    target1: 440.00, target2: 465.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("microsoft.com"),
  },
  {
    ticker: "META", name: "Meta Platforms", currentPrice: 512.40,
    target1: 490.00, target2: 470.00, isUp: false, hasWarning: false,
    logoUrl: stockFaviconUrl("meta.com"),
  },
  {
    ticker: "AMZN", name: "Amazon.com Inc.", currentPrice: 188.60,
    target1: 205.00, target2: 220.00, isUp: true, hasWarning: true,
    logoUrl: stockFaviconUrl("amazon.com"),
  },
];

export const ALL_STOCKS: WatchlistItem[] = [
  ...INITIAL_WATCHLIST,
  {
    ticker: "GOOGL", name: "Alphabet Inc.", currentPrice: 172.90,
    target1: 188.00, target2: 200.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("google.com"),
  },
  {
    ticker: "NFLX", name: "Netflix Inc.", currentPrice: 628.50,
    target1: 660.00, target2: 700.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("netflix.com"),
  },
  {
    ticker: "AMD", name: "AMD Inc.", currentPrice: 162.40,
    target1: 180.00, target2: 210.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("amd.com"),
  },
  {
    ticker: "COIN", name: "Coinbase Global", currentPrice: 215.30,
    target1: 195.00, target2: 180.00, isUp: false, hasWarning: true,
    logoUrl: stockFaviconUrl("coinbase.com"),
  },
  {
    ticker: "PLTR", name: "Palantir Technologies", currentPrice: 24.80,
    target1: 30.00, target2: 38.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("palantir.com"),
  },
  {
    ticker: "SHOP", name: "Shopify Inc.", currentPrice: 71.20,
    target1: 82.00, target2: 95.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("shopify.com"),
  },
  {
    ticker: "UBER", name: "Uber Technologies", currentPrice: 68.90,
    target1: 78.00, target2: 88.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("uber.com"),
  },
  {
    ticker: "SPOT", name: "Spotify Technology", currentPrice: 325.40,
    target1: 360.00, target2: 400.00, isUp: true, hasWarning: false,
    logoUrl: stockFaviconUrl("spotify.com"),
  },
  {
    ticker: "INTC", name: "Intel Corporation", currentPrice: 32.80,
    target1: 28.00, target2: 24.00, isUp: false, hasWarning: true,
    logoUrl: stockFaviconUrl("intel.com"),
  },
];

// ─── Radar mock data (from ai_radar_page.dart) ───────────────────────────────

const now = new Date();

export const RADAR_ITEMS: RadarAnomaly[] = [
  {
    ticker: "NVDA", name: "NVIDIA Corp", action: "buy",
    tags: ["High Volume Spike", "Breakout", "Golden Cross"],
    logoUrl: stockFaviconUrl("nvidia.com"),
    timeAgo: "2 hours ago", entryPrice: 850.50, maxReturn: 4.2, isClosed: false,
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
  {
    ticker: "COIN", name: "Coinbase Global", action: "watch",
    tags: ["Gap Up", "High Volume Spike"],
    logoUrl: stockFaviconUrl("coinbase.com"),
    timeAgo: "5 hours ago", entryPrice: 210.00, maxReturn: 1.5, isClosed: false,
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
  },
  {
    ticker: "TSLA", name: "Tesla Inc", action: "avoid",
    tags: ["Gap Down", "Insider Trading", "Death Cross"],
    logoUrl: stockFaviconUrl("tesla.com"),
    timeAgo: "1 day ago", entryPrice: 175.20, maxReturn: -3.8, isClosed: false,
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
  },
  {
    ticker: "PLTR", name: "Palantir Tech", action: "buy",
    tags: ["RSI Oversold", "Positive Sentiment", "Earnings Beat"],
    logoUrl: stockFaviconUrl("palantir.com"),
    timeAgo: "2 days ago", entryPrice: 22.50, maxReturn: 8.4, isClosed: false,
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    ticker: "AMD", name: "AMD Inc", action: "buy",
    tags: ["RSI Oversold", "Breakout", "MACD Bullish"],
    logoUrl: stockFaviconUrl("amd.com"),
    timeAgo: "18 hours ago", entryPrice: 162.40, maxReturn: 3.1, isClosed: false,
    timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000),
  },
  {
    ticker: "GOOGL", name: "Alphabet Inc", action: "watch",
    tags: ["Positive Sentiment", "RSI Overbought"],
    logoUrl: stockFaviconUrl("google.com"),
    timeAgo: "4 hours ago", entryPrice: 172.90, maxReturn: 0.8, isClosed: false,
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
  },
  {
    ticker: "AMZN", name: "Amazon.com Inc", action: "buy",
    tags: ["MACD Bullish", "High Volume Spike", "Breakout"],
    logoUrl: stockFaviconUrl("amazon.com"),
    timeAgo: "1 day ago", entryPrice: 188.60, maxReturn: 2.4, isClosed: false,
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
  },
  {
    ticker: "SHOP", name: "Shopify Inc", action: "buy",
    tags: ["Breakout", "Positive Sentiment"],
    logoUrl: stockFaviconUrl("shopify.com"),
    timeAgo: "3 days ago", entryPrice: 71.20, maxReturn: 5.6, isClosed: false,
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
  // History
  {
    ticker: "AAPL", name: "Apple Inc", action: "watch",
    tags: ["Positive Sentiment", "Sector Momentum"],
    logoUrl: stockFaviconUrl("apple.com"),
    timeAgo: "Closed 5 days ago", entryPrice: 168.00, maxReturn: 8.5, isClosed: true,
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    ticker: "META", name: "Meta Platforms", action: "avoid",
    tags: ["Insider Trading", "High Volume Spike"],
    logoUrl: stockFaviconUrl("meta.com"),
    timeAgo: "Closed 12 days ago", entryPrice: 480.00, maxReturn: -6.2, isClosed: true,
    timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    ticker: "MSFT", name: "Microsoft Corp", action: "buy",
    tags: ["Golden Cross", "Earnings Beat", "Sector Momentum"],
    logoUrl: stockFaviconUrl("microsoft.com"),
    timeAgo: "Closed 8 days ago", entryPrice: 405.00, maxReturn: 12.0, isClosed: true,
    timestamp: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
  },
];

// ─── Notifications (from notifications_page.dart) ────────────────────────────

export const NOTIFICATIONS: RavenNotification[] = [
  {
    id: "1", type: "aiInsight", isRead: false, ticker: "NVDA",
    title: "AI Radar Signal",
    body: "NVDA is showing a Golden Cross pattern with high volume surge. Bullish momentum detected.",
    timeAgo: "2m ago",
  },
  {
    id: "2", type: "priceAlert", isRead: false, ticker: "AAPL",
    title: "Price Alert Triggered",
    body: "AAPL has reached your target price of $198.00. Consider reviewing your position.",
    timeAgo: "18m ago",
  },
  {
    id: "3", type: "aiInsight", isRead: false, ticker: "TSLA",
    title: "AI Radar Signal",
    body: "TSLA showing RSI Oversold conditions. Potential reversal signal detected by Raven AI.",
    timeAgo: "1h ago",
  },
  {
    id: "4", type: "marketUpdate", isRead: true,
    title: "Market Open",
    body: "US Markets are now open. S&P 500 futures are up +0.4% in pre-market trading.",
    timeAgo: "3h ago",
  },
  {
    id: "5", type: "priceAlert", isRead: true, ticker: "META",
    title: "Price Alert Triggered",
    body: "META has dropped below your watch threshold of $490.00.",
    timeAgo: "5h ago",
  },
  {
    id: "6", type: "priceAlert", isRead: true, ticker: "AMZN",
    title: "Price Alert Triggered",
    body: "AMZN crossed your target of $205.00. Up +2.3% in today's session.",
    timeAgo: "3d ago",
  },
];

// ─── Fallback logo gradients (from _StockRow / _CompanyLogo in Flutter) ───────
export const TICKER_GRADIENTS: Record<string, [string, string]> = {
  AAPL:  ["#636363", "#2C2C2C"],
  NVDA:  ["#76B900", "#3A5C00"],
  TSLA:  ["#CC0000", "#660000"],
  MSFT:  ["#737373", "#3A3A3A"],
  META:  ["#555555", "#2A2A2A"],
  AMZN:  ["#FF9900", "#7A4800"],
  GOOGL: ["#555555", "#2A2A2A"],
  NFLX:  ["#E50914", "#7A040A"],
  AMD:   ["#007C46", "#004028"],
  COIN:  ["#0052FF", "#0029A3"],
  PLTR:  ["#1F1F1F", "#0A0A0A"],
  SHOP:  ["#96BF48", "#4C5F24"],
  UBER:  ["#1A1A1A", "#0A0A0A"],
  SPOT:  ["#1DB954", "#0D5C2A"],
  INTC:  ["#0071C5", "#003562"],
};
