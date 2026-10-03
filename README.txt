POPOPHONE V16.7

TRIỂN KHAI
Thay appscript/Code.gs và cập nhật deployment hiện tại bằng New version > Deploy.
Deploy toàn bộ source Netlify, giữ URL /exec đang chạy. Tải lại trang.
CSKH dùng tài khoản cskh; mật khẩu đặt ở REPAIR_CSKH_PASSWORD trong Script properties.

LUỒNG NHẬN VÀ KẾT THÚC
Nút và nhãn rút gọn KT nhận, CH nhận.
KT nhận ghi nhận máy thực tế, người nhận và thời gian.
Kỹ thuật cập nhật 1–7 theo tiến độ. CH chỉ nhận khi trạng thái 7. Đã sửa xong.
Sau CH nhận mới được chuyển từ 7 sang 8/9/10/11. API chặn bỏ qua bước,
kể cả Admin; giao diện chỉ cho chọn trạng thái kết thúc khi đủ điều kiện.
Cửa hàng/quản lý dùng Cập nhật 8–11 sau khi xác nhận CH nhận.
Kỹ thuật vẫn không xác nhận 8. Đã trả khách; được 9–11 sau CH nhận.
CH nhận chỉ ghi xác nhận, không tự đổi trạng thái hay tăng số trả hôm nay.
Nếu đơn chuyển lại trạng thái 1–7 để xử lý, xác nhận CH cũ bị xóa; phải CH nhận
lại ở trạng thái 7. Lịch sử bàn giao cũ trong LOG vẫn giữ.
Đơn cũ kết thúc 8–11 không tự đổi dữ liệu, không tạo xác nhận bàn giao giả.
Cập nhật trạng thái và xác nhận nhận dùng chung ScriptLock tránh cập nhật song song.

TỒN VÀ DANH SÁCH
1–7 còn tồn; 8–11 kết thúc. Tổng quan cộng tồn kỳ trước.
Máy còn tồn chỉ lấy tồn; Danh sách lấy mọi trạng thái trong kỳ. Tìm kiếm xuyên năm.
Chờ CH nhận lấy mọi kỳ, chỉ trạng thái 7 chưa CH nhận.
Trả hôm nay chỉ trạng thái 8 có ngày trả hôm nay.
Các nút bo tròn có số đếm trước lọc trạng thái và phân trang, theo kỳ/chi nhánh/tìm kiếm.

LỊCH SỬ VÀ DỊCH VỤ
Chi tiết có lịch sử theo IMEI và SĐT toàn bộ DATA, ghi nhận lần tiếp nhận.
Dịch vụ thực tế chọn nhiều mục từ DM_DICH_VU; lưu DATA/CT_DICH_VU và log trước/sau.
Báo giá tổng nhập riêng. Chi nhánh lấy DATA, không hiện doanh thu/chi phí/lợi nhuận.
CSKH xem thông tin kiểm tra, lý do chờ, dự kiến hoàn tất và ghi lần báo khách.
THEO_DOI_DON tự tạo khi cần; không đổi cấu trúc DATA hay form Sale.
Giữ cache ngắn, phân trang, kiểm tra phiên bản và retry chỉ cho yêu cầu đọc.

KIỂM TRA
Đã mô phỏng: chặn nhảy 6 -> 8–11, chặn 7 -> 8–11 khi chưa CH nhận,
CH chỉ nhận ở 7, cửa hàng kết thúc đủ 8–11 sau CH nhận, ngày trả chỉ ghi
cho 8, quay lại xử lý phải nhận lại, quyền kỹ thuật và lựa chọn giao diện.
Chưa kiểm tra deployment thật.
