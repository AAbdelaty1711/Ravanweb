import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price to always show 2 decimal places */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/** Format percentage change with sign */
export function formatPct(pct: number): string {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

/** Get favicon URL for a stock domain (mirrors stockFaviconUrlForDomain) */
export function stockFaviconUrl(domain: string): string {
  return `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=128`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}
