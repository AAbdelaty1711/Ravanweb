import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

// ─── Variants ─────────────────────────────────────────────────────────────────
const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-2",
    "font-inter font-bold rounded-btn",
    "transition-opacity duration-150 select-none",
    "disabled:opacity-50 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        // Primary — filled (Login / Register / Save buttons)
        primary: [
          "bg-primary-DEFAULT dark:bg-white",
          "text-white dark:text-primary-DEFAULT",
          "hover:opacity-90",
        ],
        // Secondary — outlined
        secondary: [
          "border border-border-light dark:border-border-dark",
          "bg-transparent text-text-primary-light dark:text-text-primary-dark",
          "hover:bg-black/[0.025] dark:hover:bg-white/[0.04]",
        ],
        // Ghost — no border, subtle hover
        ghost: [
          "bg-transparent",
          "text-text-secondary-light dark:text-text-secondary-dark",
          "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
          "hover:text-text-primary-light dark:hover:text-text-primary-dark",
        ],
        // Danger — red destructive
        danger: [
          "bg-red-500/10 border border-red-500/25",
          "text-red-500",
          "hover:bg-red-500/15",
        ],
        // Icon button — circle
        icon: [
          "rounded-full w-9 h-9",
          "bg-white dark:bg-white/[0.06]",
          "border border-gray-200 dark:border-white/10",
          "text-text-primary-light dark:text-text-primary-dark",
          "hover:scale-105 active:scale-95",
        ],
      },
      size: {
        sm: "h-8 px-3 text-[12px]",
        md: "h-[44px] px-5 text-[13px]",
        lg: "h-[52px] px-6 text-[13px]",
        xl: "h-[52px] px-6 text-[15px]",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: variant === "icon" ? 1.05 : 1.01 }}
      whileTap={{ scale: variant === "icon" ? 0.95 : 0.98 }}
      onClick={onClick as any}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
