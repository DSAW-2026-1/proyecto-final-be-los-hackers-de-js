const express = require('express');
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const userrAuthMiddleware = require("../../middleware/auth/userValidator");
const router = express.Router();
const findUser = require("./find")
const getSelf = require("./getSelf")
const editSelf = require("./edit")

router.use('/', findUser)
router.use('/', tokenValidatorMiddleware)
router.use('/', userrAuthMiddleware)
router.use('/', getSelf)
router.use('/', editSelf)

module.exports = router;