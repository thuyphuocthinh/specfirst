# Technical Plan: Software Builder Workflow

## Approach

Để biến `speckit-ai` thành một **Software Builder** chuẩn quy trình công nghiệp mà không làm phình to codebase hay phụ thuộc vào framework bên ngoài, giải pháp được thiết kế theo mô hình **2 tầng bổ trợ (Two-tier Architecture)**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Tầng Kỹ Năng & Hướng Dẫn (Templates & Skills)            │
│    - BA Interview (BDD ACs)                                │
│    - Backend Handover Contract (Markdown + Swagger link)     │
│    - WBS Task Breakdown (4 UI States: Load/Empty/Success/Err)│
│    - Traceability Matrix (Mapping AC-n <-> Tests)           │
├─────────────────────────────────────────────────────────────┤
│ 2. Tầng Cổng Kiểm Duyệt Tự Động (CLI & Automation Engine)    │
│    - src/generator.js: Hỗ trợ sinh contract chuẩn bàn giao   │
│    - src/linter.js: Kiểm tra hợp lệ cấu trúc Contract & Spec │
│    - src/done.js: Fail-closed gatekeeper cho DoD            │
└─────────────────────────────────────────────────────────────┘
```

Phương pháp này giữ cho `speckit-ai` tiếp tục là công cụ gọn nhẹ (zero heavy dependencies), chạy trực tiếp trong bất kỳ AI IDE nào (Cursor, Windsurf, Claude Code, Antigravity) mà vẫn đảm bảo tính kỷ luật cao nhất của Software Engineering.

---

## New Files

1. `tests/software-builder.test.js`
   - Unit tests kiểm tra tính năng sinh Contract chuẩn bàn giao (có Swagger link), kiểm tra linter xác thực các mục mới trong Contract, và kiểm tra Gatekeeper xác thực độ phủ của Acceptance Criteria.
2. `templates/_core/test-cases.md.tmpl`
   - Template tài liệu đặc tả kịch bản kiểm thử (`test-cases.md`) bao gồm bảng ma trận kiểm thử: TC-ID, Mapped AC, Scenario, Test Level (Unit/Component vs E2E Playwright), Type, Steps & Data, Expected Result.

---

## Modified Files

1. `templates/_core/contracts/_template.md.tmpl`
   - Cập nhật khuôn mẫu Contract để tối ưu cho việc Backend bàn giao sang Frontend: bổ sung mục `Swagger / Postman Collection URL`, hướng dẫn mô tả request/response payload, mã lỗi, và mock data.

2. `templates/_skills/spec-create/SKILL.md` & `.agents/skills/spec-create/SKILL.md`
   - Bổ sung quy trình đóng vai **Senior BA**: Đặt 3-5 câu hỏi phỏng vấn làm rõ nghiệp vụ (phạm vi, người dùng, edge cases) trước khi sinh `targets/*.md` và bắt buộc định dạng BDD (`### AC-n: Given/When/Then`).

3. `templates/_skills/spec-plan/SKILL.md` & `.agents/skills/spec-plan/SKILL.md`
   - Bổ sung quy trình đóng vai **Architect & Tech Lead**: Hướng dẫn bóc tách file Contract `.md` của Backend thành TypeScript/JSDoc types, dữ liệu Mock, và phân rã checklist `tasks.md` bao phủ đủ **4 trạng thái UI bắt buộc** (*Loading, Empty, Success, Error*).

4. `templates/_skills/spec-review/SKILL.md` & `.agents/skills/spec-review/SKILL.md`
   - Bổ sung quy trình đóng vai **QA Engineer**: Lập bảng ma trận đối soát (Traceability Matrix) xác nhận Pass/Fail cho từng `AC-n` và đối chiếu độ khớp với Contract trước khi đóng feature.

5. `src/generator.js`
   - Nâng cấp hàm `generate('contract', ...)` hỗ trợ tùy chọn chèn link tài liệu API / Swagger khi tạo contract.
   - Bổ sung hàm `generateTestCases(name, targetDir)` đọc `targets/*.md` sinh ra file tài liệu kịch bản `test-cases.md`.

6. `src/cli.js`
   - Cập nhật Help text và xử lý flag cho lệnh sinh contract chuẩn bàn giao.
   - Bổ sung subcommand `generate test-cases` (alias: `tc`).

7. `docs/core-principles-and-coding-standards/instructions-and-work-flows/sdd-workflow.md` (hoặc `specs/_workflow.md`)
   - Cập nhật tài liệu hướng dẫn quy trình Software Builder (Handover flow giữa BE và FE).

---

## Dependencies

- **Không cài đặt thêm package mới** (tuân thủ nguyên tắc `no-install-unknown-pkg` và `docs/technology.md`). Sử dụng thuần các module built-in của Node.js (`fs`, `path`).

---

## Risks & Mitigations

1. **Risk 1**: Các file Contract cũ không có mục Swagger link hoặc UI states có thể bị linter báo lỗi sai nếu kiểm tra quá nghiêm ngặt.
   - *Mitigation*: Mục `Swagger / API Documentation URL` là tùy chọn (`[Optional]`), linter chỉ kiểm tra cấu trúc section cốt lõi (`Overview`, `Endpoints / Interfaces`, `Data Models`, `Error Handling`).

2. **Risk 2**: AI IDE có thể tự ý code trước khi người dùng kịp xem hoặc duyệt tài liệu bàn giao.
   - *Mitigation*: Duy trì nghiêm ngặt nguyên tắc **Phase Delta Preview** và **Human-in-the-loop** trong `AGENTS.md`: Mọi thay đổi code đều phải được người dùng xác nhận rõ ràng qua chat trước khi sửa file thực tế.
