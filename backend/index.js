const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();


// Tạo Express app
const app = express();

// Sử dụng middleware
app.use(cors()); 
app.use(express.json());
routes(app);

// Tạo HTTP server và WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// require model
const AirQuality = require('./models/AirQuality');
const DeviceStatus = require('./models/DeviceStatus');

// Kết nối MongoDB (MongoDB URI từ Atlas)
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Kết nối tới MQTT broker
const mqttClient = mqtt.connect('mqtt://192.168.1.7:1882', {
    username: "nguyentruongson",
    password: "b21dccn109"
});

// Khi kết nối thành công với MQTT broker
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('esp/dht/data');  // Lắng nghe topic "esp/dht/data"
    mqttClient.subscribe('esp/device/status');  // Lắng nghe các topic điều khiển thiết bị
});

// Khi nhận được tin nhắn từ MQTT broker
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());  // Parse dữ liệu từ ESP8266
    
    if (topic === 'esp/dht/data') {
        console.log('Received air quality data:', data);

        // Lưu dữ liệu chất lượng không khí vào MongoDB
        const airQuality = new AirQuality({
            humidity: data.humidity,
            temperature: data.temperature,
            lightIntensity: data.lightIntensity
        });
        airQuality.save()
            .then(() => console.log('Saved air quality data to MongoDB'))
            .catch(err => console.error('Failed to save air quality data:', err));

        // Phát tin nhắn qua WebSocket tới các client
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    } else if (topic === 'esp/device/status') {
        const data = JSON.parse(message.toString());
        console.log('Received device status:', data);

        // Lưu dữ liệu lịch sử thiết bị vào MongoDB
        const deviceStatus = new DeviceStatus({
            device: data.device,
            status: data.status
        });
        deviceStatus.save()
            .then(() => console.log('Saved device status to MongoDB')) 
            .catch(err => console.error('Failed to save device status:', err));

        // Gửi dữ liệu lịch sử qua WebSocket cho frontend
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(deviceStatus));
            }
        });
    }
});

// WebSocket connection event
wss.on('connection', ws => {
    console.log('New WebSocket connection established');
    
    // Nhận tin nhắn điều khiển từ client
    ws.on('message', message => {
        const controlMessage = JSON.parse(message);
        const { device, action } = controlMessage;

        const mqttMessage = `${device}_${action}`;
        mqttClient.publish('esp/control', mqttMessage);
        console.log(`publish control message: ${mqttMessage}`);
    });
});

// Chạy server tại cổng 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});