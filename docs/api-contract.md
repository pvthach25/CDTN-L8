# API Contract – Smart CRM: Khảo sát CSAT/NPS

## 1. Mục đích

Tài liệu mô tả hợp đồng giao tiếp giữa Frontend và Backend cho luồng nghiệp vụ L8 – Khảo sát hài lòng CSAT/NPS.

Công nghệ dự kiến:

* Frontend: HTML, CSS, JavaScript.
* Backend: Java Spring Boot.
* Database: MySQL.

## 2. Quy ước chung

* Base path: `/api`
* Định dạng dữ liệu: JSON.
* Mã hóa: UTF-8.
* Thời gian được biểu diễn theo định dạng ISO 8601.
* Backend kiểm tra dữ liệu trước khi lưu kết quả khảo sát.

## 3. Danh sách API

| ID     | Method | Endpoint              | Chức năng                     | User Story              |
| ------ | ------ | --------------------- | ----------------------------- | ----------------------- |
| API-01 | POST   | `/api/surveys`        | Gửi khảo sát và lưu kết quả   | US1, US2, US3, US4, US5 |
| API-02 | GET    | `/api/surveys/report` | Xem báo cáo tổng hợp CSAT/NPS | US6                     |
| API-03 | GET    | `/api/surveys`        | Lọc kết quả theo thời gian    | US7                     |
| API-04 | GET    | `/api/surveys/{id}`   | Xem chi tiết kết quả khảo sát | US7                     |

## 4. Đặc tả API

### API-01: Gửi khảo sát

**Method:** `POST`

**Endpoint:** `/api/surveys`

**Mục đích:** Tiếp nhận dữ liệu khảo sát, kiểm tra tính hợp lệ và lưu kết quả.

**Request body:**

| Trường    | Kiểu dữ liệu | Quy tắc                                               |
| --------- | ------------ | ----------------------------------------------------- |
| `csat`    | Integer      | Giá trị từ 1 đến 5                                    |
| `nps`     | Integer      | Giá trị từ 0 đến 10                                   |
| `comment` | String       | Nhận xét theo giới hạn độ dài được quy định trong SRS |

**Response:**

* `201 Created`: Khảo sát được tiếp nhận và lưu thành công.
* `400 Bad Request`: Dữ liệu thiếu hoặc không hợp lệ.
* `500 Internal Server Error`: Lỗi xử lý hoặc lưu dữ liệu.

**Truy vết:** US1, US2, US3, US4, US5.

### API-02: Xem báo cáo tổng hợp

**Method:** `GET`

**Endpoint:** `/api/surveys/report`

**Mục đích:** Cung cấp dữ liệu tổng hợp cho màn hình báo cáo của quản trị viên.

**Response thành công (`200 OK`):**

* `totalSurveys`: Tổng số lượt khảo sát.
* `averageCsat`: Điểm CSAT trung bình.
* `averageNps`: Chỉ số NPS tổng hợp.

**Response lỗi:**

* `500 Internal Server Error`: Không thể truy xuất hoặc tổng hợp dữ liệu.

**Truy vết:** US6.

### API-03: Lọc kết quả theo thời gian

**Method:** `GET`

**Endpoint:** `/api/surveys`

**Query parameters:**

| Tham số | Kiểu dữ liệu        | Ý nghĩa       |
| ------- | ------------------- | ------------- |
| `from`  | Date (`YYYY-MM-DD`) | Ngày bắt đầu  |
| `to`    | Date (`YYYY-MM-DD`) | Ngày kết thúc |

**Mục đích:** Truy xuất kết quả khảo sát trong khoảng thời gian được chọn.

**Response thành công (`200 OK`):**

* Khoảng thời gian truy vấn.
* Tổng số kết quả phù hợp.
* Danh sách kết quả khảo sát.

**Response lỗi:**

* `400 Bad Request`: Ngày không hợp lệ hoặc ngày bắt đầu sau ngày kết thúc.
* `500 Internal Server Error`: Không thể truy xuất dữ liệu.

**Truy vết:** US7.

### API-04: Xem chi tiết kết quả khảo sát

**Method:** `GET`

**Endpoint:** `/api/surveys/{id}`

**Mục đích:** Truy xuất thông tin chi tiết của một kết quả khảo sát.

**Path parameter:**

| Tham số | Kiểu dữ liệu               | Ý nghĩa             |
| ------- | -------------------------- | ------------------- |
| `id`    | Kiểu ID thống nhất với ERD | Mã kết quả khảo sát |

**Response thành công (`200 OK`):**

* Mã kết quả khảo sát.
* Điểm CSAT.
* Điểm NPS.
* Nội dung nhận xét.
* Thời điểm hoàn thành khảo sát.

**Response lỗi:**

* `404 Not Found`: Không tìm thấy kết quả khảo sát.
* `500 Internal Server Error`: Lỗi xử lý dữ liệu.

**Truy vết:** US7.

## 5. Bảng truy vết API

| API    | User Story | Chức năng                          |
| ------ | ---------- | ---------------------------------- |
| API-01 | US1–US5    | Đánh giá, kiểm tra và lưu khảo sát |
| API-02 | US6        | Xem báo cáo tổng hợp               |
| API-03 | US7        | Lọc kết quả theo thời gian         |
| API-04 | US7        | Xem chi tiết kết quả khảo sát      |

## 6. Ghi chú

* Đây là hợp đồng API ở giai đoạn phân tích và thiết kế, không khẳng định API đã được triển khai.
* Tên trường và kiểu dữ liệu phải nhất quán với SRS, ERD và wireframe.
* Các chỉ số báo cáo được tính từ dữ liệu khảo sát đã lưu.
* Không sử dụng số liệu minh họa như số liệu thực tế của hệ thống.
