const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const { validatePost } = require('../middlewares');

router.route('/')
    .get(catchAsync(post.index))
    .post(validatePost, catchAsync(post.createPost))

router.route('/:id')
    .get(catchAsync(post.showPost))
    .put(validatePost, catchAsync(post.editPost))
    .delete(catchAsync(post.deletePost))

router.get('/:id/edit', catchAsync(post.renderEditPost))

module.exports = router;