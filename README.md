Smart CRM – Khảo sát mức độ hài lòng khách hàng CSAT/NPS (L8)

Sinh viên: Phạm Vũ Thạch – 2374802010452
Track: Software Engineering (SE)
Học phần: Chuyên đề Tốt nghiệp 1 – HK1 2026–2027
Luồng nghiệp vụ: L8 – Khảo sát hài lòng CSAT/NPS

1. Mục tiêu

Xây dựng module khảo sát mức độ hài lòng khách hàng thuộc hệ thống Smart CRM của Mekong Mobile.

Hệ thống cho phép ghi nhận điểm CSAT (1–5), NPS (0–10) và nhận xét của khách hàng sau khi phiếu bảo hành đã hoàn tất.

Các quy tắc nghiệp vụ chính:

Chỉ cho phép khảo sát phiếu bảo hành có trạng thái CLOSED.

Mỗi phiếu bảo hành chỉ được thực hiện khảo sát một lần.

Kết quả khảo sát được lưu vào PostgreSQL.

Người dùng có thể xem danh sách, chi tiết và tiếp nhận khảo sát thông qua giao diện React.

2. Yêu cầu môi trường

Docker Desktop có hỗ trợ Docker Compose.

Git để tải mã nguồn từ GitHub.

Trình duyệt web để truy cập giao diện hệ thống.

File .env được tạo từ .env.example.

Ứng dụng sử dụng Node.js, Express, React và PostgreSQL bên trong môi trường Docker. Không bắt buộc cài đặt Node.js hoặc PostgreSQL trực tiếp trên Windows.

3. Hướng dẫn chạy

Thực hiện tại thư mục gốc của repository.

Bước 1 – Chuẩn bị biến môi trường

Trên PowerShell:

Copy-Item .env.example .env

Kiểm tra và điều chỉnh các biến môi trường trong .env theo cấu hình dự án.

Bước 2 – Khởi động hệ thống

docker compose up --build -d

Bước 3 – Kiểm tra hệ thống

docker compose ps

Truy cập:

Frontend React: http://localhost:5173

Backend API: http://localhost:3000

Bước 4 – Chạy Unit Test

docker compose exec app npm test

Hệ thống sử dụng PostgreSQL trong Docker. Migration và seed cần được thực hiện theo cấu hình khởi tạo cơ sở dữ liệu của dự án.

4. Cấu trúc thư mục

CDTN-L8/
├── database/               # Migration và seed dữ liệu
├── docs/                   # Tài liệu phân tích, thiết kế và minh chứng
├── frontend/
│   ├── src/
│   │   ├── api/            # Kết nối Backend API
│   │   ├── components/     # Component dùng chung, DataState
│   │   ├── App.jsx         # Giao diện chính
│   │   └── main.jsx        # Điểm khởi tạo React
│   └── Dockerfile          # Cấu hình Docker Frontend
├── src/
│   ├── config/             # Cấu hình kết nối PostgreSQL
│   ├── routes/             # Định nghĩa các API endpoint
│   ├── services/           # Xử lý logic nghiệp vụ
│   ├── repositories/       # Truy vấn và thao tác dữ liệu
│   ├── app.js              # Cấu hình Express
│   └── server.js           # Khởi động Backend
├── tests/                  # Unit Test
├── compose.yaml            # Cấu hình Docker Compose
├── package.json            # Dependencies và scripts Backend
├── .env.example            # Mẫu biến môi trường
└── README.md               # Hướng dẫn dự án
