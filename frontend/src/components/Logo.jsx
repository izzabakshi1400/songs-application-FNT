export default function Logo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Songs logo"
      role="img"
    >
      <defs>
        <linearGradient id="g" x1="10" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a0f17" />
          <stop offset="0.55" stopColor="#6a1b2a" />
          <stop offset="1" stopColor="#9a2b3f" />
        </linearGradient>

        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0.4
              0 1 0 0 0.1
              0 0 1 0 0.18
              0 0 0 0.9 0"
            result="colored"
          />
          <feMerge>
            <feMergeNode in="colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
      <circle cx="32" cy="32" r="18" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.10)" />

      <g filter="url(#softGlow)">
        <path
          d="M18 36c3.5 0 3.5-8 7-8s3.5 14 7 14 3.5-22 7-22 3.5 30 7 30 3.5-16 7-16"
          stroke="url(#g)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <circle cx="32" cy="32" r="3.2" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}
