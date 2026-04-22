"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Chrome, Apple as AppleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Auth field ───────────────────────────────────────────────────────────────
function AuthField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      <label className="block font-inter font-medium text-[11px] tracking-[0.5px] uppercase
                         text-text-secondary-light dark:text-text-secondary-dark mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-[18px] rounded-[12px] font-inter text-[14px]",
            "bg-transparent",
            "border border-primary/15 dark:border-gray-600/30",
            "text-text-primary-light dark:text-text-primary-dark",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "outline-none focus:border-primary dark:focus:border-white/60",
            "transition-colors duration-150",
            isPassword && "pr-12"
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
  );
}

// ─── Google logo SVG ──────────────────────────────────────────────────────────
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

// ─── OR divider ───────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
      <span className="font-inter font-bold text-[10px] tracking-[1.5px] text-gray-400">
        OR CONTINUE WITH
      </span>
      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
    </div>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────
function SocialBtn({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px]
                 border border-border-light dark:border-border-dark
                 font-inter font-bold text-[13px] text-text-primary-light dark:text-text-primary-dark
                 hover:bg-black/[0.025] dark:hover:bg-white/[0.04] transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Set a mock session cookie (expires in 7 days)
    document.cookie = "raven_session=mock-token; path=/; max-age=" + 60 * 60 * 24 * 7;
    // Mock: navigate to dashboard
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div
        className="bg-card-light dark:bg-card-dark rounded-[24px]
                   border border-border-light dark:border-border-dark
                   shadow-[0_4px_24px_rgba(11,31,58,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                   px-6 py-7"
      >
        {/* Title */}
        <h1 className="font-inter font-bold text-[20px] text-text-primary-light dark:text-text-primary-dark text-center">
          Welcome Back
        </h1>
        <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark text-center mt-1 mb-6">
          Sign in to your account
        </p>

        <div className="space-y-3.5">
          <AuthField
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <AuthField
            label="Password"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <div className="flex justify-end mt-1.5 mb-5">
          <Link
            href="/forgot-password"
            className="font-inter font-semibold text-[11px] text-text-primary-light dark:text-text-primary-dark
                       tracking-[0.5px]"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="w-full h-[52px] rounded-[12px] flex items-center justify-center
                     bg-primary dark:bg-white
                     text-white dark:text-primary
                     font-inter font-bold text-[13px]
                     transition-opacity hover:opacity-90"
        >
          Login
        </motion.button>

        <div className="my-5">
          <OrDivider />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          <SocialBtn icon={<GoogleLogo />} label="Google" />
          <SocialBtn
            icon={<AppleIcon size={18} className="text-text-primary-light dark:text-text-primary-dark" />}
            label="Apple"
          />
        </div>

        <div className="flex items-center justify-center gap-1 mt-5">
          <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
            Don't have an account?{" "}
          </span>
          <Link
            href="/register"
            className="font-inter font-semibold text-[12px] text-text-primary-light dark:text-text-primary-dark underline underline-offset-2"
          >
            Register
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

