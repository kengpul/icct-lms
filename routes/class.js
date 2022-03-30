const express = require('express');
const router = express.Router();
const classes = require('../controllers/class');
const { isLoggedIn, isMember, isTeacher } = require('../middlewares');
const catchAsync = require('../utils/catchAsync')

router.route('/',)
    .post(isLoggedIn, isTeacher, catchAsync(classes.createClass))
    .get(isLoggedIn, classes.index)

router.get('/new', isLoggedIn, isTeacher, classes.createRenderForm)

router.post('/join',isLoggedIn, catchAsync(classes.joinClass))

router.get('/:id', isLoggedIn, isMember, catchAsync(classes.showClass))

router.post('/:classId/accept/:studentId',isLoggedIn, isTeacher, classes.acceptStudent)

module.exports = router;