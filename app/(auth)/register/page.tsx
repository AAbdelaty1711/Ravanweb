'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

function AuthField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div>
      <label
        className="block font-inter font-medium text-[11px] tracking-[0.5px] uppercase
                         text-text-secondary-light dark:text-text-secondary-dark mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-[18px] rounded-[12px] font-inter text-[14px]',
            'bg-transparent border border-primary/15 dark:border-gray-600/30',
            'text-text-primary-light dark:text-text-primary-dark',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'outline-none focus:border-primary dark:focus:border-white/60',
            'transition-colors duration-150',
            isPassword && 'pr-12'
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 315"
      aria-hidden
      fill="currentColor"
    >
      <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615-.335 1.016-6.535 22.316-21.735 44.414-13.136 19.117-26.776 38.163-48.204 38.563-21.05.394-27.82-12.443-51.884-12.443-24.053 0-31.582 12.039-51.5 12.853-20.707.824-36.33-20.73-49.563-39.777-27.052-38.944-47.705-110.01-19.9-158.21 13.79-24.004 38.41-39.213 65.17-39.605 20.31-.303 39.46 13.753 51.88 13.753 12.42 0 35.65-16.92 60.1-14.433 10.25.428 39.04 4.135 57.51 31.188-1.49.923-34.38 20.038-34.07 59.715zM174.153 46.697c10.873-13.18 18.2-31.48 16.204-49.697-15.644.63-34.563 10.42-45.743 23.504-10.042 11.614-18.824 30.29-16.455 48.01 17.453 1.353 35.12-8.636 45.994-21.817z" />
    </svg>
  )
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
      <span className="font-inter font-bold text-[10px] tracking-[1.5px] text-gray-400">
        OR CONTINUE WITH
      </span>
      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
            Create your trading account
          </p>
        </div>

        <div className="space-y-3.5">
          <AuthField
            label="User Name"
            placeholder="Enter your user name"
            value={username}
            onChange={setUsername}
          />
          <AuthField
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <AuthField
            label="Password"
            placeholder="Min. 8 characters"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/verify')}
          className="w-full h-[52px] rounded-[12px] mt-5 flex items-center justify-center
                     bg-primary dark:bg-white
                     text-white dark:text-primary
                     font-inter font-bold text-[13px]
                     transition-opacity hover:opacity-90"
        >
          Register
        </motion.button>

        <div className="my-5">
          <OrDivider />
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px]
                             border border-border-light dark:border-border-dark
                             font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark
                             hover:bg-black/[0.025] dark:hover:bg-white/[0.04] transition-colors"
          >
            <GoogleLogo />
            Google
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px]
                             border border-border-light dark:border-border-dark
                             font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark
                             hover:bg-black/[0.025] dark:hover:bg-white/[0.04] transition-colors"
          >
            <AppleLogo />
            Apple
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mt-5">
          <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
            Already have an account?{' '}
          </span>
          <Link
            href="/login"
            className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark underline underline-offset-2"
          >
            Log in
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
