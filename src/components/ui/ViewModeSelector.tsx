"use client";

/**
 * ByteBox - View Mode Selector Component
 * Made with ❤️ by Pink Pixel
 */

import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ClockIcon,
  StarIcon,
  TagIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export type ViewMode = "all" | "recent" | "starred" | "by-tag";

interface ViewModeOption {
  id: ViewMode;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const viewModeOptions: ViewModeOption[] = [
  {
    id: "all",
    name: "All Cards",
    description: "Show all cards",
    icon: Squares2X2Icon,
    shortcut: "1",
  },
  {
    id: "recent",
    name: "Most Recent",
    description: "Sorted by newest first",
    icon: ClockIcon,
    shortcut: "2",
  },
  {
    id: "starred",
    name: "Starred Only",
    description: "Show favorited cards",
    icon: StarIcon,
    shortcut: "3",
  },
  {
    id: "by-tag",
    name: "By Tag",
    description: "Filter by selected tags",
    icon: TagIcon,
    shortcut: "4",
  },
];

// Extracted component to reduce function nesting depth
interface MenuItemButtonProps {
  option: ViewModeOption;
  isActive: boolean;
  isFocused: boolean;
  onSelect: (mode: ViewMode) => void;
}

function MenuItemButton({ option, isActive, isFocused, onSelect }: Readonly<MenuItemButtonProps>) {
  const Icon = option.icon;

  const getBackgroundColor = () => {
    if (isActive) return 'color-mix(in srgb, var(--accent-primary) 12%, transparent)';
    if (isFocused) return 'rgba(148, 163, 184, 0.12)';
    return 'transparent';
  };

  return (
    <button
      onClick={() => onSelect(option.id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
        isActive && "border",
      )}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: isActive ? 'color-mix(in srgb, var(--accent-primary) 40%, transparent)' : 'transparent',
        boxShadow: isActive ? '0 0 12px 2px color-mix(in srgb, var(--accent-primary) 18%, transparent)' : 'none',
      }}
    >
      <div
        className="p-1.5 rounded-lg transition-colors"
        style={{
          backgroundColor: isActive
            ? 'color-mix(in srgb, var(--accent-primary) 12%, transparent)'
            : 'rgba(148, 163, 184, 0.12)',
        }}
      >
        {option.id === "starred" && isActive ? (
          <StarIconSolid className="w-4 h-4 text-amber-400" />
        ) : (
          <Icon
            className={cn(
              "w-4 h-4",
              isActive
                ? "text-[var(--accent-primary)]"
                : "text-[rgba(248,250,252,0.7)]"
            )}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium"
          style={{
            color: isActive ? 'var(--accent-primary)' : '#f8fafc',
          }}
        >
          {option.name}
        </p>
        <p
          className="text-xs truncate"
          style={{ color: 'rgba(248, 250, 252, 0.7)' }}
        >
          {option.description}
        </p>
      </div>

      <kbd
        className="px-1.5 py-0.5 rounded text-[10px] font-mono"
        style={{
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          color: 'rgba(248, 250, 252, 0.7)',
        }}
      >
        ⌘{option.shortcut}
      </kbd>
    </button>
  );
}

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function ViewModeSelector({
  currentMode,
  onModeChange,
  onClearFilters,
  hasActiveFilters = false,
  className = "",
}: Readonly<ViewModeSelectorProps>) {
  const currentOption =
    viewModeOptions.find((opt) => opt.id === currentMode) || viewModeOptions[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <MenuButton
              data-viewmode-button
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium",
                "transition-all duration-200 border",
                currentMode === "all"
                  ? "surface-card surface-card--subtle hover:border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)] bg-[rgba(5,6,11,0.9)]"
                  : "bg-accent-soft/80 border-[color-mix(in_srgb,var(--accent-border)_70%,transparent)] text-accent shadow-[0_8px_24px_rgba(0,0,0,0.15)]",
              )}
            >
              {currentMode === "starred" ? (
                <StarIconSolid className="w-4 h-4 text-amber-400" />
              ) : (
                <CurrentIcon className="w-4 h-4" />
              )}
              <span>{currentOption.name}</span>
              <ChevronDownIcon className="w-4 h-4 opacity-60" />
            </MenuButton>

            {/* Portal the dropdown to body to escape glass effects */}
            {globalThis.window !== undefined && open && createPortal(
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
              <MenuItems
                  static
                  className="fixed rounded-2xl focus:outline-none z-[9999] overflow-hidden shadow-[0_26px_70px_rgba(0,0,0,0.75)]"
                  style={{
                    // Position it below the button
                    top: `${(document.querySelector('[data-viewmode-button]') as HTMLElement)?.getBoundingClientRect().bottom + 8 || 0}px`,
                    left: `${(document.querySelector('[data-viewmode-button]') as HTMLElement)?.getBoundingClientRect().left || 0}px`,
                    width: '256px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(148, 163, 184, 0.32)',
                  }}
                >
                  <div className="p-2 relative" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
                    <div className="px-3 py-2 mb-1">
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'rgba(248, 250, 252, 0.7)' }}
                      >
                        View Mode
                      </p>
                    </div>

                    {viewModeOptions.map((option) => {
                      const isActive = currentMode === option.id;

                      return (
                        <MenuItem key={option.id}>
                          {({ focus }) => (
                            <MenuItemButton
                              option={option}
                              isActive={isActive}
                              isFocused={focus}
                              onSelect={onModeChange}
                            />
                          )}
                        </MenuItem>
                      );
                    })}
                  </div>

                  {/* Keyboard shortcuts hint */}
                  <div
                    className="border-t px-4 py-2"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.98)',
                      borderTopColor: 'rgba(148, 163, 184, 0.32)',
                    }}
                  >
                    <p
                      className="text-[10px] text-center"
                      style={{ color: 'rgba(248, 250, 252, 0.7)' }}
                    >
                      Press{" "}
                      <kbd
                        className="px-1 py-0.5 rounded font-mono"
                        style={{ backgroundColor: 'rgba(148, 163, 184, 0.15)' }}
                      >
                        ⌘1-4
                      </kbd>{" "}
                      to switch views
                    </p>
                  </div>
                </MenuItems>
              </Transition>,
              document.body
            )}
          </>
        )}
      </Menu>

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium",
            "transition-all duration-200 border",
            "bg-red-500/10 border-red-400/30 text-red-400",
            "hover:bg-red-500/20 hover:border-red-400/50",
          )}
          title="Clear all filters and reset to All Cards view"
        >
          <XMarkIcon className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

export { viewModeOptions };
