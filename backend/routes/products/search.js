const express = require('express');
const router = express.Router();
const db = require("../../dbManager");

router.get('/', async function (req, res, next) {
    const {
        page, query, categories, fromPrice, toPrice, conditions, searchDescription, minRating
    } = req.query
    const fullQuery = {}
    //if(!query && !categories && !fromPrice && !toPrice && !conditions && !minRating) return res.status("400")
    const minRatingVal = parseInt(minRating) || NaN
    if(categories) fullQuery["category"] = { $in: categories.split(',') }
    if(conditions) fullQuery["condition"] = { $in: conditions.split(',') }
    if(fromPrice || toPrice) {
        let fromPriceVal = parseInt(fromPrice) || NaN
        let toPriceVal = parseInt(toPrice) || NaN
        fullQuery["price"] = {}
        if(!isNaN(fromPriceVal)) fullQuery.price["$gte"] = fromPriceVal
        if(!isNaN(toPriceVal)) fullQuery.price["$lte"] = toPriceVal
    }
    if(!isNaN(minRatingVal)){
        fullQuery["rating"] = {$gte: minRatingVal}
    }
    if(query){
        //TODO: Sanitize this
        if(searchDescription){
            fullQuery["$or"] = [
                {name: {$regex: query}},
                {description: {$regex: query}}
            ]
        }
        else fullQuery["name"] = {$regex: query}
    }
    fullQuery["stock"] = {$gt: 0}
    const products = await db.findProducts(fullQuery)
    if (!products || products.length === 0) return res.status(404).json({error: 'No results found. Try broader search terms.'})
    else {
        let returnProducts = []
        for (let i = 0; i < products.length; i++) {
            returnProducts.push({
                productID: products[i]._id,
                name: products[i].name,
                //category: products[i].category,
                //condition: products[i].condition,
                price: products[i].price,
                //description: products[i].description,
                image: products[i].images["0"],
                //stock: products[i].stock,
                //sellerID: products[i].sellerID,
                //rating: products[i].rating || null,

            })
        }
        return res.json({
            results: Object.assign({}, returnProducts)
        })
    }
});

module.exports = router;
