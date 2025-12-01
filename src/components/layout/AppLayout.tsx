/**
 * ByteBox - Main App Layout
 * Made with ❤️ by Pink Pixel
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  TagIcon,
  Cog6ToothIcon,
  PlusIcon,
  FunnelIcon,
  StarIcon,
  CircleStackIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DataModal } from '@/components/ui/DataModal';
import { ViewModeSelector, type ViewMode } from '@/components/ui/ViewModeSelector';
import { useTheme } from '@/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  onToggleFilters?: () => void;
  showFiltersToggle?: boolean;
  onQuickAdd?: () => void;
  showStarredOnly?: boolean;
  onToggleStarred?: () => void;
  starredCount?: number;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function AppLayout({ 
  children, 
  onSearch, 
  onToggleFilters, 
  showFiltersToggle = false,
  onQuickAdd,
  showStarredOnly = false,
  onToggleStarred,
  starredCount = 0,
  viewMode = 'all',
  onViewModeChange,
  hasActiveFilters = false,
  onClearFilters,
}: Readonly<AppLayoutProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const { getIconColor, accentTheme, mode } = useTheme();

  // Handle Add Card click - navigate to dashboard if not already there
  const handleAddCardClick = () => {
    if (onQuickAdd) {
      // If we have a handler, use it directly
      onQuickAdd();
    } else {
      // Navigate to dashboard
      globalThis.location.href = '/';
    }
  };

  // Keyboard shortcuts for view modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if Cmd/Ctrl is pressed and no input is focused
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      // Cmd/Ctrl+1-4 for view modes
      if (onViewModeChange) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            onViewModeChange('all');
            break;
          case '2':
            e.preventDefault();
            onViewModeChange('recent');
            break;
          case '3':
            e.preventDefault();
            onViewModeChange('starred');
            break;
          case '4':
            e.preventDefault();
            onViewModeChange('by-tag');
            break;
        }
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onViewModeChange]);

  // Only apply shadow in dark mode - light mode doesn't need it and causes visual doubling
  const logoShadow =
    mode === 'dark'
      ? 'drop-shadow(0 18px 35px rgba(5,6,11,0.6)) drop-shadow(0 0 1px rgba(255,255,255,0.4))'
      : 'none';

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/', active: true },
    { name: 'Search', icon: MagnifyingGlassIcon, href: '/search' },
    { name: 'Tags', icon: TagIcon, href: '/tags' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/settings' },
  ];

  return (
    <div className="flex h-screen text-(--foreground) overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'glass glass--dense flex flex-col transition-[width] duration-300 ease-out border border-transparent rounded-r-3xl',
          sidebarOpen ? 'w-80' : 'w-24'
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex items-center py-4 glass-bar",
          sidebarOpen ? "justify-between px-5" : "flex-col gap-2 px-2"
        )}>
          {/* Logo: Show banner when expanded, icon when collapsed - Clickable to collapse/expand */}
          {sidebarOpen ? (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="relative h-30 w-60 shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
              aria-label="Collapse sidebar"
            >
              <Image
                key={`logo-banner-${mode}`}
                src="/logo_banner.png"
                alt="ByteBox"
                fill
                sizes="500px"
                priority
                className="object-contain object-left"
                style={{ filter: logoShadow }}
              />
            </button>
          ) : (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="relative h-12 w-12 shrink-0 cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-110 active:scale-95"
              aria-label="Expand sidebar"
            >
              <Image
                key={`logo-icon-${mode}`}
                src="/icon.png"
                alt="ByteBox"
                fill
                sizes="48px"
                priority
                className="object-contain"
                style={{ filter: logoShadow }}
              />
            </button>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl transition-all duration-300 hover:bg-(--hover-bg) hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)]"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Add Card Button - Moved up */}
        <div className="px-3 py-4">
          <button
            onClick={handleAddCardClick}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
              'accent-gradient shadow-lg shadow-[color-mix(in_srgb,var(--accent-primary)_30%,transparent)]',
              'hover:shadow-[color-mix(in_srgb,var(--accent-primary)_50%,transparent)] hover:scale-[1.02]',
              'active:scale-[0.98] font-semibold text-sm transition-all duration-300',
              'hover:brightness-110'
            )}
          >
            <PlusIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            {sidebarOpen && <span>Add Card</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const iconColor = getIconColor(item.name);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent',
                  'hover:bg-[color-mix(in_srgb,var(--hover-bg)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)]',
                  'hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]',
                  'hover:translate-x-1 active:scale-[0.98]',
                  item.active &&
                    'bg-accent-soft/80 border-[color-mix(in_srgb,var(--accent-border)_70%,transparent)] shadow-[0_12px_35px_rgba(0,0,0,0.18)]'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 shrink-0 transition-all duration-300',
                    item.active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'
                  )}
                  style={{ color: item.active ? iconColor : 'var(--foreground-soft)' }}
                />
                {sidebarOpen && (
                  <span
                    className={cn(
                      'text-sm font-medium transition-all duration-300',
                      item.active ? 'text-accent' : 'text-(--foreground-soft) group-hover:text-(--foreground)'
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Data Button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setIsDataModalOpen(true)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent',
              'bg-[color-mix(in_srgb,var(--background)_22%,transparent)]',
              'border-[color-mix(in_srgb,var(--card-border)_70%,transparent)]',
              'hover:bg-[color-mix(in_srgb,var(--hover-bg)_80%,transparent)]',
              'hover:border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)]',
              'hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]',
              'hover:translate-x-1 active:scale-[0.98]',
              sidebarOpen ? 'justify-start' : 'justify-center'
            )}
          >
            <CircleStackIcon className="w-6 h-6 text-(--foreground-soft) transition-all duration-300 group-hover:scale-110" />
            {sidebarOpen && (
              <span className="text-sm font-medium text-(--foreground-soft)">
                Data
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 py-5 gap-4">
        {/* Header */}
        <header className="glass glass--dense h-16 rounded-2xl flex items-center justify-between px-6 shadow-[0_18px_46px_rgba(5,6,11,0.35)]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 transition-all duration-300 hover:opacity-80 active:scale-[0.98]"
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentTheme.palette[0] }}
              />
              <h1 className="text-xl font-semibold tracking-tight hover:text-accent transition-colors duration-300">Dashboard</h1>
            </Link>

            {/* View Mode Selector */}
            {onViewModeChange && (
              <ViewModeSelector
                currentMode={viewMode}
                onModeChange={onViewModeChange}
                onClearFilters={onClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            {onSearch && (
              <SearchBar 
                onSearch={onSearch}
                className="w-80"
              />
            )}

            {/* Starred Filter Toggle */}
            {onToggleStarred && (
              <button
                onClick={onToggleStarred}
                className={cn(
                  'p-2 rounded-xl transition-all duration-300 relative',
                  'hover:scale-110 active:scale-95',
                  showStarredOnly
                    ? 'bg-amber-500/10 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                    : 'surface-card surface-card--subtle hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-400/10'
                )}
                aria-label={showStarredOnly ? 'Show all cards' : 'Show starred only'}
                title={`${showStarredOnly ? 'Show all cards' : 'Show starred only'} (${starredCount} starred) — ⌘3`}
              >
                {showStarredOnly ? (
                  <StarIconSolid className="w-5 h-5 text-amber-400" />
                ) : (
                  <StarIcon className="w-5 h-5 text-(--foreground-soft) hover:text-amber-400 transition-colors duration-300" />
                )}
                {starredCount > 0 && (
                  <span className={cn(
                    'absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center',
                    'text-[10px] font-medium rounded-full px-1',
                    showStarredOnly
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-(--hover-bg) text-(--foreground-soft)'
                  )}>
                    {starredCount}
                  </span>
                )}
              </button>
            )}

            {/* Filter Toggle */}
            {showFiltersToggle && onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className="p-2 rounded-xl surface-card surface-card--subtle transition-all duration-300 hover:border-accent hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)]"
                aria-label="Toggle filters"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            )}

            {/* Docs Button */}
            <a
              href="/docs"
              className="p-2 rounded-xl surface-card surface-card--subtle transition-all duration-300 hover:border-accent hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)]"
              aria-label="Documentation"
              title="Documentation & Help"
            >
              <BookOpenIcon className="w-5 h-5 text-(--foreground-soft) hover:text-(--foreground) transition-colors duration-300" />
            </a>

            {/* Pink Pixel Button */}
            <a
              href="https://pinkpixel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl surface-card surface-card--subtle transition-all duration-300 hover:border-pink-500/50 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-pink-500/20"
              aria-label="Pink Pixel"
              title="Visit Pink Pixel"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="url(#pinkGradient)"/>
                <defs>
                  <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/pinkpixel-dev/ByteBox"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl surface-card surface-card--subtle transition-all duration-300 hover:border-[#333]/50 dark:hover:border-white/30 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--foreground)_10%,transparent)]"
              aria-label="GitHub Repository"
              title="View on GitHub"
            >
              <svg className="w-5 h-5 text-(--foreground-soft) hover:text-(--foreground) transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto pr-1">
          <div className="min-h-full pb-8">{children}</div>
        </main>
      </div>

      {/* Data Modal */}
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
}
