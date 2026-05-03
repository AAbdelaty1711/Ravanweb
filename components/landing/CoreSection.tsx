export default function CoreSection() {
  return (
    <div id="phase3">
      <div id="feed-line"></div>
      <div id="core-card">
        <div className="core-label">● PROCESSING CORE ●</div>
        <div className="core-title">Raven Intelligence Engine</div>
        <svg width="100%" height="3" style={{ marginBottom: "0.5rem" }}>
          <line
            x1="0"
            y1="1.5"
            x2="100%"
            y2="1.5"
            stroke="url(#sep-grad)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="sep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(74,222,128,0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        <div id="nodes-container">
          <div className="node" id="node1">
            <div className="node-dot"></div>
            <div className="node-text">
              <div className="node-name">Sentiment Analysis</div>
              <div className="node-desc">AI News Feed Evaluation</div>
            </div>
            <div className="node-val">+87%</div>
          </div>
          <div className="node" id="node2">
            <div className="node-dot"></div>
            <div className="node-text">
              <div className="node-name">Trade Momentum</div>
              <div className="node-desc">High Probability Detection</div>
            </div>
            <div className="node-val">↑ 2.4x</div>
          </div>
          <div className="node" id="node3">
            <div className="node-dot"></div>
            <div className="node-text">
              <div className="node-name">Risk Management</div>
              <div className="node-desc">Capital Preservation Protocol</div>
            </div>
            <div className="node-val">⬡ A+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
