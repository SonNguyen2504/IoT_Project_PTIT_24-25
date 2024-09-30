const AirQuality = require('../models/AirQuality');

const getAirQuality = async (req, res) => {
    const { page = 1, limit = 10, searchValue, searchType } = req.query;
    
    let query = {};
    if (searchValue && searchType) {
        query[searchType] = searchValue;
    }

    try {
        const airQualityData = await AirQuality.find(query)
            .sort({ time: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await AirQuality.countDocuments(query);

        res.json({
            airQualityData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAirQuality };
