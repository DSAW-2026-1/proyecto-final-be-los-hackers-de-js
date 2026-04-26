const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
router.post('/', (req, res) => {
    const errorMsg = "User, email or password is missing/malformed"
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ error: errorMsg });

    //TODO: Check that our new user doesn't use the same username or email as someone else (when an actual user db exists)

    //TODO: Save this new user to some form of db
    const user = {
        UID: 1, //TODO: Generate this UID randomly
        username: username,
        email: email,
        password: password, //TODO: Hash this thing
        isSeller: false,
        isSuspended: false
    }

    console.log(user)

    const payload = { UID: user.UID, isSeller: user.isSeller };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

module.exports = router;