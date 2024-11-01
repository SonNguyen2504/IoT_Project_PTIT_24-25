let currentPage = 1; // Trang hiện tại
let totalPages = 0; // Tổng số trang sau khi lọc
let limit = 10; // Số lượng bản ghi mỗi trang

// Hàm hiển thị dữ liệu theo trang
const renderPage = async (page) => {
    try {
        const searchTime = document.getElementById('searchTime').value;

        if (searchTime) {
            const dateParts = searchTime.split(' ');
            if (dateParts.length !== 2) {
                alert('Vui lòng nhập đúng định dạng: HH:mm:ss DD/MM/YYYY');
                return;
            }

            const timePart = dateParts[0]; // "HH:mm:ss"
            const datePart = dateParts[1]; // "DD/MM/YYYY"

            // Chuyển đổi định dạng từ "DD/MM/YYYY" sang "YYYY-MM-DD"
            let [day, month, year] = datePart.split('/');

            if (day.length === 1) day = '0' + day;
            if (month.length === 1) month = '0' + month;

            const formattedDate = `${year}-${month}-${day}T${timePart}`;

            console.log('Formatted date:', new Date(formattedDate).toISOString());

            // Cập nhật params cho thời gian
            const params = new URLSearchParams({
                page,
                limit,
                searchTime: new Date(formattedDate).toISOString(),
            });

            const response = await fetch(`http://localhost:3000/api/device-status?${params.toString()}`);
            const data = await response.json();

            console.log('Data:', data);

            const tbody = document.getElementById('device-history');
            tbody.innerHTML = '';

            data.deviceStatusData.forEach(item => {
                let nameDevice;
                if (item.device === 'led') nameDevice = 'LED';
                else if (item.device === 'fan') nameDevice = 'Quạt';
                else if (item.device === 'ac') nameDevice = 'Điều hòa';
                const row = `<tr>
                    <td>${item.deviceId}</td>
                    <td>${nameDevice}</td>
                    <td>${item.status}</td>
                    <td>${new Date(item.time).toLocaleString('vi-VN')}</td>
                </tr>`;
                tbody.innerHTML += row;
            });

            currentPage = page;
            totalPages = data.totalPages; // Cập nhật tổng số trang
            renderPagination(totalPages);
        } else {
            const params = new URLSearchParams({
                page,
                limit,
            });

            const response = await fetch(`http://localhost:3000/api/device-status?${params.toString()}`);
            const data = await response.json();

            console.log('Data:', data);

            const tbody = document.getElementById('device-history');
            tbody.innerHTML = '';

            data.deviceStatusData.forEach(item => {
                let nameDevice;
                if (item.device === 'led') nameDevice = 'LED';
                else if (item.device === 'fan') nameDevice = 'Quạt';
                else if (item.device === 'ac') nameDevice = 'Điều hòa';
                const row = `<tr>
                    <td>${item.deviceId}</td>
                    <td>${nameDevice}</td>
                    <td>${item.status}</td>
                    <td>${new Date(item.time).toLocaleString('vi-VN')}</td>
                </tr>`;
                tbody.innerHTML += row;
            });

            currentPage = page;
            totalPages = data.totalPages; // Cập nhật tổng số trang
            renderPagination(totalPages);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Hàm cập nhật kích thước trang
function updatePageSize() {
    limit = parseInt(document.getElementById('pageSize').value);
    currentPage = 1; // Reset về trang 1 khi thay đổi kích thước
    renderPage(currentPage); // Gọi lại hàm renderPage với trang 1
}

// Cập nhật hàm phân trang
function renderPagination(totalPages) {
    if (totalPages === 0) {
        alert('Không tìm thấy dữ liệu phù hợp');
        document.getElementById('pagination').style.display = 'none';
        return;
    } else {
        document.getElementById('pagination').style.display = 'block';
    }

    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    const maxButtons = 3; // Số trang hiển thị ở mỗi bên
    let startPage = Math.max(1, currentPage - maxButtons);
    let endPage = Math.min(totalPages, currentPage + maxButtons);

    if (currentPage > maxButtons + 1) {
        pageNumbers.innerHTML += `<button onclick="renderPage(1)">1</button>`;
        if (currentPage > maxButtons + 2) {
            pageNumbers.innerHTML += `<span>...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pageNumbers.innerHTML += `<button class="${activeClass}" onclick="renderPage(${i})">${i}</button>`;
    }

    if (currentPage < totalPages - maxButtons) {
        if (currentPage < totalPages - maxButtons - 1) {
            pageNumbers.innerHTML += `<span>...</span>`;
        }
        pageNumbers.innerHTML += `<button onclick="renderPage(${totalPages})">${totalPages}</button>`;
    }

    // Cập nhật trạng thái của nút phân trang
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;

    // Thay đổi màu nền cho nút trang hiện tại
    const buttons = pageNumbers.getElementsByTagName('button');
    for (let button of buttons) {
        if (button.innerText == currentPage) {
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
        } else {
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    }
}

// Khởi tạo hiển thị trang đầu tiên
renderPage(currentPage);

// Sự kiện cho các nút navbar
document.getElementById('homePage').addEventListener('click', function () {
    window.location.href = 'index.html';
});

document.getElementById('airQualityBtn').addEventListener('click', function () {
    window.location.href = 'statistical.html';
});

document.getElementById('deviceHistoryBtn').addEventListener('click', function () {
    window.location.href = 'device.html';
});

document.getElementById('information').addEventListener('click', () => {
    window.location.href = 'info.html';
});