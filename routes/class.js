const express = require('express');
const router = express.Router();
const classes = require('../controllers/class');
const { isLoggedIn, isMember } = require('../middlewares');
const catchAsync = require('../utils/catchAsync')

router.route('/',)
    .post(isLoggedIn, catchAsync(classes.createClass))
    .get(isLoggedIn, classes.index)

router.get('/new', isLoggedIn, classes.createRenderForm)

router.post('/join', catchAsync(classes.joinClass));

router.get('/:id', isLoggedIn, isMember, catchAsync(classes.showClass))


router.post('/:classId/accept/:studentId', classes.acceptStudent)

// router.post('/:id/join', isLoggedIn, catchAsync(classes.joinClass))


module.exports = router;