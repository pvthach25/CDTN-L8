# Nhật ký thay đổi thiết kế – BT1 đến BT2

**Dự án:** Smart CRM – Khảo sát mức độ hài lòng khách hàng (L8)  
**Sinh viên:** Phạm Vũ Thạch – 2374802010452  
**Track:** Software Engineering (SE)  
**Học phần:** Chuyên đề Tốt nghiệp 1 – HK1 2026–2027  
**Phạm vi yêu cầu:** 7 User Story (US1–US7), 6 Use Case (UC01–UC06)

## 1. Mục đích

Tài liệu ghi nhận phản hồi của giảng viên sau BT1, các quyết định điều chỉnh thiết kế, lý do kỹ thuật và kết quả triển khai/kiểm chứng trong BT2. Phân biệt rõ **đã kiểm chứng bằng mã nguồn hoặc kết quả chạy** với **cần đối chiếu lại tài liệu**; không xem một quyết định được ghi trong nhật ký là bằng chứng rằng tất cả file đã được cập nhật.

## 2. Phản hồi BT1 và quyết định xử lý

| STT | Phản hồi BT1 | Quyết định và lý do kỹ thuật | Trạng thái/đối chiếu |
|---|---|---|---|
| 1 | Sơ đồ Use Case, kiến trúc và ERD thiếu chú thích ký hiệu | Bổ sung chú thích các ký hiệu được dùng để người đọc hiểu quan hệ và thành phần | Cần mở các file `.drawio` để xác nhận chú thích |
| 2 | Sơ đồ Use Case thiếu mã UC01–UC06 | Gắn mã UC tương ứng với đặc tả SRS nhằm truy vết yêu cầu | Cần đối chiếu sơ đồ Use Case với SRS |
| 3 | `survey_response` chỉ có cột `score` dù CSAT/NPS khác thang điểm | Tách `csat_score` (1–5) và `nps_score` (0–10), tránh nhầm lẫn dữ liệu | **Đã kiểm chứng ở backend**: service kiểm tra hai miền điểm; khảo sát thực tế lưu cả hai. Cần đối chiếu bản ERD/SRS mới nhất |
| 4 | UC01 tham chiếu US3–US5 chưa khớp mục 1.3 | Đối chiếu và chỉnh mã US tham chiếu, giữ phạm vi 7 US và 6 UC | Cần kiểm tra lại đặc tả và bảng truy vết |
| 5 | ERD còn `Row 1`, `Row 2`, `Row 3` ở CUSTOMER | Thay nhãn mặc định bằng trường thực tế để khớp DDL | Cần xác nhận trực tiếp trong `docs/erd.drawio` |
| 6 | Khóa chính TICKET ghi `UniqueID` chưa thống nhất | Dùng `ticket_id` nhất quán trong dữ liệu, khóa ngoại và API | **Đã kiểm chứng ở database/API**: `ticket_id` được dùng trong phiếu #1 và #2. Cần đối chiếu ERD |
| 7 | Phụ lục AI kê khai quá chung | Tách từng công cụ, mục đích, vị trí áp dụng và cách kiểm chứng | Có `docs/ai-disclosure.md`; cần rà soát nội dung và mẫu cam kết của thầy |
| 8 | Lịch sử Git dùng nhiều thông điệp `Add files via upload` | Dùng Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`...) để truy vết thay đổi | Chưa xác nhận lịch sử commit mới; kiểm tra bằng `git log --oneline` |
| 9 | BT2 ưu tiên sửa `survey_response` và kiểm thử ngoại lệ UC01 | Kiểm tra phiếu chưa đóng, dữ liệu điểm sai và khảo sát trùng để bảo vệ quy tắc nghiệp vụ | **Đã kiểm chứng**: 18/18 Unit Test PASS; khảo sát trùng phiếu #2 trả HTTP 409 |

## 3. Thay đổi từ thiết kế BT1 sang hiện thực BT2

| Mã | Thành phần | Hiện thực BT2 | Lý do kỹ thuật | Vị trí mã nguồn / minh chứng |
|---|---|---|---|---|
| TD-01 | Kiến trúc Backend | Phân tách Routes – Services – Repositories | Tách xử lý HTTP, nghiệp vụ và truy vấn dữ liệu để dễ bảo trì, kiểm thử | `src/routes/`, `src/services/`, `src/repositories/` |
| TD-02 | CRUD nghiệp vụ | Triển khai CRUD cho `ticket` và `survey_response` | Đáp ứng yêu cầu module cốt lõi với ít nhất hai entity | `ticketRoutes.js`, `surveyResponseRoutes.js` và các service/repository tương ứng |
| TD-03 | Quy tắc khảo sát | Chỉ cho phép khảo sát ticket `CLOSED`, kiểm tra CSAT/NPS, ngăn khảo sát trùng | Bảo toàn tính hợp lệ và nhất quán dữ liệu | `src/services/surveyResponseService.js`; ràng buộc UNIQUE `ticket_id`; kiểm thử HTTP 409 |
| TD-04 | Xác thực | Bổ sung đăng nhập Admin, phiên xác thực bằng Bearer Token, middleware bảo vệ API | Hạn chế truy cập API quản trị không xác thực | `src/routes/authRoutes.js`, `src/services/authService.js`, `src/repositories/authRepository.js`, `src/middlewares/requireAuth.js`, `scripts/create-admin.js` |
| TD-05 | Giao diện | React/Vite kết nối API thực, gồm Danh sách, Chi tiết, Tiếp nhận và Đăng nhập | Chuyển từ wireframe sang chức năng thao tác thực tế | `frontend/src/App.jsx`, `frontend/src/components/`, `frontend/src/api/client.js` |
| TD-06 | Trạng thái giao diện | Có component DataState xử lý Loading, Empty, Error/Retry | Giúp người dùng phân biệt dữ liệu rỗng với lỗi tải dữ liệu | `frontend/src/components/DataState.jsx`; đã có minh chứng Empty, Loading/Error cần bổ sung ảnh |
| TD-07 | Cơ sở dữ liệu | PostgreSQL 17, 7 bảng; SQL migration và seed | Tái lập schema và dữ liệu kiểm thử khi tạo volume mới | `database/migrations/001_create_tables.sql`, `002_create_auth_tables.sql`, `database/seeds/001_seed_data.sql` |
| TD-08 | Đóng gói | Docker Compose gồm `frontend`, `app`, `db`; Dockerfile dùng lockfile và `npm ci` | Giảm phụ thuộc môi trường Windows, tăng khả năng tái lập | `compose.yaml`, `dockerfile`, `frontend/Dockerfile`, `package-lock.json`, `frontend/package-lock.json` |
| TD-09 | Kiểm thử | Bổ sung Unit Test cho nghiệp vụ ticket và khảo sát | Kiểm chứng trường hợp hợp lệ, biên và không hợp lệ | `tests/`; kết quả 18/18 PASS; `docs/bt2-test-results.txt` |
| TD-10 | Kiến trúc thực tế | Bổ sung sơ đồ mô tả Frontend, Backend ba lớp, Middleware, Database và Docker | Phân biệt kiến trúc đã triển khai BT2 với sơ đồ dự kiến BT1 | `docs/architecture-thuc-te.drawio` (cần xác nhận đã lưu vào repo) |

## 4. Quyết định giữ nguyên

1. **Phạm vi nghiệp vụ:** Giữ 7 User Story (US1–US7) và 6 Use Case (UC01–UC06) theo BT1; các hạng mục xác thực, triển khai và kiểm thử phục vụ yêu cầu hiện thực BT2, không tự nhận là Use Case nghiệp vụ mới.
2. **Quy tắc khảo sát sau khi đóng phiếu:** Chỉ khảo sát ticket `CLOSED` và mỗi ticket tối đa một phản hồi. Việc hiện thực sử dụng kiểm tra ở service kết hợp ràng buộc dữ liệu để tránh trùng.
3. **Hai thang điểm riêng:** CSAT 1–5 và NPS 0–10, lưu bằng hai trường riêng.
4. **PostgreSQL:** Tiếp tục sử dụng làm cơ sở dữ liệu quan hệ, bổ sung migration/seed và triển khai bằng Docker.

## 5. Kiểm chứng thực tế BT2

| Hạng mục | Kết quả đã quan sát | Minh chứng |
|---|---|---|
| Khởi tạo Docker độc lập | API `/health` hoạt động, kết nối database | Môi trường `smartcrm_bt2_clean`, cổng API 3001 và frontend 5174 |
| Migration và seed | Có 7 bảng; năm bảng nghiệp vụ được kiểm tra có 1 bản ghi mỗi bảng sau seed | Truy vấn PostgreSQL trong Docker |
| Unit Test | **18/18 PASS** | `docs/bt2-test-results.txt` và kết quả lệnh `npm test` |
| Tạo ticket | Tạo ticket #2 ở trạng thái `OPEN`, sau đó cập nhật thành `CLOSED` với `closed_at` | API `POST /api/tickets`, `PUT /api/tickets/2` |
| Khảo sát End-to-End | Gửi phản hồi #2 cho ticket #2; CSAT 5, NPS 9; xem được trang chi tiết | Ảnh chụp giao diện khảo sát #2 |
| Danh sách phiếu đủ điều kiện | Ticket #2 xuất hiện khi CLOSED và chưa khảo sát; biến mất sau khi gửi phản hồi | API `/api/tickets/available` |
| Chặn khảo sát trùng | **HTTP 409** và thông báo `Ticket nay da co phan hoi khao sat` | Ảnh kết quả PowerShell kiểm thử trùng |
| Frontend Empty | Đã quan sát trạng thái không còn ticket CLOSED chưa khảo sát | Ảnh màn hình Tiếp nhận khảo sát |

## 6. Công việc cần rà soát trước khi nộp

- Đối chiếu các sửa đổi BT1 trên sơ đồ Use Case, ERD, SRS và bảng truy vết; không tự đánh dấu hoàn thành khi chưa mở file xác nhận.
- Kiểm tra `docs/ai-disclosure.md` theo đúng mẫu và cam kết của giảng viên.
- Lưu sơ đồ thực tế ở `docs/architecture-thuc-te.drawio` và xuất PNG để đưa vào báo cáo.
- Bổ sung ảnh thực tế của trạng thái **Loading** và **Error/Retry**; Empty đã được quan sát.
- Hoàn tất commit/push, kiểm tra **clean clone trực tiếp từ GitHub**, xác nhận repo PUBLIC và chỉ sau đó tạo/push tag `v0.2`.
- Đồng bộ README và báo cáo PDF với kết quả cuối cùng; không công bố mật khẩu, token hay `.env`.

## 7. Kết luận

BT2 đã hiện thực module khảo sát CSAT/NPS trên nền React, Express và PostgreSQL, có xác thực, CRUD, kiểm thử tự động và triển khai Docker. Các kết quả **18/18 PASS**, khảo sát End-to-End và HTTP **409** khi gửi trùng đã được kiểm chứng. Những nội dung liên quan tới tính nhất quán của tài liệu BT1 và clean clone GitHub vẫn cần đối chiếu trước khi chốt phiên bản nộp.
