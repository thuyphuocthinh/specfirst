---
name: spec-create
description: Start a piece of work and write the SDD spec from user requirements (new feature, change to existing features, or just save an idea). Trigger when the user says "create spec for feature", "write spec", "start new feature", "add an idea".
---

# Skill: Create Spec (spec-create)

## When to trigger

When the user wants to start a new feature, change existing features, or note an idea for later.

Example trigger phrases:
- "Create spec for feature: ..."
- "Write spec for ..."
- "Start new feature: ..."
- "Change the auth feature to support ..."
- "Note an idea: ..."

## Process

### Step 0 — Just an idea?

If the user only wants to note something for later, run:

```
npx speckit-ai idea "<title>"
```

Fill in the Problem and Rough Scope (and `Depends-on` / `Affects` if known), then stop.

### Step 1 — Identify missing information

Act as a Senior Business Analyst (BA). When presented with a raw idea or prompt, conduct a concise interactive interview asking 3-5 clarification questions:
- **Core Scope & Primary Flow**: Who is the user and what is the exact happy path?
- **Edge Cases & Failure Modes**: What happens on network timeout, invalid input, or empty results?
- **Non-functional Requirements**: Performance, authentication, authorization, data privacy constraints.
- **Out of Scope**: What should explicitly NOT be built in this iteration?

> Only ask about what is genuinely unclear. Do not ask about things already stated in the request.

### Step 2 — Determine Feature Type

Classify the feature based on the description:
- Small bugfix (< 30 min) → commit message only, no spec needed (see `specs/_workflow.md`, "Bugs and hotfixes")
- Simple UI / Logic feature → basic review
- Feature with API / business logic → + test review
- Sensitive feature (auth, payment, data export) → + security review
- Large refactor → + performance review

### Step 3 — Start the work

```
npx speckit-ai start "<title>"                          # a new feature (or the name of an idea)
npx speckit-ai start "<title>" --affects=auth,order     # change existing features
npx speckit-ai start "<title>" --baseline               # write the spec of code that already exists
```

This creates `specs/active/<name>/` with `proposal.md`, `tasks.md` and `targets/`. For existing features, `targets/` holds a copy of each spec to edit. Never edit `specs/features/*/spec.md` directly for a real change.

When you used `--affects`, `start` prints the path of `specs/features/<slug>/lessons.md` for each affected feature that has one: read it before editing the spec.

Use `--baseline` when the code already exists and the user only wants its spec: read the code, describe its **current** behavior in `targets/<feature>.md` (no tasks, plan or review are needed), then run `done`. `--baseline` cannot be combined with `--affects`.

### Step 4 — Write the spec in `targets/<feature>.md`

Follow the structure of `specs/_template.md`. Ensure:

**Overview**: 2-3 sentences, clear, no unnecessary jargon.

**Feature Type**: Check the correct type to determine the review steps needed.

**Acceptance Criteria**: One heading per criterion, `### AC-1: <short name>`, strictly structured using BDD syntax:
- `Given <precondition>`
- `When <action>`
- `Then <observable result>`

Each criterion must be:
- Testable (verifiable by automated test or verifiable manual check)
- Specific (no ambiguity)
- Measurable

Good example: `When uploading a file > 5MB → return 400 error with message "File too large"`
Bad example: `Upload works correctly`

**Open Questions**: List anything unclear that must be confirmed before coding as `- [ ] question`. Resolve them (`- [x]`) or remove them before implementing. If none → leave this section empty.

Replace every `<placeholder>` from the template. Leave `## Changelog` as it is: `done` writes it.

### Step 5 — Report

After writing the spec, notify the user:
- Path to the spec file(s) just written
- Summary of feature type and review steps required
- Next step: "Type 'create plan from this spec' to continue"
