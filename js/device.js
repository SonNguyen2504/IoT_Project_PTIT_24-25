let deviceHistoryFiltered = []; // Mảng dữ liệu đã lọc
let dataRendered = [];
let currentPage = 0; // Trang hiện tại
let totalPages = 0; // Tổng số trangg sau khi lọc


// Tạo dữ liệu mẫu cho lịch sử thiết bị với 3 thiết bị cụ thể: Quạt, Điều hòa, và Đèn LED
let deviceHistory = Array.from({ length: 100 }, (_, i) => {
    const deviceNames = ['Quạt', 'Điều hòa', 'Đèn LED'];
    return {
        name: deviceNames[i % 3],
        time: new Date(Date.now() - Math.floor(Math.random() * 1e9)).toISOString(),
        status: Math.random() > 0.5 ? 'Bật' : 'Tắt'
    };
});


// Hàm phân trang
function paginate(items, itemsPerPage) {
    const pages = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
        pages.push(items.slice(i, i + itemsPerPage));
    }
    return pages;
}


// Hiển thị dữ liệu và phân trang
function renderPage(pageNumber) {
    const itemsPerPage = 10; // 10 dữ liệu mỗi trang
    dataRendered = deviceHistoryFiltered.length > 0 ? deviceHistoryFiltered : deviceHistory;
    const pagedHistory = paginate(dataRendered, itemsPerPage);

    // console.log(deviceHistoryFiltered, deviceHistory);

    totalPages = pagedHistory.length; // cập nhật tổng số trang 

    const deviceHistoryTable = document.getElementById('device-history');
    const pageNumbers = document.getElementById('page-numbers');

    // Hiển thị dữ liệu trong bảng
    deviceHistoryTable.innerHTML = '';
    pagedHistory[pageNumber].forEach((device, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${pageNumber * itemsPerPage + index + 1}</td>
                    <td>${device.name}</td>
                    <td>${new Date(device.time).toLocaleString('vi-VN')}</td>
                    <td>${device.status}</td>
                `;
        deviceHistoryTable.appendChild(tr);
    });

    // Hiển thị số trang với ... ngăn cách
    const maxPageButtons = 4;

    pageNumbers.innerHTML = '';

    function createPageButton(i, isCurrent = false) {
        const button = document.createElement('button');
        button.textContent = i + 1;
        button.className = isCurrent ? 'active' : '';
        button.addEventListener('click', () => renderPage(i));
        pageNumbers.appendChild(button);
    }

    if (totalPages <= maxPageButtons + 2) {
        for (let i = 0; i < totalPages; i++) {
            createPageButton(i, i === pageNumber);
        }
    } else {
        if (pageNumber < maxPageButtons - 1) {
            for (let i = 0; i < maxPageButtons; i++) {
                createPageButton(i, i === pageNumber);
            }
            pageNumbers.appendChild(document.createTextNode('...'));
            createPageButton(totalPages - 1);
        } else if (pageNumber >= totalPages - maxPageButtons + 1) {
            createPageButton(0);
            pageNumbers.appendChild(document.createTextNode('...'));
            for (let i = totalPages - maxPageButtons; i < totalPages; i++) {
                createPageButton(i, i === pageNumber);
            }
        } else {
            createPageButton(0);
            pageNumbers.appendChild(document.createTextNode('...'));
            for (let i = pageNumber - 2; i <= pageNumber + 1; i++) {
                createPageButton(i, i === pageNumber);
            }
            if (pageNumber + 1 < totalPages - 2) {
                pageNumbers.appendChild(document.createTextNode('...'));
            }
            createPageButton(totalPages - 1);
        }
    }

    // Cập nhật trạng thái nút mũi tên
    currentPage = pageNumber;
    document.getElementById('prev-page').disabled = pageNumber === 0;
    document.getElementById('next-page').disabled = pageNumber === totalPages - 1;
}

// Chuyển đổi trang
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < totalPages) {
        renderPage(newPage);
    }
}

// Hàm lọc dữ liệu theo thời gian để hiển thị
function filterDataByDay() {
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');

    const startTime = new Date(startTimeInput.value).setHours(0, 0, 0, 0);
    const endTime = new Date(endTimeInput.value).setHours(23, 59, 59, 999);

    // Kiểm tra nếu ngày bắt đầu hoặc kết thúc bị để trống
    if (!startTimeInput.value || !endTimeInput.value) {
        alert("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc.");
        return;
    }

    // Kiểm tra nếu ngày bắt đầu lớn hơn ngày kết thúc
    if (startTime > endTime) {
        alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc.");
        return;
    }

    deviceHistoryFiltered = deviceHistory.filter(data => {
        const time = new Date(data.time);
        return time >= startTime && time <= endTime;
    });

    // Kiểm tra nếu không có dữ liệu phù hợp
    if (deviceHistoryFiltered.length === 0) {
        alert("Không có dữ liệu nào phù hợp với khoảng thời gian bạn đã chọn.");
    }

    document.getElementById('findByDevice').value = 'none'

    renderPage(0); // Hiển thị lại từ trang đầu sau khi lọc
}

// Hàm lọc mảng dữ liệu theo ngày dùng cho tìm thiết bị
function findByDay(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);

    startTime.setHours(0, 0, 0, 0);
    endTime.setHours(23, 59, 59, 999);

    return deviceHistory.filter(item => {
        const time = new Date(item.time);
        return time >= startTime && time <= endTime;
    })
}

function filterDataByDevice() {
    const option = document.getElementById('findByDevice').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;

    let data = []

    if (start && end) {
        data = findByDay(start, end);
    }
    else if ((!start && end) || (start && !end)) {
        alert('Không được để trống ô nhập ngày tháng');
        return;
    }
    else data = deviceHistory;

    let foundData = [];
    switch (option) {
        case 'fan':
            foundData = data.filter((item) => item.name === 'Quạt');
            break;
        case 'airConditioner':
            foundData = data.filter((item) => item.name === 'Điều hòa');
            break;
        case 'LED':
            foundData = data.filter((item) => item.name === 'Đèn LED');
            break;
        case 'none':
            foundData = data;
            break;
    }

    if (foundData.length === 0) {
        alert('Không có dữ liệu nào phù hợp.')
    }

    deviceHistoryFiltered = foundData;

    console.log(foundData, deviceHistoryFiltered, deviceHistory);

    // render 
    renderPage(0);
}

// Hiển thị trang đầu tiên
renderPage(0);

// Sự kiện cho các nút navbar
document.getElementById('homePage').addEventListener('click', function () {
    window.location.href = 'index.html';
});

document.getElementById('airQualityBtn').addEventListener('click', function () {
    window.location.href = 'statistical.html';
});

document.getElementById('information').addEventListener('click', () => {
    window.location.href = 'info.html';
})

// Sự kiện Filter
document.getElementById('applyFilter').addEventListener('click', filterDataByDay);

// Sự kiện Search
document.getElementById('applyFind').addEventListener('click', filterDataByDevice);
