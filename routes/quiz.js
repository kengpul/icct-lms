const express = require('express');
const router = express.Router();
const quiz = require('../controllers/quiz');

router.get('/', quiz.index)

router.route('/')
    .get(quiz.index)
    .post(quiz.create)

router.get('/create', quiz.renderCreate)

module.exports = router;