const DeviceStatus = require('../models/DeviceStatus');

const getDeviceStatus = async (req, res) => {
    const { page = 1, limit = 10, searchTime } = req.query;

    let query = {};
    if (searchTime) {
        query.time = { $eq: new Date(searchTime)};
    }
    
    try {
        const deviceStatusData = await DeviceStatus.find(query)
            .sort({ time: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await DeviceStatus.countDocuments(query);

        res.json({
            deviceStatusData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getDeviceStatus };