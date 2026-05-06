'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PanelRightClose, MessageSquare, Menu, X } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/SidebarContext';

const NativeChart = dynamic(() => import('@/components/dashboard/CustomNativeChart'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center animate-pulse bg-white dark:bg-[#131722]">Loading AI Chart Engine...</div>
});

import AIChatPanel from '@/components/dashboard/AIChatPanel';

export default function AIChartPage() {
  const [isDesktopChatOpen, setIsDesktopChatOpen] = useState(true);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const { setMobileOpen } = useSidebar();

  return (
    // Use w-full h-full flex-1 to force the container to fill the dashboard space completely without breaking out of the document flow.
    <div className="w-full h-full flex-1 flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-[#131722] relative">
      
      {/* Chart Container */}
      <div className="flex-1 h-full relative z-10 flex flex-col bg-white dark:bg-[#131722] min-w-0 min-h-0">
        <div className="flex-1 w-full h-full min-h-0">
          <NativeChart onOpenChat={() => setIsMobileChatOpen(true)} />
        </div>
      </div>

      {/* ── DESKTOP CHAT CONTAINER ── */}
      <div 
        className={`hidden lg:flex h-full border-l border-border-light dark:border-[#1C1C28] bg-card-light dark:bg-[#131722] transition-[width] duration-300 ease-in-out shrink-0 flex-col relative
          ${isDesktopChatOpen ? 'w-[300px]' : 'w-[50px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5'}
        `}
        onClick={() => !isDesktopChatOpen && setIsDesktopChatOpen(true)}
      >
        {isDesktopChatOpen ? (
          // OPEN STATE
          <>
            <div className="p-3 border-b border-border-light dark:border-[#1C1C28] flex items-center justify-between bg-card-light dark:bg-[#131722] shrink-0">
              <span className="font-semibold text-sm text-text-primary-light dark:text-white font-outfit">Raven AI</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsDesktopChatOpen(false); }}
                className="p-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-white hover:bg-primary/10 dark:hover:bg-white/10 rounded-md transition-colors"
                title="Collapse AI Chat"
              >
                <PanelRightClose size={18}/>
              </button>
            </div>
            <div className="flex-1 overflow-hidden min-h-0 bg-card-light dark:bg-[#131722]">
              <AIChatPanel/>
            </div>
          </>
        ) : (
          // CLOSED STATE (Thin strip like a navbar)
          <div className="w-full h-full flex flex-col items-center py-4">
            <button 
              className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-white transition-colors"
              title="Open AI Chat"
            >
              <MessageSquare size={20}/>
            </button>
            
            <div className="mt-6 font-outfit font-bold text-text-secondary-light/50 dark:text-text-secondary-dark/50 text-[11px] tracking-[0.2em] rotate-180" style={{ writingMode: 'vertical-rl' }}>
              RAVEN AI
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE CHAT BOTTOM SHEET ── */}
      <AnimatePresence>
        {isMobileChatOpen && (
          <motion.div
            key="mobile-chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileChatOpen(false)}
            className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileChatOpen && (
          <motion.div
            key="mobile-chat-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-[#131722] h-[85vh] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col border-t border-gray-200 dark:border-[#1C1C28]"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 shrink-0 cursor-pointer" onClick={() => setIsMobileChatOpen(false)}>
              <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 dark:border-[#1C1C28] shrink-0">
              <span className="font-outfit font-bold text-[18px] text-primary dark:text-white">Raven AI</span>
              <button
                onClick={() => setIsMobileChatOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-white/[0.06] rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden min-h-0 bg-white dark:bg-[#131722]">
              <AIChatPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
