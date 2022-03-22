const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');


router.route('/')
    .get(post.index)
    .post(post.createPost)

router.route('/:id')
    .get(post.showPost)
    .put(post.editPost)
    .delete(post.deletePost)

router.get('/:id/edit', post.renderEditPost)

module.exports = router;