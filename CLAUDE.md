# Project Guidelines

## Server Actions & Forms

- Utiliser exclusivement `useActionState` (jamais `useFormState`)

## Data Fetching

- All fetch requests must be done server-side only
- Create a separate file for each fetch in /data folder of the same directory
- Always use unstable_cache or cache mechanism
- Example pattern: /next/src/app/(frontend)/intervenant/data/getQuestionSets.ts

## Components Architecture

- Components are server-side by default
- Server components NEVER end with "Server"
- Client components MUST ALWAYS end with "Client"
- Always use shadcn/ui components when possible
- For forms, always use https://ui.shadcn.com/docs/components/field

## TypeScript & Code Style

- Always use 4 spaces indentation (no tabs)
- Avoid using `any` type as much as possible
- Prefer specific and explicit types
- Always separate types in dedicated files, especially when they need to be shared

## Package Management

- Always use pnpm for installations
