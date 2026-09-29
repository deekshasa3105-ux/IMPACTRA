import React, { useState } from 'react';

interface TranslucentMapBackgroundProps {
  className?: string;
  mapType?: 'satellite' | 'street';
}

export const TranslucentMapBackground: React.FC<TranslucentMapBackgroundProps> = ({
  className = '',
  mapType = 'satellite',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Realistic high-resolution aerial satellite photo of city streets, avenues, blocks and topography
  const realisticSatelliteUrl =
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2400&q=80';
  const realisticAerialStreetUrl =
    'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=2400&q=80';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* 1. Photorealistic High-Resolution Satellite & Aerial Map Imagery */}
      <img
        src={mapType === 'satellite' ? realisticSatelliteUrl : realisticAerialStreetUrl}
        alt="Realistic City Aerial Satellite Map"
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
          imageLoaded ? 'opacity-40' : 'opacity-20'
        } filter brightness-75 contrast-125 saturate-50 hue-rotate-[195deg]`}
      />

      {/* 2. Secondary Aerial City Street Texture for rich organic depth */}
      <img
        src={realisticAerialStreetUrl}
        alt="Urban Street Grid"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-screen filter contrast-150 brightness-70"
      />

      {/* 3. GIS HUD Vector Overlay: Real Cartographic Crosshairs, Ward Bounds, and Pulsing GPS Pins */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glowing Pin Radial Glows */}
          <radialGradient id="glowRedSat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="glowTealSat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="glowAmberSat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Coordinate Crosshair pattern */}
          <pattern id="satGisGrid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="#0284c7"
              strokeWidth="0.75"
              strokeDasharray="2 8"
              opacity="0.25"
            />
            <circle cx="0" cy="0" r="1.5" fill="#38bdf8" opacity="0.4" />
          </pattern>
        </defs>

        {/* Survey Coordinate Overlay Grid */}
        <rect width="100%" height="100%" fill="url(#satGisGrid)" />

        {/* Ward Jurisdiction Polygons (Subtle dashed zoning on the satellite map) */}
        <polygon
          points="220,140 560,170 640,430 400,490 200,330"
          fill="#0284c7"
          fillOpacity="0.08"
          stroke="#0284c7"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <text x="360" y="240" fill="#38bdf8" fontSize="11" fontFamily="monospace" opacity="0.6">
          WARD 01 · METRO CENTRAL
        </text>

        <polygon
          points="640,430 1040,390 1200,690 800,730 700,570"
          fill="#0d9488"
          fillOpacity="0.08"
          stroke="#0d9488"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <text x="860" y="580" fill="#2dd4bf" fontSize="11" fontFamily="monospace" opacity="0.6">
          WARD 02 · HARBOR EAST
        </text>

        {/* Pulsing Satellite Defect Pins */}
        {/* Pin 1: Red Critical Pothole (Ward 1) */}
        <g transform="translate(480, 290)">
          <circle cx="0" cy="0" r="34" fill="url(#glowRedSat)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="0" cy="0" r="14" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill="#ef4444" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#ef4444" strokeWidth="2" />
        </g>

        {/* Pin 2: Amber Water Main Leak (Ward 2) */}
        <g transform="translate(980, 520)">
          <circle cx="0" cy="0" r="28" fill="url(#glowAmberSat)" className="animate-ping" style={{ animationDuration: '4s' }} />
          <circle cx="0" cy="0" r="12" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#f59e0b" />
          <circle cx="0" cy="0" r="2" fill="#ffffff" />
        </g>

        {/* Pin 3: Teal Resolved Defect */}
        <g transform="translate(320, 640)">
          <circle cx="0" cy="0" r="22" fill="url(#glowTealSat)" />
          <circle cx="0" cy="0" r="10" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4.5" fill="#10b981" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>

        {/* Pin 4: Cyan Traffic Sensor */}
        <g transform="translate(1240, 320)">
          <circle cx="0" cy="0" r="26" fill="url(#glowTealSat)" opacity="0.4" />
          <circle cx="0" cy="0" r="10" fill="#06b6d4" fillOpacity="0.4" stroke="#06b6d4" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#06b6d4" />
          <circle cx="0" cy="0" r="2" fill="#ffffff" />
        </g>

        {/* Top-left Realistic Map Telemetry HUD */}
        <g transform="translate(48, 48)" fill="#94a3b8" fontFamily="monospace" fontSize="11" fontWeight="600">
          <text x="0" y="0">METRO ORBITAL SATELLITE FEED · CH-4</text>
          <text x="0" y="16" fill="#38bdf8" fontSize="10">COORDS: 12°58'24"N 77°35'40"E · HIGH RESOLUTION</text>
        </g>

        {/* Top-right Satellite Status */}
        <g transform="translate(1420, 48)" fill="#94a3b8" fontFamily="monospace" fontSize="11" textAnchor="end">
          <text x="0" y="0">REALISTIC SATELLITE MAPPING</text>
          <text x="0" y="16" fill="#10b981" fontSize="10">● LIVE MUNICIPAL TELEMETRY ACTIVE</text>
        </g>

        {/* Bottom-left Scale Bar */}
        <g transform="translate(48, 840)">
          <line x1="0" y1="0" x2="160" y2="0" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#94a3b8" strokeWidth="2" />
          <line x1="80" y1="-3" x2="80" y2="3" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="160" y1="-6" x2="160" y2="6" stroke="#94a3b8" strokeWidth="2" />
          <text x="80" y="18" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
            2.5 KM
          </text>
        </g>

        {/* Bottom-right Compass */}
        <g transform="translate(1520, 820)">
          <circle cx="0" cy="0" r="22" stroke="#334155" strokeWidth="1.5" fill="#0b1329" fillOpacity="0.8" />
          <polygon points="0,-16 5,2 0,-3 -5,2" fill="#06b6d4" />
          <polygon points="0,16 5,-2 0,3 -5,-2" fill="#475569" />
          <text x="0" y="-20" fill="#06b6d4" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
            N
          </text>
        </g>
      </svg>

      {/* 4. Deep Atmospheric Radial & Linear Vignettes */}
      {/* Kept transparent enough so the realistic satellite roads and terrain are unmistakably visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1329]/75 via-[#0b1329]/35 to-[#0b1329]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0b1329]/30 to-[#0b1329]/80" />
    </div>
  );
};
