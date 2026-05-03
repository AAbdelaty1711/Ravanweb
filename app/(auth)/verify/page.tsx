'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const CODE_LENGTH = 5

export default function VerifyPage() {
  const router = useRouter()
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(45)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  const handleChange = useCallback(
    (index: number, val: string) => {
      if (!/^\d?$/.test(val)) return
      const next = [...digits]
      next[index] = val
      setDigits(next)
      if (val && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [digits]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
      }
    },
    [digits]
  )

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  const isComplete = digits.every((d) => d !== '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[420px] md:max-w-[520px]"
    >
      <div
        className="bg-card-light dark:bg-card-dark rounded-[32px]
                   border border-border-light dark:border-border-dark
                   shadow-[0_8px_40px_rgba(11,31,58,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
                   px-6 py-8 md:px-12 md:py-10"
      >
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-1">
            <h1 className="font-outfit font-bold text-[26px] md:text-[32px] text-primary dark:text-white tracking-tight">
              Raven AI
            </h1>
            <img
              src="/ravanlogo.png"
              alt="Raven AI"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>
          <p className="font-inter text-[13px] md:text-[14px] text-text-secondary-light dark:text-text-secondary-dark opacity-60">
            Verify your identity
          </p>
        </div>

        {/* OTP boxes */}
        <div
          className="flex items-center justify-center gap-2 mb-7"
          onPaste={handlePaste}
        >
          {digits.map((digit, i) => (
            <motion.div
              key={i}
              animate={{
                borderColor: digit
                  ? 'var(--color-primary)'
                  : 'var(--tw-border-opacity, 1)',
                scale: digit ? 1.04 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  'w-12 h-12 text-center rounded-[14px] font-inter font-bold text-[20px]',
                  'bg-gray-50 dark:bg-[#0a0a0a]',
                  'border-[1.5px] outline-none',
                  'text-text-primary-light dark:text-text-primary-dark',
                  'transition-colors duration-150',
                  digit
                    ? 'border-primary dark:border-white/70'
                    : 'border-border-light dark:border-[#2a2a2a]',
                  'focus:border-primary dark:focus:border-white/60'
                )}
                aria-label={`Digit ${i + 1}`}
              />
              {!digit && (
                <span
                  className="absolute inset-0 flex items-center justify-center
                                 pointer-events-none font-inter text-[22px]
                                 text-gray-300 dark:text-gray-700"
                >
                  ·
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Verify button */}
        <motion.button
          whileHover={{ scale: isComplete ? 1.01 : 1 }}
          whileTap={{ scale: isComplete ? 0.98 : 1 }}
          onClick={() => {
            if (isComplete) {
              document.cookie =
                'raven_session=mock-token; path=/; max-age=' + 60 * 60 * 24 * 7
              router.push('/dashboard')
            }
          }}
          className={cn(
            'w-full h-[52px] rounded-[12px] flex items-center justify-center',
            'font-inter font-bold text-[13px] transition-all duration-200',
            isComplete
              ? 'bg-primary dark:bg-white text-white dark:text-primary hover:opacity-90'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          )}
        >
          Verify
        </motion.button>

        {/* Resend + timer */}
        <div className="flex flex-col items-center mt-5 gap-2">
          <button
            disabled={secondsLeft > 0}
            onClick={() => setSecondsLeft(45)}
            className={cn(
              'font-inter font-semibold text-[12px] transition-colors',
              secondsLeft > 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-text-primary-light dark:text-text-primary-dark hover:underline'
            )}
          >
            Resend Code
          </button>

          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-600">
            <Clock size={12} />
            <span className="font-inter font-medium text-[12px] tabular-nums tracking-widest">
              00:{String(secondsLeft).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
