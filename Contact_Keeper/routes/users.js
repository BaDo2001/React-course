const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

// @route   POST    api/users
// @desc    Register a user
// @access  Public 
router.post('/', [
        check('name', 'Please add name').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if(user) {
                return res.status(400).json({ msg: 'User already exists'});
            }
            user = new User({
                name,
                email,
                password
            });

            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);
            await user.save();

            res.send("User saved");

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;