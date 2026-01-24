---
name: apex
description: Execute features using APEX framework (Analyze, Plan, Execute, eXamine, Test) with parallel sub-agents. Use when implementing new features, refactoring code, or completing development tasks.
argument-hint: [step-number] [-a]
---

This skill executes features following the **APEX framework**:

- **A**nalyze
- **P**lan
- **E**xecute
- **e**X**amine**
- **T**est

## Rules

**ALWAYS use APEX for every feature implementation.**
**ALWAYS check all commands before executing them.**

**Use parallel sub-agents** when possible to speed up execution:
- Launch multiple agents in a single message
- Each agent handles an independent task
- Combine results when all complete

## Process

Execute steps ONE BY ONE in numerical order:

1. Read the current step file (ex: step-001-analyze.md)
2. Execute ONLY this step
3. Verify the step is complete
4. **Ask user confirmation before next step** - UNLESS `-a` flag is used

**IMPORTANT - Start by reading ONLY `skills/apex/step-001-analyze.md` - NO OTHER FILES!**

**NEVER skip a step - ALWAYS execute steps in order.**

## Arguments

### `[step-number]` (optional)

Execute only a specific step instead of the full cycle.

**Values:** `001`, `002`, `003`, `004`, or `005`

**Examples:**
- `apex 001` - Execute step 001 (Analyze) only
- `apex 003` - Execute step 003 (Execute) only
- `apex 005` - Execute step 005 (Test) only

### `[-a]` (optional)

Auto mode - skip confirmation prompts and automatically proceed to next step.

**Behavior:**
- **WITHOUT `-a`:** ALWAYS ask for confirmation after each step before proceeding
- **WITH `-a`:** Automatically proceed to next step without asking

**Examples:**
- `apex -a` - Full cycle, auto-advance through all steps
- `apex 003 -a` - Execute step 003 only, no confirmation needed

## Steps

| Step | Name    | File                |
| ---- | ------- | ------------------- |
| 001  | Analyze | step-001-analyze.md |
| 002  | Plan    | step-002-plan.md    |
| 003  | Execute | step-003-execute.md |
| 004  | eXamine | step-004-examine.md |
| 005  | Test    | step-005-test.md    |

## Usage Examples

| Command                    | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `apex`                     | Full cycle with confirmation after each step          |
| `apex -a`                  | Full cycle, auto-advance (no confirmations)           |
| `apex 001`                 | Execute step 001 only with confirmation               |
| `apex 003 -a`              | Execute step 003 only without confirmation             |

**Start now by reading ONLY `skills/apex/step-001-analyze.md` and NOTHING ELSE.**
