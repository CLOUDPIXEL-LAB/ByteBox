# ByteBox Development Roadmap 🗺️

**Last Updated:** December 1, 2025  
**Current Version:** 2.1.0  
**Next Version:** 2.2.0 (Planned - Phase 4)  
**Status:** 🚀 Active Development

---

## 🎯 Project Vision

ByteBox is a **developer's personal command center** - a beautiful, glassmorphic dashboard for organizing bookmarks, code snippets, commands, documentation, screenshots, and quick notes. Think Trello meets your browser's bookmark bar, but way more powerful and customizable.

---

## ✅ Completed Features (v1.0.0 - v2.1.0)

### Core Foundation ✨
- [x] **Next.js 16.0.6** with App Router & React 19.2.0
- [x] **TypeScript 5.9.x** with strict type checking
- [x] **Tailwind CSS 4.x** utility-first styling
- [x] **Prisma 7.0.1** ORM with SQLite database (better-sqlite3 adapter)
- [x] **@dnd-kit** drag-and-drop system
- [x] **Shiki 3.17.0** syntax highlighting (35+ languages)

### Dashboard & Organization 📦
- [x] **6 Category System** (Bookmarks, Code Snippets, Commands, Documentation, Images, Notes)
- [x] **Responsive Kanban Boards** with CSS Grid columns that stretch to fill viewport
- [x] **Drag & Drop** - Reorder cards within/between categories
- [x] **Smart Auto-Categorization** - Card types route to correct categories automatically
- [x] **View Mode Selector** - Switch between All, Recent, Starred, By Tag views

### Card Management 🎴
- [x] **6 Card Types:**
  - 📑 Bookmarks (URLs)
  - 💻 Code Snippets (syntax highlighted)
  - ⌘ Commands (bash/CLI)
  - 📄 Documentation (notes/guides)
  - 🖼️ Images (screenshots with base64 storage)
  - 📝 Notes (quick thoughts)
- [x] **CRUD Operations** - Create, read, update, delete with modals
- [x] **In-Modal Card Editing** - Edit title, description, content, language, tags, and starred status directly in card modal ⭐ NEW
- [x] **Copy to Clipboard** - One-click copying for all content types
- [x] **Two-Step Delete** - Confirmation dialog prevents accidents

### Search & Filtering 🔍
- [x] **Global Search** (`Cmd/Ctrl+K` keyboard shortcut)
- [x] **Full-Text Search** - Titles, descriptions, tags, content
- [x] **Tag Filtering** - AND/OR logic for complex queries
- [x] **Real-Time Results** - Instant feedback as you type

### Theming & Customization 🌌
- [x] **Glass Theming System** - Adjustable transparency (Clear → Frosted)
- [x] **6 Accent Palettes** - Byte Classic, Neon Night, Rainbow Sprint, Midnight Carbon, Sunset Espresso, Pastel Haze
- [x] **6 Icon Palettes** - Neon Grid, Carbon Tech, Espresso Circuit, Rainbow Loop, Pink Pulse, Custom Single
- [x] **Light/Dark Mode** - System detection + manual toggle
- [x] **Wallpaper Support** - 12 built-in wallpapers + custom upload with preview
- [x] **Theme Persistence** - All settings database-backed (survives browser clears)
- [x] **Custom Accent Themes** - Build and save 2-6 color palettes
- [x] **8 Gradient Presets** - Aurora, Sunset Glow, Ocean Depth, Forest Mist, Cosmic Purple, Midnight Slate, Warm Earth, Cyber Pink
- [x] **17 UI Fonts** - System, Inter, Geist, Roboto, Poppins, and stylized options
- [x] **13 Mono Fonts** - Geist Mono, JetBrains, Fira Code, and more
- [x] **Settings Presets** - Save/load entire appearance as named profiles
- [x] **Dark Theme Form Styling** - Select dropdowns and inputs properly styled for dark themes ⭐ NEW

### Image Features 🖼️
- [x] **Image Card Type** - Base64 storage (max 1920×1920, 5MB limit)
- [x] **Full-Screen Lightbox** - Glass-styled viewer with ESC support
- [x] **Download Original** - Save images with original filename
- [x] **Copy to Clipboard** - Auto-converts JPEG to PNG
- [x] **Compression** - Automatic resize & quality control (85%)

### Data Management 💾
- [x] **Export Data** - JSON backup of all categories, tags, cards
- [x] **Import Data** - Restore from JSON with validation & merge
- [x] **Seed Data** - Example cards for quick start

---

## 🚧 In Progress Features

_No features currently in progress. Ready for Phase 4!_

---

## ✅ Recently Completed

### v2.1.0: Card Modal Editing & UX Improvements 🎨
**Status:** ✅ Complete (2025-12-01)  
**Priority:** High  
**Released:** v2.1.0

Enhanced card modal with full editing capabilities:
- **In-Modal Editing** - Edit all card fields directly in the detail modal
- **Tag Management** - Add/remove tags with visual toggle interface
- **Star Toggle** - Quick star/unstar in modal header
- **Minimum Modal Size** - 400px minimum height for better appearance
- **Fixed Nested Button Error** - Resolved HTML hydration error
- **Dark Theme Dropdowns** - Fixed white dropdowns in Create Card modal

### v2.0.0: Database-Backed Settings & Appearance Overhaul 🎨
**Status:** ✅ Complete (2025-12-01)  
**Priority:** High  
**Released:** v2.0.0

Major release introducing full database persistence for all user settings:
- **UserSettings Model** - New singleton Prisma model for all theme/appearance preferences
- **Settings API** - New `/api/settings` route (GET/PATCH/PUT) for persistence
- **Font Selection Fix** - Fixed critical bug where UI and mono fonts wouldn't apply
- **Prisma 7 Upgrade** - Updated to Prisma 7.0.1 with better-sqlite3 adapter
- **Database-backed Presets** - Custom themes, presets, and backgrounds all persist to SQLite

### Phase 3: Customizable Dashboard Filters 🎛️
**Status:** ✅ Complete  
**Priority:** Medium  
**Released:** v1.5.0

#### Goals
Let users customize what the dashboard shows (Recent, Starred, Tag-specific views).

#### Features
- **View Modes:**
  - All Cards (default)
  - Most Recent (sorted by newest)
  - Starred Only
  - By Tag (filter by selected tags)
- **Persistence:** Save view preference to localStorage
- **UI:** Dropdown in dashboard header with Clear button

#### Technical Approach
- Added `ViewMode` type and `viewMode` state to `useSearch` hook
- Filter/sort cards based on selected view mode
- ViewModeSelector dropdown component with glassmorphic styling
- localStorage persistence with `bytebox-view-mode` key
- Keyboard shortcuts `⌘1-4` for quick switching

#### Subtasks
- [x] Design view mode selector UI
- [x] Implement filter logic for each view mode
- [x] Add localStorage persistence
- [x] Update dashboard to respect view mode
- [x] Add "Clear filter" button
- [x] Add keyboard shortcuts for view modes (⌘1-4)

---

### Phase 4: Category-Specific Pages 📑
**Status:** 💭 Concept  
**Priority:** Low  
**Target:** Future Release

#### Goals
Dedicated pages for each category with grid view and better browsing.

#### Features
- Individual routes: `/bookmarks`, `/snippets`, `/commands`, `/docs`, `/images`, `/notes`
- Grid layout (3-4 columns) instead of single column
- Same search/filter capabilities
- Links in sidebar navigation

#### Technical Approach
- Create new page routes in `src/app/`
- Build grid layout component
- Reuse existing search/filter hooks
- Add sidebar links to category pages

#### Subtasks
- [ ] Create page routes for each category
- [ ] Build grid layout component
- [ ] Add sidebar navigation links
- [ ] Implement search/filter for each page
- [ ] Add breadcrumb navigation
- [ ] Style empty states for grid view

---

### Phase 5: Quick Links Bar 🔗
**Status:** 💭 Concept  
**Priority:** Low  
**Target:** Future Release

#### Goals
Customizable icon links in header for frequently visited sites.

#### Features
- **Icon Circles** - Small circular buttons in header
- **Drag to Reorder** - @dnd-kit for reordering
- **Preset Options:**
  - Gmail
  - GitHub
  - Claude.ai
  - HuggingFace
  - Dev.to
  - Reddit
  - Stack Overflow
  - NPM
  - MDN Docs
- **Custom Links** - Add your own with URL and icon
- **localStorage** - Persist user's link configuration

#### Technical Approach
- New component: `QuickLinksBar.tsx`
- Store links in localStorage as JSON array
- Add modal to manage links (add/edit/delete/reorder)
- Render in AppLayout header

#### UI Design
```
[Logo] ByteBox        [🔗][🔗][🔗][🔗][+]    [Search] [Theme Toggle]
                       Quick Links →
```

#### Subtasks
- [ ] Design QuickLinksBar component
- [ ] Build link management modal
- [ ] Add drag-to-reorder functionality
- [ ] Create preset icon library
- [ ] Add localStorage persistence
- [ ] Style links bar in header
- [ ] Add hover tooltips showing link names

---

### Phase 6: Mobile App Layout 📱
**Status:** 💭 Concept  
**Priority:** Low  
**Target:** Future Release

#### Goals
Make ByteBox fully responsive and mobile-friendly with proper touch interactions and optimized layouts.

#### Features
- **Responsive Sidebar** - Collapsible hamburger menu on mobile
- **Mobile-First Cards** - Stack cards vertically, touch-friendly sizing
- **Swipe Gestures** - Swipe between categories, swipe-to-delete
- **Bottom Navigation** - Mobile nav bar for quick access
- **Touch-Optimized Modals** - Full-screen modals on mobile
- **Pull-to-Refresh** - Native-feeling refresh gesture

#### Technical Approach
- Add Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`)
- Create mobile-specific layout components
- Use `@media` queries for mobile detection
- Implement touch event handlers for gestures
- Add viewport meta tag optimizations
- Consider React Native for future native app

#### UI Updates
- **Mobile Header:** Hamburger menu + search icon + theme toggle
- **Category Tabs:** Horizontal scrollable tabs instead of columns
- **Card Grid:** Single column on mobile, 2 columns on tablet
- **Bottom Nav:** Home, Search, Add, Tags, Settings icons
- **Floating Action Button:** Quick add button (bottom-right)

#### Responsive Breakpoints
```css
/* Mobile: 0-639px */
/* Tablet: 640-1023px */
/* Desktop: 1024px+ */
```

#### Subtasks
- [ ] Add responsive meta tags and viewport settings
- [ ] Create collapsible mobile sidebar/hamburger menu
- [ ] Implement horizontal category tabs for mobile
- [ ] Design mobile card layout (single column)
- [ ] Add bottom navigation component
- [ ] Create floating action button (FAB)
- [ ] Implement touch gestures (swipe navigation)
- [ ] Optimize modals for mobile (full-screen)
- [ ] Add pull-to-refresh functionality
- [ ] Test on various mobile devices and screen sizes
- [ ] Add safe area insets for notched devices

---

## 🔮 Future Ideas (Backlog)

### Authentication & Multi-User
- [ ] User accounts with authentication
- [ ] Cloud sync (optional)
- [ ] Team sharing (share boards/cards)

### Advanced Features
- [ ] Card comments/notes
- [ ] Card history/versioning
- [ ] Markdown editor for doc cards
- [ ] Code playground integration (run snippets)
- [ ] Browser extension for quick-add
- [ ] Mobile app (React Native)
- [ ] API webhooks for automation
- [ ] Card templates

### Integrations
- [ ] GitHub integration (pull repos/gists)
- [ ] Notion/Obsidian export
- [ ] Slack integration
- [ ] Chrome extension for bookmarking

### UI Enhancements
- [ ] Card preview on hover
- [ ] Bulk operations (multi-select cards)
- [ ] Compact/comfortable view density
- [ ] Custom category colors
- [ ] Animated background effects

---

## 📊 Progress Tracking

| Feature | Status | Version | Completion Date |
|---------|--------|---------|-----------------|
| Core Foundation | ✅ Complete | 1.0.0 | 2025-01-29 |
| Glass Theming System | ✅ Complete | 1.1.0 | 2025-10-24 |
| Image Cards & UX Polish | ✅ Complete | 1.2.0 | 2025-10-24 |
| Notes Category | ✅ Complete | 1.2.0 | 2025-10-24 |
| File Upload (Docs) | ✅ Complete | 1.3.0 | 2025-10-24 |
| Starred Cards | ✅ Complete | 1.4.0 | 2025-11-29 |
| Customizable Dashboard | ✅ Complete | 1.5.0 | 2025-11-29 |
| Database-Backed Settings | ✅ Complete | 2.0.0 | 2025-12-01 |
| Appearance Overhaul | ✅ Complete | 2.0.0 | 2025-12-01 |
| Category Pages | 💭 Concept | TBD | TBD |
| Quick Links Bar | 💭 Concept | TBD | TBD |
| Mobile App Layout | 💭 Concept | TBD | TBD |

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 16.0.6 |
| **UI Library** | React | 19.2.0 |
| **Language** | TypeScript | 5.9.x |
| **Styling** | Tailwind CSS | 4.x |
| **Database** | SQLite + Prisma | 7.0.1 |
| **Drag & Drop** | @dnd-kit | 6.3.1 / 10.0.0 |
| **Syntax Highlighting** | Shiki | 3.17.0 |
| **Icons** | Heroicons | 2.2.0 |
| **UI Components** | Headless UI | 2.2.9 |

---

## 📝 Notes & Guidelines

### Development Principles
- ✅ **Latest Versions Always** - No outdated dependencies
- ✅ **TypeScript Strict Mode** - Full type safety
- ✅ **Test After Each Change** - Run lint & typecheck
- ✅ **Incremental Development** - Small, focused changes
- ✅ **Documentation First** - Update docs with code

### Design Principles
- 🎨 **Glass First** - Maintain glassmorphic aesthetic
- 🌈 **Accent Aware** - Use theme palette colors
- ⚡ **Performance** - Fast, responsive, smooth animations
- 📱 **Responsive** - Mobile-friendly (future focus)
- ♿ **Accessible** - Keyboard shortcuts, screen reader support

### Code Style
- Use Tailwind utilities over custom CSS
- Follow existing component patterns
- No `any` types - use proper TypeScript
- Prefer named exports
- Use `'use client'` only when necessary
- Server Components by default

---

## 🎯 Current Sprint Goals

### Recently Completed
1. ✅ ~~Add Notes category~~ DONE
2. ✅ ~~Fix Images placeholder~~ DONE
3. ✅ ~~**File Upload for Docs**~~ DONE
4. ✅ ~~**Starred/Favorited Cards**~~ DONE (v1.4.0)
5. ✅ ~~**Customizable Dashboard Filters**~~ DONE (v1.5.0)
6. ✅ ~~**Database-Backed Settings**~~ DONE (v2.0.0)
   - ✅ UserSettings Prisma model
   - ✅ /api/settings API route
   - ✅ Font selection fix (CSS variables on body)
   - ✅ Prisma 7 upgrade with better-sqlite3 adapter
   - ✅ Custom accent themes persistence
   - ✅ Settings presets persistence

### Upcoming Sprint (Phase 4)
1. **Category-Specific Pages** 📑 (Next Priority)
   - Individual routes for each category
   - Grid layout instead of single column
   - Sidebar navigation links
2. Quick Links Bar (if time)
3. Mobile responsive improvements

---

## 📚 Resources

- **Documentation:** [README.md](./README.md), [OVERVIEW.md](./OVERVIEW.md)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Glass System:** [glass_theming_guide.md](./glass_theming_guide.md)

---

**Made with ❤️ by [Pink Pixel](https://pinkpixel.dev)** ✨  
_Dream it, Pixel it_ 🌸
