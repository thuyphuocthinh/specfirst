# Test Cases: software-builder-workflow

## Ma trận kịch bản kiểm thử (Test Matrix)

| TC-ID | Mapped AC | Scenario / Test Case Description | Test Level | Type | Pre-conditions | Test Steps & Test Data | Expected Result |
|:---:|:---:|---|:---:|:---:|---|---|---|
| **TC-01** | AC-1 | Kiểm thử thành công: BA Interactive Interview & BDD Spec Formatting | Unit / Component | Positive | Dữ liệu hợp lệ | Gọi hàm / Action với payload chuẩn | Trả về kết quả mong đợi |
| **TC-02** | AC-1 | Kiểm thử thất bại: BA Interactive Interview & BDD Spec Formatting với dữ liệu không hợp lệ | Unit / Component | Negative | Dữ liệu sai format | Gọi hàm / Action với payload lỗi | Báo lỗi hoặc hiển thị thông báo lỗi phù hợp |
| **TC-03** | AC-1 | Kiểm thử biên (boundary/edge case): BA Interactive Interview & BDD Spec Formatting | Unit / Component | Boundary | Giá trị null/rỗng | Kiểm tra xử lý biên an toàn | Không crash, fallback giá trị mặc định |
| **TC-04** | AC-2 | Kiểm thử thành công: Markdown Handover Contract Ingestion | Unit / Component | Positive | Dữ liệu hợp lệ | Gọi hàm / Action với payload chuẩn | Trả về kết quả mong đợi |
| **TC-05** | AC-2 | Kiểm thử thất bại: Markdown Handover Contract Ingestion với dữ liệu không hợp lệ | Unit / Component | Negative | Dữ liệu sai format | Gọi hàm / Action với payload lỗi | Báo lỗi hoặc hiển thị thông báo lỗi phù hợp |
| **TC-06** | AC-2 | Kiểm thử biên (boundary/edge case): Markdown Handover Contract Ingestion | Unit / Component | Boundary | Giá trị null/rỗng | Kiểm tra xử lý biên an toàn | Không crash, fallback giá trị mặc định |
| **TC-07** | AC-3 | Kiểm thử thành công: Contract-Driven Frontend Scaffold (Types & Mocks) | Unit / Component | Positive | Dữ liệu hợp lệ | Gọi hàm / Action với payload chuẩn | Trả về kết quả mong đợi |
| **TC-08** | AC-3 | Kiểm thử thất bại: Contract-Driven Frontend Scaffold (Types & Mocks) với dữ liệu không hợp lệ | Unit / Component | Negative | Dữ liệu sai format | Gọi hàm / Action với payload lỗi | Báo lỗi hoặc hiển thị thông báo lỗi phù hợp |
| **TC-09** | AC-3 | Kiểm thử biên (boundary/edge case): Contract-Driven Frontend Scaffold (Types & Mocks) | Unit / Component | Boundary | Giá trị null/rỗng | Kiểm tra xử lý biên an toàn | Không crash, fallback giá trị mặc định |
| **TC-10** | AC-4 | Kiểm thử thành công: WBS Task Decomposition with UI States & Traceability | Unit / Component | Positive | Dữ liệu hợp lệ | Gọi hàm / Action với payload chuẩn | Trả về kết quả mong đợi |
| **TC-11** | AC-4 | Kiểm thử thất bại: WBS Task Decomposition with UI States & Traceability với dữ liệu không hợp lệ | Unit / Component | Negative | Dữ liệu sai format | Gọi hàm / Action với payload lỗi | Báo lỗi hoặc hiển thị thông báo lỗi phù hợp |
| **TC-12** | AC-4 | Kiểm thử biên (boundary/edge case): WBS Task Decomposition with UI States & Traceability | Unit / Component | Boundary | Giá trị null/rỗng | Kiểm tra xử lý biên an toàn | Không crash, fallback giá trị mặc định |
| **TC-13** | AC-5 | Kiểm thử thành công: Traceability Verification & Contract Gate | Unit / Component | Positive | Dữ liệu hợp lệ | Gọi hàm / Action với payload chuẩn | Trả về kết quả mong đợi |
| **TC-14** | AC-5 | Kiểm thử thất bại: Traceability Verification & Contract Gate với dữ liệu không hợp lệ | Unit / Component | Negative | Dữ liệu sai format | Gọi hàm / Action với payload lỗi | Báo lỗi hoặc hiển thị thông báo lỗi phù hợp |
| **TC-15** | AC-5 | Kiểm thử biên (boundary/edge case): Traceability Verification & Contract Gate | Unit / Component | Boundary | Giá trị null/rỗng | Kiểm tra xử lý biên an toàn | Không crash, fallback giá trị mặc định |
| **TC-16** | AC-6 | Kiểm thử thành công: Test Cases Specification Generation | Unit / Component | Positive | Dữ liệu hợp lệ | Gọi hàm / Action với payload chuẩn | Trả về kết quả mong đợi |
| **TC-17** | AC-6 | Kiểm thử thất bại: Test Cases Specification Generation với dữ liệu không hợp lệ | Unit / Component | Negative | Dữ liệu sai format | Gọi hàm / Action với payload lỗi | Báo lỗi hoặc hiển thị thông báo lỗi phù hợp |
| **TC-18** | AC-6 | Kiểm thử biên (boundary/edge case): Test Cases Specification Generation | Unit / Component | Boundary | Giá trị null/rỗng | Kiểm tra xử lý biên an toàn | Không crash, fallback giá trị mặc định |

---

## Ghi chú triển khai cho Automation (Phase 4B)
- **Unit / Component Tests**: Bắt buộc triển khai tự động.
- **Playwright E2E Tests**: Chỉ triển khai khi có yêu cầu cụ thể hoặc luồng trọng yếu.
