---
name: Step 005
description: Test
previousstep: step-004-examine.md
nextstep: null
---

# 005 - Test

## Objective

Run comprehensive tests to ensure the feature works correctly and code quality is maintained.

## Actions

1. **Check available tools** - Verify which tools are available in the project:
   - Check if `npx tsc --noEmit` is available (TypeScript)
   - Check if `pnpm lint` is available (Linter)
   - Check if `pnpm knip` is available (Unused code detector)

2. **Run tests based on available tools**:

   **If TypeScript is available:**
   ```bash
   npx tsc --noEmit
   ```

   **If Lint is available:**
   ```bash
   pnpm lint
   ```

   **If Knip is available:**
   ```bash
   pnpm knip
   ```

3. **Test the feature manually** - Verify all functionality works as expected

4. **Check for edge cases** - Test boundary conditions and error scenarios

5. **Run existing test suite** if available (`pnpm test` or similar)

## Output

- All test results (TypeScript, Lint, Knip)
- List of any errors or warnings found
- Confirmation that the feature works correctly

## Completion Checklist

Before marking APEX cycle complete, verify:

- [ ] Available tools have been checked
- [ ] `npx tsc --noEmit` has been run (if available)
- [ ] `pnpm lint` has been run (if available)
- [ ] `pnpm knip` has been run (if available)
- [ ] All TypeScript errors are fixed (if any)
- [ ] All linting errors are fixed (if any)
- [ ] All unused code issues are addressed (if any)
- [ ] Feature has been manually tested
- [ ] Edge cases have been tested
- [ ] User has verified the feature works

**DO NOT mark cycle complete until ALL items above are verified.**

---

**When complete, ask user: "Step 005 (Test) complete. APEX cycle finished. Anything else needed?"**
