// config biểu đồ
// data
const chartData = {
    labels: [], // Danh sách các nhãn thời gian
    datasets: [
        {
            label: 'Cường độ sáng (lux)',
            data: [], // Dữ liệu cường độ sáng
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
            tension: 0.1,
            yAxisID: 'luxScale'
        },
        {
            label: 'Độ ẩm (%)',
            data: [], // Dữ liệu độ ẩm
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
            tension: 0.1,
            yAxisID: 'humidityScale'
        },
        {
            label: 'Nhiệt độ (°C)',
            data: [], // Dữ liệu nhiệt độ
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
            tension: 0.1,
            yAxisID: 'temperatureScale'
        }
    ]
};

// config
const config = {
    type: 'line',
    data: chartData,
    options: {
        reponsive: true,
        maintainAspectRatio: false, 
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian'
                }
            },
            luxScale: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Cường độ sáng (lux)'
                },
                min: 0,
                max: 1000
            },
            humidityScale: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Độ ẩm (%)'
                },
                min: 0,
                max: 100
            },
            temperatureScale: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Nhiệt độ (°C)'
                },
                min: 0,
                max: 50
            }
        }
    }
}


// Biểu đồ cảm biến
const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, config);

// Hàm cập nhật biểu tượng theo khoảng đo
function updateIcons(temperature, humidity, lightIntensity) {
    const tempIcon = document.getElementById('temperatureIcon');
    const humidityIcon = document.getElementById('humidityIcon');
    const lightIcon = document.getElementById('lightIcon');

    // Thay đổi biểu tượng nhiệt độ
    if (temperature < 15) {
        tempIcon.src = './assets/images/low_temp.png';
    } else if (temperature < 30) {
        tempIcon.src = './assets/images/normal_temp.png';
    } else {
        tempIcon.src = './assets/images/high_temp.png';
    }

    // Thay đổi biểu tượng độ ẩm
    if (humidity < 30) {
        humidityIcon.src = './assets/images/low_humidity.png';
    } else if (humidity < 60) {
        humidityIcon.src = './assets/images/normal_humidity.png';
    } else {
        humidityIcon.src = './assets/images/high_humidity.png';
    }

    // Thay đổi biểu tượng cường độ sáng
    if (lightIntensity < 300) {
        lightIcon.src = './assets/images/low_lux.png';
    } else if (lightIntensity < 700) {
        lightIcon.src = './assets/images/normal_lux.png';
    } else {
        lightIcon.src = './assets/images/high_lux.png';
    }
}

// Hàm cập nhật dữ liệu mới mỗi 3 giây
function updateChartData() {
    const currentTime = new Date().toLocaleTimeString();

    // Giả lập dữ liệu mới
    const newTemperature = Math.random() * 40; 
    const newHumidity = Math.random() * 100; 
    const newLightIntensity = Math.random() * 1000; 

    // Cập nhật chỉ số hiện tại
    document.getElementById('currentLightIntensity').textContent = `${newLightIntensity.toFixed(2)} lux`;
    document.getElementById('currentHumidity').textContent = `${newHumidity.toFixed(2)}%`;
    document.getElementById('currentTemperature').textContent = `${newTemperature.toFixed(2)}°C`;

    // Thêm dữ liệu mới vào biểu đồ
    sensorChart.data.labels.push(currentTime);
    sensorChart.data.datasets[0].data.push(newLightIntensity);
    sensorChart.data.datasets[1].data.push(newHumidity);
    sensorChart.data.datasets[2].data.push(newTemperature);

    // Giữ cho biểu đồ chỉ hiển thị 10 điểm dữ liệu gần nhất
    if (sensorChart.data.labels.length > 10) {
        sensorChart.data.labels.shift();
        sensorChart.data.datasets.forEach(dataset => dataset.data.shift());
    }
    // Cập nhật biểu đồ
    sensorChart.update();
    
    // Thay đổi biểu tượng dựa trên giá trị
    updateIcons(newTemperature, newHumidity, newLightIntensity);
}

// Cập nhật dữ liệu mỗi 3 giây
setInterval(updateChartData, 3000);

// Xử lý sự kiện bật/tắt thiết bị
function toggleDevice(button) {
    const isOn = button.classList.toggle('off');
    button.textContent = isOn ? 'Tắt' : 'Bật';
}

// cập nhật icon
function toggleDevice(button, iconId, onImageSrc, offImageSrc) {
    const isOn = button.classList.toggle('off');
    button.textContent = isOn ? 'Tắt' : 'Bật';

    const icon = document.getElementById(iconId);
    if (isOn) {
        icon.src = onImageSrc;
    } else {
        icon.src = offImageSrc;
    }
}

// Gán sự kiện cho các nút thiết bị
document.getElementById('fanButton').addEventListener('click', function () {
    toggleDevice(this, 'fanIcon', './assets/images/fan-on.gif', './assets/images/fan-off.png');
});

document.getElementById('ledButton').addEventListener('click', function () {
    toggleDevice(this, 'ledIcon', './assets/images/bulb-on.gif', './assets/images/bulb-off.png');
});

document.getElementById('acButton').addEventListener('click', function () {
    toggleDevice(this, 'acIcon', './assets/images/ac-on.gif', './assets/images/ac-off.png');
});

// Sự kiện cho các nút navbar
document.getElementById('airQualityBtn').addEventListener('click', function() {
    window.location.href = 'statistical.html'; 
});

document.getElementById('deviceHistoryBtn').addEventListener('click', function() {
    window.location.href = 'device.html'; 
});

document.getElementById('information').addEventListener('click', () => {
    window.location.href = 'info.html';
})

