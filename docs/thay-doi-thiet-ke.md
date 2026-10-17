# Nhật ký thay đổi thiết kế BT1

**Dự án:** Smart CRM – Khảo sát mức độ hài lòng khách hàng (L8)  
**Track:** Software Engineering (SE)  
**Phạm vi:** 7 User Story (US1–US7), 6 Use Case (UC01–UC06)

## 1. Mục đích

Tài liệu ghi nhận các phản hồi của giảng viên sau BT1, quyết định điều chỉnh thiết kế và lý do kỹ thuật. Các thay đổi phải được đồng bộ giữa SRS, Use Case, sơ đồ thiết kế, cơ sở dữ liệu và mã nguồn.

## 2. Nhật ký phản hồi và quyết định thiết kế

| STT | Phản hồi của giảng viên | Quyết định điều chỉnh | Lý do kỹ thuật | Cách kiểm tra |
|---|---|---|---|---|
| 1 | Ba sơ đồ Use Case, kiến trúc và ERD chưa có chú thích ký hiệu. | Bổ sung phần chú thích cho từng sơ đồ, giải thích các ký hiệu thực sự được sử dụng. | Giúp người đọc hiểu đúng quan hệ, thành phần và cấu trúc dữ liệu. | Mở từng file Draw.io và kiểm tra chú thích trên sơ đồ. |
| 2 | Sơ đồ Use Case chưa ghi mã UC01–UC06. | Bổ sung mã UC01–UC06, bảo đảm tên và mã khớp với đặc tả Use Case trong SRS. | Giúp truy vết yêu cầu và tránh nhầm lẫn giữa sơ đồ với đặc tả. | Đối chiếu sơ đồ với danh sách Use Case trong SRS. |
| 3 | Bảng `survey_response` chỉ có một cột `score`, trong khi CSAT và NPS dùng hai thang điểm khác nhau. | Thay `score` bằng `csat_score` và `nps_score`; quy định miền giá trị và điều kiện hợp lệ tương ứng. Đồng bộ thay đổi trong SRS, bảng thuật ngữ, ERD, DDL, API và giao diện. | CSAT sử dụng thang điểm 1–5, còn NPS sử dụng thang điểm 0–10. Một cột chung không thể hiện rõ loại điểm và dễ gây nhầm lẫn khi thống kê. | Kiểm tra cấu trúc bảng, dữ liệu hợp lệ, API và kết quả báo cáo. |
| 4 | UC01 liệt kê US3–US5 không khớp danh sách User Story tại mục 1.3. | Đối chiếu lại mục 1.3 với đặc tả UC01–UC06 và sửa các mã User Story được tham chiếu. Giữ nguyên phạm vi 7 User Story US1–US7. | Bảo đảm tính nhất quán và khả năng truy vết từ yêu cầu đến Use Case. | Kiểm tra từng mã US trong đặc tả và bảng truy vết yêu cầu. |
| 5 | ERD còn các nhãn `Row 1`, `Row 2`, `Row 3` trong bảng CUSTOMER. | Xóa các nhãn mặc định và thay bằng tên trường thực tế theo mô hình dữ liệu đã thống nhất. | Tránh nhầm lẫn giữa nội dung minh họa của công cụ và cấu trúc bảng thực tế. | Mở `erd.drawio`, kiểm tra bảng CUSTOMER và đối chiếu DDL. |
| 6 | Khóa chính của TICKET có tên `UniqueID`, chưa thống nhất. | Thống nhất tên khóa chính theo mô hình dữ liệu và DDL hiện hành; loại bỏ tên `UniqueID` nếu không phải tên trường được chốt. | Tên trường thống nhất giúp tránh lỗi khi khai báo khóa ngoại, truy vấn và ánh xạ dữ liệu. | Đối chiếu ERD, DDL, migration và các truy vấn liên quan. |
| 7 | Phụ lục AI chỉ có một dòng chung cho nhiều phần. | Tách bảng kê khai theo từng công cụ, mục đích sử dụng, vị trí áp dụng và cách kiểm chứng. Bổ sung câu cam kết theo đúng mẫu của giảng viên. | Minh bạch phạm vi hỗ trợ của AI và thể hiện trách nhiệm kiểm tra nội dung của sinh viên. | Đối chiếu từng dòng với sản phẩm đã sử dụng và mẫu cam kết được giao. |
| 8 | Lịch sử Git chủ yếu sử dụng thông điệp `Add files via upload`. | Sử dụng thông điệp Conventional Commits phản ánh đúng nội dung thay đổi, chẳng hạn `docs:`, `fix:`, `feat:` hoặc `chore:`. | Giúp lịch sử thay đổi dễ đọc, dễ rà soát và xác định mục đích của từng commit. | Kiểm tra lịch sử Git và bảo đảm có ít nhất hai commit hợp lệ. |
| 9 | BT2 cần ưu tiên sửa `survey_response` và kiểm thử ngoại lệ 6a của UC01. | Sau khi thống nhất mô hình dữ liệu, bổ sung kiểm thử cho trường hợp phiếu chưa đóng hoặc phiếu đã được khảo sát. | Bảo đảm quy tắc nghiệp vụ được kiểm soát, tránh ghi nhận phản hồi không hợp lệ hoặc khảo sát trùng. | Chạy test cho từng trường hợp và xác nhận hệ thống từ chối thao tác không hợp lệ. |

## 3. Nguyên tắc thực hiện

1. Giữ nguyên phạm vi 7 User Story và 6 Use Case đã thống nhất.
2. Không tự ý bổ sung chức năng ngoài phạm vi BT1.
3. Mọi thay đổi về dữ liệu phải được cập nhật đồng bộ trong SRS, ERD, DDL, API và mã nguồn.
4. Chỉ xác nhận hoàn thành sau khi đã sửa file thực tế và kiểm tra kết quả.
5. Các quyết định liên quan đến công nghệ, tên trường hoặc quy tắc nghiệp vụ phải căn cứ vào tài liệu đã thống nhất của dự án.

## 4. Trạng thái

Tài liệu này ghi nhận kế hoạch điều chỉnh dựa trên phản hồi của giảng viên. Trạng thái hoàn thành của từng hạng mục sẽ được cập nhật sau khi sửa và kiểm chứng các sản phẩm tương ứng.
