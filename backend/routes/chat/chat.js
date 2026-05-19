const express = require('express');
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const userAuthMiddleware = require("../../middleware/auth/userValidator");
const router = express.Router();
const getMessages = require("./getMsg")

router.use(tokenValidatorMiddleware)
router.use(userAuthMiddleware)
router.use('/', getMessages)

module.exports = router;