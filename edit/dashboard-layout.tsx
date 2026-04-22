import { Sidebar } from "@/components/Sidebar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto">
          {/* Mobile top padding so content clears the hamburger button */}
          <div className="pt-14 lg:pt-0 h-full flex flex-col">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
