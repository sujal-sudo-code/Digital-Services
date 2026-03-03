/**
 * Auth Routes
 * -------------------------------------------------
 * POST /api/auth/login  — authenticate admin user
 * GET  /api/auth/session — verify JWT and return user info
 * -------------------------------------------------
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validators');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// SECURITY: JWT_SECRET is validated at startup (see index.js).
// No fallback value — the server will not start without it.
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/login
// SECURITY: authLimiter = 5 attempts per 15 min per IP
// SECURITY: validateLogin = schema-based validation + field whitelist
router.post('/login', authLimiter, ...validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation already handled by validateLogin middleware
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
