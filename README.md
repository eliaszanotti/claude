# Claude Code Configuration

This repository contains the personal configuration for [Claude Code](https://claude.com/claude-code), Anthropic's official CLI for Claude.

## Configuration

- **CLAUDE.md** - Global instructions and project guidelines applied to all conversations

## Guidelines Overview

The configuration enforces the following practices:

### Server Actions & Forms
- Exclusively use `useActionState` (never `useFormState`)

### Data Fetching
- All fetch requests must be done server-side only
- Create a separate file for each fetch in `/data` folder
- Always use `unstable_cache` or cache mechanism

### Components Architecture
- Components are server-side by default
- Server components NEVER end with "Server"
- Client components MUST ALWAYS end with "Client"
- Always use shadcn/ui components when possible
- For forms, always use [shadcn/ui Field](https://ui.shadcn.com/docs/components/field)

### TypeScript & Code Style
- Always use 4 spaces indentation (no tabs)
- Avoid using `any` type as much as possible
- Prefer specific and explicit types
- Always separate types in dedicated files, especially when they need to be shared

### Package Management
- Always use pnpm for installations
