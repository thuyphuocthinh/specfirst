# Lessons: phase-delta-artifact

> Lessons learned from earlier work on this feature, added by `speckit-ai done`. Read them before changing the feature.

## 2026-11-09 · phase-delta-artifact

- **Language consistency in core templates**: Tất cả các template trong `templates/` của `speckit-ai` phải luôn luôn được viết bằng tiếng Anh vì đây là package npm dùng cho cộng đồng lập trình viên toàn cầu.
- **Escape backticks in template literals**: Khi định nghĩa skeleton string chứa cú pháp markdown (như dấu backtick \`code\`), bắt buộc phải escape backtick cẩn thận để tránh lỗi parse Javascript template string.
- **Conversational Delta Staging efficacy**: Quy trình xuất preview delta (chỉ hiển thị phần code thêm `+`, sửa `~`, xóa `-`) trước mỗi phase giúp quá trình review giữa người dùng và AI diễn ra cực kỳ chính xác, nhẹ nhàng về token và hoàn toàn loại bỏ nguy cơ code-bombing.
