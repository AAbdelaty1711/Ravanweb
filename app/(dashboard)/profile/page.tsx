'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  Crown,
  Moon,
  Sun,
  Globe,
  Bell,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  X,
  Pencil,
  User,
  Settings,
  CreditCard,
  Lock,
  Check,
  ChevronLeft,
  Camera,
  Zap,
  AlertTriangle,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name[0]?.toUpperCase() ?? 'U'
}

function Toggle({
  value,
  onChange,
  accentColor,
}: {
  value: boolean
  onChange: (v: boolean) => void
  accentColor?: string
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-[38px] h-[22px] rounded-full transition-all duration-200 shrink-0',
        value ? 'bg-primary dark:bg-white' : 'bg-gray-200 dark:bg-[#2A2A2A]'
      )}
      role="switch"
      aria-checked={value}
    >
      <motion.div
        animate={{ x: value ? 17 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="absolute top-[3px] w-4 h-4 rounded-full bg-white dark:bg-black shadow-sm"
      />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit Profile Modal (shared between desktop & mobile)
// ─────────────────────────────────────────────────────────────────────────────

function EditModal({
  name,
  onSave,
  onClose,
}: {
  name: string
  onSave: (n: string) => void
  onClose: () => void
}) {
  const [nameVal, setNameVal] = useState(name)
  const [pwVal, setPwVal] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#111118]
                   rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-outfit font-bold text-[18px] text-text-primary-light dark:text-text-primary-dark">
            Edit Profile
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
        <div className="space-y-4 mb-5">
          <div>
            <label className="block font-inter text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                         font-inter text-[14px] text-text-primary-light dark:text-text-primary-dark
                         outline-none focus:border-primary/50 dark:focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label className="block font-inter text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5 uppercase tracking-wide">
              New Password
            </label>
            <input
              type="password"
              value={pwVal}
              onChange={(e) => setPwVal(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                         font-inter text-[14px] text-text-primary-light dark:text-text-primary-dark
                         placeholder:text-gray-400 dark:placeholder:text-gray-600
                         outline-none focus:border-primary/50 dark:focus:border-white/30 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={() => {
            onSave(nameVal.trim() || name)
            onClose()
          }}
          className="w-full h-10 rounded-xl bg-primary dark:bg-white text-white dark:text-black
                     font-inter font-bold text-[13px] transition-opacity hover:opacity-90"
        >
          Save Changes
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP LAYOUT — Web SaaS Settings Dashboard
// ─────────────────────────────────────────────────────────────────────────────

type DesktopSection =
  | 'account'
  | 'preferences'
  | 'security'
  | 'subscription'
  | 'about'

const DESKTOP_NAV: { id: DesktopSection; icon: typeof User; label: string }[] =
  [
    { id: 'account', icon: User, label: 'Account' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'subscription', icon: Crown, label: 'Subscription' },
    { id: 'about', icon: HelpCircle, label: 'About & Legal' },
  ]

function DesktopFormField({
  label,
  value,
  type = 'text',
  readOnly = false,
}: {
  label: string
  value: string
  type?: string
  readOnly?: boolean
}) {
  const [val, setVal] = useState(value)
  return (
    <div>
      <label className="block font-inter text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        readOnly={readOnly}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border font-inter text-[14px] transition-colors',
          'text-text-primary-light dark:text-text-primary-dark',
          readOnly
            ? 'bg-gray-50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.05] text-text-secondary-light dark:text-text-secondary-dark cursor-not-allowed'
            : 'bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/10 outline-none focus:border-primary/50 dark:focus:border-white/30'
        )}
      />
    </div>
  )
}

function DesktopToggleRow({
  icon: Icon,
  label,
  desc,
  value,
  onChange,
}: {
  icon: typeof Moon
  label: string
  desc: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/[0.05] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center">
          <Icon
            size={15}
            className="text-text-secondary-light dark:text-text-secondary-dark"
          />
        </div>
        <div>
          <p className="font-inter font-semibold text-[13.5px] text-text-primary-light dark:text-text-primary-dark">
            {label}
          </p>
          <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
            {desc}
          </p>
        </div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

function DesktopSectionContent({
  section,
  name,
  setName,
  isDark,
  setTheme,
  notifEnabled,
  setNotifEnabled,
  language,
  setLanguage,
}: {
  section: DesktopSection
  name: string
  setName: (n: string) => void
  isDark: boolean
  setTheme: (t: string) => void
  notifEnabled: boolean
  setNotifEnabled: (v: boolean) => void
  language: string
  setLanguage: (l: string) => void
}) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (section === 'account')
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-outfit font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            Account Information
          </h2>
          <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Manage your personal details and contact information.
          </p>
        </div>

        {/* Avatar section */}
        <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-white/10 flex items-center justify-center">
              <span className="font-outfit font-bold text-[22px] text-primary dark:text-white">
                {getInitials(name)}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary dark:bg-white flex items-center justify-center shadow">
              <Camera size={11} className="text-white dark:text-black" />
            </button>
          </div>
          <div>
            <p className="font-outfit font-bold text-[16px] text-text-primary-light dark:text-text-primary-dark">
              {name}
            </p>
            <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
              user@ravenai.com
            </p>
            <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-inter font-bold bg-gray-200/80 dark:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark">
              Free Plan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <DesktopFormField label="Full Name" value={name} />
          <DesktopFormField
            label="Email Address"
            value="user@ravenai.com"
            readOnly
          />
          <DesktopFormField label="Phone Number" value="+20 100 000 0000" />
          <DesktopFormField label="Username" value="ahmed_abdelaty" />
        </div>

        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl font-inter font-bold text-[13px] transition-all',
            saved
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
              : 'bg-primary dark:bg-white text-white dark:text-black hover:opacity-90'
          )}
        >
          {saved ? (
            <>
              <Check size={14} /> Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    )

  if (section === 'preferences')
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-outfit font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            Preferences
          </h2>
          <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Customize your app experience and notification settings.
          </p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] px-5">
          <DesktopToggleRow
            icon={isDark ? Moon : Sun}
            label="Dark Mode"
            desc="Switch between light and dark themes"
            value={isDark}
            onChange={(v) => setTheme(v ? 'dark' : 'light')}
          />
          <DesktopToggleRow
            icon={Bell}
            label="Push Notifications"
            desc="Receive price alerts and AI signals"
            value={notifEnabled}
            onChange={setNotifEnabled}
          />
          <DesktopToggleRow
            icon={Zap}
            label="AI Radar Alerts"
            desc="Get notified for new radar signals"
            value={true}
            onChange={() => {}}
          />
        </div>

        <div className="mt-5">
          <h3 className="font-inter font-bold text-[13px] uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-3">
            Language
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {['English', 'العربية'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl border font-inter font-semibold text-[13px] transition-all',
                  language === lang
                    ? 'bg-primary/8 dark:bg-white/8 border-primary/20 dark:border-white/20 text-primary dark:text-white'
                    : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-white/[0.06]'
                )}
              >
                {lang}
                {language === lang && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    )

  if (section === 'security')
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-outfit font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            Security
          </h2>
          <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Manage your password and account security settings.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <DesktopFormField label="Current Password" value="" type="password" />
          <DesktopFormField label="New Password" value="" type="password" />
          <DesktopFormField
            label="Confirm New Password"
            value=""
            type="password"
          />
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-5 flex items-start gap-3">
          <AlertTriangle
            size={15}
            className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
          />
          <p className="font-inter text-[12px] text-amber-700 dark:text-amber-300">
            Use a strong password with at least 8 characters, including numbers
            and symbols.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary dark:bg-white text-white dark:text-black font-inter font-bold text-[13px] hover:opacity-90 transition-opacity"
        >
          {saved ? (
            <>
              <Check size={14} /> Updated!
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </div>
    )

  if (section === 'subscription')
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-outfit font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            Subscription
          </h2>
          <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Manage your plan and billing information.
          </p>
        </div>

        {/* Current plan card */}
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-inter font-bold text-[11px] uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              Current Plan
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-inter font-bold bg-gray-200 dark:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark">
              Free
            </span>
          </div>
          <p className="font-outfit font-bold text-[28px] text-text-primary-light dark:text-text-primary-dark">
            $0
            <span className="text-[14px] font-inter font-normal text-text-secondary-light dark:text-text-secondary-dark">
              /month
            </span>
          </p>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Limited to 5 watchlist stocks and basic AI insights.
          </p>
        </div>

        {/* Pro plan card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/8 to-primary/4 dark:from-white/8 dark:to-white/4 border border-primary/15 dark:border-white/15">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={14} className="text-primary dark:text-white" />
            <span className="font-outfit font-bold text-[14px] text-primary dark:text-white">
              Raven AI Pro
            </span>
          </div>
          <p className="font-outfit font-bold text-[28px] text-primary dark:text-white">
            $19
            <span className="text-[14px] font-inter font-normal opacity-70">
              /month
            </span>
          </p>
          <ul className="mt-3 space-y-2">
            {[
              'Unlimited watchlist stocks',
              'Real-time AI Radar signals',
              'Advanced price alerts',
              'Priority AI chat responses',
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 font-inter text-[12px] text-primary dark:text-white"
              >
                <Check size={12} className="shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full py-2.5 rounded-xl bg-primary dark:bg-white text-white dark:text-black font-inter font-bold text-[13px] hover:opacity-90 transition-opacity">
            Upgrade to Pro
          </button>
        </div>
      </div>
    )

  if (section === 'about')
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-outfit font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            About & Legal
          </h2>
          <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            App information and legal documentation.
          </p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden mb-5">
          {[
            {
              icon: HelpCircle,
              label: 'Help Center',
              desc: 'Find answers and tutorials',
            },
            {
              icon: FileText,
              label: 'Terms of Use',
              desc: 'Our terms and conditions',
            },
            {
              icon: Shield,
              label: 'Privacy Policy',
              desc: 'How we handle your data',
            },
          ].map(({ icon: Icon, label, desc }, i, arr) => (
            <button
              key={label}
              className={cn(
                'w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors',
                i < arr.length - 1 &&
                  'border-b border-gray-100 dark:border-white/[0.05]'
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                <Icon
                  size={16}
                  className="text-text-secondary-light dark:text-text-secondary-dark"
                />
              </div>
              <div className="flex-1">
                <p className="font-inter font-semibold text-[13.5px] text-text-primary-light dark:text-text-primary-dark">
                  {label}
                </p>
                <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                  {desc}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-text-secondary-light/40 dark:text-text-secondary-dark/40"
              />
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="font-outfit font-bold text-[22px] text-text-primary-light dark:text-text-primary-dark">
            Raven AI
          </p>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Version 1.0.0 · AI-Powered Stock Intelligence
          </p>
        </div>
      </div>
    )

  return null
}

function DesktopProfileLayout({
  name,
  setName,
  isDark,
  setTheme,
  notifEnabled,
  setNotifEnabled,
  language,
  setLanguage,
}: {
  name: string
  setName: (n: string) => void
  isDark: boolean
  setTheme: (t: string) => void
  notifEnabled: boolean
  setNotifEnabled: (v: boolean) => void
  language: string
  setLanguage: (l: string) => void
}) {
  const [activeSection, setActiveSection] = useState<DesktopSection>('account')
  const [showEdit, setShowEdit] = useState(false)

  return (
    <div className="hidden lg:flex flex-col h-full market-pattern">
      {/* Desktop header */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <h1 className="font-outfit font-bold text-[24px] text-primary dark:text-white tracking-tight">
          Account & Settings
        </h1>
        <p className="font-inter text-[13px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
          Manage your profile, preferences, and security
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left nav */}
        <div className="w-60 shrink-0 border-r border-gray-100 dark:border-white/[0.06] flex flex-col overflow-y-auto">
          {/* Profile mini card */}
          <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                <span className="font-outfit font-bold text-[14px] text-primary dark:text-white">
                  {getInitials(name)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-inter font-bold text-[12.5px] text-text-primary-light dark:text-text-primary-dark truncate">
                  {name}
                </p>
                <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark truncate">
                  Free Plan
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-inter font-semibold
                         bg-gray-100 dark:bg-white/[0.05] text-text-secondary-light dark:text-text-secondary-dark
                         hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <Pencil size={11} /> Edit Profile
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-2.5 space-y-0.5">
            {DESKTOP_NAV.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all font-inter font-medium text-[13px]',
                  activeSection === id
                    ? 'bg-primary/8 dark:bg-white/8 text-primary dark:text-white'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-text-primary-light dark:hover:text-text-primary-dark'
                )}
              >
                <Icon size={15} className="shrink-0" />
                {label}
                {activeSection === id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary dark:bg-white" />
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-2.5 border-t border-gray-100 dark:border-white/[0.05]">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-inter font-semibold text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <DesktopSectionContent
                  section={activeSection}
                  name={name}
                  setName={setName}
                  isDark={isDark}
                  setTheme={setTheme}
                  notifEnabled={notifEnabled}
                  setNotifEnabled={setNotifEnabled}
                  language={language}
                  setLanguage={setLanguage}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEdit && (
          <EditModal
            name={name}
            onSave={setName}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE LAYOUT — Flutter-exact clone
// ─────────────────────────────────────────────────────────────────────────────

function MobileSettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
      {children}
    </div>
  )
}

function MobileInfoTile({
  icon: Icon,
  label,
  trailing,
  trailingColor,
}: {
  icon: typeof Mail
  label: string
  trailing: string
  trailingColor?: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-white/[0.03] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
        <Icon
          size={15}
          className="text-text-secondary-light dark:text-text-secondary-dark"
        />
      </div>
      <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark flex-1">
        {label}
      </span>
      <span
        className={cn(
          'font-inter text-[12px]',
          trailingColor ??
            'text-text-secondary-light dark:text-text-secondary-dark'
        )}
      >
        {trailing}
      </span>
    </div>
  )
}

function MobileSwitchTile({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof Moon
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-white/[0.03] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
        <Icon
          size={15}
          className="text-primary dark:text-text-secondary-dark"
        />
      </div>
      <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark flex-1">
        {label}
      </span>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

function MobileNavTile({
  icon: Icon,
  label,
  onTap,
}: {
  icon: typeof HelpCircle
  label: string
  onTap?: () => void
}) {
  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
        <Icon
          size={15}
          className="text-text-secondary-light dark:text-text-secondary-dark"
        />
      </div>
      <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark flex-1">
        {label}
      </span>
      <ChevronRight
        size={14}
        className="text-text-secondary-light/40 dark:text-text-secondary-dark/40"
      />
    </button>
  )
}

function MobileProfileLayout({
  name,
  setName,
  isDark,
  setTheme,
  notifEnabled,
  setNotifEnabled,
  language,
  setLanguage,
}: {
  name: string
  setName: (n: string) => void
  isDark: boolean
  setTheme: (t: string) => void
  notifEnabled: boolean
  setNotifEnabled: (v: boolean) => void
  language: string
  setLanguage: (l: string) => void
}) {
  const [showEdit, setShowEdit] = useState(false)

  return (
    <div className="lg:hidden flex flex-col h-full market-pattern">
      {/* Header — matches Flutter style */}
      <div className="flex items-center justify-center h-[56px] relative border-b border-gray-100 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shrink-0 px-4">
        <span className="font-outfit font-bold text-[18px] text-primary dark:text-white tracking-wide">
          Profile
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
          {/* Avatar + Name + Edit — Flutter clone */}
          <div className="flex flex-col items-center gap-3.5">
            <div className="w-[88px] h-[88px] rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
              <span className="font-outfit font-extrabold text-[28px] text-primary dark:text-white">
                {getInitials(name)}
              </span>
            </div>
            <div className="text-center">
              <p className="font-outfit font-extrabold text-[16px] text-primary dark:text-white">
                {name}
              </p>
              <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                user@ravenai.com
              </p>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="px-5 py-2 rounded-[20px] border font-inter font-semibold text-[12px]
                         border-primary/10 dark:border-white/12
                         bg-primary/5 dark:bg-white/[0.08]
                         text-primary dark:text-white"
            >
              Edit profile
            </button>
          </div>

          {/* Account section */}
          <div>
            <p className="font-inter font-bold text-[10px] tracking-[1.2px] uppercase text-text-secondary-light/55 dark:text-text-secondary-dark/55 mb-2 px-1">
              Account
            </p>
            <MobileSettingsGroup>
              <MobileInfoTile
                icon={Mail}
                label="Email"
                trailing="user@ravenai.com"
              />
              <MobileInfoTile
                icon={Phone}
                label="Phone"
                trailing="+20 100 000 0000"
              />
              <MobileInfoTile
                icon={Crown}
                label="Subscription"
                trailing="Free Plan"
              />
            </MobileSettingsGroup>
          </div>

          {/* Preferences section */}
          <div>
            <p className="font-inter font-bold text-[10px] tracking-[1.2px] uppercase text-text-secondary-light/55 dark:text-text-secondary-dark/55 mb-2 px-1">
              Preferences
            </p>
            <MobileSettingsGroup>
              <MobileSwitchTile
                icon={isDark ? Moon : Sun}
                label="Dark Mode"
                value={isDark}
                onChange={(v) => setTheme(v ? 'dark' : 'light')}
              />
              <MobileNavTile
                icon={Globe}
                label="Language"
                onTap={() =>
                  setLanguage(language === 'English' ? 'العربية' : 'English')
                }
              />
              <MobileSwitchTile
                icon={Bell}
                label="Notifications"
                value={notifEnabled}
                onChange={setNotifEnabled}
              />
            </MobileSettingsGroup>
          </div>

          {/* About section */}
          <div>
            <p className="font-inter font-bold text-[10px] tracking-[1.2px] uppercase text-text-secondary-light/55 dark:text-text-secondary-dark/55 mb-2 px-1">
              About
            </p>
            <MobileSettingsGroup>
              <MobileNavTile icon={HelpCircle} label="Help Center" />
              <MobileNavTile icon={FileText} label="Terms of Use" />
              <MobileNavTile icon={Shield} label="Privacy Policy" />
            </MobileSettingsGroup>
          </div>

          {/* App version */}
          <p className="text-center font-inter text-[11px] text-text-secondary-light/45 dark:text-text-secondary-dark/45">
            Raven AI for Mobile v1.0.0
          </p>

          {/* Logout */}
          <MobileSettingsGroup>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <LogOut size={15} className="text-red-500" />
              </div>
              <span className="font-inter font-semibold text-[13px] text-red-500">
                Log out
              </span>
            </button>
          </MobileSettingsGroup>

          {/* Bottom padding for bottom nav */}
          <div className="h-6" />
        </div>
      </div>

      <AnimatePresence>
        {showEdit && (
          <EditModal
            name={name}
            onSave={setName}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — renders correct layout per breakpoint
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState('Ahmed Abdelaty')
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [language, setLanguage] = useState('English')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-full market-pattern" />

  const isDark = theme === 'dark'

  const shared = {
    name,
    setName,
    isDark,
    setTheme,
    notifEnabled,
    setNotifEnabled,
    language,
    setLanguage,
  }

  return (
    <div className="h-full">
      {/* Desktop */}
      <DesktopProfileLayout {...shared} />
      {/* Mobile */}
      <MobileProfileLayout {...shared} />
    </div>
  )
}
