---
title: Contributing
description: Contribution process and expectations for ByteBox.
---

ByteBox welcomes fixes, features, docs improvements, and design refinements.

## Before You Start

- Read project goals and architecture docs.
- Sync your local branch with latest mainline.
- Run full quality gate locally before opening PR.

## Contribution Flow

1. Fork or branch from latest code.
2. Implement focused changes.
3. Run lint, typecheck, and build.
4. Open PR with clear summary and validation notes.

## PR Expectations

- Explain user-facing impact.
- Include screenshots/GIFs for UI changes.
- Mention schema or migration implications.
- Keep scope focused (avoid unrelated refactors).

## Coding Guidelines

- TypeScript-first, strongly typed updates.
- Reuse existing UI patterns and utility conventions.
- Keep API contracts explicit and documented.
- Preserve keyboard and accessibility behavior.

## Commit Guidance

Use clean, imperative commit messages with clear scope.

Examples:

- `feat(api): add tag color validation`
- `fix(electron): handle migration path resolution`
- `docs(starlight): add Cloudflare Pages deploy guide`

## Community Standards

- Be respectful and specific in review feedback.
- Prioritize clarity over cleverness.
- Leave the codebase easier to understand than you found it.

For full template-level details, see the root project’s `CONTRIBUTING.md`.
