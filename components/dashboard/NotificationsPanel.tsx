'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellOff, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTIFICATIONS } from '@/lib/mock-data'
import type { RavenNotification, NotificationType } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

const TYPE_CONFIG: Record<
  NotificationType,
  {
    labelKey: 'aiRadar' | 'priceAlert' | 'market' | 'system'
    color: string
    bg: string
    border: string
  }
> = {
  aiInsight: {
    labelKey: 'aiRadar',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20',
  },
  priceAlert: {
    labelKey: 'priceAlert',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/20',
  },
  marketUpdate: {
    labelKey: 'market',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
  systemAlert: {
    labelKey: 'system',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
}

const FILTER_KEYS = ['All', 'Unread', 'AI Radar'] as const
type FilterKey = (typeof FILTER_KEYS)[number]

interface NotifPageState {
  notifications: RavenNotification[]
  activeFilter: FilterKey
  setActiveFilter: (f: FilterKey) => void
  unreadCount: number
  filtered: RavenNotification[]
  markRead: (id: string) => void
  markAllRead: () => void
}

function DesktopNotifRow({
  notif,
  onTap,
}: {
  notif: RavenNotification
  onTap: () => void
}) {
  const cfg = TYPE_CONFIG[notif.type]
  const isUnread = !notif.isRead
  const { dict, isRTL } = useLanguage()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onTap}
      className={cn(
        'flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-150 rounded-2xl border',
        isUnread
          ? 'bg-primary/[0.03] dark:bg-primary/10 border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/[0.05] dark:hover:bg-primary/15'
          : 'bg-white/40 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.05] opacity-80 hover:opacity-100'
      )}
    >
      <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full">
        <div
          className={cn(
            'w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]',
            isUnread ? 'bg-primary dark:bg-white scale-110' : 'bg-transparent'
          )}
        />
      </div>

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
            {dict.notifications[cfg.labelKey]}
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
          <span
            className={cn(
              'font-inter text-[10px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 shrink-0',
              isRTL ? 'mr-auto' : 'ml-auto'
            )}
          >
            {notif.timeAgo}
          </span>
        </div>
        <p
          className={cn(
            'font-inter text-[13.5px] leading-snug text-start',
            isUnread
              ? 'font-bold text-text-primary-light dark:text-text-primary-dark'
              : 'font-medium text-text-secondary-light/90 dark:text-text-secondary-dark/80'
          )}
        >
          {notif.title}
        </p>
        <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 leading-relaxed text-start">
          {notif.body}
        </p>
      </div>
    </motion.div>
  )
}

function DesktopNotifications({ state }: { state: NotifPageState }) {
  const { dict, isRTL } = useLanguage()
  const {
    activeFilter,
    setActiveFilter,
    unreadCount,
    filtered,
    markRead,
    markAllRead,
  } = state

  const filterLabels: Record<FilterKey, string> = {
    All: dict.notifications.all,
    Unread: dict.notifications.unread,
    'AI Radar': dict.notifications.aiRadar,
  }

  return (
    <div className="hidden lg:flex flex-col h-full market-pattern">
      <div className="sticky top-0 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-4 h-[64px] flex justify-between items-center">
        <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">
            {dict.notifications.title}
          </h2>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
                className="px-2 py-0.5 rounded-full font-inter font-bold text-[10px]
                           bg-primary/10 dark:bg-white/15 text-primary dark:text-white"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl shrink-0
                         bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                         font-inter font-semibold text-[11px] text-text-secondary-light dark:text-text-secondary-dark
                         hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
            >
              <CheckCheck size={11} /> {dict.notifications.markAllRead}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  'px-3.5 py-1 rounded-xl text-[11px] font-inter font-semibold border transition-all',
                  activeFilter === key
                    ? 'bg-primary/10 dark:bg-white/12 border-primary/25 dark:border-white/20 text-primary dark:text-white'
                    : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/[0.07]'
                )}
              >
                {filterLabels[key]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/[0.07] dark:bg-white/[0.07] flex items-center justify-center">
                <BellOff
                  size={20}
                  className="text-primary/30 dark:text-white/30"
                />
              </div>
              <div className="text-center">
                <h3 className="font-outfit font-bold text-[16px] text-text-primary-light dark:text-text-primary-dark">
                  {dict.notifications.noNotifications}
                </h3>
                <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {dict.notifications.noNotificationsDesc}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((n) => (
                  <DesktopNotifRow
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
    </div>
  )
}

function MobileNotifCard({
  notif,
  onTap,
}: {
  notif: RavenNotification
  onTap: () => void
}) {
  const cfg = TYPE_CONFIG[notif.type]
  const isUnread = !notif.isRead
  const { dict } = useLanguage()

  const accentBg = isUnread
    ? 'bg-primary/[0.06] dark:bg-primary/15'
    : 'bg-white/50 dark:bg-white/[0.02]'
  const accentBorder = isUnread
    ? 'border-primary/30 dark:border-primary/40'
    : 'border-gray-100 dark:border-white/[0.06]'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onTap}
      className={cn(
        'rounded-[16px] border cursor-pointer transition-colors duration-200',
        accentBg,
        accentBorder
      )}
    >
      <div className="p-[10px]">
        <div className="flex items-center gap-1.5 flex-wrap mb-[7px]">
          <span
            className={cn(
              'text-[10px] font-inter font-bold px-2 py-0.5 rounded-full',
              cfg.color,
              cfg.bg
            )}
          >
            {dict.notifications[cfg.labelKey]}
          </span>

          {notif.ticker && (
            <span
              className="text-[10px] font-outfit font-bold px-[7px] py-0.5 rounded-full
                         bg-primary/[0.08] dark:bg-white/10
                         text-primary dark:text-white
                         border border-primary/12 dark:border-white/12"
            >
              {notif.ticker}
            </span>
          )}

          <div className="flex-1" />

          <span className="font-inter text-[10px] text-text-secondary-light/70 dark:text-text-secondary-dark/70 font-normal">
            {notif.timeAgo}
          </span>

          {isUnread && (
            <div className="w-[8px] h-[8px] rounded-full bg-primary dark:bg-white shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
          )}
        </div>

        <p
          className={cn(
            'font-outfit text-[11px] tracking-[-0.2px] leading-[1.2] mb-1 text-start',
            isUnread
              ? 'font-bold text-text-primary-light dark:text-text-primary-dark'
              : 'font-medium text-text-secondary-light dark:text-text-secondary-dark'
          )}
        >
          {notif.title}
        </p>

        <p
          className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark
                     font-normal leading-[1.45] line-clamp-2 text-start"
        >
          {notif.body}
        </p>
      </div>
    </motion.div>
  )
}

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
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onTap}
      className={cn(
        'shrink-0 px-[10px] py-[5px] rounded-[20px] font-inter font-semibold text-[10px] transition-colors border',
        isSelected
          ? 'bg-primary/[0.09] dark:bg-white/[0.12] border-primary/40 dark:border-white/30 text-primary dark:text-white'
          : 'bg-white/5 dark:bg-white/[0.05] border-transparent text-text-secondary-light dark:text-text-secondary-dark'
      )}
    >
      {label}
    </motion.button>
  )
}

function MobileNotifications({
  state,
  compact,
}: {
  state: NotifPageState
  compact?: boolean
}) {
  const { dict } = useLanguage()
  const {
    activeFilter,
    setActiveFilter,
    unreadCount,
    filtered,
    markRead,
    markAllRead,
  } = state

  const filterLabels: Record<FilterKey, string> = {
    All: dict.notifications.all,
    Unread: dict.notifications.unread,
    'AI Radar': dict.notifications.aiRadar,
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full market-pattern',
        compact ? undefined : 'lg:hidden'
      )}
    >
      <div className="sticky top-0 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-4 h-[64px] flex justify-between items-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">
            {dict.notifications.title}
          </h2>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="px-2 py-0.5 rounded-[20px] bg-primary/10 dark:bg-white/[0.18]"
              >
                <span className="font-inter font-bold text-[10px] text-primary dark:text-white">
                  {unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl shrink-0
                       bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                       font-inter font-semibold text-[11px] text-text-secondary-light dark:text-text-secondary-dark
                       hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
          >
            <CheckCheck size={11} /> {dict.notifications.markAllRead}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {FILTER_KEYS.map((key) => (
              <MobileFilterChip
                key={key}
                label={filterLabels[key]}
                isSelected={activeFilter === key}
                onTap={() => setActiveFilter(key)}
              />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-[18px] px-10">
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center
                           bg-primary/[0.07] dark:bg-white/[0.10]"
              >
                <BellOff
                  size={28}
                  className="text-primary/50 dark:text-white/50"
                />
              </div>
              <div className="text-center">
                <p className="font-outfit font-bold text-[15px] tracking-[-0.3px] text-text-primary-light dark:text-text-primary-dark mb-2">
                  {dict.notifications.noNotifications}
                </p>
                <p className="font-inter text-[12px] text-text-secondary-light/75 dark:text-text-secondary-dark/75 leading-[1.5]">
                  {dict.notifications.noNotificationsDesc}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-[10px]">
              <AnimatePresence mode="popLayout">
                {filtered.map((n) => (
                  <MobileNotifCard
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
    </div>
  )
}

export default function NotificationsPanel({ compact }: { compact?: boolean }) {
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

  const sharedState: NotifPageState = {
    notifications,
    activeFilter,
    setActiveFilter,
    unreadCount,
    filtered,
    markRead,
    markAllRead,
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      {!compact && (
        <>
          <DesktopNotifications state={sharedState} />
          <MobileNotifications state={sharedState} />
        </>
      )}

      {compact && <MobileNotifications state={sharedState} compact />}
    </div>
  )
}
