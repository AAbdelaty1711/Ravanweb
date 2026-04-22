'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellOff, CheckCheck, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/SidebarContext'
import { NOTIFICATIONS } from '@/lib/mock-data'
import type { RavenNotification, NotificationType } from '@/lib/types'

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; color: string; bg: string; border: string }
> = {
  aiInsight: {
    label: 'AI Radar',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20',
  },
  priceAlert: {
    label: 'Price Alert',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/20',
  },
  marketUpdate: {
    label: 'Market',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
  systemAlert: {
    label: 'System',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
}

function NotifRow({
  notif,
  onTap,
}: {
  notif: RavenNotification
  onTap: () => void
}) {
  const cfg = TYPE_CONFIG[notif.type]
  const isUnread = !notif.isRead

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onTap}
      className={cn(
        'flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors duration-150 rounded-2xl border',
        isUnread
          ? 'bg-white dark:bg-white/[0.05] border-gray-200 dark:border-white/[0.09] hover:bg-gray-50 dark:hover:bg-white/[0.08] shadow-sm dark:shadow-none'
          : 'bg-gray-50/60 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.04] hover:bg-gray-100/60 dark:hover:bg-white/[0.04]'
      )}
    >
      {/* Unread indicator */}
      <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full transition-all">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            isUnread ? 'bg-primary dark:bg-white' : 'bg-transparent'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={cn(
              'text-[10px] font-inter font-bold px-2 py-0.5 rounded-full border',
              cfg.color,
              cfg.bg,
              cfg.border
            )}
          >
            {cfg.label}
          </span>
          {notif.ticker && (
            <span
              className="text-[10px] font-outfit font-bold px-1.5 py-0.5 rounded-full
                             bg-primary/8 dark:bg-white/10 text-primary dark:text-white
                             border border-primary/12 dark:border-white/12"
            >
              {notif.ticker}
            </span>
          )}
          <span className="ml-auto font-inter text-[11px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 shrink-0">
            {notif.timeAgo}
          </span>
        </div>
        <p
          className={cn(
            'font-inter text-[14px] leading-snug',
            isUnread
              ? 'font-semibold text-text-primary-light dark:text-text-primary-dark'
              : 'font-medium text-text-primary-light/90 dark:text-text-primary-dark/90'
          )}
        >
          {notif.title}
        </p>
        <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1 leading-relaxed">
          {notif.body}
        </p>
      </div>
    </motion.div>
  )
}

const FILTER_KEYS = ['All', 'Unread', 'AI Radar'] as const
type FilterKey = (typeof FILTER_KEYS)[number]

export default function NotificationsPage() {
  const { setMobileOpen } = useSidebar()
  const [notifications, setNotifications] =
    useState<RavenNotification[]>(NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.isRead
    if (activeFilter === 'AI Radar') return n.type === 'aiInsight'
    return true
  })

  const markRead = (id: string) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )

  const markAllRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, isRead: true })))

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* Header */}
      <div className="px-5 pt-5 pb-3.5 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.06] text-primary dark:text-white"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-bold text-[22px] text-primary dark:text-white tracking-tight leading-none">
                  Notifications
                </h1>
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.7 }}
                      className="px-2 py-0.5 rounded-full font-inter font-bold text-[11px]
                                 bg-primary/10 dark:bg-white/15 text-primary dark:text-white"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                Price alerts, AI signals, and market updates
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl shrink-0
                         bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                         font-inter font-semibold text-[12px] text-text-secondary-light dark:text-text-secondary-dark
                         hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'px-3.5 py-1 rounded-xl text-[12px] font-inter font-semibold border transition-all',
                activeFilter === key
                  ? 'bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white'
                  : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.07]'
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 px-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
              <BellOff
                size={22}
                className="text-primary/30 dark:text-white/30"
              />
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
          <div className="mx-5 my-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <NotifRow key={n.id} notif={n} onTap={() => markRead(n.id)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
