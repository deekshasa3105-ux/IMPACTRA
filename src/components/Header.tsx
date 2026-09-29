import React from 'react';
import { MapPin } from 'lucide-react';
import { CivicPulseLogo } from './CivicPulseLogo';
import { MAP_DIRECT_URL, openMapDirectLink } from '../utils/mapLink';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-[#080403]/90 backdrop-blur-md border-b border-[#2d120a]/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            className="flex items-center text-left group focus:outline-none cursor-pointer"
            title="CivicPulse (powered by Impactra)"
          >
            <CivicPulseLogo />
          </a>
        </div>

        {/* Right: Primary CTA - Live Map Link */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={MAP_DIRECT_URL}
            target="_self"
            onClick={openMapDirectLink}
            title="Open Live Interactive Map (https://impactra-civicpulse-new.ai.studio/)"
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:to-amber-500 rounded-xl shadow-lg shadow-orange-950/40 active:scale-95 transition-all whitespace-nowrap min-h-[40px] cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Live Map</span>
          </a>
        </div>
      </div>
    </header>
  );
};
