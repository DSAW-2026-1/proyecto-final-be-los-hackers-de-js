const express = require('express')
const router = express.Router()
const db = require('../../dbManager')

// DELETE /api/admin/products/:productID
router.delete('/:productID', async function (req, res) {
    const { productID } = req.params
    if(!productID) return res.status(400).json({ error: 'Product not found' })

    try {
        const product = await db.findProductRawByID(productID)
        if(!product) return res.status(400).json({ error: 'Product not found' })
        if(product.deleted) return res.status(409).json({ error: 'Product is already deleted' })

        await db.softDeleteProduct(productID)
        return res.status(200).json({ message: 'Product deleted successfully' })
    }
    catch (e) {
        console.error('Error deleting product by admin:', e)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
