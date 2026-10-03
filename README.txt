POPOPHONE SOURCE V15.7 – LỌC THEO NĂM/THÁNG

TRIỂN KHAI
1. Thay appscript/Code.gs và cập nhật deployment hiện tại: New version > Deploy.
2. Deploy toàn bộ thư mục lên Netlify, giữ URL /exec đang hoạt động.
3. Ctrl+F5 để tải JavaScript mới.

SỬ DỤNG
Bộ chọn năm/tháng trên đầu dashboard mặc định tháng hiện tại.
Danh sách/tiến độ/chi phí gồm đơn trong kỳ và máy chưa xong từ kỳ trước.
Bỏ tick để chỉ xem kỳ đã chọn. Máy hoàn thành (7), bàn giao (8), hủy (11)
không được đưa vào nhóm tồn chưa xong. Máy tồn các năm cũ vẫn được giữ.
Tổng quan, dịch vụ, loại dịch vụ, tuần chỉ tính đơn trong kỳ đã chọn;
không cộng doanh thu/chi phí của máy tồn kỳ trước vào kết quả kỳ hiện tại.
Chọn Cả năm nếu cần. Lịch sử chỉ được tải chi tiết khi chọn kỳ đó.

TỐI ƯU
Apps Script đọc các cột Ngày nhận/Trạng thái để xác định dòng phù hợp,
sau đó đọc chi tiết các nhóm dòng trong kỳ và các máy chưa hoàn tất.
Phân loại khách mới/cũ vẫn đối chiếu cột SĐT và ngày lịch sử để không sai.
Các mục tải trước chỉ dùng kỳ đang chọn và giữ cache 60 giây trong trang.
Nút ↻ và lưu cập nhật sẽ bỏ cache. Không thay đổi dữ liệu Google Sheets.
Chi tiết đơn đọc trực tiếp dòng cần tìm thay vì dựng toàn bộ DATA.
Tốc độ vẫn phụ thuộc Sheets và số máy tồn; chưa đo trên deployment thật.

ĐÃ KIỂM TRA
Mô phỏng dữ liệu 2022–2026: kỳ hiện tại, tồn kỳ trước, kỳ lịch sử,
loại máy kỳ tương lai, checkbox tồn, phân quyền, tài chính và thống kê tuần
đúng kỳ, khách cũ, số dòng đọc chi tiết được giới hạn.
Kiểm tra frontend chọn năm/tháng, ngày cuối tháng, cache chuyển mục.
