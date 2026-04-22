"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", icon: MessageSquare, label: "AI Chat" },
  { href: "/watchlist", icon: BookMarked, label: "Watchlist" },
  { href: "/ai-radar", icon: Radar, label: "AI Radar" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
];

const RECENT_CHATS = [
  { id: "1", label: "AAPL Trend Analysis" },
  { id: "2", label: "NVDA Forecast Q2" },
  { id: "3", label: "Market Summary" },
];
const OLDER_CHATS = [
  { id: "4", label: "Portfolio Health" },
  { id: "5", label: "Tech Sector Outlook" },
];

function RavenLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/ravanlogo.png"
      alt="Raven AI logo"
      width={24}
      height={24}
      className={cn("object-contain shrink-0", className)}
    />
  );
}

// ─── User profile popover ─────────────────────────────────────────────────────
function UserPopover({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    { icon: User, label: "Profile", action: () => { router.push("/profile"); onClose(); } },
    { icon: Settings, label: "Settings", action: () => { router.push("/profile"); onClose(); } },
    { icon: CreditCard, label: "Upgrade to Pro", action: onClose },
    { icon: HelpCircle, label: "Help & Support", action: onClose },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6, scale: 0.97, x: "-50%" }}
      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
      exit={{ opacity: 0, y: 6, scale: 0.97, x: "-50%" }}
      transition={{ duration: 0.15 }}
      className={cn(
        "absolute bottom-full mb-2 z-50",
        "bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl",
        "border border-gray-200 dark:border-white/10",
        "overflow-hidden w-56 left-1/2"
      )}
    >
      {/* User header */}
      <div className="px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/12 dark:bg-white/12 flex items-center justify-center shrink-0">
            <span className="font-outfit font-bold text-[13px] text-primary dark:text-white">AA</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-inter font-semibold text-[13px] text-text-primary-light dark:text-text-primary-dark truncate">
              Ahmed Abdelaty
            </p>
            <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark truncate">
              Free Plan
            </p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {items.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left
                       hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            <Icon size={14} className="text-text-secondary-light dark:text-text-secondary-dark shrink-0" />
            <span className="font-inter text-[13px] text-text-primary-light dark:text-text-primary-dark">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 dark:border-white/[0.06] py-1">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left
                     hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={14} className="text-red-500 shrink-0" />
          <span className="font-inter text-[13px] text-red-500">Log out</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Sidebar inner content ────────────────────────────────────────────────────
function SidebarContent({
  collapsed,
  onCollapse,
  onClose,
}: {
  collapsed: boolean;
  onCollapse?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showUserPopover, setShowUserPopover] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* ── Brand header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-3.5 h-14 border-b border-border-light dark:border-[#1C1C28] shrink-0">
        <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center">
          <RavenLogo />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="font-outfit font-bold text-[17px] text-primary dark:text-white whitespace-nowrap leading-none flex-1"
            >
              Raven AI
            </motion.span>
          )}
        </AnimatePresence>

        {/* Collapse toggle (desktop only) */}
        {onCollapse && (
          <button
            onClick={onCollapse}
            className={cn(
              "shrink-0 w-6 h-6 rounded-md flex items-center justify-center",
              "text-text-secondary-light dark:text-text-secondary-dark",
              "hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
              collapsed && "ml-auto mr-0"
            )}
          >
            <motion.span animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={14} />
            </motion.span>
          </button>
        )}

        {/* Close (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center
                       text-text-secondary-light dark:text-text-secondary-dark
                       hover:bg-black/5 dark:hover:bg-white/5 transition-colors ml-auto"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── New chat ────────────────────────────────────────────────── */}
      <div className="px-2.5 pt-3 pb-2 shrink-0">
        <Link href="/" onClick={onClose}>
          <div className={cn(
            "flex items-center gap-2 rounded-xl border cursor-pointer transition-all",
            "border-primary/15 dark:border-white/12",
            "bg-primary/[0.04] dark:bg-white/[0.04]",
            "text-primary dark:text-white/70",
            "hover:bg-primary/[0.07] dark:hover:bg-white/[0.07]",
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          )}>
            <Plus size={15} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-inter font-semibold text-[13px] whitespace-nowrap"
                >
                  New Chat
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>

      {/* ── Nav items ───────────────────────────────────────────────── */}
      <nav className="px-2.5 space-y-0.5 shrink-0">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}>
              <div className={cn(
                "flex items-center gap-2.5 rounded-xl transition-colors cursor-pointer",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                active
                  ? "bg-primary/[0.08] dark:bg-white/[0.08] text-primary dark:text-white"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-text-primary-light dark:hover:text-text-primary-dark"
              )}>
                <Icon size={16} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center flex-1 gap-2"
                    >
                      <span className="font-inter font-medium text-[13px] whitespace-nowrap flex-1">
                        {label}
                      </span>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Chat history ────────────────────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-2.5 pt-3 min-h-0"
          >
            <HistorySection label="Today" chats={RECENT_CHATS} onClose={onClose} />
            <HistorySection label="Previous 7 Days" chats={OLDER_CHATS} onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
      {collapsed && <div className="flex-1" />}

      {/* ── User profile bottom ─────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border-light dark:border-[#1C1C28] p-2.5 relative">
        <AnimatePresence>
          {showUserPopover && (
            <UserPopover collapsed={collapsed} onClose={() => setShowUserPopover(false)} />
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowUserPopover(!showUserPopover)}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-xl transition-colors cursor-pointer",
            "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]",
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-primary/12 dark:bg-white/12 flex items-center justify-center shrink-0">
            <span className="font-outfit font-bold text-[11px] text-primary dark:text-white">AA</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 text-left min-w-0"
              >
                <p className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark truncate leading-tight">
                  Ahmed Abdelaty
                </p>
                <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark truncate leading-tight">
                  Free Plan
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <ChevronRight
              size={13}
              className={cn(
                "shrink-0 text-text-secondary-light/50 dark:text-text-secondary-dark/50 transition-transform",
                showUserPopover && "rotate-90"
              )}
            />
          )}
        </button>
      </div>
    </div>
  );
}

function HistorySection({
  label,
  chats,
  onClose,
}: {
  label: string;
  chats: { id: string; label: string }[];
  onClose?: () => void;
}) {
  return (
    <div className="mb-2">
      <p className="px-3 pt-2 pb-1 font-inter font-bold text-[10px] tracking-[1.2px] uppercase
                    text-text-secondary-light/50 dark:text-text-secondary-dark/50">
        {label}
      </p>
      {chats.map((chat) => (
        <Link key={chat.id} href="/" onClick={onClose}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                          hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
            <MessageSquare size={13} className="shrink-0 text-text-secondary-light/35 dark:text-text-secondary-dark/35" />
            <span className="font-inter text-[12.5px] text-text-primary-light/75 dark:text-text-primary-dark/75 truncate flex-1">
              {chat.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Main export: Desktop sidebar + Mobile drawer ─────────────────────────────
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 w-9 h-9 rounded-xl flex items-center justify-center
                   bg-white dark:bg-[#111118] border border-gray-200 dark:border-white/10 shadow-sm"
        aria-label="Open menu"
      >
        <Menu size={17} className="text-primary dark:text-white" />
      </button>

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
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[272px]
                         bg-card-light dark:bg-card-dark
                         border-r border-border-light dark:border-[#1C1C28]"
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
        animate={{ width: collapsed ? 60 : 260 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col h-screen
                   bg-card-light dark:bg-card-dark
                   border-r border-border-light dark:border-[#1C1C28]
                   relative z-30 overflow-hidden select-none shrink-0"
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
      </motion.aside>
    </>
  );
}
