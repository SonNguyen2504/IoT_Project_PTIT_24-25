# IoT Project: Quản lý nhà thông minh 🏠

## Thông tin sinh viên 👋
**Nguyễn Trường Sơn - B21DCCN109 - IoT và ứng dụng nhóm 06**

## Mô tả dự án

Dự án quản lý nhà thông minh cung cấp giải pháp theo dõi và điều khiển các thiết bị trong gia đình. Các chức năng chính bao gồm:

- 📊 Đo đạc thời gian thực: Theo dõi nhiệt độ, độ ẩm và cường độ ánh sáng bằng cảm biến và hiển thị dữ liệu liên tục trên giao diện.
- 📈 Thống kê chất lượng không khí: Lưu trữ và hiển thị dữ liệu lịch sử về chất lượng không khí (nhiệt độ, độ ẩm, ánh sáng) theo thời gian thực, có phân trang và tìm kiếm.
- 🔌 Điều khiển thiết bị: Bật/tắt các thiết bị trong gia đình như đèn, quạt, điều hòa thông qua giao diện web, đồng bộ trạng thái sau khi có xác nhận từ thiết bị.
- 🕒 Xem lịch sử điều khiển: Theo dõi lịch sử bật/tắt thiết bị, lưu lại trạng thái và thời điểm thay đổi của từng thiết bị.

## Công nghệ sử dụng

### Frontend
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)

### Backend
- [Node.js](https://nodejs.org/fr)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [MQTT Broker](https://mqtt.org/)

### Phần cứng
- Chip điều khiển ESP8266
- Module cảm biến nhiệt độ độ ẩm DHT11
- Module cảm biến ánh sáng MS-CDS05
- 3 đèn LED đại diện cho 3 thiết bị điều hòa, đèn, quạt
- Board test, trở, ... 