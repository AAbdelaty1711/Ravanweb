"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, BookMarked, Radar, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: MessageSquare, label: "Chat" },
  { href: "/watchlist", icon: BookMarked, label: "Watchlist" },
  { href: "/ai-radar", icon: Radar, label: "Radar" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 lg:hidden",
        "bg-card-light/95 dark:bg-card-dark/95 backdrop-blur-[20px]",
        "border-t border-border-light dark:border-[#141414]",
        "safe-area-pb"
      )}
    >
      <div className="flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-2 relative"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-primary dark:bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  opacity: active ? 1 : 0.55,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 25 }}
              >
                <Icon
                  size={20}
                  className={cn(
                    active
                      ? "text-primary dark:text-white"
                      : "text-text-secondary-light dark:text-text-secondary-dark"
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "font-inter text-[10px] font-semibold leading-none",
                  active
                    ? "text-primary dark:text-white"
                    : "text-text-secondary-light dark:text-text-secondary-dark"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

