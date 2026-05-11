'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  BookMarked,
  Radar,
  Bell,
  LogOut,
  HelpCircle,
  Settings,
  CreditCard,
  User,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSidebar } from './SidebarContext'

// ─── Logo ─────────────────────────────────────────────────────────────────────
function RavenLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/ravanlogo.png"
      alt="Raven AI logo"
      width={26}
      height={26}
      className={cn('object-contain shrink-0', className)}
    />
  )
}

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────
function Tip({ label, children, disabled }: { label: string; children: React.ReactNode; disabled?: boolean }) {
  const [visible, setVisible] = useState(false)
  if (disabled) return <>{children}</>

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.14 }}
            className={cn(
              'pointer-events-none absolute right-full mr-2.5 z-50',
              'px-2.5 py-1.5 rounded-lg whitespace-nowrap',
              'bg-[#1A1A24] dark:bg-white/90',
              'text-white dark:text-[#1A1A24]',
              'font-inter font-medium text-[11px]',
              'shadow-xl border border-white/10 dark:border-black/10'
            )}
          >
            {label}
            <span
              className={cn(
                'absolute top-1/2 -translate-y-1/2 left-full',
                'border-4 border-transparent border-l-[#1A1A24] dark:border-l-white/90'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


// ─── Strip content ────────────────────────────────────────────────────────────
function StripContent({ 
  isExpanded, 
  activePanel,
  setActivePanel,
  onClose 
}: { 
  isExpanded: boolean; 
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
  onClose?: () => void 
}) {
  const { dict } = useLanguage()

  const navItems = [
    { key: 'chat', icon: MessageSquare, label: dict.sidebar.newChat },
    { key: 'watchlist', icon: BookMarked, label: dict.sidebar.watchlist },
    { key: 'radar', icon: Radar, label: dict.sidebar.aiRadar },
    { key: 'notifications', icon: Bell, label: dict.sidebar.notifications },
  ]

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Top Header: Logo (Acts as toggle indirectly) */}
      <div className="h-14 flex items-center px-[22px] border-b border-border-light dark:border-[#1C1C28] w-full shrink-0">
        <div className="flex items-center gap-3 w-full">
          <div className="w-[26px] h-[26px] shrink-0 flex items-center justify-center">
             <RavenLogo />
          </div>
          <motion.div 
            animate={{ 
              opacity: isExpanded ? 1 : 0,
              x: isExpanded ? 0 : -10,
              display: isExpanded ? 'block' : 'none'
            }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <span className="font-outfit font-bold text-[16px] text-primary dark:text-white whitespace-nowrap">Raven AI</span>
          </motion.div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5 pt-4 px-3 w-full shrink-0">
        {navItems.map(({ key, icon: Icon, label }) => {
          const active = activePanel === key
          return (
            <Tip key={label} label={label} disabled={isExpanded}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActivePanel(active ? null : key)
                  if (onClose) onClose()
                }}
                className={cn(
                  'flex items-center h-11 rounded-xl transition-all duration-300 relative group overflow-hidden w-full',
                  active
                    ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:text-text-primary-light dark:hover:text-text-primary-dark'
                )}
              >
                <div className="w-[46px] h-11 shrink-0 flex items-center justify-center">
                  <Icon size={19} strokeWidth={active ? 2.5 : 2} className={cn(active && 'text-primary dark:text-white')} />
                </div>
                <div className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300 flex-1",
                  isExpanded ? "opacity-100 ml-0.5" : "opacity-0 w-0 ml-0"
                )}>
                  <span className="font-inter font-medium text-[13px]">{label}</span>
                </div>
                {active && isExpanded && (
                  <span className="absolute top-1/2 -translate-y-1/2 right-2 w-1.5 h-1.5 rounded-full bg-primary dark:bg-white" />
                )}
              </button>
            </Tip>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function Sidebar({
  activePanel,
  setActivePanel,
}: {
  activePanel: string | null
  setActivePanel: (panel: string | null) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { mobileOpen } = useSidebar()

  return (
    <aside
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        'flex flex-col h-screen shrink-0 relative z-30 select-none overflow-hidden transition-all duration-300 ease-in-out bg-card-light dark:bg-[#1A1A24] border-l border-border-light dark:border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]',
        'cursor-pointer group/sidebar',
        // Mobile widths: w-0 when closed, thin width when open
        mobileOpen ? 'w-16' : 'w-0',
        // Desktop widths (overrides mobile widths at lg breakpoint)
        isExpanded ? 'lg:w-[190px]' : 'lg:w-[72px]',
        // Hover effects
        'hover:bg-black/[0.01] dark:hover:bg-white/[0.01]'
      )}
    >
      {/* Subtle hover effect indicator when collapsed */}
      <div className={cn(
        "absolute inset-y-0 left-0 w-[2px] bg-primary/0 group-hover/sidebar:bg-primary/20 transition-colors",
        isExpanded && "hidden"
      )} />
      
      <div className={cn(
        "h-full w-full transition-opacity duration-300",
        !mobileOpen && "max-lg:opacity-0"
      )}>
        <StripContent 
          isExpanded={isExpanded} 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} 
        />
      </div>
    </aside>
  )
}
