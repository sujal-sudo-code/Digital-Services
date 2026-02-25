const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: { id: admin._id, email: admin.email },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/session — verify token and return user info
router.get('/session', authMiddleware, (req, res) => {
    res.json({ user: { id: req.user.id, email: req.user.email } });
});

module.exports = router;
