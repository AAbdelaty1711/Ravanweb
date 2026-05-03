import type { ReactNode } from 'react'
import { BodyClassManager } from '@/components/BodyClassManager'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/*
       * Stamp body-bg-light on <body> while any auth page is mounted.
       * This prevents the html/body overscroll area (mobile browser bounce)
       * from showing a black void inherited from the Landing page theme.
       * BodyClassManager auto-removes the class when navigating away.
       */}
      <BodyClassManager bgColor="#f4f6f9" />

      <div className="auth-layout-wrapper h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark market-pattern overflow-hidden">
        {/* Main content area */}
        <main className="w-full flex items-center justify-center px-5 py-6">
          {children}
        </main>
      </div>
    </>
  )
}
