const express = require('express');
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const sellerAuthMiddleware = require("../../middleware/auth/sellerValidator");
const router = express.Router();
const createProduct = require('./create')
const editProduct = require('./edit')
const findProductByID = require("./find")
const deleteProduct = require("./delete")

router.use('/', findProductByID)
router.use('/', tokenValidatorMiddleware)
router.use('/', sellerAuthMiddleware)
router.use('/', createProduct)
router.use('/', editProduct)
router.use('/', deleteProduct)

module.exports = router;