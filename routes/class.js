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

router.get('/:id/members', isLoggedIn, isClassMember, classes.showMembers)

router.post('/:id/pin', isLoggedIn, isTeacher, classes.pin)

router.post('/:id/unpin', isLoggedIn, isTeacher, classes.unPin)

router.post('/:classId/accept/:studentId', isLoggedIn, isTeacher, classes.acceptStudent)

router.post('/:classId/leave/:studentId', isLoggedIn, classes.leaveStudent)

router.post('/:classId/reject/:studentId', isLoggedIn, classes.rejectStudent)

module.exports = router;
