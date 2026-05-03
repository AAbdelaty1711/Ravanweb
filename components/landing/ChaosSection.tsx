export default function ChaosSection() {
  return (
    <div id="phase2">
      <div id="scan-line"></div>
      <svg
        id="chaos-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="red-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="green-glow-strong">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g id="chaos-lines" filter="url(#red-glow)"></g>
        <g id="calm-lines"></g>
        <path
          id="green-trend"
          d=""
          stroke="#4ADE80"
          strokeWidth="3"
          fill="none"
          filter="url(#green-glow-strong)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1800"
          strokeDashoffset="1800"
        />
      </svg>
      <div id="phase2-text">From market noise, to clear opportunity</div>
    </div>
  );
}
