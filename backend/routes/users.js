var express = require('express');
var router = express.Router();
const db = require("../dbManager");
const tokenValidatorMiddleware = require('./../middleware/auth/tokenValidator');
const userAuthMiddleware = require('./../middleware/auth/userValidator')

router.get('/:id', async function (req, res, next) {
    const UID = req.params.id
    const user = await db.findUserByUID(UID)

    if (!user) return res.status(404).json({error: 'User not found'})
    else if(user.isSuspended) return res.status(404).json({error: 'User not found'})
    else return res.json({
        username: user.username,
        isSeller: user.isSeller,
        career: user.career || null,
        photo: user.photo || null,
        reputation: user.reputation || null,
        sales: user.sales || 0
    })
});
router.use('/', tokenValidatorMiddleware);
router.use('/', userAuthMiddleware);
router.get('/', async function (req, res, next) {
    const UID = req.token.payload.UID
    const user = await db.findUserByUID(UID)

    if (!user) return res.status(404).json({error: 'User not found'})
    else if(user.isSuspended) return res.status(404).json({error: 'User not found'})
    else return res.json({
            username: user.username,
            email: user.email,
            isSeller: user.isSeller,
            career: user.career || null,
            photo: user.photo || null,
            reputation: user.reputation || null,
            sales: user.sales || 0
        })
});

module.exports = router;
