# ByteBox - Product Overview

## Purpose
ByteBox is a lightweight web dashboard for developer resources — a personal dev toolkit in one beautiful place. It serves as a centralized hub where bookmarks, documentation, APIs, commands, and code snippets live together in an organized, searchable, and visually appealing interface.

## Value Proposition
Think **Trello for resources**, but built specifically for developers who want style and speed. ByteBox combines the organizational power of kanban boards with developer-focused features like syntax highlighting, tag-based filtering, and instant search. The glassmorphic UI adapts to any wallpaper while maintaining readability and aesthetic appeal.

## Target Users
- **Developers** who need to organize bookmarks, code snippets, CLI commands, and documentation
- **Technical teams** looking for a shared resource management system
- **DevOps engineers** managing commands and configuration snippets
- **Students and learners** collecting coding resources and references
- **Anyone** who wants a beautiful, fast way to organize technical resources

## Key Features

### Core Functionality
- **📦 Kanban-Style Boards** — Organize resources into customizable categories with responsive columns
- **🧭 View Mode Selector** — Switch between All Cards, Most Recent, Starred Only, and By Tag views with keyboard shortcuts (⌘1-4)
- **🏷️ Smart Tagging** — Add multiple tags with color-coded filtering (AND/OR logic)
- **⭐ Star Favorites** — Mark important cards as starred for quick access with dashboard filtering
- **🔍 Lightning Search** — Press Cmd/Ctrl+K to search across titles, descriptions, tags, and content
- **🎨 Drag & Drop** — Reorder cards and move them between boards seamlessly with @dnd-kit
- **✍️ CRUD Everything** — Create, edit, delete cards with a slick modal interface and two-step deletion confirmation
- **💻 Syntax Highlighting** — Code snippets with 35+ languages (powered by Shiki)
- **📝 Copy-to-Clipboard** — One-click copy for all text content (code blocks, URLs, commands, docs)
- **🖼️ Image/Screenshot Cards** — Save and preview images with full-screen lightbox, download, and clipboard support

### Card Types
1. **📑 Bookmark** — Save URLs and links (auto-categorized to Bookmarks)
2. **💻 Code Snippet** — Save code with syntax highlighting (auto-categorized to Code Snippets)
3. **⌘ Command** — Save CLI commands (auto-categorized to Commands)
4. **📚 Documentation** — Save notes and docs (auto-categorized to Documentation)
5. **🖼️ Image** — Upload screenshots or images (auto-categorized to Images)

### Glass UI & Theming
- **Glassmorphic Layout** — Sidebar, header, cards, modals, and filters share reusable glass utilities with blurred depth and accent-aware tinting
- **Adjustable Glass Intensity** — A transparency slider (Clear → Frosted) instantly recalibrates blur, opacity, and shadows
- **Accent Theme Library** — Swap between Byte Classic, Neon Night, Rainbow Sprint, Midnight Carbon, Sunset Espresso, and Pastel Haze palettes, or build custom 2–6 color palettes
- **Icon Palettes** — Choose curated icon stacks (Neon Grid, Carbon Tech, Espresso Circuit, Rainbow Loop, Pink Pulse) or set a custom hex color
- **Background Playground** — Solid color picker, custom 2–4 color gradients with angle control, curated gradient presets, and built-in wallpaper library (plus uploads)
- **Typography Controls** — Choose UI and mono fonts independently from preloaded stacks (Inter/Geist/etc. + JetBrains/Fira/etc.)
- **Presets** — Save the entire appearance (mode, accent/icon, background, fonts, glass) as named profiles; apply or delete anytime
- **Theme Persistence** — Light/dark base, accent/icon themes, custom colors, background selection, fonts, and presets persist locally
- **System Detection** — Defaults to your OS preference on first load

### Data Management
- **Export/Import** — Backup all data as JSON, restore anytime
- **SQLite Database** — Fast local storage with Prisma 7 ORM
- **Settings Persistence** — All theme preferences persist to database (survives browser clears)
- **Seed Data** — Get started with example cards and categories

## Use Cases

### Daily Development
- Quick access to frequently used code snippets
- Organize API documentation and references
- Store and retrieve CLI commands
- Bookmark important development resources

### Learning & Research
- Collect code examples while learning new technologies
- Organize tutorial links and documentation
- Tag resources by topic or technology
- Star important learning materials

### Team Collaboration
- Share common commands and configurations
- Centralize team documentation
- Organize project-specific resources
- Export/import data for team distribution

### Project Management
- Organize resources by project using categories
- Tag resources by technology stack
- Quick search across all project resources
- Visual organization with drag-and-drop

## Keyboard Shortcuts
- **Cmd/Ctrl + K** — Open global search
- **Cmd/Ctrl + 1** — View all cards
- **Cmd/Ctrl + 2** — View most recent cards
- **Cmd/Ctrl + 3** — View starred only
- **Cmd/Ctrl + 4** — View by tag
- **Cmd/Ctrl + Shift + S** — Toggle starred filter
- **Esc** — Close modals or search

## Brand Identity
**Made with ❤️ by Pink Pixel**
- Tagline: _"Dream it, Pixel it"_ ✨
- Brand Colors: Pink (#ec4899) and Purple (#8b5cf6)
- Design Philosophy: Beautiful, functional, developer-focused
