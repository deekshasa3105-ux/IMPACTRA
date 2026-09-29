import React from 'react';

interface CivicPulseLogoProps {
  className?: string;
  showLogoIcon?: boolean;
}

export const CivicPulseLogo: React.FC<CivicPulseLogoProps> = ({
  className = '',
  showLogoIcon = false,
}) => {
  return (
    <div className={`flex flex-col justify-center leading-tight select-none ${className}`}>
      {/* Main Title: CivicPulse - Made bigger as requested */}
      <div className="flex items-center tracking-tight">
        <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
          Civic
        </span>
        <span className="text-2xl sm:text-[26px] font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Pulse
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 ml-1 mb-3 animate-pulse" />
      </div>

      {/* Subtitle: powered by Impactra - Made smaller and shifted towards the right */}
      <div className="flex items-center justify-end gap-1 -mt-0.5 self-end pr-0.5">
        <span className="text-[8.5px] font-medium tracking-normal text-slate-400 dark:text-slate-400">
          powered by
        </span>
        <span className="text-[9px] font-extrabold tracking-tight text-teal-600 dark:text-teal-400 flex items-center gap-0.5">
          Impactra
          <span className="inline-block w-1 h-1 rounded-full bg-cyan-400" />
        </span>
      </div>
    </div>
  );
};

// Raw SVG Data URI for browser tab favicon
export const CIVICPULSE_FAVICON_DATA_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="%230b1329"/><circle cx="24" cy="22" r="15" fill="%2306b6d4" opacity="0.3"/><path d="M24 10C17.4 10 12 15.4 12 22C12 29.5 22 38.5 24 40C26 38.5 36 29.5 36 22C36 15.4 30.6 10 24 10Z" stroke="%2310b981" stroke-width="2.5" fill="%230f172a"/><path d="M14 22H19L21.5 16L24.5 28L27 19L29 22H34" stroke="%2338bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="21.5" cy="16" r="2.5" fill="%23f59e0b"/></svg>`;
