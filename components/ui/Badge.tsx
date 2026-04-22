import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

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
