'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RavenMark } from '@/components/ui/RavenMark'
import { useLanguage } from '@/contexts/LanguageContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  text: string
  isUser: boolean
}

function generateAIResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('aapl') || q.includes('apple')) {
    return '### Apple Inc. (AAPL) Analysis\n\n**AAPL** is trading at `$189.30`, showing bullish momentum. \n\n*   **Target 1:** $198.00\n*   **Support:** $184.00\n\nThe `Golden Cross` on the daily chart confirms the uptrend. \n\n```python\n# Momentum Signal\nif price > sma_200:\n    return "Bullish"\n```'
  }
  if (q.includes('nvda') || q.includes('nvidia')) {
    return '### NVIDIA (NVDA) Outlook\n\n**NVDA** continues to be a dominant force in AI infrastructure. At `$875.20`, momentum indicators (MACD, RSI) remain bullish.\n\n| Level | Price | Signal |\n| :--- | :--- | :--- |\n| T1 | $920 | Strong |\n| T2 | $980 | Moderate |\n\nHigh volume surges over the past 3 sessions confirm institutional buying. However, the RSI at `72` signals slight overbought territory.'
  }
  if (q.includes('tsla') || q.includes('tesla')) {
    return '### Tesla (TSLA) Caution\n\n**TSLA** faces headwinds at `$248.50`. The `Death Cross` on the weekly chart and insider selling signal caution.\n\n> "Risk management is critical here. Avoid new long positions until the stock reclaims the 50-day MA at $262."\n\n*   **Downside T1:** $230\n*   **Downside T2:** $215'
  }
  if (q.includes('market') || q.includes('summary')) {
    return "### Market Summary\n\nToday's market shows **mixed signals**. \n\n*   **Leaders:** `NVDA` (+2.1%) and `AMD` (+1.8%)\n*   **Laggards:** `TSLA` and `META` \n\nThe S&P 500 consolidates near all-time highs with low volatility (VIX at `14.2`). Watch the Fed minutes release at **2PM ET**."
  }
  if (q.includes('radar') || q.includes('signal')) {
    return '### Raven AI Radar Highlights\n\n| Ticker | Signal | Action |\n| :--- | :--- | :--- |\n| **NVDA** | Golden Cross | 🟢 BUY |\n| **PLTR** | RSI Oversold | 🟢 BUY |\n| **TSLA** | Death Cross | 🔴 AVOID |\n| **SHOP** | Breakout | 🟢 BUY |'
  }
  return `### Analysis for "${query}"\n\nRaven AI is scanning momentum indicators, volume anomalies, and sentiment signals. \n\n**Key Takeaway:** Broader indices hold steady, but position sizing discipline is key. Use the \`/radar\` command for more specific signals.`
}

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
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function AIBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 max-w-[95%]"
    >
      <div className="shrink-0 w-8 h-8 mt-0.5 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
        <RavenMark size={16} className="text-primary dark:text-white" />
      </div>
      <div className="flex-1 pt-1 overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="font-inter text-[13px] text-text-primary-light dark:text-text-primary-dark leading-relaxed mb-3 last:mb-0 w-full">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-primary dark:text-white">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-text-secondary-light dark:text-text-secondary-dark">
                {children}
              </em>
            ),
            code: ({ children, ...props }: any) => (
              <span
                className="inline px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono text-[12px] text-primary dark:text-white"
                {...props}
              >
                {children}
              </span>
            ),
            pre: ({ children }) => (
              <pre className="my-3 p-3 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-black/5 dark:border-white/5 overflow-x-auto font-mono text-[12px] text-text-primary-light dark:text-text-primary-dark shadow-sm">
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 ps-4 space-y-1 list-disc list-outside text-text-primary-light dark:text-text-primary-dark text-[13px]">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 ps-4 space-y-1 list-decimal list-outside text-text-primary-light dark:text-text-primary-dark text-[13px]">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="font-inter leading-relaxed">
                {children}
              </li>
            ),
            h1: ({ children }) => (
              <h1 className="font-outfit font-bold text-[16px] text-primary dark:text-white mb-2 leading-snug">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-outfit font-bold text-[14px] text-primary dark:text-white mb-2 mt-3 leading-snug">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-outfit font-semibold text-[13px] text-primary dark:text-white mb-2 mt-2 leading-snug">
                {children}
              </h3>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary dark:text-blue-400 underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all text-[13px]"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-s-2 border-primary/30 dark:border-white/20 ps-3 py-0.5 my-3 text-[13px] text-text-secondary-light dark:text-text-secondary-dark">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-3 overflow-x-auto rounded-xl border border-black/5 dark:border-white/5">
                <table className="w-full text-start text-[12px] border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-black/5 dark:bg-white/5 font-semibold">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 border-b border-black/5 dark:border-white/5 text-text-primary-light dark:text-text-primary-dark text-start">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border-b border-black/5 dark:border-white/5 text-text-primary-light dark:text-text-primary-dark">
                {children}
              </td>
            ),
            hr: () => (
              <hr className="my-3 border-black/5 dark:border-white/5" />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </motion.div>
  )
}

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
          'max-w-[85%] px-3 py-2.5 rounded-[18px] rounded-br-[4px]',
          'bg-gray-100 dark:bg-[#2F2F2F]',
          'font-inter text-[13px] text-black dark:text-white leading-[1.4]',
          'shadow-sm'
        )}
      >
        {text}
      </div>
    </motion.div>
  )
}

function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void
}) {
  const { dict } = useLanguage()
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-4 pb-4"
    >
      <div className="relative mb-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <RavenMark size={80} className="text-primary dark:text-white" />
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <h2 className="font-outfit font-bold text-[15px] sm:text-[16px] whitespace-nowrap text-primary dark:text-white mb-1 leading-snug">
          {dict.chat.greeting}
        </h2>
        <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark px-2">
          {dict.chat.greetingDesc}
        </p>
      </motion.div>
    </motion.div>
  )
}

function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled: boolean
}) {
  const { dict, isRTL } = useLanguage()
  const ref = useRef<HTMLTextAreaElement>(null)
  const hasText = value.trim().length > 0

  useEffect(() => {
    if (ref.current && value === '') {
      ref.current.style.height = '30px'
    }
  }, [value])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    e.target.style.height = '30px'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
  }

  return (
    <div className="px-3 pb-2 pt-1 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a202c]">
      <div
        className={cn(
          'flex items-end gap-2 px-3 py-2',
          'bg-white dark:bg-[#0b0e14]',
          'rounded-[24px] border border-gray-200 dark:border-gray-700/50',
          'transition-all duration-200 mt-2',
          'focus-within:border-primary/50 dark:focus-within:border-white/20',
          'shadow-sm',
          isRTL && 'flex-row-reverse'
        )}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (hasText && !disabled) onSend()
            }
          }}
          placeholder="Ask Raven AI to draw or analyze..."
          rows={1}
          dir="auto"
          className={cn(
            'flex-1 resize-none bg-transparent outline-none',
            'font-inter text-[13px] text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'py-1.5 leading-snug min-h-[30px] max-h-[100px]',
            isRTL ? 'text-end' : 'text-start'
          )}
        />
        <AnimatePresence>
          {hasText && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={onSend}
              disabled={disabled}
              className={cn(
                'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                'bg-primary hover:bg-primary/90 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-100',
                'transition-colors',
                disabled && 'opacity-50'
              )}
            >
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const handleSend = useCallback(
    (preset?: string) => {
      const text = (preset ?? input).trim()
      if (!text || thinking) return
      const userMsg: Message = { id: Date.now().toString(), text, isUser: true }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setThinking(true)
      scrollToBottom()
      setTimeout(
        () => {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: generateAIResponse(text),
            isUser: false,
          }
          setMessages((prev) => [...prev, aiMsg])
          setThinking(false)
          scrollToBottom()
        },
        1600 + Math.random() * 800
      )
    },
    [input, thinking]
  )

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131722] font-inter">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 custom-scrollbar">
        <AnimatePresence mode="wait">
          {messages.length === 0 && !thinking ? (
            <EmptyState onPromptClick={handleSend} />
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pb-2"
            >
              {messages.map((msg) =>
                msg.isUser ? (
                  <UserBubble key={msg.id} text={msg.text} />
                ) : (
                  <AIBubble key={msg.id} text={msg.text} />
                )
              )}
              {thinking && (
               <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                    <RavenMark
                      size={16}
                      className="text-primary dark:text-white"
                    />
                  </div>
                  <ThinkingDots />
                </motion.div>
              )}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          disabled={thinking}
        />
      </div>
    </div>
  )
}
