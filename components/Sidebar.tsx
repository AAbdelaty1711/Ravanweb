'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  BookMarked,
  Radar,
  Bell,
  LogOut,
  Plus,
  ChevronRight,
  HelpCircle,
  Settings,
  CreditCard,
  User,
  Menu,
  X,
  LineChart,
  MoreHorizontal,
  Pin,
  Pencil,
  Archive,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

function RavenLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/ravanlogo.png"
      alt="Raven AI logo"
      width={24}
      height={24}
      className={cn('object-contain shrink-0', className)}
    />
  )
}

// ─── User profile popover ─────────────────────────────────────────────────────
function UserPopover({
  collapsed,
  onClose,
  triggerRef,
}: {
  collapsed: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const router = useRouter()
  const { dict, isRTL } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    router.prefetch('/dashboard/profile')

    const handler = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef, router])

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

  const handleLogout = () => {
    document.cookie =
      'raven_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
    onClose()
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6, scale: 0.97, x: '-50%' }}
      animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
      exit={{ opacity: 0, y: 6, scale: 0.97, x: '-50%' }}
      transition={{ duration: 0.15 }}
      className={cn(
        'absolute bottom-full mb-2 z-50',
        'bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl',
        'border border-gray-200 dark:border-white/10',
        'overflow-hidden w-56 left-1/2'
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
          onClick={handleLogout}
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

// ─── Sidebar inner content ────────────────────────────────────────────────────
function SidebarContent({
  collapsed,
  onCollapse,
  onClose,
}: {
  collapsed: boolean
  onCollapse?: () => void
  onClose?: () => void
}) {
  const pathname = usePathname()
  const { dict, isRTL } = useLanguage()
  const [showUserPopover, setShowUserPopover] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const navItems = [
    {
      href: '/dashboard/watchlist',
      icon: BookMarked,
      label: dict.sidebar.watchlist,
    },
    { href: '/dashboard/ai-radar', icon: Radar, label: dict.sidebar.aiRadar },
    { href: '/dashboard/aichart', icon: LineChart, label: 'AI Chart' },
    {
      href: '/dashboard/notifications',
      icon: Bell,
      label: dict.sidebar.notifications,
    },
  ]

  const recentChats = [
    { id: '1', label: 'AAPL Trend Analysis' },
    { id: '2', label: 'NVDA Forecast Q2' },
    { id: '3', label: 'Market Summary' },
  ]
  const olderChats = [
    { id: '4', label: 'Portfolio Health' },
    { id: '5', label: 'Tech Sector Outlook' },
  ]

  return (
    <div className="flex flex-col h-full w-full">
      {/* ── Brand header ───────────────────────────────────────────── */}
      <div className="flex items-center h-14 border-b border-border-light dark:border-[#1C1C28] shrink-0 px-2 overflow-hidden relative">
        <div className="w-[48px] shrink-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center">
            <RavenLogo />
          </div>
        </div>
        <span
          className={cn(
            'font-outfit font-bold text-[17px] text-primary dark:text-white whitespace-nowrap transition-opacity duration-200 flex-1',
            collapsed ? 'opacity-0' : 'opacity-100'
          )}
        >
          Raven AI
        </span>

        <div
          className={cn(
            'shrink-0 flex items-center gap-1 transition-opacity duration-200',
            collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          {onCollapse && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCollapse()
              }}
              className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronRight
                size={12}
                className={cn('rotate-180', isRTL && 'rotate-0')}
              />
            </button>
          )}

          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── New chat ────────────────────────────────────────────────── */}
      <div className="px-2 pt-3 pb-2 shrink-0">
        <Link
          href="/dashboard"
          onClick={onClose}
          prefetch={true}
          className="block w-full"
        >
          <div
            className={cn(
              'flex items-center h-10 rounded-xl border cursor-pointer transition-all overflow-hidden',
              'border-primary/15 dark:border-white/12',
              'bg-primary/[0.04] dark:bg-white/[0.04] hover:bg-primary/[0.07] dark:hover:bg-white/[0.07]',
              'text-primary dark:text-white/70'
            )}
          >
            <div className="w-[48px] shrink-0 flex items-center justify-center">
              <Plus size={14} />
            </div>
            <span
              className={cn(
                'font-inter font-semibold text-[12px] whitespace-nowrap pr-3 transition-opacity duration-200',
                collapsed ? 'opacity-0' : 'opacity-100'
              )}
            >
              {dict.sidebar.newChat}
            </span>
          </div>
        </Link>
      </div>

      {/* ── Nav items ───────────────────────────────────────────────── */}
      <nav className="px-2 space-y-0.5 shrink-0 w-full">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              prefetch={true}
              className="block w-full"
            >
              <div
                className={cn(
                  'flex items-center h-10 rounded-xl cursor-pointer transition-colors overflow-hidden',
                  active
                    ? 'text-primary dark:text-white'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-text-primary-light dark:hover:text-text-primary-dark'
                )}
              >
                <div className="w-[48px] shrink-0 flex items-center justify-center relative z-10">
                  <Icon size={16} />
                </div>
                <div
                  className={cn(
                    'flex items-center flex-1 pr-3 transition-opacity duration-200',
                    collapsed ? 'opacity-0' : 'opacity-100'
                  )}
                >
                  <span className="font-inter font-medium text-[12px] whitespace-nowrap flex-1 text-start">
                    {label}
                  </span>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-white shrink-0 ml-2" />
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* ── Chat history ────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex-1 overflow-y-auto px-2 pt-3 min-h-0 transition-opacity duration-200',
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      >
        {!collapsed && (
          <>
            <HistorySection
              label={dict.sidebar.today}
              chats={recentChats}
              onClose={onClose}
            />
            <HistorySection
              label={dict.sidebar.previous7Days}
              chats={olderChats}
              onClose={onClose}
            />
          </>
        )}
      </div>

      {/* ── User profile bottom ─────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border-light dark:border-[#1C1C28] p-2 relative">
        <AnimatePresence>
          {showUserPopover && (
            <UserPopover
              collapsed={collapsed}
              onClose={() => setShowUserPopover(false)}
              triggerRef={triggerRef}
            />
          )}
        </AnimatePresence>

        <button
          ref={triggerRef}
          onClick={() => setShowUserPopover(!showUserPopover)}
          className={cn(
            'w-full flex items-center h-10 rounded-xl transition-colors cursor-pointer overflow-hidden',
            'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
          )}
        >
          <div className="w-[48px] shrink-0 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-primary/12 dark:bg-white/12 flex items-center justify-center">
              <span className="font-outfit font-bold text-[10px] text-primary dark:text-white">
                AA
              </span>
            </div>
          </div>
          <div
            className={cn(
              'flex items-center flex-1 pr-2 min-w-0 transition-opacity duration-200',
              collapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            <div className="flex-1 text-start min-w-0">
              <p className="font-inter font-semibold text-[11px] text-text-primary-light dark:text-text-primary-dark truncate leading-tight">
                Ahmed Abdelaty
              </p>
              <p className="font-inter text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate leading-tight">
                Free Plan
              </p>
            </div>
            <ChevronRight
              size={11}
              className={cn(
                'shrink-0 text-text-secondary-light/50 dark:text-text-secondary-dark/50 transition-transform',
                showUserPopover && (isRTL ? '-rotate-90' : 'rotate-90'),
                isRTL && !showUserPopover && 'rotate-180'
              )}
            />
          </div>
        </button>
      </div>
    </div>
  )
}

function ChatItem({
  chat,
  onClose,
}: {
  chat: { id: string; label: string }
  onClose?: () => void
}) {
  const [showPopover, setShowPopover] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false)
      }
    }
    if (showPopover) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPopover])

  return (
    <div className="relative">
      <Link href="/dashboard" onClick={onClose} prefetch={true} className="block group">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
          <MessageSquare
            size={11}
            className="shrink-0 text-text-secondary-light/35 dark:text-text-secondary-dark/35"
          />
          <span className="font-inter text-[12.5px] text-text-primary-light/75 dark:text-text-primary-dark/75 truncate flex-1">
            {chat.label}
          </span>
          <button
            ref={triggerRef}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowPopover(!showPopover)
            }}
            className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            <MoreHorizontal size={12} className="text-text-secondary-light/50 dark:text-text-secondary-dark/50" />
          </button>
        </div>
      </Link>

      <AnimatePresence>
        {showPopover && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 right-6 top-8 w-40 py-1.5 rounded-xl shadow-lg border',
              'bg-white dark:bg-[#1A1A24]',
              'border-gray-200 dark:border-white/10'
            )}
          >
            <button
              onClick={() => setShowPopover(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-start hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <Pin size={11} className="text-text-secondary-light dark:text-text-secondary-dark" />
              <span className="font-inter text-[11px] text-text-primary-light dark:text-text-primary-dark">Pin chat</span>
            </button>
            <button
              onClick={() => setShowPopover(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-start hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <Pencil size={11} className="text-text-secondary-light dark:text-text-secondary-dark" />
              <span className="font-inter text-[11px] text-text-primary-light dark:text-text-primary-dark">Rename</span>
            </button>
            <button
              onClick={() => setShowPopover(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-start hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <Archive size={11} className="text-text-secondary-light dark:text-text-secondary-dark" />
              <span className="font-inter text-[11px] text-text-primary-light dark:text-text-primary-dark">Archive</span>
            </button>
            <button
              onClick={() => setShowPopover(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-start hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <Trash2 size={11} className="text-red-500" />
              <span className="font-inter text-[11px] text-red-500">Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HistorySection({
  label,
  chats,
  onClose,
}: {
  label: string
  chats: { id: string; label: string }[]
  onClose?: () => void
}) {
  return (
    <div className="mb-2 text-start">
      <p className="px-3 pt-2 pb-1 font-inter font-bold text-[10px] tracking-[1.2px] uppercase text-text-secondary-light/50 dark:text-text-secondary-dark/50">
        {label}
      </p>
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} onClose={onClose} />
      ))}
    </div>
  )
}

import { useSidebar } from './SidebarContext'

// ─── Main export: Desktop sidebar + Mobile drawer ─────────────────────────────
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { mobileOpen, setMobileOpen } = useSidebar()
  const { isRTL } = useLanguage()

  return (
    <>
      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: isRTL ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 280 : -280 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className={cn(
                'lg:hidden fixed top-0 bottom-0 z-50 w-[272px] bg-card-light dark:bg-card-dark border-border-light dark:border-[#1C1C28]',
                isRTL ? 'right-0 border-l' : 'left-0 border-r'
              )}
            >
              <SidebarContent
                collapsed={false}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 230 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => {
          if (collapsed) setCollapsed(false)
        }}
        className={cn(
          'hidden lg:flex flex-col h-screen bg-card-light dark:bg-card-dark border-border-light dark:border-[#1C1C28] relative z-30 overflow-hidden select-none shrink-0',
          collapsed &&
            'cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors',
          isRTL ? 'border-l' : 'border-r'
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
      </motion.aside>
    </>
  )
}
