# PHỤ LỤC: BẢNG KHAI BÁO SỬ DỤNG AI

## 1. Thông tin chung

**Họ và tên:** Phạm Vũ Thạch  
**MSSV:** 2374802010452  
**Môn học:** CDTN1 – Phân tích và Thiết kế  
**Đề tài:** Smart CRM – Khảo sát mức độ hài lòng khách hàng CSAT/NPS  
**Track:** Software Engineering (SE)

## 2. Bảng khai báo sử dụng AI

| Công cụ AI | Mục đích sử dụng | Vị trí sử dụng | Cách kiểm chứng |
|---|---|---|---|
| ChatGPT | Hỗ trợ phân tích bài toán, xác định phạm vi, xây dựng 7 User Story và yêu cầu chức năng, phi chức năng. | SRS – `docs/srs.md` | Đối chiếu với đề bài BT1, tài liệu Case Study Mekong Mobile và nội dung Buổi 4. |
| ChatGPT | Hỗ trợ xác định tác nhân, xây dựng 6 Use Case và mô tả các luồng xử lý. | Use Case – `docs/usecase.drawio` và phần đặc tả trong SRS | Đối chiếu các Use Case UC01–UC06 với User Story US1–US7 và yêu cầu nghiệp vụ. |
| ChatGPT | Hỗ trợ xác định các thành phần của hệ thống và cách tổ chức kiến trúc phần mềm. | Architecture – `docs/architecture.drawio` | Kiểm tra các thành phần, luồng tương tác và tính phù hợp với phạm vi hệ thống Smart CRM. |
| ChatGPT | Hỗ trợ xây dựng mô hình dữ liệu, xác định bảng, khóa chính, khóa ngoại và ràng buộc dữ liệu. | ERD – `docs/erd.drawio` | Đối chiếu với quy tắc nghiệp vụ, kiểm tra quan hệ giữa các bảng, thang điểm CSAT 1–5 và NPS 0–10. |
| ChatGPT | Hỗ trợ bố trí giao diện cho các chức năng khảo sát, xem báo cáo và xem chi tiết phản hồi. | Wireframe – `docs/wireframe.png` | Đối chiếu với các User Story và Use Case; kiểm tra sự phù hợp giữa màn hình và chức năng. |
| ChatGPT | Hỗ trợ xác định endpoint, phương thức HTTP, cấu trúc dữ liệu yêu cầu và phản hồi. | API Contract – `docs/api-contract.md` | Đối chiếu API với SRS, mô hình dữ liệu và các quy tắc nghiệp vụ của hệ thống. |

## 3. Trách nhiệm của sinh viên

Các nội dung được ChatGPT hỗ trợ đã được sinh viên xem xét, đối chiếu với yêu cầu của bài tập và tài liệu Case Study Mekong Mobile.

Sinh viên chịu trách nhiệm kiểm tra tính chính xác, sự nhất quán giữa các tài liệu và khả năng giải thích các quyết định phân tích, thiết kế trong bài nộp.

## 4. Cam kết cá nhân

**Tôi cam kết khai báo trung thực việc sử dụng công cụ AI trong quá trình thực hiện bài tập. Tôi chịu trách nhiệm về nội dung cuối cùng của bài nộp và sẵn sàng giải thích các quyết định phân tích, thiết kế khi được giảng viên yêu cầu.**

**Sinh viên:** Phạm Vũ Thạch  
**MSSV:** 2374802010452  
**Ngày khai báo:** 18/10/2026

# BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI – BÀI TẬP 2

**Dự án:** Smart CRM – Khảo sát mức độ hài lòng khách hàng (CSAT/NPS)  
**Luồng nghiệp vụ:** L8 – CSAT/NPS  
**Học phần:** Chuyên đề Tốt nghiệp 1 – HK1 2026–2027  
**Track:** Software Engineering (SE)  
**Sinh viên:** Phạm Vũ Thạch  
**MSSV:** 2374802010452

## 1. Mục đích

Tài liệu ghi nhận việc sử dụng công cụ trí tuệ nhân tạo (AI) trong quá trình thực hiện Bài tập 2, bao gồm mục đích sử dụng, nội dung được hỗ trợ, vị trí áp dụng và phương pháp kiểm chứng.

AI được sử dụng như công cụ hỗ trợ học tập, phân tích yêu cầu, gợi ý giải pháp kỹ thuật, rà soát mã nguồn và hoàn thiện tài liệu. Sinh viên chịu trách nhiệm kiểm tra và xác nhận kết quả trước khi đưa vào sản phẩm.

## 2. Bảng khai báo sử dụng AI

| STT | Công cụ AI | Mục đích sử dụng | Nội dung được hỗ trợ | Vị trí áp dụng | Phương pháp kiểm chứng |
|---|---|---|---|---|---|
| 1 | ChatGPT (OpenAI) | Phân tích yêu cầu BT2 | Diễn giải checklist, xác định các thành phần cần triển khai và minh chứng | README.md, docs/ | Đối chiếu với yêu cầu giảng viên |
| 2 | ChatGPT (OpenAI) | Hỗ trợ xây dựng Backend | Gợi ý tổ chức Routes – Services – Repositories, xử lý CRUD và quy tắc CSAT/NPS | src/routes/, src/services/, src/repositories/ | Chạy API, kiểm tra dữ liệu PostgreSQL và các trường hợp lỗi |
| 3 | ChatGPT (OpenAI) | Hỗ trợ xác thực người dùng | Gợi ý cơ chế đăng nhập Admin, Bearer Token, middleware và băm mật khẩu | src/middlewares/, src/routes/authRoutes.js, src/services/authService.js, scripts/create-admin.js | Thử đăng nhập và truy cập API được bảo vệ |
| 4 | ChatGPT (OpenAI) | Hỗ trợ giao diện React | Gợi ý giao diện danh sách, chi tiết, tiếp nhận khảo sát và xử lý Loading/Empty/Error | frontend/src/ | Chạy giao diện và kiểm tra các trạng thái thực tế |
| 5 | ChatGPT (OpenAI) | Hỗ trợ Docker và PostgreSQL | Gợi ý cấu hình Docker Compose, migration, seed và môi trường kiểm thử độc lập | compose.yaml, compose.clean-test.yaml, database/ | Khởi động container, kiểm tra health và dữ liệu |
| 6 | ChatGPT (OpenAI) | Hỗ trợ kiểm thử | Gợi ý các trường hợp kiểm thử nghiệp vụ, kiểm tra ngoại lệ và quy trình End-to-End | tests/, docs/bt2-test-results.txt | Chạy Unit Test và đối chiếu kết quả 18/18 PASS |
| 7 | ChatGPT (OpenAI) | Hỗ trợ tài liệu và GitHub | Gợi ý nội dung README, nhật ký thay đổi thiết kế, khai báo AI và thao tác commit/tag | README.md, docs/thay-doi-thiet-ke.md, docs/ai-disclosure.md | Đọc lại tài liệu, kiểm tra Git và đối chiếu sản phẩm thực tế |

## 3. Kết quả kiểm chứng

Trong quá trình thực hiện BT2, sinh viên đã kiểm tra các nội dung sau:

- Backend kết nối PostgreSQL thành công.
- Docker Compose khởi động các dịch vụ Backend, Frontend và Database.
- Các chức năng quản lý phiếu bảo hành và khảo sát được triển khai.
- Hệ thống kiểm tra điều kiện phiếu bảo hành phải ở trạng thái `CLOSED` trước khi khảo sát.
- Hệ thống từ chối khảo sát trùng với mã HTTP `409`.
- Chức năng đăng nhập Admin và xác thực API được kiểm tra.
- Bộ Unit Test ghi nhận **18 bài PASS, 0 bài FAIL**.
- Luồng End-to-End tạo phiếu, đóng phiếu và thực hiện khảo sát đã được kiểm tra.

Các kết quả này được đối chiếu với mã nguồn, kết quả chạy ứng dụng và tài liệu minh chứng của dự án.

## 4. Giới hạn sử dụng AI

AI không được xem là nguồn xác nhận cuối cùng về tính đúng đắn của hệ thống.

Các đoạn mã, cấu hình và nội dung tài liệu do AI hỗ trợ cần được sinh viên xem xét, điều chỉnh và kiểm thử trước khi sử dụng. Những kết quả chưa được kiểm chứng không được trình bày như đã hoàn thành.

Sinh viên không sử dụng kết quả do AI tạo ra để thay thế bằng chứng chạy thực tế của ứng dụng.

## 5. Cam kết của sinh viên

Tôi xác nhận đã khai báo việc sử dụng công cụ AI trong quá trình thực hiện Bài tập 2.

Tôi chịu trách nhiệm đối với nội dung báo cáo, mã nguồn, kết quả kiểm thử và các sản phẩm nộp. Tôi đã rà soát và kiểm chứng các nội dung được AI hỗ trợ trước khi đưa vào dự án.

**Sinh viên thực hiện:** Phạm Vũ Thạch  
**MSSV:** 2374802010452
