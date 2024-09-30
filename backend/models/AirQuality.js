const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
    humidity: Number,
    temperature: Number,
    lightIntensity: Number,
    time: {
        type: Date,
        default: Date.now
    }
});

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

module.exports = AirQuality;
