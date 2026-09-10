POPOPHONE REPAIR V15 - MOBILE COMMAND

THAY ĐỔI CHÍNH
- Bỏ module chấm công/lương khỏi giao diện REPAIR và khỏi bootstrap.
- Không tải toàn bộ 6.000+ dòng DATA khi mở web.
- Danh sách đơn phân trang 30 dòng/trang, mặc định 30 ngày gần nhất.
- Tiến độ lọc server-side theo trạng thái/ngày/KTV/từ khóa.
- Admin: Tổng quan tài chính, tiến độ, dịch vụ+dòng máy+vật tư thực tế, loại dịch vụ/khách mới-cũ-bảo hành, 8 tuần gần nhất.
- QL kỹ thuật: danh sách + cập nhật trạng thái/dịch vụ.
- Trưởng phòng: như QLKT + xem/cập nhật chi phí/lợi nhuận.
- Cửa hàng: chỉ xem đơn, trạng thái và thực thu; backend không trả chi phí/lợi nhuận.
- Kỹ thuật: chỉ thấy đơn của mình và cập nhật xử lý.
- doGet không còn setup sheet mỗi lần health check.

ROLE
admin
 department_head = Trưởng phòng
 tech_manager = QL kỹ thuật
 tech = Kỹ thuật
 store = QL cửa hàng

TRIỂN KHAI
1. Dán appscript/Code.gs vào Apps Script và Deploy > New deployment.
2. Nếu URL deployment thay đổi, cập nhật API_URL trong js/config.js.
3. Upload frontend lên Netlify.
