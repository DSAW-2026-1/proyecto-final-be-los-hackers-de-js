const express = require('express');
const router = express.Router();
const db = require("../../dbManager");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const saltRounds = 10;
const MIN_PASSWORD_LENGTH = process.env.MIN_PASSWORD_LENGTH || 1

router.post('/change-password', [
    body('currentPassword').notEmpty(),
    body('newPassword').notEmpty().isLength({ min: MIN_PASSWORD_LENGTH })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const UID = req.token.payload.UID;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await db.findUserByUID(UID);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const success = await db.updateUser(UID, { password: hashedPassword });

        if (success) return res.json({ message: 'Password updated successfully' });
        else return res.status(500).json({ error: 'Failed to update password' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
