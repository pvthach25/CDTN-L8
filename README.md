# <Tên phạm vi bằng một câu>
Sinh viên:
Phạm Vũ Thạch - 2374802010452 - Track SE
Học phần:
Chuyên đề Tốt nghiệp 1, HK1 2026-2027
Luồng nghiệp vụ:
L8 – Khảo sát hài lòng CSAT/NPS
## 1. Mục tiêu
Hệ thống giúp doanh nghiệp tạo, gửi và quản lý khảo sát CSAT/NPS để thu thập mức độ hài lòng của khách hàng sau khi sử dụng sản phẩm hoặc dịch vụ.
## 2. Yêu cầu môi trường
Node.js 20 LTS
PostgreSQL 16
Biến môi trường: xem .env.example
## 3. Hướng dẫn chạy
(BT2 yêu cầu ≤ 4 bước)
cp .env.example .env và điền giá trị
npm install
npm run db:migrate
npm run dev → mở http://localhost:3000/health
## 4. Cấu trúc thư mục
src/
├── controllers/    : Xử lý request từ người dùng
├── services/       : Chứa logic nghiệp vụ
├── models/         : Định nghĩa dữ liệu và truy cập DB
├── routes/         : Khai báo API
├── middlewares/    : Middleware xác thực, phân quyền
├── config/         : Cấu hình hệ thống
└── utils/          : Hàm hỗ trợ dùng chung
