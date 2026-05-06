const express = require('express');
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const userAuthMiddleware = require("../../middleware/auth/userValidator");
const router = express.Router();
const orders = require('./getOwn')

router.use('/', tokenValidatorMiddleware)
router.use('/', userAuthMiddleware)
router.use('/status', orders)

module.exports = router;

/*
POSSIBLE SHIPPING STATUS:
Pending
Confirmed
In transit
Delivered
Cancelled
*/