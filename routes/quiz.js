const express = require('express');
const router = express.Router();
const quiz = require('../controllers/quiz');
const {isTeacher, isLoggedIn} = require('../middlewares');
const catchAsync = require('../utils/catchAsync');

router.get('/', isLoggedIn, catchAsync(quiz.index))

router.route('/')
    .get(isLoggedIn, catchAsync(quiz.index))
    .post(isLoggedIn, isTeacher, catchAsync(quiz.create))

router.route('/take/:groupId/:quizId')
    .get(isLoggedIn, catchAsync(quiz.takeQuiz))
    .post(isLoggedIn, catchAsync(quiz.submitQuiz))


router.get('/create', isLoggedIn, isTeacher, catchAsync(quiz.renderCreate))

router.put('/edit/:id', isLoggedIn, isTeacher, catchAsync(quiz.edit))

router.get('/open/:id', isLoggedIn, isTeacher, catchAsync(quiz.renderEdit))

router.post('/open/:id/assign',isLoggedIn, isTeacher, catchAsync(quiz.assign))

router.post('/open/:id/unassign', isLoggedIn, isTeacher, catchAsync(quiz.unassign))


module.exports = router;