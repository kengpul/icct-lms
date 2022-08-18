const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat');
const catchAsync = require('../utils/catchAsync')

router.get('/', catchAsync(chat.index))

router.get('/:id', catchAsync(chat.groupChat))

module.exports = router;