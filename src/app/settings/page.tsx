/**
 * ByteBox - Settings Page
 * Made with ❤️ by Pink Pixel
 */

'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ExportImport } from '@/components/ui/ExportImport';
import { useTheme } from '@/contexts/ThemeContext';
import {
  gradientPresets,
  defaultWallpapers,
  availableFonts,
  availableMonoFonts,
  iconThemes,
  type AccentTheme,
  type IconTheme,
} from '@/lib/themeRegistry';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PhotoIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const {
    accentTheme,
    setAccentTheme,
    iconTheme,
    setIconTheme,
    customIconColor,
    setCustomIconColor,
    backgroundImage,
    setBackgroundImageFromFile,
    glassIntensity,
    setGlassIntensity,
    backgroundConfig,
    setBackgroundConfig,
    fontConfig,
    setFontConfig,
    customAccentThemes,
    addCustomAccentTheme,
    removeCustomAccentTheme,
    allAccentThemes,
    settingsPresets,
    saveCurrentAsPreset,
    loadPreset,
    deletePreset,
  } = useTheme();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wallpaperUploading, setWallpaperUploading] = useState(false);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  // Custom theme creation state
  const [isCreatingTheme, setIsCreatingTheme] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeColors, setNewThemeColors] = useState<string[]>(['#f72585', '#7209b7', '#3a0ca3']);

  // Gradient customization state
  const [customGradientColors, setCustomGradientColors] = useState<string[]>(['#1a1a2e', '#16213e']);
  const [customGradientAngle, setCustomGradientAngle] = useState(135);

  // Solid background state
  const [solidBackground, setSolidBackground] = useState('#0f1115');

  // Preset creation state
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const handleClearAllData = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      const response = await fetch('/api/cards', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to clear data');

      alert('All data cleared successfully!');
      setShowDeleteConfirm(false);
      globalThis.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    }
  };

  const handleWallpaperUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setWallpaperUploading(true);
      await setBackgroundImageFromFile(file);
    } catch (error) {
      console.error('Failed to upload wallpaper:', error);
      alert('Unable to load that image. Please try a different file.');
    } finally {
      setWallpaperUploading(false);
      if (wallpaperInputRef.current) {
        wallpaperInputRef.current.value = '';
      }
    }
  };

  const handleCreateCustomTheme = () => {
    if (!newThemeName.trim()) return;
    addCustomAccentTheme(newThemeName.trim(), newThemeColors);
    setNewThemeName('');
    setNewThemeColors(['#f72585', '#7209b7', '#3a0ca3']);
    setIsCreatingTheme(false);
  };

  const handleAddThemeColor = () => {
    if (newThemeColors.length < 6) {
      setNewThemeColors([...newThemeColors, '#ffffff']);
    }
  };

  const handleRemoveThemeColor = (index: number) => {
    if (newThemeColors.length > 2) {
      setNewThemeColors(newThemeColors.filter((_, i) => i !== index));
    }
  };

  const handleUpdateThemeColor = (index: number, color: string) => {
    const updated = [...newThemeColors];
    updated[index] = color;
    setNewThemeColors(updated);
  };

  const handleApplyGradient = (preset: typeof gradientPresets[0]) => {
    setBackgroundConfig({
      type: 'gradient',
      gradientColors: preset.colors,
      gradientAngle: preset.angle,
    });
  };

  const handleApplyCustomGradient = () => {
    setBackgroundConfig({
      type: 'gradient',
      gradientColors: customGradientColors,
      gradientAngle: customGradientAngle,
    });
  };

  const handleAddGradientColor = () => {
    if (customGradientColors.length < 4) {
      setCustomGradientColors([...customGradientColors, '#333333']);
    }
  };

  const handleRemoveGradientColor = (index: number) => {
    if (customGradientColors.length > 2) {
      setCustomGradientColors(customGradientColors.filter((_, i) => i !== index));
    }
  };

  const handleSelectPresetWallpaper = (wallpaper: typeof defaultWallpapers[0]) => {
    setBackgroundConfig({
      type: 'image',
      presetWallpaper: wallpaper.url,
    });
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    saveCurrentAsPreset(newPresetName.trim());
    setNewPresetName('');
    setIsCreatingPreset(false);
  };

  const handleSetSolidBackground = (color: string) => {
    setSolidBackground(color);
    setBackgroundConfig({
      type: 'solid',
      solidColor: color,
    });
  };

  const handleResetBackground = () => {
    setBackgroundConfig({ type: 'default' });
    setSolidBackground('#0f1115');
  };

  // Keep local background editors in sync with applied config
  useEffect(() => {
    if (backgroundConfig.type === 'solid' && backgroundConfig.solidColor) {
      setSolidBackground(backgroundConfig.solidColor);
    }
    if (backgroundConfig.type === 'gradient' && backgroundConfig.gradientColors?.length) {
      setCustomGradientColors(backgroundConfig.gradientColors);
      setCustomGradientAngle(backgroundConfig.gradientAngle ?? 135);
    }
  }, [backgroundConfig]);

  const glassLabel = useMemo(() => {
    if (glassIntensity <= 25) return 'Airy';
    if (glassIntensity >= 75) return 'Frosted';
    return 'Balanced';
  }, [glassIntensity]);

  const sliderBackground = useMemo(() => {
    return `linear-gradient(90deg,
      color-mix(in srgb, var(--accent-primary) 80%, transparent) 0%,
      color-mix(in srgb, var(--accent-primary) 80%, transparent) ${glassIntensity}%,
      color-mix(in srgb, var(--card-border) 55%, transparent) ${glassIntensity}%,
      color-mix(in srgb, var(--card-border) 35%, transparent) 100%)`;
  }, [glassIntensity]);

  const hasCustomBackground = backgroundConfig.type !== 'default' || !!backgroundImage;

  const wallpaperPreview = useMemo(() => {
    if (backgroundConfig.type === 'image') {
      return backgroundConfig.imageUrl || backgroundConfig.presetWallpaper || backgroundImage;
    }
    return backgroundImage;
  }, [backgroundConfig.imageUrl, backgroundConfig.presetWallpaper, backgroundConfig.type, backgroundImage]);

  return (
    <AppLayout onQuickAdd={() => alert('Please navigate to the Dashboard to create cards')}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-brand text-(--text-strong)">Settings</h1>
          <div className="h-1 w-16 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <p className="text-(--text-soft) mt-3">
            Tune ByteBox to your own style.
          </p>
        </div>

        {/* Appearance */}
        <section className="glass glass--dense rounded-3xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-(--text-strong)">🎨 Appearance</h2>
              <p className="text-sm text-(--text-soft)">Colors, icons, and wallpaper options</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="space-y-5">
            {/* Glass Transparency */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">
                    Glass Transparency
                  </h3>
                  <p className="text-xs text-(--text-soft)">
                    Dial in how frosted or clear the UI surface feels against your wallpaper.
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-(--text-strong)">{glassIntensity}%</span>
                  <span className="text-xs uppercase tracking-widest text-(--text-soft)">{glassLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-(--text-soft)">Clear</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={glassIntensity}
                  onChange={(event) => setGlassIntensity(Number(event.target.value))}
                  style={{ background: sliderBackground }}
                  className="glass-range flex-1"
                  aria-label="Glass transparency"
                />
                <span className="text-xs uppercase tracking-widest text-(--text-soft)">Frosted</span>
              </div>
              <div className="grid gap-2 text-xs text-(--text-soft) sm:grid-cols-3">
                <div className="rounded-lg border border-[color-mix(in_srgb,var(--card-border)_65%,transparent)] px-3 py-2">
                  <p className="font-medium text-(--text-strong)">Airy</p>
                  <p>Best when your background is bold or busy.</p>
                </div>
                <div className="rounded-lg border border-[color-mix(in_srgb,var(--card-border)_65%,transparent)] px-3 py-2">
                  <p className="font-medium text-(--text-strong)">Balanced</p>
                  <p>A little frost with plenty of depth.</p>
                </div>
                <div className="rounded-lg border border-[color-mix(in_srgb,var(--card-border)_65%,transparent)] px-3 py-2">
                  <p className="font-medium text-(--text-strong)">Frosted</p>
                  <p>Stronger blur for extra-legible panels.</p>
                </div>
              </div>
            </div>

            {/* Accent Themes */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">Accent Themes</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {allAccentThemes.map((theme: AccentTheme) => {
                  const isActive = accentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setAccentTheme(theme.id)}
                      className={cn(
                        'group rounded-2xl p-4 text-left transition-all border flex flex-col gap-3',
                        'surface-card surface-card--subtle hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]',
                        isActive && 'border-[color-mix(in_srgb,var(--accent-border)_80%,transparent)] shadow-[0_18px_60px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-(--text-strong)">{theme.name}</p>
                          <p className="text-xs text-(--text-soft)">{theme.description}</p>
                        </div>
                        <ArrowUpTrayIcon className={cn('w-5 h-5 transition-opacity', isActive ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-70')} />
                      </div>
                      <div className="flex items-center gap-2">
                        {theme.palette.slice(0, 6).map((color: string, index: number) => (
                          <span
                            key={color + index}
                            className="h-7 w-7 rounded-lg border"
                            style={{
                              background: color,
                              borderColor: 'rgba(255,255,255,0.08)',
                            }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Accent Themes */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">Custom Accent Themes</h3>
                  <p className="text-xs text-(--text-soft)">Create and save up to 6-color palettes.</p>
                </div>
                <button
                  onClick={() => setIsCreatingTheme((v) => !v)}
                  className="px-3 py-2 text-sm rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)] transition-all flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  {isCreatingTheme ? 'Close builder' : 'New custom theme'}
                </button>
              </div>

              {isCreatingTheme && (
                <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="new-theme-name" className="text-xs font-semibold text-(--text-soft) uppercase tracking-widest">Theme name</label>
                    <input
                      id="new-theme-name"
                      value={newThemeName}
                      onChange={(event) => setNewThemeName(event.target.value)}
                      placeholder="e.g. Cyber Sunset"
                      className="w-full rounded-lg px-3 py-2 bg-transparent border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] focus:border-[color-mix(in_srgb,var(--accent-border)_65%,transparent)] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-(--text-soft) uppercase tracking-widest">Colors</span>
                      <span className="text-[11px] text-(--text-soft)">{newThemeColors.length}/6</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {newThemeColors.map((color, idx) => (
                        <div key={color + idx} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(event) => handleUpdateThemeColor(idx, event.target.value)}
                            className="h-12 w-12 rounded-xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]"
                            aria-label={`Custom theme color ${idx + 1}`}
                          />
                          {newThemeColors.length > 2 && (
                            <button
                              onClick={() => handleRemoveThemeColor(idx)}
                              className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--hover-bg)_80%,transparent)]"
                              aria-label="Remove color"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {newThemeColors.length < 6 && (
                        <button
                          onClick={handleAddThemeColor}
                          className="h-12 px-4 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] text-sm text-(--text-soft) flex items-center gap-2"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add color
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCreateCustomTheme}
                      className="px-4 py-2 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_85%,transparent)] text-white text-sm font-semibold shadow-[0_12px_35px_color-mix(in_srgb,var(--accent-primary)_38%,transparent)]"
                    >
                      Save theme
                    </button>
                    <button
                      onClick={() => {
                        setNewThemeName('');
                        setNewThemeColors(['#f72585', '#7209b7', '#3a0ca3']);
                        setIsCreatingTheme(false);
                      }}
                      className="px-4 py-2 rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {customAccentThemes.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {customAccentThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="rounded-2xl p-4 border surface-card surface-card--subtle border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-(--text-strong)">{theme.name}</p>
                          <p className="text-xs text-(--text-soft)">Custom palette</p>
                        </div>
                        <button
                          onClick={() => removeCustomAccentTheme(theme.id)}
                          className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)] text-(--text-soft)"
                          aria-label={`Delete ${theme.name}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {theme.palette.slice(0, 6).map((color: string, index: number) => (
                          <span
                            key={color + index}
                            className="h-7 w-7 rounded-lg border"
                            style={{
                              background: color,
                              borderColor: 'rgba(255,255,255,0.08)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Icon Palettes */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">Icon Palette</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {iconThemes.map((theme: IconTheme) => {
                  const palette = theme.userAdjustable
                    ? [customIconColor || theme.palette[0], ...theme.palette.slice(1)]
                    : theme.palette;
                  const isActive = iconTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setIconTheme(theme.id)}
                      className={cn(
                        'group rounded-2xl p-4 text-left transition-all border flex flex-col gap-3',
                        'surface-card surface-card--subtle hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]',
                        isActive && 'border-[color-mix(in_srgb,var(--accent-border)_80%,transparent)] shadow-[0_18px_60px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-(--text-strong)">{theme.name}</p>
                          <p className="text-xs text-(--text-soft)">{theme.description}</p>
                        </div>
                        <ArrowDownTrayIcon className={cn('w-5 h-5 transition-opacity', isActive ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-70')} />
                      </div>
                      <div className="flex items-center gap-2">
                        {palette.slice(0, 6).map((color: string, index: number) => (
                          <span
                            key={color + index}
                            className="h-7 w-7 rounded-full border"
                            style={{
                              background: color,
                              borderColor: 'rgba(255,255,255,0.15)',
                            }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {iconTheme.userAdjustable && (
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={customIconColor}
                    onChange={(event) => setCustomIconColor(event.target.value)}
                    className="h-12 w-12 rounded-2xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]"
                    aria-label="Custom icon color"
                  />
                  <div>
                    <p className="text-sm font-medium text-(--text-strong)">Custom icon color</p>
                    <p className="text-xs text-(--text-soft)">{customIconColor}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Backgrounds */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">Backgrounds</h3>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-(--text-strong)">Solid background</p>
                      <p className="text-xs text-(--text-soft)">Pick any hex and we’ll set both background tokens to it.</p>
                    </div>
                    <SwatchIcon className="w-5 h-5 text-(--text-soft)" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="color"
                      value={solidBackground}
                      onChange={(event) => handleSetSolidBackground(event.target.value)}
                      className="h-12 w-12 rounded-xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]"
                      aria-label="Solid background color"
                    />
                    <input
                      value={solidBackground}
                      onChange={(event) => setSolidBackground(event.target.value)}
                      className="px-3 py-2 rounded-lg bg-transparent border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] focus:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] outline-none text-sm"
                      aria-label="Solid background color hex value"
                    />
                    <button
                      onClick={() => handleSetSolidBackground(solidBackground)}
                      className="px-3 py-2 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_85%,transparent)] text-white text-sm shadow-[0_10px_28px_color-mix(in_srgb,var(--accent-primary)_32%,transparent)]"
                    >
                      Apply solid
                    </button>
                    <button
                      onClick={handleResetBackground}
                      disabled={!hasCustomBackground}
                      className={cn(
                        'px-3 py-2 rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] text-sm transition-all',
                        hasCustomBackground
                          ? 'hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]'
                          : 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      Reset to default
                    </button>
                  </div>
                </div>

                <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-(--text-strong)">Gradient background</p>
                      <p className="text-xs text-(--text-soft)">Blend 2–4 colors or pick a preset, then set the angle.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {customGradientColors.map((color, idx) => (
                      <div key={color + idx} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(event) => {
                            const updated = [...customGradientColors];
                            updated[idx] = event.target.value;
                            setCustomGradientColors(updated);
                          }}
                          className="h-12 w-12 rounded-xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]"
                          aria-label={`Gradient color ${idx + 1}`}
                        />
                        {customGradientColors.length > 2 && (
                          <button
                            onClick={() => handleRemoveGradientColor(idx)}
                            className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--hover-bg)_80%,transparent)]"
                            aria-label="Remove gradient color"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {customGradientColors.length < 4 && (
                      <button
                        onClick={handleAddGradientColor}
                        className="h-12 px-4 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] text-sm text-(--text-soft) flex items-center gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add color
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest text-(--text-soft)">Angle</span>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={customGradientAngle}
                      onChange={(event) => setCustomGradientAngle(Number(event.target.value))}
                      className="glass-range flex-1"
                      aria-label="Gradient angle"
                    />
                    <span className="text-sm font-semibold text-(--text-strong)">{customGradientAngle}°</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleApplyCustomGradient}
                      className="px-4 py-2 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_85%,transparent)] text-white text-sm font-semibold shadow-[0_12px_35px_color-mix(in_srgb,var(--accent-primary)_38%,transparent)]"
                    >
                      Apply custom gradient
                    </button>
                    <button
                      onClick={() => {
                        setCustomGradientColors(['#1a1a2e', '#16213e']);
                        setCustomGradientAngle(135);
                      }}
                      className="px-4 py-2 rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] text-sm"
                    >
                      Reset gradient editor
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-(--text-soft) uppercase tracking-widest">Presets</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {gradientPresets.map((preset) => {
                        const isActive =
                          backgroundConfig.type === 'gradient' &&
                          backgroundConfig.gradientColors?.join(',') === preset.colors.join(',') &&
                          (backgroundConfig.gradientAngle ?? 135) === preset.angle;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleApplyGradient(preset)}
                            className={cn(
                              'rounded-xl p-3 border text-left transition-all',
                              'surface-card surface-card--subtle hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]',
                              isActive && 'border-[color-mix(in_srgb,var(--accent-border)_80%,transparent)] shadow-[0_12px_40px_color-mix(in_srgb,var(--accent-primary)_22%,transparent)]'
                            )}
                            style={{ backgroundImage: `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})` }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="font-medium text-(--text-strong)">{preset.name}</p>
                                <p className="text-[11px] text-(--text-soft)">{preset.colors.length}-color blend</p>
                              </div>
                              {isActive && <CheckIcon className="w-5 h-5 text-accent" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-(--text-strong)">Wallpaper library</p>
                    <p className="text-xs text-(--text-soft)">Choose a built-in wallpaper or upload your own.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {defaultWallpapers.map((wallpaper) => {
                    const isActive = backgroundConfig.type === 'image' && backgroundConfig.presetWallpaper === wallpaper.url;
                    return (
                      <button
                        key={wallpaper.id}
                        onClick={() => handleSelectPresetWallpaper(wallpaper)}
                        className={cn(
                          'rounded-2xl p-3 border text-left transition-all flex flex-col gap-2',
                          'surface-card surface-card--subtle hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]',
                          isActive && 'border-[color-mix(in_srgb,var(--accent-border)_80%,transparent)] shadow-[0_14px_40px_color-mix(in_srgb,var(--accent-primary)_22%,transparent)]'
                        )}
                      >
                        <div
                          className="h-24 rounded-xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]"
                          style={{ 
                            background: wallpaper.preview,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-medium text-(--text-strong)">{wallpaper.name}</p>
                            <p className="text-[11px] text-(--text-soft)">Built-in</p>
                          </div>
                          {isActive && <CheckIcon className="w-5 h-5 text-accent" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => wallpaperInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)] transition-all flex items-center gap-2"
                    disabled={wallpaperUploading}
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>{wallpaperUploading ? 'Uploading…' : 'Upload background'}</span>
                  </button>

                  <button
                    onClick={handleResetBackground}
                    disabled={!hasCustomBackground || wallpaperUploading}
                    className={cn(
                      'px-4 py-2.5 rounded-xl surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] transition-all flex items-center gap-2',
                      hasCustomBackground
                        ? 'hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]'
                        : 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span>Reset background</span>
                  </button>

                  {wallpaperPreview ? (
                    <div className="relative">
                      <Image
                        src={wallpaperPreview}
                        alt="Current wallpaper preview"
                        width={160}
                        height={96}
                        unoptimized
                        className="w-40 h-24 object-cover rounded-2xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] shadow-[0_18px_45px_rgba(5,6,11,0.35)]"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-(--text-soft)">Optional: add a custom background image to sit behind the glass UI.</p>
                  )}
                </div>
                <input
                  ref={wallpaperInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">Typography</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-(--text-strong)">UI font</p>
                    <span className="text-[11px] text-(--text-soft)">Applied globally</span>
                  </div>
                  <select
                    value={fontConfig.uiFont}
                    onChange={(event) => setFontConfig({ ...fontConfig, uiFont: event.target.value })}
                    className="w-full rounded-lg bg-transparent border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] px-3 py-2 text-sm focus:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] outline-none"
                    aria-label="Select UI font"
                  >
                    {availableFonts.map((font) => (
                      <option key={font.id} value={font.id} className="bg-[color-mix(in_srgb,var(--background)_90%,#000_10%)]">
                        {font.name}
                      </option>
                    ))}
                  </select>
                  <p
                    className="text-sm text-(--text-soft)"
                    style={{ fontFamily: availableFonts.find((f) => f.id === fontConfig.uiFont)?.value }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>

                <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-(--text-strong)">Code blocks</p>
                    <span className="text-[11px] text-(--text-soft)">Mono font</span>
                  </div>
                  <select
                    value={fontConfig.monoFont}
                    onChange={(event) => setFontConfig({ ...fontConfig, monoFont: event.target.value })}
                    className="w-full rounded-lg bg-transparent border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] px-3 py-2 text-sm focus:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] outline-none"
                    aria-label="Select monospace font for code blocks"
                  >
                    {availableMonoFonts.map((font) => (
                      <option key={font.id} value={font.id} className="bg-[color-mix(in_srgb,var(--background)_90%,#000_10%)]">
                        {font.name}
                      </option>
                    ))}
                  </select>
                  <p
                    className="text-sm text-(--text-soft)"
                    style={{ fontFamily: availableMonoFonts.find((f) => f.id === fontConfig.monoFont)?.value }}
                  >
                    const accent = [&apos;#f72585&apos;, &apos;#4361ee&apos;];
                  </p>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-(--text-soft) uppercase tracking-wider">Presets</h3>
                  <p className="text-xs text-(--text-soft)">Save everything above as reusable profiles.</p>
                </div>
                <button
                  onClick={() => setIsCreatingPreset((v) => !v)}
                  className="px-3 py-2 text-sm rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)] transition-all flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  {isCreatingPreset ? 'Close' : 'Save current as preset'}
                </button>
              </div>

              {isCreatingPreset && (
                <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="preset-name" className="text-xs font-semibold text-(--text-soft) uppercase tracking-widest">Preset name</label>
                    <input
                      id="preset-name"
                      value={newPresetName}
                      onChange={(event) => setNewPresetName(event.target.value)}
                      placeholder="e.g. Focus mode, Presentation"
                      className="w-full rounded-lg px-3 py-2 bg-transparent border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] focus:border-[color-mix(in_srgb,var(--accent-border)_65%,transparent)] outline-none"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleSavePreset}
                      className="px-4 py-2 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_85%,transparent)] text-white text-sm font-semibold shadow-[0_12px_35px_color-mix(in_srgb,var(--accent-primary)_38%,transparent)]"
                    >
                      Save preset
                    </button>
                    <button
                      onClick={() => {
                        setNewPresetName('');
                        setIsCreatingPreset(false);
                      }}
                      className="px-4 py-2 rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {settingsPresets.length === 0 ? (
                <p className="text-xs text-(--text-soft)">No presets yet. Save your current layout, colors, fonts, and wallpaper to reuse later.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {settingsPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="rounded-2xl p-4 border surface-card surface-card--subtle border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-(--text-strong)">{preset.name}</p>
                          <p className="text-[11px] text-(--text-soft)">Saved {new Date(preset.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadPreset(preset.id)}
                            className="px-3 py-1.5 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_85%,transparent)] text-white text-xs shadow-[0_10px_25px_color-mix(in_srgb,var(--accent-primary)_30%,transparent)]"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="px-3 py-1.5 rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] text-xs hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-(--text-soft)">
                        <span className="px-2 py-1 rounded-full border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]">Mode: {preset.mode}</span>
                        <span className="px-2 py-1 rounded-full border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]">Accent: {preset.accentThemeId}</span>
                        <span className="px-2 py-1 rounded-full border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]">Font: {preset.fonts.uiFont}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="glass glass--dense rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-(--text-strong)">💾 Data Management</h2>
            <p className="text-sm text-(--text-soft)">Backup, restore, or reset your data</p>
          </div>

          <div className="grid gap-4">
            <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4">
              <ExportImport />
            </div>

            <div className="surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-red-400">Danger Zone</h3>
                <p className="text-xs text-(--text-soft)">
                  Permanently delete all cards, tags, and categories.
                </p>
              </div>
              {showDeleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-400">Are you absolutely sure?</p>
                  <p className="text-xs text-(--text-soft)">
                    This action cannot be undone. All stored content will be permanently removed.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleClearAllData}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium shadow-[0_16px_40px_rgba(239,68,68,0.35)] hover:shadow-[0_20px_50px_rgba(239,68,68,0.45)] transition-all"
                    >
                      Yes, delete everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 rounded-lg surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)] text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <TrashIcon className="w-5 h-5" />
                  Clear All Data
                </button>
              )}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="glass glass--dense rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-(--text-strong)">ℹ️ About ByteBox</h2>
          <div className="grid gap-3 text-sm text-(--text-soft)">
            <div className="flex justify-between border-b border-[color-mix(in_srgb,var(--card-border)_70%,transparent)] pb-2">
              <span>Version</span>
              <span className="text-(--text-strong)">2.0.0</span>
            </div>
            <div className="flex justify-between border-b border-[color-mix(in_srgb,var(--card-border)_70%,transparent)] pb-2">
              <span>Built with</span>
              <span className="text-(--text-strong)">Next.js&nbsp;16 + React&nbsp;19</span>
            </div>
            <div className="flex justify-between border-b border-[color-mix(in_srgb,var(--card-border)_70%,transparent)] pb-2">
              <span>License</span>
              <span className="text-(--text-strong)">Apache 2.0</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[color-mix(in_srgb,var(--card-border)_70%,transparent)] space-y-2 text-sm text-(--text-soft)">
            <a
              href="https://github.com/pinkpixel-dev/bytebox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="https://github.com/pinkpixel-dev/bytebox/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Report a bug
            </a>
            <a
              href="https://buymeacoffee.com/pinkpixel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Buy me a coffee
            </a>
          </div>
        </section>

        <div className="text-center text-sm text-(--text-soft) py-6">
          <p>Dream it, Pixel it ✨</p>
        </div>
      </div>
    </AppLayout>
  );
}
