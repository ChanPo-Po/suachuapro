POPOPHONE V16.1 – TỔNG QUAN THÁNG VÀ MÁY CÒN TỒN

TRIỂN KHAI
1. Cập nhật appscript/Code.gs, Deploy > Manage deployments > Edit > New version.
2. Deploy toàn bộ source Netlify, gồm netlify/functions. Giữ URL /exec đang chạy.
3. Ctrl+F5. Giữ tài khoản hiện tại. CSKH: username cskh, mật khẩu tự đặt ở
Script properties > REPAIR_CSKH_PASSWORD như bản trước.

TỔNG QUAN
Mặc định tháng hiện tại. Năm/tháng nằm riêng phía trên thanh mục.
- Tổng đơn còn tồn hiện tại: chỉ 8. Đã trả khách mới kết thúc.
  Máy 7. Đã sửa xong, 9. Back lại khách, 11. Hủy sửa chưa chuyển sang 8 vẫn tồn.
- Đơn nhận hôm nay: tổng số và số lượng theo trạng thái hiện tại.
- Kỹ thuật: số đơn trong kỳ, số đơn còn tồn (bao gồm tồn kỳ trước).
- Chi nhánh: số đơn trong kỳ, số đơn còn tồn.
- Danh sách máy quá hẹn: tối đa 20 máy, ưu tiên hẹn cũ nhất;
  nút Xem tất cả mở danh sách quá hẹn có phân trang.

MÁY CÒN TỒN
Lọc chi nhánh bằng cột Chi nhánh nhận / CN nhận / Chi nhánh / CN trong DATA.
Không dùng các vị trí tự đặt ở bản trước, không thêm cột mới.
Mỗi thẻ hiện tên máy cùng IMEI, khách, thợ, chi nhánh và hẹn trả.
Cửa hàng có nút Trả khách cho máy sửa xong/back/hủy.
Sau xác nhận, trạng thái thành 8. Đã trả khách và giảm tồn.
CSKH chỉ xem; kỹ thuật thấy đơn của mình và đơn chưa gán.
Sale tiếp tục nhập từ link riêng, app đọc DATA hiện có.
Không có giao diện tài chính/doanh thu/lợi nhuận.

TỐI ƯU 504
Bỏ cách đọc nhiều nhóm dòng rải rác. Đọc tiêu đề và khoảng cột dùng cho
vận hành trong 2 lần gọi Sheets; chỉ giữ các trường vận hành trong bộ nhớ.
Lọc kỳ, đếm số lượng và phân trang tại Apps Script.
Cache nén trên server 15 giây, trong trang 30 giây; đổi trạng thái bỏ cache.
Nút ↻ bỏ cache trong trang và yêu cầu đọc mới trên server.
Lỗi đọc 502/504 được thử lại 1 lần; thao tác lưu không tự thử lại.
Proxy có timeout và trả lỗi JSON thay vì chờ không giới hạn.
Dữ liệu Sale từ app khác có thể xuất hiện trễ theo cache; dùng ↻ để lấy mới.
Chưa xác nhận tốc độ hoặc hết 504 trên deployment thật.

KIỂM TRA
Đã chạy kiểm tra cú pháp, liên kết file và mô phỏng 6.006 đơn:
đếm tháng/hôm nay, trạng thái cuối 8, nhóm thợ/chi nhánh, quá hẹn,
2 lần đọc Sheets, cache nén, bỏ cache sau lưu, trả khách, CSKH chỉ xem,
chuyển mục dùng cache và phản hồi bộ lọc cũ không ghi đè kết quả mới.
