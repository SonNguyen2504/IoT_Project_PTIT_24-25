const WebSocket = require('ws');

const setupWebSocket = (server, mqttClient) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', ws => {
        console.log('New WebSocket connection established');

        ws.on('message', message => {
            const controlMessage = JSON.parse(message);
            const { device, action } = controlMessage;

            const mqttMessage = `${device}_${action}`;
            mqttClient.publish('esp/control', mqttMessage);
            console.log(`Published control message: ${mqttMessage}`);
        });
    });

    return wss;
};

module.exports = { setupWebSocket };
