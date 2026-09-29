import React from 'react';

interface ImpactraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
}

export const ImpactraLogo: React.FC<ImpactraLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const pixelSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const px = pixelSizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Unique Impactra Kinetic Vector Insignia */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
        style={{ width: px, height: px }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Main kinetic gradient: Emerald -> Vivid Cyan -> Royal Blue */}
            <linearGradient id="impGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="45%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Accent Spark Gradient */}
            <linearGradient id="impSpark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            {/* Ambient Radial Glow */}
            <radialGradient id="impGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B1329" stopOpacity="0" />
            </radialGradient>

            {/* Facet Light Gradient */}
            <linearGradient id="impFacet" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background Rounded Hexagonal Shield */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="13"
            fill="#0F172A"
            stroke="url(#impGrad1)"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Ambient Glow Aura */}
          <circle cx="24" cy="20" r="16" fill="url(#impGlow)" />

          {/* Outer Ripple Wave 1 (The Civic Impact Wave) */}
          <path
            d="M10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24"
            stroke="url(#impGrad1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1.5 4"
            opacity="0.6"
          />

          {/* Outer Ripple Wave 2 (Forward Momentum) */}
          <path
            d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24"
            stroke="#06B6D4"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Stylized Architectural "I" Monogram with Kinetic Chevron Prisms */}
          {/* Top Hexagonal Pin / Beacon Node */}
          <polygon
            points="24,10 28,14 28,19 24,22 20,19 20,14"
            fill="url(#impGrad1)"
          />
          <polygon
            points="24,11 27,14 24,17 21,14"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* Central Impact Beacon Spark Core */}
          <circle cx="24" cy="15" r="2" fill="#F59E0B" />

          {/* Downward Kinetic Infrastructure Arrow (Pin Drop) */}
          <path
            d="M24 22L30 27L26 27L26 36L22 36L22 27L18 27L24 22Z"
            fill="url(#impGrad1)"
          />

          {/* Left Civic Wave Arc */}
          <path
            d="M16 28C14.5 30 14 32.5 14 35"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Civic Wave Arc */}
          <path
            d="M32 28C33.5 30 34 32.5 34 35"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Base Anchor Line (Ground / Infrastructure) */}
          <line
            x1="18"
            y1="39"
            x2="30"
            y2="39"
            stroke="url(#impGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bespoke Wordmark */}
      {showWordmark && (
        <div className="flex items-center tracking-tight select-none">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Impact
          </span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ra
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-0.5 mb-2.5 animate-pulse" />
        </div>
      )}
    </div>
  );
};

// Raw SVG Data URI for favicon
export const IMPACTRA_FAVICON_DATA_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="%230b1329"/><circle cx="24" cy="20" r="16" fill="%2306b6d4" opacity="0.25"/><polygon points="24,9 29,14 29,19 24,23 19,19 19,14" fill="%2310b981"/><circle cx="24" cy="15" r="3" fill="%23f59e0b"/><path d="M24,23 L31,29 L27,29 L27,37 L21,37 L21,29 L17,29 Z" fill="%2306b6d4"/><line x1="16" y1="40" x2="32" y2="40" stroke="%233b82f6" stroke-width="3" stroke-linecap="round"/></svg>`;
