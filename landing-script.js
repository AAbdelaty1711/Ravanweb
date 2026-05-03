// ============================================================
      // RAVEN AI — CINEMATIC SCROLL ENGINE (STORYTELLING EDITION)
      // ============================================================

      const lerp = (a, b, t) => a + (b - a) * t
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
      const norm = (v, min, max) => clamp((v - min) / (max - min), 0, 1)
      const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
      const easeOut = (t) => 1 - Math.pow(1 - t, 3)
      const easeIn = (t) => t * t * t

      // State
      let scrollY = 0,
        targetScrollY = 0
      let scrollProgress = 0 // 0 to 1
      let lerpedProgress = 0
      let raf

      // Elements
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

      // ============================================================
      // GENERATE CHAOS LINES
      // ============================================================
      const NUM_CHAOS = 28
      const chaosData = []

      function generateChaosLines() {
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

        greenTrend.setAttribute(
          'd',
          'M -50 800 C 200 700, 400 550, 600 420 C 800 300, 1000 200, 1440 80'
        )
      }

      // ============================================================
      // GENERATE QR CODES
      // ============================================================
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
      generateQR('qr1')
      generateQR('qr2')

      // ============================================================
      // PARTICLES & FLOATING NUMBERS
      // ============================================================
      function spawnParticles() {
        const container = document.getElementById('particles')
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

      // ============================================================
      // PHONE CAROUSEL LOGIC (Auto-play + Dot Click + Touch Swipe)
      // ============================================================
      let phoneAutoScrollTimer;
      function initPhoneCarousel() {
          const carousel = document.getElementById('phone-carousel');
          const dots = document.querySelectorAll('.p-dot');
          if (!carousel) return;

          function updateDots() {
              if (carousel.offsetWidth === 0) return;
              const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
              dots.forEach((d, i) => d.classList.toggle('active', i === index));
          }

          carousel.addEventListener('scroll', updateDots);

          const startAutoPlay = () => {
              clearInterval(phoneAutoScrollTimer);
              phoneAutoScrollTimer = setInterval(() => {
                  if (carousel.offsetWidth === 0) return;
                  let currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
                  currentIndex = (currentIndex + 1) % dots.length; 
                  carousel.scrollTo({ left: currentIndex * carousel.offsetWidth, behavior: 'smooth' });
              }, 3000); // 3 seconds per slide
          };
          const stopAutoPlay = () => clearInterval(phoneAutoScrollTimer);

          // Mobile Touch Events (Native smooth scrolling applies)
          carousel.addEventListener('touchstart', stopAutoPlay, {passive: true});
          carousel.addEventListener('touchend', startAutoPlay);

          // Desktop Hover Events
          carousel.addEventListener('mouseenter', stopAutoPlay);
          carousel.addEventListener('mouseleave', startAutoPlay);

          // Clickable Dots Navigation
          dots.forEach((dot, index) => {
              dot.addEventListener('click', () => {
                  if (carousel.offsetWidth === 0) return;
                  stopAutoPlay();
                  carousel.scrollTo({ left: index * carousel.offsetWidth, behavior: 'smooth' });
                  startAutoPlay();
              });
              // Make dots appear clickable
              dot.style.cursor = 'pointer';
          });

          // Reset cursor for the carousel itself since dragging is removed
          carousel.style.cursor = 'default';

          startAutoPlay();
      }

      // ============================================================
      // MAIN RENDER LOOP (The Magic Happens Here)
      // ============================================================
      function render() {
        const maxScroll = document.body.scrollHeight - window.innerHeight
        targetScrollY = window.scrollY
        lerpedProgress = lerp(lerpedProgress, targetScrollY / maxScroll, 0.07)
        const p = lerpedProgress 

        // Progress bar
        progressBar.style.width = p * 100 + '%'
        // Orb parallax
        orb1.style.transform = `translateY(${p * -80}px)`

        // Update Phase dots logic (put this near the top of render function if needed, or just update the thresholds)
        let currentPhase = 0
        if (p < 0.28) currentPhase = 0
        else if (p < 0.53) currentPhase = 1 // Chaos runs longer
        else if (p < 0.72) currentPhase = 2 // Core starts later
        else currentPhase = 3
        phaseDots.forEach((d, i) => Math.abs(currentPhase - i) === 0 ? d.classList.add('active') : d.classList.remove('active'))

        // ── PHASE 1: LOGO DRAW & DASHBOARD REVEAL ──
        if (p < 0.40) {
          phase1.style.opacity = 1
          phase1.style.display = 'flex'
        } else {
          phase1.style.opacity = 0
          phase1.style.display = 'none'
        }

        const drawP = clamp(p / 0.15, 0, 1)
        const logoPath = document.getElementById('raven-logo-path')
        if (logoPath) logoPath.style.strokeDashoffset = logoPathLen * (1 - easeOut(drawP))

        const pA = norm(p, 0.15, 0.28)
        const pAe = easeInOut(pA)

        const logoSvgEl = document.getElementById('raven-logo-svg')
        const targetSvg = document.getElementById('target-logo-svg')
        const heroLogoEl = document.getElementById('hero-logo')
        const heroSubEl = document.getElementById('hero-sub')

        // Fade Hero Text
        if (heroLogoEl) heroLogoEl.style.opacity = p > 0.08 ? String(Math.max(0, lerp(1, 0, easeIn(norm(p, 0.08, 0.14))))) : '1'
        if (heroSubEl) heroSubEl.style.opacity = p > 0.08 ? String(Math.max(0, lerp(1, 0, easeIn(norm(p, 0.08, 0.13))))) : '1'

        // PIXEL-PERFECT LOGO MORPHING
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
            logoSvgEl.style.opacity = pAe > 0.92 ? String(lerp(1, 0, norm(pAe, 0.92, 1))) : '1'
            targetSvg.style.opacity = pAe > 0.85 ? String(lerp(0, 1, norm(pAe, 0.85, 1))) : '0'

            // Glow & Stroke Transition
            if (pA < 0.55) {
              logoSvgEl.style.filter = 'drop-shadow(0 0 20px rgba(255,255,255,0.6)) drop-shadow(0 0 60px rgba(255,255,255,0.25))'
            } else {
              const t = norm(pA, 0.55, 1)
              logoSvgEl.style.filter = `drop-shadow(0 0 ${lerp(20, 12, t)}px rgba(255,255,255,${lerp(0.6, 0, t)})) drop-shadow(0 0 ${lerp(0, 20, t)}px rgba(74,222,128,${lerp(0, 0.5, t)}))`
            }
            if (logoPath) logoPath.style.stroke = '#FFFFFF'
          }
        }

        // ── Sub-phase B: Dashboard Reveal (0.13 → 0.28) ──────
        const pB = norm(p, 0.13, 0.28)
        const pBe = easeOut(pB)

        // Keep parent opacity 1 during morph so the laser line stays 100% bright
        if (p < 0.28) {
            premiumDash.style.opacity = String(pBe);
            premiumDash.style.transform = `scale(${lerp(0.96, 1, pBe)})`;
        } else if (p >= 0.28 && p < 0.5) {
            premiumDash.style.opacity = '1'; 
            premiumDash.style.transform = 'scale(1)';
        } else {
            premiumDash.style.opacity = '0';
        }

        // =========================================================================
        // 🚀 STORYTELLING HANDOFF: FADE UI RAPIDLY, KEEP LASER BRIGHT
        // =========================================================================
        const dashShell = document.getElementById('dash-shell');
        const dashChatMain = document.getElementById('dash-chat-main');
        const pFlatten = norm(p, 0.28, 0.35); 
        const flyCurve = easeIn(pFlatten);
        
        // Dynamically control the top green line pseudo-element
        let dynStyle = document.getElementById('dynamic-dash-style');
        if (!dynStyle) {
            dynStyle = document.createElement('style');
            dynStyle.id = 'dynamic-dash-style';
            document.head.appendChild(dynStyle);
        }

        if (p > 0.28 && p < 0.5) {
            if (dashShell) dashShell.style.overflow = 'visible';
            if (dashChatMain) dashChatMain.style.overflow = 'visible';
            premiumDash.style.pointerEvents = 'none'; 

            // Fade out ONLY the UI components rapidly (1.5x speed)
            const uiOpacity = Math.max(0, lerp(1, 0, flyCurve * 1.5));

            if (dashShell) {
                dashShell.style.background = `rgba(10, 14, 20, ${lerp(0.72, 0, flyCurve * 1.5)})`;
                dashShell.style.borderColor = `rgba(255, 255, 255, ${lerp(0.07, 0, flyCurve * 1.5)})`;
                dashShell.style.boxShadow = 'none';
            }

            dynStyle.innerHTML = `#dash-shell::before { opacity: ${uiOpacity} !important; }`;

            const chatElements = document.querySelectorAll('#dash-sidebar, #dash-chat-header, .dash-chat-tagline, .dash-chat-subtagline, #dash-chat-input-row');
            chatElements.forEach(el => { el.style.opacity = String(uiOpacity); });

            // FLATTEN THE TARGET LOGO AND FLY IT UP (Stays 100% Bright)
            if (targetSvg) {
                targetSvg.style.opacity = '1';
                
                const moveUp = lerp(0, -window.innerHeight * 0.55, flyCurve);
                const scaleX = lerp(1, 40, flyCurve);
                const scaleY = lerp(1, 0.005, flyCurve);
                
                targetSvg.style.transform = `translateY(${moveUp}px) scaleX(${scaleX}) scaleY(${scaleY})`;
                
                const targetPath = targetSvg.querySelector('path');
                if (targetPath) targetPath.style.stroke = '#4ADE80';
                targetSvg.style.filter = `drop-shadow(0 0 ${lerp(20, 80, flyCurve)}px rgba(74, 222, 128, 1))`;
            }
        } else if (p <= 0.28) {
            // Reset state when scrolling up
            if (dashShell) {
                dashShell.style.overflow = 'hidden';
                dashShell.style.background = 'rgba(10, 14, 20, 0.72)';
                dashShell.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                dashShell.style.boxShadow = '0 0 0 1px rgba(74, 222, 128, 0.08), 0 60px 120px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.06)';
            }
            if (dashChatMain) dashChatMain.style.overflow = 'hidden';
            
            dynStyle.innerHTML = `#dash-shell::before { opacity: 1 !important; }`;
            premiumDash.style.pointerEvents = 'auto';

            const chatElements = document.querySelectorAll('#dash-sidebar, #dash-chat-header, .dash-chat-tagline, .dash-chat-subtagline, #dash-chat-input-row');
            chatElements.forEach(el => { el.style.opacity = '1'; });

            if (targetSvg) {
                targetSvg.style.transform = 'translateY(0px) scaleX(1) scaleY(1)';
                targetSvg.style.filter = 'drop-shadow(0 0 18px rgba(74, 222, 128, 0.55)) drop-shadow(0 0 40px rgba(74, 222, 128, 0.22))';
                const targetPath = targetSvg.querySelector('path');
                if (targetPath) targetPath.style.stroke = '#FFFFFF';
            }
        }

        // ── PHASE 2: CHAOS SCAN ──
        const p2 = norm(p, 0.35, 0.5) 
        
        if (p >= 0.28 && p <= 0.55) {
          phase2.style.opacity = p < 0.35 ? norm(p, 0.28, 0.35) : p > 0.5 ? lerp(1, 0, norm(p, 0.5, 0.55)) : 1
          phase2.style.pointerEvents = 'auto'
        } else {
          phase2.style.opacity = 0
          phase2.style.pointerEvents = 'none'
        }

        // Handoff to scan line
        if (pFlatten >= 1) {
             if(targetSvg) targetSvg.style.opacity = '0';
             scanLine.style.opacity = '1';
        } else {
             scanLine.style.opacity = '0';
        }

        const scanY = lerp(-2, 102, easeInOut(p2))
        scanLine.style.top = scanY + '%'

        // =========================================================================
        // 🚀 Float numbers & Chaos lines Logic (STRICTLY AFTER CHAT FADES)
        // =========================================================================
        floatNums.forEach((el, i) => {
          const yPct = parseFloat(el.style.top) / 100;
          const scanned = scanY / 100 > yPct + 0.05;
          
          // Wait until p=0.33 (chat is gone), finish by p=0.35 (before scan drops)
          const appearDelay = (1 - yPct) * 0.01; 
          const appearP = norm(p, 0.33 + appearDelay, 0.34 + appearDelay);
          const fadeOutP = lerp(1, 0, norm(p2, 0.6, 1));
          
          const baseOp = p2 < 0.6 ? appearP : fadeOutP;
          el.style.opacity = scanned ? 0 : baseOp * (0.4 + 0.6 * Math.sin(Date.now() * 0.003 + i));
        });

        chaosData.forEach((item, i) => {
          const lineYPct = (item.y / 900) * 100;
          const isScanned = scanY > lineYPct - 2;
          const transitionT = clamp((scanY - lineYPct + 2) / 8, 0, 1);
          const eT = easeOut(transitionT);

          if (isScanned) {
            item.path.style.opacity = lerp(1, 0, eT);
            item.calmPath.style.opacity = eT * 0.6;
          } else {
            const reverseIdx = chaosData.length - 1 - i; 
            const appearDelay = reverseIdx * 0.0004; 
            
            // Fade in strictly between 0.33 and 0.345 (after chat UI fades out)
            item.path.style.opacity = String(norm(p, 0.33 + appearDelay, 0.34 + appearDelay));
            item.calmPath.style.opacity = '0';
          }
        });

        const trendProgress = clamp((p2 - 0.3) / 0.7, 0, 1)
        greenTrend.style.strokeDashoffset = lerp(1800, 0, easeOut(trendProgress))
        greenTrend.style.opacity = trendProgress > 0 ? 1 : 0

        const p2textT = norm(p2, 0.7, 0.95)
        p2text.style.opacity = easeOut(p2textT)
        p2text.style.transform = `translateX(-50%) translateY(${lerp(20, 0, easeOut(p2textT))}px)`

        // ── PHASE 3 (CORE) ──
        // Fade out earlier (by 0.69) so Phase 4 has a clean slate
        const p3 = norm(p, 0.54, 0.69)
        if (p >= 0.52 && p <= 0.70) {
          // Fade in 0.52 -> 0.56, Fade out 0.66 -> 0.69
          phase3.style.opacity = p < 0.56 ? easeOut(norm(p, 0.52, 0.56)) : p > 0.66 ? lerp(1, 0, norm(p, 0.66, 0.69)) : 1
          phase3.style.pointerEvents = p < 0.66 ? 'auto' : 'none'
        } else {
          phase3.style.opacity = 0
          phase3.style.pointerEvents = 'none'
        }

        feedLine.style.height = lerp(0, 80, easeOut(norm(p3, 0, 0.25))) + 'px'
        node1.classList.toggle('active', norm(p3, 0.2, 0.4) > 0.5)
        node2.classList.toggle('active', norm(p3, 0.4, 0.6) > 0.5)
        node3.classList.toggle('active', norm(p3, 0.6, 0.8) > 0.5)
        
        const coreCard = document.getElementById('core-card')
        if(coreCard) coreCard.style.transform = `scale(${lerp(0.85, 1, easeOut(norm(p3, 0, 0.25)))})`

        // ── PHASE 4 (BENTO) & PHASE 5 (ASSEMBLY) ──
        const p4 = norm(p, 0.70, 0.82); 
        const pAssemble = norm(p, 0.82, 0.94); 
        const assembleCurve = easeInOut(pAssemble);

        if (p >= 0.70 && p <= 0.98) {
          phase4.style.opacity = p < 0.74 ? easeOut(norm(p, 0.70, 0.74)) : 1;
          phase4.style.pointerEvents = p < 0.82 ? 'auto' : 'none';
        } else {
          phase4.style.opacity = 0;
          phase4.style.pointerEvents = 'none';
        }

        const phoneCarousel = document.getElementById('phone-carousel');
        
        // 🚀 CRITICAL FIX: Lock the carousel to Slide 1 during the flight!
        if (p < 0.95 && phoneCarousel) {
            phoneCarousel.scrollLeft = 0; 
        }

        // Lock phone in place so we can measure target rects perfectly
        if (phoneWrap) phoneWrap.style.transform = `translateY(0px)`;

        const targetMap = {
            'b1': document.querySelector('.target-b1'),
            'b2': document.querySelector('.target-b2'),
            'b4': document.querySelector('.target-b4')
        };

        // Reset cache if scrolled back up
        if (p < 0.70) {
            bentoCells.forEach(cell => cell.absCX = null);
        }

        // Cache absolute centers safely
        bentoCells.forEach((cell) => {
            if (!cell.absCX && p > 0.75) {
                cell.style.transition = 'none'; // stop rubber-banding
                const oldTx = cell.style.transform;
                cell.style.transform = 'translate(0px, 0px) scale(1)';
                
                const rect = cell.getBoundingClientRect();
                if (rect.width > 0) {
                    cell.absCX = rect.left + rect.width / 2;
                    cell.absCY = rect.top + rect.height / 2;
                    cell.startW = rect.width;
                }
                
                cell.style.transform = oldTx;
                cell.offsetHeight; // force reflow
                cell.style.transition = ''; // restore css transition
            }
        });

        // Calculate actual phone center for unused cells
        let currentPhoneCX = window.innerWidth / 2;
        let currentPhoneCY = window.innerHeight / 2;
        const phoneMockupNode = document.getElementById('phone-mockup');
        if (phoneMockupNode) {
            const pRect = phoneMockupNode.getBoundingClientRect();
            if (pRect.width > 0) {
                currentPhoneCX = pRect.left + pRect.width / 2;
                currentPhoneCY = pRect.top + pRect.height / 2;
            }
        }

        // Animate Assembly
        bentoCells.forEach((cell, i) => {
          if (pAssemble === 0) {
              cell.style.transition = ''; 
              cell.style.transform = '';
              cell.style.opacity = '';
              const isRevealed = p4 > (0.1 + i * 0.08);
              cell.classList.toggle('show', isRevealed);
          } else if (pAssemble > 0 && cell.absCX) {
              cell.style.transition = 'none'; // Kill CSS transition during flight to avoid lag
              
              let tCard = null;
              if (cell.classList.contains('b1')) tCard = targetMap['b1'];
              if (cell.classList.contains('b2')) tCard = targetMap['b2'];
              if (cell.classList.contains('b4')) tCard = targetMap['b4'];

              const yOffset = 25; 

              if (tCard) {
                  const tRect = tCard.getBoundingClientRect();
                  const tCX = tRect.left + tRect.width / 2;
                  const tCY = tRect.top + tRect.height / 2;
                  
                  const dx = tCX - cell.absCX;
                  const dy = (tCY - cell.absCY) + yOffset;
                  const targetScale = tRect.width / cell.startW;

                  cell.style.transform = `translate(${lerp(0, dx, assembleCurve)}px, ${lerp(0, dy, assembleCurve)}px) scale(${lerp(1, targetScale, assembleCurve)})`;
                  cell.style.opacity = String(lerp(1, 0, norm(pAssemble, 0.85, 1))); 
              } else {
                  const dx = currentPhoneCX - cell.absCX;
                  const dy = currentPhoneCY - cell.absCY + yOffset; 

                  cell.style.transform = `translate(${lerp(0, dx, assembleCurve)}px, ${lerp(0, dy, assembleCurve)}px) scale(${lerp(1, 0.1, assembleCurve)})`;
                  cell.style.opacity = String(lerp(1, 0, norm(pAssemble, 0.7, 1)));
              }
          }
        });

        // ── PHONE (APP MOCKUP) ──
        const pPhoneReveal = norm(p, 0.92, 0.96); // Real phone UI replaces the assembled blocks
        const pPhoneText = norm(p, 0.95, 0.98);   // Buttons and title slide in

        if (p >= 0.85) {
          phoneSection.style.opacity = '1';
          phoneSection.style.pointerEvents = 'auto';
        } else {
          phoneSection.style.opacity = '0';
          phoneSection.style.pointerEvents = 'none';
        }

        if (phoneMockupNode) {
            phoneMockupNode.style.opacity = String(easeOut(pPhoneReveal));
            phoneMockupNode.style.transform = 'scale(1)'; // keep steady
        }

        const phoneTitle = document.getElementById('phone-title');
        const storeBtns = document.getElementById('store-buttons');
        
        if (phoneTitle) {
            phoneTitle.style.opacity = String(easeOut(pPhoneText));
            phoneTitle.style.transform = `translateY(${lerp(15, 0, easeOut(pPhoneText))}px)`;
        }
        if (storeBtns) {
            storeBtns.style.opacity = String(easeOut(pPhoneText));
            storeBtns.style.transform = `translateX(${lerp(-20, 0, easeOut(pPhoneText))}px)`;
        }

        raf = requestAnimationFrame(render);
      }

      // ============================================================
      // INIT
      // ============================================================
      function animateNumbers() {
        floatNums.forEach((el, i) => {
          const t = Date.now() * 0.001
          el.style.transform = `translateY(${Math.sin(t * 0.5 + i) * 5}px)`
        })
        requestAnimationFrame(animateNumbers)
      }

      generateChaosLines()
      spawnParticles()
      spawnFloatNums()

      let logoPathLen = 2000

      window.addEventListener('load', () => {
        const logoPath = document.getElementById('raven-logo-path')
        if (logoPath && logoPath.getTotalLength) {
          logoPathLen = Math.ceil(logoPath.getTotalLength())
          logoPath.style.strokeDasharray = logoPathLen
          logoPath.style.strokeDashoffset = logoPathLen
        }
        if (premiumDash) {
          premiumDash.style.opacity = 0
        }
        // Ensure the hero logo text starts visible
        const heroLogoEl = document.getElementById('hero-logo')
        if (heroLogoEl) {
          heroLogoEl.style.opacity = '1'
        }
        initPhoneCarousel();
      })

      render()
      animateNumbers()

      // Prevent scroll jump on load
      window.scrollTo(0, 0)