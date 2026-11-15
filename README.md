Smart CRM L8 – Khảo sát mức độ hài lòng CSAT/NPS
Học phần: Chuyên đề Tốt nghiệp 1 (CDTN1) – Track Software Engineering (SE)
Sinh viên: Phạm Vũ Thạch – 2374802010452
GitHub: https://github.com/pvthach25/CDTN-L8
Phiên bản dự kiến nộp BT3: v1.0 (chỉ tạo tag sau khi kiểm tra triển khai từ bản clone sạch)
1. Giới thiệu dự án
Smart CRM L8 là hệ thống hỗ trợ quản lý phiếu dịch vụ và thu thập phản hồi của khách hàng bằng hai chỉ số CSAT (mức độ hài lòng) và NPS (khả năng giới thiệu dịch vụ). Prototype gồm:
- Backend: Node.js 22, Express, cung cấp API quản lý phiếu (ticket), khảo sát (survey_response) và đăng nhập.
- Frontend: React/Vite, hiển thị danh sách, chi tiết và giao diện tiếp nhận khảo sát.
- Cơ sở dữ liệu: PostgreSQL 17.
- Triển khai: Docker Compose để khởi động các dịch vụ app, db và frontend.
Chức năng và quy tắc nghiệp vụ
- Quản lý phiếu dịch vụ và kết quả khảo sát thông qua các API CRUD.
- Ghi nhận điểm CSAT từ 1 đến 5, điểm NPS từ 0 đến 10 và nhận xét của khách hàng.
- Chỉ cho phép khảo sát phiếu có trạng thái CLOSED; mỗi phiếu chỉ được khảo sát một lần.
- Đăng nhập bằng mật khẩu; phiên đăng nhập sử dụng token được lưu dưới dạng băm.
- Giới hạn quyền truy cập kết quả khảo sát theo tài khoản sở hữu bản ghi.
Giới hạn hiện tại: Các API quản lý phiếu được dùng chung cho những tài khoản đã đăng nhập, chưa phân quyền theo chủ sở hữu phiếu. Đây là prototype phục vụ học tập, chưa phù hợp để triển khai như một hệ thống đa khách hàng trong môi trường sản xuất.
2. Yêu cầu môi trường
- Đã cài Docker Desktop và có Docker Compose v2.
- Có Git để tải mã nguồn.
- Cổng 3000 (API) và 5173 (giao diện) chưa bị chương trình khác sử dụng.
Không cần cài riêng Node.js hoặc PostgreSQL trên Windows khi chạy bằng Docker.
3. Hướng dẫn chạy từ bản clone sạch
Tải mã nguồn từ GitHub về một thư mục trống, mở Terminal tại thư mục gốc dự án. Sau khi có tag v1.0, có thể dùng đúng tag đó để kiểm tra bản nộp.

Trên Windows (PowerShell), chạy đúng hai lệnh thiết lập:
Copy-Item .env.example .env
docker compose up -d --build
Trên Linux/macOS:
cp .env.example .env
docker compose up -d --build
File .env.example chỉ chứa giá trị minh họa phục vụ chạy thử. Phải thay mật khẩu cơ sở dữ liệu và mật khẩu Admin trước khi triển khai ra môi trường có người khác truy cập. Không commit file .env chứa thông tin bí mật lên GitHub.

Ở lần khởi tạo với volume cơ sở dữ liệu mới, hệ thống tạo các bảng và nạp dữ liệu mẫu (khách hàng, trung tâm dịch vụ, kỹ thuật viên, phiếu CLOSED và khảo sát). Tài khoản Admin minh họa được tự tạo nếu chưa tồn tại; mật khẩu của tài khoản đã tồn tại không bị ghi đè.
4. Kiểm tra hệ thống sau khi chạy
Mở PowerShell trong thư mục dự án và thực hiện:
docker compose ps
Invoke-RestMethod http://localhost:3000/health
docker compose exec app npm test
Kết quả cần đạt:
- Ba dịch vụ db, app, frontend đều hoạt động và đạt trạng thái healthy.
- API /health trả về status: ok và database: connected.
- Bộ Unit Test của phiên bản BT3 dự kiến đạt 25 PASS, 0 FAIL; cần xác nhận bằng kết quả chạy thực tế trên máy.
Địa chỉ truy cập:
- Giao diện: http://localhost:5173
- API kiểm tra sức khỏe: http://localhost:3000/health
Đăng nhập bằng tài khoản Admin được cấu hình trong file .env của máy bạn. Không dùng tài khoản hoặc mật khẩu minh họa cho hệ thống công khai.
5. Môi trường kiểm thử BT3 độc lập
Để kiểm thử mà không xóa dữ liệu của môi trường chính, sử dụng Docker Compose với project riêng:
docker compose -p smartcrm_bt3_clean -f compose.yaml -f compose.clean-test.yaml up -d --build
Theo cấu hình compose.clean-test.yaml trong bộ cập nhật BT3, môi trường kiểm thử sử dụng:
- API: http://localhost:3002
- Frontend: http://localhost:5175
Môi trường này dùng tên project và volume riêng, không ghi đè cơ sở dữ liệu của project chính. Để kiểm thử quyền truy cập theo chủ sở hữu (OWASP A01), chạy script scripts/test-a01.ps1 theo hướng dẫn trong docs/deployment-guide.md. Sau khi kiểm thử thật và đạt kết quả mong đợi, lưu ảnh Terminal vào docs/screenshots/TC11-owner-access.png.

Dừng môi trường chính mà không xóa dữ liệu:
docker compose down
Chỉ xóa volume của môi trường kiểm thử tạm khi chắc chắn không cần giữ dữ liệu:
docker compose -p smartcrm_bt3_clean -f compose.yaml -f compose.clean-test.yaml down -v
6. Tài liệu và minh chứng BT3
Tài liệu	Nội dung
[Test Plan](docs/test-plan.md)	Phạm vi, loại kiểm thử, tiêu chí và dữ liệu kiểm thử
[Test Report](docs/test-report.md)	Kết quả các tình huống kiểm thử và ảnh minh chứng
[Bug Log](docs/bug-log.md)	Ba lỗi đã phát hiện, sửa và liên kết commit riêng
[Deployment Guide – English](docs/deployment-guide.md)	Hướng dẫn triển khai bằng tiếng Anh theo yêu cầu BT3
[Security Checklist](docs/checklist-bao-mat.md)	Danh sách tự kiểm tra các yêu cầu bảo mật
[API Documentation – English](docs/api-docs.md)	Tài liệu các endpoint API bằng tiếng Anh cho Track SE
[AI Disclosure](docs/ai-disclosure.md)	Khai báo việc sử dụng công cụ AI
[Ảnh minh chứng](docs/screenshots/)	Ảnh chụp các lần kiểm thử thực tế


7. Trạng thái hoàn thiện và lưu ý nộp bài
- Bộ Unit Test đã được kiểm tra trong môi trường chuẩn bị tài liệu với kết quả 25/25 PASS; vẫn cần chạy lại trên Docker của máy nộp bài.
- Các ảnh TC01–TC10 đã có từ đợt kiểm thử trước; cần đối chiếu nội dung ảnh với kết quả trong docs/test-report.md sau khi cập nhật mã nguồn.
- Kiểm thử API hai tài khoản của TC11 (OWASP A01) và việc dựng lại Docker từ bản clone sạch cần được xác nhận bằng ảnh thật trước khi đánh dấu PASS.
- Chỉ tạo tag v1.0 và xuất bản báo cáo PDF cuối cùng sau khi đã kiểm tra toàn bộ các minh chứng, đường dẫn GitHub và quy trình chạy từ bản clone sạch.
Lưu ý: Kết quả Unit Test PASS không đồng nghĩa mọi tình huống kiểm thử API, giao diện và Docker đều đã PASS. Không tự ghi kết quả cho các trường hợp chưa chạy.