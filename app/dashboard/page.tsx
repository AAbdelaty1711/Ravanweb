'use client'

import dynamic from 'next/dynamic'

const NativeChart = dynamic(() => import('@/components/dashboard/CustomNativeChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center animate-pulse bg-white dark:bg-[#131722]">
      Loading AI Chart Engine...
    </div>
  ),
})

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#131722] relative">
      <div className="flex-1 h-full relative z-10 flex flex-col bg-white dark:bg-[#131722] min-w-0 min-h-0">
        <div className="flex-1 w-full h-full min-h-0">
          <NativeChart />
        </div>
      </div>
    </div>
  )
}
