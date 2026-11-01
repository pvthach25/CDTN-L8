# Smart CRM – Khảo sát mức độ hài lòng khách hàng CSAT/NPS (L8)

**Sinh viên:** Phạm Vũ Thạch – 2374802010452  
**Học phần:** Chuyên đề Tốt nghiệp 1 – HK1 2026–2027  
**Track:** Software Engineering (SE)  
**Luồng nghiệp vụ:** L8 – Khảo sát hài lòng CSAT/NPS  
**Repository:** https://github.com/pvthach25/CDTN-L8

## 1. Mục tiêu và phạm vi

Xây dựng module khảo sát mức độ hài lòng khách hàng thuộc hệ thống Smart CRM của Mekong Mobile, ghi nhận đánh giá sau khi phiếu bảo hành đã hoàn tất.

Các chức năng đã hiện thực:

- CRUD hai thực thể chính: `ticket` (phiếu bảo hành) và `survey_response` (phản hồi khảo sát).
- Ghi nhận điểm **CSAT từ 1 đến 5**, **NPS từ 0 đến 10** và nhận xét tùy chọn.
- Giao diện React gồm đăng nhập, danh sách khảo sát, chi tiết khảo sát và tiếp nhận khảo sát; kết nối API thực tế.
- Xác thực API bằng Bearer Token, có chức năng đăng nhập và đăng xuất.
- Xử lý các trạng thái giao diện **Loading**, **Empty** và **Error/Retry** qua component `DataState`.

**Quy tắc nghiệp vụ chính:**

1. Chỉ được khảo sát phiếu có trạng thái `CLOSED`.
2. Mỗi phiếu chỉ được khảo sát một lần (ràng buộc `UNIQUE ticket_id` trong PostgreSQL; yêu cầu khảo sát trùng trả về HTTP `409`).
3. Phiếu `CLOSED` phải có thời gian đóng `closed_at`; phiếu chưa đóng không được có thời gian đóng.
4. Không được xóa phiếu bảo hành đã có phản hồi khảo sát.
5. Điểm CSAT/NPS và dữ liệu đầu vào phải được kiểm tra trước khi lưu.

## 2. Yêu cầu môi trường

- **Docker Desktop** có hỗ trợ Docker Compose.
- **Git** để clone repository.
- Trình duyệt web để truy cập giao diện.
- PowerShell trên Windows để thực hiện các lệnh bên dưới.

Node.js, Express, React/Vite và PostgreSQL chạy trong các container Docker; **không bắt buộc cài Node.js hoặc PostgreSQL trực tiếp trên Windows**.

Các dịch vụ trong `compose.yaml`:

| Dịch vụ | Công nghệ | Địa chỉ trên máy |
| --- | --- | --- |
| `frontend` | React + Vite | http://localhost:5173 |
| `app` | Node.js + Express | http://localhost:3000 |
| `db` | PostgreSQL 17 | Nội bộ mạng Docker |

## 3. Cài đặt và chạy hệ thống

### 3.1. Lấy mã nguồn và cấu hình môi trường

```powershell
git clone https://github.com/pvthach25/CDTN-L8.git
cd CDTN-L8
Copy-Item .env.example .env
```

Kiểm tra các biến trong `.env` theo `.env.example`, đặc biệt là thông tin PostgreSQL. **Không commit `.env`, mật khẩu hoặc token đăng nhập lên GitHub.**

### 3.2. Khởi động Docker

```powershell
docker compose up --build -d
docker compose ps
```

Kiểm tra Backend:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Khi hoạt động bình thường, API trả về trạng thái `ok` và kết nối cơ sở dữ liệu `connected`.

Truy cập giao diện: **http://localhost:5173**.

### 3.3. Tạo tài khoản quản trị

Hệ thống không công bố mật khẩu quản trị mặc định. Sau khi các container đã khởi động, tạo tài khoản bằng PowerShell:

```powershell
$env:ADMIN_USERNAME = "admin"
$securePassword = Read-Host "Nhap mat khau admin (toi thieu 12 ky tu)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
    $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)

    docker compose run --rm `
        -e ADMIN_USERNAME `
        -e ADMIN_PASSWORD `
        app node scripts/create-admin.js
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    Remove-Item Env:\ADMIN_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:\ADMIN_USERNAME -ErrorAction SilentlyContinue
}
```

Mật khẩu phải có tối thiểu **12 ký tự**; hệ thống dùng `scrypt` để băm mật khẩu trước khi lưu. Sau khi tạo thành công, đăng nhập trên giao diện bằng tài khoản vừa tạo. Không chia sẻ mật khẩu hoặc Bearer Token trong ảnh minh chứng.

### 3.4. Migration và seed dữ liệu

Khi PostgreSQL khởi tạo trên **volume trống**, Docker thực thi các script theo thứ tự được khai báo trong `compose.yaml`:

1. `database/migrations/001_create_tables.sql` – Các bảng nghiệp vụ.
2. `database/migrations/002_create_auth_tables.sql` – Tài khoản và phiên đăng nhập.
3. `database/seeds/001_seed_data.sql` – Dữ liệu mẫu ban đầu.

Các script khởi tạo **chỉ chạy khi volume dữ liệu PostgreSQL trống**. Khởi động lại container không tự động chạy lại migration/seed. **Không chạy `docker compose down -v` nếu cần giữ dữ liệu hiện có.**

### 3.5. Chạy Unit Test

```powershell
docker compose exec app npm test
```

Kết quả kiểm thử đã ghi nhận: **18/18 PASS, 0 FAIL**. Minh chứng văn bản: `docs/bt2-test-results.txt`.

### 3.6. Dừng hệ thống

```powershell
docker compose down
```

Lệnh trên không xóa Docker volume mặc định.

## 4. Kiến trúc thực tế và cấu trúc thư mục

Kiến trúc triển khai: **React/Vite → Express Routes → Services → Repositories → PostgreSQL**. Middleware xác thực kiểm tra Bearer Token trên các API được bảo vệ. Hệ thống chạy ba dịch vụ `frontend`, `app`, `db` qua Docker Compose.

Sơ đồ kiến trúc đã hiện thực: `docs/architecture-thuc-te.drawio`.

```text
CDTN-L8/
├── database/
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   └── 002_create_auth_tables.sql
│   └── seeds/
│       └── 001_seed_data.sql
├── docs/                       # SRS, thiết kế, thay đổi thiết kế, AI, minh chứng
│   ├── srs.md
│   ├── thay-doi-thiet-ke.md
│   ├── ai-disclosure.md
│   └── architecture-thuc-te.drawio
├── frontend/
│   ├── src/
│   │   ├── api/client.js       # Gọi Backend API
│   │   ├── components/         # Login, DataState
│   │   ├── App.jsx             # Danh sách, chi tiết, tiếp nhận
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package-lock.json
├── scripts/
│   └── create-admin.js         # Tạo tài khoản quản trị
├── src/
│   ├── config/                 # Cấu hình kết nối database
│   ├── routes/                 # Định nghĩa endpoint
│   ├── middlewares/            # Kiểm tra xác thực
│   ├── services/               # Quy tắc nghiệp vụ
│   ├── repositories/           # Truy vấn PostgreSQL
│   ├── app.js                  # Cấu hình Express
│   └── server.js               # Khởi động Backend
├── tests/                      # Unit Test
├── .env.example                # Mẫu biến môi trường
├── .gitignore
├── compose.yaml                # Docker Compose chính
├── compose.clean-test.yaml     # Override cổng cho môi trường kiểm thử
├── dockerfile                  # Dockerfile Backend
├── package.json
├── package-lock.json
└── README.md
```

**Lưu ý:** File sơ đồ `docs/architecture-thuc-te.drawio` cần được lưu và commit từ draw.io trước khi chốt bản nộp.

## 5. Kiểm thử và kết quả thực tế

Dự án sử dụng **Node.js Test Runner** để kiểm thử logic của `ticket` và `survey_response`, gồm các trường hợp hợp lệ, biên và không hợp lệ:

- Kiểm tra CSAT trong khoảng 1–5 và NPS trong khoảng 0–10.
- Từ chối điểm ngoài phạm vi hoặc dữ liệu không hợp lệ.
- Từ chối khảo sát khi phiếu chưa `CLOSED`.
- Xử lý bản ghi không tồn tại.
- Kiểm tra CRUD phiếu bảo hành.
- Không cho xóa phiếu đã có khảo sát.

**Kết quả đã xác nhận:** 18 bài kiểm thử PASS, 0 FAIL.

### 5.1. Kiểm thử End-to-End trên Docker độc lập

Môi trường kiểm thử được tạo bằng Docker Compose project riêng (`smartcrm_bt2_clean`) với cổng Frontend `5174`, Backend `3001`, không dùng chung volume database với môi trường chính.

Kết quả đã quan sát:

- PostgreSQL khởi tạo **7 bảng**; seed có **1 bản ghi ở mỗi bảng** `customer`, `service_center`, `technician`, `ticket`, `survey_response`.
- API `/health` kết nối database thành công; đăng nhập Admin thành công.
- Tạo `ticket_id = 2` ở trạng thái `OPEN`, sau đó cập nhật sang `CLOSED` với `closed_at` hợp lệ.
- API danh sách phiếu đủ điều kiện trả về phiếu `#2` trước khảo sát.
- Gửi khảo sát thành công: CSAT **5/5**, NPS **9/10**, nhận xét được lưu và hiển thị trong màn hình chi tiết phản hồi `#2`.
- Sau khi khảo sát, phiếu `#2` không còn trong danh sách đủ điều kiện.
- Gửi lại khảo sát cho phiếu `#2` nhận **HTTP 409** với thông báo `Ticket nay da co phan hoi khao sat`.

Các ảnh chụp màn hình được lưu trong `docs/` để làm minh chứng cho báo cáo BT2. Trạng thái Loading/Error/Retry cần được chụp và xác nhận riêng trước khi đánh dấu hoàn tất minh chứng giao diện.

### 5.2. Kiểm tra phụ thuộc

Backend đã được kiểm tra bằng `npm audit --omit=dev`; lần kiểm tra gần nhất ghi nhận **0 vulnerabilities**. Hai Dockerfile sử dụng `npm ci` với lockfile để tăng khả năng tái lập.

## 6. Tiến độ và các việc còn lại

### Đã thực hiện

- CRUD hai thực thể `ticket` và `survey_response` với ba lớp Routes – Services – Repositories.
- Áp dụng quy tắc phiếu `CLOSED`, khảo sát một lần và kiểm tra điểm CSAT/NPS.
- Xác thực Admin bằng Bearer Token, tạo tài khoản qua script.
- Frontend React với các màn hình đăng nhập, danh sách, chi tiết và tiếp nhận khảo sát; có component `DataState` cho Loading/Empty/Error/Retry.
- Docker Compose cho Frontend, Backend, PostgreSQL; migration và seed khi khởi tạo volume mới.
- 18/18 Unit Test PASS; kiểm thử End-to-End và HTTP 409 trên môi trường Docker độc lập.
- Vẽ sơ đồ kiến trúc thực tế, mô tả rõ đường dẫn các lớp.

### Cần hoàn tất trước khi nộp

- Lưu/commit file gốc `docs/architecture-thuc-te.drawio` và các ảnh minh chứng cần thiết.
- Chụp, kiểm tra minh chứng Loading, Empty và Error/Retry.
- Kiểm tra **clean clone trực tiếp từ GitHub** sau khi commit/push.
- Rà soát `docs/thay-doi-thiet-ke.md`, `docs/ai-disclosure.md` và báo cáo BT2 PDF.
- Đảm bảo repository ở chế độ **PUBLIC**, working tree sạch, sau đó tạo và push tag `v0.2` vào commit mới nhất.

## 7. Tài liệu tham chiếu

- `docs/srs.md` – Đặc tả yêu cầu phần mềm từ BT1.
- `docs/architecture-thuc-te.drawio` – Kiến trúc đã hiện thực ở BT2.
- `docs/thay-doi-thiet-ke.md` – Nhật ký thay đổi thiết kế.
- `docs/ai-disclosure.md` – Khai báo sử dụng AI.
- `docs/api-contract.md` – Hợp đồng API.
- `docs/bt2-test-results.txt` – Kết quả Unit Test.

