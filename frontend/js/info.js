// Sự kiện cho các nút navbar
document.getElementById('homePage').addEventListener('click', function () {
    window.location.href = 'index.html';
});

document.getElementById('airQualityBtn').addEventListener('click', () => {
    window.location.href = 'statistical.html';
})

document.getElementById('deviceHistoryBtn').addEventListener('click', function () {
    window.location.href = 'device.html';
});