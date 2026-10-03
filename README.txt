POPOPHONE V16.4 – NHẬN MÁY, BÁO KHÁCH VÀ LỊCH SỬ

TRIỂN KHAI
1. Thay appscript/Code.gs, cập nhật deployment hiện tại: New version > Deploy.
2. Deploy toàn bộ source Netlify, giữ URL /exec đang chạy.
3. Ctrl+F5. Tài khoản hiện tại giữ nguyên.
4. CSKH: username cskh, mật khẩu đặt trong Script properties REPAIR_CSKH_PASSWORD.

GIAO DIỆN
Chi nhánh lấy từ DATA, tô đỏ ở đầu mỗi thẻ.
Thẻ ưu tiên IMEI và tên khách, sau đó dòng máy, thợ, hẹn trả, dịch vụ và báo giá.
Không lấy mã sửa chữa làm tiêu đề. Mã vẫn dùng ngầm để liên kết đúng đơn,
vì một IMEI có thể xuất hiện ở nhiều lần sửa hoặc bảo hành.
Báo giá lấy Giá dự kiến / Giá báo dự kiến / Báo giá dự kiến trong DATA.
Giá 0 được hiện đúng; cột trống hiện Chưa báo giá.
Không hiện chi phí, lợi nhuận hay doanh thu.

NHẬN MÁY VÀ TRẢ KHÁCH
Kỹ thuật bấm Nhận máy khi thực sự nhận được máy. Đơn chưa gán sẽ gán cho
kỹ thuật xác nhận; lưu người nhận và thời gian. Không tự đổi trạng thái sửa.
Cửa hàng bấm Nhận máy về sau khi nhận thực tế, ở trạng thái 7/9/11.
Phải có xác nhận nhận về trước khi xác nhận trạng thái 8. Đã trả khách.
Máy cũ chưa có xác nhận vẫn hiện Chưa xác nhận; không tự tạo lịch sử giả.
Chỉ trạng thái 8 kết thúc đơn và giảm số chưa trả.

THÔNG TIN BÁO KHÁCH
Chi tiết đơn hiện báo giá, kết quả kiểm tra để báo khách, đang chờ việc gì,
dự kiến hoàn tất, lần gần nhất báo khách và nội dung đã báo.
Kỹ thuật/QL kỹ thuật/Trưởng phòng/Admin bấm Cập nhật thông tin để ghi
kết quả ngắn gọn, lý do chờ, dự kiến hoàn tất và báo giá.
Kết quả xử lý trong form cập nhật kỹ thuật cũng được hiển thị khi chưa có
bản tóm tắt báo khách riêng. Hẹn trả ban đầu không bị tự đổi khi nhập dự kiến.
CSKH/cửa hàng/kỹ thuật/quản lý có thể ghi nhận đã báo khách và kênh liên hệ.
CSKH không được đổi trạng thái, báo giá hoặc xác nhận nhận máy.

LỊCH SỬ VÀ TÌM KIẾM
Chi tiết hiện người cập nhật, thời gian, trạng thái trước/sau, xác nhận nhận máy,
thông tin báo khách và lần liên hệ. Lịch sử cũ chỉ hiện những gì có trong LOG.
Tìm IMEI/SĐT/tên khách/mã đơn sẽ tìm trên toàn bộ lịch sử, không cần biết tháng.
Tìm từ Máy còn tồn sẽ chuyển sang Danh sách để tìm được cả máy đã trả.
Bộ lọc chi nhánh/trạng thái vẫn áp dụng cho kết quả tìm kiếm.

DỮ LIỆU MỚI
Sheet THEO_DOI_DON được tự tạo khi ghi nhận thao tác mới đầu tiên.
Lưu xác nhận nhận máy, thông tin báo khách và lần liên hệ theo mã đơn.
Không thêm các cột này vào DATA, không đổi cột hoặc luồng nhập Sale từ link khác.
Báo giá tiếp tục cập nhật vào cột hiện có trong DATA.
LOG_SUA_CHUA tiếp tục ghi lịch sử; trạng thái mới ghi rõ trước và sau.

TỐC ĐỘ / KIỂM TRA
Giữ cache ngắn hạn, đọc DATA theo khoảng cột vận hành và phân trang.
Theo dõi đơn được đọc thêm từ sheet nhỏ THEO_DOI_DON; bỏ cache sau cập nhật.
Giữ Nhận hôm nay / Trả hôm nay / Tổng chưa trả cùng thống kê thợ/chi nhánh/quá hẹn.
Đã kiểm tra mô phỏng: bàn giao, quyền CSKH, báo giá/kết quả/dự kiến,
lịch sử trước/sau, tìm đơn năm cũ, không trộn IMEI với mã liên kết,
cache/chuyển mục và thống kê 6.006 đơn. Chưa kiểm tra deployment thật.

V16.4 – LỊCH SỬ MÁY/KHÁCH VÀ NHIỀU DỊCH VỤ
Chi tiết đơn hiện các lần tiếp nhận cùng IMEI và cùng SĐT trên toàn bộ DATA,
kể cả đơn đã trả từ các năm trước. SĐT +84 được đối chiếu với dạng 0.
Không ghép khách chỉ vì trùng tên; không tra cứu bằng IMEI/SĐT trống.
Số lần tiếp nhận tính theo phiếu, gồm cả phiếu hiện tại và bảo hành; không
khẳng định mọi lần tiếp nhận đều đã sửa thành công. Thứ tự theo ngày nhận;
phiếu thiếu ngày xếp trước, cùng ngày xếp theo mã phiếu.
Kỹ thuật chọn nhiều dịch vụ từ DM_DICH_VU, bỏ dịch vụ cũ và chọn dịch vụ
thực tế. Dịch vụ cũ ngoài danh mục vẫn giữ được; dịch vụ thêm mới phải
thuộc danh mục. Lưu vào DATA và CT_DICH_VU; LOG ghi dịch vụ trước/sau.
Giữ giá/ghi chú của dịch vụ cũ còn được chọn. Báo giá tổng vẫn nhập riêng,
không tự cộng giá danh mục. Lịch sử máy/khách là các tóm tắt vận hành,
không chứa chi phí/lợi nhuận. Chỉ tải khi mở chi tiết, tái sử dụng cache DATA.

Kiểm tra V16.4: mô phỏng lịch sử nhiều năm, IMEI/SĐT, danh mục dịch vụ,
thêm/bỏ/xóa hết/chống trùng dịch vụ, giữ giá và ghi chú, log trước/sau;
kiểm tra lại thống kê 6.006 đơn, cache và phân quyền. Chưa test deployment thật.
