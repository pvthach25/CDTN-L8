# BUG LOG – SMART CRM L8 – BUỔI 14 / BT3

**Sinh viên:** Phạm Vũ Thạch – 2374802010452  
**Nguyên tắc:** Chỉ ghi bug đã tái hiện thật. Mỗi bug cần bước tái hiện, kết quả mong đợi/thực tế, bằng chứng, cách sửa, kiểm thử hồi quy và **commit sửa riêng**.

## BUG-01 – Cho phép mở lại ticket đã có khảo sát

- **Mức độ:** Medium – ảnh hưởng tính nhất quán dữ liệu nghiệp vụ.
- **Test case liên quan:** BUG-01 – Kiểm tra cập nhật trạng thái ticket đã khảo sát.
- **Môi trường:** Smart CRM L8, Docker BT3, API `localhost:3002`.
- **Bước tái hiện:**
  1. Đăng nhập bằng tài khoản Admin.
  2. Chọn ticket đã có khảo sát CSAT/NPS.
  3. Gửi PUT `/api/tickets/1` với `{"status":"OPEN"}`.
  4. Kiểm tra HTTP và trạng thái ticket.
- **Kết quả mong đợi:** HTTP 409, ticket vẫn CLOSED.
- **Kết quả trước sửa:** HTTP 200, ticket chuyển thành OPEN.
- **Nguyên nhân gốc:** Hàm `ticketService.update()` chưa kiểm tra ticket đã có khảo sát trước khi thay đổi trạng thái.
- **Cách sửa:** Bổ sung kiểm tra `repo.hasSurvey(ticketId)` và từ chối chuyển ticket đã khảo sát sang trạng thái khác CLOSED.
- **Kết quả sau sửa:** HTTP 409, ticket vẫn CLOSED.
- **Ảnh trước sửa:** `docs/screenshots/BUG-01-before.png`
- **Ảnh sau sửa:** `docs/screenshots/BUG-01-after.png`
- **Unit Test:** Chờ xác nhận tổng số PASS sau khi bổ sung test hồi quy.
- **Commit sửa riêng:** https://github.com/pvthach25/CDTN-L8/commit/3ad71ec5a5c7089f5462002ff1d46363e359c3a8
- **Trạng thái:** Đã xác nhận sửa ở mức API; chờ hoàn tất test và commit.

## BUG-02 – Hệ thống chấp nhận ngày đóng phiếu không tồn tại

- **Mức độ:** Medium – ảnh hưởng tính hợp lệ của dữ liệu ngày đóng phiếu.
- **Test case liên quan:** BUG-02 – Reject invalid calendar date.
- **Môi trường / phiên bản:** Smart CRM L8, Node.js 22, Docker Compose, PostgreSQL 17.
- **Bước tái hiện:**
  1. Mở file `tests/ticketService.test.js`.
  2. Tạo ticket có trạng thái `CLOSED`.
  3. Truyền `closed_at = "2026-02-30T10:00:00Z"`.
  4. Chạy `npm test` trong container Docker.
- **Kết quả mong đợi:** Hệ thống từ chối ngày không tồn tại và trả lỗi `INVALID_DATE`.
- **Kết quả thực tế trước sửa:** Hàm `service.create()` chấp nhận ngày 30/02/2026, khiến test FAIL. Kết quả kiểm thử: 19 PASS, 1 FAIL.
- **Ảnh/log trước sửa:** `docs/screenshots/BUG-02-before.png`
- **Nguyên nhân gốc:** Hàm `validateTicket()` sử dụng `Date.parse()` nhưng chưa kiểm tra ngày có thực sự tồn tại trong lịch.
- **Cách sửa:** Bổ sung kiểm tra định dạng ISO 8601 và đối chiếu ngày, tháng, năm bằng đối tượng `Date` để từ chối ngày không tồn tại.
- **Ảnh/test sau sửa:** `docs/screenshots/BUG-02-after.png`
- **Kết quả sau sửa:** Test BUG-02 PASS, toàn bộ 20/20 Unit Test PASS tại thời điểm sửa.
- **Commit sửa riêng:** https://github.com/pvthach25/CDTN-L8/commit/1acdf8f
- **Trạng thái:** Đã sửa, kiểm thử hồi quy PASS và push GitHub.

## BUG-03 – Hệ thống chấp nhận múi giờ không hợp lệ

- **Mức độ:** Medium – ảnh hưởng chất lượng và tính hợp lệ của dữ liệu thời gian.
- **Test case liên quan:** BUG-03 – Reject invalid time zone offset.
- **Môi trường / phiên bản:** Smart CRM L8, Node.js 22, Docker Compose, PostgreSQL 17.
- **Bước tái hiện:**
  1. Mở file `tests/ticketService.test.js`.
  2. Tạo ticket có trạng thái `CLOSED`.
  3. Truyền `closed_at = "2026-11-07T10:00:00+15:00"`.
  4. Chạy `npm test` trong container Docker.
- **Kết quả mong đợi:** Hệ thống từ chối múi giờ vượt quá giới hạn `±14:00` và trả lỗi `INVALID_DATE`.
- **Kết quả thực tế trước sửa:** Hàm `service.create()` chấp nhận múi giờ `+15:00`, khiến test FAIL. Kết quả kiểm thử: 20 PASS, 1 FAIL.
- **Ảnh/log trước sửa:** `docs/screenshots/BUG-03-before.png`
- **Nguyên nhân gốc:** Biểu thức kiểm tra ISO 8601 chưa giới hạn giá trị offset múi giờ; thiếu kiểm tra giờ, phút và giây.
- **Cách sửa:** Bổ sung kiểm tra giờ, phút, giây và giới hạn offset múi giờ không vượt quá `±14:00`.
- **Ảnh/test sau sửa:** `docs/screenshots/BUG-03-after.png`
- **Kết quả sau sửa:** Test BUG-03 PASS, toàn bộ 21/21 Unit Test PASS.
- **Commit sửa riêng:** https://github.com/pvthach25/CDTN-L8/commit/a9a0958
- **Trạng thái:** Đã sửa, kiểm thử hồi quy PASS và push GitHub.

> Mỗi BUG có test tái hiện, ảnh trước/sau sửa và commit riêng. Không gộp nhiều BUG vào cùng một commit.

> Không dùng một commit gộp cho nhiều bug. Không tự tạo bug giả để đủ số lượng.
