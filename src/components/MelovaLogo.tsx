import React from "react"

export function MelovaLogo({
  size = 52,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Pizzeria MELOVA logo"
    >
      {/* Outer dark medallion + gold rings */}
      <circle cx="60" cy="60" r="57" fill="#121212" stroke="#F5B700" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="51" stroke="#F5B700" strokeWidth="1" strokeOpacity="0.6" />

      {/* Top PIZZERIA label */}
      <text
        x="60"
        y="25"
        textAnchor="middle"
        fill="#F5B700"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="2.4"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        PIZZERIA
      </text>

      {/* Crossed pizza peels */}
      <g stroke="#F5B700" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="48" y1="45" x2="72" y2="29" />
        <line x1="72" y1="45" x2="48" y2="29" />
        <ellipse cx="47" cy="31" rx="4.2" ry="5.5" transform="rotate(-35 47 31)" fill="#F5B700" />
        <ellipse cx="73" cy="31" rx="4.2" ry="5.5" transform="rotate(35 73 31)" fill="#F5B700" />
      </g>

      {/* Center nameplate box */}
      <rect x="13" y="45" width="94" height="30" rx="4" fill="#181818" stroke="#F5B700" strokeWidth="1.8" />
      <rect x="16.5" y="48.5" width="87" height="23" rx="2" stroke="#F5B700" strokeWidth="0.7" strokeOpacity="0.55" />

      <text
        x="60"
        y="65.5"
        textAnchor="middle"
        fill="#F7F6F2"
        fontSize="16.5"
        fontWeight="800"
        letterSpacing="2.2"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        MELOVA
      </text>

      {/* Italian tricolor accent */}
      <rect x="46" y="77" width="9.3" height="3" fill="#009246" />
      <rect x="55.3" y="77" width="9.4" height="3" fill="#FFFFFF" />
      <rect x="64.7" y="77" width="9.3" height="3" fill="#CE2B37" />

      {/* Three stars */}
      <g fill="#F5B700">
        <polygon points="46,86 47.2,88.6 50,89 48,90.9 48.5,93.6 46,92.3 43.5,93.6 44,90.9 42,89 44.8,88.6" />
        <polygon points="60,84.5 61.4,87.5 64.6,88 62.3,90.2 62.9,93.4 60,91.9 57.1,93.4 57.7,90.2 55.4,88 58.6,87.5" />
        <polygon points="74,86 75.2,88.6 78,89 76,90.9 76.5,93.6 74,92.3 71.5,93.6 72,90.9 70,89 72.8,88.6" />
      </g>

      {/* Bottom tagline */}
      <text
        x="60"
        y="104"
        textAnchor="middle"
        fill="#F5B700"
        fontSize="7.2"
        fontWeight="600"
        fontStyle="italic"
        letterSpacing="0.6"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        Fresh &amp; Tasty
      </text>
    </svg>
  )
}

export function RibbonBanner({
  children,
  variant = "gold",
  className = "",
}: {
  children: React.ReactNode
  variant?: "gold" | "dark-text"
  className?: string
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center px-10 py-1.5 bg-[#F5B700] ${
        variant === "dark-text" ? "text-[#141414]" : "text-white"
      } shadow-md ${className}`}
      style={{
        clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)",
      }}
    >
      {children}
    </div>
  )
}
