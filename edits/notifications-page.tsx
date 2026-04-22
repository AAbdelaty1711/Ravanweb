"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  Info,
  BellOff,
  CheckCheck,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS } from "@/lib/mock-data";
import type { RavenNotification, NotificationType } from "@/lib/types";

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: typeof Sparkles; color: string; bg: string; border: string }
> = {
  aiInsight: {
    label: "AI Radar",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-500/20",
  },
  priceAlert: {
    label: "Price Alert",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-200 dark:border-green-500/20",
  },
  marketUpdate: {
    label: "Market",
    icon: BarChart2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
  },
  systemAlert: {
    label: "System",
    icon: Info,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
  },
};

function NotifRow({
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onTap}
      className={cn(
        "flex items-start gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-all duration-200",
        "hover:shadow-sm",
        isUnread
          ? "bg-primary/[0.03] dark:bg-white/[0.05] border-primary/10 dark:border-white/10"
          : "bg-white dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.04]"
      )}
    >
      {/* Icon */}
      <div className={cn("shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border mt-0.5", cfg.bg, cfg.border)}>
        <Icon size={16} className={cfg.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={cn("text-[11px] font-inter font-bold px-2 py-0.5 rounded-full border", cfg.color, cfg.bg, cfg.border)}>
            {cfg.label}
          </span>
          {notif.ticker && (
            <span className="text-[11px] font-outfit font-bold px-2 py-0.5 rounded-full bg-primary/8 dark:bg-white/10 text-primary dark:text-white border border-primary/15 dark:border-white/15">
              {notif.ticker}
            </span>
          )}
        </div>
        <p className={cn(
          "font-inter text-[14px] leading-snug",
          isUnread
            ? "font-semibold text-text-primary-light dark:text-text-primary-dark"
            : "font-medium text-text-primary-light dark:text-text-primary-dark"
        )}>
          {notif.title}
        </p>
        <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1 leading-relaxed">
          {notif.body}
        </p>
      </div>

      {/* Right side */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <span className="font-inter text-[11px] text-text-secondary-light/70 dark:text-text-secondary-dark/70 whitespace-nowrap">
          {notif.timeAgo}
        </span>
        {isUnread && (
          <div className="w-2 h-2 rounded-full bg-primary dark:bg-white" />
        )}
      </div>
    </motion.div>
  );
}

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
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const typeStats = {
    aiInsight: notifications.filter((n) => n.type === "aiInsight" && !n.isRead).length,
    priceAlert: notifications.filter((n) => n.type === "priceAlert" && !n.isRead).length,
    marketUpdate: notifications.filter((n) => n.type === "marketUpdate" && !n.isRead).length,
  };

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit font-bold text-[26px] text-primary dark:text-white tracking-tight leading-none">
                Notifications
              </h1>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.7 }}
                    className="px-2.5 py-0.5 rounded-full font-inter font-bold text-[12px]
                               bg-primary/10 dark:bg-white/15 text-primary dark:text-white"
                  >
                    {unreadCount} new
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Price alerts, AI signals, and market updates
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                         bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                         font-inter font-semibold text-[13px] text-text-secondary-light dark:text-text-secondary-dark
                         hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        {/* Stats row */}
        {unreadCount > 0 && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {typeStats.aiInsight > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                <Sparkles size={12} className="text-purple-600 dark:text-purple-400" />
                <span className="font-inter font-semibold text-[12px] text-purple-600 dark:text-purple-400">
                  {typeStats.aiInsight} AI signal{typeStats.aiInsight > 1 ? "s" : ""}
                </span>
              </div>
            )}
            {typeStats.priceAlert > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                <TrendingUp size={12} className="text-green-600 dark:text-green-400" />
                <span className="font-inter font-semibold text-[12px] text-green-600 dark:text-green-400">
                  {typeStats.priceAlert} price alert{typeStats.priceAlert > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-[12px] font-inter font-semibold border transition-all",
                activeFilter === key
                  ? "bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white"
                  : "bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08] text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.08]"
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notification list ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
              <BellOff size={24} className="text-primary/30 dark:text-white/30" />
            </div>
            <div className="text-center">
              <h3 className="font-outfit font-bold text-[17px] text-text-primary-light dark:text-text-primary-dark">
                No Notifications
              </h3>
              <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Price alerts and AI Radar signals will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl space-y-2.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <NotifRow key={n.id} notif={n} onTap={() => markRead(n.id)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
