# ByteBox - Technology Stack

## Core Technologies

### Framework & Runtime
- **Next.js 16.0.6** — React framework with App Router
- **React 19.2.0** — UI library with React Server Components
- **React DOM 19.2.0** — React renderer for web
- **Node.js 18+** — JavaScript runtime (LTS recommended)
- **TypeScript 5.9.3** — Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4.1.16** — Utility-first CSS framework
- **@tailwindcss/postcss 4** — PostCSS plugin for Tailwind
- **PostCSS** — CSS transformation tool
- **clsx 2.1.1** — Conditional class name utility
- **tailwind-merge 3.4.0** — Merge Tailwind classes intelligently

### Database & ORM
- **SQLite** — Embedded relational database
- **Prisma 7.0.1** — Next-generation ORM
- **@prisma/client 7.0.1** — Prisma client for database queries
- **@prisma/adapter-better-sqlite3 7.0.1** — SQLite adapter for Prisma
- **better-sqlite3 12.5.0** — Fast SQLite3 bindings for Node.js

### UI Components & Interactions
- **@dnd-kit/core 6.3.1** — Drag-and-drop toolkit core
- **@dnd-kit/sortable 10.0.0** — Sortable drag-and-drop
- **@dnd-kit/utilities 3.2.2** — Drag-and-drop utilities
- **@headlessui/react 2.2.9** — Unstyled, accessible UI components
- **@heroicons/react 2.2.0** — Beautiful hand-crafted SVG icons

### Code & Syntax
- **Shiki 3.17.0** — Syntax highlighter with 35+ languages
- **babel-plugin-react-compiler 1.0.0** — React compiler for optimization

### Utilities
- **dotenv 17.2.3** — Environment variable loader
- **pdf-parse 2.4.5** — PDF parsing library

## Development Dependencies

### Build Tools
- **tsx 4.20.6** — TypeScript execution for Node.js
- **eslint 9** — JavaScript/TypeScript linter
- **eslint-config-next 16.0.5** — Next.js ESLint configuration

### Type Definitions
- **@types/node 24** — Node.js type definitions
- **@types/react 19** — React type definitions
- **@types/react-dom 19** — React DOM type definitions
- **@types/better-sqlite3 7.6.13** — better-sqlite3 type definitions

## Package Configuration

### Version
- **Current Version:** 2.0.0
- **Private Package:** Yes (not published to npm)

### Overrides
- **baseline-browser-mapping:** 2.9.0-beta2 (pinned for compatibility)

## Development Commands

### Development Server
```bash
npm run dev
# Starts Next.js development server with hot reload
# Filters out baseline-browser-mapping warnings
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized production build
# Outputs to .next/ directory
# Filters out baseline-browser-mapping warnings
```

### Production Server
```bash
npm run start
# Starts production server
# Requires npm run build first
# Filters out baseline-browser-mapping warnings
```

### Linting
```bash
npm run lint
# Runs ESLint on the codebase
# Checks for code quality and style issues
```

### Database Commands

#### Generate Prisma Client
```bash
npm run db:generate
# Generates Prisma client from schema
# Run after schema changes
```

#### Run Migrations
```bash
npm run db:migrate
# Creates and applies database migrations
# Updates dev.db with schema changes
```

#### Seed Database
```bash
npm run db:seed
# Populates database with example data
# Runs prisma/seed.ts script
```

#### Prisma Studio
```bash
npm run db:studio
# Opens Prisma Studio GUI
# Visual database browser and editor
# Runs on http://localhost:5555
```

## TypeScript Configuration

### Compiler Options
- **Target:** ES2017
- **Module:** ESNext with bundler resolution
- **JSX:** react-jsx (React 19 transform)
- **Strict Mode:** Enabled
- **Path Aliases:** `@/*` maps to `./src/*`
- **Incremental Compilation:** Enabled
- **Skip Lib Check:** Enabled

### Included Files
- All `.ts`, `.tsx`, `.mts` files
- Next.js type definitions
- Generated types in `.next/types/`

### Excluded Files
- `node_modules/`

## Database Configuration

### Prisma Schema
- **Provider:** SQLite
- **Client Output:** `../node_modules/.prisma/client`
- **Database File:** `prisma/dev.db`

### Models
1. **Category** — Boards/columns with cards
2. **Tag** — Tagging system with many-to-many relation to cards
3. **Card** — Main content with type, content, metadata, and relations
4. **UserSettings** — Singleton for theme and appearance settings

### Migrations
Located in `prisma/migrations/`:
- `20251024105814_init` — Initial schema
- `20251024195709_add_image_support` — Image card support
- `20251025005336_add_file_upload_support` — File upload support
- `20251129185730_add_starred_field` — Starred/favorite feature
- `20251130033852_add_user_settings` — Settings persistence

## Environment Variables

### Required
- **DATABASE_URL** — SQLite database connection string
  - Example: `file:./prisma/dev.db`
  - Defined in `.env` file (not in version control)
  - Example provided in `.env.example`

## Build Output

### Next.js Build
- **Output Directory:** `.next/`
- **Static Assets:** `.next/static/`
- **Server Components:** `.next/server/`
- **Build Manifest:** `.next/build-manifest.json`

### Prisma Client
- **Output Directory:** `node_modules/.prisma/client/`
- **Generated on:** `prisma generate` or `db:generate`

## Browser Support

### Target Browsers
- Modern browsers with ES2017 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Features Used
- CSS Grid and Flexbox
- CSS Custom Properties
- Backdrop Filter (for glass effect)
- Drag and Drop API
- Clipboard API
- File API

## Performance Optimizations

### React Compiler
- **babel-plugin-react-compiler** enabled
- Automatic memoization of components
- Optimized re-renders

### Next.js Optimizations
- Server Components by default
- Automatic code splitting
- Image optimization
- Font optimization
- Static generation where possible

### Database Optimizations
- Indexed fields (categoryId, type)
- Cascade deletes for data integrity
- Efficient queries via Prisma

## Development Workflow

### Initial Setup
1. Clone repository
2. `npm install` — Install dependencies
3. `npx prisma generate` — Generate Prisma client
4. `npx prisma db push` — Create database
5. `npm run db:seed` — Seed with example data (optional)
6. `npm run dev` — Start development server

### Making Changes
1. Edit code in `src/`
2. Hot reload updates browser automatically
3. For schema changes: update `prisma/schema.prisma`
4. Run `npm run db:migrate` to apply changes
5. Run `npm run db:generate` to update client

### Testing Changes
1. Use browser DevTools for debugging
2. Check console for errors
3. Test drag-and-drop functionality
4. Verify database changes in Prisma Studio
5. Test theme changes and persistence

### Building for Production
1. `npm run build` — Create production build
2. `npm run start` — Test production build locally
3. Deploy `.next/` directory and `prisma/dev.db`

## Scripts Explained

### next-with-env.cjs
Custom wrapper script that:
- Loads environment variables from `.env`
- Passes commands to Next.js CLI
- Filters out baseline-browser-mapping warnings
- Ensures consistent environment across commands

## Package Manager Support
- **npm** — Primary package manager (lock file included)
- **pnpm** — Supported alternative
- **yarn** — Supported alternative

## IDE Support
- **VS Code** — Recommended with TypeScript and ESLint extensions
- **TypeScript Language Server** — Full IntelliSense support
- **Prisma Extension** — Schema syntax highlighting and formatting
