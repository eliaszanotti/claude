# Global Guidelines

## Code Style

- Always use 4 spaces indentation (no tabs)
- Avoid using `any` type as much as possible
- Prefer specific and explicit types
- Always separate types in dedicated files, especially when they need to be shared
- Always use pnpm for installations

---

## Architecture-Specific Guidelines

These projects follow specific architecture patterns. See the corresponding skills:

### Next.js Projects

For projects using Next.js, Payload CMS, and the custom form system:

- **Forms**: Use `/nextjs-forms` skill for form patterns
  - `useAppForm`, `useActionState`, `useActionToast` pattern
  - Zod schemas in `src/schemas/`
  - Server actions with proper `ServerActionResult` typing

### Other Stack

(Add other architecture docs here as needed)
