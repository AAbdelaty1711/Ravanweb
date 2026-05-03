// @ts-nocheck
'use client'
import { useEffect } from 'react'
import './landing.css'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import ChaosSection from '../components/landing/ChaosSection'
import CoreSection from '../components/landing/CoreSection'
import BentoGrid from '../components/landing/BentoGrid'
import PhoneMockup from '../components/landing/PhoneMockup'

export default function LandingPage() {
  useEffect(() => {
    // Prevent scroll jump on load
    window.scrollTo(0, 0)

    // ── Landing page: force dark background on html+body via inline styles ──
    // MUST be inline (not a <style> tag) so the cleanup() below can reliably
    // remove them when navigating away.  BodyClassManager in Auth/Dashboard
    // then takes over with the light colour.
    const html = document.documentElement
    html.style.backgroundColor = '#0d0d0d'
    html.style.overscrollBehaviorY = 'none'
    document.body.style.backgroundColor = '#0d0d0d'
    document.body.style.overscrollBehaviorY = 'none'
    // Set landing page scroll height inline so cleanup can remove it reliably
    document.body.style.height = window.innerWidth < 768 ? '400vh' : '600vh'

    const lerp = (a, b, t) => a + (b - a) * t
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
    const norm = (v, min, max) => clamp((v - min) / (max - min), 0, 1)
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const easeIn = (t) => t * t * t

    let scrollY = 0,
      targetScrollY = 0
    let scrollProgress = 0
    let lerpedProgress = 0
    let raf

    const stage = document.getElementById('stage')
    const phase1 = document.getElementById('phase1')
    const phase2 = document.getElementById('phase2')
    const phase3 = document.getElementById('phase3')
    const phase4 = document.getElementById('phase4')
    const phoneSection = document.getElementById('phone-section')
    const logoDrawStage = document.getElementById('logo-draw-stage')
    const premiumDash = document.getElementById('premium-dashboard')

    const scanLine = document.getElementById('scan-line')
    const chaosSvg = document.getElementById('chaos-svg')
    const chaosLines = document.getElementById('chaos-lines')
    const calmLines = document.getElementById('calm-lines')
    const greenTrend = document.getElementById('green-trend')
    const p2text = document.getElementById('phase2-text')
    const feedLine = document.getElementById('feed-line')
    const node1 = document.getElementById('node1')
    const node2 = document.getElementById('node2')
    const node3 = document.getElementById('node3')
    const bentoCells = document.querySelectorAll('.bento-cell')
    const phoneWrap = document.getElementById('phone-wrap')
    const progressBar = document.getElementById('scroll-progress')
    const phaseDots = document.querySelectorAll('.phase-dot')
    const orb1 = document.getElementById('orb1')

    const NUM_CHAOS = 28
    const chaosData = []

    function generateChaosLines() {
      if (!chaosLines || !calmLines) return
      chaosLines.innerHTML = ''
      calmLines.innerHTML = ''

      for (let i = 0; i < NUM_CHAOS; i++) {
        const y = 80 + (i / NUM_CHAOS) * 740
        const amplitude = 30 + Math.random() * 60
        const freq = 0.01 + Math.random() * 0.02
        const phase = Math.random() * Math.PI * 2
        const chaos = 15 + Math.random() * 25

        let d = `M 0 ${y}`
        for (let x = 0; x <= 1440; x += 20) {
          const jitter = (Math.random() - 0.5) * chaos
          const wave = Math.sin(x * freq + phase) * amplitude
          d += ` L ${x} ${y + wave + jitter}`
        }

        const opacity = 0.3 + Math.random() * 0.5
        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        path.setAttribute('d', d)
        path.setAttribute('stroke', `rgba(248,113,113,${opacity})`)
        path.setAttribute('stroke-width', 1 + Math.random() * 1.5)
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke-linecap', 'round')

        const len = path.getTotalLength ? path.getTotalLength() || 2000 : 2000
        path.setAttribute('stroke-dasharray', len)
        path.setAttribute('stroke-dashoffset', 0)

        chaosLines.appendChild(path)

        const flatD = `M 0 ${y} L 1440 ${y}`
        const calmPath = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        calmPath.setAttribute('d', flatD)
        calmPath.setAttribute('stroke', 'rgba(107,114,128,0.2)')
        calmPath.setAttribute('stroke-width', 0.8)
        calmPath.setAttribute('fill', 'none')
        calmPath.style.opacity = 0
        calmLines.appendChild(calmPath)

        chaosData.push({ path, calmPath, y, len })
      }

      if (greenTrend) {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          // Mobile only: Draw the line within the visible center slice (X: 350 to 1090)
          greenTrend.setAttribute(
            'd',
            'M 350 800 C 500 700, 600 550, 720 420 C 840 300, 950 200, 1090 80'
          )
        } else {
          // Desktop: The untouched original path
          greenTrend.setAttribute(
            'd',
            'M -50 800 C 200 700, 400 550, 600 420 C 800 300, 1000 200, 1440 80'
          )
        }
      }
    }

    function generateQR(id) {
      const el = document.getElementById(id)
      if (!el) return
      const pattern = []
      for (let i = 0; i < 49; i++) pattern.push(Math.random() > 0.5)
      ;[
        0, 1, 2, 7, 8, 14, 6, 13, 20, 42, 43, 44, 49, 48, 47, 35, 36, 41,
      ].forEach((i) => {
        if (i < 49) pattern[i] = true
      })
      el.innerHTML = pattern
        .map(
          (v) =>
            `<div style="width:100%;height:100%;background:${v ? '#000' : '#fff'};border-radius:1px;"></div>`
        )
        .join('')
    }

    function spawnParticles() {
      const container = document.getElementById('particles')
      if (!container) return
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        p.style.left = Math.random() * 100 + '%'
        p.style.top = 40 + Math.random() * 50 + '%'
        p.style.setProperty('--dx', (Math.random() - 0.5) * 60 + 'px')
        const dur = 4 + Math.random() * 8
        p.style.animationDuration = dur + 's'
        p.style.animationDelay = -Math.random() * dur + 's'
        p.style.width = p.style.height = 1 + Math.random() * 2 + 'px'
        p.style.opacity = 0.3 + Math.random() * 0.4
        container.appendChild(p)
      }
    }

    const floatNums = []
    function spawnFloatNums() {
      const tickers = [
        '2847.3',
        '-12.4%',
        '0.0034',
        'BUY',
        'SELL',
        'VOL 2.4M',
        '+0.87',
        '-3.2%',
        '14.03',
        'RSI 78',
        'MACD',
        '98.22',
        '-0.91',
        'OBV↑',
        '4.2B',
      ]
      const container = document.getElementById('particles')
      if (!container) return
      for (let i = 0; i < 35; i++) {
        const el = document.createElement('div')
        el.className = 'float-num'
        el.textContent = tickers[i % tickers.length]
        el.style.left = 2 + Math.random() * 96 + '%'
        el.style.top = 5 + Math.random() * 90 + '%'
        el.style.opacity = 0
        el.style.color =
          Math.random() > 0.5 ? 'var(--red)' : 'rgba(255,255,255,0.3)'
        el.style.fontSize = 0.55 + Math.random() * 0.35 + 'rem'
        container.appendChild(el)
        floatNums.push(el)
      }
    }

    let phoneAutoScrollTimer
    function initPhoneCarousel() {
      const carousel = document.getElementById('phone-carousel')
      const dots = document.querySelectorAll('.p-dot')
      if (!carousel) return

      function updateDots() {
        if (carousel.offsetWidth === 0) return
        const index = Math.round(carousel.scrollLeft / carousel.offsetWidth)
        dots.forEach((d, i) => d.classList.toggle('active', i === index))
      }

      carousel.addEventListener('scroll', updateDots)

      const startAutoPlay = () => {
        clearInterval(phoneAutoScrollTimer)
        phoneAutoScrollTimer = setInterval(() => {
          if (carousel.offsetWidth === 0) return
          let currentIndex = Math.round(
            carousel.scrollLeft / carousel.offsetWidth
          )
          currentIndex = (currentIndex + 1) % dots.length
          carousel.scrollTo({
            left: currentIndex * carousel.offsetWidth,
            behavior: 'smooth',
          })
        }, 3000)
      }
      const stopAutoPlay = () => clearInterval(phoneAutoScrollTimer)

      carousel.addEventListener('touchstart', stopAutoPlay, { passive: true })
      carousel.addEventListener('touchend', startAutoPlay)
      carousel.addEventListener('mouseenter', stopAutoPlay)
      carousel.addEventListener('mouseleave', startAutoPlay)

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          if (carousel.offsetWidth === 0) return
          stopAutoPlay()
          carousel.scrollTo({
            left: index * carousel.offsetWidth,
            behavior: 'smooth',
          })
          startAutoPlay()
        })
        dot.style.cursor = 'pointer'
      })

      carousel.style.cursor = 'default'
      startAutoPlay()
    }

    function render() {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      if (maxScroll <= 0) {
        raf = requestAnimationFrame(render)
        return
      }
      targetScrollY = window.scrollY
      lerpedProgress = lerp(lerpedProgress, targetScrollY / maxScroll, 0.07)
      const p = lerpedProgress

      if (progressBar) progressBar.style.width = p * 100 + '%'
      if (orb1) orb1.style.transform = `translateY(${p * -80}px)`

      let currentPhase = 0
      if (p < 0.28) currentPhase = 0
      else if (p < 0.53) currentPhase = 1
      else if (p < 0.72) currentPhase = 2
      else currentPhase = 3
      phaseDots.forEach((d, i) =>
        Math.abs(currentPhase - i) === 0
          ? d.classList.add('active')
          : d.classList.remove('active')
      )

      if (phase1) {
        if (p < 0.4) {
          phase1.style.opacity = 1
          phase1.style.display = 'flex'
        } else {
          phase1.style.opacity = 0
          phase1.style.display = 'none'
        }
      }

      const drawP = clamp(p / 0.15, 0, 1)
      const logoPath = document.getElementById('raven-logo-path')
      if (logoPath)
        logoPath.style.strokeDashoffset = logoPathLen * (1 - easeOut(drawP))

      const pA = norm(p, 0.15, 0.28)
      const pAe = easeInOut(pA)

      const logoSvgEl = document.getElementById('raven-logo-svg')
      const targetSvg = document.getElementById('target-logo-svg')
      const heroLogoEl = document.getElementById('hero-logo')
      const heroSubEl = document.getElementById('hero-sub')

      if (heroLogoEl)
        heroLogoEl.style.opacity =
          p > 0.08
            ? String(Math.max(0, lerp(1, 0, easeIn(norm(p, 0.08, 0.14)))))
            : '1'
      if (heroSubEl)
        heroSubEl.style.opacity =
          p > 0.08
            ? String(Math.max(0, lerp(1, 0, easeIn(norm(p, 0.08, 0.13)))))
            : '1'

      if (logoSvgEl && targetSvg) {
        if (pA <= 0) {
          logoSvgEl.style.transform = ''
          logoSvgEl.style.opacity = '1'
          targetSvg.style.opacity = '0'
        } else if (pA >= 1) {
          logoSvgEl.style.opacity = '0'
        } else {
          const prevTransform = logoSvgEl.style.transform
          logoSvgEl.style.transform = 'none'
          const srcRect = logoSvgEl.getBoundingClientRect()
          logoSvgEl.style.transform = prevTransform

          const srcCX = srcRect.left + srcRect.width / 2
          const srcCY = srcRect.top + srcRect.height / 2

          const tgtRect = targetSvg.getBoundingClientRect()
          const tgtCX = tgtRect.left + tgtRect.width / 2
          const tgtCY = tgtRect.top + tgtRect.height / 2

          const endScale = tgtRect.width / srcRect.width
          const s = lerp(1, endScale, pAe)
          const tx = lerp(0, tgtCX - srcCX, pAe)
          const ty = lerp(0, tgtCY - srcCY, pAe)

          logoSvgEl.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
          logoSvgEl.style.opacity =
            pAe > 0.92 ? String(lerp(1, 0, norm(pAe, 0.92, 1))) : '1'
          targetSvg.style.opacity =
            pAe > 0.85 ? String(lerp(0, 1, norm(pAe, 0.85, 1))) : '0'

          if (pA < 0.55) {
            logoSvgEl.style.filter =
              'drop-shadow(0 0 20px rgba(255,255,255,0.6)) drop-shadow(0 0 60px rgba(255,255,255,0.25))'
          } else {
            const t = norm(pA, 0.55, 1)
            logoSvgEl.style.filter = `drop-shadow(0 0 ${lerp(20, 12, t)}px rgba(255,255,255,${lerp(0.6, 0, t)})) drop-shadow(0 0 ${lerp(0, 20, t)}px rgba(74,222,128,${lerp(0, 0.5, t)}))`
          }
          if (logoPath) logoPath.style.stroke = '#FFFFFF'
        }
      }
      const pFlatten = norm(p, 0.28, 0.35)
      const pB = norm(p, 0.13, 0.28)
      const pBe = easeOut(pB)
      const flyCurve = easeIn(pFlatten)

      const dashShell = document.getElementById('dash-shell')
      const dashChatMain = document.getElementById('dash-chat-main')

      let dynStyle = document.getElementById('dynamic-dash-style')
      if (!dynStyle) {
        dynStyle = document.createElement('style')
        dynStyle.id = 'dynamic-dash-style'
        document.head.appendChild(dynStyle)
      }

      if (p > 0.28 && p < 0.5) {
        const uiFade = norm(p, 0.28, 0.31)
        const uiOpacity = Math.max(0, lerp(1, 0, uiFade))

        if (targetSvg) {
          if (!targetSvg._portalled) {
            const rect = targetSvg.getBoundingClientRect()
            targetSvg._portalParent = targetSvg.parentElement
            targetSvg._portalSibling = targetSvg.nextSibling
            let portal = document.getElementById('svg-fly-portal')
            if (!portal) {
              portal = document.createElement('div')
              portal.id = 'svg-fly-portal'
              portal.style.cssText =
                'position:fixed;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:9999;'
              document.body.appendChild(portal)
            }
            targetSvg.style.position = 'fixed'
            targetSvg.style.top = rect.top + 'px'
            targetSvg.style.left = rect.left + 'px'
            targetSvg.style.width = rect.width + 'px'
            targetSvg.style.height = rect.height + 'px'
            targetSvg.style.margin = '0'
            portal.appendChild(targetSvg)
            targetSvg._portalled = true
          }
          targetSvg.style.opacity = '1'
          const moveUp = lerp(0, -window.innerHeight * 0.55, flyCurve)
          const scaleX = lerp(1, 40, flyCurve)
          const scaleY = lerp(1, 0.005, flyCurve)
          targetSvg.style.transform = `translateY(${moveUp}px) scaleX(${scaleX}) scaleY(${scaleY})`
          const targetPath = targetSvg.querySelector('path')
          if (targetPath) targetPath.style.stroke = '#4ADE80'
          targetSvg.style.filter = `drop-shadow(0 0 ${lerp(20, 80, flyCurve)}px rgba(74, 222, 128, 1))`
        }

        if (premiumDash) {
          premiumDash.style.opacity = String(uiOpacity)
          premiumDash.style.pointerEvents = 'none'
          premiumDash.style.display = uiOpacity === 0 ? 'none' : 'flex'
        }

        if (dashShell) {
          dashShell.style.opacity = String(uiOpacity)
          dashShell.style.background = `rgba(10, 14, 20, ${lerp(0.72, 0, uiFade)})`
          dashShell.style.borderColor = `rgba(255, 255, 255, ${lerp(0.07, 0, uiFade)})`
          dashShell.style.boxShadow = `0 0 0 1px rgba(74,222,128,${lerp(0.08, 0, uiFade)}), inset 0 1px 0 rgba(255,255,255,${lerp(0.06, 0, uiFade)})`
          dashShell.style.backdropFilter = `blur(${lerp(32, 0, uiFade)}px)`
          dashShell.style.webkitBackdropFilter = `blur(${lerp(32, 0, uiFade)}px)`
        }
        dynStyle.innerHTML = `#dash-shell::before { opacity: ${uiOpacity} !important; }`
      } else if (p <= 0.28) {
        if (targetSvg && targetSvg._portalled) {
          targetSvg.style.position = ''
          targetSvg.style.top = ''
          targetSvg.style.left = ''
          targetSvg.style.width = ''
          targetSvg.style.height = ''
          targetSvg.style.margin = ''
          if (targetSvg._portalParent) {
            targetSvg._portalParent.insertBefore(
              targetSvg,
              targetSvg._portalSibling || null
            )
          }
          targetSvg._portalled = false
        }

        if (premiumDash) {
          premiumDash.style.display = 'flex'
          premiumDash.style.pointerEvents = 'auto'
          premiumDash.style.opacity = String(pBe)
          premiumDash.style.transform = `scale(${lerp(0.96, 1, pBe)})`
        }

        if (dashShell) {
          dashShell.style.opacity = '1'
          dashShell.style.overflow = 'hidden'
          dashShell.style.background = 'rgba(10, 14, 20, 0.72)'
          dashShell.style.borderColor = 'rgba(255, 255, 255, 0.07)'
          dashShell.style.boxShadow =
            '0 0 0 1px rgba(74, 222, 128, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
          dashShell.style.backdropFilter = 'blur(32px)'
          dashShell.style.webkitBackdropFilter = 'blur(32px)'
        }
        if (dashChatMain) dashChatMain.style.overflow = 'hidden'

        dynStyle.innerHTML = `#dash-shell::before { opacity: 1 !important; }`

        const chatElements = document.querySelectorAll(
          '#dash-sidebar, #dash-chat-header, .dash-chat-tagline, .dash-chat-subtagline, #dash-chat-input-row'
        )
        chatElements.forEach((el) => {
          el.style.opacity = '1'
        })

        if (targetSvg) {
          targetSvg.style.transform = 'translateY(0px) scaleX(1) scaleY(1)'
          targetSvg.style.filter =
            'drop-shadow(0 0 8px rgba(255, 255, 255, 0.15))'
          const targetPath = targetSvg.querySelector('path')
          if (targetPath) targetPath.style.stroke = '#FFFFFF'
        }
      }

      const p2 = norm(p, 0.35, 0.5)

      if (phase2) {
        if (p >= 0.28 && p <= 0.55) {
          phase2.style.opacity =
            p < 0.35
              ? norm(p, 0.28, 0.35)
              : p > 0.5
                ? lerp(1, 0, norm(p, 0.5, 0.55))
                : 1
          phase2.style.pointerEvents = 'auto'
        } else {
          phase2.style.opacity = 0
          phase2.style.pointerEvents = 'none'
        }
      }

      if (scanLine) {
        if (pFlatten >= 1) {
          if (targetSvg) targetSvg.style.opacity = '0'
          scanLine.style.opacity = '1'
        } else {
          scanLine.style.opacity = '0'
        }
        const scanY = lerp(-2, 102, easeInOut(p2))
        scanLine.style.top = scanY + '%'

        floatNums.forEach((el, i) => {
          const yPct = parseFloat(el.style.top) / 100
          const scanned = scanY / 100 > yPct + 0.05
          const appearDelay = (1 - yPct) * 0.01
          const appearP = norm(p, 0.33 + appearDelay, 0.34 + appearDelay)
          const fadeOutP = lerp(1, 0, norm(p2, 0.6, 1))

          const baseOp = p2 < 0.6 ? appearP : fadeOutP
          el.style.opacity = scanned
            ? 0
            : baseOp * (0.4 + 0.6 * Math.sin(Date.now() * 0.003 + i))
        })

        chaosData.forEach((item, i) => {
          const lineYPct = (item.y / 900) * 100
          const isScanned = scanY > lineYPct - 2
          const transitionT = clamp((scanY - lineYPct + 2) / 8, 0, 1)
          const eT = easeOut(transitionT)

          if (isScanned) {
            item.path.style.opacity = lerp(1, 0, eT)
            item.calmPath.style.opacity = eT * 0.6
          } else {
            const reverseIdx = chaosData.length - 1 - i
            const appearDelay = reverseIdx * 0.0004
            item.path.style.opacity = String(
              norm(p, 0.33 + appearDelay, 0.34 + appearDelay)
            )
            item.calmPath.style.opacity = '0'
          }
        })
      }

      if (greenTrend) {
        const trendProgress = clamp((p2 - 0.3) / 0.7, 0, 1)
        greenTrend.style.strokeDashoffset = lerp(
          1800,
          0,
          easeOut(trendProgress)
        )
        greenTrend.style.opacity = trendProgress > 0 ? 1 : 0
      }

      if (p2text) {
        const p2textT = norm(p2, 0.7, 0.95)
        p2text.style.opacity = easeOut(p2textT)
        p2text.style.transform = `translateX(-50%) translateY(${lerp(20, 0, easeOut(p2textT))}px)`
      }

      const p3 = norm(p, 0.54, 0.69)
      if (phase3) {
        if (p >= 0.52 && p <= 0.7) {
          phase3.style.opacity =
            p < 0.56
              ? easeOut(norm(p, 0.52, 0.56))
              : p > 0.66
                ? lerp(1, 0, norm(p, 0.66, 0.69))
                : 1
          phase3.style.pointerEvents = p < 0.66 ? 'auto' : 'none'
        } else {
          phase3.style.opacity = 0
          phase3.style.pointerEvents = 'none'
        }
      }

      if (feedLine) {
        let feedLineMaxHeight = 80 // STRICT DESKTOP DEFAULT

        // MOBILE ONLY: Dynamically calculate the exact distance to the card
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          const cardNode = document.getElementById('core-card')
          if (cardNode) {
            // Gets the exact pixel distance from the top of the screen to the card's top border
            feedLineMaxHeight = cardNode.getBoundingClientRect().top
          }
        }

        // Animate the line using the calculated max height
        feedLine.style.height =
          lerp(0, feedLineMaxHeight, easeOut(norm(p3, 0, 0.25))) + 'px'
      }
      if (node1) node1.classList.toggle('active', norm(p3, 0.2, 0.4) > 0.5)
      if (node2) node2.classList.toggle('active', norm(p3, 0.4, 0.6) > 0.5)
      if (node3) node3.classList.toggle('active', norm(p3, 0.6, 0.8) > 0.5)

      const coreCard = document.getElementById('core-card')
      if (coreCard)
        coreCard.style.transform = `scale(${lerp(0.85, 1, easeOut(norm(p3, 0, 0.25)))})`

      const p4 = norm(p, 0.7, 0.82)
      const pAssemble = norm(p, 0.82, 0.94)
      const assembleCurve = easeInOut(pAssemble)

      if (phase4) {
        if (p >= 0.7 && p <= 0.98) {
          phase4.style.opacity = p < 0.74 ? easeOut(norm(p, 0.7, 0.74)) : 1
          phase4.style.pointerEvents = p < 0.82 ? 'auto' : 'none'
        } else {
          phase4.style.opacity = 0
          phase4.style.pointerEvents = 'none'
        }
      }

      const phoneCarousel = document.getElementById('phone-carousel')

      if (p < 0.95 && phoneCarousel) {
        phoneCarousel.scrollLeft = 0
      }

      if (phoneWrap) phoneWrap.style.transform = `translateY(0px)`

      const targetMap = {
        b1: document.querySelector('.target-b1'),
        b2: document.querySelector('.target-b2'),
        b4: document.querySelector('.target-b4'),
      }

      if (p < 0.7) {
        bentoCells.forEach((cell) => (cell.absCX = null))
      }

      bentoCells.forEach((cell) => {
        if (!cell.absCX && p > 0.75) {
          cell.style.transition = 'none'
          const oldTx = cell.style.transform
          cell.style.transform = 'translate(0px, 0px) scale(1)'

          const rect = cell.getBoundingClientRect()
          if (rect.width > 0) {
            cell.absCX = rect.left + rect.width / 2
            cell.absCY = rect.top + rect.height / 2
            cell.startW = rect.width
          }

          cell.style.transform = oldTx
          cell.offsetHeight
          cell.style.transition = ''
        }
      })

      let currentPhoneCX = window.innerWidth / 2
      let currentPhoneCY = window.innerHeight / 2
      const phoneMockupNode = document.getElementById('phone-mockup')
      if (phoneMockupNode) {
        const pRect = phoneMockupNode.getBoundingClientRect()
        if (pRect.width > 0) {
          currentPhoneCX = pRect.left + pRect.width / 2
          currentPhoneCY = pRect.top + pRect.height / 2
        }
      }

      bentoCells.forEach((cell, i) => {
        if (pAssemble === 0) {
          cell.style.transition = ''
          cell.style.transform = ''
          cell.style.opacity = ''
          const isRevealed = p4 > 0.1 + i * 0.08
          cell.classList.toggle('show', isRevealed)
        } else if (pAssemble > 0 && cell.absCX) {
          cell.style.transition = 'none'

          let tCard = null
          if (cell.classList.contains('b1')) tCard = targetMap['b1']
          if (cell.classList.contains('b2')) tCard = targetMap['b2']
          if (cell.classList.contains('b4')) tCard = targetMap['b4']

          // 100% STRICT ISOLATION: Check if mobile
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

          // Desktop keeps the original 25px offset. Mobile uses 0 so it aligns perfectly inside the phone screen.
          const yOffset = isMobile ? 0 : 25

          if (tCard) {
            const tRect = tCard.getBoundingClientRect()
            const tCX = tRect.left + tRect.width / 2
            const tCY = tRect.top + tRect.height / 2

            const dx = tCX - cell.absCX
            const dy = tCY - cell.absCY + yOffset

            // Default target scale and fade threshold
            let targetScale = tRect.width / cell.startW
            let fadeStart = isMobile ? 0.7 : 0.85

            // 100% STRICT ISOLATION: Fix for the abnormally tall 'b1' card on mobile
            if (isMobile && cell.classList.contains('b1')) {
              targetScale *= 0.55 // Force it to shrink more so its extended height fits cleanly
              fadeStart = 0.5 // Fade it out slightly earlier to prevent visual clutter
            }

            cell.style.transform = `translate(${lerp(0, dx, assembleCurve)}px, ${lerp(0, dy, assembleCurve)}px) scale(${lerp(1, targetScale, assembleCurve)})`
            cell.style.opacity = String(
              lerp(1, 0, norm(pAssemble, fadeStart, 1))
            )
          } else {
            const dx = currentPhoneCX - cell.absCX
            const dy = currentPhoneCY - cell.absCY + yOffset

            cell.style.transform = `translate(${lerp(0, dx, assembleCurve)}px, ${lerp(0, dy, assembleCurve)}px) scale(${lerp(1, 0.1, assembleCurve)})`
            cell.style.opacity = String(lerp(1, 0, norm(pAssemble, 0.7, 1)))
          }
        }
      })

      const pPhoneReveal = norm(p, 0.92, 0.96)
      const pPhoneText = norm(p, 0.95, 0.98)

      if (phoneSection) {
        if (p >= 0.85) {
          phoneSection.style.opacity = '1'
          phoneSection.style.pointerEvents = 'auto'
        } else {
          phoneSection.style.opacity = '0'
          phoneSection.style.pointerEvents = 'none'
        }
      }

      if (phoneMockupNode) {
        phoneMockupNode.style.opacity = String(easeOut(pPhoneReveal))
        phoneMockupNode.style.transform = 'scale(1)'
      }

      const phoneTitle = document.getElementById('phone-title')
      const storeBtns = document.getElementById('store-buttons')

      if (phoneTitle) {
        phoneTitle.style.opacity = String(easeOut(pPhoneText))
        phoneTitle.style.transform = `translateY(${lerp(15, 0, easeOut(pPhoneText))}px)`
      }
      if (storeBtns) {
        storeBtns.style.opacity = String(easeOut(pPhoneText))
        storeBtns.style.transform = `translateX(${lerp(-20, 0, easeOut(pPhoneText))}px)`
      }

      raf = requestAnimationFrame(render)
    }

    function animateNumbers() {
      floatNums.forEach((el, i) => {
        const t = Date.now() * 0.001
        el.style.transform = `translateY(${Math.sin(t * 0.5 + i) * 5}px)`
      })
      requestAnimationFrame(animateNumbers)
    }

    generateChaosLines()
    generateQR('qr1')
    generateQR('qr2')
    spawnParticles()
    spawnFloatNums()

    let logoPathLen = 2000
    const logoPath = document.getElementById('raven-logo-path')
    if (logoPath && logoPath.getTotalLength) {
      logoPathLen = Math.ceil(logoPath.getTotalLength())
      logoPath.style.strokeDasharray = logoPathLen
      logoPath.style.strokeDashoffset = logoPathLen
    }
    if (premiumDash) premiumDash.style.opacity = 0
    const heroLogoEl = document.getElementById('hero-logo')
    if (heroLogoEl) heroLogoEl.style.opacity = '1'

    initPhoneCarousel()
    render()
    animateNumbers()

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(phoneAutoScrollTimer)
      // Restore body scroll state
      document.body.style.height = ''
      document.body.style.overflow = ''
      // Remove landing-specific dark background so Auth/Dashboard get clean slate
      html.style.backgroundColor = ''
      html.style.overscrollBehaviorY = ''
      document.body.style.backgroundColor = ''
      document.body.style.overscrollBehaviorY = ''
    }
  }, [])

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ::-webkit-scrollbar { display: none; }
      `,
        }}
      />
      <Navbar />
      <div id="stage">
        <div id="particles"></div>
        <HeroSection />
        <ChaosSection />
        <CoreSection />
        <BentoGrid />
        <PhoneMockup />
      </div>
    </>
  )
}
