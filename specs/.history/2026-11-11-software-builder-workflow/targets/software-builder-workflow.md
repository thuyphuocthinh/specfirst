# Spec: Software Builder Workflow

> **Decisions**:
> **Contracts**:

## Overview

Mở rộng quy trình SDD của `speckit-ai` thành một bộ khung Software Builder toàn diện, hướng dẫn AI IDE đóng chuẩn các vai trò trong vòng đời phát triển phần mềm (BA phỏng vấn làm rõ yêu cầu theo chuẩn BDD/IEEE 29148, Architect tiếp nhận hợp đồng bàn giao Markdown/Swagger từ Backend cho Frontend, Tech Lead phân rã WBS theo 4 trạng thái UI, và QA nghiệm thu tự động theo Definition of Done).

## Feature Type

<!-- Check one to determine which review steps are required -->
- [ ] Small bugfix (< 30 min) — commit message only, no spec needed
- [ ] Simple UI / Logic feature — basic review
- [x] Feature with API / business logic — + test review
- [ ] Sensitive feature (auth, payment, data export) — + security review
- [ ] Large refactor — + performance review

## User Stories

- As a developer with an initial feature idea, I want the AI to act as a BA asking targeted clarification questions and structuring requirements into BDD Acceptance Criteria (AC-n), so that requirements are clear and unambiguous before planning.
- As a frontend developer receiving a backend handover document in Markdown format (containing API descriptions and Swagger links), I want to ingest this document as a Contract so that the AI can automatically extract types, mocks, and UI state tasks without waiting for live backend deployment.
- As a tech lead, I want the AI to decompose tasks according to the 4 essential UI states (Loading, Empty, Success, Error) and map them directly to Acceptance Criteria, so that execution is structured and traceable.
- As a QA engineer, I want the AI to design detailed test cases (test-cases.md) before writing test code, so that edge cases and negative paths are clearly specified and reviewed.
- As a QA engineer / reviewer, I want the AI and CLI to verify that each Acceptance Criterion is covered by tests and matches the contract specification, so that we prevent regressions and deliver enterprise-grade quality.

## Acceptance Criteria

### AC-1: BA Interactive Interview & BDD Spec Formatting
Given an initial raw idea or user prompt,
When the BA role workflow is triggered,
Then it asks 3-5 clarification questions covering scope, edge cases, and user personas, and formats the final spec with `### AC-n:` following Given/When/Then (BDD format).

### AC-2: Markdown Handover Contract Ingestion
Given a Backend handover document in Markdown format containing API descriptions and Swagger/Postman links,
When placed or ingested into `specs/contracts/<name>.md`,
Then `speckit-ai` validates the contract structure (Provider, Consumer, Endpoints, Schemas, Error Handling) and allows referencing it via `> **Contracts**: <name>` in the feature spec.

### AC-3: Contract-Driven Frontend Scaffold (Types & Mocks)
Given an active feature referencing a valid Markdown contract,
When planning frontend implementation (`plan.md` / `tasks.md`),
Then the plan extracts API data models into TypeScript/JSDoc types and generates mock data specifications for offline frontend development.

### AC-4: WBS Task Decomposition with UI States & Traceability
Given a target spec with defined `### AC-n:` criteria,
When `tasks.md` is generated,
Then UI tasks explicitly cover the 4 fundamental UI states (Loading, Empty, Success, Error) and each task references the specific `AC-n` it fulfills.

### AC-5: Traceability Verification & Contract Gate
Given an active work with contracts and acceptance criteria,
When running `speckit-ai done --check` or `speckit-ai review`,
Then it verifies that referenced contracts exist on disk, checks that every `AC-n` is evaluated in `review.md`, and fails closed if any contract or AC is unmet.

### AC-6: Test Cases Specification Generation
Given an active feature with Acceptance Criteria (and optional contracts),
When test design is performed (via AI skill or `speckit-ai generate test-cases`),
Then it generates a structured `test-cases.md` document with test scenarios covering Positive, Negative, Boundary, Security, and UI states, distinguishing between baseline Unit/Component tests and optional E2E Playwright tests.

## Technical Constraints

- Pure Node.js >= 18, zero heavy runtime dependencies, CommonJS.
- Compatible with standard Markdown spec files and `templates/_core/contracts/_template.md.tmpl`.
- Seamless integration with existing `speckit-ai` lifecycle (`start`, `lint`, `done`, `review`).

## Out of Scope

- Building a standalone web GUI or SaaS server (maintains CLI + AI IDE skill focus).
- Writing automated network crawlers for external private Swagger instances requiring proprietary auth.
- Implementing live code execution sandboxes inside the CLI itself (delegated to standard test runners like Jest).

## Open Questions

<!-- All questions resolved during requirement clarification -->

## Changelog

<!-- Lines are appended by `speckit-ai done`. Do not edit by hand. -->
