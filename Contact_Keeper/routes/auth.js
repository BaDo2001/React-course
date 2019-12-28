const express = require('express');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const User = require('../models/User');

const router = express.Router();

// @route   GET    api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST    api/auth
// @desc    Auth user & get token
// @access  Public
    router.post('/', [
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, password} = req.body;
        
        try {
            let user = await User.findOne({ email });
            if(!user) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }
            const isMatch = await bcryptjs.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 3600000, //should be 3600
            }, (err, token) => {
                if(err) throw err;
                res.json({ token });
            });

        } catch (error) {
            consle.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;