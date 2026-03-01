/**
 * ByteBox - Syntax Highlighting Utilities
 * Made with ❤️ by Pink Pixel
 */

// Common language mappings and aliases
export const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  dockerfile: 'docker',
};

// Languages available in the dropdown, with display names
// These are all bundled with Shiki and safe to use
export const LANGUAGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'dart', label: 'Dart' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'erlang', label: 'Erlang' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'lua', label: 'Lua' },
  { value: 'perl', label: 'Perl' },
  { value: 'r', label: 'R' },
  { value: 'julia', label: 'Julia' },
  { value: 'ocaml', label: 'OCaml' },
  { value: 'fsharp', label: 'F#' },
  { value: 'zig', label: 'Zig' },
  { value: 'nim', label: 'Nim' },
  { value: 'odin', label: 'Odin' },
  { value: 'v', label: 'V' },
  { value: 'crystal', label: 'Crystal' },
  { value: 'd', label: 'D' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sass', label: 'Sass' },
  { value: 'less', label: 'Less' },
  { value: 'stylus', label: 'Stylus' },
  { value: 'json', label: 'JSON' },
  { value: 'jsonc', label: 'JSONC' },
  { value: 'json5', label: 'JSON5' },
  { value: 'yaml', label: 'YAML' },
  { value: 'toml', label: 'TOML' },
  { value: 'xml', label: 'XML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'mdx', label: 'MDX' },
  { value: 'latex', label: 'LaTeX' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'fish', label: 'Fish' },
  { value: 'zsh', label: 'Zsh' },
  { value: 'bat', label: 'Batch' },
  { value: 'nushell', label: 'Nushell' },
  { value: 'sql', label: 'SQL' },
  { value: 'plsql', label: 'PL/SQL' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'apache', label: 'Apache' },
  { value: 'terraform', label: 'Terraform' },
  { value: 'hcl', label: 'HCL' },
  { value: 'nix', label: 'Nix' },
  { value: 'prisma', label: 'Prisma' },
  { value: 'protobuf', label: 'Protobuf' },
  { value: 'cmake', label: 'CMake' },
  { value: 'make', label: 'Makefile' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'astro', label: 'Astro' },
  { value: 'handlebars', label: 'Handlebars' },
  { value: 'pug', label: 'Pug' },
  { value: 'twig', label: 'Twig' },
  { value: 'erb', label: 'ERB' },
  { value: 'blade', label: 'Blade' },
  { value: 'objective-c', label: 'Objective-C' },
  { value: 'groovy', label: 'Groovy' },
  { value: 'pascal', label: 'Pascal' },
  { value: 'cobol', label: 'COBOL' },
  { value: 'ada', label: 'Ada' },
  { value: 'prolog', label: 'Prolog' },
  { value: 'scheme', label: 'Scheme' },
  { value: 'racket', label: 'Racket' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'move', label: 'Move' },
  { value: 'wgsl', label: 'WGSL' },
  { value: 'glsl', label: 'GLSL' },
  { value: 'hlsl', label: 'HLSL' },
  { value: 'wasm', label: 'WebAssembly' },
  { value: 'regex', label: 'Regex' },
  { value: 'diff', label: 'Diff' },
  { value: 'git-commit', label: 'Git Commit' },
  { value: 'git-rebase', label: 'Git Rebase' },
  { value: 'ini', label: 'INI' },
  { value: 'csv', label: 'CSV' },
  { value: 'dotenv', label: 'dotenv' },
  { value: 'log', label: 'Log' },
  { value: 'http', label: 'HTTP' },
  { value: 'ssh-config', label: 'SSH Config' },
  { value: 'gdscript', label: 'GDScript' },
  { value: 'mojo', label: 'Mojo' },
  { value: 'gleam', label: 'Gleam' },
  { value: 'typst', label: 'Typst' },
];

// Flat list of supported language values for validation
export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS.map(l => l.value);

export type SupportedLanguage = string;

/**
 * Normalize a language identifier
 * Handles common aliases and returns a valid Shiki language
 */
export function normalizeLanguage(lang: string): string {
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_MAP[normalized] || normalized;
}

/**
 * Check if a language is supported
 */
export function isSupportedLanguage(lang: string): boolean {
  const normalized = normalizeLanguage(lang);
  return SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage);
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(lang: string): string {
  const normalized = normalizeLanguage(lang);
  const option = LANGUAGE_OPTIONS.find(l => l.value === normalized);
  return option?.label || normalized.toUpperCase();
}

/**
 * Detect language from filename extension
 */
export function detectLanguageFromFilename(filename: string): string | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  
  const extensionMap: Record<string, string> = {
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    sql: 'sql',
    graphql: 'graphql',
    gql: 'graphql',
  };
  
  return extensionMap[ext] || null;
}
