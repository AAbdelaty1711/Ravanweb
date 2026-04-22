"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-inter font-medium text-[11px] tracking-[0.5px] uppercase
                         text-text-secondary-light dark:text-text-secondary-dark mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-[18px] pr-12 rounded-[12px] font-inter text-[14px]",
            "bg-transparent border border-primary-DEFAULT/15 dark:border-gray-600/30",
            "text-text-primary-light dark:text-text-primary-dark",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "outline-none focus:border-primary-DEFAULT dark:focus:border-white/60",
            "transition-colors"
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = () => {
    // Mock success → navigate to login
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div className="bg-card-light dark:bg-card-dark rounded-[24px]
                      border border-border-light dark:border-border-dark
                      shadow-[0_8px_32px_rgba(11,31,58,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                      px-7 py-10">
        <h1 className="font-inter font-bold text-[18px] text-text-primary-light dark:text-text-primary-dark text-center">
          Reset Password
        </h1>
        <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark text-center mt-2 mb-9">
          Create a new secure password for your account
        </p>

        <div className="space-y-4 mb-8">
          <PasswordField
            label="New Password"
            placeholder="••••••••"
            value={pw}
            onChange={setPw}
          />
          <PasswordField
            label="Confirm Password"
            placeholder="••••••••"
            value={confirm}
            onChange={setConfirm}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="w-full h-[52px] rounded-[12px] flex items-center justify-center
                     bg-primary-DEFAULT dark:bg-white
                     text-white dark:text-primary-DEFAULT
                     font-inter font-bold text-[13px]
                     transition-opacity hover:opacity-90"
        >
          Reset Password
        </motion.button>
      </div>
    </motion.div>
  );
}
