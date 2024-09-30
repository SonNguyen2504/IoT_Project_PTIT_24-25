const AirQualityRoute = require('./AirQualityRoute');
const DeviceStatusRoute = require('./DeviceStatusRoute');

function routes(app) {
    app.use('/api', AirQualityRoute);
    app.use('/api', DeviceStatusRoute);
}

module.exports = routes;
