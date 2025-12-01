export type AccentTheme = {
  id: string;
  name: string;
  description: string;
  palette: string[];
  highlight?: string;
  glassTint?: string;
  isUserCreated?: boolean;
};

export type IconTheme = {
  id: string;
  name: string;
  description: string;
  palette: string[];
  userAdjustable?: boolean;
};

export type GradientPreset = {
  id: string;
  name: string;
  colors: string[];
  angle: number;
};

export type BackgroundType = 'solid' | 'gradient' | 'image' | 'default';

export type BackgroundConfig = {
  type: BackgroundType;
  solidColor?: string;
  gradientColors?: string[];
  gradientAngle?: number;
  imageUrl?: string;
  presetWallpaper?: string;
};

export type FontConfig = {
  uiFont: string;
  monoFont: string;
};

export type SettingsPreset = {
  id: string;
  name: string;
  createdAt: number;
  mode: 'dark' | 'light';
  accentThemeId: string;
  iconThemeId: string;
  customIconColor: string;
  glassIntensity: number;
  background: BackgroundConfig;
  fonts: FontConfig;
  customAccentThemes?: AccentTheme[];
};

// Preset gradient backgrounds
export const gradientPresets: GradientPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    colors: ['#0f0c29', '#302b63', '#24243e'],
    angle: 135,
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    colors: ['#ff6b6b', '#feca57', '#ff9ff3'],
    angle: 120,
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    colors: ['#0a1628', '#1e3a5f', '#2d5a7b'],
    angle: 180,
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    colors: ['#134e5e', '#71b280'],
    angle: 135,
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    colors: ['#0f0f1a', '#2d1b4e', '#4a1942'],
    angle: 145,
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    colors: ['#1a1a2e', '#16213e', '#0f3460'],
    angle: 160,
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    colors: ['#2c1810', '#4a2c2a', '#654321'],
    angle: 135,
  },
  {
    id: 'cyber-pink',
    name: 'Cyber Pink',
    colors: ['#0d0d0d', '#1a0a1a', '#2d0a2d', '#ff0080'],
    angle: 150,
  },
];

// Built-in wallpaper options (actual images from /public/wallpapers)
export const defaultWallpapers = [
  {
    id: 'abstract-mesh',
    name: 'Abstract Mesh',
    preview: 'url(/wallpapers/abstract_mesh.png)',
    url: '/wallpapers/abstract_mesh.png',
  },
  {
    id: 'circuitry',
    name: 'Circuitry',
    preview: 'url(/wallpapers/circuitry.png)',
    url: '/wallpapers/circuitry.png',
  },
  {
    id: 'geometric-dark',
    name: 'Geometric Dark',
    preview: 'url(/wallpapers/geometric_dark.png)',
    url: '/wallpapers/geometric_dark.png',
  },
  {
    id: 'minimal-grid',
    name: 'Minimal Grid',
    preview: 'url(/wallpapers/minimal_grid.png)',
    url: '/wallpapers/minimal_grid.png',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    preview: 'url(/wallpapers/mountains.png)',
    url: '/wallpapers/mountains.png',
  },
  {
    id: 'neon-rainbow',
    name: 'Neon Rainbow',
    preview: 'url(/wallpapers/neon_rainbow.png)',
    url: '/wallpapers/neon_rainbow.png',
  },
  {
    id: 'pixel-pink',
    name: 'Pixel Pink',
    preview: 'url(/wallpapers/pixel_pink.png)',
    url: '/wallpapers/pixel_pink.png',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    preview: 'url(/wallpapers/rainbow.png)',
    url: '/wallpapers/rainbow.png',
  },
  {
    id: 'retro-tech',
    name: 'Retro Tech',
    preview: 'url(/wallpapers/retro_tech.png)',
    url: '/wallpapers/retro_tech.png',
  },
  {
    id: 'starfield',
    name: 'Starfield',
    preview: 'url(/wallpapers/starfield.png)',
    url: '/wallpapers/starfield.png',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: 'url(/wallpapers/sunset.png)',
    url: '/wallpapers/sunset.png',
  },
  {
    id: 'waves',
    name: 'Waves',
    preview: 'url(/wallpapers/waves.png)',
    url: '/wallpapers/waves.png',
  },
];

// Available UI fonts (using CSS variables from next/font/google)
export const availableFonts = [
  { id: 'system', name: 'System Default', value: 'system-ui, -apple-system, sans-serif' },
  { id: 'inter', name: 'Inter', value: 'var(--font-inter), system-ui, sans-serif' },
  { id: 'geist', name: 'Geist Sans', value: 'var(--font-geist-sans), system-ui, sans-serif' },
  { id: 'roboto', name: 'Roboto', value: 'var(--font-roboto), system-ui, sans-serif' },
  { id: 'open-sans', name: 'Open Sans', value: 'var(--font-open-sans), system-ui, sans-serif' },
  { id: 'poppins', name: 'Poppins', value: 'var(--font-poppins), system-ui, sans-serif' },
  { id: 'lato', name: 'Lato', value: 'var(--font-lato), system-ui, sans-serif' },
  { id: 'nunito', name: 'Nunito', value: 'var(--font-nunito), system-ui, sans-serif' },
  { id: 'source-sans', name: 'Source Sans Pro', value: 'var(--font-source-sans), system-ui, sans-serif' },
  { id: 'ubuntu', name: 'Ubuntu', value: 'var(--font-ubuntu), system-ui, sans-serif' },
  { id: 'shadows-into-light', name: 'Shadows Into Light', value: 'var(--font-shadows-into-light), cursive' },
  { id: 'indie-flower', name: 'Indie Flower', value: 'var(--font-indie-flower), cursive' },
  { id: 'permanent-marker', name: 'Permanent Marker', value: 'var(--font-permanent-marker), cursive' },
  { id: 'caveat-brush', name: 'Caveat Brush', value: 'var(--font-caveat-brush), cursive' },
  { id: 'gochi-hand', name: 'Gochi Hand', value: 'var(--font-gochi-hand), cursive' },
  { id: 'delius', name: 'Delius', value: 'var(--font-delius), cursive' },
  { id: 'acme', name: 'Acme', value: 'var(--font-acme), sans-serif' },
];

// Available mono fonts for code blocks (using CSS variables from next/font/google)
export const availableMonoFonts = [
  { id: 'geist-mono', name: 'Geist Mono', value: 'var(--font-geist-mono), monospace' },
  { id: 'jetbrains', name: 'JetBrains Mono', value: 'var(--font-jetbrains-mono), monospace' },
  { id: 'fira-code', name: 'Fira Code', value: 'var(--font-fira-code), monospace' },
  { id: 'source-code', name: 'Source Code Pro', value: 'var(--font-source-code-pro), monospace' },
  { id: 'roboto-mono', name: 'Roboto Mono', value: 'var(--font-roboto-mono), monospace' },
  { id: 'ubuntu-mono', name: 'Ubuntu Mono', value: 'var(--font-ubuntu-mono), monospace' },
  { id: 'consolas', name: 'Consolas', value: '"Consolas", monospace' },
  { id: 'menlo', name: 'Menlo', value: '"Menlo", monospace' },
  { id: 'monaco', name: 'Monaco', value: '"Monaco", monospace' },
  { id: 'space-mono', name: 'Space Mono', value: 'var(--font-space-mono), monospace' },
  { id: 'syne-mono', name: 'Syne Mono', value: 'var(--font-syne-mono), monospace' },
  { id: 'nova-mono', name: 'Nova Mono', value: 'var(--font-nova-mono), monospace' },
  { id: 'kode-mono', name: 'Kode Mono', value: 'var(--font-kode-mono), monospace' },
];

export const defaultFontConfig: FontConfig = {
  uiFont: 'system',
  monoFont: 'geist-mono',
};

export const defaultBackgroundConfig: BackgroundConfig = {
  type: 'default',
};

export const accentThemes: AccentTheme[] = [
  {
    id: 'byte-classic',
    name: 'Byte Classic',
    description: 'ByteBox original pink & violet glow',
    palette: ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'],
    highlight: '#f72585',
    glassTint: 'rgba(247, 37, 133, 0.12)',
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    description: 'Pink pulse with neon cyan, lime, yellow, orange, and purple',
    palette: ['#ff2d96', '#00f5ff', '#39ff14', '#faff00', '#ff7f11', '#d100ff'],
    highlight: '#ff2d96',
    glassTint: 'rgba(255, 45, 150, 0.12)',
  },
  {
    id: 'rainbow-sprint',
    name: 'Rainbow Sprint',
    description: 'High-energy rainbow spectrum for playful dashboards',
    palette: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'],
    highlight: '#ff595e',
    glassTint: 'rgba(255, 89, 94, 0.12)',
  },
  {
    id: 'midnight-carbon',
    name: 'Midnight Carbon',
    description: 'Saturated teals and violets with a deep carbon accent',
    palette: ['#0ff4c6', '#00c2ff', '#8464ff', '#2f3545', '#1e1e2f'],
    highlight: '#0ff4c6',
    glassTint: 'rgba(15, 244, 198, 0.12)',
  },
  {
    id: 'sunset-espresso',
    name: 'Sunset Espresso',
    description: 'Warm amber, magenta, and espresso browns for moody cards',
    palette: ['#f97316', '#facc15', '#f472b6', '#b45309', '#3f2e1d'],
    highlight: '#f97316',
    glassTint: 'rgba(249, 115, 22, 0.12)',
  },
  {
    id: 'pastel-haze',
    name: 'Pastel Haze',
    description: 'Soft neon pastels for lighter focus rings and highlights',
    palette: ['#f7aef8', '#b388eb', '#8093f1', '#72ddf7', '#b5fffc'],
    highlight: '#f7aef8',
    glassTint: 'rgba(247, 174, 248, 0.12)',
  },
];

export const iconThemes: IconTheme[] = [
  {
    id: 'pink-pulse',
    name: 'Pink Pulse',
    description: 'A monochromatic pink stack inspired by the original UI',
    palette: ['#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d'],
  },
  {
    id: 'neon-grid',
    name: 'Neon Grid',
    description: 'Vibrant neon selection to match the Neon Night palette',
    palette: ['#ff00ff', '#00eaff', '#39ff14', '#fffb00', '#ff5f1f', '#9d4edd'],
  },
  {
    id: 'rainbow-loop',
    name: 'Rainbow Loop',
    description: 'A looping rainbow spectrum with consistent contrast',
    palette: ['#ff6f61', '#f7b32b', '#2ec4b6', '#3a86ff', '#8338ec', '#ff006e'],
  },
  {
    id: 'carbon-tech',
    name: 'Carbon Tech',
    description: 'Cool cyan, teal, and violet for cyberpunk cards',
    palette: ['#64dfdf', '#48bfe3', '#5e60ce', '#7400b8', '#6930c3'],
  },
  {
    id: 'espresso-circuit',
    name: 'Espresso Circuit',
    description: 'Warm oranges and magentas on top of coffee browns',
    palette: ['#ff9f1c', '#ffbf69', '#f15bb5', '#c9184a', '#582f0e'],
  },
  {
    id: 'custom-single',
    name: 'Custom Single',
    description: 'Pick your own icon color and keep it consistent everywhere',
    palette: ['#f472b6'],
    userAdjustable: true,
  },
];

// Custom accent theme with multi-color support
export const createCustomAccentTheme = (
  id: string,
  name: string,
  colors: string[]
): AccentTheme => ({
  id,
  name,
  description: `Custom theme: ${name}`,
  palette: colors.slice(0, 6),
  highlight: colors[0],
  glassTint: `${colors[0]}1a`,
  isUserCreated: true,
});

export const DEFAULT_ACCENT_THEME_ID = 'byte-classic';
export const DEFAULT_ICON_THEME_ID = 'neon-grid';
export const DEFAULT_UI_FONT = 'system';
export const DEFAULT_MONO_FONT = 'geist-mono';
