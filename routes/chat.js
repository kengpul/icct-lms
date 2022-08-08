const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat');

router.get('/', chat.index)

router.get('/:id', chat.groupChat)

module.exports = router;