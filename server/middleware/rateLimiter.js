/**
 * Rate Limiting Middleware
 * -------------------------------------------------
 * OWASP: Protects against brute-force, credential-stuffing,
 * and denial-of-service attacks by capping request rates.
 *
 * Three tiers:
 *   1. globalLimiter  — blanket limit on every route
 *   2. authLimiter    — strict limit on login attempts
 *   3. submissionLimiter — limit on public form submissions
 *
 * All limiters return a JSON 429 response with Retry-After header.
 * -------------------------------------------------
 */

const rateLimit = require('express-rate-limit');

// --- Helper: standard 429 JSON response ---
function rateLimitHandler(_req, res) {
    // Retry-After header is set automatically by express-rate-limit
    res.status(429).json({
        error: 'Too many requests. Please try again later.',
    });
}

/**
 * Global rate limiter — applied to ALL routes.
 * 100 requests per 15-minute window per IP.
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,     // Return rate-limit info in RateLimit-* headers
    legacyHeaders: false,      // Disable X-RateLimit-* headers
    handler: rateLimitHandler,
    message: { error: 'Too many requests. Please try again later.' },
});

/**
 * Auth rate limiter — strict limit for /api/auth/login.
 * 5 attempts per 15-minute window per IP.
 * Prevents brute-force and credential-stuffing attacks.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    message: { error: 'Too many login attempts. Please try again later.' },
    // Skip successful requests so legitimate users aren't penalised
    skipSuccessfulRequests: false,
});

/**
 * Submission rate limiter — limits public form submissions.
 * 10 submissions per 15-minute window per IP.
 * Prevents spam / automated form abuse.
 */
const submissionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    message: { error: 'Too many submissions. Please try again later.' },
});

module.exports = { globalLimiter, authLimiter, submissionLimiter };
