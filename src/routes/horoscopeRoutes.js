const express = require('express');
const router = express.Router();

const { getTodayHoroscope, getHoroscopeHistory } = require('../controllers/horoscopeController');

router.get('/today', getTodayHoroscope);
router.get('/history', getHoroscopeHistory);

module.exports = router;