const express = require('express');
const router = express.Router();
const user = require('../controllers/users');
const passport = require('passport')

router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.route('/register')
    .get(user.renderRegisterForm)
    .post(user.register)

router.get('/logout', user.logout)

module.exports = router;