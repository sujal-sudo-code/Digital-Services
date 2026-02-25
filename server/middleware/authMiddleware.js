const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

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
