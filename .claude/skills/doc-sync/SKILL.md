---
name: doc-sync
description: Automatically update project documentation (CLAUDE.md, IMPLEMENTATION_PLAN.md, TASKS.md) after modifying code files. Use this skill whenever you edit TypeScript/React files, add features, change architecture, or complete tasks.
allowed-tools: [Read, Edit, Glob, Grep]
---

# Documentation Sync Skill

Keeps project documentation synchronized with the current codebase state.

## Purpose

After editing code files, automatically update project documentation to reflect:
- New components, features, or utilities
- Changed architecture or patterns
- Completed tasks
- Updated file structure

## Instructions

### 1. Detect Changes

When you (Claude) edit/create files, identify what changed:
- New components in `src/features/` or `src/components/`
- New utilities in `src/utils/`
- Changes to data models in `src/types/`
- State management changes in `src/hooks/`
- New exercise definitions in `src/data/`

### 2. Update CLAUDE.md

**Update these sections as needed:**

- **Project Structure**: If new files/folders were added
  ```
  # Check current structure
  Read CLAUDE.md and verify the file tree matches reality
  # Use Glob to discover new files if needed
  ```

- **Architecture**: If patterns changed
  - State management approach
  - Component organization
  - New design patterns introduced

- **Common Patterns**: If new workflows were added
  - "Adding a new feature type..."
  - "Modifying analytics calculations..."

**Keep it concise**: CLAUDE.md should be a quick reference, not exhaustive docs.

### 3. Update IMPLEMENTATION_PLAN.md

Track architectural decisions and completed features:

- Mark completed sections with ✅
- Add notes about implementation details that differed from plan
- Update component status (Planned → In Progress → Completed)
- Document any deviations or new insights

### 4. Update TASKS.md

Synchronize the task list with actual progress:

- Mark completed tasks with `[x]`
- Remove tasks that are no longer relevant
- Add discovered tasks during implementation
- Keep priorities current

### 5. Verify Accuracy

After updating docs:
- Read back the changed sections
- Ensure no outdated information remains
- Check that file paths and line references are correct
- Verify code examples match actual implementation

## When to Use This Skill

**Automatically apply after:**
- Creating new components or features
- Modifying core architecture (state, routing, data flow)
- Completing tasks from TASKS.md
- Adding utilities or helper functions
- Changing data models or types

**Also use when explicitly requested:**
- User says "update docs"
- User finishes a session and says "sync documentation"
- User runs `/doc-sync` (if configured as slash command)

## Examples

### Example 1: New Component Added

```
Code change: Created src/features/ExerciseLibrary.tsx

Documentation updates:
1. CLAUDE.md → Add to Project Structure tree
2. CLAUDE.md → Add to "Feature-based organization" list
3. IMPLEMENTATION_PLAN.md → Mark "Exercise Library" as completed
4. TASKS.md → Check off "[ ] Build exercise library UI"
```

### Example 2: Analytics Helper Added

```
Code change: Added getPRHistory() to src/utils/analyticsHelpers.ts

Documentation updates:
1. CLAUDE.md → Add function to "Analytics Helpers" section
2. CLAUDE.md → Document what it returns and when to use it
3. IMPLEMENTATION_PLAN.md → Note completion of PR tracking feature
```

### Example 3: Type Definition Changed

```
Code change: Modified WorkoutSet type to include notes field

Documentation updates:
1. CLAUDE.md → Update "Data Model Hierarchy" if significant
2. IMPLEMENTATION_PLAN.md → Document schema evolution
3. Note potential migration considerations
```

## Best Practices

1. **Be proactive**: Run this skill after every significant edit session, don't wait for user to ask
2. **Be precise**: Update only what changed, don't rewrite entire docs
3. **Stay concise**: Documentation should be scannable, not exhaustive
4. **Verify accuracy**: Always read current docs before editing to avoid duplicates
5. **Preserve structure**: Maintain existing formatting and organization

## Anti-Patterns (Don't Do This)

- ❌ Rewriting entire documentation files from scratch
- ❌ Adding verbose comments for trivial changes
- ❌ Creating new documentation sections without checking if one exists
- ❌ Documenting implementation details better suited for code comments
- ❌ Updating docs for experimental/temporary changes

## Success Criteria

Documentation is synchronized when:
- File structure in CLAUDE.md matches actual `src/` directory
- All completed features are marked in IMPLEMENTATION_PLAN.md
- TASKS.md reflects current backlog state
- No references to removed/renamed files exist
- New patterns are documented with examples
