const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const { validatePost, isLoggedIn, isAuthor } = require('../middlewares');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(isLoggedIn, catchAsync(post.index))
    .post(isLoggedIn, upload.array('post-picture'), validatePost, catchAsync(post.createPost))

router.route('/:id')
    .get(isLoggedIn, catchAsync(post.showPost))
    .put(isLoggedIn, isAuthor, upload.array('post-picture'), catchAsync(post.editPost))
    .delete(isLoggedIn, isAuthor, catchAsync(post.deletePost))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(post.renderEditPost))

module.exports = router;