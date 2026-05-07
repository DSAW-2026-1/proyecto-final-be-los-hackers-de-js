const express = require('express');
const router = express.Router();
const db = require("../../../dbManager")

// GET /api/products/:id/reviews
router.get('/:id/reviews', async (req, res) => {
    const ID = req.params.id
    const product = await db.findProductByID(ID)
    if (!product) return res.status(404).json({error: 'Product not found'})

    const reviewIDs = product.reviews || []
    if (!reviewIDs || reviewIDs.length === 0) return res.status(204).json({message: 'No reviews'})

    const reviews = await db.findReviews({productID: product._id})
    if (reviews === null) return res.status(500).json({error: 'Failed to fetch reviews'})

    const result = {}
    reviews.forEach((r, i) => {
        result[i] = {
            buyerID: (r.buyerID && r.buyerID.toString) ? r.buyerID.toString() : r.buyerID,
            rating: r.rating,
            reviewTitle: r.title,
            reviewBody: r.body,
            reviewDate: (r.reviewDate && r.reviewDate.toISOString) ? r.reviewDate.toISOString() : r.reviewDate
        }
    })

    return res.status(200).json(result)
})

module.exports = router;
