POPOPHONE V16.0 – THEO DÕI MÁY SỬA CHỮA VÀ BÀN GIAO

CÀI ĐẶT
1. Thay appscript/Code.gs, cập nhật deployment hiện tại bằng New version > Deploy.
2. Deploy toàn bộ source Netlify. Giữ URL /exec đang chạy.
3. Ctrl+F5. Tài khoản hiện tại giữ nguyên.

LUỒNG VẬN HÀNH
Sale tiếp nhận từ link riêng, dữ liệu vào DATA như trước.
Cửa hàng xác nhận máy đang tại tiệm / chuyển đến kỹ thuật.
Kỹ thuật nhận máy, cập nhật vị trí tại kỹ thuật và trạng thái kiểm tra/sửa.
Sửa xong: trạng thái 7. Đã sửa xong, vẫn là máy còn tồn.
Kỹ thuật xác nhận đang chuyển về cửa hàng.
Cửa hàng xác nhận Tại cửa hàng chờ trả.
Khi khách nhận: cửa hàng bấm Bàn giao > Đã trả khách.
Máy trạng thái 7 tự chuyển sang 8. Đã trả khách ở bước này.
Trường hợp back/hủy: xác nhận vị trí Đã trả khách nhưng giữ trạng thái 9/11.
Vị trí là xác nhận thực tế; dữ liệu cũ chưa ghi vị trí sẽ hiển thị Chưa cập nhật.
Không tự suy ra máy đã về tiệm chỉ vì trạng thái đã sửa xong.

DỮ LIỆU / BỘ LỌC
Mặc định tháng hiện tại và máy còn tồn từ các kỳ trước; không có checkbox.
Năm/tháng ở đầu trang; bộ lọc tìm đơn/trạng thái/vị trí gọn trên điện thoại.
Máy 7 chưa trả vẫn tính tồn, khác với bản cũ chỉ đếm máy chưa sửa xong.
Không hiện doanh thu/lợi nhuận/chi phí trên dashboard và các response vận hành.
Danh sách phân trang 30 đơn; cache 60 giây; nhấn ↻ để lấy mới ngay.
Cột Vị trí máy được thêm cuối DATA khi xác nhận bàn giao lần đầu.
Không xóa/move cột DATA, không thay đổi link Sale nhận máy.
Trang chủ app chuyển sang đăng nhập; đã bỏ giao diện tiếp nhận trùng lặp.

PHÂN QUYỀN
Cửa hàng: xem tổng quan/tồn/danh sách; xác nhận gửi máy, nhận về, trả khách.
Kỹ thuật: thấy máy chưa gán và máy của mình; cập nhật xử lý/bàn giao.
QL kỹ thuật/Trưởng phòng/Admin: xem toàn bộ, phân công và cập nhật xử lý.
CSKH: chỉ xem, không có nút sửa/bàn giao; backend cũng chặn quyền ghi.
Bật tài khoản CSKH: Apps Script > Project Settings > Script properties,
thêm REPAIR_CSKH_PASSWORD với mật khẩu tự chọn. Đăng nhập username cskh.
Không có mật khẩu mặc định cho tài khoản mới này.

TRẠNG THÁI
1. Đã tiếp nhận
2. Đang kiểm tra
3. Chờ báo giá
4. Chờ khách duyệt
5. Đang sửa
6. Chờ linh kiện
7. Đã sửa xong
8. Đã trả khách
9. Back lại khách
10. Bảo hành lại
11. Hủy sửa

KIỂM TRA
Đã kiểm tra cú pháp, liên kết file, mô phỏng dữ liệu 2022–2026,
máy đã sửa xong kỳ cũ vẫn tính tồn, trả khách giảm tồn, CSKH không ghi,
kỹ thuật không sửa máy thợ khác, cửa hàng không trả khi chưa nhận về,
cache chuyển mục và phản hồi bộ lọc cũ. Chưa chạy trên deployment thật.
