# Spec: Agent Harness and Clean Code

> **Decisions**:
> **Contracts**:

## Overview

Bộ nâng cấp toàn diện cho `speckit-ai` nhằm cung cấp hệ thống "Harness" vững chắc cho các AI Agent (Claude Code, Cursor, Gemini, Copilot) và giải quyết triệt để vấn đề code ẩu, code mất kiểm soát (Code-bombing). Bản nâng cấp bổ sung cấu hình Claude Code (`.claude/`, `CLAUDE.local.md`), công cụ kết nối ngoài (`.mcp.json`), biến môi trường mẫu (`.env.example`), hệ thống Golden Reference Patterns (code mẫu chuẩn Clean Architecture), quy tắc bắt buộc Micro-Phasing ("Stop & Verify" sau mỗi Phase), và lệnh hỗ trợ `worktree` cho phép chạy nhiều Agent song song an toàn.

## Feature Type

- [ ] Small bugfix (< 30 min) — commit message only, no spec needed
- [ ] Simple UI / Logic feature — basic review
- [x] Feature with API / business logic — + test review
- [ ] Sensitive feature (auth, payment, data export) — + security review
- [ ] Large refactor — + performance review

## User Stories

- Là developer, tôi muốn dự án có sẵn cấu hình `.claude/`, `CLAUDE.local.md` và `.mcp.json` để Claude Code và Cursor kết nối công cụ và áp dụng preference cá nhân ngay lập tức mà không làm bẩn git repo chung.
- Là developer, tôi muốn có sẵn các file Golden Reference code mẫu chuẩn mực theo framework để AI (kể cả các model nhỏ/yếu) có ví dụ cụ thể để noi theo, đảm bảo code đầu ra luôn clean và đúng kiến trúc.
- Là developer, tôi muốn AI tuân thủ quy tắc Micro-Phasing (tối đa 2-3 files/task, dừng lại xin review sau mỗi Phase) để tôi không phải review hàng chục file cùng lúc ("code-bombing").
- Là developer, tôi muốn một lệnh CLI đơn giản để tạo Git Worktree cho từng feature, giúp tôi mở 3-5 phiên Agent làm việc độc lập song song mà không bị xung đột code.

## Acceptance Criteria

### AC-1: Scaffold cấu hình Claude Code và Harness files
Given một dự án chạy scaffold với `speckit-ai` (ở cả mode new và existing)
When lệnh init hoàn tất
Then các file harness gồm `CLAUDE.local.md`, `.claude/settings.json`, `.mcp.json` và `.env.example` được tạo ra từ template; file `.git/info/exclude` tự động được thêm `CLAUDE.local.md` và `.claude/settings.local.json` để giữ bảo mật.

### AC-2: Scaffold Golden Reference Patterns (Code mẫu Clean Code)
Given dự án scaffold theo framework nhận diện được hoặc generic
When kiểm tra thư mục `docs/core-principles-and-coding-standards/`
Then xuất hiện thư mục `reference-patterns/` chứa ít nhất một module mẫu hoàn chỉnh (Service, Controller/Handler hoặc Model) minh họa rõ ràng các nguyên tắc Clean Code, Separation of Concerns, DTO validation và Error handling chuẩn mực.

### AC-3: Quy tắc bắt buộc tham chiếu Golden Code trong AGENTS.md
Given template `.agents/AGENTS.md`
When AI đọc quy tắc phát triển mã nguồn
Then có điều khoản bắt buộc: trước khi triển khai bất kỳ module hoặc chức năng mới nào, AI phải đọc file mẫu trong `docs/core-principles-and-coding-standards/reference-patterns/` và tuân thủ đúng cấu trúc phân tầng đã định nghĩa.

### AC-4: Quy tắc Micro-Phasing và Stop-and-Verify trong tasks.md và workflow
Given file `tasks.md` được sinh ra khi chạy `speckit-ai start`
When developer hoặc AI mở kế hoạch thực hiện
Then `tasks.md` skeleton có chỉ dẫn rõ ràng: mỗi task giới hạn thay đổi tối đa 2-3 files, cuối mỗi Phase có bước Checkpoint Verification (chạy unit test/lint); đồng thời `_workflow.md` và `AGENTS.md` nghiêm cấm AI làm one-shot, bắt buộc dừng lại tóm tắt và chờ xác nhận của người dùng sau mỗi Phase.

### AC-5: Lệnh CLI speckit-ai worktree hỗ trợ chạy đa agent song song
Given dự án đã khởi tạo Git
When người dùng chạy lệnh `speckit-ai worktree <feature-title>`
Then CLI tự động:
1. Tạo branch mới `feature/<slug>`
2. Tạo Git worktree tại thư mục song song `../<repo-name>-<slug>`
3. Sao chép các file môi trường cần thiết (`.env`, `.speckitrc`) sang worktree mới
4. Kích hoạt sẵn `speckit-ai start "<feature-title>"` trong worktree đó.

### AC-6: Hướng dẫn Parallel Agent Sessions với Git Worktree
Given thư mục `docs/tutorials/`
When người dùng xem tài liệu hướng dẫn
Then có tài liệu `docs/tutorials/06-PARALLEL_WORKTREES.md` hướng dẫn chi tiết quy trình mở nhiều terminal cho nhiều Agent (Claude, Cursor, Gemini) trên các Git Worktree độc lập, cách đồng bộ và thu dọn worktree sau khi hoàn tất.

## Technical Constraints

- Giữ nguyên tính tương thích ngược: các dự án đã scaffold từ phiên bản 2.x trước vẫn hoạt động bình thường, `speckit-ai upgrade` nhận biết và bổ sung các template mới an toàn.
- Lệnh `worktree` phải kiểm tra môi trường Git: báo lỗi rõ ràng nếu thư mục hiện tại chưa có Git hoặc có uncommitted changes nguy hiểm.
- Không đưa secrets hay API keys thật vào bất kỳ file template nào; `.mcp.json` và `.env.example` chỉ chứa placeholder biến môi trường `${VAR}`.
- Đầy đủ unit tests cho các module mới hoặc được sửa đổi trong `tests/`.

## Out of Scope

- Không tự động cài đặt MCP server binaries hoặc global npm packages cho máy người dùng.
- Không can thiệp vào cấu hình git remote hay tự động push/pull branch lên remote server.
- Không thay đổi các cổng kiểm tra hiện có của lệnh `done` và `lint` trừ khi mở rộng để hỗ trợ các mẫu mới.

## Open Questions

Không còn câu hỏi mở nào.

## Changelog

<!-- Lines are appended by `speckit-ai done`. Do not edit by hand. -->
- 2026-10-20 · agent-harness-and-clean-code · Khi người dùng sử dụng AI coding assistants (Claude Code, Cursor, Gemini, Copilot), thường gặp 3 vấn đề lớn: · review: code, test · chi tiết: .history/2026-10-20-agent-harness-and-clean-code
