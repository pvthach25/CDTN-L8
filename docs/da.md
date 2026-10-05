# DA – Phân tích dữ liệu khảo sát CSAT/NPS

## 1. Mục tiêu phân tích

Phần Data Analytics sử dụng dữ liệu khảo sát CSAT/NPS đã được hệ thống
lưu trữ để:

- Đo lường mức độ hài lòng của khách hàng.
- Đánh giá NPS.
- Theo dõi số lượng phản hồi.
- Phân tích kết quả theo thời gian.
- Phân bố kết quả theo từng mức điểm.
- Tổng hợp nhận xét của khách hàng để hỗ trợ đánh giá chất lượng dịch
  vụ.

Dữ liệu dự kiến có khoảng **2.600 bản ghi**.

------------------------------------------------------------------------

# 2. Nguồn dữ liệu

Nguồn dữ liệu là kết quả khảo sát được lưu trong MySQL sau khi khách
hàng hoàn thành khảo sát.

Các trường dữ liệu cốt lõi:

| Trường       | Kiểu dữ liệu đề xuất | Ý nghĩa                      | Vai trò                  |
|--------------|----------------------|------------------------------|--------------------------|
| survey_id    | INT/BIGINT           | Mã bản ghi khảo sát          | Khóa định danh           |
| csat_score   | INT                  | Điểm CSAT                    | Chỉ số hài lòng          |
| nps_score    | INT                  | Điểm NPS từ 0–10             | Chỉ số NPS               |
| comment      | TEXT                 | Nhận xét của khách hàng      | Phân tích phản hồi       |
| submitted_at | DATETIME             | Thời gian thực hiện khảo sát | Phân tích theo thời gian |

> Kiểu dữ liệu là định hướng triển khai trên MySQL; kiểu cuối cùng phải
> thống nhất với schema backend thực tế.

------------------------------------------------------------------------

# 3. Kiểm tra chất lượng dữ liệu

Trước khi phân tích, dữ liệu phải được kiểm tra theo các quy tắc sau.

## 3.1. Kiểm tra định danh

- `survey_id` không được trùng.
- `survey_id` không được rỗng.

## 3.2. Kiểm tra CSAT

- `csat_score` phải có giá trị hợp lệ theo thang điểm được sử dụng trên
  giao diện khảo sát.
- Bản ghi có CSAT sai miền giá trị không được đưa vào phép tính CSAT.

## 3.3. Kiểm tra NPS

- `nps_score` phải nằm trong khoảng **0–10**.
- Giá trị ngoài khoảng 0–10 được xem là dữ liệu không hợp lệ.

## 3.4. Kiểm tra nhận xét

- `comment` có thể không có giá trị nếu khách hàng không gửi nhận xét.
- Nội dung phải được xử lý đúng mã hóa để không làm sai dữ liệu văn bản.

## 3.5. Kiểm tra thời gian

- `submitted_at` phải là thời gian hợp lệ.
- Dữ liệu không có thời gian không được sử dụng cho phân tích xu hướng
  theo ngày/tháng.

------------------------------------------------------------------------

# 4. Chuẩn hóa dữ liệu

Quy trình chuẩn hóa:

1.  Loại bỏ hoặc loại riêng các bản ghi trùng `survey_id`.
2.  Kiểm tra miền giá trị của CSAT.
3.  Kiểm tra NPS trong khoảng 0–10.
4.  Chuẩn hóa dữ liệu thời gian về một định dạng thống nhất.
5.  Giữ nguyên nội dung nhận xét hợp lệ để phục vụ phân tích.
6.  Phân biệt dữ liệu thiếu với dữ liệu có giá trị bằng 0.
7.  Chỉ sử dụng các bản ghi hợp lệ trong các phép tính chỉ số.

------------------------------------------------------------------------

# 5. Các chỉ số phân tích

## 5.1. Tổng số lượt khảo sát

Tổng số bản ghi khảo sát hợp lệ trong phạm vi phân tích.

**Ý nghĩa:** xác định quy mô phản hồi của khách hàng.

------------------------------------------------------------------------

## 5.2. CSAT

CSAT được tính từ tỷ lệ các đánh giá thuộc nhóm mức độ hài lòng cao theo
thang CSAT mà hệ thống sử dụng.

Công thức tổng quát:

**CSAT (%) = Số đánh giá hài lòng / Tổng số đánh giá CSAT hợp lệ × 100**

Khi triển khai, nhóm điểm được xem là “hài lòng” phải thống nhất với
thang điểm CSAT được cấu hình trong hệ thống.

------------------------------------------------------------------------

## 5.3. NPS

NPS được tính theo ba nhóm:

- **Promoter:** điểm NPS từ 9 đến 10.
- **Passive:** điểm NPS từ 7 đến 8.
- **Detractor:** điểm NPS từ 0 đến 6.

Công thức:

**NPS = % Promoter − % Detractor**

Giá trị NPS nằm trong khoảng từ **-100 đến 100**.

------------------------------------------------------------------------

## 5.4. Phân bố điểm NPS

Thống kê số lượng và tỷ lệ đánh giá ở từng mức điểm từ 0 đến 10.

Mục tiêu:

- Xác định mức điểm xuất hiện nhiều.
- Quan sát sự phân bố giữa Detractor, Passive và Promoter.
- Đối chiếu với NPS tổng thể.

------------------------------------------------------------------------

## 5.5. Phân bố điểm CSAT

Thống kê số lượng đánh giá theo từng mức CSAT mà hệ thống cho phép.

Mục tiêu:

- Xác định mức hài lòng phổ biến.
- Theo dõi tỷ trọng các mức điểm.
- Hỗ trợ giải thích chỉ số CSAT tổng hợp.

------------------------------------------------------------------------

# 6. Phân tích theo thời gian

Trường `submitted_at` được sử dụng để lọc và tổng hợp dữ liệu theo
khoảng thời gian.

Các mức tổng hợp cần hỗ trợ:

- Theo ngày.
- Theo tháng.
- Theo khoảng thời gian do quản trị viên chọn.

Với mỗi khoảng thời gian, cần có khả năng xác định:

- Tổng số khảo sát.
- CSAT.
- NPS.
- Số lượng Promoter.
- Số lượng Passive.
- Số lượng Detractor.
- Phân bố điểm.
- Số lượng nhận xét.

------------------------------------------------------------------------

# 7. Phân tích nhận xét

Nhận xét là dữ liệu văn bản được khách hàng gửi cùng kết quả khảo sát.

Phần phân tích cần:

- Hiển thị danh sách nhận xét theo kết quả khảo sát.
- Cho phép quản trị viên xem nhận xét tương ứng với dữ liệu điểm.
- Giữ nguyên nội dung nhận xét khi truy xuất.
- Kết hợp nhận xét với CSAT/NPS và thời gian để hỗ trợ phân tích nguyên
  nhân.

Không tự suy diễn nội dung nhận xét thành các nhóm chủ đề nếu chưa có
quy tắc phân loại được thống nhất.

------------------------------------------------------------------------

# 8. Dashboard / Báo cáo DA

Báo cáo cần tập trung vào các thành phần sau:

## 8.1. Tổng quan

- Tổng số lượt khảo sát.
- CSAT.
- NPS.

## 8.2. Phân bố CSAT

Hiển thị số lượng hoặc tỷ lệ bản ghi theo từng mức CSAT.

## 8.3. Phân bố NPS

Hiển thị số lượng hoặc tỷ lệ bản ghi theo từng mức điểm NPS 0–10 và ba
nhóm Promoter/Passive/Detractor.

## 8.4. Xu hướng theo thời gian

Hiển thị biến động số lượng khảo sát, CSAT và NPS theo thời gian khi
quản trị viên chọn khoảng thời gian.

## 8.5. Nhận xét

Hiển thị nhận xét của khách hàng để quản trị viên xem chi tiết phản hồi.

------------------------------------------------------------------------

# 9. Bộ lọc dữ liệu

Bộ lọc chính của báo cáo là khoảng thời gian:

- Ngày bắt đầu.
- Ngày kết thúc.

Quy tắc:

1.  Ngày bắt đầu không được lớn hơn ngày kết thúc.
2.  Chỉ các bản ghi có `submitted_at` thuộc khoảng thời gian được chọn
    mới được tổng hợp.
3.  Sau khi lọc, các chỉ số tổng hợp phải được tính lại trên tập dữ liệu
    đã lọc.
4.  Nếu không có bản ghi, báo cáo phải hiển thị trạng thái không có dữ
    liệu.

------------------------------------------------------------------------

# 10. Quy tắc xử lý dữ liệu thiếu

| Trường hợp           | Cách xử lý                                                       |
|----------------------|------------------------------------------------------------------|
| Thiếu `survey_id`    | Loại khỏi dữ liệu phân tích                                      |
| Trùng `survey_id`    | Kiểm tra và loại bản ghi trùng theo quy tắc lưu trữ của hệ thống |
| CSAT không hợp lệ    | Không dùng bản ghi đó trong phép tính CSAT                       |
| NPS không hợp lệ     | Không dùng bản ghi đó trong phép tính NPS                        |
| Không có `comment`   | Vẫn giữ bản ghi cho các phân tích điểm                           |
| Thiếu `submitted_at` | Không dùng cho phân tích theo thời gian                          |

------------------------------------------------------------------------

# 11. Đầu ra phân tích

Hệ thống phân tích phải cung cấp các kết quả:

1.  Tổng số lượt khảo sát.
2.  Chỉ số CSAT.
3.  Chỉ số NPS.
4.  Số lượng và tỷ lệ Promoter.
5.  Số lượng và tỷ lệ Passive.
6.  Số lượng và tỷ lệ Detractor.
7.  Phân bố điểm CSAT.
8.  Phân bố điểm NPS từ 0 đến 10.
9.  Kết quả theo khoảng thời gian.
10. Danh sách nhận xét chi tiết.

------------------------------------------------------------------------

# 12. Traceability giữa DA và nghiệp vụ

| Nghiệp vụ                | Dữ liệu sử dụng                           | Kết quả phân tích             |
|--------------------------|-------------------------------------------|-------------------------------|
| US1 – Đánh giá CSAT      | `csat_score`                              | CSAT và phân bố CSAT          |
| US2 – Đánh giá NPS       | `nps_score`                               | NPS và phân bố NPS            |
| US3 – Gửi nhận xét       | `comment`                                 | Danh sách nhận xét            |
| US5 – Lưu kết quả        | Tất cả trường khảo sát                    | Nguồn dữ liệu phân tích       |
| US6 – Xem báo cáo        | `csat_score`, `nps_score`, `submitted_at` | Dashboard tổng quan           |
| US7 – Lọc theo thời gian | `submitted_at`                            | Báo cáo theo khoảng thời gian |
| US8 – Xem chi tiết       | `comment`, `csat_score`, `nps_score`      | Chi tiết và phân bố điểm      |

------------------------------------------------------------------------

# 13. Tiêu chí hoàn thành phần DA

Phần DA được xem là đáp ứng yêu cầu khi:

- Dữ liệu khảo sát được kiểm tra trước khi phân tích.
- CSAT được tính từ dữ liệu CSAT hợp lệ.
- NPS được tính đúng theo ba nhóm Promoter, Passive và Detractor.
- Báo cáo thể hiện được số lượng khảo sát.
- Có phân bố CSAT và NPS.
- Có khả năng lọc và tổng hợp theo thời gian.
- Có thể truy xuất nhận xét của khách hàng.
- Các chỉ số sau khi lọc được tính lại trên đúng tập dữ liệu đã chọn.
