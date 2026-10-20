# Proposal: Agent Harness and Clean Code

> **Affects**: agent-harness-and-clean-code

## Why

Khi người dùng sử dụng AI coding assistants (Claude Code, Cursor, Gemini, Copilot), thường gặp 3 vấn đề lớn:
1. Thiếu harness chuyên sâu: Chưa hỗ trợ chuẩn cấu hình mới của Claude Code (`.claude/`, `CLAUDE.local.md`), thiếu template kết nối công cụ ngoài (`.mcp.json`) và biến môi trường mẫu (`.env.example`).
2. Thiếu ví dụ mẫu về Clean Code (Golden References): Khi bắt đầu feature, model nhỏ/yếu không biết thế nào là "clean code" theo chuẩn của dự án, dẫn tới sinh code bừa bãi, không đúng kiến trúc.
3. Vấn nạn "Code-bombing": AI có xu hướng code ồ ạt hàng chục file trong 1 prompt khiến người dùng không thể review nổi, dễ sinh bug tiềm ẩn; đồng thời thiếu quy trình chạy song song (parallel sessions) an toàn bằng Git Worktree.

## What

Nâng cấp `speckit-ai` để hỗ trợ hệ thống harness hoàn chỉnh và kiểm soát chất lượng code:
1. Scaffold cấu hình harness mới: Thêm `CLAUDE.local.md`, `.claude/settings.json`, `.mcp.json` và `.env.example`, đồng thời cập nhật stealth mode.
2. Thêm Golden Reference Patterns: Scaffold thư mục mẫu Clean Code `docs/core-principles-and-coding-standards/reference-patterns/` theo framework để làm chuẩn đối chiếu cho AI.
3. Bổ sung quy tắc Micro-Phasing & Stop-and-Verify: Cập nhật `tasks.md`, `AGENTS.md` và `_workflow.md` giới hạn tối đa 2-3 files/task, bắt buộc AI dừng lại sau mỗi Phase để chạy test và chờ xác nhận.
4. Lệnh hỗ trợ Git Worktree: Thêm lệnh `speckit-ai worktree <feature>` và tài liệu hướng dẫn chạy đa agent song song.
