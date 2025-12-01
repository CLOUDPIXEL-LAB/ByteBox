# 📝 Changelog

All notable changes to **ByteBox** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-12-01

### 🚀 Major Release: Database-Backed Settings & Appearance Overhaul

This major release introduces full database persistence for all user settings, a comprehensive appearance customization system, and significant infrastructure upgrades including Prisma 7 and improved font handling.

### 🔧 Settings & Typography Fixes

#### Added
- **Database-Backed Settings Persistence** – All user settings now persist to SQLite database, not just localStorage
  - New `UserSettings` Prisma model stores all theme/appearance preferences
  - New `/api/settings` API route for GET/PATCH/PUT operations
  - Settings load from API on mount with localStorage as instant-hydration fallback
  - Debounced saves (500ms) prevent excessive API calls during rapid changes
  - Custom accent themes, presets, icon themes, backgrounds, and fonts all persist across sessions
- **Prisma 7 Upgrade** – Updated to Prisma 7.0.1 with better-sqlite3 adapter
  - Removed `url` from datasource block per Prisma 7 requirements
  - Configuration now handled via `prisma.config.ts`

#### Fixed
- **Font Selection Not Applying** – Fixed critical bug where UI and mono fonts wouldn't change
  - **Root Cause**: CSS variables like `var(--font-indie-flower)` are only defined on `<body>` via Next.js font classes, but data attributes were being set on `<html>` where those variables weren't accessible
  - **Solution 1**: Changed `applyFontConfig()` to set data attributes on `<body>` instead of `<html>` (documentElement)
  - **Solution 2**: Updated CSS selectors from `[data-ui-font="..."]` to `body[data-ui-font="..."]` so they have access to Next.js font variables
  - **Solution 3**: Added runtime resolution of computed font values using `getComputedStyle()` instead of passing `var()` references through JavaScript
  - Added proper fallback stacks to all font declarations in CSS
  - Fonts now switch correctly between all 17 UI fonts and 13 mono fonts including stylized options (Indie Flower, Permanent Marker, etc.)

#### Changed
- **ThemeContext Refactored** – Now loads settings from API on mount
  - Uses `useRef` for debounced save timeout management
  - New `settingsLoaded` state prevents saving before initial load completes
  - Syncs localStorage with API values for offline resilience
- **CSS Font Selectors** – All selectors now properly target `body` element
  - Added fallback font stacks to each selector for graceful degradation

#### Database Changes
- **UserSettings Model** – New singleton model for app-wide settings:
  - `mode` (dark/light), `accentThemeId`, `iconThemeId`, `customIconColor`
  - `glassIntensity`, `backgroundConfig` (JSON), `fontConfig` (JSON)
  - `customAccentThemes` (JSON array), `settingsPresets` (JSON array)
  - Uses fixed id "default" for singleton pattern
- **Migration** – `20251130033852_add_user_settings`

---

### 🎨 Appearance & Presets Revamp

#### Added
- **Background playground** – Solid color picker, 2–4 color custom gradients with angle control, and curated gradient presets.
- **Wallpaper library** – Built-in gradient wallpapers (no assets required) plus upload with live preview; unified reset that returns to the default glass backdrop.
- **Typography controls** – Independent UI and code fonts selectable from installed/preset stacks (Geist, Inter, JetBrains Mono, Fira Code, etc.).
- **Custom accent themes** – Build 2–6 color palettes, name them, save them alongside built-ins, and delete when no longer needed.
- **Settings presets** – Save the entire appearance state (mode, accents, icons, background, fonts, glass level, custom themes) as named profiles; apply or delete with one click.

#### Changed
- Background config now clears legacy uploads when switching away from images to prevent stale wallpapers overriding gradients/presets.
- Default wallpapers now ship as data-URI gradients so previews work without `/public/wallpapers` assets.

### 🎯 Customizable Dashboard Filters (Phase 3: ROADMAP)

#### Added
- **View Mode Selector** – Dropdown in dashboard header to switch between view modes
  - **All Cards** – Show all cards (default)
  - **Most Recent** – Cards sorted by newest first (by updatedAt/createdAt)
  - **Starred Only** – Show only favorited cards
  - **By Tag** – Filter by selected tags (auto-switches when tags selected)
- **ViewModeSelector Component** – New glassmorphic dropdown with icons and descriptions
  - Displays current view mode with icon
  - Shows keyboard shortcut hints in menu
  - Accent styling for active view mode
- **Clear Filters Button** – Red "Clear" button next to view selector
  - Appears when any filters are active
  - Resets view mode to "All Cards" and clears search/tags
- **Keyboard Shortcuts for View Modes** – Quick switching with `⌘1-4`
  - `⌘1` – All Cards
  - `⌘2` – Most Recent
  - `⌘3` – Starred Only
  - `⌘4` – By Tag
- **View Mode Persistence** – Selected view mode saved to localStorage
  - Key: `bytebox-view-mode`
  - Persists across sessions and page refreshes
- **Quick View Buttons in Filter Panel** – Grid of 4 buttons for quick mode switching
  - All, Recent, Starred, By Tag with icons
  - Matches current view mode styling

#### Fixed
- **Dropdown Transparency Nightmare** – Fixed ViewModeSelector dropdown being completely transparent and unreadable
  - **Root Cause**: Headless UI Menu.Items was inheriting `backdrop-filter: blur()` from parent `.glass` elements, causing the dropdown background to be transparent despite inline styles
  - **Initial Attempts Failed**: Tried numerous approaches including:
    - Inline styles with `!important` flags
    - CSS classes with z-index manipulation
    - `isolation: isolate` and `transform: translateZ(0)`
    - CSS variables and hardcoded colors
    - Opacity and background-color overrides
  - **Winning Solution**: Used React `createPortal()` to render Menu.Items directly into `document.body`
    - Completely escapes parent glass/backdrop-filter hierarchy in DOM tree
    - Menu.Items no longer inherits any transparency effects from ancestors
    - Used `fixed` positioning with dynamic calculations based on button position
    - Added `data-viewmode-button` attribute for position reference
    - Solid `#0f172a` background with proper borders and shadows
  - **Lessons Learned**: 
    - Backdrop-filter inheritance through component trees is extremely aggressive
    - CSS isolation techniques often fail with heavy blur effects
    - Portal rendering is the most reliable solution for escaping style inheritance
    - Always test dropdowns against glass/glassmorphic backgrounds during development
  - **Related Issue**: This is a known challenge with Headless UI + glassmorphism (see GitHub discussions #1346, #1541, #1925)
  - **Technical Details**:
    - Imported `createPortal` from `react-dom`
    - Used `Menu` render prop pattern with `open` state
    - Portal only mounts when dropdown is open (performance optimization)
    - Position calculated via `getBoundingClientRect()` on button element
    - Fallback to `typeof window !== 'undefined'` check for SSR safety

#### Changed
- **useSearch Hook** – Refactored to use ViewMode system
  - Added `viewMode` state with localStorage persistence
  - Added `setViewMode()` function for mode changes
  - Added `sortByRecent()` for Most Recent view
  - `showStarredOnly` is now computed from `viewMode === 'starred'`
  - Auto-switches to "By Tag" mode when selecting tags
  - `clearFilters()` now resets to "All Cards" view mode
- **AppLayout Component** – Added view mode props and keyboard shortcuts
  - `viewMode`, `onViewModeChange`, `hasActiveFilters`, `onClearFilters` props
  - Keyboard handler for `⌘1-4` shortcuts
  - Reduced search bar width to accommodate view selector
- **FilterPanel Component** – Enhanced with view mode controls
  - Quick view buttons grid
  - Updated keyboard shortcut hint for starred (`⌘3`)
- **Active Filters Badge** – Now shows view mode context
  - "(starred only)", "(most recent)", or "(n tags)" based on current mode

#### Technical Details
- New file: `src/components/ui/ViewModeSelector.tsx`
- Updated exports in `src/components/ui/index.ts`
- Type: `ViewMode = 'all' | 'recent' | 'starred' | 'by-tag'`
- localStorage key: `bytebox-view-mode`

---

## [1.4.0] - 2025-11-29

### ⭐ Starred/Favorited Cards (Phase 2: ROADMAP)

#### Added
- **Star Toggle on Cards** — Click the star icon on any card to mark it as a favorite
  - Outline star (empty) for unstarred cards
  - Solid amber star with glow effect for starred cards
  - Optimistic UI updates with loading state
  - Star button positioned in card header next to type badge
- **Starred Filter in Dashboard** — Filter to show only starred cards
  - Star button in header with badge showing starred count
  - Toggle button in Filter Panel sidebar with amber styling
  - Filter state persists across search and tag filters
- **Keyboard Shortcut** — Press `Cmd/Ctrl+Shift+S` to toggle starred filter
  - Uses Shift modifier to avoid conflict with browser save shortcut
- **Starred Count Badge** — Shows total number of starred cards in UI
  - Displayed on header star button
  - Displayed in Filter Panel starred toggle

#### Changed
- **Card Component** — Added `onStarToggle` prop for star functionality
  - Star icon from heroicons (outline and solid variants)
  - Amber color scheme (#fbbf24) with drop shadow
- **DraggableCard Component** — Passes `onStarToggle` to Card
- **DraggableBoard Component** — Added `onStarToggle` prop
- **AppLayout Component** — Added starred filter button in header
  - `showStarredOnly`, `onToggleStarred`, `starredCount` props
- **FilterPanel Component** — Added starred filter section
  - Toggle button with star icon and count
  - Keyboard shortcut hint (`⌘⇧S`)
- **useSearch Hook** — Extended with starred filtering
  - `showStarredOnly` state
  - `toggleStarredFilter()` function
  - `starredCount` computed value
  - Starred filter applied before search/tag filters

#### Database Changes
- **Card Model** — Added `starred Boolean @default(false)` field
- **Migration** — `20251129185730_add_starred_field`

#### API Updates
- **PATCH /api/cards/[id]** — New endpoint for toggling star
  - Accepts `{ action: 'toggleStar' }` body
  - Returns updated card with new starred status
- **Database Queries** — Added helper functions:
  - `toggleCardStarred(id)` — Toggle starred status
  - `getStarredCards()` — Fetch all starred cards

#### Technical Details
- Type updates:
  - Extended `Card` type with `starred: boolean`
  - Updated `toDomainCard()` mapping
- Component updates:
  - `Card.tsx`: Star toggle with loading state
  - `DraggableCard.tsx`: Prop threading
  - `DraggableBoard.tsx`: Prop threading
  - `AppLayout.tsx`: Header star button
  - `FilterPanel.tsx`: Starred section with styling
- Hook updates:
  - `useSearch.ts`: Starred filtering and count

### 📱 Roadmap Update

#### Added
- **Phase 6: Mobile App Layout** — Added comprehensive mobile responsive design phase to ROADMAP.md
  - Responsive sidebar with hamburger menu
  - Mobile-first card layouts (single/double column)
  - Swipe gestures for navigation
  - Bottom navigation component
  - Floating action button (FAB)
  - Touch-optimized modals (full-screen)
  - Pull-to-refresh functionality
  - Safe area insets for notched devices
  - Responsive breakpoint definitions (mobile/tablet/desktop)

### 📄 File Upload for Documentation (Phase 1: ROADMAP)

#### Added
- **Documentation File Upload** – Upload .md and .pdf files to Documentation cards
  - Supports Markdown (.md) and PDF (.pdf) files
  - 10MB file size limit with validation
  - Base64 file storage in database
  - PDF text extraction with `pdf-parse` library
  - Searchable extracted text stored in `content` field
  - File metadata tracking (fileName, fileType, fileSize)
  - Drag-and-drop and click-to-upload UI
  - File preview card with icon, name, size, and text preview
  - Download button for retrieving original files
  - Client-side file processing utilities
  - Optional: Manual text entry if no file uploaded

#### Changed
- **Card Database Schema** – Added file fields to Card model:
  - `fileData String?` – Base64-encoded file data
  - `fileName String?` – Original filename
  - `fileType String?` – MIME type (application/pdf, text/markdown)
  - `fileSize Int?` – File size in bytes
- **CreateCardModal** – Enhanced doc card creation:
  - File upload zone with drag-drop for documentation
  - File metadata display with icon and preview
  - Fallback to manual text entry if no file
  - File type validation and error handling
- **Card Display** – File attachment preview:
  - Shows file icon, name, type, and size
  - Download button (ArrowDownTrayIcon) to save original file
  - Text preview snippet from extracted content
  - Matches existing image card layout pattern

#### Fixed
- **PDF Text Extraction** – Fixed `pdf-parse` module loading and usage errors
  - **Issue 1**: Corrected dynamic import to use `PDFParse` named export from v2.4.5+
    - Switched from synchronous `require()` to async `import()` with proper module handling
    - Resolved "parser is not a function" runtime error
  - **Issue 2**: Fixed PDFParse constructor instantiation
    - Constructor requires `LoadParameters` object with `data` field (buffer) and `verbosity` option
    - Use `getText()` method (not `parse()`) to extract text from PDF
    - `TextResult` returned has `text` property with full extracted content
    - Call `parser.destroy()` to clean up resources after extraction
    - Resolved "Cannot read properties of undefined (reading 'verbosity')" error
  - **Issue 3**: Configured PDF.js worker for client-side parsing
    - PDF.js (used by pdf-parse) requires `GlobalWorkerOptions.workerSrc` to be set
    - Added `PDFParse.setWorker()` call with CDN URL for browser environment
    - Worker configured once on first load to avoid multiple initializations
    - **CDN Version Workaround**: pdf-parse uses pdfjs-dist v5.4.296, but CDN only has v5.4.149
    - Using closest available CDN version: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs`
    - Minor version difference (149 vs 296) appears compatible for basic text extraction
    - If issues arise, will need to bundle worker locally from node_modules
    - Resolved "No 'GlobalWorkerOptions.workerSrc' specified" and CDN 404 errors
  - Graceful fallback to empty string if parsing fails (user can manually enter content)

#### Technical Details
- New files created:
  - `src/lib/utils/fileUtils.ts` (188 lines) – File processing utilities
- Database migration:
  - Added file fields to Card model
  - Migration: `20251025005336_add_file_upload_support`
- Dependencies:
  - `pdf-parse` v1.1.1 – PDF text extraction (13 packages)
- API updates:
  - Updated POST `/api/cards` to handle file fields
  - `createCardWithTags()` now accepts fileData parameters
- Component updates:
  - `CreateCardModal.tsx`: File upload UI for doc type
  - `Card.tsx`: File attachment display with download
- File utilities:
  - `validateDocFile()` – Type & size validation
  - `processDocFile()` – Extract text & convert to base64
  - `extractPdfText()` – PDF parsing with lazy load
  - `extractMarkdownText()` – UTF-8 markdown reading
  - `downloadFile()` – Save original file to disk
  - `formatFileSize()` – Human-readable sizes
  - `getFileIcon()` – Emoji icons (📕 PDF, 📝 Markdown)

### 📝 Notes Category

#### Added
- **Notes Category** – New sixth category for quick thoughts and ideas
  - Purple color scheme (#a855f7)
  - 📝 Note card type with PencilSquareIcon
  - Auto-categorization for note cards
  - Example note card in seed data

#### Fixed
- **Images Category Placeholder** – Added proper base64-encoded gradient image
  - Pink/purple gradient placeholder (400x300 PNG)
  - Ensures Images category is not empty on fresh install
  - Empty state "Add your first card" buttons confirmed functional

### 🛠️ Dashboard Modal

#### Fixed
- **Lingering Overlay** – Closing a card modal now removes the dark backdrop so the dashboard stays bright and interactive.
  - `CardModal` mounts at the page root instead of inside an extra full-screen `<aside>` wrapper.
  - Added a short post-close timeout that clears `selectedCard`, ensuring Headless UI tears down its backdrop before we unmount the modal.

---

## [1.2.0] - 2025-10-24

### 🖼️ Image/Screenshot Cards & Enhanced UX

#### Added
- **Image Card Type** – New card type for saving photos and screenshots
  - Base64 image storage in database (`imageData` field)
  - Image compression and resizing (max 1920×1920, 85% quality, 5MB limit)
  - Support for PNG, JPEG, WebP, and GIF formats
  - Drag-and-drop image upload with preview
  - Auto-categorization to "Images" category
- **Images Category** – Dedicated fifth category on dashboard
  - Positioned next to Documentation category
  - Consistent 340px column width across all categories
  - Placeholder image card included
  - Functional + button for quick image additions
- **Lightbox Preview** – Full-screen image viewer
  - Glass-styled modal with backdrop blur
  - Download image button (saves original filename)
  - Copy to clipboard button (auto-converts JPEG to PNG)
  - ESC key support for quick closing
  - Displays image title in header
- **Copy Functionality** – One-click content copying
  - Copy button on all text-based cards (bookmarks, snippets, commands, docs)
  - Visual feedback ("Copy" → "Copied!" with 2-second timeout)
  - Uses Clipboard API for reliable copying
  - Icon: `ClipboardIcon` from heroicons
- **Delete Functionality** – Safe card deletion
  - Delete button in CardModal footer (red trash icon)
  - Two-step confirmation dialog prevents accidental deletions
  - "Delete this card?" prompt with "Yes, delete" and "Cancel" buttons
  - Auto-refreshes board after deletion
  - Confirmation state resets when modal closes or different card opens

#### Changed
- **Category Column Widths** – All categories now use consistent 340px fixed width
- **CardModal Layout** – Reorganized footer into two sections:
  - Left: Delete button with confirmation UI
  - Right: Copy button, Visit Link (bookmarks), Close button
- **CreateCardModal** – Removed category dropdown (auto-selects based on card type)
- **Auto-Category Mapping** – Card types automatically route to correct categories:
  - `bookmark` → Bookmarks
  - `snippet` → Code Snippets
  - `command` → Commands
  - `doc` → Documentation
  - `image` → Images

#### Fixed
- **JPEG Clipboard Issue** – JPEG images now convert to PNG for clipboard compatibility
  - Uses canvas-based conversion before clipboard write
  - Clipboard API only supports PNG format
  - Original JPEG storage preserved (conversion only for clipboard)
- **Delete Confirmation Persistence** – Confirmation dialog now resets properly
  - Fixed state leak between different cards
  - `useEffect` resets `showDeleteConfirm` when modal closes or card changes
- **Image Display** – Images now render as thumbnails with lightbox trigger
  - Thumbnail max height: 256px (16rem)
  - Click to open full-screen lightbox
  - Removed text-only display of filenames

#### Technical Details
- New files created:
  - `src/lib/utils/imageUtils.ts` (173 lines) – Image processing utilities
  - `src/components/ui/Lightbox.tsx` (181 lines) – Glass lightbox modal
- Database migration:
  - Added `imageData String?` field to Card model
  - Migration: `20251024195709_add_image_support`
- API updates:
  - Updated POST `/api/cards` to handle imageData
  - Existing DELETE `/api/cards/[id]` used for card deletion
- Component updates:
  - `CardModal.tsx`: Added copy, delete, and state management
  - `Card.tsx`: Image rendering with thumbnail and lightbox
  - `CreateCardModal.tsx`: Image upload UI with drag-drop
  - `DraggableBoard.tsx`: Fixed column widths
- Type system:
  - Added `'image'` to `CardType` union
  - Extended `Card` interface with `imageData?: string`
- Image processing:
  - `processImage()` – Compress & resize with quality control
  - `validateImageFile()` – Type & size validation
  - `downloadImage()` – Save to disk with original name
  - `copyImageToClipboard()` – Clipboard write with PNG conversion

---

## [1.1.0] - 2025-10-24

### 🌌 Neon Glass Redesign & Theme Engine

#### Added
- **Glass Transparency Slider** – Users can fine-tune the translucency of the interface, from airy to fully frosted, with instant updates across dark and light modes.
- **Glassmorphic Shell** – Rebuilt the entire UI chrome (sidebar, header, cards, modals, filter panels) using a reusable `glass` utility with density variants, blurred backdrops, and accent-aware tinting.
- **Theme Registry** – Centralized `accentThemes` and `iconThemes` palettes (`src/lib/themeRegistry.ts`) providing curated presets (Byte Classic, Neon Night, Rainbow Sprint, Midnight Carbon, Sunset Espresso, Pastel Haze, and more).
- **Dynamic Icon Palettes** – Each icon theme exposes deterministic color helpers via `useTheme()` so icons, badges, and statistics pick consistent neon hues.
- **Wallpaper Controls** – Added optional wallpaper uploader with preview and one-click reset inside Settings, persisting data URLs in localStorage.
- **Custom Icon Color Picker** – When the “Custom Single” icon theme is active, users can pick any hex color which instantly propagates across the interface.
- **JetBrains Mono Branding** – Introduced a dedicated Dev/Nerd logotype using JetBrains Mono for the ByteBox wordmark in the sidebar.

#### Changed
- **Theme Provider** – Rewrote `ThemeContext` to initialize from localStorage post-hydration, push accent/icon variables into CSS, and support wallpaper tinting without SSR mismatches.
- **Global Tokens** – Expanded `globals.css` with shared CSS variables (`--accent-*`, `--icon-*`, `--glass-*`) and helper classes (`surface-card`, `accent-gradient`, `font-brand`).
- **App Layout** – Sidebar widened to 18rem, navigation buttons restyled with glass panels, animated accent indicator, and gradient quick-add button; header now pulses with the active accent palette. Export/Import controls now use slim glass tiles so the sidebar stays compact.
- **Cards & Columns** – Card surfaces use glass density, monochrome badges give way to accent-aware borders, draggables inherit palette-driven shadows, and column headers pick up category color tints.
- **Search & Tags** – Search filters, tag stats, empty states, and loaders now mirror the new theme system with accent gradients and icon palette usage.
- **Settings Experience** – Redesigned Settings page to showcase accent/icon themes, wallpaper management, and the updated appearance controls. Theme mode is now toggled exclusively via the icon button, and glass intensity has its own slider with contextual guidance.

#### Fixed
- **Hydration Stability** – Theme state now hydrates identically on server/client with hidden pre-mount shell, eliminating mismatched inline styles when switching palettes.
- **Wallpaper Reset** – Added explicit “Reset background” action so user-uploaded wallpapers can be removed without replacing files.

### 📎 Documentation
- Updated `README.md`, `OVERVIEW.md`, and `glass_theming_guide.md` to document the glass system, theme registry, accent/icon presets, wallpaper uploader, and new layout visuals.
- Logged the redesign details and new customization workflow in this changelog.

---

## [1.0.1] - 2025-10-24

### 🎨 UI Polish & Bug Fixes

#### Changed
- **Sidebar Header Cleanup**
  - Removed "by Pink Pixel" subtitle for cleaner look
  - Removed user avatar placeholder
  - Increased logo size from `w-8 h-8` to `w-10 h-10`
  - Increased "ByteBox" title from `text-lg` to `text-xl`
- **Button Color Consistency**
  - Updated all primary action buttons to consistent darker pink (`bg-pink-600 hover:bg-pink-700`)
  - Applied to: Quick Add, Import Data, Search filters, Tag sorting, Create Card modal
  - Exception: Clear All Data button kept as red for safety indication

#### Added
- **Missing Pages**
  - Created comprehensive Settings page with theme toggle, data management, and about section
  - Created Search page with advanced filtering (All/Title/Content/Tags) and tag-based search
  - Created Tags page with statistics dashboard and tag management
- **Quick Add Feature**
  - Implemented full Quick Add functionality from sidebar
  - Quick Add button opens CreateCardModal on Dashboard
  - Quick Add on other pages directs users to Dashboard with helpful message
  - Added + buttons to category column headers with pre-selection
- **Card Creation System**
  - Built CreateCardModal component with comprehensive form
  - Support for 4 card types: Bookmark, Snippet, Command, Doc
  - Language dropdown with 13 programming languages
  - Tag multi-select with inline tag creation
  - Category pre-selection when clicking column + buttons
  - Full validation and error handling

#### Fixed
- **Hydration Mismatch Error**
  - Added `suppressHydrationWarning` to html and body tags
  - Prevented flash of unstyled content on theme load
  - Fixed browser extension attribute conflicts
- **Type Safety**
  - Removed all `any` types, replaced with proper TypeScript interfaces
  - Fixed Card component type compatibility across pages
  - Added proper type guards and null handling
  - All TypeScript compilation errors resolved
- **Code Quality**
  - Fixed all ESLint errors (only minor unused import warnings remain)
  - Used `useCallback` for performSearch to avoid unnecessary re-renders
  - Fixed ThemeContext setState-in-effect warning with proper initialization
  - Project builds successfully with `npm run build`

#### Technical Details
- New files created:
  - `src/app/settings/page.tsx` (241 lines)
  - `src/app/search/page.tsx` (242 lines)
  - `src/app/tags/page.tsx` (243 lines)
  - `src/components/cards/CreateCardModal.tsx` (384 lines)
- Database helper functions:
  - Added `createCardWithTags()` for atomic card creation with tags
  - Added `deleteAllData()` for safe data clearing in Settings
- API enhancements:
  - Updated POST `/api/cards` to handle tag creation
  - Added DELETE `/api/cards` endpoint for data clearing

---

## [1.0.0] - 2025-01-29

### 🎉 Initial Release

The first public release of **ByteBox** — a lightweight web dashboard for developer resources!

### ✨ Added

#### Core Features
- **Kanban-Style Boards** — Organize resources into customizable categories
- **Smart Tagging System** — Add multiple tags to cards with color-coded filtering
- **Lightning-Fast Search** — Global search with `Cmd/Ctrl+K` keyboard shortcut
- **Drag & Drop** — Reorder cards and move them between categories seamlessly
- **CRUD Operations** — Create, read, update, and delete cards with modal interface
- **Syntax Highlighting** — Code blocks with 35+ languages powered by Shiki
- **Copy-to-Clipboard** — One-click copying for code snippets

#### Database & Backend
- **SQLite Database** — Fast local storage with Prisma ORM
- **API Routes** — RESTful endpoints for cards, export, and import
- **Seed Data** — Example cards and categories for quick start
- **Data Validation** — Input validation and error handling

#### UI/UX
- **Dark Mode First** — Beautiful dark theme by default
- **Light Mode** — Optional light theme with theme toggle
- **Theme Persistence** — Theme preference saved to localStorage
- **System Detection** — Respects OS theme preference
- **Pink Pixel Branding** — Pink/purple gradient accents (#ec4899 → #8b5cf6)
- **Responsive Design** — Mobile-friendly layout
- **Smooth Animations** — Tailwind CSS transitions and hover effects

#### Search & Filtering
- **Full-Text Search** — Search across titles, descriptions, tags, and content
- **Tag Filtering** — Filter by one or multiple tags
- **AND/OR Logic** — Toggle between inclusive (OR) and exclusive (AND) filtering
- **Real-Time Results** — Instant search results as you type

#### Export/Import
- **Export Data** — Download all data as JSON backup
- **Import Data** — Restore data from JSON file
- **Validation** — Import validation with error messages
- **Merge Logic** — Import merges data instead of replacing

#### Developer Experience
- **Next.js 16** — Modern React framework with App Router
- **TypeScript 5** — Full type safety
- **Tailwind CSS 4.1.16** — Utility-first styling
- **Prisma 6.18.0** — Next-gen ORM
- **@dnd-kit** — Accessible drag-and-drop library
- **Headless UI** — Accessible UI components

### 🛠️ Technical Details

#### Dependencies
- `next`: 16.0.0
- `react`: 19.2.0
- `typescript`: ^5
- `tailwindcss`: ^4.1.16
- `@prisma/client`: ^6.18.0
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `@headlessui/react`: ^2.2.0
- `@heroicons/react`: ^2.2.0
- `shiki`: ^1.26.0

#### Database Schema
- **Category** — Organizing containers (e.g., React, APIs, Commands)
- **Tag** — Metadata labels (e.g., hooks, typescript, frontend)
- **Card** — Individual resource items with title, description, content, tags, and optional syntax highlighting

#### Project Structure
- `/src/app` — Next.js App Router pages and API routes
- `/src/components` — Reusable React components
- `/src/contexts` — React contexts (ThemeContext)
- `/src/hooks` — Custom React hooks (useSearch)
- `/src/lib` — Utilities, database helpers, and Prisma client
- `/src/types` — TypeScript type definitions
- `/prisma` — Database schema, migrations, and seed script

### 📚 Documentation
- **README.md** — Comprehensive setup and usage guide
- **CONTRIBUTING.md** — Contribution guidelines
- **LICENSE** — Apache License 2.0
- **OVERVIEW.md** — Project architecture and structure
- **ROADMAP.md** — Development plan and completed tasks

### 🎨 Design System
- **Colors** — Pink (#ec4899) and purple (#8b5cf6) gradients
- **Typography** — System fonts with proper hierarchy
- **Spacing** — Tailwind CSS spacing scale
- **Shadows** — Subtle elevation with colored shadows
- **Animations** — Smooth transitions and hover effects

---

## [How to Update]

### From 0.x.x to 1.0.0
This is the initial release. No migration required!

---

## [Contributors]

**Made with ❤️ by [Pink Pixel](https://pinkpixel.dev)**

- **Author**: Pink Pixel
- **Website**: [pinkpixel.dev](https://pinkpixel.dev)
- **GitHub**: [@pinkpixel-dev](https://github.com/pinkpixel-dev)
- **Discord**: @sizzlebop
- **Email**: admin@pinkpixel.dev

**Dream it, Pixel it** ✨

---

_For detailed changes and commit history, see the [GitHub repository](https://github.com/your-username/bytebox)._
