import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto">
            <div className="h-full flex flex-col">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
