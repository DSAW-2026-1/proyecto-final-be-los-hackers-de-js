const express = require('express');
const router = express.Router();
const db = require("../../dbManager")
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const sellerAuthMiddleware = require("../../middleware/auth/sellerValidator");

router.use('/api/test', tokenValidatorMiddleware)
router.use('/api/test', sellerAuthMiddleware)
router.post('/', async(req, res) => {
    const errorMsg = "Incomplete or malformed request"
    const {name, category, condition, price, description, images, stock} = req.body || {};

    if (!name || !category || !condition || !price || !description || !images || !stock) return res.status(400).json({error: errorMsg});
    const imageArray = Object.values(images)
    if(imageArray.length < 1) return res.status(400).json({error: errorMsg});

    const priceInt = (typeof price === "string")? parseInt(price) : (typeof price === "number")? Math.round(price) : (typeof price === "bigint")? price : null
    const stockInt = (typeof stock === "string")? parseInt(stock) : (typeof stock === "number")? Math.round(stock) : (typeof stock === "bigint")? stock : null

    if(!priceInt || !stockInt) return res.status(400).json({error: errorMsg});
    if(priceInt <= 0 || stockInt < 1) return res.status(400).json({error: errorMsg});

    //TODO: Use bigInt to handle insanely large numbers. Not really necessary since MAX_SAFE_INTEGER is 9,007,199,254,740,991 but could be done theoretically.
    if(priceInt > Number.MAX_SAFE_INTEGER || stockInt > Number.MAX_SAFE_INTEGER) return res.status(400).json({error: (errorMsg + ". Reason: Price or stock higher than supported maximum.")});

    //TODO: Validate categories
    //TODO: Validate images as proper base64 encoded
    const product = {
        name,
        category,
        condition,
        price: priceInt,
        description,
        images: Object.assign({}, imageArray),
        stock: stockInt
    }
    //TODO: Save product to db
    console.log(product)
    return res.json({productID: "placeholder"})
});

module.exports = router;