---
name: skill-creator
description: Create new Claude Code skills following best practices. Use when the user wants to create a new skill or asks about creating skills.
argument-hint: [skill-name]
allowed-tools: Bash, Write, Read, Edit
disable-model-invocation: true
---

# Skill Creator

Creates a new Claude Code skill following best practices from the official documentation.

## Usage

```
/skill-creator [skill-name]
```

The skill name will be used for:
- The directory name: `~/.claude/skills/[skill-name]/`
- The slash command: `/[skill-name]`
- Display name in the skill menu

## What This Skill Does

1. Creates the skill directory structure
2. Generates a complete `SKILL.md` with proper frontmatter
3. Creates optional supporting files (template.md, examples/)
4. Follows Claude Code skill best practices

## Directory Structure Created

```
~/.claude/skills/[skill-name]/
├── SKILL.md           # Main skill file (required)
├── template.md        # Template for Claude to fill in (optional)
├── examples/
│   └── sample.md      # Example output showing expected format (optional)
└── scripts/           # Scripts Claude can execute (optional)
```

## Frontmatter Best Practices

All generated skills include:

```yaml
---
name: skill-name                    # Becomes /slash-command
description: What this skill does   # Helps Claude decide when to use it
argument-hint: [arg1] [arg2]        # Shown in autocomplete
allowed-tools: Tool1, Tool2         # Tools allowed without permission
disable-model-invocation: true      # Prevent auto-invocation for actions
user-invocable: true                # Show in / menu (default: true)
---
```

## Skill Types

Choose the appropriate type based on usage:

### Reference Content (Knowledge)
- Adds conventions, patterns, domain knowledge
- Claude applies to current work automatically
- **Keep `disable-model-invocation: false`** (default)
- Example: API conventions, coding standards

### Task Content (Actions)
- Step-by-step instructions for specific actions
- User invokes directly with `/skill-name`
- **Set `disable-model-invocation: true`**
- Example: deploy, commit, generate-crud

## Control Who Can Invoke

| Frontmatter | User can invoke | Claude can invoke | Use for |
|-------------|-----------------|-------------------|---------|
| (default) | Yes | Yes | General-purpose skills |
| `disable-model-invocation: true` | Yes | No | Actions with side effects (deploy, commit) |
| `user-invocable: false` | No | Yes | Knowledge base only |

## Best Practices

1. **Keep SKILL.md under 500 lines** - move detailed reference to separate files
2. **Use descriptive description** - helps Claude decide when to load the skill
3. **Use `$ARGUMENTS`** placeholder for user input
4. **Add supporting files** - reference them from SKILL.md when needed
5. **Test the skill** - invoke with `/skill-name` and verify behavior

## Template Format

```markdown
---
name: my-skill
description: Brief description of what this skill does and when to use it
argument-hint: [optional-arg]
---

# Skill Name

Brief overview of what this skill does.

## Usage

Run with: `/my-skill $ARGUMENTS`

## Instructions

Step-by-step instructions for Claude to follow...

## Additional Resources

- For details, see [reference.md](reference.md)
- For examples, see [examples/sample.md](examples/sample.md)
```

## Creating the Skill

When invoked, this skill will:

1. Ask for the skill name (if not provided as argument)
2. Ask for the skill description
3. Ask for the skill type (reference or task)
4. Create the directory structure
5. Generate SKILL.md with appropriate frontmatter
6. Optionally create template.md or examples/

## After Creation

Test your new skill:
```
/[skill-name] test-arguments
```

Verify it appears in:
```
/help
```

Or check available skills:
```
What skills are available?
```
