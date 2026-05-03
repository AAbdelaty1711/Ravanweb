import { Sidebar } from '@/components/Sidebar'
import { SidebarProvider } from '@/components/SidebarContext'
import { BodyClassManager } from '@/components/BodyClassManager'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/*
       * Stamp body-bg-light on <body> while the dashboard is mounted.
       * Prevents the mobile overscroll/bounce area from exposing the dark
       * background inherited from the Landing page. Auto-cleans on unmount.
       */}
      <BodyClassManager bgColor="#f4f6f9" />

      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark dashboard-mobile-shell">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto dashboard-scroll-outer">
            <div className="h-full flex flex-col">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
