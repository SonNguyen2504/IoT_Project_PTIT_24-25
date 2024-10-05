const express = require('express');
const router = express.Router();

const { getDeviceStatus, getAllDeviceStatus } = require('../controllers/DeviceStatusController');

router.route('/device-status').get(getDeviceStatus);
router.route('/all-device-status').get(getAllDeviceStatus);

module.exports = router;