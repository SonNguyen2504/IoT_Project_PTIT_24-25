const mongoose = require('mongoose');

const deviceStatusSchema = new mongoose.Schema({
    device: String,
    status: String,
    time: {
        type: Date,
        default: Date.now
    }
});

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);

module.exports = DeviceStatus;