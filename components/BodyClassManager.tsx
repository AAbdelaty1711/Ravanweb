'use client'

import { useEffect } from 'react'

/**
 * Permanently fixes the mobile overscroll "rubber-band black void" bug.
 *
 * Root cause: the mobile browser's bounce/overscroll effect renders the
 * <html> element's background behind the page content. CSS classes stamped
 * only on <body> do NOT cover <html>, so the dark Landing Page background
 * bleeds through when the user pulls the page up or down.
 *
 * Solution: apply inline styles directly to BOTH document.documentElement
 * (<html>) AND document.body, and lock overscroll-behavior-y to "none" so
 * the bounce effect is disabled while Auth/Dashboard layouts are active.
 * Everything is cleaned up (reverted to '') on unmount so the Landing Page
 * is unaffected when navigating back.
 */
export function BodyClassManager({
  bgColor = '#f4f6f9',
}: {
  /** The light-mode background colour to apply. Defaults to the app's --color-bg. */
  bgColor?: string
}) {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    // ── Apply ────────────────────────────────────────────────────────────────
    html.style.backgroundColor = bgColor
    body.style.backgroundColor = bgColor

    // Disable the rubber-band / elastic overscroll so the bounce area never
    // exposes a different colour behind the page.
    html.style.overscrollBehaviorY = 'none'
    body.style.overscrollBehaviorY = 'none'

    // ── Cleanup (runs when layout unmounts / user navigates away) ────────────
    return () => {
      html.style.backgroundColor = ''
      body.style.backgroundColor = ''
      html.style.overscrollBehaviorY = ''
      body.style.overscrollBehaviorY = ''
    }
  }, [bgColor])

  return null
}
