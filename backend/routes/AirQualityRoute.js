const express = require('express');
const router = express.Router();

const { getAirQuality, getAllAirQuality } = require('../controllers/AirQualityController');

router.route('/air-quality')
    .get(getAirQuality);
router.route('/all-air-quality')
    .get(getAllAirQuality);

module.exports = router;