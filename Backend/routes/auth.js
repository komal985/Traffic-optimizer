const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuthActivity = require('../models/AuthActivity');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const getClientIp = (req) => req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            await AuthActivity.create({
                name: name || '',
                email,
                action: 'register',
                status: 'failed',
                ipAddress: getClientIp(req)
            });
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            await AuthActivity.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                action: 'register',
                status: 'success',
                ipAddress: getClientIp(req)
            });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// @route   POST /auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            await AuthActivity.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                action: 'login',
                status: 'success',
                ipAddress: getClientIp(req)
            });
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            await AuthActivity.create({
                email,
                action: 'login',
                status: 'failed',
                ipAddress: getClientIp(req)
            });
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// @route   GET /auth/database
// @desc    Get users and auth activity records
// @access  Public (demo)
router.get('/database', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 })
            .sort({ createdAt: -1 })
            .lean();

        const activities = await AuthActivity.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        res.json({
            users,
            activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch auth database data' });
    }
});

module.exports = router;
