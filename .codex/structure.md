# ByteBox - Project Structure

## Directory Organization

```
ByteBox/
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router pages and API routes
│   │   ├── api/              # Backend API endpoints
│   │   ├── search/           # Search page with filters
│   │   ├── settings/         # Settings/appearance page
│   │   ├── tags/             # Tag directory page
│   │   ├── globals.css       # Global styles with Tailwind + glass/theming tokens
│   │   ├── layout.tsx        # Root layout with ThemeProvider
│   │   └── page.tsx          # Main dashboard (boards)
│   ├── components/           # React components
│   │   ├── cards/            # Card-related components
│   │   ├── layout/           # Layout components (AppLayout, Board, CategoryColumn)
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React Context providers
│   │   └── ThemeContext.tsx  # Theme, accent, icon, and wallpaper controller
│   ├── hooks/                # Custom React hooks
│   │   └── useSearch.ts      # Search & filter hook
│   ├── lib/                  # Utility libraries
│   │   ├── db/               # Prisma client & database queries
│   │   ├── utils/            # Helper functions (cn, generateId, formatDate, etc.)
│   │   └── themeRegistry.ts  # Accent & icon palette definitions
│   └── types/                # TypeScript type definitions
│       ├── index.ts          # Main type definitions
│       └── indev.ts          # Development/experimental types
├── prisma/                   # Database configuration
│   ├── migrations/           # Database migration history
│   ├── schema.prisma         # Database schema definition
│   ├── seed.ts               # Database seed script
│   └── dev.db                # SQLite database file
├── public/                   # Static assets
│   ├── wallpapers/           # Built-in wallpaper images
│   ├── favicon.png           # Site favicon
│   ├── icon.png              # App icon
│   └── logo_banner.png       # Logo asset
├── scripts/                  # Build and utility scripts
│   └── next-with-env.cjs     # Environment-aware Next.js wrapper
├── .amazonq/                 # Amazon Q configuration
│   └── rules/                # Project rules and documentation
│       └── memory-bank/      # Memory Bank documentation
├── DEV/                      # Development resources and backups
├── .next/                    # Next.js build output (generated)
└── node_modules/             # Dependencies (generated)
```

## Core Components

### Application Layer (`src/app/`)

#### Pages
- **page.tsx** — Main dashboard with kanban boards, drag-and-drop, and card management
- **search/page.tsx** — Dedicated search experience with advanced filtering
- **settings/page.tsx** — Appearance customization, data management, and about section
- **tags/page.tsx** — Tag directory with statistics and filtering capabilities
- **layout.tsx** — Root layout wrapping all pages with ThemeProvider and global styles

#### API Routes (`src/app/api/`)
- **cards/** — CRUD operations for cards (create, read, update, delete)
- **categories/** — Category management endpoints
- **tags/** — Tag management and filtering
- **export/** — Data export to JSON
- **import/** — Data import from JSON
- **settings/** — User settings persistence

### Component Layer (`src/components/`)

#### Cards (`components/cards/`)
- **Card.tsx** — Base card component with type-specific rendering
- **DraggableCard.tsx** — Wrapper adding drag-and-drop functionality
- **CardModal.tsx** — Full-screen modal for viewing/editing cards
- **CreateCardModal.tsx** — Modal for creating new cards with type selection
- **ImageCard.tsx** — Specialized component for image cards with lightbox

#### Layout (`components/layout/`)
- **AppLayout.tsx** — Main application shell with sidebar, header, and content area
- **Board.tsx** — Kanban board container managing categories and drag-and-drop
- **CategoryColumn.tsx** — Individual category column with cards
- **Sidebar.tsx** — Navigation sidebar with filters and actions
- **Header.tsx** — Top header with search, view modes, and theme toggle

#### UI (`components/ui/`)
- **Tag.tsx** — Tag display and interaction component
- **SearchBar.tsx** — Global search with keyboard shortcuts
- **FilterPanel.tsx** — Advanced filtering UI (tags, starred, date)
- **CodeBlock.tsx** — Syntax-highlighted code display with copy button
- **ThemeToggle.tsx** — Light/dark mode switcher
- **ExportImport.tsx** — Data backup and restore UI
- **Button.tsx** — Reusable button component with variants
- **Modal.tsx** — Base modal component with glass styling

### Context & State (`src/contexts/`)

#### ThemeContext.tsx
Central theme management providing:
- Light/dark mode state
- Accent theme selection and custom palette creation
- Icon theme/color management
- Background configuration (solid, gradient, wallpaper, upload)
- Font selection (UI and mono fonts)
- Glass intensity control
- Settings presets (save/load/delete)
- Persistence to database via API

### Hooks (`src/hooks/`)

#### useSearch.ts
Provides search and filtering functionality:
- Full-text search across cards
- Tag filtering with AND/OR logic
- Starred filter
- Date range filtering
- View mode management (all, recent, starred, by-tag)
- Debounced search for performance

### Library Layer (`src/lib/`)

#### Database (`lib/db/`)
- **client.ts** — Prisma client singleton
- **queries.ts** — Reusable database query functions
- **seed.ts** — Database seeding utilities

#### Utils (`lib/utils/`)
- **cn.ts** — Class name merging utility (clsx + tailwind-merge)
- **generateId.ts** — Unique ID generation
- **formatDate.ts** — Date formatting helpers
- **truncate.ts** — Text truncation utility
- **syntax.ts** — Syntax highlighting configuration (Shiki)
- **imageUtils.ts** — Image compression and processing

#### Theme Registry (`lib/themeRegistry.ts`)
Defines:
- Built-in accent themes (Byte Classic, Neon Night, etc.)
- Icon palettes (Neon Grid, Carbon Tech, etc.)
- Gradient presets
- Wallpaper library
- Font stacks (UI and mono)

### Type Definitions (`src/types/`)

#### index.ts
Core types:
- **Card** — Card data structure with all fields
- **Category** — Category/board structure
- **Tag** — Tag structure with color
- **CardType** — Union type for card types
- **ViewMode** — View mode options
- **FilterState** — Filter configuration
- **ThemeMode** — Light/dark mode
- **AccentTheme** — Accent color palette structure
- **IconTheme** — Icon color configuration
- **BackgroundConfig** — Background settings
- **FontConfig** — Font selection
- **SettingsPreset** — Saved appearance preset

## Database Schema

### Models (Prisma)

#### Category
- Represents boards/columns in the UI
- Fields: id, name, description, color, order, cards[], createdAt, updatedAt
- Default color: #ec4899 (Pink Pixel brand)

#### Tag
- For organizing and filtering cards
- Fields: id, name (unique), color, cards[], createdAt, updatedAt
- Default color: #8b5cf6 (Purple brand)

#### Card
- Main content type (bookmarks, snippets, commands, docs, images)
- Fields: id, type, title, description, content, imageData, fileData, fileName, fileType, fileSize, language, starred, categoryId, category, tags[], order, createdAt, updatedAt
- Indexed by: categoryId, type
- Cascade delete with category

#### UserSettings
- Singleton pattern (id always "default")
- Fields: id, mode, accentThemeId, iconThemeId, customIconColor, glassIntensity, backgroundConfig (JSON), fontConfig (JSON), customAccentThemes (JSON), settingsPresets (JSON), createdAt, updatedAt
- Stores all theme and appearance preferences

## Architectural Patterns

### Next.js App Router
- Server Components by default for optimal performance
- Client Components marked with 'use client' directive
- API routes in app/api/ directory
- File-based routing

### Component Composition
- Small, focused components with single responsibility
- Composition over inheritance
- Props drilling minimized via Context API
- Reusable UI components in components/ui/

### State Management
- React Context for global state (theme, settings)
- Local state with useState for component-specific data
- Server state managed via API routes and database

### Styling Architecture
- Tailwind CSS utility classes
- CSS custom properties for theming (--accent-*, --glass-*)
- Glass utilities in globals.css
- Component-scoped styles when needed

### Data Flow
1. User interaction → Component
2. Component → API route (fetch/POST)
3. API route → Prisma query
4. Prisma → SQLite database
5. Response → Component state update
6. Re-render with new data

### Drag & Drop Architecture
- @dnd-kit library for drag-and-drop
- DndContext wraps draggable areas
- Sensors for mouse, touch, and keyboard
- Collision detection algorithms
- onDragEnd handler updates database

### Search & Filter Architecture
- useSearch hook centralizes logic
- Debounced search input (300ms)
- Client-side filtering for instant results
- Tag filtering with AND/OR logic
- View modes control data display

## Configuration Files

- **package.json** — Dependencies and scripts
- **tsconfig.json** — TypeScript configuration
- **next.config.ts** — Next.js configuration
- **tailwind.config.ts** — Tailwind CSS configuration
- **postcss.config.mjs** — PostCSS configuration
- **prisma.config.ts** — Prisma configuration
- **eslint.config.mjs** — ESLint rules
- **.env** — Environment variables (DATABASE_URL)
