"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function RavenMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/ravanlogo.png"
      alt="Raven AI logo"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
