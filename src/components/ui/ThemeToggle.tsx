'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="relative p-2 rounded-xl surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_50%,transparent)] transition-all group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun icon (visible in dark mode) */}
        <SunIcon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            mode === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
          style={{ color: '#fbbf24' }}
        />
        
        {/* Moon icon (visible in light mode) */}
        <MoonIcon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            mode === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          style={{ color: 'var(--icon-2)' }}
        />
      </div>

      {/* Hover tooltip */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {mode === 'dark' ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  );
}
