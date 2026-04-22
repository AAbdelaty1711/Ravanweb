"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  BookMarked,
  Radar,
  Bell,
  User,
  LogOut,
  Plus,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";


// ─── Navigation items (mirror Flutter drawer menu) ──────────────────────────
const NAV_ITEMS = [
  { href: "/", icon: MessageSquare, label: "AI Chat" },
  { href: "/watchlist", icon: BookMarked, label: "Watchlist" },
  { href: "/ai-radar", icon: Radar, label: "AI Radar" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/profile", icon: User, label: "Profile" },
];

// ─── Mock recent chats (Flutter drawer history section) ─────────────────────
const RECENT_CHATS = [
  { id: "1", label: "AAPL Trend Analysis" },
  { id: "2", label: "NVDA Forecast Q2" },
  { id: "3", label: "Market Summary" },
];

const OLDER_CHATS = [
  { id: "4", label: "Portfolio Health" },
  { id: "5", label: "Tech Sector Outlook" },
  { id: "6", label: "Top Gainers 3/20" },
];

// ─── Logo SVG (Raven brand mark) ─────────────────────────────────────────────
function RavenLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/ravanlogo.png"
      alt="Raven AI logo"
      width={24}
      height={24}
      className={cn("object-contain", className)}
    />
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "hidden lg:flex flex-col h-screen",
        "bg-card-light dark:bg-card-dark",
        "border-r border-border-light dark:border-[#141414]",
        "relative z-30 overflow-hidden",
        "select-none"
      )}
    >
      {/* ── Brand header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border-light dark:border-[#141414] shrink-0">
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary dark:bg-white/10 flex items-center justify-center">
          <RavenLogo className="text-white dark:text-white w-5 h-5" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="font-outfit font-bold text-[18px] text-primary dark:text-white whitespace-nowrap leading-none">
                Raven AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                     text-text-secondary-light dark:text-text-secondary-dark
                     hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronRight size={14} />
          </motion.span>
        </button>
      </div>

      {/* ── New chat button ───────────────────────────────────────────── */}
      <div className={cn("px-3 pt-4 pb-2 shrink-0")}>
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2.5 rounded-[14px] border cursor-pointer",
              "border-primary/18 dark:border-white/18",
              "bg-primary/[0.04] dark:bg-white/[0.04]",
              "text-primary dark:text-white/70",
              "transition-colors hover:bg-primary/[0.06] dark:hover:bg-white/[0.06]",
              collapsed ? "justify-center p-3" : "px-4 py-3"
            )}
          >
            <Plus size={16} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-inter font-semibold text-[14px] whitespace-nowrap"
                >
                  New Chat
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>

      {/* ── Nav items ────────────────────────────────────────────────── */}
      <nav className="px-3 space-y-0.5 shrink-0">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 rounded-[10px] transition-colors cursor-pointer",
                  collapsed ? "justify-center p-3" : "px-3 py-2.5",
                  active
                    ? "bg-primary/[0.08] dark:bg-white/[0.08] text-primary dark:text-white"
                    : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-text-primary-light dark:hover:text-text-primary-dark"
                )}
              >
                <Icon size={17} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-inter font-medium text-[13px] whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && !collapsed && (
                  <motion.div
                    layoutId="active-sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary dark:bg-white"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Chat history ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-3 pt-4 space-y-1 min-h-0"
          >
            <ChatHistorySection label="Today" chats={RECENT_CHATS} />
            <ChatHistorySection label="Previous 7 Days" chats={OLDER_CHATS} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border-light dark:border-[#141414] px-3 py-3 space-y-0.5">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 cursor-pointer",
            "text-text-secondary-light dark:text-text-secondary-dark",
            "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]",
            "transition-colors",
            collapsed && "justify-center"
          )}
        >
          <Settings size={16} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-inter font-medium text-[13px] whitespace-nowrap"
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Logout */}
        <button
          className={cn(
            "w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 cursor-pointer",
            "text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-900/10",
            "transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-inter font-semibold text-[14px] whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

// ─── Chat history section ────────────────────────────────────────────────────
function ChatHistorySection({
  label,
  chats,
}: {
  label: string;
  chats: { id: string; label: string }[];
}) {
  return (
    <div>
      <p className="px-3 pt-2 pb-1 font-inter font-bold text-[10px] tracking-[1.2px] uppercase text-text-secondary-light/60 dark:text-text-secondary-dark/60">
        {label}
      </p>
      {chats.map((chat) => (
        <Link key={chat.id} href="/">
          <div className="flex items-center gap-3 px-3 py-2 rounded-[10px] cursor-pointer group
                          hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
            <MessageSquare
              size={14}
              className="shrink-0 text-text-secondary-light/40 dark:text-text-secondary-dark/40"
            />
            <span className="font-inter text-[13px] text-text-primary-light/80 dark:text-text-primary-dark/80
                             truncate flex-1">
              {chat.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

