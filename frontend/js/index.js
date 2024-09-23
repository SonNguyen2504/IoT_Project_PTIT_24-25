// Kết nối tới WebSocket server (chạy ở backend)
const socket = new WebSocket('ws://localhost:3000');

// Khi kết nối thành công
socket.onopen = function () {
    console.log('Connected to WebSocket server');
};

// Khi nhận được tin nhắn từ server
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);  // Dữ liệu từ MQTT broker qua backend
    
    if (data.temperature && data.humidity && data.lightIntensity) {
        const currentTime = new Date().toLocaleTimeString();

        const newTemperature = data.temperature;
        const newHumidity = data.humidity;
        const newLightIntensity = data.lightIntensity;

        console.log(`Data updated: \n temperature: ${newTemperature}\n humidity: ${newHumidity}\n light intensity: ${newLightIntensity}\n time: ${currentTime}`);

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

        // Cập nhật nhiệt độ và độ ẩm lên giao diện
        document.getElementById("currentTemperature").innerText = newTemperature + "°C";
        document.getElementById("currentHumidity").innerText = newHumidity + "%";
        document.getElementById("currentLightIntensity").innerText = newLightIntensity + "lux";

        // Cập nhật biểu đồ
        sensorChart.update();

        // Thay đổi biểu tượng dựa trên giá trị
        updateIcons(newTemperature, newHumidity, newLightIntensity);
    }

    // Xử lý cập nhật trạng thái thiết bị (quạt, đèn LED, điều hòa)
    if (data.device && data.status) {
        console.log(`Received device status:\n ${data.device}\n ${data.status}\n ${data.time.toLocaleString('vi-VN')}`);
        updateDeviceStatus(data.device, data.status);
    }
};

// Khi có lỗi xảy ra
socket.onerror = function (error) {
    console.log('WebSocket Error: ' + error);
};

function isOpen(ws) { return ws.readyState === ws.OPEN }

// -----------------------------------------------------------
// Gửi lệnh bật/tắt thiết bị tới WebSocket server
function toggleDevice(device) {
    const button = document.getElementById(`${device}Button`);
    // console.log(button);
    const action = button.textContent === "Bật" ? "ON" : "OFF";

    const message = JSON.stringify({
        device: device,
        action: action
    });

    if (button.textContent === "Bật") {
        button.textContent = "Tắt";
        button.classList.add('off');
    } else {
        button.textContent = "Bật";
        button.classList.remove('off');
    }

    console.log(`Sent control message: ${message}`);

    if (!isOpen(socket)) return;
    socket.send(message);  // Gửi lệnh qua WebSocket
}

// Cập nhật trạng thái thiết bị (thay đổi icon và nút)
function updateDeviceStatus(device, status) {
    const icon = document.getElementById(`${device}Icon`);
    const button = document.getElementById(`${device}Button`);
    // console.log(button);    

    if (status === "ON") {
        icon.src = `./assets/images/${device}-on.gif`;  // Ảnh động khi thiết bị bật
    } else {
        icon.src = `./assets/images/${device}-off.png`;  // Ảnh tĩnh khi thiết bị tắt
    }
}

// Gán sự kiện cho các nút bật/tắt
document.getElementById("fanButton").addEventListener("click", function () {
    toggleDevice("fan");
});

document.getElementById("ledButton").addEventListener("click", function () {
    toggleDevice("led");
});

document.getElementById("acButton").addEventListener("click", function () {
    toggleDevice("ac");
});


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

// cập nhật icon
// function toggleDevice(button, iconId, onImageSrc, offImageSrc) {
//     const isOn = button.classList.toggle('off');
//     button.textContent = isOn ? 'Tắt' : 'Bật';

//     const icon = document.getElementById(iconId);
//     if (isOn) {
//         icon.src = onImageSrc;
//     } else {
//         icon.src = offImageSrc;
//     }
// }

// Gán sự kiện cho các nút thiết bị
// document.getElementById('fanButton').addEventListener('click', function () {
//     toggleDevice(this, 'fanIcon', './assets/images/fan-on.gif', './assets/images/fan-off.png');
// });

// document.getElementById('fanButton').addEventListener('click', function() {
//     var fanIcon = document.getElementById('fanIcon');
//     var button = this;

//     if (fanIcon.classList.contains('rotate')) {
//         fanIcon.classList.remove('rotate');
//         button.textContent = 'Bật';
//         button.classList.remove('off');
//     } else {
//         fanIcon.classList.add('rotate');
//         button.textContent = 'Tắt';
//         button.classList.add('off');
//     }
// });

// document.getElementById('ledButton').addEventListener('click', function () {
//     toggleDevice(this, 'ledIcon', './assets/images/bulb-on.gif', './assets/images/bulb-off.png');
// });

// document.getElementById('acButton').addEventListener('click', function () {
//     toggleDevice(this, 'acIcon', './assets/images/ac-on.gif', './assets/images/ac-off.png');
// });

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
})

