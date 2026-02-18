---
name: memory-manager
description: Memory management workflow for Clawdbot. Handles daily notes creation, long-term memory updates, auto-commit workflow, and memory maintenance. Use when: (1) Creating session notes, (2) Updating long-term memory (MEMORY.md), (3) Committing memory changes to git, or (4) Performing memory cleanup/maintenance.
---

# Memory Manager

## Core Principles

- **Session fresh**: Each session is fresh instance, continuity lives in files
- **Lowercase naming**: `memory.md` not `MEMORY.md`
- **Auto-commit**: Commit after every memory update

## File Structure

```
workspace/
├── MEMORY.md                    # Long-term memory (curated)
└── memory/
    └── YYYY-MM-DD.md           # Daily session notes (raw)
```

## Daily Workflow

### Session Start
1. Read `SOUL.md` → `USER.md` → `MEMORY.md` → `memory/YYYY-MM-DD.md`
2. If no daily file exists, create it with date header

### During Session
- Capture decisions, context, important info in daily notes
- Don't write "mental notes" - write to files

### Session End
- Update `MEMORY.md` if learned something worth keeping
- Commit memory changes

## Commands

### Create Daily Note
```bash
node scripts/create_daily_note.js
```
Creates `memory/YYYY-MM-DD.md` with template.

### Commit Memory
```bash
node scripts/commit_memory.js "commit message"
```
Stages and commits all memory changes, then pushes.

### Memory Maintenance
```bash
node scripts/memory_maintenance.js
```
Reviews recent daily notes and updates MEMORY.md with distilled learnings.

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `scripts/create_daily_note.js` | Create today's daily note |
| `scripts/commit_memory.js` | Commit & push memory changes |
| `scripts/memory_maintenance.js` | Review and distill memory |

## When to Use

- **Trigger**: Session start → create daily note
- **Trigger**: "Remember this" → write to daily notes
- **Trigger**: Learning something important → update MEMORY.md
- **Trigger**: End of session → commit memory
- **Trigger**: "Memory maintenance" or "Clean up memory" → run maintenance

## Anti-Patterns

- Don't use "mental notes" - write to files
- Don't skip commit after memory updates
- Don't use uppercase in memory filenames
- Don't mix raw logs (daily) with curated memory (MEMORY.md)
