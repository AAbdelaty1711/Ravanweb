// ─── Badge ────────────────────────────────────────────────────────────────────
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 rounded-full font-inter font-bold",
  {
    variants: {
      variant: {
        default: "bg-primary-DEFAULT/10 text-primary-DEFAULT dark:bg-white/15 dark:text-white text-[10px]",
        bull:    "bg-bull/12 text-bull border border-bull/18 text-[10px]",
        bear:    "bg-bear/12 text-bear border border-bear/18 text-[10px]",
        warning: "bg-warning/12 text-warning text-[10px]",
        purple:  "bg-purple-500/10 text-purple-500 text-[10px]",
        blue:    "bg-blue-500/10 text-blue-500 text-[10px]",
        green:   "bg-green-500/10 text-green-500 text-[10px]",
        amber:   "bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]",
        red:     "bg-red-500/10 text-red-500 text-[10px]",
        slate:   "bg-slate-400/10 text-slate-500 dark:text-slate-400 text-[10px]",
        gray:    "bg-gray-400/10 text-gray-500 dark:text-gray-400 text-[10px]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

// ─── Sheet ────────────────────────────────────────────────────────────────────
// Reusable bottom-sheet modal wrapper (used by AddStock, TimeFilter, EditProfile, etc.)

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Max width for the sheet panel — defaults to md */
  maxWidth?: "sm" | "md" | "lg" | "full";
}

const sheetMaxWidth = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "max-w-full",
};

export function Sheet({ open, onClose, children, className, maxWidth = "md" }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative z-10 w-full",
              sheetMaxWidth[maxWidth],
              "bg-background-muted dark:bg-background-dark",
              "rounded-t-[24px]",
              "max-h-[90vh] flex flex-col overflow-hidden",
              className
            )}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FilterChip ───────────────────────────────────────────────────────────────
export function FilterChip({
  label,
  active,
  onTap,
  className,
}: {
  label: string;
  active: boolean;
  onTap: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onTap}
      className={cn(
        "raven-chip shrink-0",
        active ? "raven-chip-active" : "raven-chip-inactive",
        className
      )}
    >
      {label}
    </motion.button>
  );
}
