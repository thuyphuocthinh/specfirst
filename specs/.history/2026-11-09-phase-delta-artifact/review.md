# Review: phase-delta-artifact

## 1. Code Review

- **Conventions & Standards**: Tuân thủ đúng kiến trúc CommonJS, Node.js native fs/promises, không phát sinh dependency mới.
- **Language Consistency**: Đảm bảo 100% nội dung trong các template (`templates/_core/`, `templates/_skills/`) và tài liệu workflow được viết bằng tiếng Anh chuẩn xác, chuyên nghiệp.
- **Micro-phasing & Blast Radius**: Mọi thay đổi đều được phân tách tuần tự qua 4 Phase, kiểm tra diff trước khi áp dụng.

## 2. Test Review

- **Unit Test Coverage**:
  - `tests/lifecycle.test.js`: Kiểm tra `TASKS_SKELETON` sinh ra chứa đúng các quy tắc `Micro-Phasing Rules & Phase Delta Protocol`, `Delta Artifact preview`, và cấm auto-commit.
  - `tests/scaffolder.test.js`: Kiểm tra quy trình scaffold dự án tạo ra các file `AGENTS.md`, `specs/_workflow.md`, và skill `spec-plan` chứa đầy đủ chỉ dẫn Phase Delta.
- **Regression Testing**: Toàn bộ 20/20 test suites (419 tests) chạy thành công 100% (`PASS`).

## 3. Summary & Acceptance Criteria Validation

- **AC-1**: Pass. `TASKS_SKELETON` trong `src/lifecycle.js` đã được cập nhật 5 điều khoản rõ ràng bằng tiếng Anh.
- **AC-2**: Pass. Rule `phase-delta-preview` đã được thêm vào danh mục `Never Bypass` của `templates/_core/AGENTS.md.tmpl` và `.agents/AGENTS.md`.
- **AC-3**: Pass. `templates/_core/specs-workflow.md.tmpl` và `specs/_workflow.md` đã được bổ sung phần mô tả chi tiết giao thức Conversational Phase Delta Protocol tại Step 4.
- **AC-4**: Pass. Skill `spec-plan` (cả template và file dự án) đã cập nhật hướng dẫn AI xuất Delta Artifact trước mỗi Phase.
- **AC-5**: Pass. Scaffold và upgrade đồng bộ trơn tru, được kiểm chứng qua `scaffolder.test.js`.

### Lessons Learned

- **Language consistency in core templates**: Tất cả các template trong `templates/` của `speckit-ai` phải luôn luôn được viết bằng tiếng Anh vì đây là package npm dùng cho cộng đồng lập trình viên toàn cầu.
- **Escape backticks in template literals**: Khi định nghĩa skeleton string chứa cú pháp markdown (như dấu backtick \`code\`), bắt buộc phải escape backtick cẩn thận để tránh lỗi parse Javascript template string.
- **Conversational Delta Staging efficacy**: Quy trình xuất preview delta (chỉ hiển thị phần code thêm `+`, sửa `~`, xóa `-`) trước mỗi phase giúp quá trình review giữa người dùng và AI diễn ra cực kỳ chính xác, nhẹ nhàng về token và hoàn toàn loại bỏ nguy cơ code-bombing.
