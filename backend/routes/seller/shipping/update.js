const express = require('express');
const router = express.Router();
const db = require("../../../dbManager");

const ALLOWED_STATUSES = ["Pending", "Confirmed", "In transit", "Delivered", "Cancelled"]

router.patch('/:saleID', async function (req, res, next) {
    const UID = req.token.payload.UID
    const { saleID } = req.params
    const { status } = req.body || {}

    if (!status) return res.status(400).json({error: 'Missing status in request body'})
    if (!ALLOWED_STATUSES.includes(status)) return res.status(400).json({error: 'Invalid shipping status'})

    const sale = await db.findOrderByID(saleID)
    if(!sale) return res.status(404).json({error: 'No sale matching this saleID found'})

    // Compare IDs as strings to avoid ObjectId mismatches
    if(String(sale.sellerID) !== String(UID)) return res.status(403).json({error: 'You are not allowed to do this'})

    const success = await db.updateOrder(saleID, {status: status})
    if(!success) return res.status(500).json({error: 'Failed to update sale status'})

    return res.json({message: 'Updated successfully'})
})

module.exports = router;
