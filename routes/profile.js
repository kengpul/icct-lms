const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile');
const { validateProfile } = require('../middlewares');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(profile.index)
    .post(upload.single('profile-picture'), validateProfile, profile.edit)


router.get('/edit', profile.renderEditForm);

router.get('/:id', catchAsync(profile.show));

module.exports = router;