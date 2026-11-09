# Proposal: phase-delta-artifact

> **Affects**: phase-delta-artifact

## Why

Khi AI Agent thực hiện code theo các Phase trong `tasks.md`, nếu agent tự động sửa file hàng loạt (batch implementation) mà không có bước xem trước, developer rất dễ gặp tình trạng AI làm lệch kiến trúc, xóa nhầm code hiện có, hoặc làm phát sinh lỗi dây chuyền khó rollback. Việc cung cấp cơ chế "Phase Delta Preview" theo từng Phase (chỉ hiển thị phần thêm `+`, sửa `~`, xóa `-`) dưới dạng Artifact trong hội thoại tự nhiên giúp developer kiểm soát 100% mã nguồn AI sẽ can thiệp trước khi đĩa cứng bị thay đổi.

## What

Tích hợp quy chuẩn **Phase Delta Artifact & Conversational Staging** vào bộ công cụ `speckit-ai`:
1. Cập nhật `TASKS_SKELETON` trong `src/lifecycle.js` để mọi file `tasks.md` sinh ra đều có chỉ dẫn bắt buộc tạo Delta Artifact trước mỗi Phase.
2. Cập nhật `templates/_core/AGENTS.md.tmpl` và `.agents/AGENTS.md` với điều khoản `phase-delta-preview`.
3. Cập nhật `templates/_core/specs-workflow.md.tmpl` và `specs/_workflow.md` bổ sung hướng dẫn giao thức hội thoại, kịch bản tương tác và định dạng delta chuẩn.
4. Cập nhật skill `spec-plan` (cả template và active skill) để điều phối AI tạo preview trước khi code.
5. Bổ sung unit tests kiểm tra tính toàn vẹn của `TASKS_SKELETON` và nội dung scaffold.
