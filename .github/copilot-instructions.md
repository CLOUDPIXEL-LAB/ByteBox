# ByteBox - Development Guidelines

## Code Quality Standards

## Technology Stack

| Technology       | Version    | Purpose                                      |
| ---------------- | ---------- | -------------------------------------------- |
| Next.js          | 16.x       | React framework with App Router              |
| React            | 19.x       | UI library                                   |
| TypeScript       | 5.9.x      | Type safety                                  |
| Tailwind CSS     | 4.x        | Utility-first styling with glass design     |
| Prisma           | 7.x        | ORM with better-sqlite3 adapter              |
| SQLite           | -          | Local database (`dev.db`)                    |
| @dnd-kit         | 6.x/10.x   | Accessible drag-and-drop                     |
| Shiki            | 3.x        | Syntax highlighting                          |
| @heroicons/react | 2.x        | Icon library                                 |

## Architecture Overview

### Naming Conventions

- **Components**: PascalCase (e.g., `AppLayout`, `ThemeProvider`, `CardModal`)
- **Files**: Match component names (e.g., `AppLayout.tsx`, `ThemeContext.tsx`)
- **Functions**: camelCase (e.g., `handleCreateCard`, `applyModeTokens`, `readLocalStorage`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `STORAGE_KEYS`, `DEFAULT_GLASS_INTENSITY`)
- **Types/Interfaces**: PascalCase (e.g., `ThemeMode`, `AccentTheme`, `BackgroundConfig`)
- **CSS Classes**: kebab-case with BEM-like modifiers (e.g., `glass`, `glass--dense`, `surface-card`)

### Code Formatting

- **Indentation**: 2 spaces (consistent across all files)
- **Line Length**: Generally kept under 120 characters; broken at logical points
- **Semicolons**: Used consistently at end of statements
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Trailing Commas**: Used in multi-line arrays and objects
- **Arrow Functions**: Preferred for callbacks and inline functions

### Documentation Standards

- **File Headers**: Include project name and attribution (e.g., `/** ByteBox - [Component Name] * Made with ❤️ by Pink Pixel */`)
- **JSDoc**: Not heavily used; TypeScript types serve as primary documentation
- **README**: Comprehensive with installation, usage, features, and tech stack
- **Inline Comments**: Used sparingly for complex logic or non-obvious decisions

## Structural Conventions

### Component Architecture

- **Functional Components**: All components use React function components with hooks
- **Props Typing**: Explicit TypeScript interfaces/types for all component props
- **State Management**:
  - Local state with `useState` for component-specific data
  - Context API (`ThemeContext`) for global state (theme, settings)
  - No external state management libraries (Redux, Zustand, etc.)
- **Side Effects**: `useEffect` hooks with proper dependency arrays
- **Memoization**: `useMemo` and `useCallback` used strategically for performance

### File Structure Patterns

```typescript
// 1. Imports (external, then internal)
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// 2. Type definitions
type ComponentProps = {
  title: string;
  onClose: () => void;
};

// 3. Constants
const DEFAULT_VALUE = 60;

// 4. Helper functions (outside component)
const helperFunction = (value: string) => {
  return value.trim();
};

// 5. Main component
export default function Component({ title, onClose }: ComponentProps) {
  // 5a. Hooks
  const [state, setState] = useState("");
  const theme = useTheme();

  // 5b. Effects
  useEffect(() => {
    // effect logic
  }, []);

  // 5c. Event handlers
  const handleClick = () => {
    // handler logic
  };

  // 5d. Render
  return <div>{/* JSX */}</div>;
}
```

### Context Pattern

```typescript
// 1. Type definitions
type ContextType = {
  value: string;
  setValue: (value: string) => void;
};

// 2. Create context
const Context = createContext<ContextType | undefined>(undefined);

// 3. Provider component
export function Provider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState("");

  return (
    <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>
  );
}

// 4. Custom hook
export function useContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useContext must be used within Provider");
  }
  return context;
}
```

- **State**: React Context for theming (`ThemeContext`), component-local state for UI
- **Styling**: Glass-based design system with CSS variables

## Key Patterns

### React Patterns

#### State Management

```typescript
// Local state for UI-only concerns
const [isOpen, setIsOpen] = useState(false);

// Derived state with useMemo
const filteredItems = useMemo(() => {
  return items.filter((item) => item.active);
}, [items]);

// Callback memoization
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

#### Effect Patterns

```typescript
// Mount/unmount
useEffect(() => {
  // setup
  return () => {
    // cleanup
  };
}, []);

// Conditional effects with proper dependencies
useEffect(() => {
  if (condition) {
    doSomething();
  }
}, [condition, dependency]);

// Debounced API calls
const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const debouncedSave = useCallback((data: Record<string, unknown>) => {
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
  saveTimeoutRef.current = setTimeout(async () => {
    await fetch("/api/endpoint", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }, 500);
}, []);
```

#### Conditional Rendering

```typescript
// Ternary for simple conditions
{
  isLoading ? <Spinner /> : <Content />;
}

// Logical AND for optional rendering
{
  error && <ErrorMessage error={error} />;
}

// Early returns for complex conditions
if (!data) return null;
return <Component data={data} />;
```

### Next.js Patterns

#### API Routes

```typescript
// app/api/[resource]/route.ts
export async function GET(request: Request) {
  try {
    const data = await prisma.resource.findMany();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.resource.create({ data: body });
    return Response.json(created, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }
}
```

#### Server Components (Default)

```typescript
// No 'use client' directive
export default async function Page() {
  const data = await fetchData(); // Direct async/await
  return <div>{data.title}</div>;
}
```

#### Client Components

```typescript
"use client";

import { useState } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### Styling Patterns

#### Tailwind CSS

```typescript
// Utility classes with responsive modifiers
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// Conditional classes with cn utility
<button className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-accent text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

#### CSS Custom Properties

```typescript
// Setting CSS variables dynamically
root.style.setProperty('--accent-primary', color);
root.style.setProperty('--glass-blur', `${blur}px`);

// Using in Tailwind
<div className="text-(--text-strong) bg-[color-mix(in_srgb,var(--accent-primary)_85%,transparent)]">
```

#### Glass Morphism Pattern

```css
/* Reusable glass utility classes */
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(var(--glass-blur));
}

.glass--dense {
  /* Denser variant with adjusted opacity */
}
```

### Database Patterns (Prisma)

#### Schema Definition

```prisma
model Card {
  id          String   @id @default(cuid())
  type        String
  title       String
  content     String
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  tags        Tag[]    @relation("CardTags")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([type])
  @@map("cards")
}
```

#### Query Patterns

```typescript
// Find with relations
const cards = await prisma.card.findMany({
  include: {
    category: true,
    tags: true,
  },
  orderBy: { order: "asc" },
});

// Create with relations
const card = await prisma.card.create({
  data: {
    title: "New Card",
    categoryId: categoryId,
    tags: {
      connect: [{ id: tagId }],
    },
  },
});

// Update
await prisma.card.update({
  where: { id },
  data: { title: newTitle },
});

// Delete
await prisma.card.delete({
  where: { id },
});
```

### Error Handling

#### API Error Handling

```typescript
try {
  const response = await fetch("/api/endpoint");
  if (!response.ok) throw new Error("Failed to fetch");
  const data = await response.json();
  return data;
} catch (error) {
  console.error("Error:", error);
  alert("Operation failed. Please try again.");
}
```

#### Component Error Boundaries

```typescript
// Graceful degradation
if (!data) {
  return <div>No data available</div>;
}

// Loading states
if (isLoading) {
  return <Spinner />;
}
```

### Performance Patterns

#### Lazy Loading

```bash
# Development
npm run dev           # Start dev server (http://localhost:3000)
npm run build         # Production build
npm run start         # Start production server

# Code Quality
npm run lint          # ESLint check (must pass before commit)
npx tsc --noEmit      # TypeScript type check (must pass before commit)

# Database
npm run db:seed       # Seed example data
npm run db:generate   # Regenerate Prisma client
npm run db:migrate    # Run pending migrations
npx prisma studio     # Open database GUI
npx prisma migrate dev --name <name>  # Create new migration
```

#### Memoization

```typescript
// Expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Callback stability
const stableCallback = useCallback(() => {
  doSomething(value);
}, [value]);
```

#### Image Optimization

```typescript
// Next.js Image component
import Image from "next/image";

<Image
  src={imageUrl}
  alt="Description"
  width={400}
  height={300}
  unoptimized={isDataUrl} // For base64 data URLs
/>;
```

## Frequently Used Code Idioms

### Utility Functions

#### Class Name Merging

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn("base-class", condition && "conditional-class")} />;
```

#### Local Storage Helpers

```typescript
const readLocalStorage = <T>(
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

// Usage
const theme = readLocalStorage<ThemeMode>(
  "theme-key",
  (value) => (value === "dark" || value === "light" ? value : null),
  "dark"
);
```

#### Type Guards

```typescript
const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

// Usage
if (!isBrowser()) return;
```

## Git Workflow

### Branch Naming

```
feature/<description>   # New features (e.g., feature/image-upload)
fix/<description>       # Bug fixes (e.g., fix/drag-drop-reorder)
docs/<description>      # Documentation updates
refactor/<description>  # Code refactoring
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes following coding guidelines
3. Ensure all checks pass: `npm run lint && npx tsc --noEmit && npm run build`
4. Submit PR with clear description linking related issues
5. Address review feedback
6. Squash merge to main

## Security & Boundaries

### Do NOT

- Commit secrets, API keys, or credentials to the repository
- Modify `.env` files (use `.env.example` for templates)
- Edit files in `node_modules/` or `.prisma/`
- Bypass TypeScript type checking with `any` (use `unknown` if needed)
- Store sensitive user data in localStorage

### Do

- Validate all API route inputs before database operations
- Use Prisma's parameterized queries (protected against SQL injection)
- Sanitize user content (React handles XSS by default)
- Keep `dev.db` out of production deployments

## Testing Checklist

#### ESLint Directives

```bash
# Required checks (all must pass)
npm run lint          # ESLint - no errors or warnings
npx tsc --noEmit      # TypeScript - no type errors
npm run build         # Next.js build - successful compilation
```

### Manual Testing

- [ ] Drag-and-drop cards within and between categories
- [ ] Search with `Cmd/Ctrl + K` across titles, descriptions, tags
- [ ] Theme toggle (dark/light mode)
- [ ] Export/Import data functionality
- [ ] Create, edit, delete cards of each type
- [ ] Star/unstar cards and filter by starred

#### TypeScript Directives

```typescript
// Suppress hydration warnings for theme flicker prevention
<html suppressHydrationWarning>
<body suppressHydrationWarning>
```

#### Next.js Metadata

```typescript
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
  // ... other metadata
};
```

## Internal API Usage

### Theme Context API

```typescript
// Access theme state and setters
const {
  mode,
  setMode,
  toggleMode,
  accentTheme,
  setAccentTheme,
  glassIntensity,
  setGlassIntensity,
  backgroundConfig,
  setBackgroundConfig,
} = useTheme();

// Apply theme changes
setMode("dark");
setAccentTheme("neon-night");
setGlassIntensity(75);
setBackgroundConfig({
  type: "gradient",
  gradientColors: ["#1a1a2e", "#16213e"],
  gradientAngle: 135,
});
```

### Prisma Client Usage

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Always use try-catch for database operations
try {
  const result = await prisma.model.operation();
  return result;
} catch (error) {
  console.error("Database error:", error);
  throw error;
}
```

### API Route Patterns

```typescript
// GET request
const response = await fetch("/api/cards");
const cards = await response.json();

// POST request
const response = await fetch("/api/cards", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(cardData),
});

// PATCH request
await fetch("/api/settings", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ mode: "dark" }),
});

// DELETE request
await fetch(`/api/cards/${id}`, {
  method: "DELETE",
});
```

## Best Practices

### Component Design

- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use composition over prop drilling
- Prefer controlled components for form inputs
- Handle loading and error states explicitly

### State Management

- Keep state as local as possible
- Lift state only when necessary for sharing
- Use Context for truly global state (theme, auth, etc.)
- Avoid prop drilling beyond 2-3 levels
- Derive state from props when possible

### Performance

- Use React.memo() sparingly and only when profiling shows benefit
- Memoize expensive computations with useMemo
- Stabilize callbacks with useCallback when passed to memoized children
- Lazy load heavy components and routes
- Optimize images with Next.js Image component

### Accessibility

- Use semantic HTML elements
- Provide aria-label for icon-only buttons
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

### Security

- Sanitize user input before rendering
- Use environment variables for sensitive data
- Validate data on both client and server
- Use HTTPS in production
- Implement CSRF protection for mutations

### Testing

- Write tests for critical business logic
- Test edge cases and error conditions
- Mock external dependencies
- Use TypeScript for type safety as first line of defense
- Manual testing for UI/UX flows

## Project-Specific Conventions

### Brand Identity

- Primary brand color: Pink (#ec4899)
- Secondary brand color: Purple (#8b5cf6)
- Tagline: "Dream it, Pixel it ✨"
- Attribution: "Made with ❤️ by Pink Pixel"

### File Naming

- Components: PascalCase matching component name
- Utilities: camelCase descriptive names
- Types: PascalCase in index.ts or dedicated type files
- API routes: route.ts in appropriate directory

### Import Aliases

- `@/` maps to `src/` directory
- Use for all internal imports
- Example: `import { useTheme } from '@/contexts/ThemeContext'`

### Database Conventions

- Use cuid() for IDs
- Include createdAt and updatedAt timestamps
- Use cascade deletes for dependent data
- Index frequently queried fields
- Use descriptive table names with @@map

### CSS Conventions

- Tailwind utilities first
- Custom CSS variables for theming
- Glass morphism utilities for consistent UI
- Responsive design with mobile-first approach
- Dark mode support via CSS variables

### Git Workflow

- Descriptive commit messages
- Feature branches for new work
- Pull requests for code review
- Keep commits atomic and focused
- Update CHANGELOG.md for releases
