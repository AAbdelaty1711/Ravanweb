import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark market-pattern">
      {/* Header */}
      <header className="flex items-center justify-center h-[60px] shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/ravanlogo.png"
            alt="Raven AI logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-outfit font-semibold text-[18px] text-primary dark:text-white tracking-[0.3px]">
            Raven AI
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-center justify-center px-5 py-8 overflow-y-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center h-10 shrink-0">
        <p className="font-inter font-bold text-[10px] tracking-[2.5px] uppercase
                      text-text-secondary-light/50 dark:text-text-secondary-dark/50">
          © Raven AI Trading
        </p>
      </footer>
    </div>
  );
}

