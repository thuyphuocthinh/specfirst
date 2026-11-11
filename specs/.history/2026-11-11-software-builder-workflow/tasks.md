# Tasks: Software Builder Workflow

> **Micro-Phasing Rules & Phase Delta Protocol**:
> 1. Limit each task item to creating or modifying at most 2-3 files.
> 2. Before modifying code for each Phase: AI MUST generate a Delta Artifact preview (showing new code `+`, modified `~`, deleted `-`) for user review via chat.
> 3. Only implement changes to disk after the user explicitly approves ("proceed" / "go ahead").
> 4. Do not auto-commit git between phases. After completing each Phase: run tests/lint, update tasks.md, and wait for the next Phase instruction.
> 5. Never one-shot all phases in a single turn.

## Phase 1: Setup

- [x] Task 1.1: Cập nhật template `templates/_core/contracts/_template.md.tmpl` hỗ trợ link Swagger/Postman, request/response models, và hướng dẫn bóc tách UI states. (Phục vụ AC-2)
- [x] Task 1.2: Cập nhật tài liệu quy trình `specs/_workflow.md` mô tả chuẩn quy trình Software Builder (BA interview, BE->FE contract handover, WBS 4 UI states). (Phục vụ AC-1, AC-2, AC-4)

## Phase 2: Logic

- [x] Task 2.1: Cập nhật kỹ năng BA trong `templates/_skills/spec-create/SKILL.md` và `.agents/skills/spec-create/SKILL.md` với quy trình phỏng vấn 3-5 câu hỏi làm rõ nghiệp vụ và định dạng BDD Given/When/Then. (Phục vụ AC-1)
- [x] Task 2.2: Cập nhật kỹ năng Architect & Tech Lead trong `templates/_skills/spec-plan/SKILL.md` và `.agents/skills/spec-plan/SKILL.md` với hướng dẫn bóc tách contract Markdown (types/mocks) và phân rã WBS theo 4 trạng thái UI (Loading, Empty, Success, Error). (Phục vụ AC-3, AC-4)
- [x] Task 2.3: Cập nhật kỹ năng QA trong `templates/_skills/spec-review/SKILL.md` và `.agents/skills/spec-review/SKILL.md` với ma trận đối soát nghiệm thu (Traceability Matrix) cho từng AC-n. (Phục vụ AC-5)

## Phase 3: UI / API

- [x] Task 3.1: Nâng cấp `src/generator.js` hỗ trợ tạo contract có tùy chọn chèn link tài liệu API / Swagger. (Phục vụ AC-2)
- [x] Task 3.2: Cập nhật `src/cli.js` bổ sung mô tả và hướng dẫn cho lệnh sinh contract chuẩn bàn giao. (Phục vụ AC-2)

## Phase 4: Tests

- [x] Task 4.1: Viết unit tests trong `tests/software-builder.test.js` kiểm tra generator sinh contract đúng cấu trúc bàn giao và kiểm tra các gatekeeper xác thực AC-n. (Phục vụ AC-2, AC-5)
- [x] Task 4.2: Chạy toàn bộ test suite (`npm test`) và linter (`node bin/index.js lint`) đảm bảo 100% test pass và không có regression. (Phục vụ AC-5)

## Phase 5: Test Cases Specification Engine (AC-6)

- [x] Task 5.1: Tạo template `templates/_core/test-cases.md.tmpl` và cập nhật skills (`spec-plan`, `spec-review`) hướng dẫn AI sinh kịch bản `test-cases.md` trước khi code test. (Phục vụ AC-6)
- [x] Task 5.2: Bổ sung hàm `generateTestCases` trong `src/generator.js` và lệnh `generate test-cases` (alias `tc`) trong `src/cli.js`. (Phục vụ AC-6)
- [x] Task 5.3: Bổ sung unit test trong `tests/software-builder.test.js` kiểm tra sinh `test-cases.md` và chạy full test suite + lint. (Phục vụ AC-6)
