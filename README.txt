POPOPHONE V16.8

TRIỂN KHAI
Thay appscript/Code.gs và cập nhật deployment hiện tại bằng New version > Deploy.
Deploy toàn bộ source Netlify, giữ URL /exec đang chạy. Tải lại trang.

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
QL xem thông tin kiểm tra, lý do chờ, dự kiến hoàn tất và ghi lần báo khách.
THEO_DOI_DON tự tạo khi cần; không đổi cấu trúc DATA hay form Sale.
Giữ cache ngắn, phân trang, kiểm tra phiên bản và retry chỉ cho yêu cầu đọc.

KIỂM TRA
Đã mô phỏng: chặn nhảy 6 -> 8–11, chặn 7 -> 8–11 khi chưa CH nhận,
CH chỉ nhận ở 7, cửa hàng kết thúc đủ 8–11 sau CH nhận, ngày trả chỉ ghi
cho 8, quay lại xử lý phải nhận lại, quyền kỹ thuật và lựa chọn giao diện.
Chưa kiểm tra deployment thật.

V16.8 – CHỈ BA TÀI KHOẢN DÙNG CHUNG
kt / 123456: kỹ thuật dùng chung, xem mọi đơn ở hai chi nhánh, KT nhận,
chọn người làm từ DM_KY_THUAT, cập nhật dịch vụ và trạng thái xử lý.
ql / pocn113: quản lý dùng chung, xem/điều phối mọi đơn, CH nhận, kết thúc
8–11, cập nhật xử lý và ghi nhận báo khách.
admin / pocn113: quản trị, sửa/mở lại đơn.
Có thể đặt mật khẩu thay thế trong Script properties REPAIR_KT_PASSWORD,
REPAIR_QL_PASSWORD, REPAIR_ADMIN_PASSWORD; không phải sửa code.
Tài khoản cá nhân, ms001–ms005 và cskh cũ bị bỏ; cần đăng nhập lại.
Phiên đăng nhập cũ không dùng được trên API mới.
Không giới hạn theo tên người đăng nhập, không tự gán Kỹ thuật/Quản lý
vào DATA. KT nhận phải chọn tên danh mục; người sửa chọn trong cập nhật.
LOG ghi tài khoản dùng chung thực hiện; không xác định cá nhân đăng nhập.
Người KT nhận và người sửa được lưu riêng; đổi người sửa không đổi lịch sử nhận.
Giữ luồng 7 -> CH nhận -> 8–11 và quy tắc tồn 1–7.

Đã kiểm tra mô phỏng V16.8: ba tài khoản/quyền, mật khẩu cấu hình, loại phiên
cũ, KT xem mọi đơn, lựa chọn danh mục không bị tên đăng nhập ghi đè, lưu
người KT nhận riêng người sửa, giữ luồng 7 -> CH nhận -> 8–11 và thống kê tồn.
