const AirQuality = require('../models/AirQuality');

const getAllAirQuality = async (req, res) => {
    try {
        const airQualityData = await AirQuality.find();
        const totalDocuments = await AirQuality.countDocuments();
        res.json({
            airQualityData,
            totalDocuments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAirQuality = async (req, res) => {
    const { page = 1, limit = 10, searchValue, searchType, sortField, sortOrder } = req.query;

    let query = {};
    if (searchValue && searchType) {
        // Kiểm tra nếu tìm kiếm theo thời gian
        if (searchType === 'time') {
            const start = new Date(searchValue);
            const end = new Date(searchValue);
            start.setMilliseconds(0);
            start.setSeconds(0);
            end.setMilliseconds(999);
            end.setSeconds(59);

            query.time = {
                $gte: start,
                $lt: end
            };
        } else {
            query[searchType] = searchValue;
        }
    }

    // Xác định thứ tự sắp xếp
    const sortOptions = {};
    if (sortField) {
        sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1; // -1 cho giảm dần, 1 cho tăng dần
    } else {
        sortOptions.time = -1; // Sắp xếp theo thời gian mặc định
    }

    try {
        const airQualityData = await AirQuality.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await AirQuality.countDocuments(query);

        res.json({
            airQualityData,
            totalDocuments: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAirQuality, getAllAirQuality };
