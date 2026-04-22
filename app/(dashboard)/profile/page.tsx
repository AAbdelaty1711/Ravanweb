"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Check,
  Pencil,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// ─── Premium switch ───────────────────────────────────────────────────────────
function PremiumSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "relative w-10 h-[22px] rounded-full transition-all duration-240",
        value
          ? "bg-primary dark:bg-white"
          : "bg-gray-200 dark:bg-[#3A3A3C]"
      )}
      role="switch"
      aria-checked={value}
    >
      <motion.div
        animate={{ x: value ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white dark:bg-black shadow-sm"
        style={{ top: 2 }}
      />
    </button>
  );
}

// ─── Group container ──────────────────────────────────────────────────────────
function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-white dark:bg-[#2A2A2A]
                    border border-gray-200 dark:border-white/[0.06]
                    shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none
                    overflow-hidden">
      {children}
    </div>
  );
}

// ─── Info tile (email / phone / subscription) ─────────────────────────────────
function InfoTile({
  icon: Icon,
  label,
  trailing,
  trailingColor,
}: {
  icon: typeof Mail;
  label: string;
  trailing: string;
  trailingColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5
                    border-b border-gray-100 dark:border-white/[0.06] last:border-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center
                      bg-primary/[0.06] dark:bg-white/[0.06] shrink-0">
        <Icon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
      </div>
      <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark flex-1">
        {label}
      </span>
      <span
        className={cn(
          "font-inter font-medium text-[12px]",
          trailingColor ?? "text-text-secondary-light dark:text-text-secondary-dark"
        )}
      >
        {trailing}
      </span>
    </div>
  );
}

// ─── Switch tile ──────────────────────────────────────────────────────────────
function SwitchTile({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof Moon;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3
                    border-b border-gray-100 dark:border-white/[0.06] last:border-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center
                      bg-primary/[0.06] dark:bg-white/[0.06] shrink-0">
        <Icon size={16} className="text-primary dark:text-white" />
      </div>
      <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark flex-1 truncate">
        {label}
      </span>
      <PremiumSwitch value={value} onChange={onChange} />
    </div>
  );
}

// ─── Nav tile ────────────────────────────────────────────────────────────────
function NavTile({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Globe;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3
                 border-b border-gray-100 dark:border-white/[0.06] last:border-0
                 hover:bg-black/[0.025] dark:hover:bg-white/[0.04] transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center
                      bg-primary/[0.06] dark:bg-white/[0.06] shrink-0">
        <Icon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
      </div>
      <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark flex-1">
        {label}
      </span>
      <ChevronRight size={16} className="text-text-secondary-light/50 dark:text-text-secondary-dark/50" />
    </button>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({
  name,
  onSave,
  onClose,
}: {
  name: string;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [nameVal, setNameVal] = useState(name);
  const [pwVal, setPwVal] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white dark:bg-card-dark
                   rounded-t-[24px] px-6 pt-4 pb-8"
      >
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <h3 className="font-outfit font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark mb-5">
          Edit Profile
        </h3>

        {/* Name field */}
        <div className="mb-4">
          <label className="block font-inter text-[12px] font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5">
            Full Name
          </label>
          <input
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            className="w-full px-3.5 py-3 rounded-[12px]
                       bg-gray-50 dark:bg-input-dark border border-gray-200 dark:border-[#141414]
                       font-inter text-[14px] text-text-primary-light dark:text-text-primary-dark
                       outline-none focus:border-primary dark:focus:border-white/40
                       transition-colors"
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label className="block font-inter text-[12px] font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5">
            New Password
          </label>
          <input
            type="password"
            value={pwVal}
            onChange={(e) => setPwVal(e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full px-3.5 py-3 rounded-[12px]
                       bg-gray-50 dark:bg-input-dark border border-gray-200 dark:border-[#141414]
                       font-inter text-[14px] text-text-primary-light dark:text-text-primary-dark
                       placeholder:text-gray-400 dark:placeholder:text-gray-600
                       outline-none focus:border-primary dark:focus:border-white/40
                       transition-colors"
          />
        </div>

        <button
          onClick={() => {
            onSave(nameVal.trim() || name);
            onClose();
          }}
          className="w-full h-[50px] rounded-[14px] flex items-center justify-center
                     bg-primary dark:bg-white text-white dark:text-black
                     font-inter font-bold text-[15px] transition-opacity hover:opacity-90"
        >
          Save Changes
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Language Sheet ───────────────────────────────────────────────────────────
function LanguageSheet({
  onClose,
}: {
  onClose: () => void;
}) {
  const langs = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];
  const [selected, setSelected] = useState("en");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white dark:bg-card-dark
                   rounded-t-[20px] pb-8 pt-3"
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        {langs.map((lang) => (
          <button
            key={lang.code}
            onClick={() => { setSelected(lang.code); onClose(); }}
            className="w-full flex items-center justify-between px-5 py-3.5
                       hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className="font-inter font-medium text-[13px] text-text-primary-light dark:text-text-primary-dark">
              {lang.label}
            </span>
            {selected === lang.code && (
              <Check size={16} className="text-primary dark:text-white" />
            )}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="font-inter font-bold text-[10px] tracking-[1.2px] uppercase
                  text-text-secondary-light/65 dark:text-text-secondary-dark/65 mb-2 ml-1">
      {label}
    </p>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0]?.toUpperCase() ?? "U";
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Ahmed Abdelaty");
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const isDark = theme === "dark";

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center relative px-4 py-4
                      border-b border-border-light dark:border-[#141414] shrink-0">
        <h1 className="font-outfit font-bold text-[18px] text-primary dark:text-white tracking-wide">
          Profile
        </h1>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 min-h-0">
        {/* ── Avatar block ──────────────────────────────────────────── */}
        <div className="flex flex-col items-center pt-7 pb-6">
          <div className="w-[88px] h-[88px] rounded-full
                          bg-primary/12 dark:bg-white/12
                          flex items-center justify-center">
            <span className="font-outfit font-extrabold text-[28px]
                             text-primary dark:text-white">
              {getInitials(name)}
            </span>
          </div>
          <h2 className="font-outfit font-extrabold text-[16px]
                         text-primary dark:text-white mt-3.5 tracking-tight">
            {name}
          </h2>
          <p className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            user@ravenai.com
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1.5 mt-3.5 px-5 py-2 rounded-[20px]
                       bg-primary/[0.05] dark:bg-white/[0.08]
                       border border-primary/10 dark:border-white/12
                       text-primary dark:text-white
                       font-inter font-semibold text-[12px] transition-colors
                       hover:bg-primary/[0.08] dark:hover:bg-white/[0.12]"
          >
            <Pencil size={12} />
            Edit profile
          </motion.button>
        </div>

        <div className="space-y-5">
          {/* Account */}
          <div>
            <SectionLabel label="Account" />
            <SettingsGroup>
              <InfoTile icon={Mail} label="Email" trailing="user@ravenai.com" />
              <InfoTile icon={Phone} label="Phone" trailing="+20 100 000 0000" />
              <InfoTile
                icon={Crown}
                label="Subscription"
                trailing="Free Plan"
                trailingColor="text-text-secondary-light dark:text-text-secondary-dark"
              />
            </SettingsGroup>
          </div>

          {/* Preferences */}
          <div>
            <SectionLabel label="Preferences" />
            <SettingsGroup>
              <SwitchTile
                icon={isDark ? Moon : Sun}
                label="Dark Mode"
                value={isDark}
                onChange={(v) => setTheme(v ? "dark" : "light")}
              />
              <NavTile
                icon={Globe}
                label="Language"
                onClick={() => setShowLanguage(true)}
              />
              <SwitchTile
                icon={Bell}
                label="Notifications"
                value={notifEnabled}
                onChange={setNotifEnabled}
              />
            </SettingsGroup>
          </div>

          {/* About */}
          <div>
            <SectionLabel label="About" />
            <SettingsGroup>
              <NavTile icon={HelpCircle} label="Help Center" />
              <NavTile icon={FileText} label="Terms of Use" />
              <NavTile icon={Shield} label="Privacy Policy" />
            </SettingsGroup>
          </div>

          {/* Version */}
          <p className="text-center font-inter text-[11px] text-text-secondary-light/55 dark:text-text-secondary-dark/55">
            Raven AI for Web v1.0.0
          </p>

          {/* Logout */}
          <SettingsGroup>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left
                               hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 shrink-0">
                <LogOut size={16} className="text-red-500" />
              </div>
              <span className="font-inter font-semibold text-[13px] text-red-500">
                Log out
              </span>
            </button>
          </SettingsGroup>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEdit && (
          <EditProfileModal
            name={name}
            onSave={setName}
            onClose={() => setShowEdit(false)}
          />
        )}
        {showLanguage && (
          <LanguageSheet onClose={() => setShowLanguage(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

