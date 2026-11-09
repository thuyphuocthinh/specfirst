# Plan: phase-delta-artifact

## Approach

Chúng ta sẽ chuẩn hóa mô hình "Phase Delta Artifact & Conversational Staging" vào toàn bộ hệ sinh thái của `speckit-ai`. Giải pháp không yêu cầu thêm dependency hay UI button phức tạp, mà tận dụng sức mạnh của Markdown Artifacts và quy chuẩn hóa prompt/quy tắc trong:
1. `src/lifecycle.js`: Cập nhật hằng số `TASKS_SKELETON` để khi sinh `tasks.md`, AI và developer đều thấy rõ quy tắc Delta Artifact.
2. Templates:
   - `templates/_core/AGENTS.md.tmpl`: Bổ sung rule bất biến `phase-delta-preview`.
   - `templates/_core/specs-workflow.md.tmpl`: Bổ sung quy trình chi tiết tại Step 4, kịch bản tương tác và định dạng mẫu của Delta Artifact.
   - `templates/_skills/spec-plan/SKILL.md`: Hướng dẫn AI trong skill `spec-plan` cách dẫn dắt người dùng thực hiện phase đầu tiên kèm preview.
3. Đồng bộ vào chính repo `speckit-ai`:
   - `.agents/AGENTS.md`
   - `specs/_workflow.md`
   - `.agents/skills/spec-plan/SKILL.md`
4. Unit Tests:
   - Bổ sung test kiểm tra nội dung `TASKS_SKELETON` trong `tests/lifecycle.test.js`.
   - Bổ sung test kiểm tra scaffold trong `tests/scaffolder.test.js`.

## New files

None. (Tính năng này tích hợp sâu vào kiến trúc tài liệu và mã nguồn hiện có của CLI).

## Modified files

- `src/lifecycle.js`: Cập nhật `TASKS_SKELETON` chứa 5 điều khoản về Micro-Phasing và Phase Delta Artifact.
- `templates/_core/AGENTS.md.tmpl`: Bổ sung rule `phase-delta-preview`.
- `templates/_core/specs-workflow.md.tmpl`: Cập nhật Step 4 (Implement) với giao thức đối thoại và bảng kịch bản mẫu.
- `templates/_skills/spec-plan/SKILL.md`: Cập nhật Step 5 & Step 6 hướng dẫn AI preview trước khi code.
- `.agents/AGENTS.md`: Đồng bộ rule `phase-delta-preview` vào repo hiện tại.
- `specs/_workflow.md`: Đồng bộ giao thức vào quy trình làm việc của repo hiện tại.
- `.agents/skills/spec-plan/SKILL.md`: Đồng bộ skill của repo hiện tại.
- `tests/lifecycle.test.js`: Thêm test case xác nhận nội dung `tasks.md` được sinh ra đúng chuẩn mới.
- `tests/scaffolder.test.js`: Thêm test case kiểm tra file scaffold chứa các quy tắc mới.

## Dependencies

None. Không cài đặt thêm bất kỳ package nào ngoài các thư viện chuẩn của Node.js.

## Risks & Mitigations

1. **Risk:** Developer có thể cảm thấy chậm lại nếu phase quá nhỏ mà vẫn phải sinh preview.
   - **Mitigation:** Chỉ rõ trong tài liệu rằng đối với bugfix nhỏ dưới 30 phút, quy trình SDD cho phép fix trực tiếp qua commit message theo quy định tại `specs/_workflow.md` mà không cần spec/phase.
2. **Risk:** AI có thể vi phạm và tự ý sửa file trước khi người dùng chốt lệnh qua chat.
   - **Mitigation:** Đưa quy tắc vào danh mục `Never Bypass` của `AGENTS.md` (mức ưu tiên tối cao của Agent Harness) và lồng vào `TASKS_SKELETON`.
