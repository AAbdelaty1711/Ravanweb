"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  Info,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS } from "@/lib/mock-data";
import type { RavenNotification, NotificationType } from "@/lib/types";

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: typeof Sparkles; color: string; bg: string }
> = {
  aiInsight: {
    label: "AI Radar",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  priceAlert: {
    label: "Price Alert",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  marketUpdate: {
    label: "Market",
    icon: BarChart2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  systemAlert: {
    label: "System",
    icon: Info,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
};

// ─── Notification card ────────────────────────────────────────────────────────
function NotifCard({
  notif,
  onTap,
}: {
  notif: RavenNotification;
  onTap: () => void;
}) {
  const cfg = TYPE_CONFIG[notif.type];
  const Icon = cfg.icon;
  const isUnread = !notif.isRead;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      onClick={onTap}
      className={cn(
        "p-3.5 rounded-card border cursor-pointer transition-all duration-300",
        isUnread
          ? "bg-primary/[0.04] dark:bg-white/[0.07] border-primary/12 dark:border-white/18"
          : "bg-card-light dark:bg-card-dark border-border-light dark:border-[#38383A]",
        "hover:scale-[1.005] active:scale-[0.99]"
      )}
    >
      {/* Top row: type badge + ticker + time + unread dot */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-inter font-bold",
            cfg.color, cfg.bg
          )}
        >
          {cfg.label}
        </span>

        {notif.ticker && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-outfit font-bold
                           bg-primary/8 dark:bg-white/12
                           text-primary dark:text-white">
            {notif.ticker}
          </span>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <span className="font-inter text-[10px] text-text-secondary-light/70 dark:text-text-secondary-dark/70">
            {notif.timeAgo}
          </span>
          {isUnread && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-white" />
          )}
        </div>
      </div>

      {/* Title */}
      <p className="font-outfit font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark
                    mt-1.5 tracking-tight leading-tight">
        {notif.title}
      </p>

      {/* Body */}
      <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark
                    mt-1 leading-[1.45] line-clamp-2">
        {notif.body}
      </p>
    </motion.div>
  );
}

// ─── Filter chip ─────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onTap,
}: {
  label: string;
  active: boolean;
  onTap: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onTap}
      className={cn(
        "px-4 py-1.5 rounded-[20px] text-[12px] font-inter font-semibold",
        "border transition-all duration-200 shrink-0",
        active
          ? "bg-primary/9 dark:bg-white/15 border-primary/35 dark:border-white/30 text-primary dark:text-white"
          : "bg-black/[0.04] dark:bg-white/[0.05] border-transparent text-text-secondary-light dark:text-text-secondary-dark"
      )}
    >
      {label}
    </motion.button>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center flex-1 px-8 pb-16"
    >
      <div className="w-[72px] h-[72px] rounded-full bg-primary/7 dark:bg-white/7
                      flex items-center justify-center mb-4">
        <BellOff size={28} className="text-primary/45 dark:text-white/45" />
      </div>
      <h3 className="font-outfit font-bold text-[16px] text-text-primary-light dark:text-text-primary-dark mb-2">
        No Notifications
      </h3>
      <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark text-center leading-relaxed">
        Price alerts and AI Radar signals will appear here.
      </p>
    </motion.div>
  );
}

// ─── Main Notifications Page ──────────────────────────────────────────────────
const FILTER_KEYS = ["All", "Unread", "AI Radar"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<RavenNotification[]>(NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "Unread") return !n.isRead;
    if (activeFilter === "AI Radar") return n.type === "aiInsight";
    return true;
  });

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border-light dark:border-[#141414] shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <h1 className="font-outfit font-bold text-[20px] text-primary dark:text-white tracking-tight leading-none">
            Notifications
          </h1>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="px-2 py-0.5 rounded-full font-inter font-bold text-[11px]
                           bg-primary/10 dark:bg-white/18
                           text-primary dark:text-white"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="font-inter font-semibold text-[12px] text-text-secondary-light dark:text-text-secondary-dark
                       hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* ── Filter chips ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar shrink-0">
        {FILTER_KEYS.map((key) => (
          <FilterChip
            key={key}
            label={key}
            active={activeFilter === key}
            onTap={() => setActiveFilter(key)}
          />
        ))}
      </div>

      {/* ── Notification list ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 min-h-0 flex flex-col">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2.5 pt-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <NotifCard
                  key={n.id}
                  notif={n}
                  onTap={() => markRead(n.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}



