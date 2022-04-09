const express = require('express');
const router = express.Router();
const classes = require('../controllers/class');
const { isLoggedIn, isClassMember, isTeacher } = require('../middlewares');
const catchAsync = require('../utils/catchAsync')

router.route('/',)
    .post(isLoggedIn, isTeacher, catchAsync(classes.createClass))
    .get(isLoggedIn, classes.index)

router.post('/join', isLoggedIn, catchAsync(classes.joinClass))

router.get('/:id', isLoggedIn, isClassMember, catchAsync(classes.showClass))

router.post('/:classId/accept/:studentId', isLoggedIn, isTeacher, classes.acceptStudent)

router.post('/:classId/leave/:studentId', isLoggedIn, classes.leaveStudent)

module.exports = router;