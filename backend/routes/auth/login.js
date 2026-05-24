const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require("../../dbManager")
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
router.post('/', [
    body('userOrEmail').isString().notEmpty(),
    body('password').isString().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const {userOrEmail, password} = req.body;

	//This way of checking for both usernames and emails is kinda jank but should work just fine so it doesn't matter
	const user = await db.findUser({$or: [{username: userOrEmail}, {email: userOrEmail}]})

	if (!user) return res.status(400).json({error: 'Invalid credentials'})

	bcrypt.compare(password, user.password, function(err, result) {
		if(result === true){
			if (user.isSuspended) return res.status(403).json({error: 'User is suspended'});

			const payload = {UID: user._id, isSeller: user.isSeller};
			const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

			res.json({token});
		}
		else return res.status(400).json({error: 'Invalid credentials'})
	});
});

module.exports = router;