const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const { validatePost, isLoggedIn, isAuthor } = require('../middlewares');

router.route('/')
    .get(isLoggedIn, catchAsync(post.index))
    .post(isLoggedIn, validatePost, catchAsync(post.createPost))

router.route('/:id')
    .get(isLoggedIn, catchAsync(post.showPost))
    .put(isLoggedIn, isAuthor, catchAsync(post.editPost))
    .delete(isLoggedIn, isAuthor, catchAsync(post.deletePost))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(post.renderEditPost))

module.exports = router;