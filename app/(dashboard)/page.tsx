"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowUp, Sparkles, TrendingUp, BarChart2, Zap, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { RavenMark } from "@/components/ui/RavenMark";
import { useSidebar } from "@/components/SidebarContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

// ─── Quick-start prompt cards (replaces Flutter _EmptyState prompt chips) ─────
const PROMPT_CARDS = [
  {
    icon: TrendingUp,
    title: "Analyze AAPL",
    subtitle: "Get AI insight on Apple",
    prompt: "Analyze AAPL momentum and targets",
    color: "from-[#636363]/10 to-[#636363]/5",
    border: "border-[#636363]/15",
  },
  {
    icon: Zap,
    title: "NVDA Forecast",
    subtitle: "NVIDIA Q2 outlook",
    prompt: "What is the AI forecast for NVDA this quarter?",
    color: "from-[#76B900]/10 to-[#76B900]/5",
    border: "border-[#76B900]/15",
  },
  {
    icon: BarChart2,
    title: "Market Summary",
    subtitle: "Today's key movers",
    prompt: "Give me a market summary and key movers for today",
    color: "from-primary/10 to-primary/5 dark:from-white/10 dark:to-white/5",
    border: "border-primary/12 dark:border-white/12",
  },
  {
    icon: Sparkles,
    title: "Top AI Signals",
    subtitle: "Radar highlights",
    prompt: "What are the top AI Radar signals today?",
    color: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/15",
  },
];

// ─── Mock AI response generator ───────────────────────────────────────────────
function generateAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("aapl") || q.includes("apple")) {
    return "AAPL is trading at $189.30, showing bullish momentum. Current price action suggests a push toward T1 at $198.00, backed by strong institutional accumulation. The Golden Cross on the daily chart confirms the uptrend. Disciplined entry near $187–190 with a stop below $184 offers a favorable risk/reward setup.";
  }
  if (q.includes("nvda") || q.includes("nvidia")) {
    return "NVDA continues to be a dominant force in AI infrastructure. At $875.20, momentum indicators (MACD, RSI) remain bullish. T1 sits at $920, T2 at $980. High volume surges over the past 3 sessions confirm institutional buying. However, the RSI at 72 signals slight overbought territory — consider scaling in on any pullback to $840–850.";
  }
  if (q.includes("tsla") || q.includes("tesla")) {
    return "TSLA faces headwinds at $248.50. The Death Cross on the weekly chart and insider selling signal caution. T1 downside target at $230, T2 at $215. Avoid new long positions until the stock reclaims the 50-day MA at $262. Risk management is critical here.";
  }
  if (q.includes("market") || q.includes("summary")) {
    return "Today's market shows mixed signals. NVDA and AMD leading tech higher on AI enthusiasm (+2.1%, +1.8%). TSLA and META lagging. The S&P 500 consolidates near all-time highs with low volatility (VIX at 14.2). Watch the Fed minutes release at 2PM ET — any hawkish surprise could trigger a rotation out of growth.";
  }
  if (q.includes("radar") || q.includes("signal")) {
    return "Top Raven AI Radar signals today: 🟢 NVDA — Golden Cross + High Volume (BUY). 🟢 PLTR — RSI Oversold bounce + Earnings Beat (BUY). 🟡 COIN — Gap Up with caution (WATCH). 🔴 TSLA — Death Cross + insider selling (AVOID). 🟢 SHOP — Breakout confirmed (BUY).";
  }
  return `Analyzing "${query}"… Raven AI is scanning momentum indicators, volume anomalies, and sentiment signals. AAPL and TSLA show diverging momentum — AAPL trending ↑ while TSLA consolidates under resistance. Broader indices hold steady. Position sizing discipline is key in the current macro environment.`;
}


// ─── Thinking dots indicator ──────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-3 px-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary/40 dark:bg-white/40"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── AI bubble (with Raven avatar) ───────────────────────────────────────────
function AIBubble({ text }: { text: string }) {
  // Highlight tickers and direction arrows
  const highlighted = text.split(/(\b(?:AAPL|NVDA|TSLA|MSFT|META|AMZN|GOOGL|PLTR|AMD|COIN|SHOP|SPOT|UBER|INTC|NFLX)\b|↑|↓)/g);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 mt-0.5 rounded-full bg-primary/10 dark:bg-white/10
                      flex items-center justify-center">
        <RavenMark size={20} className="text-primary dark:text-white" />
      </div>

      {/* Text */}
      <div className="font-inter text-[14px] text-text-primary-light dark:text-text-primary-dark leading-[1.6]
                      pt-1">
        {highlighted.map((part, i) => {
          if (/^[A-Z]{2,6}$/.test(part) && part !== "AI") {
            return (
              <span key={i} className="font-semibold text-primary dark:text-white">
                {part}
              </span>
            );
          }
          if (part === "↑") return <span key={i} className="text-bull font-semibold">{part}</span>;
          if (part === "↓") return <span key={i} className="text-bear font-semibold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </div>
    </motion.div>
  );
}

// ─── User bubble ─────────────────────────────────────────────────────────────
function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-[22px] rounded-br-[5px]",
          "bg-gray-100 dark:bg-[#2F2F2F]",
          "font-inter text-[14px] text-black dark:text-white leading-[1.5]",
          "shadow-sm"
        )}
      >
        {text}
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onPromptClick }: { onPromptClick: (prompt: string) => void }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-4 pb-8"
    >
      {/* Raven logo with Pulse */}
      <div className="relative mb-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <RavenMark size={180} className="text-primary dark:text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <h2 className="font-outfit font-bold text-[20px] text-primary dark:text-white mb-2 leading-snug">
          Raven AI is watching the markets.
        </h2>
        <p className="font-inter text-[14px] text-text-secondary-light dark:text-text-secondary-dark">
          What's our target?
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Chat Input ───────────────────────────────────────────────────────────────
function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  // Auto-resize textarea
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  return (
    <div className="px-4 pb-2">
      <div
        className={cn(
          "flex items-end gap-2 px-4 py-3",
          "bg-black/[0.04] dark:bg-white/[0.05]",
          "rounded-[30px] border border-transparent",
          "transition-all duration-200",
          "focus-within:border-primary/20 dark:focus-within:border-white/15"
        )}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (hasText && !disabled) onSend();
            }
          }}
          placeholder="Ask Raven AI for market insights..."
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent outline-none",
            "font-inter text-[13px] text-text-primary-light dark:text-text-primary-dark",
            "placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60",
            "py-1 leading-relaxed min-h-[24px] max-h-[120px]"
          )}
        />

        {/* Send button */}
        <AnimatePresence>
          {hasText && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={onSend}
              disabled={disabled}
              className={cn(
                "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                "bg-primary dark:bg-white",
                "text-white dark:text-black",
                "transition-opacity",
                disabled && "opacity-50"
              )}
            >
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="text-center font-inter text-[10px] text-text-secondary-light/40 dark:text-text-secondary-dark/40 mt-2">
        Raven AI · For informational purposes only
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { setMobileOpen } = useSidebar();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSend = useCallback(
    (preset?: string) => {
      const text = (preset ?? input).trim();
      if (!text || thinking) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setThinking(true);
      scrollToBottom();

      // Simulate AI response (mock)
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(text),
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setThinking(false);
        scrollToBottom();
      }, 1600 + Math.random() * 800);
    },
    [input, thinking]
  );

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Mobile header (visible on small screens, hidden on desktop) ── */}
      <div className="flex items-center justify-center h-14 border-b border-border-light dark:border-[#141414]
                      bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md lg:hidden px-4 shrink-0 relative">
        <button
          onClick={() => setMobileOpen(true)}
          className="absolute left-4 w-10 h-10 flex items-center justify-center text-primary dark:text-white"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <RavenMark size={20} className="text-primary dark:text-white" />
          <span className="font-outfit font-bold text-[18px] text-primary dark:text-white">
            Raven AI
          </span>
        </div>
      </div>

      {/* ── Desktop header ────────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b
                      border-border-light dark:border-[#141414] shrink-0">
        <div>
          <h1 className="font-outfit font-bold text-[20px] text-primary dark:text-white">
            AI Chat
          </h1>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            Real-time market intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-bull/10 border border-bull/20">
          <div className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
          <span className="font-inter font-semibold text-[11px] text-bull">
            Markets Open
          </span>
        </div>
      </div>

      {/* ── Message area ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        <AnimatePresence mode="wait">
          {messages.length === 0 && !thinking ? (
            <EmptyState onPromptClick={handleSend} />
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5 pb-2"
            >
              {messages.map((msg) =>
                msg.isUser ? (
                  <UserBubble key={msg.id} text={msg.text} />
                ) : (
                  <AIBubble key={msg.id} text={msg.text} />
                )
              )}

              {/* Thinking indicator */}
              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 dark:bg-white/10
                                  flex items-center justify-center">
                    <RavenMark size={20} className="text-primary dark:text-white" />
                  </div>
                  <ThinkingDots />
                </motion.div>
              )}

              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat input ────────────────────────────────────────────────── */}
      <div className="shrink-0 pt-2">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          disabled={thinking}
        />
      </div>
    </div>
  );
}

