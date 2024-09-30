const mongoose = require('mongoose');

const deviceStatusSchema = new mongoose.Schema({
    device: String,
    status: String,
    time: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setMilliseconds(0); // Bỏ qua phần millisecond
            return now;
        },
    }
});

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);

module.exports = DeviceStatus;