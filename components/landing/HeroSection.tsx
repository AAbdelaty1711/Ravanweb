export default function HeroSection() {
  return (
    <div id="phase1">
      <div id="logo-draw-stage">
        <div id="raven-svg-wrap">
          <svg
            id="raven-logo-svg"
            viewBox="10 60 170 145"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter
                id="logo-glow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              id="raven-logo-path"
              d="m 42.398955,174.66625 c 2.364485,-9.40827 4.05641,-19.23246 8.6833,-27.85247 4.316587,-5.27252 6.839501,3.7835 8.219495,7.01558 0.553566,4.05645 6.028114,9.53741 8.114869,3.15487 4.332304,-10.57344 4.695368,-22.2921 8.865183,-32.89082 3.955844,-7.15208 7.824972,3.4296 8.275918,7.29428 1.902153,4.4944 2.176147,13.28502 8.427264,13.32501 5.207494,-2.56775 6.33981,-9.1688 9.936686,-13.34495 6.57229,-8.97556 18.32124,-10.77617 28.39272,-13.33863 10.71311,-2.50938 21.21921,-6.09771 30.88842,-11.3853 5.37305,-1.39598 -0.0618,9.28598 -2.04065,11.01856 -7.32968,1.4069 -7.74521,1.3585 -9.18108,2.82676 -2.66388,2.72398 2.48268,2.72883 1.69526,6.8397 -1.21186,6.3267 -13.32037,11.42602 -21.36004,13.70649 -4.08935,4.50372 8.48138,0.0278 7.27996,3.22828 -3.07615,4.30755 -8.84059,5.92604 -13.71423,7.51765 -6.07799,1.54704 -12.86078,2.87229 -17.3003,7.59875 3.39493,2.74642 7.75242,4.51598 11.71959,6.4777 6.7013,3.14816 13.74736,5.4524 20.66446,8.05018 1.00029,4.19558 -7.54694,3.52571 -10.7025,4.57364 -8.06642,0.7658 -17.72937,-0.57925 -22.8384,-7.5533 -2.23312,-3.38296 -2.20385,-8.65559 1.12722,-11.50227 -4.38416,-2.93957 -8.342303,-7.10778 -8.780221,-12.51186"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#logo-glow)"
            />
          </svg>
          <div id="hero-logo">Raven AI</div>
          <div id="hero-sub">MARKET INTELLIGENCE · EVERY MOMENT</div>
        </div>
      </div>

      <div id="premium-dashboard">
        <div id="dash-shell">
          <div id="dash-sidebar">
            <div className="dash-logo-mark" id="dash-logo-mark">RAVEN AI</div>

            <button className="dash-new-chat-btn">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <line x1="6.5" y1="1" x2="6.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="1" y1="6.5" x2="12" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              New Chat
            </button>

            <div className="dash-nav-item active">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7C1 3.686 3.686 1 7 1s6 2.686 6 6-2.686 6-6 6S1 10.314 1 7z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="7" cy="7" r="2" fill="currentColor" />
              </svg>
              AI Chat
            </div>
            <div className="dash-nav-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M4 3V2M10 3V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Watchlist
            </div>
            <div className="dash-nav-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 10L4.5 6l2.5 2.5L10 4l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              AI Radar
            </div>
            <div className="dash-nav-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5a4 4 0 0 1 4 4v2.5l1.5 2H1.5L3 8V5.5a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M5.5 11.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Notifications
            </div>

            <div className="dash-profile">
              <div className="dash-avatar">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M1.5 12.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="dash-profile-text">
                <div className="dash-profile-name">Trader Profile</div>
              </div>
            </div>
          </div>

          <div id="dash-chat-main">
            <div id="dash-chat-header">
              <div className="dash-chat-header-left">
                <div className="dash-chat-title">AI Chat</div>
                <div className="dash-chat-subtitle">Real-time market intelligence</div>
              </div>
              <div className="dash-markets-badge">
                <span className="live-dot"></span>
                Markets Open
              </div>
            </div>

            <div id="dash-chat-center" className="flex-1 flex flex-col items-center justify-center p-6 relative">
              {/* Lock Box for Logo */}
              <div className="logo-lock-box" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'visible' }}>
                <svg
                  id="target-logo-svg"
                  viewBox="10 60 170 145"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="target-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="m 42.398955,174.66625 c 2.364485,-9.40827 4.05641,-19.23246 8.6833,-27.85247 4.316587,-5.27252 6.839501,3.7835 8.219495,7.01558 0.553566,4.05645 6.028114,9.53741 8.114869,3.15487 4.332304,-10.57344 4.695368,-22.2921 8.865183,-32.89082 3.955844,-7.15208 7.824972,3.4296 8.275918,7.29428 1.902153,4.4944 2.176147,13.28502 8.427264,13.32501 5.207494,-2.56775 6.33981,-9.1688 9.936686,-13.34495 6.57229,-8.97556 18.32124,-10.77617 28.39272,-13.33863 10.71311,-2.50938 21.21921,-6.09771 30.88842,-11.3853 5.37305,-1.39598 -0.0618,9.28598 -2.04065,11.01856 -7.32968,1.4069 -7.74521,1.3585 -9.18108,2.82676 -2.66388,2.72398 2.48268,2.72883 1.69526,6.8397 -1.21186,6.3267 -13.32037,11.42602 -21.36004,13.70649 -4.08935,4.50372 8.48138,0.0278 7.27996,3.22828 -3.07615,4.30755 -8.84059,5.92604 -13.71423,7.51765 -6.07799,1.54704 -12.86078,2.87229 -17.3003,7.59875 3.39493,2.74642 7.75242,4.51598 11.71959,6.4777 6.7013,3.14816 13.74736,5.4524 20.66446,8.05018 1.00029,4.19558 -7.54694,3.52571 -10.7025,4.57364 -8.06642,0.7658 -17.72937,-0.57925 -22.8384,-7.5533 -2.23312,-3.38296 -2.20385,-8.65559 1.12722,-11.50227 -4.38416,-2.93957 -8.342303,-7.10778 -8.780221,-12.51186"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#target-glow)"
                  />
                </svg>
              </div>

              {/* Taglines with strict margins and styles matching HTML */}
              <div className="dash-chat-tagline" style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: "clamp(1rem, 1.8vw, 1.25rem)", 
                fontWeight: 700, 
                color: "#ffffff", 
                textAlign: "center", 
                letterSpacing: "-0.01em", 
                marginTop: "50px" 
              }}>
                Raven AI is watching the markets.
              </div>

              <div className="dash-chat-subtagline" style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: "0.82rem", 
                color: "rgba(255, 255, 255, 0.3)", 
                textAlign: "center", 
                marginTop: "15px", 
                fontWeight: 400 
              }}>
                What's our target?
              </div>
            </div>

            <div id="dash-chat-input-row">
              <div className="dash-chat-input-wrap">
                <input
                  className="dash-chat-input"
                  type="text"
                  placeholder="Ask Raven AI for market insights..."
                  readOnly
                />
                <div className="dash-chat-send-btn">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 12L12 6.5 1 1v4.5l8 2-8 2V12z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
