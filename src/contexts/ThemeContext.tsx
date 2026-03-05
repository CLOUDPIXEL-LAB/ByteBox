'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  accentThemes,
  iconThemes,
  DEFAULT_ACCENT_THEME_ID,
  DEFAULT_ICON_THEME_ID,
  AccentTheme,
  IconTheme,
  BackgroundConfig,
  FontConfig,
  SettingsPreset,
  availableFonts,
  availableMonoFonts,
  defaultBackgroundConfig,
  defaultFontConfig,
  normalizeFontConfig,
  createCustomAccentTheme,
} from '@/lib/themeRegistry';

type ThemeMode = 'dark' | 'light';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  glassIntensity: number;
  setGlassIntensity: (value: number) => void;
  accentTheme: AccentTheme;
  setAccentTheme: (id: string) => void;
  iconTheme: IconTheme;
  setIconTheme: (id: string) => void;
  customIconColor: string;
  setCustomIconColor: (hex: string) => void;
  getIconColor: (key: string, offset?: number) => string;
  getIconColorByIndex: (index: number) => string;
  backgroundImage: string | null;
  setBackgroundImageFromFile: (file: File) => Promise<void>;
  clearBackgroundImage: () => void;
  // New background config
  backgroundConfig: BackgroundConfig;
  setBackgroundConfig: (config: BackgroundConfig) => void;
  // Font config
  fontConfig: FontConfig;
  setFontConfig: (config: FontConfig) => void;
  // Custom accent themes
  customAccentThemes: AccentTheme[];
  addCustomAccentTheme: (name: string, colors: string[]) => void;
  removeCustomAccentTheme: (id: string) => void;
  allAccentThemes: AccentTheme[];
  // Settings presets
  settingsPresets: SettingsPreset[];
  saveCurrentAsPreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MODE: 'bytebox-theme',
  ACCENT: 'bytebox-accent-theme',
  ICON: 'bytebox-icon-theme',
  ICON_CUSTOM: 'bytebox-icon-user-color',
  BACKGROUND: 'bytebox-background-image',
  GLASS: 'bytebox-glass-intensity',
  BACKGROUND_CONFIG: 'bytebox-background-config',
  FONT_CONFIG: 'bytebox-font-config',
  CUSTOM_ACCENT_THEMES: 'bytebox-custom-accent-themes',
  SETTINGS_PRESETS: 'bytebox-settings-presets',
};

const DEFAULT_GLASS_INTENSITY = 60;

const isBrowser = () => globalThis.window !== undefined && globalThis.document !== undefined;


const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + (value.codePointAt(i) ?? 0)) >>> 0;
  }
  return hash;
};

const applyModeTokens = (mode: ThemeMode) => {
  if (!isBrowser()) return;
  const root = document.documentElement;

  root.dataset.themeMode = mode;

  if (mode === 'dark') {
    root.classList.add('dark');
    // Updated to slate grays instead of dark blue
    root.style.setProperty('--background', '#0f1115');
    root.style.setProperty('--background-muted', '#1a1d24');
    root.style.setProperty('--foreground', '#f8fafc');
    root.style.setProperty('--foreground-soft', 'rgba(248, 250, 252, 0.65)');
    root.style.setProperty('--card-bg', 'rgba(26, 29, 36, 0.62)');
    root.style.setProperty('--card-border', 'rgba(148, 163, 184, 0.22)');
    root.style.setProperty('--hover-bg', 'rgba(148, 163, 184, 0.12)');
    root.style.setProperty('--text-strong', 'rgba(248, 250, 252, 0.95)');
    root.style.setProperty('--text-soft', 'rgba(226, 232, 240, 0.7)');
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--background', '#f5f7fb');
    root.style.setProperty('--background-muted', '#e2e8f0');
    root.style.setProperty('--foreground', '#0f172a');
    root.style.setProperty('--foreground-soft', 'rgba(15, 23, 42, 0.7)');
    root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.78)');
    root.style.setProperty('--card-border', 'rgba(15, 23, 42, 0.12)');
    root.style.setProperty('--hover-bg', 'rgba(15, 23, 42, 0.08)');
    root.style.setProperty('--text-strong', 'rgba(15, 23, 42, 0.92)');
    root.style.setProperty('--text-soft', 'rgba(15, 23, 42, 0.65)');
  }
};

const applyGlassTokens = (mode: ThemeMode, intensity: number) => {
  if (!isBrowser()) return;
  const root = document.documentElement;

  const clamped = Math.max(0, Math.min(100, intensity));
  const scale = clamped / 100;

  // Updated glass base to slate gray for dark mode
  const glassBase = mode === 'dark' ? [26, 29, 36] : [255, 255, 255];
  const borderBase = mode === 'dark' ? [148, 163, 184] : [15, 23, 42];
  const shadowBase = mode === 'dark' ? [15, 17, 21] : [15, 23, 42];

  const minAlpha = mode === 'dark' ? 0.32 : 0.38;
  const maxAlpha = mode === 'dark' ? 0.82 : 0.9;
  const alpha = minAlpha + (maxAlpha - minAlpha) * scale;

  const minBorderAlpha = mode === 'dark' ? 0.18 : 0.08;
  const maxBorderAlpha = mode === 'dark' ? 0.42 : 0.26;
  const borderAlpha = minBorderAlpha + (maxBorderAlpha - minBorderAlpha) * scale;

  const minShadowAlpha = mode === 'dark' ? 0.25 : 0.15;
  const maxShadowAlpha = mode === 'dark' ? 0.55 : 0.32;
  const shadowAlpha = minShadowAlpha + (maxShadowAlpha - minShadowAlpha) * scale;

  const minBlur = mode === 'dark' ? 16 : 18;
  const maxBlur = mode === 'dark' ? 30 : 32;
  const blur = minBlur + (maxBlur - minBlur) * scale;

  root.style.setProperty('--glass-bg', `rgba(${glassBase.join(', ')}, ${alpha.toFixed(2)})`);
  root.style.setProperty('--glass-border', `rgba(${borderBase.join(', ')}, ${borderAlpha.toFixed(2)})`);
  root.style.setProperty('--glass-shadow', `0 30px 120px rgba(${shadowBase.join(', ')}, ${shadowAlpha.toFixed(2)})`);
  root.style.setProperty('--glass-blur', `${blur.toFixed(1)}px`);
  root.style.setProperty('--glass-intensity', `${clamped}`);
};

const applyAccentTheme = (theme: AccentTheme) => {
  if (!isBrowser()) return;
  const root = document.documentElement;
  root.dataset.accentTheme = theme.id;

  const palette = theme.palette.length > 0 ? theme.palette : ['#f72585'];
  for (const [idx, color] of palette.slice(0, 8).entries()) {
    root.style.setProperty(`--accent-${idx + 1}`, color);
  }

  const primary = palette[0];
  const secondary = palette[1] ?? palette[0];
  const tertiary = palette[2] ?? palette[0];

  root.style.setProperty('--accent', primary);
  root.style.setProperty('--accent-primary', primary);
  root.style.setProperty('--accent-secondary', secondary);
  root.style.setProperty('--accent-tertiary', tertiary);
  root.style.setProperty(
    '--accent-gradient',
    `linear-gradient(132deg, ${primary} 0%, ${secondary} 55%, ${tertiary} 100%)`
  );
  root.style.setProperty('--accent-soft', `${primary}1f`);
  root.style.setProperty('--accent-shadow', `0 16px 60px ${primary}33`);
  root.style.setProperty('--accent-border', `${primary}55`);
  root.style.setProperty('--accent-highlight', theme.highlight ?? primary);
  root.style.setProperty('--glass-tint', theme.glassTint ?? `${primary}1a`);
};

const applyIconPalette = (palette: string[]) => {
  if (!isBrowser()) return;
  const root = document.documentElement;
  for (const [idx, color] of palette.slice(0, 12).entries()) {
    root.style.setProperty(`--icon-${idx + 1}`, color);
  }
  const primary = palette[0] ?? '#f472b6';
  root.style.setProperty('--icon-primary', primary);
};

const applyBackgroundImage = (dataUrl: string | null) => {
  if (!isBrowser()) return;
  const root = document.documentElement;
  if (dataUrl) {
    const sanitized = dataUrl.trim();
    // Guard against malformed data URIs that can throw ERR_INVALID_URL in devtools
    const isDataUrl = /^data:image\/[^;]+;base64,/i.test(sanitized);
    if (!isDataUrl) {
      root.dataset.hasUserWallpaper = 'false';
      root.style.removeProperty('--user-background-image');
      return;
    }
    root.dataset.hasUserWallpaper = 'true';
    // Quote to avoid parsing issues with special chars in the base64 payload
    root.style.setProperty('--user-background-image', `url("${sanitized}")`);
  } else {
    root.dataset.hasUserWallpaper = 'false';
    root.style.removeProperty('--user-background-image');
  }
};

const applyBackgroundConfig = (config: BackgroundConfig, mode: ThemeMode) => {
  if (!isBrowser()) return;
  const root = document.documentElement;

  // Clear previous background settings
  root.style.removeProperty('--custom-background');
  root.style.removeProperty('--user-background-image');
  root.dataset.hasUserWallpaper = 'false';
  root.dataset.backgroundType = config.type;

  switch (config.type) {
    case 'solid':
      if (config.solidColor) {
        root.style.setProperty('--background', config.solidColor);
        // Derive muted version by mixing with black/white
        root.style.setProperty('--background-muted', config.solidColor);
      }
      break;

    case 'gradient':
      if (config.gradientColors && config.gradientColors.length >= 2) {
        const angle = config.gradientAngle ?? 135;
        const gradient = `linear-gradient(${angle}deg, ${config.gradientColors.join(', ')})`;
        root.style.setProperty('--custom-background', gradient);
        root.style.setProperty('--background', config.gradientColors[0]);
        root.style.setProperty('--background-muted', config.gradientColors[1] || config.gradientColors[0]);
      }
      break;

    case 'image':
      if (config.imageUrl) {
        root.dataset.hasUserWallpaper = 'true';
        root.style.setProperty('--user-background-image', `url("${config.imageUrl}")`);
      } else if (config.presetWallpaper) {
        root.dataset.hasUserWallpaper = 'true';
        root.style.setProperty('--user-background-image', `url("${config.presetWallpaper}")`);
      }
      break;

    case 'default':
    default:
      // Apply default mode colors
      applyModeTokens(mode);
      break;
  }
};

const applyFontConfig = (config: FontConfig) => {
  if (!isBrowser()) return;
  const body = document.body;
  const normalizedConfig = normalizeFontConfig(config);

  // Set data attributes on body (where Next.js font variables are defined)
  body.dataset.uiFont = normalizedConfig.uiFont;
  body.dataset.monoFont = normalizedConfig.monoFont;

  // Resolve the actual font-family value from Next.js font CSS variables.
  // Next.js fonts define variables like --font-inter on body via classes.
  // We need to read the computed value, not pass through a var() reference.
  const uiFontDef = availableFonts.find((font) => font.id === normalizedConfig.uiFont);
  const monoFontDef = availableMonoFonts.find((font) => font.id === normalizedConfig.monoFont);

  // For system fonts or direct values, use as-is
  // For fonts using var(--font-xxx), resolve the actual computed value
  const resolveFont = (fontValue: string, fallback: string): string => {
    const varMatch = /^var\(([^)]+)\)/.exec(fontValue);
    if (varMatch) {
      const varName = varMatch[1];
      const computed = getComputedStyle(body).getPropertyValue(varName).trim();
      if (computed) {
        // Append the fallback stack after the resolved value
        const restOfStack = fontValue.replace(/^var\([^)]+\),?\s*/, '');
        return restOfStack ? `${computed}, ${restOfStack}` : computed;
      }
    }
    // If no var() or couldn't resolve, return as-is or fallback
    return fontValue || fallback;
  };

  const uiFontValue = resolveFont(
    uiFontDef?.value ?? '',
    'system-ui, -apple-system, sans-serif'
  );
  const monoFontValue = resolveFont(
    monoFontDef?.value ?? '',
    'ui-monospace, monospace'
  );

  body.style.setProperty('--font-ui-active', uiFontValue);
  body.style.setProperty('--font-mono-active', monoFontValue);
  body.style.setProperty('--font-size-body', `${normalizedConfig.bodyFontSize}px`);
  body.style.setProperty('--font-size-category-title', `${normalizedConfig.categoryTitleSize}px`);
  body.style.setProperty('--font-size-card-title', `${normalizedConfig.cardTitleSize}px`);
  body.style.setProperty('--font-size-code', `${normalizedConfig.codeFontSize}px`);
  body.style.setProperty('--board-column-width', `${normalizedConfig.columnWidth}px`);
};

const readLocalStorage = <T,>(
  key: string,
  parser: (value: string) => T | null,
  fallback: T
) => {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = parser(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const readJsonFromStorage = <T,>(key: string, fallback: T): T => {
  return readLocalStorage<T>(key, (value) => {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }, fallback);
};

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [modeInternal, setModeInternal] = useState<ThemeMode>('dark');
  const [accentThemeId, setAccentThemeId] = useState<string>(DEFAULT_ACCENT_THEME_ID);
  const [iconThemeId, setIconThemeId] = useState<string>(DEFAULT_ICON_THEME_ID);
  const [customIconColorInternal, setCustomIconColorInternal] = useState<string>('#f472b6');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [glassIntensityInternal, setGlassIntensityInternal] = useState<number>(DEFAULT_GLASS_INTENSITY);
  const [backgroundConfigInternal, setBackgroundConfigInternal] = useState<BackgroundConfig>(defaultBackgroundConfig);
  const [fontConfigInternal, setFontConfigInternal] = useState<FontConfig>(defaultFontConfig);
  const [customAccentThemes, setCustomAccentThemes] = useState<AccentTheme[]>([]);
  const [settingsPresets, setSettingsPresets] = useState<SettingsPreset[]>([]);
  const [mounted, setMounted] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Debounced API save function
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveToApi = useCallback((data: Record<string, unknown>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Failed to save settings to API:', error);
      }
    }, 500); // Debounce 500ms
  }, []);

  // Load settings from API on mount, with localStorage fallback for instant hydration
  useEffect(() => {
    if (!isBrowser()) return;

    // First, load from localStorage for instant hydration
    const storedMode = readLocalStorage<ThemeMode>(
      STORAGE_KEYS.MODE,
      (value) => (value === 'dark' || value === 'light' ? value : null),
      'dark'
    );
    const storedCustomAccentThemes = readJsonFromStorage<AccentTheme[]>(
      STORAGE_KEYS.CUSTOM_ACCENT_THEMES,
      []
    );
    const allThemes = [...accentThemes, ...storedCustomAccentThemes];
    const storedAccent = readLocalStorage<string>(
      STORAGE_KEYS.ACCENT,
      (value) => (allThemes.some((theme) => theme.id === value) ? value : null),
      DEFAULT_ACCENT_THEME_ID
    );
    const storedIcon = readLocalStorage<string>(
      STORAGE_KEYS.ICON,
      (value) => (iconThemes.some((theme) => theme.id === value) ? value : null),
      DEFAULT_ICON_THEME_ID
    );
    const storedIconColor = readLocalStorage<string>(
      STORAGE_KEYS.ICON_CUSTOM,
      (value) => value,
      '#f472b6'
    );
    const storedBackground = readLocalStorage<string | null>(
      STORAGE_KEYS.BACKGROUND,
      (value) => value || null,
      null
    );
    const storedGlass = readLocalStorage<number>(
      STORAGE_KEYS.GLASS,
      (value) => {
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) return null;
        return Math.min(100, Math.max(0, parsed));
      },
      DEFAULT_GLASS_INTENSITY
    );
    const storedBackgroundConfig = readJsonFromStorage<BackgroundConfig>(
      STORAGE_KEYS.BACKGROUND_CONFIG,
      defaultBackgroundConfig
    );
    const storedFontConfig = readJsonFromStorage<FontConfig>(
      STORAGE_KEYS.FONT_CONFIG,
      defaultFontConfig
    );
    const storedPresets = readJsonFromStorage<SettingsPreset[]>(
      STORAGE_KEYS.SETTINGS_PRESETS,
      []
    );

    // Apply localStorage values immediately
    setModeInternal(storedMode);
    setAccentThemeId(storedAccent);
    setIconThemeId(storedIcon);
    setCustomIconColorInternal(storedIconColor);
    setBackgroundImage(storedBackground);
    setGlassIntensityInternal(storedGlass);
    setBackgroundConfigInternal(storedBackgroundConfig);
    setFontConfigInternal(normalizeFontConfig(storedFontConfig));
    setCustomAccentThemes(storedCustomAccentThemes);
    setSettingsPresets(storedPresets);
    setMounted(true);

    // Then fetch from API and update if different
    const loadFromApi = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to load settings');
        const apiSettings = await response.json();

        // Update state with API values (these are the source of truth)
        setModeInternal(apiSettings.mode || 'dark');
        setAccentThemeId(apiSettings.accentThemeId || DEFAULT_ACCENT_THEME_ID);
        setIconThemeId(apiSettings.iconThemeId || DEFAULT_ICON_THEME_ID);
        setCustomIconColorInternal(apiSettings.customIconColor || '#f472b6');
        setGlassIntensityInternal(apiSettings.glassIntensity ?? DEFAULT_GLASS_INTENSITY);
        setBackgroundConfigInternal(apiSettings.backgroundConfig || defaultBackgroundConfig);
        setFontConfigInternal(normalizeFontConfig(apiSettings.fontConfig || defaultFontConfig));
        setCustomAccentThemes(apiSettings.customAccentThemes || []);
        setSettingsPresets(apiSettings.settingsPresets || []);

        // Sync localStorage with API values
        localStorage.setItem(STORAGE_KEYS.MODE, apiSettings.mode || 'dark');
        localStorage.setItem(STORAGE_KEYS.ACCENT, apiSettings.accentThemeId || DEFAULT_ACCENT_THEME_ID);
        localStorage.setItem(STORAGE_KEYS.ICON, apiSettings.iconThemeId || DEFAULT_ICON_THEME_ID);
        localStorage.setItem(STORAGE_KEYS.ICON_CUSTOM, apiSettings.customIconColor || '#f472b6');
        localStorage.setItem(STORAGE_KEYS.GLASS, String(apiSettings.glassIntensity ?? DEFAULT_GLASS_INTENSITY));
        localStorage.setItem(STORAGE_KEYS.BACKGROUND_CONFIG, JSON.stringify(apiSettings.backgroundConfig || defaultBackgroundConfig));
        localStorage.setItem(
          STORAGE_KEYS.FONT_CONFIG,
          JSON.stringify(normalizeFontConfig(apiSettings.fontConfig || defaultFontConfig))
        );
        localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCENT_THEMES, JSON.stringify(apiSettings.customAccentThemes || []));
        localStorage.setItem(STORAGE_KEYS.SETTINGS_PRESETS, JSON.stringify(apiSettings.settingsPresets || []));

        setSettingsLoaded(true);
      } catch (error) {
        console.error('Error loading settings from API:', error);
        // Keep localStorage values as fallback
        setSettingsLoaded(true);
      }
    };

    loadFromApi();
  }, []);

  // Combine built-in and custom accent themes
  const allAccentThemes = useMemo<AccentTheme[]>(() => {
    return [...accentThemes, ...customAccentThemes];
  }, [customAccentThemes]);

  const accentTheme = useMemo<AccentTheme>(() => {
    const found = allAccentThemes.find((theme) => theme.id === accentThemeId);
    return found ?? accentThemes[0];
  }, [accentThemeId, allAccentThemes]);

  const iconTheme = useMemo<IconTheme>(() => {
    const found = iconThemes.find((theme) => theme.id === iconThemeId);
    return found ?? iconThemes[0];
  }, [iconThemeId]);

  const iconPalette = useMemo<string[]>(() => {
    if (iconTheme.userAdjustable) {
      const fallback = iconTheme.palette[0] ?? '#f472b6';
      const primary = customIconColorInternal || fallback;
      const rest = iconTheme.palette.slice(1);
      return [primary, ...rest];
    }
    return iconTheme.palette;
  }, [iconTheme, customIconColorInternal]);

  useEffect(() => {
    if (!mounted) return;
    applyModeTokens(modeInternal);
    applyGlassTokens(modeInternal, glassIntensityInternal);
    // Re-apply background config when mode changes
    if (backgroundConfigInternal.type !== 'default') {
      applyBackgroundConfig(backgroundConfigInternal, modeInternal);
    }
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.MODE, modeInternal);
      if (settingsLoaded) {
        saveToApi({ mode: modeInternal });
      }
    }
  }, [modeInternal, mounted, glassIntensityInternal, backgroundConfigInternal, settingsLoaded, saveToApi]);

  useEffect(() => {
    if (!mounted) return;
    applyAccentTheme(accentTheme);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ACCENT, accentTheme.id);
      if (settingsLoaded) {
        saveToApi({ accentThemeId: accentTheme.id });
      }
    }
  }, [accentTheme, mounted, settingsLoaded, saveToApi]);

  useEffect(() => {
    if (!mounted) return;
    applyIconPalette(iconPalette);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ICON, iconTheme.id);
      if (iconTheme.userAdjustable) {
        localStorage.setItem(STORAGE_KEYS.ICON_CUSTOM, iconPalette[0]);
      }
      if (settingsLoaded) {
        saveToApi({ 
          iconThemeId: iconTheme.id,
          customIconColor: iconTheme.userAdjustable ? iconPalette[0] : customIconColorInternal 
        });
      }
    }
  }, [iconPalette, iconTheme, mounted, settingsLoaded, saveToApi, customIconColorInternal]);

  useEffect(() => {
    if (!mounted) return;
    // Only apply legacy background image if backgroundConfig type is 'default' or 'image'
    if (backgroundConfigInternal.type === 'default' || backgroundConfigInternal.type === 'image') {
      applyBackgroundImage(backgroundImage);
    }
    if (isBrowser()) {
      if (backgroundImage) {
        localStorage.setItem(STORAGE_KEYS.BACKGROUND, backgroundImage);
      } else {
        localStorage.removeItem(STORAGE_KEYS.BACKGROUND);
      }
    }
  }, [backgroundImage, mounted, backgroundConfigInternal.type]);

  useEffect(() => {
    if (!mounted) return;
    applyGlassTokens(modeInternal, glassIntensityInternal);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.GLASS, glassIntensityInternal.toString());
      if (settingsLoaded) {
        saveToApi({ glassIntensity: glassIntensityInternal });
      }
    }
  }, [glassIntensityInternal, mounted, modeInternal, settingsLoaded, saveToApi]);

  useEffect(() => {
    if (!mounted) return;
    applyBackgroundConfig(backgroundConfigInternal, modeInternal);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_CONFIG, JSON.stringify(backgroundConfigInternal));
      if (settingsLoaded) {
        saveToApi({ backgroundConfig: backgroundConfigInternal });
      }
    }
  }, [backgroundConfigInternal, mounted, modeInternal, settingsLoaded, saveToApi]);

  useEffect(() => {
    if (!mounted) return;
    applyFontConfig(fontConfigInternal);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FONT_CONFIG, JSON.stringify(fontConfigInternal));
      if (settingsLoaded) {
        saveToApi({ fontConfig: fontConfigInternal });
      }
    }
  }, [fontConfigInternal, mounted, settingsLoaded, saveToApi]);

  useEffect(() => {
    if (!mounted) return;
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCENT_THEMES, JSON.stringify(customAccentThemes));
      if (settingsLoaded) {
        saveToApi({ customAccentThemes });
      }
    }
  }, [customAccentThemes, mounted, settingsLoaded, saveToApi]);

  useEffect(() => {
    if (!mounted) return;
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS_PRESETS, JSON.stringify(settingsPresets));
      if (settingsLoaded) {
        saveToApi({ settingsPresets });
      }
    }
  }, [settingsPresets, mounted, settingsLoaded, saveToApi]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeInternal(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeInternal((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const setAccentTheme = useCallback((id: string) => {
    setAccentThemeId(id);
  }, []);

  const setIconTheme = useCallback((id: string) => {
    setIconThemeId(id);
  }, []);

  const setCustomIconColor = useCallback((hex: string) => {
    setCustomIconColorInternal(hex);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ICON_CUSTOM, hex);
    }
  }, []);

  const setBackgroundImageFromFile = useCallback(async (file: File) => {
    if (!isBrowser()) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
    setBackgroundImage(dataUrl);
    // Also update background config to image type
    setBackgroundConfigInternal({
      type: 'image',
      imageUrl: dataUrl,
    });
  }, []);

  const clearBackgroundImage = useCallback(() => {
    setBackgroundImage(null);
    setBackgroundConfigInternal({ type: 'default' });
  }, []);

  const setBackgroundConfig = useCallback((config: BackgroundConfig) => {
    setBackgroundConfigInternal(config);
    // Keep legacy backgroundImage in sync only when a custom upload is present.
    // Preset wallpapers and gradients shouldn't retain the previous data URL.
    if (config.type === 'image') {
      setBackgroundImage(config.imageUrl ?? null);
    } else {
      setBackgroundImage(null);
    }
  }, []);

  const setFontConfig = useCallback((config: FontConfig) => {
    setFontConfigInternal(normalizeFontConfig(config));
  }, []);

  const addCustomAccentTheme = useCallback((name: string, colors: string[]) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const newTheme = createCustomAccentTheme(id, name, colors);
    setCustomAccentThemes(prev => [...prev, newTheme]);
    // Automatically select the new theme
    setAccentThemeId(id);
  }, []);

  const removeCustomAccentTheme = useCallback((id: string) => {
    setCustomAccentThemes(prev => prev.filter(t => t.id !== id));
    // If the removed theme was active, switch to default
    if (accentThemeId === id) {
      setAccentThemeId(DEFAULT_ACCENT_THEME_ID);
    }
  }, [accentThemeId]);

  const saveCurrentAsPreset = useCallback((name: string) => {
    const preset: SettingsPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      name,
      createdAt: Date.now(),
      mode: modeInternal,
      accentThemeId,
      iconThemeId,
      customIconColor: customIconColorInternal,
      glassIntensity: glassIntensityInternal,
      background: backgroundConfigInternal,
      fonts: normalizeFontConfig(fontConfigInternal),
      customAccentThemes: customAccentThemes,
    };
    setSettingsPresets(prev => [...prev, preset]);
  }, [modeInternal, accentThemeId, iconThemeId, customIconColorInternal, glassIntensityInternal, backgroundConfigInternal, fontConfigInternal, customAccentThemes]);

  const loadPreset = useCallback((id: string) => {
    const preset = settingsPresets.find(p => p.id === id);
    if (!preset) return;

    setModeInternal(preset.mode);
    setGlassIntensityInternal(preset.glassIntensity);
    setCustomIconColorInternal(preset.customIconColor);
    setBackgroundConfigInternal(preset.background);
    setFontConfigInternal(normalizeFontConfig(preset.fonts));
    
    // Load custom accent themes from preset
    if (preset.customAccentThemes) {
      setCustomAccentThemes(preset.customAccentThemes);
    }
    
    // Set accent and icon themes after custom themes are loaded
    setTimeout(() => {
      setAccentThemeId(preset.accentThemeId);
      setIconThemeId(preset.iconThemeId);
    }, 0);
  }, [settingsPresets]);

  const deletePreset = useCallback((id: string) => {
    setSettingsPresets(prev => prev.filter(p => p.id !== id));
  }, []);

  const getIconColorByIndex = useCallback((index: number) => {
    if (iconPalette.length === 0) return '#f472b6';
    return iconPalette[index % iconPalette.length];
  }, [iconPalette]);

  const getIconColor = useCallback((key: string, offset = 0) => {
    if (iconPalette.length === 0) return '#f472b6';
    const hashedIndex = (hashString(key) + Math.max(0, offset)) % iconPalette.length;
    return iconPalette[hashedIndex];
  }, [iconPalette]);

  const setGlassIntensity = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    setGlassIntensityInternal(clamped);
  }, []);

  const contextValue = useMemo<ThemeContextType>(() => ({
    mode: modeInternal,
    setMode,
    toggleMode,
    glassIntensity: glassIntensityInternal,
    setGlassIntensity,
    accentTheme,
    setAccentTheme,
    iconTheme,
    setIconTheme,
    customIconColor: customIconColorInternal,
    setCustomIconColor,
    getIconColor,
    getIconColorByIndex,
    backgroundImage,
    setBackgroundImageFromFile,
    clearBackgroundImage,
    backgroundConfig: backgroundConfigInternal,
    setBackgroundConfig,
    fontConfig: fontConfigInternal,
    setFontConfig,
    customAccentThemes,
    addCustomAccentTheme,
    removeCustomAccentTheme,
    allAccentThemes,
    settingsPresets,
    saveCurrentAsPreset,
    loadPreset,
    deletePreset,
  }), [
    modeInternal,
    setMode,
    toggleMode,
    glassIntensityInternal,
    setGlassIntensity,
    accentTheme,
    setAccentTheme,
    iconTheme,
    setIconTheme,
    customIconColorInternal,
    setCustomIconColor,
    getIconColor,
    getIconColorByIndex,
    backgroundImage,
    setBackgroundImageFromFile,
    clearBackgroundImage,
    backgroundConfigInternal,
    setBackgroundConfig,
    fontConfigInternal,
    setFontConfig,
    customAccentThemes,
    addCustomAccentTheme,
    removeCustomAccentTheme,
    allAccentThemes,
    settingsPresets,
    saveCurrentAsPreset,
    loadPreset,
    deletePreset,
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
