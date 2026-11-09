# Tasks: phase-delta-artifact

> **Micro-Phasing Rules**:
> 1. Mỗi task chỉ tạo hoặc sửa tối đa 2-3 files.
> 2. Sau mỗi Phase: chạy test/lint kiểm tra, dừng lại tóm tắt và xin xác nhận trước khi sang Phase kế tiếp.
> 3. Tuyệt đối không làm one-shot toàn bộ các Phase.

## Phase 1: Setup
- [x] Task 1.1: Cập nhật `templates/_core/AGENTS.md.tmpl` và `.agents/AGENTS.md` bổ sung quy tắc bất biến `phase-delta-preview`.
- [x] Task 1.2: Cập nhật `templates/_core/specs-workflow.md.tmpl` và `specs/_workflow.md` chi tiết hóa giao thức Conversational Phase Staging tại Step 4.

## Phase 2: Logic
- [x] Task 2.1: Cập nhật `TASKS_SKELETON` trong `src/lifecycle.js` với 5 điều khoản hoàn chỉnh về Micro-Phasing và Phase Delta Artifact.
- [x] Task 2.2: Cập nhật `templates/_skills/spec-plan/SKILL.md` và `.agents/skills/spec-plan/SKILL.md` bổ sung chỉ dẫn AI tạo Delta Artifact trước mỗi Phase.

## Phase 3: UI / API
- [x] Task 3.1: Đồng bộ tài liệu hướng dẫn và đảm bảo `speckit-ai status`, `speckit-ai lint` nhận diện trơn tru không phát sinh lỗi cảnh báo.

## Phase 4: Tests
- [x] Task 4.1: Bổ sung unit tests trong `tests/lifecycle.test.js` xác nhận `tasks.md` mới chứa đầy đủ quy tắc `phase-delta-preview`.
- [x] Task 4.2: Bổ sung unit tests trong `tests/scaffolder.test.js` kiểm tra các file scaffold chứa nội dung quy tắc mới.
- [x] Task 4.3: Chạy toàn bộ test suite (`npm test`) đảm bảo 100% test pass không có regression.
