# 🤝 Contributing to ByteBox

First off, **thank you** for considering contributing to ByteBox! 🎉 Your help is essential for making this project even better.

ByteBox is a community-driven project, and we welcome contributions from everyone — whether you're fixing a bug, adding a feature, improving documentation, or suggesting ideas.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

**TL;DR:** Be respectful, inclusive, and constructive. We're all here to build something awesome together.

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

If you find a bug, please **open an issue** with the following details:

1. **Title** — A clear, concise summary of the bug
2. **Description** — What happened? What did you expect to happen?
3. **Steps to Reproduce** — How can we reproduce the bug?
4. **Environment** — OS, browser, Node.js version, etc.
5. **Screenshots/Logs** (if applicable) — Visual evidence or error logs

**Before submitting:**
- Check if the issue already exists
- Search [closed issues](https://github.com/your-username/bytebox/issues?q=is%3Aissue+is%3Aclosed) to see if it was resolved

**Template:**
```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. macOS 13.2]
- Browser: [e.g. Chrome 120]
- Node.js: [e.g. 18.17.0]
- ByteBox Version: [e.g. 1.0.0]

## Screenshots
If applicable, add screenshots to help explain your problem.

## Additional Context
Add any other context about the problem here.
```

---

### ✨ Suggesting Features

Have an idea for a new feature? Awesome! **Open an issue** with:

1. **Title** — A clear feature name
2. **Problem Statement** — What problem does this solve?
3. **Proposed Solution** — How should it work?
4. **Alternatives** (optional) — Other ways to solve it
5. **Mockups/Examples** (optional) — Visual aids or code examples

**Before submitting:**
- Check if a similar feature request already exists
- Discuss the idea in [Discussions](https://github.com/your-username/bytebox/discussions) first

**Template:**
```markdown
## Feature Request

### Problem
A clear and concise description of the problem or need.

### Proposed Solution
A clear and concise description of what you want to happen.

### Alternatives Considered
A clear and concise description of any alternative solutions or features you've considered.

### Additional Context
Add any other context, mockups, or examples here.
```

---

### 🔀 Submitting Pull Requests

We ❤️ pull requests! Here's how to contribute code:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/bytebox.git`
3. **Create a branch**: `git checkout -b feature/my-awesome-feature`
4. **Make your changes** (see [Coding Guidelines](#coding-guidelines))
5. **Test your changes** (run `npm run lint` and `npx tsc --noEmit`)
6. **Commit** your changes (see [Commit Message Guidelines](#commit-message-guidelines))
7. **Push** to your fork: `git push origin feature/my-awesome-feature`
8. **Open a Pull Request** on GitHub

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** (or **pnpm** / **yarn**)
- **Git**

### Setup Steps

1. **Fork & Clone** the repository
```bash
git clone https://github.com/your-username/bytebox.git
cd bytebox
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up the Database**
```bash
# Create .env file
echo 'DATABASE_URL="file:./dev.db"' > .env

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# (Optional) Seed the database with example data
npm run db:seed
```

4. **Start the Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Tests & Checks**
```bash
npm run lint        # ESLint check
npx tsc --noEmit    # TypeScript type check
npm run build       # Build for production
```

---

## 📝 Coding Guidelines

### General Principles
- **Follow existing code style** — Consistency is key
- **Keep it simple** — Avoid over-engineering
- **Write clean, readable code** — Future you (and others) will thank you
- **Test your changes** — Ensure nothing breaks

### TypeScript
- Use **TypeScript** for all new code
- Define **types and interfaces** explicitly
- Avoid `any` — use proper types or `unknown`
- Use **named exports** instead of default exports (when possible)

### React & Next.js
- Use **functional components** with hooks
- Keep components **small and focused**
- Use **Server Components** by default (add `'use client'` only when needed)
- Follow [Next.js 16 App Router](https://nextjs.org/docs) best practices

### Tailwind CSS
- Use **Tailwind 4.x** utility classes
- Follow the **Pink Pixel design system** (pink/purple gradients)
- Use `cn()` utility for conditional classes
- Keep custom CSS minimal — prefer Tailwind utilities

### File Structure
- **Components** → `/src/components/[category]/ComponentName.tsx`
- **API Routes** → `/src/app/api/[resource]/route.ts`
- **Utilities** → `/src/lib/utils/utilityName.ts`
- **Types** → `/src/types/index.ts`

### Naming Conventions
- **Files** — PascalCase for components, camelCase for utilities
- **Components** — PascalCase (e.g., `CardModal.tsx`)
- **Functions** — camelCase (e.g., `formatDate`)
- **Types/Interfaces** — PascalCase (e.g., `CardType`, `Category`)
- **Constants** — UPPER_SNAKE_CASE (e.g., `MAX_TAGS`)

---

## 📝 Commit Message Guidelines

We follow the **Conventional Commits** spec for clear commit history.

### Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types
- **feat** — New feature
- **fix** — Bug fix
- **docs** — Documentation changes
- **style** — Code style changes (formatting, missing semi-colons, etc.)
- **refactor** — Code refactoring (no functional changes)
- **perf** — Performance improvements
- **test** — Adding or updating tests
- **chore** — Maintenance tasks (dependencies, config, etc.)

### Examples
```bash
feat(search): add keyboard shortcut Cmd+K for global search
fix(drag-drop): prevent card duplication when dragging between boards
docs(readme): update installation instructions
style(ui): fix button hover state colors
refactor(api): simplify card update logic
perf(db): optimize tag query with indexes
test(cards): add unit tests for CRUD operations
chore(deps): update tailwindcss to 4.1.16
```

---

## 🔄 Pull Request Process

1. **Create a PR** with a clear title and description
2. **Link related issues** (e.g., "Closes #123")
3. **Ensure all checks pass** (lint, typecheck, build)
4. **Request a review** from maintainers
5. **Address feedback** if requested
6. **Squash commits** (if asked) before merging

### PR Template
```markdown
## Description
A clear and concise description of what this PR does.

## Related Issue
Closes #<issue_number>

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation Z

## Screenshots (if applicable)
Add screenshots or GIFs showing the changes.

## Checklist
- [ ] Code follows project coding guidelines
- [ ] Linter passes (`npm run lint`)
- [ ] TypeScript typecheck passes (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing completed
- [ ] Documentation updated (if needed)
```

---

## 🌍 Community

### Getting Help
- **Discussions** — [GitHub Discussions](https://github.com/your-username/bytebox/discussions)
- **Discord** — @sizzlebop
- **Email** — admin@pinkpixel.dev

### Staying Updated
- **Watch** the repository for updates
- **Star** ⭐ the repo to show support
- **Share** 🚀 with fellow developers

### Code Review Etiquette
- Be **respectful and constructive**
- Focus on **the code, not the person**
- Provide **clear explanations** for requested changes
- Use **"We" instead of "You"** (e.g., "We could simplify this..." instead of "You should simplify this...")

---

## 💖 Thank You!

Your contributions make ByteBox better for everyone. Whether it's a bug report, feature idea, or pull request — **every contribution counts**!

**Made with ❤️ by [Pink Pixel](https://pinkpixel.dev)**

**Dream it, Pixel it** ✨

---

_For more information, see the [README](./README.md) and [CHANGELOG](./CHANGELOG.md)._
