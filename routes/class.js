const express = require('express');
const router = express.Router();
const classes = require('../controllers/class');
const { isLoggedIn, isMember } = require('../middlewares');

router.route('/',)
    .post(isLoggedIn, classes.createClass)
    .get(isLoggedIn, classes.index)

router.get('/new', isLoggedIn, classes.createRenderForm)

router.post('/:id/join', classes.joinClass)


router.route('/:id')
    .get(isMember, classes.showClass)


module.exports = router;