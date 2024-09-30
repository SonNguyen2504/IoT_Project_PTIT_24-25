const express = require('express');
const router = express.Router();

const { getDeviceStatus } = require('../controllers/DeviceStatusController');

router.route('/device-status').get(getDeviceStatus);

module.exports = router;