# Plan: Agent Harness and Clean Code

> **Feature**: `agent-harness-and-clean-code`  
> **Target Spec**: `specs/active/agent-harness-and-clean-code/targets/agent-harness-and-clean-code.md`

---

## 1. Approach

Bản nâng cấp này xây dựng một hệ sinh thái harness hoàn chỉnh và giải quyết vấn đề code thiếu kiểm soát bằng cách kết hợp giữa **Template Scaffolding**, **Deterministic CLI Tooling** và **Quy tắc cứng (Hard Constraints)** trong quy trình SDD:

1. **Harness & Secret Management**:
   - Mở rộng `scaffolder.js` để tự động tạo `CLAUDE.local.md`, `.claude/settings.json`, `.mcp.json` và `.env.example`.
   - Cập nhật `stealth.js` để tự động thêm các file cá nhân (`CLAUDE.local.md`, `.claude/settings.local.json`) vào `.git/info/exclude`, đảm bảo không bị commit lên git chung.
   - Giữ nguyên cơ chế Cross-Agent: `.agents/skills/` vẫn là Single Source of Truth cho mọi model (Claude, Cursor, Gemini, Copilot).

2. **Golden Reference Patterns (Clean Code Example)**:
   - Bổ sung thư mục mẫu `reference-patterns/` trong `templates/_core/` (cho generic) và các framework tương ứng (ví dụ NestJS, Next.js, Node-Express).
   - Thư mục này chứa code mẫu chuẩn mực (Service, Controller/Handler) với cấu trúc phân tầng rõ ràng, dependency injection, DTO validation, xử lý domain error và unit test mẫu.
   - Thêm điều khoản bắt buộc vào `templates/_core/AGENTS.md.tmpl`: AI bắt buộc phải đọc file mẫu trong `reference-patterns/` trước khi code logic.

3. **Chống "Code-Bombing" qua Micro-Phasing & Stop-and-Verify**:
   - Cập nhật `TASKS_SKELETON` trong `src/lifecycle.js`:
     * Quy tắc: Mỗi checkbox task chỉ sửa đổi tối đa 2-3 files.
     * Thêm Checkpoint Verification vào cuối mỗi Phase.
   - Cập nhật `templates/_core/AGENTS.md.tmpl` và `templates/_core/specs-workflow.md.tmpl`: Cấm AI one-shot toàn bộ feature, bắt buộc AI dừng lại sau mỗi Phase để chạy test/lint và xin xác nhận của người dùng trước khi chuyển sang Phase kế tiếp.

4. **Git Worktree Helper Command & Tutorial**:
   - Tạo module mới `src/worktree.js` và tích hợp lệnh `speckit-ai worktree <title>` vào `src/cli.js`.
   - Lệnh tự động:
     1. Kiểm tra Git repo và working tree.
     2. Tạo git branch `feature/<slug>`.
     3. Tạo worktree song song tại `../<repo>-<slug>`.
     4. Sao chép `.env`, `.speckitrc` sang thư mục worktree.
     5. Khởi tạo `speckit-ai start "<title>"` ngay trong worktree đó.
   - Viết hướng dẫn `docs/tutorials/04-parallel-sessions-with-worktrees.md`.

---

## 2. New Files

| Đường dẫn file | Mục đích |
|---|---|
| `templates/_core/CLAUDE.local.md.tmpl` | Template cấu hình cá nhân của dev cho Claude Code (tự động ignore). |
| `templates/_core/.claude/settings.json.tmpl` | Cấu hình mặc định permissions và ignore cho Claude Code. |
| `templates/_core/.mcp.json.tmpl` | Cấu hình kết nối Model Context Protocol mẫu (PostgreSQL, Filesystem, GitHub, Fetch). |
| `templates/_core/.env.example.tmpl` | Mẫu khai báo biến môi trường chuẩn. |
| `templates/_core/reference-patterns/sample.service.js.tmpl` | Mẫu Clean Code tầng Service (Generic / JavaScript). |
| `templates/_core/reference-patterns/sample.controller.js.tmpl` | Mẫu Clean Code tầng Controller / Handler (Generic / JavaScript). |
| `templates/nestjs/reference-patterns/sample.service.ts.tmpl` | Mẫu Clean Code tầng Service chuẩn NestJS. |
| `templates/nestjs/reference-patterns/sample.controller.ts.tmpl` | Mẫu Clean Code tầng Controller chuẩn NestJS. |
| `src/worktree.js` | Module xử lý logic tạo Git Worktree, copy config và khởi tạo work. |
| `docs/tutorials/04-parallel-sessions-with-worktrees.md` | Tài liệu hướng dẫn quy trình chạy đa session song song với Git Worktree. |
| `tests/worktree.test.js` | Unit tests cho module `src/worktree.js`. |

---

## 3. Modified Files

| Đường dẫn file | Mô tả thay đổi |
|---|---|
| `src/stealth.js` | Bổ sung `CLAUDE.local.md`, `.claude/settings.local.json` vào `STEALTH_ENTRIES`. |
| `src/scaffolder.js` | Cập nhật `buildFileMap()` để scaffold thêm các file harness mới và thư mục `reference-patterns/`. |
| `src/lifecycle.js` | Cập nhật `TASKS_SKELETON` với hướng dẫn Micro-Phasing (tối đa 2-3 files/task) và Checkpoint Verification sau mỗi phase. |
| `src/cli.js` | Thêm sub-command `worktree` vào parser và dispatcher, cập nhật `--help`. |
| `templates/_core/AGENTS.md.tmpl` | Bổ sung quy tắc bắt buộc tham chiếu Golden Reference Code và quy tắc Stop-and-Verify sau mỗi Phase. |
| `templates/_core/specs-workflow.md.tmpl` | Cập nhật quy trình Micro-Phasing, quy định giới hạn file/task và hướng dẫn worktree. |
| `tests/stealth.test.js` | Test các entry mới trong stealth mode. |
| `tests/scaffolder.test.js` | Test scaffold các file harness mới và reference-patterns. |
| `tests/cli.test.js` | Test dispatch lệnh `worktree` và cờ liên quan. |
| `tests/lifecycle.test.js` | Test template `tasks.md` skeleton mới. |

---

## 4. Dependencies

* **Không cần cài thêm dependency mới**: Toàn bộ thao tác Git Worktree sử dụng built-in `child_process.execSync` tương tự như `src/gitdiff.js`; thao tác file/thư mục dùng `fs` và `path` có sẵn trong Node.js.

---

## 5. Risks & Mitigations

1. **Rủi ro tương thích Git Worktree trên Windows (Path separators & Git binary)**:
   * *Nguy cơ:* Ký tự `\` trên Windows có thể làm lỗi lệnh Git CLI khi tạo path `../<repo>-<slug>`.
   * *Giải pháp:* Sử dụng `path.resolve()` và chuẩn hóa path sang format POSIX hoặc bọc quote cẩn thận trong `execSync`.
2. **Rủi ro xung đột Git Branch / Worktree đã tồn tại**:
   * *Nguy cơ:* Người dùng chạy `worktree <title>` hai lần với cùng tiêu đề sẽ gây lỗi Git fail.
   * *Giải pháp:* Kiểm tra branch và đường dẫn worktree trước khi chạy lệnh git; nếu đã tồn tại thì báo lỗi thân thiện kèm hướng dẫn dọn dẹp (`git worktree remove`).
3. **Rủi ro phá vỡ cổng kiểm tra `done.js`**:
   * *Nguy cơ:* Thay đổi `TASKS_SKELETON` có thể làm hỏng logic đếm checkbox `[ ]` trong `src/done.js`.
   * *Giải pháp:* Cấu trúc comment và heading trong `TASKS_SKELETON` không dùng checkbox giả (`- [ ]`), chỉ dùng hướng dẫn dạng blockquote `>` hoặc text prose để `done.js` parse chính xác 100%.
