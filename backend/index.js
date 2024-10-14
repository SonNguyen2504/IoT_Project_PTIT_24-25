const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();

const { setupWebSocket } = require('./config/websocket');
const { mqttClient, connectMQTT } = require('./config/mqtt');

// Tạo Express app
const app = express();

// Sử dụng middleware
app.use(cors()); 
app.use(express.json());
routes(app);

// Tạo HTTP server và WebSocket server
const server = http.createServer(app);

// Kết nối MongoDB (MongoDB URI từ Atlas)
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Thiết lập WebSocket server
const wss = setupWebSocket(server, mqttClient);

// Kết nối tới MQTT và lắng nghe tin nhắn
connectMQTT(wss);

// Chạy server tại cổng 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});