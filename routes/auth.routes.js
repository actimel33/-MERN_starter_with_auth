const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');
const messages = require('../messages');

const router = Router();

// url = /auth/register
router.post(
    '/register',
    [
        check('email', messages.INVALID_EMAIL).normalizeEmail().isEmail(),
        check('password', messages.INVALID_PASSWORD).isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            console.log(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: messages.INVALID_LOGIN_OR_PASSWORD
                });
            }
            const {email, password} = req.body;
            const candidate = await User.findOne({email});

            if (candidate) {
                return res.status(400).json({message: messages.USER_EXIST});
            }

            const hashedPassword = await bCrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword});

            await user.save();

            res.status(201).json({message: messages.USER_SAVED});

        } catch (e) {
            res.status(500).json({message: messages.SERVER_ERROR});
        }
    });

// url = /auth/login
router.post(
    '/login', [
        check('email', messages.INVALID_EMAIL).normalizeEmail().isEmail(),
        check('password', messages.INVALID_PASSWORD).isLength({min: 6}),
        check('password', messages.ENTER_PASSWORD).exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: messages.INVALID_LOGIN_OR_PASSWORD
                });
            }

            const {email, password} = req.body;
            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({message: messages.USER_NOT_EXIST});
            }

            const isMatch = await bCrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({message: messages.INVALID_LOGIN_OR_PASSWORD});
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'});

            res.status(200).json({token, userId: user.id, message: messages.LOGGED_IN})

        } catch (e) {
            res.status(500).json({message: messages.SERVER_ERROR});
        }
    });

module.exports = router;