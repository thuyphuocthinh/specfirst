# Lessons: agent-harness-and-clean-code

> Lessons learned from earlier work on this feature, added by `speckit-ai done`. Read them before changing the feature.

## 2026-10-20 · agent-harness-and-clean-code

- Trong Git Worktree, `.git` là một file text chứa chỉ dẫn `gitdir: <path>` chứ không phải là một directory. Bất kỳ thao tác filesystem nào truy cập `.git` (như trong `stealth.js`) cần phân biệt `stat.isDirectory()` và `stat.isFile()` để giải quyết đường dẫn chính xác.
- Khi tạo Git Worktree từ `HEAD`, git chỉ checkout những file đã được commit trong `HEAD`. Do đó trong môi trường test hoặc setup mới, các template và config cần được commit trước khi tạo worktree.
- Việc áp dụng quy tắc Stop-and-Verify và Micro-Phasing trực tiếp vào quy trình làm việc giúp loại bỏ hoàn toàn hiện tượng code-bombing, giữ context gọn gàng và dễ dàng kiểm soát chất lượng qua từng Phase.
