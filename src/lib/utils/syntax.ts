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

// Popular languages supported by Shiki
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'cpp',
  'c',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'sass',
  'json',
  'yaml',
  'xml',
  'markdown',
  'bash',
  'shell',
  'sql',
  'graphql',
  'dockerfile',
  'docker',
  'nginx',
  'apache',
  'diff',
  'git-commit',
  'git-rebase',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

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
  
  const displayNames: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    go: 'Go',
    rust: 'Rust',
    cpp: 'C++',
    c: 'C',
    csharp: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    swift: 'Swift',
    kotlin: 'Kotlin',
    scala: 'Scala',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    markdown: 'Markdown',
    bash: 'Bash',
    shell: 'Shell',
    sql: 'SQL',
    graphql: 'GraphQL',
    dockerfile: 'Dockerfile',
    docker: 'Docker',
    nginx: 'Nginx',
    apache: 'Apache',
    diff: 'Diff',
  };
  
  return displayNames[normalized] || normalized.toUpperCase();
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
