# Spec: phase-delta-artifact

> **Decisions**:
> **Contracts**:

## Overview

Tích hợp quy chuẩn "Phase Delta Artifact & Conversational Staging" vào bộ công cụ `speckit-ai`. Giúp lập trình viên kiểm soát 100% mã nguồn AI sẽ chỉnh sửa trước khi áp dụng vào codebase theo từng phase trong `tasks.md`, thông qua preview delta (thêm mới `+`, sửa đổi `~`, xóa bỏ `-`), trao đổi trực tiếp trong chat hội thoại mà không cần nút UI duyệt phức tạp, và không tự động commit git giữa chừng.

## Feature Type

<!-- Check one to determine which review steps are required -->
- [ ] Small bugfix (< 30 min) — commit message only, no spec needed
- [ ] Simple UI / Logic feature — basic review
- [x] Feature with API / business logic — + test review
- [ ] Sensitive feature (auth, payment, data export) — + security review
- [ ] Large refactor — + performance review

## User Stories

- Là developer, tôi muốn AI xuất một bản preview Delta (thêm/sửa/xóa) trước mỗi Phase để tôi kiểm soát chính xác code AI chuẩn bị thay đổi trước khi ghi vào đĩa.
- Là developer, tôi muốn trao đổi và yêu cầu AI tinh chỉnh bản preview trong luồng chat thông thường đến khi ưng ý thì mới chốt lệnh triển khai ("oke làm đi"), không cần giao diện nút bấm phức tạp.
- Là developer, tôi muốn AI không tự động commit git sau mỗi phase, giữ git history sạch sẽ để tôi tự quản lý hoặc để `speckit-ai done` xử lý.
- Là developer, tôi muốn quy tắc này được quy định rõ ràng trong `tasks.md`, `specs-workflow.md`, `AGENTS.md` và skill `spec-plan` của mọi dự án scaffold bởi `speckit-ai`.

## Acceptance Criteria

<!-- One `### AC-n:` block per criterion. Must be testable, measurable, specific.
     `speckit-ai generate tests` reads these headings. -->

### AC-1: Cập nhật TASKS_SKELETON trong lifecycle.js
Given lệnh `speckit-ai start` khởi tạo công việc mới
When file `tasks.md` được tạo ra trong `specs/active/<name>/`
Then phần chỉ dẫn `Micro-Phasing Rules` chứa quy tắc bắt buộc: trước khi sửa code của mỗi Phase, AI phải tạo Delta Preview Artifact chỉ ra code mới `+`, sửa `~`, xóa `-`; chỉ thực thi khi người dùng chốt lệnh qua chat; và không tự động commit git giữa các phase.

### AC-2: Cập nhật template AGENTS.md với rule phase-delta-preview
Given template `templates/_core/AGENTS.md.tmpl` và file `.agents/AGENTS.md`
When AI đọc danh sách quy tắc không thể vi phạm (Operation Rules — Never Bypass)
Then xuất hiện quy tắc `phase-delta-preview`: bắt buộc tạo preview delta trước mỗi phase, chỉ sửa file khi người dùng chốt lệnh ("oke làm đi", "triển khai"), không tự ý git commit giữa chừng.

### AC-3: Cập nhật specs-workflow.md với giao thức hội thoại và kịch bản tương tác
Given tài liệu quy trình `specs/_workflow.md` và template `templates/_core/specs-workflow.md.tmpl`
When xem hướng dẫn tại Step 4 (Implement)
Then có mô tả rõ ràng về giao thức Conversational Phase Staging: định dạng Delta Artifact, các kịch bản đối thoại mẫu (trao đổi/tinh chỉnh vs chốt lệnh), và quy định không dùng nút bấm UI / không auto-commit.

### AC-4: Cập nhật agent skill spec-plan
Given skill `spec-plan` trong `.agents/skills/spec-plan/SKILL.md` và template `templates/_skills/spec-plan/SKILL.md`
When AI tạo kế hoạch `plan.md` và hướng dẫn người dùng bước tiếp theo
Then phần hướng dẫn chỉ định rõ: sau khi có `tasks.md`, người dùng bắt đầu bằng lệnh "Tiến hành Phase 1", AI phải tạo Delta Preview Artifact trước khi can thiệp vào mã nguồn.

### AC-5: Scaffold và Upgrade đồng bộ
Given dự án chạy scaffold mới (`npx speckit-ai`) hoặc nâng cấp (`npx speckit-ai upgrade`)
When các template được chép vào thư mục đích
Then tất cả các file docs, specs và skills chứa đầy đủ các quy tắc Phase Delta Artifact mới mà không bị lỗi cú pháp.

## Technical Constraints

- Không phá vỡ các gate kiểm tra của `speckit-ai lint` và `speckit-ai done`.
- Giữ tương thích CommonJS và Node.js >= 18.
- Unit tests phải cover các thay đổi trong `TASKS_SKELETON` và template scaffolder.

## Out of Scope

- Không xây dựng UI component hoặc interactive button trên web/CLI.
- Không tự động parse AST hay sinh file patch `.diff` nhị phân; định dạng hiển thị là markdown diff snippet trong artifact.

## Open Questions

None

## Changelog

<!-- Lines are appended by `speckit-ai done`. Do not edit by hand. -->
