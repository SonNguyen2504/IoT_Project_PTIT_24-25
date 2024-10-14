const mqtt = require('mqtt');
const AirQuality = require('../models/AirQuality');
const DeviceStatus = require('../models/DeviceStatus');

const mqttClient = mqtt.connect('mqtt://192.168.3.193:1882', {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
});

const connectMQTT = (wss) => {
    mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        mqttClient.subscribe('esp/dht/data');
        mqttClient.subscribe('esp/device/status');
        mqttClient.subscribe('esp/alert');
    });

    mqttClient.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());

        if (topic === 'esp/dht/data') {
            console.log('Received air quality data:', data);

            const airQuality = new AirQuality({
                humidity: data.humidity,
                temperature: data.temperature,
                lightIntensity: data.lightIntensity
            });

            // airQuality.save()
            //     .then(() => console.log('Saved air quality data to MongoDB'))
            //     .catch(err => console.error('Failed to save air quality data:', err));

            // Phát qua WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(data));
                }
            });
        } else if (topic === 'esp/device/status') {
            console.log('Received device status:', data);

            const deviceStatus = new DeviceStatus({
                device: data.device,
                status: data.status
            });

            // deviceStatus.save()
            //     .then(() => console.log('Saved device status to MongoDB')) 
            //     .catch(err => console.error('Failed to save device status:', err));

            // Phát qua WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(deviceStatus));
                }
            });
        } else if (topic === 'esp/alert') {
            console.log('Received alert:', data);

            // Phát qua WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    // console.log('Sending alert to client:', data);
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
};

module.exports = { mqttClient, connectMQTT };
