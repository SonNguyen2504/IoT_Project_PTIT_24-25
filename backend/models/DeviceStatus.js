const mongoose = require('mongoose');
const AutoIncreament = require('mongoose-sequence')(mongoose);

const deviceStatusSchema = new mongoose.Schema({
    device: String,
    status: String,
    time: {
        type: Date,
        default: Date.now
    }
});

deviceStatusSchema.plugin(AutoIncreament, {inc_field: 'deviceId'});

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);

module.exports = DeviceStatus;