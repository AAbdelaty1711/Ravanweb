import Link from 'next/link'

export default function BentoGrid() {
  return (
    <div id="phase4">
      <div id="bento-grid">
        {/* ... existing cells ... */}
        <div className="bento-cell b1">
          <div className="bento-tag">PORTFOLIO PERFORMANCE</div>
          <div className="bento-title">Exceptional Returns Powered by AI</div>
          <div className="bento-val">+34.8%</div>
          <span className="bento-badge badge-green">↑ +12.3% this month</span>

          {/* NEW: Extra stats only visible on mobile to fill empty space */}
          <div className="mobile-extra-stats">
            <span className="bento-badge badge-green">Win Rate 89%</span>
            <span className="bento-badge badge-green">Sharpe 2.4</span>
          </div>

          <svg id="mini-chart" viewBox="0 0 300 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(74,222,128,0.3)" />
                <stop offset="100%" stopColor="rgba(74,222,128,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,70 L30,60 L60,55 L90,45 L120,40 L150,30 L180,25 L210,15 L240,18 L270,10 L300,5 L300,80 L0,80 Z"
              fill="url(#chart-fill)"
            />
            <path
              d="M0,70 L30,60 L60,55 L90,45 L120,40 L150,30 L180,25 L210,15 L240,18 L270,10 L300,5"
              stroke="#4ADE80"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="bento-cell b2">
          <div className="bento-tag">SMART ALERTS</div>
          <div className="bento-title">
            Real-time Signals at Peak Opportunity
          </div>
          <div className="bento-val" style={{ fontSize: '1.8rem' }}>
            2,847
          </div>
          <div className="bento-desc">alert sent today</div>
        </div>
        <div
          className="bento-cell b3"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              marginBottom: '0.3rem',
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
          <div className="bento-tag">SPEED</div>
          <div className="bento-val" style={{ fontSize: '1.6rem' }}>
            12ms
          </div>
          <div className="bento-desc" style={{ fontSize: '0.65rem' }}>
            Response Time
          </div>
        </div>
        <div className="bento-cell b4">
          <div className="bento-tag">MARKET THREADS</div>
          <div className="bento-title">Smarter tracking across 50+ markets</div>
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              marginTop: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <span className="bento-badge badge-green">AAPL +2.1%</span>
            <span className="bento-badge badge-red">TSLA -1.3%</span>
            <span className="bento-badge badge-green">NVDA +4.8%</span>
          </div>
        </div>
        <div
          className="bento-cell b5"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2.2rem',
              marginBottom: '0.3rem',
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
              <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Z"></path>
            </svg>
          </div>
          <div className="bento-title" style={{ fontSize: '0.85rem' }}>
            Capital Protection
          </div>
        </div>
        <div className="bento-cell b6">
          <div className="bento-tag">USER TRUST</div>
          <div className="bento-val" style={{ fontSize: '1.8rem' }}>
            98.4%
          </div>
          <div className="bento-desc">Customer Satisfaction</div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>
              ★★★★★
            </span>
          </div>
        </div>
        <div
          className="bento-cell b7"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div>
            <div className="bento-tag">START YOUR JOURNEY</div>
            <div className="bento-title">Join over 50,000 smart traders</div>
          </div>
        </div>
      </div>
    </div>
  )
}
