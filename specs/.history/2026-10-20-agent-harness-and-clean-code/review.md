# Review: Agent Harness and Clean Code

## 5a. Code Review

- **Clean Code & SOLID**:
  - Module `src/worktree.js` tuân thủ nguyên tắc Single Responsibility: chỉ tập trung vào việc quản lý Git Worktree, tách riêng các helper `isGitRepo`, `branchExists`, `copyConfigFiles`.
  - Mẫu Golden Reference Patterns (`sample.service.js`, `sample.controller.js`, `sample.service.ts`, `sample.controller.ts`) thể hiện chính xác nguyên tắc Clean Architecture, Dependency Injection và Thin Controller.
- **Error Handling & Architecture**:
  - `src/stealth.js` đã xử lý an toàn cả trường hợp `.git` là thư mục (main repo) và `.git` là file (git worktree), tránh lỗi `ENOTDIR`.
  - Không có dead code, không hardcode đường dẫn tuyệt đối; mọi thao tác git đều bọc trong try-catch với message lỗi rõ ràng.
- **Directory Structure & Conventions**:
  - Tuân thủ đúng `docs/structure.md`: logic nằm trong `src/`, templates nằm trong `templates/`, tests nằm trong `tests/`.

## 5b. Test Review

- **Happy Path**:
  - `tests/worktree.test.js`: Kiểm thử đầy đủ quy trình tạo Git Worktree, branch mới, copy config và khởi tạo work SDD.
  - `tests/scaffolder.test.js`: Đã có test kiểm tra việc đưa các file harness và reference patterns vào file map.
  - `tests/cli.test.js`: Đã kiểm tra việc dispatch lệnh `worktree` từ CLI.
- **Edge & Error Cases**:
  - Kiểm thử lỗi khi không truyền title, khi thư mục không phải git repo, khi branch đã tồn tại.
  - Toàn bộ 20 test suites (417 unit tests) chạy độc lập và đều PASS 100%.

## 5e. Summary & Acceptance Criteria Check

- **AC-1**: Pass — Các file harness `CLAUDE.local.md`, `.claude/settings.json`, `.mcp.json`, `.env.example` đã được scaffold đầy đủ; `stealth.js` tự động ignore `CLAUDE.local.md` và `.claude/settings.local.json`.
- **AC-2**: Pass — Đã scaffold thư mục `reference-patterns/` với các ví dụ chuẩn mực tầng Service và Controller cho cả generic và NestJS.
- **AC-3**: Pass — `templates/_core/AGENTS.md.tmpl` đã bổ sung điều khoản bắt buộc tham chiếu Golden Code trong `reference-patterns/` trước khi implement.
- **AC-4**: Pass — `tasks.md` skeleton, `AGENTS.md` và `specs-workflow.md` đều đã cập nhật quy tắc Micro-Phasing (tối đa 2-3 files/task) và quy tắc Stop-and-Verify sau mỗi Phase.
- **AC-5**: Pass — Lệnh CLI `speckit-ai worktree <title>` đã được tích hợp và hoạt động chính xác, tạo branch `feature/<slug>`, copy config và kích hoạt `startWork`.
- **AC-6**: Pass — Tài liệu `docs/tutorials/06-PARALLEL_WORKTREES.md` đã được biên soạn chi tiết, hướng dẫn quy trình chạy đa session song song với Git Worktree.

### Lessons Learned
- Trong Git Worktree, `.git` là một file text chứa chỉ dẫn `gitdir: <path>` chứ không phải là một directory. Bất kỳ thao tác filesystem nào truy cập `.git` (như trong `stealth.js`) cần phân biệt `stat.isDirectory()` và `stat.isFile()` để giải quyết đường dẫn chính xác.
- Khi tạo Git Worktree từ `HEAD`, git chỉ checkout những file đã được commit trong `HEAD`. Do đó trong môi trường test hoặc setup mới, các template và config cần được commit trước khi tạo worktree.
- Việc áp dụng quy tắc Stop-and-Verify và Micro-Phasing trực tiếp vào quy trình làm việc giúp loại bỏ hoàn toàn hiện tượng code-bombing, giữ context gọn gàng và dễ dàng kiểm soát chất lượng qua từng Phase.
