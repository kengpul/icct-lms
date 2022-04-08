const express = require('express');
const router = express.Router();

const calendar = require('../controllers/calendar');

router.get('/', calendar.index)

module.exports = router;