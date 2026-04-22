// ─── Stock / Watchlist (from watchlist_page.dart + stock_data.dart) ──────────

export interface WatchlistItem {
  ticker: string;
  name: string;
  currentPrice: number;
  target1: number;
  target2: number;
  isUp: boolean;
  hasWarning: boolean;
  logoUrl: string;
}

export interface CandleData {
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface StockData {
  currentPrice: number;
  targetPrice1: number;
  targetPrice2: number;
  percentageChange: number;
  high: number;
  low: number;
  volume: number;
  insight: string;
  candles: CandleData[];
}

// ─── AI Radar (from ai_radar_page.dart) ──────────────────────────────────────

export type RadarAction = "buy" | "watch" | "avoid";

export interface RadarAnomaly {
  ticker: string;
  name: string;
  action: RadarAction;
  tags: string[];
  logoUrl: string;
  timeAgo: string;
  entryPrice: number;
  maxReturn: number;
  isClosed: boolean;
  timestamp: Date;
}

// ─── Notifications (from notifications_page.dart) ────────────────────────────

export type NotificationType = "aiInsight" | "priceAlert" | "marketUpdate" | "systemAlert";

export interface RavenNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timeAgo: string;
  isRead: boolean;
  ticker?: string;
}

// ─── Chat messages (from stock_details_page.dart) ────────────────────────────

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
