/**
 * ByteBox - Database Seed Script
 * Made with ❤️ by Pink Pixel
 * 
 * This script creates example data so the dashboard isn't blank on first install.
 * Users can delete this mock data and replace with their own content.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { config } from 'dotenv';

// Load .env so DATABASE_URL is available when running via npm run db:seed
config({ path: path.resolve(process.cwd(), '.env') });

// Get the database path from env, removing 'file:' prefix if present
let dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';

// If it's a relative path, resolve it from the project root
if (dbPath.startsWith('./') || dbPath.startsWith('../')) {
  dbPath = path.resolve(process.cwd(), dbPath);
}

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Created database directory: ${dbDir}`);
}

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding ByteBox database...');
  console.log(`📍 Database location: ${dbPath}`);

  // Create tags with various colors
  const tagReact = await prisma.tag.create({
    data: { name: 'React', color: '#61dafb' },
  });

  const tagTypeScript = await prisma.tag.create({
    data: { name: 'TypeScript', color: '#3178c6' },
  });

  const tagDocker = await prisma.tag.create({
    data: { name: 'Docker', color: '#2496ed' },
  });

  const tagGit = await prisma.tag.create({
    data: { name: 'Git', color: '#f05032' },
  });

  const tagNextJS = await prisma.tag.create({
    data: { name: 'Next.js', color: '#000000' },
  });

  const tagTailwind = await prisma.tag.create({
    data: { name: 'Tailwind', color: '#38bdf8' },
  });

  const tagPython = await prisma.tag.create({
    data: { name: 'Python', color: '#3776ab' },
  });

  const tagAPI = await prisma.tag.create({
    data: { name: 'API', color: '#10b981' },
  });

  const tagDevOps = await prisma.tag.create({
    data: { name: 'DevOps', color: '#f59e0b' },
  });

  const tagTips = await prisma.tag.create({
    data: { name: 'Tips', color: '#ec4899' },
  });

  console.log('✅ Created tags');

  // Create categories
  const catBookmarks = await prisma.category.create({
    data: {
      name: '🔗 Bookmarks',
      description: 'Useful links and resources',
      color: '#ec4899',
      order: 0,
    },
  });

  const catSnippets = await prisma.category.create({
    data: {
      name: '💻 Code Snippets',
      description: 'Reusable code blocks',
      color: '#8b5cf6',
      order: 1,
    },
  });

  const catCommands = await prisma.category.create({
    data: {
      name: '⌨️ Commands',
      description: 'CLI commands and scripts',
      color: '#06b6d4',
      order: 2,
    },
  });

  const catDocs = await prisma.category.create({
    data: {
      name: '📖 Documentation',
      description: 'Reference docs and guides',
      color: '#f59e0b',
      order: 3,
    },
  });

  const catNotes = await prisma.category.create({
    data: {
      name: '📝 Notes',
      description: 'Quick notes and thoughts',
      color: '#a855f7',
      order: 4,
    },
  });

  console.log('✅ Created categories');

  // Create example cards
  
  // Bookmarks
  await prisma.card.create({
    data: {
      type: 'bookmark',
      title: 'React Documentation',
      description: 'Official React docs - hooks, components, and more',
      content: 'https://react.dev',
      categoryId: catBookmarks.id,
      starred: true,
      order: 0,
      tags: { connect: [{ id: tagReact.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'bookmark',
      title: 'TypeScript Handbook',
      description: 'Complete guide to TypeScript',
      content: 'https://www.typescriptlang.org/docs/',
      categoryId: catBookmarks.id,
      order: 1,
      tags: { connect: [{ id: tagTypeScript.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'bookmark',
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework',
      content: 'https://tailwindcss.com/docs',
      categoryId: catBookmarks.id,
      order: 2,
      tags: { connect: [{ id: tagTailwind.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'bookmark',
      title: 'Next.js Docs',
      description: 'The React framework for the web',
      content: 'https://nextjs.org/docs',
      categoryId: catBookmarks.id,
      starred: true,
      order: 3,
      tags: { connect: [{ id: tagNextJS.id }, { id: tagReact.id }] },
    },
  });

  // Code Snippets
  await prisma.card.create({
    data: {
      type: 'snippet',
      title: 'useLocalStorage Hook',
      description: 'Custom React hook for syncing state with localStorage',
      content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      language: 'typescript',
      categoryId: catSnippets.id,
      starred: true,
      order: 0,
      tags: { connect: [{ id: tagReact.id }, { id: tagTypeScript.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'snippet',
      title: 'Gradient Text Effect',
      description: 'Beautiful pink/purple gradient text with Tailwind CSS',
      content: `<h1 className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-bold text-4xl">
  ByteBox ✨
</h1>`,
      language: 'tsx',
      categoryId: catSnippets.id,
      order: 1,
      tags: { connect: [{ id: tagReact.id }, { id: tagTailwind.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'snippet',
      title: 'Debounce Function',
      description: 'Utility function to debounce rapid function calls',
      content: `function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Usage
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);`,
      language: 'typescript',
      categoryId: catSnippets.id,
      order: 2,
      tags: { connect: [{ id: tagTypeScript.id }, { id: tagTips.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'snippet',
      title: 'Python List Comprehension',
      description: 'Examples of Python list comprehensions',
      content: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x % 2 == 0]

# Nested comprehension (flatten 2D list)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ['hello', 'world', 'python']}`,
      language: 'python',
      categoryId: catSnippets.id,
      order: 3,
      tags: { connect: [{ id: tagPython.id }, { id: tagTips.id }] },
    },
  });

  // Commands
  await prisma.card.create({
    data: {
      type: 'command',
      title: 'Docker Cleanup',
      description: 'Remove all stopped containers, unused images, and volumes',
      content: 'docker system prune -af --volumes',
      categoryId: catCommands.id,
      starred: true,
      order: 0,
      tags: { connect: [{ id: tagDocker.id }, { id: tagDevOps.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'command',
      title: 'Git Reset Last Commit',
      description: 'Undo last commit but keep changes staged',
      content: 'git reset --soft HEAD~1',
      categoryId: catCommands.id,
      order: 1,
      tags: { connect: [{ id: tagGit.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'command',
      title: 'Git Interactive Rebase',
      description: 'Squash, reorder, or edit last N commits',
      content: 'git rebase -i HEAD~5',
      categoryId: catCommands.id,
      order: 2,
      tags: { connect: [{ id: tagGit.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'command',
      title: 'Kill Process on Port',
      description: 'Find and kill process using a specific port (macOS/Linux)',
      content: 'lsof -ti:3000 | xargs kill -9',
      categoryId: catCommands.id,
      order: 3,
      tags: { connect: [{ id: tagDevOps.id }, { id: tagTips.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'command',
      title: 'npm Update All Packages',
      description: 'Update all npm packages to their latest versions',
      content: 'npx npm-check-updates -u && npm install',
      categoryId: catCommands.id,
      order: 4,
      tags: { connect: [{ id: tagDevOps.id }] },
    },
  });

  // Documentation
  await prisma.card.create({
    data: {
      type: 'doc',
      title: 'Next.js Server Actions',
      description: 'Guide to using server actions in Next.js 15',
      content: `## Server Actions in Next.js 15

Server Actions allow you to run server-side code directly from client components.

### Basic Example

\`\`\`typescript
'use server'

export async function createCard(formData: FormData) {
  const title = formData.get('title');
  // Runs on the server - safe database access
  await db.card.create({ data: { title } });
}
\`\`\`

### Using with Forms

\`\`\`tsx
<form action={createCard}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
\`\`\`

### Key Benefits
- No API routes needed
- Type-safe with TypeScript
- Automatic form handling
- Progressive enhancement`,
      categoryId: catDocs.id,
      order: 0,
      tags: { connect: [{ id: tagNextJS.id }, { id: tagReact.id }, { id: tagTypeScript.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'doc',
      title: 'REST API Best Practices',
      description: 'Guidelines for designing RESTful APIs',
      content: `## REST API Design Guidelines

### HTTP Methods
- **GET** - Retrieve resources
- **POST** - Create new resources
- **PUT** - Update/replace resources
- **PATCH** - Partial update
- **DELETE** - Remove resources

### Status Codes
- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication required
- 404 Not Found - Resource doesn't exist
- 500 Internal Server Error

### Naming Conventions
- Use nouns, not verbs: \`/users\` not \`/getUsers\`
- Use plural names: \`/cards\` not \`/card\`
- Use kebab-case: \`/user-settings\`
- Version your API: \`/api/v1/users\``,
      categoryId: catDocs.id,
      starred: true,
      order: 1,
      tags: { connect: [{ id: tagAPI.id }, { id: tagTips.id }] },
    },
  });

  // Notes
  await prisma.card.create({
    data: {
      type: 'note',
      title: 'Project Ideas',
      description: 'Random thoughts and brainstorming',
      content: `## 🚀 Project Ideas

### Short Term
- [ ] Build a Chrome extension for quick bookmarking
- [ ] Add markdown editor for better note formatting
- [ ] Explore AI integration for auto-tagging

### Long Term  
- [ ] Research export to Notion/Obsidian
- [ ] Mobile companion app
- [ ] Team collaboration features`,
      categoryId: catNotes.id,
      starred: true,
      order: 0,
      tags: { connect: [{ id: tagTips.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'note',
      title: 'Keyboard Shortcuts',
      description: 'ByteBox keyboard shortcuts to remember',
      content: `## ByteBox Shortcuts

### Global
- **⌘/Ctrl + K** - Quick search
- **⌘/Ctrl + 1-4** - Switch view modes

### View Modes
- **⌘/Ctrl + 1** - All cards
- **⌘/Ctrl + 2** - Recent cards
- **⌘/Ctrl + 3** - Starred cards
- **⌘/Ctrl + 4** - Group by tag

### Cards
- Click card to open details
- Click star to favorite
- Drag to reorder/move between categories`,
      categoryId: catNotes.id,
      order: 1,
      tags: { connect: [{ id: tagTips.id }] },
    },
  });

  await prisma.card.create({
    data: {
      type: 'note',
      title: 'Welcome to ByteBox! 👋',
      description: 'Getting started guide',
      content: `## Welcome to ByteBox!

ByteBox is your developer dashboard for storing:
- 🔗 **Bookmarks** - Save useful URLs
- 💻 **Code Snippets** - Store reusable code
- ⌨️ **Commands** - Keep CLI commands handy
- 📖 **Documentation** - Write reference guides
- 📝 **Notes** - Quick thoughts & ideas

### Quick Tips
1. Click **+ Add Card** to create new content
2. Use **tags** to organize across categories
3. **Star** important cards for quick access
4. **Drag and drop** to reorder cards
5. Use **⌘K** for quick search

Feel free to delete these example cards and add your own! 🎨`,
      categoryId: catNotes.id,
      starred: true,
      order: 2,
    },
  });

  console.log('✅ Created example cards');
  console.log('🎉 ByteBox seeding complete!');
  console.log('');
  console.log('💡 Tip: Delete these example cards and add your own content!');
}

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error('❌ Error seeding database:', e);
  await prisma.$disconnect();
  process.exit(1);
}
