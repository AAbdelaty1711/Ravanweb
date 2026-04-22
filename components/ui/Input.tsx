import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-inter font-medium text-[11px] tracking-[0.5px] uppercase
                           text-text-secondary-light dark:text-text-secondary-dark mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full px-4 py-3 rounded-input font-inter text-[14px]",
            "bg-transparent border border-primary-DEFAULT/15 dark:border-gray-600/30",
            "text-text-primary-light dark:text-text-primary-dark",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "outline-none focus:border-primary-DEFAULT dark:focus:border-white/60",
            "transition-colors duration-150",
            icon && "pl-10",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 font-inter text-[11px] text-red-500">{error}</p>
      )}
    </div>
  );
}
