const express = require('express');
const router = express.Router();
const classes = require('../controllers/class');
const { isLoggedIn } = require('../middlewares');

router.route('/',)
    .post(isLoggedIn, classes.createClass)
    .get(isLoggedIn, classes.index)

router.get('/new', isLoggedIn, classes.createRenderForm)

router.route('/:id')
    .get(classes.showClass)


module.exports = router;