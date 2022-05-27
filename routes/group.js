const express = require('express');
const router = express.Router();
const group = require('../controllers/group');
const { isLoggedIn, isGroupMember, isTeacher } = require('../middlewares');
const catchAsync = require('../utils/catchAsync')

router.route('/',)
    .post(isLoggedIn, isTeacher, catchAsync(group.createGroup))
    .get(isLoggedIn, group.index)

router.post('/join', isLoggedIn, catchAsync(group.joinGroup))

router.get('/:id', isLoggedIn, isGroupMember, catchAsync(group.showGroup))

router.get('/:id/members', isLoggedIn, isGroupMember, group.showMembers)

router.post('/:id/pin', isLoggedIn, isTeacher, group.pin)

router.post('/:id/unpin', isLoggedIn, isTeacher, group.unPin)

router.route('/:id/link')
    .get(isLoggedIn, isTeacher, group.renderEditLinks)
    .post(isLoggedIn, isTeacher, catchAsync(group.editLinks))

router.post('/:groupId/accept/:studentId', isLoggedIn, isTeacher, group.acceptStudent)

router.post('/:groupId/leave/:studentId', isLoggedIn, group.leaveStudent)

router.post('/:groupId/reject/:studentId', isLoggedIn, group.rejectStudent)

module.exports = router;
