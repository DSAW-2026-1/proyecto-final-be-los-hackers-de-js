const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../../dbManager")
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;
router.post('/', [body('email').isEmail()], async(req, res) => {
    const errorMsg = "User, email or password is missing/malformed"
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorMsg });
    }
    const {username, email, password} = req.body || {};

    if (!username || !email || !password) return res.status(400).json({error: errorMsg});
    if (!email.endsWith("@unisabana.edu.co")) return res.status(400).json({error: errorMsg});

    //Check that our new user doesn't use the same username or email as someone else
    const existingUser = await db.findUser({$or: [{username: username}, {email: email}]})
    if (existingUser) return res.status(409).json({error: 'User or email already exists'})

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    //TODO: These are not all the variables a user may need. Check if we actually need to create them straight away or if we can get away with this
    const user = {
        username: username,
        email: email,
        password: hashedPassword,
        isSeller: false,
        isSuspended: false
    }

    await db.addUser(user)

    const payload = {UID: user._id, isSeller: user.isSeller};
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

    res.json({token});
});

module.exports = router;