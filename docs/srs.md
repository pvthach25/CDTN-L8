# Software Requirements Specification (SRS)

## Hệ thống khảo sát hài lòng CSAT/NPS – Mekong Mobile

**Học phần:** Chuyên đề Tốt nghiệp 1 (CDTN1)
**Bài tập:** BT1 – Phân tích và Thiết kế
**Track:** Software Engineering (SE)
**Luồng nghiệp vụ:** L8 – Khảo sát hài lòng CSAT/NPS
**Sinh viên:** Phạm Vũ Thạch
**MSSV:** 2374802010452
**Trạng thái tài liệu:** Bản đặc tả yêu cầu phục vụ phân tích và thiết kế

---

## 1. Giới thiệu

### 1.1. Mục đích

Tài liệu SRS mô tả các yêu cầu của hệ thống khảo sát hài lòng CSAT/NPS trong hệ thống Smart CRM của Mekong Mobile. Tài liệu là cơ sở để thiết kế Use Case, kiến trúc hệ thống, mô hình dữ liệu, giao diện người dùng và API Contract.

### 1.2. Phạm vi hệ thống

Hệ thống hỗ trợ thu thập và theo dõi phản hồi của khách hàng sau khi xử lý yêu cầu dịch vụ. Phạm vi chức năng bao gồm:

* Cho phép khách hàng đánh giá mức độ hài lòng CSAT theo thang điểm từ 1 đến 5.
* Cho phép khách hàng đánh giá NPS theo thang điểm từ 0 đến 10.
* Cho phép khách hàng nhập nhận xét về chất lượng dịch vụ.
* Kiểm tra tính hợp lệ của dữ liệu trước khi gửi khảo sát.
* Lưu kết quả khảo sát và thời gian hoàn thành.
* Cho phép quản trị viên xem báo cáo CSAT/NPS.
* Cho phép quản trị viên lọc kết quả theo thời gian, xem nhận xét và phân bố đánh giá theo từng mức điểm.

Tài liệu tập trung vào luồng khảo sát hài lòng CSAT/NPS, không mô tả toàn bộ chức năng của hệ thống Smart CRM.

### 1.3. Thuật ngữ và viết tắt

| Thuật ngữ                        | Ý nghĩa                                                           |
| -------------------------------- | ----------------------------------------------------------------- |
| CRM                              | Customer Relationship Management – Quản lý quan hệ khách hàng     |
| SRS                              | Software Requirements Specification – Đặc tả yêu cầu phần mềm     |
| CSAT                             | Customer Satisfaction Score – Chỉ số hài lòng của khách hàng      |
| NPS                              | Net Promoter Score – Chỉ số đo mức độ sẵn lòng giới thiệu dịch vụ |
| User Story (US)                  | Mô tả nhu cầu của người dùng                                      |
| Functional Requirement (FR)      | Yêu cầu chức năng                                                 |
| Non-functional Requirement (NFR) | Yêu cầu phi chức năng                                             |
| Ticket                           | Phiếu/yêu cầu dịch vụ được theo dõi trong hệ thống CRM            |
| Quản trị viên                    | Người xem báo cáo và kết quả khảo sát                             |

### 1.4. Tài liệu liên quan

* Case study Smart CRM – Mekong Mobile.
* Báo cáo Buổi 4 – Luồng L8 khảo sát hài lòng CSAT/NPS.
* `docs/usecase.drawio` – Sơ đồ Use Case.
* `docs/architecture.drawio` – Sơ đồ kiến trúc hệ thống.
* `docs/erd.drawio` hoặc `docs/schema.dbml` – Mô hình dữ liệu.
* `docs/api-contract.md` – Đặc tả giao tiếp API.

---

## 2. Mô tả tổng quan

### 2.1. Bối cảnh hệ thống

Hệ thống khảo sát CSAT/NPS là một phần của Smart CRM, hỗ trợ ghi nhận đánh giá của khách hàng và cung cấp thông tin để quản trị viên theo dõi chất lượng dịch vụ.

Luồng nghiệp vụ bắt đầu khi khách hàng được yêu cầu đánh giá dịch vụ sau khi yêu cầu dịch vụ hoặc phiếu bảo hành đã hoàn tất theo quy trình. Khách hàng nhập điểm đánh giá và nhận xét; hệ thống kiểm tra dữ liệu, lưu kết quả và cung cấp dữ liệu cho chức năng báo cáo.

### 2.2. Đối tượng sử dụng

| Actor         | Vai trò                                                     |
| ------------- | ----------------------------------------------------------- |
| Khách hàng    | Thực hiện khảo sát CSAT/NPS và gửi nhận xét                 |
| Quản trị viên | Xem báo cáo tổng quan, lọc kết quả và xem chi tiết phản hồi |

### 2.3. Phạm vi chức năng

Hệ thống gồm hai nhóm chức năng chính:

**Nhóm chức năng dành cho khách hàng**

* Thực hiện khảo sát CSAT/NPS.
* Nhập và gửi nhận xét.
* Nhận thông báo khi dữ liệu không hợp lệ hoặc gửi khảo sát không thành công.

**Nhóm chức năng dành cho quản trị viên**

* Xem báo cáo tổng quan CSAT/NPS.
* Lọc kết quả khảo sát theo khoảng thời gian.
* Xem nhận xét chi tiết và phân bố kết quả theo mức điểm.

### 2.4. Giả định và ràng buộc

* Khách hàng chỉ thực hiện khảo sát khi được cung cấp quyền truy cập hoặc đường dẫn khảo sát phù hợp với quy trình nghiệp vụ.
* Dữ liệu khảo sát phải được kiểm tra trước khi lưu vào cơ sở dữ liệu.
* Kết quả báo cáo được tổng hợp từ dữ liệu khảo sát đã lưu.
* Công nghệ dự kiến gồm Frontend HTML/CSS/JavaScript, Backend Java Spring Boot và cơ sở dữ liệu MySQL.
* Thang điểm CSAT từ 1 đến 5 và thang điểm NPS từ 0 đến 10 được sử dụng thống nhất trong giao diện, xử lý nghiệp vụ và lưu trữ.
* Các yêu cầu về hiệu năng và độ sẵn sàng trong mục 5 là mục tiêu thiết kế cần được kiểm chứng khi triển khai, không phải số liệu vận hành đã đo được.

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1. Danh sách yêu cầu chức năng

| Mã    | Tên yêu cầu                | Mô tả                                                                                                            | Ưu tiên |
| ----- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| FR-01 | Chọn mức CSAT              | Hệ thống cho phép khách hàng chọn điểm CSAT từ 1 đến 5.                                                          | MUST    |
| FR-02 | Chọn điểm NPS              | Hệ thống cho phép khách hàng chọn điểm NPS từ 0 đến 10.                                                          | MUST    |
| FR-03 | Nhập nhận xét              | Hệ thống cho phép khách hàng nhập nhận xét về chất lượng dịch vụ.                                                | MUST    |
| FR-04 | Kiểm tra dữ liệu khảo sát  | Hệ thống kiểm tra điểm CSAT, điểm NPS và dữ liệu nhận xét theo các quy tắc đầu vào trước khi tiếp nhận khảo sát. | MUST    |
| FR-05 | Lưu kết quả khảo sát       | Hệ thống lưu điểm CSAT, điểm NPS, nhận xét và thời gian hoàn thành khảo sát.                                     | SHOULD  |
| FR-06 | Xem báo cáo CSAT/NPS       | Quản trị viên xem tổng số khảo sát và các chỉ số tổng quan CSAT/NPS.                                             | SHOULD  |
| FR-07 | Lọc kết quả theo thời gian | Quản trị viên chọn khoảng thời gian để xem các kết quả khảo sát tương ứng.                                       | COULD   |
| FR-08 | Xem chi tiết kết quả       | Quản trị viên xem nhận xét và phân bố đánh giá theo từng mức điểm.                                               | COULD   |

### 3.2. Đặc tả yêu cầu chức năng

**FR-01 – Chọn mức CSAT**

* Hệ thống phải cung cấp lựa chọn CSAT theo thang điểm từ 1 đến 5.
* Khách hàng phải chọn một mức điểm hợp lệ trước khi gửi khảo sát.
* Nếu chưa chọn CSAT, hệ thống thông báo yêu cầu khách hàng bổ sung đánh giá.

**FR-02 – Chọn điểm NPS**

* Hệ thống phải cung cấp lựa chọn NPS theo thang điểm từ 0 đến 10.
* Điểm NPS nằm ngoài khoảng hợp lệ không được chấp nhận.
* Khi điểm không hợp lệ, hệ thống thông báo để khách hàng chọn lại.

**FR-03 – Nhập nhận xét**

* Hệ thống cho phép khách hàng nhập nhận xét về chất lượng dịch vụ.
* Nội dung nhận xét phải tuân theo giới hạn độ dài được quy định trong thiết kế giao diện và API.
* Nếu nội dung vượt giới hạn, hệ thống thông báo và yêu cầu khách hàng điều chỉnh.

**FR-04 – Kiểm tra dữ liệu khảo sát**

* Hệ thống kiểm tra các trường bắt buộc và miền giá trị của điểm CSAT, NPS.
* Hệ thống kiểm tra độ dài nhận xét theo quy tắc đã quy định.
* Dữ liệu không hợp lệ không được lưu.
* Hệ thống hiển thị thông báo phù hợp để người dùng sửa dữ liệu.

**FR-05 – Lưu kết quả khảo sát**

* Hệ thống lưu điểm CSAT, điểm NPS, nhận xét và thời gian hoàn thành khảo sát.
* Dữ liệu được lưu vào MySQL thông qua Backend.
* Khi lưu thành công, hệ thống thông báo kết quả gửi khảo sát.
* Khi xảy ra lỗi xử lý hoặc lỗi lưu dữ liệu, hệ thống thông báo gửi khảo sát không thành công.

**FR-06 – Xem báo cáo CSAT/NPS**

* Quản trị viên có thể xem tổng số khảo sát đã lưu.
* Báo cáo hiển thị các chỉ số tổng quan CSAT/NPS được tính từ dữ liệu khảo sát.
* Khi chưa có dữ liệu, hệ thống hiển thị thông báo phù hợp thay vì hiển thị số liệu không có căn cứ.

**FR-07 – Lọc kết quả theo thời gian**

* Quản trị viên có thể chọn ngày bắt đầu và ngày kết thúc để lọc kết quả khảo sát.
* Ngày bắt đầu không được sau ngày kết thúc.
* Hệ thống chỉ trả về kết quả phù hợp với khoảng thời gian đã chọn.
* Nếu khoảng thời gian không hợp lệ, hệ thống thông báo lỗi.
* Nếu không có kết quả phù hợp, hệ thống thông báo không có dữ liệu.

**FR-08 – Xem chi tiết kết quả**

* Quản trị viên có thể xem thông tin chi tiết của kết quả khảo sát đã lưu.
* Thông tin chi tiết gồm điểm CSAT, điểm NPS, nhận xét và thời gian hoàn thành khảo sát.
* Hệ thống hỗ trợ hiển thị phân bố kết quả theo từng mức điểm.
* Nếu không có kết quả phù hợp, hệ thống hiển thị thông báo tương ứng.

---

## 4. Yêu cầu giao diện và giao tiếp hệ thống

### 4.1. Giao diện người dùng

**Giao diện khảo sát khách hàng**

* Hiển thị lựa chọn CSAT từ 1 đến 5.
* Hiển thị lựa chọn NPS từ 0 đến 10.
* Cung cấp vùng nhập nhận xét.
* Có chức năng gửi khảo sát và hiển thị thông báo thành công hoặc lỗi.
* Hiển thị thông báo kiểm tra dữ liệu tại vị trí phù hợp.

**Giao diện quản trị viên**

* Hiển thị báo cáo tổng quan CSAT/NPS.
* Hiển thị bộ lọc theo khoảng thời gian.
* Hiển thị danh sách kết quả và thông tin chi tiết cần thiết.
* Hiển thị nhận xét và phân bố điểm đánh giá.
* Hiển thị thông báo khi không có dữ liệu.

### 4.2. Giao tiếp phần mềm

| Thành phần | Công nghệ dự kiến     | Trách nhiệm                                           |
| ---------- | --------------------- | ----------------------------------------------------- |
| Frontend   | HTML, CSS, JavaScript | Hiển thị giao diện, tiếp nhận thao tác và gửi yêu cầu |
| Backend    | Java Spring Boot      | Kiểm tra dữ liệu, xử lý nghiệp vụ, cung cấp API       |
| Database   | MySQL                 | Lưu trữ kết quả khảo sát và phục vụ truy vấn báo cáo  |

Frontend giao tiếp với Backend thông qua API sử dụng dữ liệu JSON. Backend chịu trách nhiệm kiểm tra dữ liệu và thực hiện thao tác với MySQL.

Các endpoint, cấu trúc dữ liệu, mã trạng thái HTTP và quy tắc kiểm tra chi tiết được quy định trong `docs/api-contract.md`.

---

## 5. Yêu cầu phi chức năng (Non-functional Requirements)

| Mã     | Nhóm yêu cầu      | Yêu cầu                                                                                                             | Tiêu chí kiểm chứng                                                              |
| ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| NFR-01 | Hiệu năng         | Thời gian phản hồi của chức năng trong phạm vi thiết kế không vượt quá 2 giây trong điều kiện kiểm thử đã xác định. | Đo thời gian phản hồi khi kiểm thử các chức năng chính.                          |
| NFR-02 | Khả năng chịu tải | Hệ thống hướng tới hỗ trợ ít nhất 100 người dùng đồng thời.                                                         | Thực hiện kiểm thử tải với tối thiểu 100 người dùng đồng thời.                   |
| NFR-03 | Độ sẵn sàng       | Mục tiêu độ sẵn sàng của hệ thống là ít nhất 99% trong một tháng.                                                   | Theo dõi thời gian hoạt động và thời gian gián đoạn trong môi trường triển khai. |

### 5.1. Tính toàn vẹn dữ liệu

* Điểm CSAT chỉ nhận giá trị từ 1 đến 5.
* Điểm NPS chỉ nhận giá trị từ 0 đến 10.
* Dữ liệu không hợp lệ không được ghi vào cơ sở dữ liệu.
* Thời gian hoàn thành khảo sát phải được lưu để phục vụ truy vấn và thống kê.

### 5.2. Khả năng bảo trì

* Mã nguồn cần phân tách trách nhiệm giữa giao diện, xử lý nghiệp vụ và truy cập dữ liệu.
* Các API cần tuân theo hợp đồng đã thống nhất trong `docs/api-contract.md`.
* Tên trường dữ liệu và thuật ngữ nghiệp vụ phải thống nhất giữa SRS, API Contract và mô hình dữ liệu.

---

## 6. Bảng truy vết yêu cầu

Bảng dưới đây liên kết các yêu cầu chức năng với User Story, Use Case và mức ưu tiên.

| FR    | User Story               | Use Case                           | MoSCoW |
| ----- | ------------------------ | ---------------------------------- | ------ |
| FR-01 | US1 – Đánh giá CSAT      | UC01 – Thực hiện khảo sát CSAT/NPS | MUST   |
| FR-02 | US2 – Đánh giá NPS       | UC01 – Thực hiện khảo sát CSAT/NPS | MUST   |
| FR-03 | US3 – Gửi nhận xét       | UC02 – Gửi nhận xét                | MUST   |
| FR-04 | US4 – Kiểm tra dữ liệu   | UC01 – Thực hiện khảo sát CSAT/NPS | MUST   |
| FR-05 | US5 – Lưu kết quả        | UC03 – Lưu kết quả khảo sát        | SHOULD |
| FR-06 | US6 – Xem báo cáo        | UC04 – Xem báo cáo CSAT/NPS        | SHOULD |
| FR-07 | US7 – Lọc và xem kết quả | UC05 – Lọc kết quả theo thời gian  | COULD  |
| FR-08 | US7 – Lọc và xem kết quả | UC06 – Xem chi tiết kết quả        | COULD  |

### 6.1. Danh sách User Story

* **US1 – Đánh giá CSAT:** Khách hàng chọn mức độ hài lòng từ 1 đến 5.
* **US2 – Đánh giá NPS:** Khách hàng chọn điểm NPS từ 0 đến 10.
* **US3 – Gửi nhận xét:** Khách hàng nhập và gửi nhận xét về chất lượng dịch vụ.
* **US4 – Kiểm tra dữ liệu:** Hệ thống kiểm tra dữ liệu khảo sát trước khi tiếp nhận.
* **US5 – Lưu kết quả:** Hệ thống lưu điểm CSAT, NPS, nhận xét và thời gian hoàn thành khảo sát.
* **US6 – Xem báo cáo:** Quản trị viên xem tổng quan kết quả và các chỉ số CSAT/NPS.
* **US7 – Lọc và xem kết quả:** Quản trị viên lọc kết quả theo thời gian, xem nhận xét và phân bố đánh giá theo từng mức điểm.

### 6.2. Danh sách Use Case

* **UC01 – Thực hiện khảo sát CSAT/NPS**
* **UC02 – Gửi nhận xét**
* **UC03 – Lưu kết quả khảo sát**
* **UC04 – Xem báo cáo CSAT/NPS**
* **UC05 – Lọc kết quả theo thời gian**
* **UC06 – Xem chi tiết kết quả**

Bảng truy vết phải được cập nhật đồng bộ nếu mã User Story, yêu cầu chức năng hoặc Use Case thay đổi trong các tài liệu thiết kế khác.
