const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require("../../dbManager")

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
router.post('/', async (req, res) => {
	const {userOrEmail, password} = req.body || {};
	if (!userOrEmail || !password) return res.status(400).json({error: 'Invalid credentials'});

	const user = await db.findUser({username: userOrEmail})

	if (!user) return res.status(400).json({error: 'Invalid credentials'})

	//TODO: Check by using hash
	if (!user.password === password) return res.status(400).json({error: 'Invalid credentials'})

	if (user.isSuspended) return res.status(403).json({error: 'User is suspended'});

	const payload = {UID: user.UID, isSeller: user.isSeller};
	const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

	res.json({token});
});

module.exports = router;