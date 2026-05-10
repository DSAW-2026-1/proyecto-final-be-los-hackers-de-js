const express = require('express')
const router = express.Router()
const db = require('../../dbManager')
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const adminValidatorMiddleware = require("../../middleware/auth/adminValidator");

// POST /api/admin/dashboard
router.get('/', async function (req, res) {
    try {
        const [totalUsers, activeSellers, totalProducts, totalSales] = await Promise.all([
            db.countUsers(),
            db.countActiveSellers(),
            db.countProducts(),
            db.countTotalOrders()
        ])

        return res.status(200).json({
            totalUsers,
            activeSellers,
            totalProducts,
            totalSales
        })
    }
    catch (e) {
        console.error('Error in admin dashboard:', e)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router