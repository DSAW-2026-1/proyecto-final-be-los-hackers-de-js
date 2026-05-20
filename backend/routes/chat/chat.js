const express = require('express');
//TODO: Refactor to use dbManager instead of mongoose (ideal but not planned yet)
const mongoose = require('mongoose');
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const userAuthMiddleware = require("../../middleware/auth/userValidator");
const router = express.Router();

// Use centralized models
const { Chat, Message } = require('./models');

// Now require child routes so they can access the models defined above
const getChats = require('./getChats');
const getMessages = require('./getMsg');

router.use(tokenValidatorMiddleware)
router.use(userAuthMiddleware)
router.use('/', getChats)
router.use('/', getMessages)

module.exports = router;