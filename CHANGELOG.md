# Changelog

All notable changes to `speckit-ai`. Versions before 2.2.0 are described by their git tags and commit messages.

After updating, run `npx speckit-ai upgrade` (add `--apply` to write) to refresh `specs/_workflow.md` and the skills in `.agents/skills/`. Your own `.agents/AGENTS.md` is never changed by the tool: `upgrade` only lists the lines you may want to add.

## 2.6.0 - 2026-11-11

### Added
- Software Builder Workflow & SDLC Standards:
  - **BA Role (`spec-create`)**: Interactive interview protocol asking 3-5 clarification questions (scope, edge cases, personas) and strictly enforcing BDD syntax (`Given / When / Then`) for Acceptance Criteria (`AC-n`).
  - **Backend-to-Frontend Contract Handover (`contracts/`)**: Updated contract template `templates/_core/contracts/_template.md.tmpl` supporting Markdown API documentation, Swagger/OpenAPI URLs, Postman collection paths, and consumer guidance for Mock Service Worker (MSW).
  - **CLI option `--url=<url>` for `generate contract`**: Automatically embeds the Swagger or API documentation link directly into the contract metadata.
  - **WBS 4 UI States Requirement (`spec-plan`)**: Frontend UI task breakdowns in `tasks.md` now explicitly cover the 4 fundamental UI states (*Loading, Empty, Success, Error*) and require traceability tags mapping to `AC-n`.
  - **Test Cases Specification Engine (`test-cases.md`)**:
    - New template `templates/_core/test-cases.md.tmpl` specifying detailed test matrices (Positive, Negative, Boundary, UI states) prior to writing test code.
    - New CLI command `speckit-ai generate test-cases [<name>]` (alias: `speckit-ai g tc`) to generate test case specifications directly from Acceptance Criteria.
    - Testing Pyramid alignment: baseline mandatory Unit/Component testing vs. on-demand/conditional Playwright E2E testing for critical user journeys.
  - **Traceability Verification (`spec-review`)**: Self-review now mandates a Requirements Traceability Matrix (RTM) cross-referencing ACs and Test Case IDs.

## 2.5.0 - 2026-11-09

### Added
- Phase Delta Preview & Conversational Staging Protocol:
  - Step 4 of the SDD workflow (`specs-workflow.md`) now standardizes phase-by-phase execution with Delta Artifact previews (new code `+`, modifications `~`, deletions `-`) presented to the user prior to file changes.
  - Conversational approval: Developers review previews directly in chat and request revisions or approve ("proceed" / "go ahead") without complex UI buttons.
  - `phase-delta-preview` operation rule added to `AGENTS.md` and `templates/_core/AGENTS.md.tmpl` under `Never Bypass`.
  - Prohibition of mid-phase git auto-commits: all intermediate phase changes are preserved in the working directory for clean inspection with `git diff`.
  - Skill `spec-plan` updated to guide AI in generating Delta Artifacts before modifying code for each phase.

### Changed
- `TASKS_SKELETON` in `src/lifecycle.js` updated to enforce `Micro-Phasing Rules & Phase Delta Protocol`.
- `workflow-adding-feature.md` updated with phase preview checklist.

## 2.4.0 - 2026-10-20

### Added
- `speckit-ai worktree <title>`: create a new Git worktree and branch (`feature/<slug>`), copy local config files, and initialize SDD work in parallel without branch conflicts.
- Claude Code & Multi-agent harness templates: `CLAUDE.local.md` (personal preferences), `.claude/settings.json`, `.mcp.json` (Model Context Protocol client configuration), and `.env.example`.
- Golden Reference Patterns: scaffold clean architecture reference modules (`docs/core-principles-and-coding-standards/reference-patterns/`) with clean Service & Controller examples for Generic and NestJS.
- Tutorial 6: `docs/tutorials/06-PARALLEL_WORKTREES.md` explaining parallel agent workflows using Git Worktree.

### Changed
- `src/stealth.js` now automatically ignores `CLAUDE.local.md` and `.claude/settings.local.json`.
- `src/stealth.js` safely supports Git Worktrees (where `.git` is a pointer file with `gitdir:` instead of a directory).
- `TASKS_SKELETON` in `src/lifecycle.js`, `AGENTS.md` template, and `specs-workflow.md` now enforce Micro-Phasing (maximum 2-3 files per task item) and Stop-and-Verify checkpoints after each phase to prevent code-bombing.
- `AGENTS.md` template adds `require-reference-file` pointing to the Golden Reference Patterns.

## 2.3.0 - 2026-10-11

### Added
- `speckit-ai done [<name>] --check`: runs exactly the gates of `done` and reports what is missing, without writing or moving anything. Exit code `0` when ready, `1` otherwise.
- LLM settings (environment or `.env`): `SPECKIT_LLM_TIMEOUT_MS` (default `60000`), `SPECKIT_GEMINI_MODEL`, `SPECKIT_ANTHROPIC_MODEL`, `SPECKIT_OPENAI_MODEL`.
- `CHANGELOG.md`, and a CI workflow that runs the tests on Node 18, 20 and 22 for every push and pull request, plus a smoke test of the packed tarball. The publish workflow now stops when the tag does not match the version in `package.json`.

### Changed
- Calls to the LLM (`--mode=auto`, `handoff`, `review`) now have a timeout and are retried (3 attempts in total, 1 s then 2 s apart) on temporary errors: network errors, timeouts, HTTP 429, 500, 502, 503, 504. Other errors stop at once with the provider's message; an empty or blocked answer is reported with its reason instead of a `TypeError`.
- `review` sends the spec to the model with each unchanged acceptance criterion reduced to its heading when the work changes an existing feature, so the model sees what changed.
- The default Claude model is now `claude-sonnet-5-5` (the old default may have been retired). The Gemini and OpenAI defaults are unchanged; set the environment variable of a provider if its model was retired.
- The Gemini API key is sent in the `x-goog-api-key` header instead of the URL.
- `--mode=auto` checks that the answer has a non-empty `technology` and `projectOverview` before writing anything.

### Fixed
- When several API keys were set, the key of one provider could be sent to another (for example, only `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` set sent the OpenAI key to Claude). The provider is now chosen first (Gemini, then Claude, then OpenAI) and only its own key is used.
- `specs/_workflow.md` no longer contradicts itself about the `## Changelog` of a spec: the single `hotfix` line added when fixing a spec directly is the only hand-written line.

## 2.2.0 - 2026-10-11

### Added
- `done` saves the `### Lessons Learned` section of `review.md` to `specs/features/<slug>/lessons.md`, and `start --affects` prints the path of that file for every affected feature that has one.
- `done` requires `review.md` to mention every new or changed `AC-n` of the targets (all of them for a new feature; for a change to an existing feature, those that are new or differ from the current spec). Bypass with `--force` (recorded in the Changelog).

### Changed
- `review` never passes on changes it has not fully seen: a long diff is split by file and every part must pass; a single file over 15,000 characters stops the command with exit code `1`; new untracked files are included; lock files are not sent; a malformed or contradictory answer of the model counts as failed.
- `handoff` uses the same diff as `review` and warns when the diff is truncated.
- The `AGENTS.md` template splits its reading order into files to read always and files to read when the task needs them.

### Fixed
- The summary in a Changelog line written by `done` no longer loses the words inside backticks.
