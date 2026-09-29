import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { CivicPulseLogo } from './CivicPulseLogo';
import { MAP_DIRECT_URL, openMapDirectLink } from '../utils/mapLink';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export const HomeOverviewView: React.FC = () => {
  // Interactive mouse spotlight tracking
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize mouse at viewport center
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2.5 });
    }
  }, []);

  // Track mouse coordinates for dynamic spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, []);

  // Interactive click ripple animation
  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering ripple if clicked on interactive buttons or links directly
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setRipples((prev) => [...prev.slice(-5), newRipple]);
  }, []);

  // Clean up ripples after animation finishes
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 1200);
    return () => clearTimeout(timer);
  }, [ripples]);

  // Ambient floating sensor nodes (particles)
  const particles: Particle[] = [
    { id: 1, x: 12, y: 22, size: 5, color: '#f97316', duration: 7, delay: 0 },
    { id: 2, x: 28, y: 15, size: 4, color: '#10b981', duration: 9, delay: 1.5 },
    { id: 3, x: 78, y: 18, size: 6, color: '#f59e0b', duration: 8, delay: 0.8 },
    { id: 4, x: 86, y: 35, size: 4, color: '#06b6d4', duration: 11, delay: 2 },
    { id: 5, x: 18, y: 65, size: 5, color: '#ea580c', duration: 10, delay: 1.2 },
    { id: 6, x: 82, y: 72, size: 4, color: '#10b981', duration: 8.5, delay: 2.5 },
    { id: 7, x: 50, y: 12, size: 5, color: '#f97316', duration: 9.5, delay: 3 },
    { id: 8, x: 38, y: 80, size: 6, color: '#f59e0b', duration: 7.5, delay: 0.5 },
    { id: 9, x: 68, y: 84, size: 4, color: '#06b6d4', duration: 10.5, delay: 1.8 },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleContainerClick}
      className="relative w-full min-h-screen flex flex-col justify-between bg-[#080403] text-slate-100 overflow-hidden px-4 sm:px-8 selection:bg-orange-600 selection:text-white cursor-default"
    >
      {/* ========================================================================= */}
      {/* 1. DYNAMIC INTERACTIVE SPOTLIGHT (Follows Mouse Cursor)                   */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: isHovered ? 1 : 0.8,
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(234, 88, 12, 0.18), rgba(245, 158, 11, 0.06) 45%, transparent 75%)`,
        }}
      />

      {/* Static Atmospheric Backlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 50% 32%, rgba(234, 88, 12, 0.14), transparent 75%), radial-gradient(circle at 50% 12%, rgba(245, 158, 11, 0.07), transparent 60%)',
        }}
      />

      {/* ========================================================================= */}
      {/* 2. CONCENTRIC PULSE WAVES (Brand Visual: Civic "Pulse")                    */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/* Animated Concentric Pulse Ring 1 */}
        <div
          className="absolute w-[450px] h-[450px] sm:w-[680px] sm:h-[680px] rounded-full border border-orange-500/10 animate-ping"
          style={{ animationDuration: '6s', animationIterationCount: 'infinite' }}
        />
        {/* Animated Concentric Pulse Ring 2 */}
        <div
          className="absolute w-[650px] h-[650px] sm:w-[980px] sm:h-[980px] rounded-full border border-amber-500/10 animate-ping"
          style={{ animationDuration: '9s', animationDelay: '3s', animationIterationCount: 'infinite' }}
        />
        {/* Animated Concentric Pulse Ring 3 */}
        <div
          className="absolute w-[850px] h-[850px] sm:w-[1280px] sm:h-[1280px] rounded-full border border-orange-500/5 animate-pulse"
          style={{ animationDuration: '12s' }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. SUBTLE MATRIX / MESH GRID PATTERN                                      */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ea580c 1px, transparent 1px), linear-gradient(to bottom, #ea580c 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ========================================================================= */}
      {/* 4. CIVICPULSE WATERMARK EMBEDDED DIRECTLY IN THE BACKGROUND CANVAS        */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center select-none overflow-hidden opacity-[0.03] sm:opacity-[0.04]">
        <span className="text-[14vw] font-black tracking-tighter uppercase text-orange-500 leading-none scale-y-110">
          CIVICPULSE
        </span>
        <span className="text-[2.2vw] font-mono tracking-[0.4em] uppercase text-amber-400 -mt-2 sm:-mt-6">
          IMPACTRA INFRASTRUCTURE MESH
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE CLICK RIPPLES                                              */}
      {/* ========================================================================= */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute z-10 rounded-full border border-orange-400/60 animate-ping"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
            width: 60,
            height: 60,
            animationDuration: '1.1s',
          }}
        />
      ))}

      {/* ========================================================================= */}
      {/* 6. FLOATING GEOTAG SENSOR PARTICLES (Simulating Live Nodes)              */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full transition-transform duration-1000 ease-out"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 16px ${p.color}, 0 0 6px ${p.color}`,
              animation: `pulse ${p.duration}s infinite ease-in-out ${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 7. INTEGRATED PAGE HEADER: CIVICPULSE LOGO ON THE MAIN CANVAS             */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-7xl mx-auto pt-6 sm:pt-8 pb-4 flex items-center justify-between gap-4">
        {/* CivicPulse Logo with animated glow indicator */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
            title="CivicPulse - powered by Impactra"
          >
            <div className="relative">
              <CivicPulseLogo />
              {/* Subtle ambient logo glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-orange-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        </div>

        {/* Live Map Header Link Pill */}
        <a
          href={MAP_DIRECT_URL}
          target="_self"
          onClick={openMapDirectLink}
          title="Open Live Interactive Map (https://impactra-civicpulse-new.ai.studio/)"
          className="group inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#1a0c07]/90 hover:bg-[#28120a] border border-[#7c2d12]/50 hover:border-orange-500/80 rounded-xl shadow-lg shadow-orange-950/40 backdrop-blur-md active:scale-95 transition-all cursor-pointer select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-slate-200 group-hover:text-white transition-colors">Live Map</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </header>

      {/* ========================================================================= */}
      {/* 8. MAIN HERO SECTION (4-Line Typography, Tagline, & Interactive CTA)      */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-16">
        {/* Top Tag: CivicPulse Platform Tagline with Live Badge */}
        <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#270e08]/90 border border-[#b84a28]/60 text-[#f97316] text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase shadow-xl shadow-orange-950/40 backdrop-blur-md mb-6 sm:mb-10 hover:border-orange-500 hover:scale-[1.02] transition-all select-none group cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="tracking-widest">CROWDSOURCED INFRASTRUCTURE REPORTING</span>
          <span className="text-orange-400/50">·</span>
          <span>MUNICIPAL ACTION HUB</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-[#ea580c]/30 text-orange-200 border border-[#ea580c]/50 group-hover:bg-[#ea580c]/50 transition-colors">
            LIVE
          </span>
        </div>

        {/* Majestic 4-Line Headline Matching Reference Layout Exactly */}
        <div className="space-y-1 sm:space-y-2 max-w-5xl mx-auto select-none">
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[104px] font-black tracking-tight leading-[0.92] uppercase transition-transform duration-300">
            <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] hover:text-slate-100 transition-colors">
              EVERY ISSUE
            </span>
            <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] hover:text-slate-100 transition-colors">
              MAPPED.
            </span>
            <span className="block bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#fde047] bg-clip-text text-transparent drop-shadow-sm hover:brightness-110 transition-all">
              EVERY CRISIS
            </span>
            <span className="block bg-gradient-to-r from-[#fde047] via-[#fef08a] to-[#fffbeb] bg-clip-text text-transparent drop-shadow-sm hover:brightness-110 transition-all">
              RESOLVED.
            </span>
          </h1>
        </div>

        {/* Subtext Paragraph: Original CivicPulse Website Tagline */}
        <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-300/85 leading-relaxed font-normal px-2">
          Crowdsourced civic platform to drop pins on an interactive map, report infrastructure defects with automatic category &amp; ward tagging, track resolution timelines in real-time, and manage municipal dispatch.
        </p>

        {/* Primary Interactive CTA: Register Complaint with Glowing Physics */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center w-full">
          <a
            href={MAP_DIRECT_URL}
            target="_self"
            onClick={openMapDirectLink}
            title="Register Complaint (https://impactra-civicpulse-new.ai.studio/)"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 sm:py-4.5 rounded-2xl font-black text-white bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#d97706] hover:from-[#c2410c] hover:to-[#b45309] shadow-2xl shadow-orange-600/35 hover:shadow-orange-600/60 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 text-sm sm:text-base cursor-pointer min-h-[50px] overflow-hidden"
          >
            {/* Dynamic Button Internal Shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

            <MapPin className="w-5 h-5 text-white group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            <span className="tracking-wide">Register Complaint</span>
            <ArrowRight className="w-4 h-4 text-orange-100 group-hover:translate-x-1.5 transition-transform shrink-0" />
          </a>
        </div>
      </div>

      {/* Subtle bottom padding */}
      <div className="h-6" />
    </div>
  );
};
