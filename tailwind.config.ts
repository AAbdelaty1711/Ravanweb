import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Colors from colors.dart + app_theme.dart ───────────────────
      colors: {
        // Primary brand
        primary: {
          DEFAULT: "#0B1F3A",   // AppColors.primary (light)
          dark: "#FFFFFF",       // AppColors.primaryDark
        },
        // Backgrounds
        background: {
          light: "#F9FAFB",      // AppColors.backgroundLight
          dark: "#0F0F0F",       // AppColors.backgroundDark
          muted: "#F2F3F5",      // watchlist / add-stock page bg (light)
        },
        // Cards
        card: {
          light: "#FFFFFF",      // AppColors.cardLight
          dark: "#000000",       // AppColors.cardDark
        },
        // Borders
        border: {
          light: "#E5E7EB",      // AppColors.borderLight
          dark: "#141414",       // AppColors.borderDark
        },
        // Inputs
        input: {
          light: "#F3F4F6",      // AppColors.inputLight
          dark: "#0A0A0A",       // AppColors.inputDark
        },
        // Text
        text: {
          primary: {
            light: "#0B1F3A",    // AppColors.textPrimaryLight
            dark: "#FFFFFF",     // AppColors.textPrimaryDark
          },
          secondary: {
            light: "#6B7280",    // AppColors.textSecondaryLight
            dark: "#9CA3AF",     // AppColors.textSecondaryDark
          },
        },
        // Pattern overlay
        pattern: {
          light: "#0B1F3A",      // AppColors.patternLight
          dark: "#132A47",       // AppColors.patternDark
        },
        // Trading signal colors (from watchlist, radar)
        bull: "#34C759",         // isUp → green
        bear: "#FF453A",         // !isUp → red
        warning: "#FF9F0A",      // hasWarning → amber
        // Radar action colors
        radar: {
          buy: "#22c55e",        // RadarAction.buy → Colors.green
          watch: "#64748b",      // RadarAction.watch → Colors.blueGrey
          avoid: "#ef4444",      // RadarAction.avoid → Colors.red
          closed: "#6b7280",     // isClosed → Colors.grey.shade500
        },
        // Notification type colors
        notification: {
          ai: "#9B59B6",         // NotificationType.aiInsight → purple
          price: "#27AE60",      // NotificationType.priceAlert → green
          market: "#2980B9",     // NotificationType.marketUpdate → blue
          system: "#F39C12",     // NotificationType.systemAlert → amber
        },
      },

      // ─── Typography from text_styles.dart ───────────────────────────
      fontFamily: {
        // Outfit = Google Fonts "Outfit" (headlines, tickers, display)
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
        // Inter = Google Fonts "Inter" (body, labels, numbers)
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // AppTextStyles equivalents
        "display": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline": ["20px", { lineHeight: "1.25", fontWeight: "700" }],
        "title": ["18px", { lineHeight: "1.3", fontWeight: "600" }],
        "body": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "label": ["11px", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.5px" }],
        "caption": ["10px", { lineHeight: "1.3", fontWeight: "500" }],
        // Watchlist specific sizes
        "ticker": ["13px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.2px" }],
        "price": ["13px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.35px" }],
        "target": ["11px", { lineHeight: "1.2", fontWeight: "500" }],
        "tag": ["9px", { lineHeight: "1.1", fontWeight: "600" }],
      },

      // ─── Border radius ────────────────────────────────────────────
      borderRadius: {
        "card": "16px",          // standard card radius
        "chip": "20px",          // filter chips
        "input": "14px",         // search fields
        "btn": "12px",           // buttons
        "avatar": "12px",        // logo / avatar containers
        "tag": "20px",           // tags / badges
      },

      // ─── Box shadows ──────────────────────────────────────────────
      boxShadow: {
        "card-light": "0 2px 12px rgba(11,31,58,0.06)",
        "card-dark": "0 2px 12px rgba(0,0,0,0.4)",
        "card-hover": "0 4px 24px rgba(11,31,58,0.12)",
        "avatar": "0 0 0 1px rgba(11,31,58,0.12)",
      },

      // ─── Animations ───────────────────────────────────────────────
      keyframes: {
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "dot-bounce": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "dot-1": "dot-bounce 1.4s ease-in-out infinite 0s",
        "dot-2": "dot-bounce 1.4s ease-in-out infinite 0.2s",
        "dot-3": "dot-bounce 1.4s ease-in-out infinite 0.4s",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16,1,0.3,1)",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16,1,0.3,1)",
      },

      // ─── Backdrop blur ────────────────────────────────────────────
      backdropBlur: {
        "sidebar": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
