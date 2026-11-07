# TEST REPORT – SMART CRM L8 – BUỔI 14 / BT3

**Sinh viên:** Phạm Vũ Thạch – 2374802010452  
**Nguồn test case:** [`test-plan.md`](test-plan.md)  
**Trạng thái:** Chưa cập nhật kết quả chạy BT3. Không sử dụng kết quả BT2 thay thế minh chứng BT3.

## 1. Kết quả thực thi

| Test case | Loại kiểm thử | Trạng thái | Ngày chạy | Kết quả thực tế / ghi chú | Ảnh trong `docs/screenshots/` | Bug |
|---|---|---|---|---|---|---|
| TC-01 | Luồng đúng | NOT RUN | — | — | Chưa có | — |
| TC-02 | Luồng đúng | NOT RUN | — | — | Chưa có | — |
| TC-03 | Biên | NOT RUN | — | — | Chưa có | — |
| TC-04 | Biên | NOT RUN | — | — | Chưa có | — |
| TC-05 | Dữ liệu sai | NOT RUN | — | — | Chưa có | — |
| TC-06 | Dữ liệu sai | NOT RUN | — | — | Chưa có | — |
| TC-07 | Bảo mật / chất lượng dữ liệu | NOT RUN | — | — | Chưa có | — |
| TC-08 | Bảo mật / chất lượng dữ liệu | NOT RUN | — | — | Chưa có | — |
| TC-09 | Bảo mật / chất lượng dữ liệu | NOT RUN | — | — | Chưa có | — |
| TC-10 | Tái lập | NOT RUN | — | — | Chưa có | — |

## 2. Tổng hợp BT3
- Số test case trong kế hoạch: **10**.
- Số test case đã chạy và có minh chứng: **0** (chưa có kết quả được cung cấp để xác nhận).
- PASS: **0**.
- FAIL: **0**.
- NOT RUN: **10**.
- Đủ 5 loại kiểm thử có minh chứng: **Chưa**.
- Toàn bộ test PASS bằng một lệnh sau khi sửa bug: **Chưa xác nhận**.

## 3. Thông tin tham khảo từ BT2
Bộ Unit Test BT2 từng được ghi nhận **18/18 PASS** qua `docker compose exec app npm test`, nhưng đây là kết quả của đợt trước, không tự động chứng minh 10 test case BT3 đã chạy. Khi chạy lại, cập nhật kết quả, thời gian và ảnh thật.

## 4. Cách cập nhật
Sau mỗi lần chạy, sửa trạng thái tương ứng thành PASS/FAIL, mô tả kết quả thực tế và đặt ảnh `TC-xx.png` trong `docs/screenshots/`. Nếu phát hiện bug, ghi mã BUG-xx và liên kết tới Bug Log. Không tạo ảnh hoặc kết quả giả.
