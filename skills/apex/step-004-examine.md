---
name: Step 004
description: eXamine
previousstep: step-003-execute.md
nextstep: step-005-test.md
---

# 004 - eXamine

## Objective

Verify the implementation and ensure quality.

## Actions

1. **Review the implementation** - Check against requirements from Step 001
2. **Run code quality checks** - Verify code correctness:
   - Check if `npx tsc --noEmit` is available (TypeScript)
   - Check if `pnpm lint` is available (Linter)
   - Check if `pnpm knip` is available (Unused code detector)

   **Run available checks:**
   ```bash
   npx tsc --noEmit  # TypeScript type checking
   pnpm lint         # Linter
   pnpm knip         # Unused code detector
   ```

3. **Check for issues**:
   - Bugs or edge cases
   - Performance concerns
   - Code quality issues
   - TypeScript errors (fix if any)
   - Linting errors (fix if any)
   - Unused code (address if any)
4. **Document changes** if needed

## Output

- Feature verification complete
- Code quality check results (TypeScript, Lint, Knip)
- List of any issues found (if any)
- Confirmation that acceptance criteria are met

## Completion Checklist

Before proceeding to next step, verify:

- [ ] Implementation matches requirements from Step 001
- [ ] Available code quality tools have been checked
- [ ] `npx tsc --noEmit` has been run (if available)
- [ ] `pnpm lint` has been run (if available)
- [ ] `pnpm knip` has been run (if available)
- [ ] All TypeScript errors are fixed (if any)
- [ ] All linting errors are fixed (if any)
- [ ] All unused code issues are addressed (if any)
- [ ] Feature has been tested and works correctly
- [ ] No critical bugs or issues found
- [ ] Code quality is acceptable
- [ ] Acceptance criteria from Step 001 are met

**DO NOT proceed to next step until ALL items above are complete.**

---

**When complete, ask user: "Step 004 (eXamine) complete. Ready to proceed to Step 005 (Test)?"**
