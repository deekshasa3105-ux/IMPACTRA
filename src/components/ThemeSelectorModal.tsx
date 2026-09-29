import React from 'react';
import { X, Palette, Check, Moon, Sun, Sparkles } from 'lucide-react';
import { ThemePreset } from '../types';
import { THEME_OPTIONS } from '../utils/themePresets';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Theme &amp; Background Options</h2>
              <p className="text-xs text-slate-400">
                Customize canvas colors for daylight, night operations, or personal comfort
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = activeTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[96px] ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                  style={{ backgroundColor: theme.bgHex }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border shadow-2xs shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: theme.cardHex,
                          borderColor: theme.isDark ? '#334155' : '#cbd5e1',
                        }}
                      >
                        {theme.isDark ? (
                          <Moon className="w-2.5 h-2.5 text-amber-400" />
                        ) : (
                          <Sun className="w-2.5 h-2.5 text-amber-500" />
                        )}
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: theme.isDark ? '#f8fafc' : '#0f172a' }}
                      >
                        {theme.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p
                    className="text-[11px] leading-snug line-clamp-2"
                    style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }}
                  >
                    {theme.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Your background preference is saved automatically and applies instantly across all views.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors min-h-[40px]"
          >
            Apply &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
};
