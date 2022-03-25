const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile');
const { validateProfile } = require('../middlewares');

router.route('/')
    .get(profile.index)
    .post(validateProfile, profile.edit)

router.get('/edit', profile.renderEditForm);

module.exports = router;