'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search cards...', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Handle keyboard shortcut (Cmd/Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          surface-card surface-card--subtle
          transition-all duration-200
          ${isFocused
            ? 'ring-2 ring-[color-mix(in_srgb,var(--accent-primary)_45%,transparent)] border-[color-mix(in_srgb,var(--accent-border)_70%,transparent)] shadow-[0_10px_30px_rgba(15,23,42,0.28)]'
            : 'hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]'}
        `}
      >
        <MagnifyingGlassIcon className="w-5 h-5" style={{ color: 'var(--icon-2)' }} />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-(--foreground) placeholder:text-gray-500 outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-(--hover-bg) transition-colors"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <kbd
          className="hidden sm:inline-block px-2 py-0.5 text-xs rounded bg-(--hover-bg) text-gray-400 border border-(--card-border)"
        >
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
