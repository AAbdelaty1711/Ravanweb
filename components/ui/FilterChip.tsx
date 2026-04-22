"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
