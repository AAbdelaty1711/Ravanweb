export default function PhoneMockup() {
  return (
    <div id="phone-section">
      <div id="phone-title">Smart Trading in Your Pocket</div>
      <div id="phone-wrap">
        <div id="store-buttons">
          <div className="store-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="store-btn-text">
              <div className="store-sub">Download on</div>
              <div className="store-name">App Store</div>
            </div>
            <div className="qr-popup">
              <div className="qr-inner" id="qr1"></div>
            </div>
          </div>
          <div className="store-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M3.18 23.76c.3.17.64.22.97.15l12.81-7.4-2.81-2.82-10.97 10.07zM.61 1.46C.23 1.83 0 2.43 0 3.22v17.56c0 .79.23 1.39.61 1.76l.09.09 9.83-9.83v-.23L.7 1.38l-.09.08zm20.44 9.35-2.63-1.52-3.12 3.12 3.12 3.12 2.65-1.52c.75-.44.75-1.16 0-1.6l-.02-.6zM3.18.24l12.81 7.4-2.81 2.82L3.18.24z" />
            </svg>
            <div className="store-btn-text">
              <div className="store-sub">Available on</div>
              <div className="store-name">Google Play</div>
            </div>
            <div className="qr-popup">
              <div className="qr-inner" id="qr2"></div>
            </div>
          </div>
        </div>

        <div id="phone-mockup">
          <div className="phone-carousel" id="phone-carousel">
            <div className="phone-slide">
              <div className="phone-header">
                <span className="phone-logo">RAVEN</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--green)' }}>
                  ● LIVE
                </span>
              </div>
              <div className="phone-card target-b1">
                <div
                  style={{
                    fontSize: '0.5rem',
                    color: 'var(--green)',
                    letterSpacing: '0.1em',
                    marginBottom: '2px',
                  }}
                >
                  PORTFOLIO PERFORMANCE
                </div>
                <div className="phone-price">+34.8%</div>
                <svg
                  className="phone-mini-chart"
                  viewBox="0 0 160 35"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,30 L20,25 L40,22 L60,15 L80,12 L100,8 L120,10 L140,5 L160,3"
                    stroke="#4ADE80"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
              <div
                className="phone-card target-b2"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.5rem',
                      color: 'var(--green)',
                      letterSpacing: '0.1em',
                      marginBottom: '2px',
                    }}
                  >
                    SMART ALERTS
                  </div>
                  <div className="phone-price" style={{ fontSize: '1.1rem' }}>
                    2,847
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    color: 'var(--green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17Z"></path>
                  </svg>
                </div>
              </div>
              <div className="phone-card target-b4">
                <div
                  style={{
                    fontSize: '0.5rem',
                    color: 'var(--green)',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}
                >
                  MARKET THREADS
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  <span
                    className="bento-badge badge-green"
                    style={{
                      fontSize: '0.45rem',
                      padding: '0.15rem 0.4rem',
                      margin: 0,
                    }}
                  >
                    AAPL +2.1%
                  </span>
                  <span
                    className="bento-badge badge-red"
                    style={{
                      fontSize: '0.45rem',
                      padding: '0.15rem 0.4rem',
                      margin: 0,
                    }}
                  >
                    TSLA -1.3%
                  </span>
                </div>
              </div>
            </div>

            <div className="phone-slide">
              <div className="p-chat-center">
                <div
                  className="phone-logo"
                  style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}
                >
                  RAVEN AI
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  Raven AI is watching the markets.
                  <br />
                  <span
                    style={{
                      color: 'var(--gray-light)',
                      fontWeight: 400,
                      fontSize: '0.7rem',
                    }}
                  >
                    What's our target?
                  </span>
                </div>
              </div>
              <div className="p-chat-input">Ask Raven AI for insights...</div>
            </div>

            <div className="phone-slide">
              <div className="p-header-sm">
                <span>&lt;</span> Watchlist
              </div>
              <div className="p-list-item">
                <div className="p-col">
                  <div className="p-sym">AAPL</div>
                  <div className="p-sub">Apple Inc.</div>
                </div>
                <div className="p-col">
                  <div className="p-val">$189.30</div>
                  <div className="p-badge up">+4.6%</div>
                </div>
                <div className="p-col" style={{ textAlign: 'right' }}>
                  <div className="p-sub">T1 $198.00</div>
                  <div className="p-sub">T2 $210.50</div>
                </div>
              </div>
              <div className="p-list-item">
                <div className="p-col">
                  <div className="p-sym">NVDA</div>
                  <div className="p-sub">NVIDIA Corp</div>
                </div>
                <div className="p-col">
                  <div className="p-val">$875.20</div>
                  <div className="p-badge up">+5.1%</div>
                </div>
                <div className="p-col" style={{ textAlign: 'right' }}>
                  <div className="p-sub">T1 $920.00</div>
                  <div className="p-sub">T2 $980.00</div>
                </div>
              </div>
              <div className="p-list-item">
                <div className="p-col">
                  <div className="p-sym">TSLA</div>
                  <div className="p-sub">Tesla Inc.</div>
                </div>
                <div className="p-col">
                  <div className="p-val" style={{ color: 'var(--red)' }}>
                    $248.50
                  </div>
                  <div className="p-badge dn">-7.4%</div>
                </div>
                <div className="p-col" style={{ textAlign: 'right' }}>
                  <div className="p-sub">T1 $230.00</div>
                  <div className="p-sub">T2 $215.00</div>
                </div>
              </div>
            </div>

            <div className="phone-slide">
              <div className="p-header-sm">
                <span>&lt;</span> AI Radar
              </div>
              <div className="p-radar-card border-green">
                <div className="p-r-top">
                  <div className="p-sym">NVDA</div>
                  <div className="p-sub">2 hours ago</div>
                </div>
                <div className="p-r-bot">
                  <div>
                    <div className="p-sub">Entry</div>
                    <div className="p-val-sm">$850.50</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="p-sub">Max Return</div>
                    <div className="p-val-sm up">+4.2%</div>
                  </div>
                </div>
              </div>
              <div className="p-radar-card border-red">
                <div className="p-r-top">
                  <div className="p-sym">TSLA</div>
                  <div className="p-sub">1 day ago</div>
                </div>
                <div className="p-r-bot">
                  <div>
                    <div className="p-sub">Entry</div>
                    <div className="p-val-sm">$175.20</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="p-sub">Max Return</div>
                    <div className="p-val-sm dn">-3.8%</div>
                  </div>
                </div>
              </div>
              <div className="p-radar-card border-gray">
                <div className="p-r-top">
                  <div className="p-sym">COIN</div>
                  <div className="p-sub">5 hours ago</div>
                </div>
                <div className="p-r-bot">
                  <div>
                    <div className="p-sub">Entry</div>
                    <div className="p-val-sm">$210.00</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="p-sub">Max Return</div>
                    <div className="p-val-sm up">+1.5%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="phone-slide">
              <div className="p-header-sm">
                <span>&lt;</span> Notifications
              </div>
              <div className="p-notif-card">
                <div className="p-notif-head">
                  <span className="p-badge-outline">AI Radar</span> NVDA{' '}
                  <span className="p-time">2m ago</span>
                </div>
                <div className="p-notif-title">AI Radar Signal</div>
                <div className="p-notif-desc">
                  NVDA is showing a Golden Cross pattern with high volume surge.
                </div>
              </div>
              <div className="p-notif-card">
                <div className="p-notif-head">
                  <span className="p-badge-outline green">Price Alert</span>{' '}
                  AAPL <span className="p-time">18m ago</span>
                </div>
                <div className="p-notif-title">Price Alert Triggered</div>
                <div className="p-notif-desc">
                  AAPL has reached your target price of $198.00.
                </div>
              </div>
            </div>
          </div>

          <div className="phone-dots" id="phone-dots">
            <div className="p-dot active"></div>
            <div className="p-dot"></div>
            <div className="p-dot"></div>
            <div className="p-dot"></div>
            <div className="p-dot"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
