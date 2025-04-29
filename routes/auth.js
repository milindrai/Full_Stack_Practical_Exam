const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register route
router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, age, phoneNumber, gender, isLegal } = req.body;
        let errors = [];

        // Validation
        if (!username || !password || !age || !phoneNumber || !gender) {
            errors.push({ msg: 'Please fill in all fields' });
        }

        if (age < 1) {
            errors.push({ msg: 'Please enter a valid age' });
        }

        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            errors.push({ msg: 'Please enter a valid 10-digit phone number' });
        }

        if (!isLegal) {
            errors.push({ msg: 'You must confirm legal eligibility' });
        }

        if (errors.length > 0) {
            return res.render('auth/register', {
                errors,
                username,
                age,
                phoneNumber,
                gender
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            errors.push({ msg: 'Username is already registered' });
            return res.render('auth/register', {
                errors,
                username,
                age,
                phoneNumber,
                gender
            });
        }

        // Create new user
        const newUser = new User({
            username,
            password,
            age,
            phoneNumber,
            gender,
            isLegal: isLegal === 'on'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // Save user
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error registering user');
        res.redirect('/register');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/vehicles',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

module.exports = router; 