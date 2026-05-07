const express = require('express')
const router = express.Router()
const db = require('../../dbManager')

// PATCH /api/admin/users/:UID/suspend
router.patch('/:UID/suspend', async function (req, res) {
    const { UID } = req.params
    const { reason } = req.body || {}

    if (!UID) return res.status(400).json({ error: 'UID not found' })
    const user = await db.findUserByUID(UID)
    if (!user) return res.status(400).json({ error: 'UID not found' })
    if (user.isSuspended) return res.status(409).json({ error: 'User is already suspended' })
    const suspended = await db.suspendUser(UID, reason)
    if(suspended) return res.json({ message: 'User suspended successfully' })
    else{
        console.error('Error suspending user '+UID)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
