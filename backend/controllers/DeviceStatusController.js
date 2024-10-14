const DeviceStatus = require('../models/DeviceStatus');

const getAllDeviceStatus = async (req, res) => {
    try {
        const deviceStatusData = await DeviceStatus.find();
        const totalDocuments = await DeviceStatus.countDocuments();
        res.json({
            deviceStatusData, 
            totalDocuments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDeviceStatus = async (req, res) => {
    const { page = 1, limit = 10, searchTime } = req.query;

    let query = {};
    if (searchTime) {
        const start = new Date(searchTime);
            const end = new Date(searchTime);
            start.setMilliseconds(0);
            start.setSeconds(0);
            end.setMilliseconds(999);
            end.setSeconds(59);

            query.time = {
                $gte: start,
                $lt: end
            };
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
            totalDocuments: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getDeviceStatus, getAllDeviceStatus };