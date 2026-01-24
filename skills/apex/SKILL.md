---
name: APEX
description: Execute features using APEX framework (Analyze, Plan, Execute, eXamine) with parallel sub-agents
arguments:
  - name: --pick
    description: Execute a single step without continuing (ex: --pick 001)
    required: false
---

This skill executes features following the **APEX framework**:

- **A**nalyze
- **P**lan
- **E**xecute
- **e**X**amine**

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
4. Ask user confirmation before next step

**IMPORTANT - Start by reading ONLY `skills/apex/step-001-analyze.md` - NO OTHER FILES!**

**NEVER skip a step - ALWAYS execute steps in order.**

## Steps

| Step | Name | File |
|------|------|------|
| 001 | Analyze | step-001-analyze.md |
| 002 | Plan | step-002-plan.md |
| 003 | Execute | step-003-execute.md |
| 004 | eXamine | step-004-examine.md |

## Usage

- `/apex` - Start from step 001, execute full cycle
- `/apex --pick 001` - Execute only step 001 (Analyze)
- `/apex --pick 003` - Execute only step 003 (Execute)

**Start now by reading ONLY `skills/apex/step-001-analyze.md` and NOTHING ELSE.**
