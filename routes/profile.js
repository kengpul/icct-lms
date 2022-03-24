const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile');

router.get('/edit', profile.renderEditForm)

module.exports = router;