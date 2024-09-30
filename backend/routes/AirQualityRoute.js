const express = require('express');
const router = express.Router();

const { getAirQuality } = require('../controllers/AirQualityController');

router.route('/air-quality')
    .get(getAirQuality);

module.exports = router;