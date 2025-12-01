/**
 * ByteBox - Main App Layout
 * Made with ❤️ by Pink Pixel
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ExportImport } from '@/components/ui/ExportImport';
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
  const { getIconColor, accentTheme, mode } = useTheme();

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
          {/* Logo: Show banner when expanded, icon when collapsed */}
          {sidebarOpen ? (
            <div className="relative h-30 w-60 shrink-0">
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
            </div>
          ) : (
            <div className="relative h-12 w-12 shrink-0">
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
            </div>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg transition-colors hover:bg-(--hover-bg)"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const iconColor = getIconColor(item.name);
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border border-transparent',
                  'hover:bg-[color-mix(in_srgb,var(--hover-bg)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)]',
                  item.active &&
                    'bg-accent-soft/80 border-[color-mix(in_srgb,var(--accent-border)_70%,transparent)] shadow-[0_12px_35px_rgba(0,0,0,0.18)]'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-transform duration-200',
                    item.active ? 'scale-110' : 'group-hover:scale-105'
                  )}
                  style={{ color: item.active ? iconColor : 'var(--foreground-soft)' }}
                />
                {sidebarOpen && (
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      item.active ? 'text-accent' : 'text-(--foreground-soft) group-hover:text-(--foreground)'
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Export/Import Section */}
        {sidebarOpen && (
          <div className="px-3 pb-4">
            <ExportImport />
          </div>
        )}

        {/* Quick Add Button */}
        <div className="px-3 pb-5">
          <button
            onClick={onQuickAdd}
            disabled={!onQuickAdd}
            title={onQuickAdd ? "Create a new card" : "Coming soon! Card creation feature in development."}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl',
              onQuickAdd
                ? 'accent-gradient shadow-lg shadow-[color-mix(in_srgb,var(--accent-primary)_30%,transparent)] hover:shadow-[color-mix(in_srgb,var(--accent-primary)_45%,transparent)]'
                : 'bg-accent-soft/40 text-[color-mix(in_srgb,var(--foreground)_55%,transparent)] cursor-not-allowed opacity-60',
              'font-medium text-sm transition-all duration-200'
            )}
          >
            <PlusIcon className="w-5 h-5" />
            {sidebarOpen && <span>{onQuickAdd ? 'Quick Add' : 'Quick Add (Soon)'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 py-5 gap-4">
        {/* Header */}
        <header className="glass glass--dense h-16 rounded-2xl flex items-center justify-between px-6 shadow-[0_18px_46px_rgba(5,6,11,0.35)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentTheme.palette[0] }}
              />
              <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            </div>

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
                  'p-2 rounded-xl transition-all duration-200 relative',
                  showStarredOnly
                    ? 'bg-amber-500/10 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                    : 'surface-card surface-card--subtle hover:border-amber-400/30'
                )}
                aria-label={showStarredOnly ? 'Show all cards' : 'Show starred only'}
                title={`${showStarredOnly ? 'Show all cards' : 'Show starred only'} (${starredCount} starred) — ⌘3`}
              >
                {showStarredOnly ? (
                  <StarIconSolid className="w-5 h-5 text-amber-400" />
                ) : (
                  <StarIcon className="w-5 h-5 text-(--foreground-soft) hover:text-amber-400 transition-colors" />
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
                className="p-2 rounded-xl surface-card surface-card--subtle transition-all hover:border-accent duration-200"
                aria-label="Toggle filters"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto pr-1">
          <div className="min-h-full pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
