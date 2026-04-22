"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

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
          Forgot Password
        </h1>
        <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark text-center mt-2 mb-9">
          Enter your email to receive a reset code
        </p>

        <div className="mb-7">
          <label className="block font-inter font-medium text-[11px] tracking-[0.5px] uppercase
                             text-text-secondary-light dark:text-text-secondary-dark mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={cn(
              "w-full px-4 py-[18px] rounded-[12px] font-inter text-[14px]",
              "bg-transparent border border-primary-DEFAULT/15 dark:border-gray-600/30",
              "text-text-primary-light dark:text-text-primary-dark",
              "placeholder:text-gray-400 dark:placeholder:text-gray-600",
              "outline-none focus:border-primary-DEFAULT dark:focus:border-white/60",
              "transition-colors duration-150"
            )}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/verify?next=reset-password")}
          className="w-full h-[52px] rounded-[12px] flex items-center justify-center
                     bg-primary-DEFAULT dark:bg-white
                     text-white dark:text-primary-DEFAULT
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
  );
}
