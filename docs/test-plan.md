# TEST PLAN – SMART CRM L8 – BUỔI 14 / BT3

**Dự án:** Smart CRM – Khảo sát CSAT/NPS (L8)  
**Track:** Software Engineering (SE)  
**Sinh viên:** Phạm Vũ Thạch – 2374802010452  
**Trạng thái:** Kế hoạch kiểm thử; chưa đồng nghĩa đã chạy hoặc PASS.

## 1. Mục tiêu và phạm vi
Kiểm tra luồng tạo/đóng phiếu bảo hành, khảo sát CSAT/NPS, kiểm tra dữ liệu đầu vào, bảo vệ API và khả năng tái lập hệ thống bằng Docker Compose. Kết quả phải ghi đúng theo lần chạy thực tế.

## 2. Môi trường
- Docker Desktop và Docker Compose.
- Backend Express, Frontend React, PostgreSQL theo `compose.yaml`.
- Tài khoản Admin được tạo bằng `scripts/create-admin.js` theo README.
- Minh chứng: mỗi test case cần ảnh chụp thực tế trong `docs/screenshots/`.

## 3. Danh sách test case

| ID | Loại | Thao tác / dữ liệu kiểm thử | Kết quả mong đợi | Ảnh minh chứng dự kiến |
|---|---|---|---|---|
| TC-01 | Luồng đúng | Đăng nhập, tạo phiếu OPEN, chuyển CLOSED, gửi CSAT=5/NPS=9 | Khảo sát được lưu, hiển thị ở danh sách/chi tiết | `TC-01.png` |
| TC-02 | Luồng đúng | Xem danh sách và chi tiết khảo sát đã tạo | Hiển thị dữ liệu đúng từ API | `TC-02.png` |
| TC-03 | Biên | Gửi CSAT=1, NPS=0 cho phiếu CLOSED chưa khảo sát | Chấp nhận giá trị biên thấp | `TC-03.png` |
| TC-04 | Biên | Gửi CSAT=5, NPS=10 cho phiếu CLOSED chưa khảo sát | Chấp nhận giá trị biên cao | `TC-04.png` |
| TC-05 | Dữ liệu sai | Gửi CSAT=0 hoặc CSAT=6 | API từ chối, không ghi dữ liệu sai | `TC-05.png` |
| TC-06 | Dữ liệu sai | Gửi NPS=-1 hoặc NPS=11 | API từ chối, không ghi dữ liệu sai | `TC-06.png` |
| TC-07 | Bảo mật / chất lượng dữ liệu | Truy cập API được bảo vệ khi thiếu Bearer Token | Từ chối truy cập trái phép | `TC-07.png` |
| TC-08 | Bảo mật / chất lượng dữ liệu | Khảo sát lần thứ hai trên cùng `ticket_id` | HTTP 409, không phát sinh khảo sát trùng | `TC-08.png` |
| TC-09 | Bảo mật / chất lượng dữ liệu | Khảo sát phiếu đang OPEN | Bị từ chối theo quy tắc nghiệp vụ | `TC-09.png` |
| TC-10 | Tái lập | Dựng Docker trên môi trường/volume mới, chạy kiểm thử bằng một lệnh | Dịch vụ hoạt động, migration/seed thành công, kết quả test ghi nhận được | `TC-10.png` |

**Lưu ý:** TC-03 và TC-04 phải dùng các phiếu CLOSED **khác nhau**, chưa có khảo sát. Không xóa volume chứa dữ liệu cần giữ. Không đánh dấu PASS khi chưa chạy và chụp ảnh.

## 4. Tiêu chí và cách ghi kết quả
- **PASS:** kết quả thực tế đúng mong đợi và có ảnh minh chứng.
- **FAIL:** kết quả khác mong đợi; lưu ảnh/log, lập Bug Log khi xác nhận lỗi.
- **NOT RUN:** chưa thực hiện hoặc thiếu minh chứng; không tính PASS.
- Mỗi test case ghi ngày chạy, môi trường, kết quả, ảnh và bug liên quan trong `test-report.md`.
