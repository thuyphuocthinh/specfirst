# Proposal: Software Builder Workflow

> **Affects**: software-builder-workflow

## Why

Quy trình phát triển phần mềm bằng AI hiện nay thường nhảy thẳng từ câu lệnh (prompt) thô sang viết code, dẫn đến việc thiếu sót yêu cầu nghiệp vụ, lệch pha giữa Frontend và Backend khi bàn giao API, và bỏ qua các trạng thái UI quan trọng (Loading, Error, Empty).

Dự án cần mở rộng quy trình SDD của `speckit-ai` thành một bộ **Software Builder** chuẩn công nghiệp: biến AI IDE thành các vai trò chuyên môn (BA làm rõ nghiệp vụ theo chuẩn BDD/IEEE 29148, Architect tiếp nhận hợp đồng bàn giao Markdown/Swagger từ Backend, Tech Lead phân rã WBS theo trạng thái UI, và QA đối soát nghiệm thu tự động theo Definition of Done).

## What

1. Cập nhật và chuẩn hóa template Contract (`_template.md.tmpl`) hỗ trợ nhận bàn giao Backend bằng file Markdown kèm link Swagger/Postman.
2. Thiết lập quy chuẩn kỹ năng (Skills/Prompts) cho từng Role:
   - **BA Role**: Phỏng vấn làm rõ ý tưởng thô và chuẩn hóa thành Acceptance Criteria (`AC-n: Given/When/Then`).
   - **Architect Role**: Tiếp nhận file bàn giao Contract `.md`, sinh Types/Interfaces và Mock Data cho Frontend làm việc độc lập.
   - **Tech Lead Role**: Phân rã `tasks.md` theo 4 trạng thái UI (Loading, Empty, Success, Error) và gắn mã vết (Traceability) với `AC-n`.
   - **QA Role**: Đối soát ma trận nghiệm thu giữa Code Diff, Test Cases và các `AC-n` trước khi `done`.
3. Tăng cường kiểm tra chặt chẽ tính hợp lệ của Contract và Traceability trong các lệnh CLI (`speckit-ai review`, `speckit-ai done`).
