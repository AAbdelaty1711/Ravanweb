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
  Pencil,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-all duration-200 shrink-0",
        value ? "bg-primary dark:bg-white" : "bg-gray-200 dark:bg-[#2A2A2A]"
      )}
      role="switch"
      aria-checked={value}
    >
      <motion.div
        animate={{ x: value ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-black shadow-sm"
      />
    </button>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0]?.toUpperCase() ?? "U";
}

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
      {children}
    </div>
  );
}

function RowItem({
  icon: Icon,
  label,
  trailing,
  onClick,
  danger,
  iconBg,
}: {
  icon: typeof Mail;
  label: string;
  trailing?: React.ReactNode | string;
  onClick?: () => void;
  danger?: boolean;
  iconBg?: string;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3",
        "border-b border-gray-50 dark:border-white/[0.03] last:border-0",
        onClick && !danger && "hover:bg-gray-50/80 dark:hover:bg-white/[0.025] cursor-pointer transition-colors text-left",
        onClick && danger && "hover:bg-red-50 dark:hover:bg-red-900/[0.08] cursor-pointer transition-colors text-left"
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
        danger ? "bg-red-500/10" : (iconBg ?? "bg-gray-100 dark:bg-white/[0.06]")
      )}>
        <Icon size={14} className={danger ? "text-red-500" : "text-text-secondary-light dark:text-text-secondary-dark"} />
      </div>
      <span className={cn(
        "font-inter font-medium text-[13.5px] flex-1",
        danger ? "text-red-500" : "text-text-primary-light dark:text-text-primary-dark"
      )}>
        {label}
      </span>
      {typeof trailing === "string" ? (
        <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
          {trailing}
        </span>
      ) : trailing}
      {onClick && !danger && typeof trailing === "undefined" && (
        <ChevronRight size={14} className="text-text-secondary-light/40 dark:text-text-secondary-dark/40" />
      )}
      {onClick && !danger && typeof trailing !== "undefined" && !['string'].includes(typeof trailing) === false && (
        <ChevronRight size={14} className="text-text-secondary-light/40 dark:text-text-secondary-dark/40" />
      )}
    </Tag>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="font-inter font-bold text-[10px] tracking-[1.1px] uppercase
                  text-text-secondary-light/55 dark:text-text-secondary-dark/55 mb-2 px-1">
      {label}
    </p>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ name, onSave, onClose }: { name: string; onSave: (n: string) => void; onClose: () => void }) {
  const [nameVal, setNameVal] = useState(name);
  const [pwVal, setPwVal] = useState("");

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
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#111118]
                   rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-outfit font-bold text-[18px] text-text-primary-light dark:text-text-primary-dark">
            Edit Profile
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <X size={13} />
          </button>
        </div>
        <div className="space-y-3 mb-4">
          <div>
            <label className="block font-inter text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5">Full Name</label>
            <input
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
                         font-inter text-[14px] text-text-primary-light dark:text-text-primary-dark
                         outline-none focus:border-primary/50 dark:focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label className="block font-inter text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5">New Password</label>
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
          onClick={() => { onSave(nameVal.trim() || name); onClose(); }}
          className="w-full h-10 rounded-xl bg-primary dark:bg-white text-white dark:text-black
                     font-inter font-bold text-[13px] transition-opacity hover:opacity-90"
        >
          Save Changes
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Ahmed Abdelaty");
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [language, setLanguage] = useState("English");
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col h-full market-pattern">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
        <h1 className="font-outfit font-bold text-[22px] text-primary dark:text-white tracking-tight leading-none">
          Account & Settings
        </h1>
        <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
          Manage your profile, preferences, and security
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-4 space-y-4 max-w-lg">

          {/* Profile card */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-sm p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-primary/12 dark:bg-white/12 flex items-center justify-center shrink-0">
                <span className="font-outfit font-extrabold text-[20px] text-primary dark:text-white">
                  {getInitials(name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-outfit font-bold text-[16px] text-primary dark:text-white tracking-tight">
                  {name}
                </h2>
                <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
                  user@ravenai.com
                </p>
                <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-inter font-bold
                                 bg-gray-100 dark:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark">
                  Free Plan
                </span>
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0
                           bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10
                           font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark
                           hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
            </div>
          </div>

          {/* Account */}
          <div>
            <SectionLabel label="Account" />
            <SettingsGroup>
              <RowItem icon={Mail} label="Email" trailing="user@ravenai.com" />
              <RowItem icon={Phone} label="Phone" trailing="+20 100 000 0000" />
              <RowItem icon={Crown} label="Subscription" trailing="Free Plan" onClick={() => {}} />
            </SettingsGroup>
          </div>

          {/* Preferences */}
          <div>
            <SectionLabel label="Preferences" />
            <SettingsGroup>
              <RowItem
                icon={isDark ? Moon : Sun}
                label="Dark Mode"
                trailing={<Toggle value={isDark} onChange={(v) => setTheme(v ? "dark" : "light")} />}
              />
              <RowItem
                icon={Globe}
                label="Language"
                trailing={language}
                onClick={() => setLanguage(language === "English" ? "العربية" : "English")}
              />
              <RowItem
                icon={Bell}
                label="Notifications"
                trailing={<Toggle value={notifEnabled} onChange={setNotifEnabled} />}
              />
            </SettingsGroup>
          </div>

          {/* About */}
          <div>
            <SectionLabel label="About" />
            <SettingsGroup>
              <RowItem icon={HelpCircle} label="Help Center" onClick={() => {}} />
              <RowItem icon={FileText} label="Terms of Use" onClick={() => {}} />
              <RowItem icon={Shield} label="Privacy Policy" onClick={() => {}} />
            </SettingsGroup>
          </div>

          {/* Logout */}
          <SettingsGroup>
            <RowItem icon={LogOut} label="Log out" onClick={() => {}} danger />
          </SettingsGroup>

          <p className="text-center font-inter text-[11px] text-text-secondary-light/45 dark:text-text-secondary-dark/45 pb-2">
            Raven AI · v1.0.0
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showEdit && (
          <EditModal name={name} onSave={setName} onClose={() => setShowEdit(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
