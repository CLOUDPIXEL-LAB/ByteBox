-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "mode" TEXT NOT NULL DEFAULT 'dark',
    "accentThemeId" TEXT NOT NULL DEFAULT 'byte-classic',
    "iconThemeId" TEXT NOT NULL DEFAULT 'neon-grid',
    "customIconColor" TEXT NOT NULL DEFAULT '#f472b6',
    "glassIntensity" INTEGER NOT NULL DEFAULT 60,
    "backgroundConfig" TEXT NOT NULL DEFAULT '{"type":"default"}',
    "fontConfig" TEXT NOT NULL DEFAULT '{"uiFont":"system","monoFont":"geist-mono"}',
    "customAccentThemes" TEXT NOT NULL DEFAULT '[]',
    "settingsPresets" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
