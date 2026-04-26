const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../../dbManager")

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;
router.post('/', async (req, res) => {
    const errorMsg = "User, email or password is missing/malformed"
    const {username, email, password} = req.body || {};
    if (!username || !email || !password) return res.status(400).json({error: errorMsg});

    //Check that our new user doesn't use the same username or email as someone else
    const existingUser = await db.findUser({$or: [{username: username}, {email: email}]})
    if (existingUser) return res.status(409).json({error: 'User or email already exists'})

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    //TODO: Save this new user to some form of db
    const user = {
        UID: 1, //TODO: Generate this UID randomly
        username: username,
        email: email,
        password: hashedPassword,
        isSeller: false,
        isSuspended: false
    }

    console.log(user)

    const payload = {UID: user.UID, isSeller: user.isSeller};
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

    res.json({token});
});

module.exports = router;