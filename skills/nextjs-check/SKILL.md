---
name: nextjs-check
description: Run code quality checks on Next.js projects (knip, tsc, lint) and display a consolidated report
argument-hint:
allowed-tools: Bash
user-invocable: true
---

# Next.js Check

Run code quality checks on Next.js projects and display a consolidated report without auto-fixing.

## Commands Executed

1. **pnpm knip** (if present) - Detects unused files, dependencies, and exports
2. **npx tsc --noEmit** - TypeScript type checking
3. **pnpm lint** - ESLint code quality checks

## Instructions

When this skill is invoked, execute the following steps:

### Step 1: Check if knip is available

Run `pnpm knip --help` to check if knip is installed. If the command fails, skip knip and note it in the report.

### Step 2: Run all checks

Execute each command in parallel (independent commands):
- `pnpm knip` (if available)
- `npx tsc --noEmit`
- `pnpm lint`

### Step 3: Generate the report

Display a consolidated report in this format:

```
## Next.js Check Report

### TypeScript (tsc --noEmit)
[Exit code: X]
[Output summary - number of errors or OK]

### ESLint (pnpm lint)
[Exit code: X]
[Output summary - number of errors/warnings or OK]

### Knip (unused files/deps)
[Exit code: X or SKIPPED if not available]
[Output summary - number of issues or OK]

---
Total: X error(s), Y warning(s), Z unused items
```

### Important Notes

- **DO NOT auto-fix anything** - only report the issues
- If a command passes (exit code 0), show a brief success message
- If a command fails, show the relevant output
- Keep the report concise but include all error locations
- Knip is optional - skip gracefully if not installed

## Usage

Run with: `/nextjs-check`

Claude can also invoke this skill automatically when working on Next.js projects before commits or PRs.
