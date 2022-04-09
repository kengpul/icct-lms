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

router.post('/:groupId/accept/:studentId', isLoggedIn, isTeacher, group.acceptStudent)

router.post('/:groupId/leave/:studentId', isLoggedIn, group.leaveStudent)

module.exports = router;