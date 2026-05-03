'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

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
            Recover your account access
          </p>
        </div>

        <div className="mb-7">
          <label
            className="block font-inter font-medium text-[11px] tracking-[0.5px] uppercase
                             text-text-secondary-light dark:text-text-secondary-dark mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={cn(
              'w-full px-4 py-[18px] rounded-[12px] font-inter text-[14px]',
              'bg-transparent border border-primary/15 dark:border-gray-600/30',
              'text-text-primary-light dark:text-text-primary-dark',
              'placeholder:text-gray-400 dark:placeholder:text-gray-600',
              'outline-none focus:border-primary dark:focus:border-white/60',
              'transition-colors duration-150'
            )}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/verify?next=reset-password')}
          className="w-full h-[52px] rounded-[12px] flex items-center justify-center
                     bg-primary dark:bg-white
                     text-white dark:text-primary
                     font-inter font-bold text-[13px]
                     transition-opacity hover:opacity-90"
        >
          Send Code
        </motion.button>

        <div className="flex justify-center mt-7">
          <Link
            href="/login"
            className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark underline underline-offset-2"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
