let airQualityHistoryFiltered = []; // Biến lưu trữ dữ liệu đã lọc
let dataRendered = []; // Data để render dùng trong hàm renderPage
let currentPage = 0; // Trang hiện tại
let totalPages = 0; // Tổng số trang sau khi lọc

// Tạo dữ liệu mẫu cho chất lượng không khí
let airQualityHistory = Array.from({ length: 100 }, (_, i) => ({
    id: `ID${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    temperature: (Math.random() * (40 - 20) + 20).toFixed(1),
    humidity: (Math.random() * (80 - 70) + 70).toFixed(1),
    lightIntensity: (Math.random() * (700 - 500) + 500).toFixed(0),
    time: new Date(Date.now() - Math.floor(Math.random() * 1e9)).toISOString()
}));

// Hàm phân trang
function paginate(items, itemsPerPage) {
    const pages = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
        pages.push(items.slice(i, i + itemsPerPage));
    }
    return pages;
}

// Hàm hiển thị dữ liệu theo trang
function renderPage(pageNumber) {
    const itemsPerPage = 10; // mỗi trang 10 dữ liệu  
    dataRendered = airQualityHistoryFiltered.length > 0 ? airQualityHistoryFiltered : airQualityHistory;
    const pagedHistory = paginate(dataRendered, itemsPerPage);

    // console.log(airQualityHistory, airQualityHistoryFiltered);

    totalPages = pagedHistory.length; // Cập nhật tổng số trang

    const airQualityTable = document.getElementById('air-quality-history');
    const pageNumbers = document.getElementById('page-numbers');

    // Hiển thị dữ liệu trong bảng
    airQualityTable.innerHTML = '';
    pagedHistory[pageNumber].forEach((data, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${data.id}</td>
          <td>${data.temperature}</td>
          <td>${data.humidity}</td>
          <td>${data.lightIntensity}</td>
          <td>${new Date(data.time).toLocaleString('vi-VN')}</td>
        `;
        airQualityTable.appendChild(tr);
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

// Hàm thay đổi trang
function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 0 && newPage < totalPages) {
        renderPage(newPage);
    }
}

// Hàm lọc dữ liệu theo thời gian
function filterData() {
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

    airQualityHistoryFiltered = airQualityHistory.filter(data => {
        const time = new Date(data.time);
        return time >= startTime && time <= endTime;
    });

    // Kiểm tra nếu không có dữ liệu phù hợp
    if (airQualityHistoryFiltered.length === 0) {
        alert("Không có dữ liệu nào phù hợp với khoảng thời gian bạn đã chọn.");
    }

    document.getElementById('sortBy').value = 'none';

    renderPage(0); // Hiển thị lại từ trang đầu sau khi lọc
}

// Hàm lọc mảng dữ liệu theo ngày dùng cho sắp xếp
function findByDay(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);

    startTime.setHours(0, 0, 0, 0);
    endTime.setHours(23, 59, 59, 999);

    return airQualityHistory.filter(item => {
        const time = new Date(item.time);
        return time >= startTime && time <= endTime;
    })
}

// Hàm sort data
function sortData() {
    const sortBy = document.getElementById('sortBy').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;

    let data = [];

    // nếu đã có ô ngày thì lấy dữ liệu trong khoảng
    // nếu không thì lấy toàn bộ dữ liệu
    if (start && end) {
        data = findByDay(start, end);
    }
    else if ((!start && end) || (start && !end)) {
        alert('Không được để trống ô nhập ngày tháng');
        return;
    }
    else data = airQualityHistory;

    let sortedData = [];

    switch (sortBy) {
        case 'temperatureAsc':
            sortedData = data.sort((a, b) => a.temperature - b.temperature);
            break;
        case 'temperatureDesc':
            sortedData = data.sort((a, b) => b.temperature - a.temperature);
            break;
        case 'humidityAsc':
            sortedData = data.sort((a, b) => a.humidity - b.humidity);
            break;
        case 'humidityDesc':
            sortedData = data.sort((a, b) => b.humidity - a.humidity);
            break;
        case 'lightIntensityAsc':
            sortedData = data.sort((a, b) => a.lightIntensity - b.lightIntensity);
            break;
        case 'lightIntensityDesc':
            sortedData = data.sort((a, b) => b.lightIntensity - a.lightIntensity);
            break;
        case 'none':
            sortedData = data;
            break;
    }

    if (sortedData.length === 0) {
        alert('Không có dữ liệu phù hợp');
        return;
    }

    //console.log(data, airQualityHistoryFiltered);
    airQualityHistoryFiltered = sortedData

    console.log(sortedData, airQualityHistoryFiltered, airQualityHistory);

    // render 
    renderPage(0);
}

// Hàm search theo đúng thời gian nhập
function searchData() {
    const searchInput = document.getElementById('searchTime').value;

    if(!searchInput) {
        alert('Vui lòng nhập thời gian muốn tìm kiếm');
    }

    let data = [];

    // console.log(searchTime.toISOString().slice(0, 19));
    // console.log(searchTime);
    // console.log(searchTime.toISOString();

    data = airQualityHistory.filter((data) => {
        const time = new Date(data.time).toISOString().slice(0, 19);
        const searchTimeFormated = new Date(searchInput).toISOString().slice(0, 19);
        return time === searchTimeFormated;
    })

    // console.log(data);

    airQualityHistoryFiltered = data;

    renderPage(0);
}

// Khởi tạo hiển thị trang đầu tiên
renderPage(0);

// Sự kiện nút lọc
document.getElementById('applyFilter').addEventListener('click', filterData);

// sự kiến nút sắp xếp
document.getElementById('applySort').addEventListener('click', sortData);

// Sự kiện nút tìm kiếm theo thời gian
document.getElementById('searchButton').addEventListener('click', searchData);

// Sự kiện cho các nút navbar
document.getElementById('homePage').addEventListener('click', function () {
    window.location.href = 'index.html';
});

document.getElementById('deviceHistoryBtn').addEventListener('click', function () {
    window.location.href = 'device.html';
});

document.getElementById('information').addEventListener('click', () => {
    window.location.href = 'info.html';
})