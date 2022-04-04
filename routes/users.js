const express = require('express');
const router = express.Router();
const user = require('../controllers/users');
const passport = require('passport')

router.get('/connect', user.connect)
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/connect' }), user.login)
router.post('/register', user.register)
router.get('/logout', user.logout)

module.exports = router;