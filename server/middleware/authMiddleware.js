/**
 * Auth Middleware — JWT token verification
 * -------------------------------------------------
 * SECURITY: JWT_SECRET must be set in environment variables.
 * The server refuses to start without it (see index.js).
 * No hardcoded fallback is provided.
 * -------------------------------------------------
 */

const jwt = require('jsonwebtoken');

// SECURITY: No fallback value. Server startup validates this exists.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
    }
}

module.exports = authMiddleware;
