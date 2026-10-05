# SRS – Hệ thống khảo sát CSAT/NPS

## 1. Thông tin tài liệu

| Mục             | Nội dung                                                                                                |
|-----------------|---------------------------------------------------------------------------------------------------------|
| Luồng nghiệp vụ | L8 – Khảo sát hài lòng CSAT/NPS                                                                         |
| Phạm vi         | Khách hàng thực hiện khảo sát; hệ thống kiểm tra và lưu kết quả; quản trị viên xem và phân tích báo cáo |
| Dữ liệu dự kiến | Khoảng 2.600 bản ghi                                                                                    |
| Frontend        | HTML, CSS, JavaScript                                                                                   |
| Backend         | Spring Boot                                                                                             |
| Database        | MySQL                                                                                                   |

------------------------------------------------------------------------

## 2. Mục tiêu hệ thống

Hệ thống cho phép khách hàng đánh giá mức độ hài lòng về dịch vụ thông
qua CSAT và NPS, gửi nhận xét chi tiết và lưu kết quả khảo sát. Quản trị
viên có thể xem báo cáo tổng quan, lọc kết quả theo thời gian và xem chi
tiết nhận xét cũng như phân bố kết quả theo từng mức điểm.

Hệ thống tập trung vào hai nhóm người dùng:

- **Khách hàng:** thực hiện khảo sát và gửi phản hồi.
- **Quản trị viên:** kiểm tra, tổng hợp và phân tích dữ liệu khảo sát.

------------------------------------------------------------------------

## 3. Phạm vi nghiệp vụ

### 3.1. Luồng nghiệp vụ chính

1.  Khách hàng mở chức năng khảo sát.
2.  Khách hàng chọn mức điểm CSAT.
3.  Khách hàng chọn điểm NPS từ 0 đến 10.
4.  Khách hàng có thể nhập nhận xét chi tiết.
5.  Hệ thống kiểm tra tính hợp lệ của dữ liệu khảo sát.
6.  Nếu dữ liệu hợp lệ, hệ thống lưu CSAT, NPS, nhận xét và thời gian
    thực hiện.
7.  Quản trị viên truy cập báo cáo CSAT/NPS.
8.  Hệ thống hiển thị tổng số lượt đánh giá và các chỉ số CSAT/NPS.
9.  Quản trị viên có thể lọc dữ liệu theo khoảng thời gian.
10. Quản trị viên có thể xem nhận xét chi tiết và phân bố kết quả theo
    từng mức điểm.

### 3.2. Ngoài phạm vi

Tài liệu này không xác định các chức năng không xuất hiện trong luồng
nghiệp vụ đã được mô tả, chẳng hạn quản lý tài khoản khách hàng, quản lý
sản phẩm/dịch vụ, gửi email marketing hoặc tích hợp hệ thống bên ngoài.

------------------------------------------------------------------------

# 4. Actor

| Actor         | Mô tả                                                           |
|---------------|-----------------------------------------------------------------|
| Khách hàng    | Người thực hiện khảo sát, chọn điểm CSAT/NPS và gửi nhận xét    |
| Quản trị viên | Người xem báo cáo, lọc dữ liệu và xem chi tiết kết quả khảo sát |

------------------------------------------------------------------------

# 5. User Story

## US1 – Đánh giá CSAT

**MUST:** Là khách hàng, tôi muốn chọn mức độ hài lòng CSAT để phản hồi
về chất lượng dịch vụ.

### Tiêu chí GWT

**Given** khách hàng đang ở trang khảo sát,  
**When** khách hàng chọn mức CSAT và gửi khảo sát,  
**Then** hệ thống ghi nhận mức độ hài lòng.

### Ngoại lệ

- Nếu khách hàng chưa chọn mức CSAT, hệ thống yêu cầu chọn mức đánh giá
  trước khi tiếp tục.

------------------------------------------------------------------------

## US2 – Đánh giá NPS

**MUST:** Là khách hàng, tôi muốn chọn điểm NPS từ 0 đến 10 để đánh giá
khả năng giới thiệu dịch vụ.

### Tiêu chí GWT

**Given** khách hàng đang thực hiện khảo sát,  
**When** khách hàng chọn điểm NPS từ 0 đến 10,  
**Then** hệ thống ghi nhận điểm NPS.

### Ngoại lệ

- Nếu điểm NPS không thuộc khoảng 0–10, hệ thống không cho gửi khảo sát
  và yêu cầu chọn lại.

------------------------------------------------------------------------

## US3 – Gửi nhận xét

**MUST:** Là khách hàng, tôi muốn nhập nhận xét chi tiết để góp ý cho
doanh nghiệp.

### Tiêu chí GWT

**Given** khách hàng đã chọn điểm đánh giá,  
**When** khách hàng nhập nhận xét và gửi khảo sát,  
**Then** hệ thống lưu nhận xét cùng kết quả đánh giá.

### Ngoại lệ

- Nếu nội dung nhận xét vượt quá giới hạn ký tự của hệ thống, hệ thống
  thông báo lỗi và yêu cầu điều chỉnh nội dung.

------------------------------------------------------------------------

## US4 – Kiểm tra dữ liệu khảo sát

**SHOULD:** Hệ thống nên kiểm tra và xác thực dữ liệu khảo sát trước khi
lưu.

### Tiêu chí GWT

**Given** khách hàng gửi dữ liệu khảo sát,  
**When** hệ thống nhận dữ liệu,  
**Then** hệ thống kiểm tra các trường bắt buộc và miền giá trị của
CSAT/NPS trước khi lưu.

### Ngoại lệ

- Nếu dữ liệu thiếu hoặc sai định dạng, hệ thống không lưu bản ghi và
  thông báo lỗi.

------------------------------------------------------------------------

## US5 – Lưu kết quả khảo sát

**SHOULD:** Hệ thống nên lưu kết quả khảo sát vào cơ sở dữ liệu.

### Tiêu chí GWT

**Given** dữ liệu khảo sát hợp lệ,  
**When** khách hàng hoàn tất gửi khảo sát,  
**Then** hệ thống lưu CSAT, NPS, nhận xét và thời gian thực hiện vào
MySQL.

### Ngoại lệ

- Nếu thao tác lưu dữ liệu thất bại, hệ thống thông báo lỗi và không xác
  nhận khảo sát đã được lưu thành công.

------------------------------------------------------------------------

## US6 – Xem báo cáo CSAT/NPS

**SHOULD:** Quản trị viên nên xem được báo cáo CSAT/NPS.

### Tiêu chí GWT

**Given** quản trị viên đã đăng nhập và truy cập trang báo cáo,  
**When** hệ thống có dữ liệu khảo sát,  
**Then** hệ thống hiển thị tổng số đánh giá và các chỉ số CSAT/NPS.

### Ngoại lệ

- Nếu chưa có dữ liệu khảo sát, hệ thống hiển thị trạng thái chưa có dữ
  liệu thay vì báo cáo rỗng không có thông tin.

------------------------------------------------------------------------

## US7 – Lọc kết quả theo thời gian

**COULD:** Quản trị viên có thể lọc kết quả khảo sát theo khoảng thời
gian để phân tích xu hướng.

### Tiêu chí GWT

**Given** quản trị viên đang xem báo cáo,  
**When** quản trị viên chọn ngày bắt đầu và ngày kết thúc,  
**Then** hệ thống hiển thị kết quả khảo sát trong khoảng thời gian đã
chọn.

### Ngoại lệ

- Nếu ngày bắt đầu lớn hơn ngày kết thúc, hệ thống thông báo khoảng thời
  gian không hợp lệ và không thực hiện lọc.

------------------------------------------------------------------------

## US8 – Xem chi tiết kết quả

**COULD:** Quản trị viên có thể xem nhận xét và phân bố kết quả đánh giá
theo từng mức điểm.

### Tiêu chí GWT

**Given** quản trị viên đang xem báo cáo và hệ thống có dữ liệu khảo
sát,  
**When** quản trị viên mở phần chi tiết,  
**Then** hệ thống hiển thị nhận xét và phân bố kết quả theo từng mức
điểm.

### Ngoại lệ

- Nếu không có nhận xét hoặc không có dữ liệu trong phạm vi đang xem, hệ
  thống hiển thị trạng thái không có dữ liệu tương ứng.

------------------------------------------------------------------------

# 6. Use Case

## Danh sách Use Case

| Mã   | Use Case                    | Actor chính   | Mục đích                                     |
|------|-----------------------------|---------------|----------------------------------------------|
| UC01 | Thực hiện khảo sát CSAT/NPS | Khách hàng    | Gửi điểm CSAT và NPS để đánh giá dịch vụ     |
| UC02 | Gửi nhận xét                | Khách hàng    | Cung cấp phản hồi chi tiết                   |
| UC03 | Lưu kết quả khảo sát        | Hệ thống      | Lưu dữ liệu khảo sát hợp lệ                  |
| UC04 | Xem báo cáo CSAT/NPS        | Quản trị viên | Xem tổng quan kết quả và các chỉ số          |
| UC05 | Lọc kết quả theo thời gian  | Quản trị viên | Phân tích kết quả trong một khoảng thời gian |
| UC06 | Xem chi tiết kết quả        | Quản trị viên | Xem nhận xét và phân bố điểm                 |

------------------------------------------------------------------------

# 7. Quan hệ giữa các Use Case

### UC01 – Thực hiện khảo sát CSAT/NPS

- **include UC03 – Lưu kết quả khảo sát:** sau khi khảo sát hợp lệ được
  gửi, kết quả phải được lưu.
- **extend UC02 – Gửi nhận xét:** nhận xét là phần phản hồi bổ sung,
  khách hàng có thể gửi cùng khảo sát.

### UC04 – Xem báo cáo CSAT/NPS

- **extend UC05 – Lọc kết quả theo thời gian:** lọc thời gian là chức
  năng tùy chọn khi xem báo cáo.
- **extend UC06 – Xem chi tiết kết quả:** xem chi tiết là thao tác mở
  rộng khi quản trị viên cần phân tích sâu hơn.

> **Lưu ý về hướng quan hệ:** trong UML, `<<include>>` đi từ Use Case
> chính đến Use Case bắt buộc được gọi; `<<extend>>` đi từ Use Case mở
> rộng đến Use Case cơ sở.

------------------------------------------------------------------------

# 8. Đặc tả Use Case

## UC01 – Thực hiện khảo sát CSAT/NPS

**Actor:** Khách hàng

**Mục tiêu:** Khách hàng gửi đánh giá CSAT và NPS về dịch vụ.

**Tiền điều kiện:** - Khách hàng đang ở giao diện khảo sát. - Hệ thống
khảo sát hoạt động bình thường.

**Luồng chính:** 1. Khách hàng mở khảo sát. 2. Hệ thống hiển thị lựa
chọn CSAT. 3. Khách hàng chọn mức CSAT. 4. Hệ thống hiển thị lựa chọn
NPS từ 0 đến 10. 5. Khách hàng chọn điểm NPS. 6. Khách hàng có thể nhập
nhận xét. 7. Khách hàng gửi khảo sát. 8. Hệ thống kiểm tra dữ liệu. 9.
Hệ thống lưu kết quả khảo sát. 10. Hệ thống thông báo khảo sát đã được
ghi nhận.

**Luồng ngoại lệ:** - CSAT chưa được chọn → yêu cầu chọn mức đánh giá. -
NPS ngoài 0–10 → yêu cầu chọn lại. - Dữ liệu không hợp lệ → không lưu và
thông báo lỗi. - Lưu dữ liệu thất bại → thông báo thao tác chưa thành
công.

**Hậu điều kiện:** Một bản ghi khảo sát hợp lệ được lưu trong hệ thống.

------------------------------------------------------------------------

## UC02 – Gửi nhận xét

**Actor:** Khách hàng

**Mục tiêu:** Khách hàng gửi nhận xét chi tiết về chất lượng dịch vụ.

**Tiền điều kiện:** Khách hàng đã thực hiện phần đánh giá của khảo sát.

**Luồng chính:** 1. Khách hàng nhập nhận xét. 2. Khách hàng gửi khảo
sát. 3. Hệ thống kiểm tra nội dung. 4. Hệ thống lưu nhận xét cùng kết
quả khảo sát.

**Luồng ngoại lệ:** - Nội dung vượt giới hạn cho phép → hệ thống yêu cầu
điều chỉnh.

**Hậu điều kiện:** Nhận xét hợp lệ được lưu cùng bản ghi khảo sát.

------------------------------------------------------------------------

## UC03 – Lưu kết quả khảo sát

**Actor:** Hệ thống

**Mục tiêu:** Lưu dữ liệu khảo sát hợp lệ để phục vụ thống kê và báo
cáo.

**Tiền điều kiện:** Dữ liệu khảo sát đã vượt qua bước kiểm tra.

**Luồng chính:** 1. Hệ thống nhận dữ liệu khảo sát hợp lệ. 2. Hệ thống
tạo bản ghi khảo sát. 3. Hệ thống lưu CSAT, NPS, nhận xét và thời gian
thực hiện. 4. Hệ thống xác nhận lưu thành công.

**Luồng ngoại lệ:** - Không thể ghi dữ liệu vào MySQL → báo lỗi và không
xác nhận lưu thành công.

**Hậu điều kiện:** Kết quả khảo sát tồn tại trong cơ sở dữ liệu.

------------------------------------------------------------------------

## UC04 – Xem báo cáo CSAT/NPS

**Actor:** Quản trị viên

**Mục tiêu:** Xem tổng quan kết quả khảo sát.

**Tiền điều kiện:** Quản trị viên đã đăng nhập và có quyền xem báo cáo.

**Luồng chính:** 1. Quản trị viên mở trang báo cáo. 2. Hệ thống lấy dữ
liệu khảo sát. 3. Hệ thống tính toán tổng số lượt đánh giá và các chỉ số
CSAT/NPS. 4. Hệ thống hiển thị báo cáo.

**Luồng ngoại lệ:** - Không có dữ liệu → hiển thị trạng thái chưa có dữ
liệu.

**Hậu điều kiện:** Quản trị viên xem được báo cáo tổng quan.

------------------------------------------------------------------------

## UC05 – Lọc kết quả theo thời gian

**Actor:** Quản trị viên

**Mục tiêu:** Xem kết quả khảo sát trong một khoảng thời gian cụ thể.

**Tiền điều kiện:** Quản trị viên đang ở trang báo cáo.

**Luồng chính:** 1. Quản trị viên chọn ngày bắt đầu. 2. Quản trị viên
chọn ngày kết thúc. 3. Hệ thống kiểm tra khoảng thời gian. 4. Hệ thống
lấy các bản ghi thuộc khoảng thời gian. 5. Hệ thống tính lại các chỉ số.
6. Hệ thống hiển thị báo cáo đã lọc.

**Luồng ngoại lệ:** - Ngày bắt đầu lớn hơn ngày kết thúc → thông báo
khoảng thời gian không hợp lệ.

**Hậu điều kiện:** Báo cáo phản ánh đúng dữ liệu trong khoảng thời gian
đã chọn.

------------------------------------------------------------------------

## UC06 – Xem chi tiết kết quả

**Actor:** Quản trị viên

**Mục tiêu:** Xem sâu hơn vào dữ liệu khảo sát.

**Tiền điều kiện:** Quản trị viên đang xem báo cáo.

**Luồng chính:** 1. Quản trị viên mở phần chi tiết. 2. Hệ thống lấy dữ
liệu nhận xét và điểm đánh giá. 3. Hệ thống phân bố kết quả theo từng
mức điểm. 4. Hệ thống hiển thị nhận xét và phân bố kết quả.

**Luồng ngoại lệ:** - Không có dữ liệu → hiển thị trạng thái không có dữ
liệu.

**Hậu điều kiện:** Quản trị viên xem được thông tin chi tiết của kết quả
khảo sát.

------------------------------------------------------------------------

# 9. Yêu cầu chức năng

| Mã   | Yêu cầu                                                                                    |
|------|--------------------------------------------------------------------------------------------|
| FR01 | Hệ thống phải cho phép khách hàng chọn mức CSAT.                                           |
| FR02 | Hệ thống phải cho phép khách hàng chọn NPS trong khoảng 0–10.                              |
| FR03 | Hệ thống phải cho phép khách hàng nhập nhận xét.                                           |
| FR04 | Hệ thống phải kiểm tra dữ liệu khảo sát trước khi lưu.                                     |
| FR05 | Hệ thống phải lưu CSAT, NPS, nhận xét và thời gian thực hiện.                              |
| FR06 | Hệ thống phải cho quản trị viên xem tổng quan kết quả khảo sát.                            |
| FR07 | Hệ thống phải cung cấp các chỉ số CSAT/NPS từ dữ liệu khảo sát.                            |
| FR08 | Hệ thống phải cho phép lọc kết quả theo khoảng thời gian.                                  |
| FR09 | Hệ thống phải cho phép quản trị viên xem nhận xét chi tiết.                                |
| FR10 | Hệ thống phải hiển thị phân bố kết quả theo từng mức điểm.                                 |
| FR11 | Hệ thống phải thông báo lỗi khi dữ liệu khảo sát không hợp lệ.                             |
| FR12 | Hệ thống phải thông báo trạng thái không có dữ liệu khi phạm vi truy vấn không có bản ghi. |

------------------------------------------------------------------------

# 10. Yêu cầu phi chức năng

## NFR01 – Tính đúng đắn dữ liệu

Dữ liệu CSAT phải thuộc miền giá trị mà giao diện khảo sát quy định; NPS
phải thuộc 0–10. Chỉ dữ liệu hợp lệ mới được lưu.

## NFR02 – Tính nhất quán

Dữ liệu hiển thị trên báo cáo phải được tổng hợp từ cùng nguồn dữ liệu
khảo sát đã lưu trong MySQL.

## NFR03 – Khả năng mở rộng

Hệ thống phải có khả năng xử lý dữ liệu khảo sát dự kiến khoảng 2.600
bản ghi mà không làm thay đổi nghiệp vụ.

## NFR04 – Khả năng bảo trì

Frontend, backend và database phải được tách biệt rõ ràng để thuận tiện
sửa đổi và kiểm thử.

## NFR05 – Khả năng kiểm thử

Các quy tắc kiểm tra CSAT, NPS, khoảng thời gian và thao tác lưu dữ liệu
phải có thể kiểm thử độc lập.

------------------------------------------------------------------------

# 11. Mô hình dữ liệu nghiệp vụ

Bản ghi khảo sát tối thiểu cần quản lý các thông tin:

| Thuộc tính   | Ý nghĩa                      |
|--------------|------------------------------|
| survey_id    | Định danh bản ghi khảo sát   |
| csat_score   | Mức điểm CSAT                |
| nps_score    | Điểm NPS từ 0 đến 10         |
| comment      | Nhận xét của khách hàng      |
| submitted_at | Thời gian thực hiện khảo sát |

Các trường trên là cơ sở cho việc lưu trữ, thống kê, lọc theo thời gian
và hiển thị báo cáo.

------------------------------------------------------------------------

# 12. Công nghệ dự kiến

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Spring Boot
- **Database:** MySQL

------------------------------------------------------------------------

# 13. Traceability

| User Story | Use Case   | Requirement      |
|------------|------------|------------------|
| US1        | UC01       | FR01             |
| US2        | UC01       | FR02             |
| US3        | UC02       | FR03             |
| US4        | UC01, UC03 | FR04, FR11       |
| US5        | UC03       | FR05             |
| US6        | UC04       | FR06, FR07, FR12 |
| US7        | UC05       | FR08             |
| US8        | UC06       | FR09, FR10, FR12 |
