import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

// ─── Google Fonts (mirrors Flutter's GoogleFonts.outfit + GoogleFonts.inter) ──
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raven AI – AI-Powered Stock Intelligence",
  description:
    "Real-time AI analysis, watchlist tracking, and radar signals for smarter trading.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Raven AI",
    description: "AI-Powered Stock Intelligence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} font-inter antialiased bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark`}
      >
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
