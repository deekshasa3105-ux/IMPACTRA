// Crisp SVG vector illustrations for infrastructure defects and repairs
// Guaranteed 100% resilient with zero broken external URLs or network failures

export function getCategorySvgIllustration(category: string, isResolved = false): string {
  if (isResolved) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <rect width="400" height="240" fill="%23064e3b"/>
      <path d="M0,170 Q200,160 400,170 L400,240 L0,240 Z" fill="%230f172a"/>
      <line x1="0" y1="205" x2="400" y2="205" stroke="%23fbbf24" stroke-width="6" stroke-dasharray="20,15"/>
      <circle cx="200" cy="90" r="50" fill="%2310b981"/>
      <path d="M180,90 L195,105 L225,75" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="200" y="170" fill="white" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">WORK COMPLETE &amp; VERIFIED</text>
      <text x="200" y="195" fill="%23a7f3d0" font-family="sans-serif" font-size="13" text-anchor="middle">Restored to City Standard</text>
    </svg>`;
  }

  switch (category) {
    case 'streetlights':
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
        <rect width="400" height="240" fill="%230f172a"/>
        <circle cx="200" cy="50" r="16" fill="%23334155"/>
        <line x1="200" y1="50" x2="200" y2="220" stroke="%2364748b" stroke-width="10"/>
        <path d="M160,60 L240,60 L225,75 L175,75 Z" fill="%23475569"/>
        <circle cx="200" cy="85" r="14" fill="%23f59e0b" opacity="0.3"/>
        <path d="M195,78 L205,92 M205,78 L195,92" stroke="%23ef4444" stroke-width="3"/>
        <rect x="0" y="210" width="400" height="30" fill="%231e293b"/>
        <text x="200" y="130" fill="%23fbbf24" font-family="sans-serif" font-weight="bold" font-size="15" text-anchor="middle">⚡ OUTAGE: LAMP FIXTURE DARK</text>
        <text x="200" y="152" fill="%23cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">Reported Luminaire Electrical Fault</text>
      </svg>`;

    case 'drainage':
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
        <rect width="400" height="240" fill="%230c4a6e"/>
        <path d="M0,180 Q100,165 200,180 T400,180 L400,240 L0,240 Z" fill="%230369a1"/>
        <rect x="130" y="110" width="140" height="70" rx="8" fill="%23334155" stroke="%2364748b" stroke-width="4"/>
        <line x1="150" y1="110" x2="150" y2="180" stroke="%231e293b" stroke-width="6"/>
        <line x1="175" y1="110" x2="175" y2="180" stroke="%231e293b" stroke-width="6"/>
        <line x1="200" y1="110" x2="200" y2="180" stroke="%231e293b" stroke-width="6"/>
        <line x1="225" y1="110" x2="225" y2="180" stroke="%231e293b" stroke-width="6"/>
        <line x1="250" y1="110" x2="250" y2="180" stroke="%231e293b" stroke-width="6"/>
        <circle cx="160" cy="140" r="16" fill="%23854d0e" opacity="0.8"/>
        <circle cx="190" cy="155" r="22" fill="%23713f12" opacity="0.9"/>
        <circle cx="230" cy="135" r="18" fill="%23854d0e" opacity="0.8"/>
        <text x="200" y="55" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="15" text-anchor="middle">🌊 BLOCKED STORM DRAIN</text>
        <text x="200" y="80" fill="%23e0f2fe" font-family="sans-serif" font-size="12" text-anchor="middle">Clogged with Debris &amp; Street Flooding</text>
      </svg>`;

    case 'roads':
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
        <rect width="400" height="240" fill="%231e293b"/>
        <line x1="0" y1="120" x2="400" y2="120" stroke="%23fbbf24" stroke-width="6" stroke-dasharray="25,18"/>
        <path d="M120,130 C150,110 170,165 210,135 C240,115 270,140 280,165 C260,195 210,185 160,180 Z" fill="%230f172a" stroke="%23dc2626" stroke-width="3"/>
        <path d="M140,145 L170,160 M210,150 L250,170 M180,135 L200,165" stroke="%23475569" stroke-width="2"/>
        <circle cx="200" cy="155" r="6" fill="%23ef4444"/>
        <text x="200" y="45" fill="%23f87171" font-family="sans-serif" font-weight="bold" font-size="15" text-anchor="middle">⚠️ SEVERE POTHOLE / ROAD HAZARD</text>
        <text x="200" y="70" fill="%23cbd5e1" font-family="sans-serif" font-size="12" text-anchor="middle">Pavement Failure - Vehicle Damage Risk</text>
      </svg>`;

    case 'traffic':
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
        <rect width="400" height="240" fill="%231e1b4b"/>
        <rect x="165" y="40" width="70" height="150" rx="14" fill="%230f172a" stroke="%23475569" stroke-width="3"/>
        <circle cx="200" cy="70" r="16" fill="%23ef4444" opacity="0.3"/>
        <circle cx="200" cy="115" r="16" fill="%23f59e0b" opacity="0.9"/>
        <circle cx="200" cy="160" r="16" fill="%2310b981" opacity="0.3"/>
        <path d="M190,105 L210,125 M210,105 L190,125" stroke="%23ffffff" stroke-width="2"/>
        <text x="200" y="215" fill="%23c084fc" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">TRAFFIC SIGNAL MALFUNCTION</text>
      </svg>`;

    case 'water_pipeline':
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
        <rect width="400" height="240" fill="%23134e4a"/>
        <rect x="165" y="100" width="70" height="110" rx="6" fill="%23b91c1c"/>
        <circle cx="200" cy="85" r="22" fill="%23dc2626"/>
        <circle cx="160" cy="120" r="10" fill="%23991b1b"/>
        <circle cx="240" cy="120" r="10" fill="%23991b1b"/>
        <path d="M170,120 Q120,70 140,20 Q150,50 170,110" fill="%2338bdf8" opacity="0.8"/>
        <path d="M230,120 Q280,70 260,20 Q250,50 230,110" fill="%2338bdf8" opacity="0.8"/>
        <text x="200" y="225" fill="%232dd4bf" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">WATER MAIN / HYDRANT GUSH</text>
      </svg>`;

    default:
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
        <rect width="400" height="240" fill="%231e293b"/>
        <circle cx="200" cy="100" r="40" fill="%23f97316"/>
        <path d="M200,80 L200,105 M200,118 L200,122" stroke="white" stroke-width="5" stroke-linecap="round"/>
        <text x="200" y="170" fill="white" font-family="sans-serif" font-weight="bold" font-size="15" text-anchor="middle">MUNICIPAL INFRASTRUCTURE ISSUE</text>
      </svg>`;
  }
}
