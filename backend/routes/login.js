const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//TODO: Placeholder user storage. Change to proper stuff and use hashes for the stuff
const users = [
	{ UID: 1, username: 'SELLER', email: 'SELLER@unisabana.edu.co', password: 'SELLER', isSeller: true, isSuspended: false },
	{ UID: 2, username: 'USER', email: 'USER@unisabana.edu.co', password: 'USER', isSeller: false, isSuspended: false  },
	{ UID: 3, username: 'SUSPENDED', email: 'SUSPENDED@unisabana.edu.co', password: 'SUSPENDED', isSeller: false, isSuspended: true  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.post('/', (req, res) => {
	const { userOrEmail, password } = req.body || {};
	if (!userOrEmail || !password) return res.status(400).json({ error: 'Invalid credentials' });

	//TODO: Check by using hash
	const user = users.find(u => u.username === userOrEmail && u.password === password);
	if (!user) return res.status(400).json({ error: 'Invalid credentials' });

	if(user.isSuspended) return res.status(403).json({ error: 'User is suspended' });

	const payload = { sub: user.UID, isSeller: user.isSeller };
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

	res.json({ token });
});

module.exports = router;