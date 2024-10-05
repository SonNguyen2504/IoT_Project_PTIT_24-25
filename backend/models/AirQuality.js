const mongoose = require('mongoose');
const AutoIncreament = require('mongoose-sequence')(mongoose);

const airQualitySchema = new mongoose.Schema({
    humidity: Number,
    temperature: Number,
    lightIntensity: Number,
    time: {
        type: Date,
        default: Date.now
    }
});

airQualitySchema.plugin(AutoIncreament, {inc_field: 'airQualityId'});

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

module.exports = AirQuality;
