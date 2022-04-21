const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile');
const { validateProfile } = require('../middlewares');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(profile.index)
    .post(upload.single('profile-picture'), validateProfile, profile.edit)


router.get('/edit', profile.renderEditForm);

module.exports = router;