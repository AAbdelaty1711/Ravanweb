'use client'

import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { SidebarProvider } from '@/components/SidebarContext'
import { BodyClassManager } from '@/components/BodyClassManager'
import AIChatPanel from '@/components/dashboard/AIChatPanel'
import WatchlistPanel from '@/components/dashboard/WatchlistPanel'
import RadarPanel from '@/components/dashboard/RadarPanel'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const pathname = usePathname()
  const isProfilePage = pathname === '/dashboard/profile'

  return (
    <SidebarProvider>
      {/*
       * Stamp body-bg-light on <body> while the dashboard is mounted.
       * Prevents the mobile overscroll/bounce area from exposing the dark
       * background inherited from the Landing page. Auto-cleans on unmount.
       */}
      <BodyClassManager bgColor="#f4f6f9" />

      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark dashboard-mobile-shell">
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto dashboard-scroll-outer">
            <div className="h-full flex flex-col flex-1 min-w-0">{children}</div>
          </div>
        </main>

        {/* Mobile Backdrop Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${
            activePanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setActivePanel(null)}
        />

        {/* Responsive Panel Container */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col bg-white dark:bg-[#1a202c] fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl md:static md:z-auto md:rounded-none md:shadow-none md:border-l md:border-gray-200 md:dark:border-gray-800 ${
            activePanel
              ? 'h-[85vh] translate-y-0 md:h-full md:w-[350px]'
              : 'h-0 translate-y-full md:h-full md:w-0'
          }`}
        >
          {/* Mobile Drag Indicator */}
          <div className="md:hidden w-full flex justify-center py-3">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden @container panel-container custom-scrollbar">
            {activePanel === 'chat' && <AIChatPanel />}
            {activePanel === 'watchlist' && <WatchlistPanel compact />}
            {activePanel === 'radar' && <RadarPanel compact />}
            {activePanel === 'notifications' && <NotificationsPanel compact />}
          </div>
        </div>

        {!isProfilePage && <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />}
      </div>
    </SidebarProvider>
  )
}
