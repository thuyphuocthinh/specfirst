# Tasks: Agent Harness and Clean Code

> **Micro-Phasing Rules**: Mỗi task chỉ tạo/sửa tối đa 2-3 files. Sau mỗi Phase, chạy test xác minh trước khi chuyển sang Phase tiếp theo.

## Phase 1: Setup

- [x] Task 1.1: Tạo các template harness cơ bản (`templates/_core/CLAUDE.local.md.tmpl`, `templates/_core/.claude/settings.json.tmpl`, `templates/_core/.mcp.json.tmpl`, `templates/_core/.env.example.tmpl`)
- [x] Task 1.2: Cập nhật `src/stealth.js` để tự động thêm `CLAUDE.local.md` và `.claude/settings.local.json` vào `.git/info/exclude`
- [x] Task 1.3: Tạo các template Golden Reference Patterns (`templates/_core/reference-patterns/sample.service.js.tmpl`, `sample.controller.js.tmpl` và `templates/nestjs/reference-patterns/`)

## Phase 2: Logic

- [x] Task 2.1: Cập nhật `src/scaffolder.js` để đăng ký và scaffold các file harness mới cùng thư mục `reference-patterns/`
- [x] Task 2.2: Cập nhật `src/lifecycle.js` nâng cấp `TASKS_SKELETON` với hướng dẫn Micro-Phasing (tối đa 2-3 files/task) và Checkpoint Verification
- [x] Task 2.3: Tạo module `src/worktree.js` xử lý tạo Git Worktree, copy config cần thiết và khởi tạo work mới

## Phase 3: UI / API

- [x] Task 3.1: Cập nhật `src/cli.js` tích hợp lệnh `speckit-ai worktree <title>`, cập nhật flag validation và bảng hướng dẫn HELP
- [x] Task 3.2: Cập nhật `templates/_core/AGENTS.md.tmpl` và `templates/_core/specs-workflow.md.tmpl` bổ sung quy tắc tham chiếu Golden Code và Stop-and-Verify
- [x] Task 3.3: Viết tài liệu hướng dẫn `docs/tutorials/06-PARALLEL_WORKTREES.md` hướng dẫn chi tiết quy trình chạy đa session song song

## Phase 4: Tests

- [x] Task 4.1: Viết unit tests mới trong `tests/worktree.test.js` kiểm thử toàn diện module worktree (thành công, lỗi branch tồn tại, lỗi non-git)
- [x] Task 4.2: Cập nhật các test suite hiện có (`tests/stealth.test.js`, `tests/scaffolder.test.js`, `tests/cli.test.js`, `tests/lifecycle.test.js`) tương ứng với các thay đổi mới
- [x] Task 4.3: Chạy kiểm thử toàn bộ `npm test` và kiểm tra tính hợp lệ `node bin/index.js lint`
