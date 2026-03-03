/**
 * Input Validation & Sanitization Middleware
 * -------------------------------------------------
 * OWASP: Validates and sanitises all user inputs using
 * schema-based rules. Rejects unexpected fields to prevent
 * mass-assignment attacks.
 *
 * Each exported array is designed to be spread into an
 * Express route definition, e.g.:
 *   router.post('/login', ...validateLogin, handler);
 * -------------------------------------------------
 */

const { body, param, validationResult } = require('express-validator');

// --- Allowed fields per endpoint (whitelist approach) ---
const ALLOWED_LOGIN_FIELDS = ['email', 'password'];
const ALLOWED_SUBMISSION_FIELDS = ['name', 'email', 'phone', 'problem', 'message'];
const ALLOWED_STATUS_FIELDS = ['status'];

/**
 * Middleware: reject any fields not in the whitelist.
 * Prevents mass-assignment / parameter pollution.
 */
function rejectUnexpectedFields(allowedFields) {
    return (req, res, next) => {
        const unexpected = Object.keys(req.body).filter(
            (key) => !allowedFields.includes(key)
        );
        if (unexpected.length > 0) {
            return res.status(400).json({
                error: `Unexpected field(s): ${unexpected.join(', ')}`,
            });
        }
        next();
    };
}

/**
 * Middleware: collect validation errors and return 400 if any.
 */
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
}

// =====================================================
// Login validation
// =====================================================
const validateLogin = [
    rejectUnexpectedFields(ALLOWED_LOGIN_FIELDS),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 254 }).withMessage('Email must be at most 254 characters')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 1, max: 128 }).withMessage('Password must be 1–128 characters'),

    handleValidationErrors,
];

// =====================================================
// Submission creation validation
// =====================================================
const validateSubmission = [
    rejectUnexpectedFields(ALLOWED_SUBMISSION_FIELDS),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be 1–100 characters')
        .escape(), // HTML-encode special chars to prevent stored XSS

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 254 }).withMessage('Email must be at most 254 characters')
        .normalizeEmail(),

    body('phone')
        .optional({ values: 'falsy' })
        .trim()
        .isString().withMessage('Phone must be a string')
        .isLength({ max: 20 }).withMessage('Phone must be at most 20 characters')
        .matches(/^[+\d\s\-()]*$/).withMessage('Phone contains invalid characters'),

    body('problem')
        .optional({ values: 'falsy' })
        .trim()
        .isString().withMessage('Subject must be a string')
        .isLength({ max: 200 }).withMessage('Subject must be at most 200 characters')
        .escape(),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isString().withMessage('Message must be a string')
        .isLength({ min: 1, max: 2000 }).withMessage('Message must be 1–2000 characters')
        .escape(),

    handleValidationErrors,
];

// =====================================================
// Submission status update validation
// =====================================================
const validateStatusUpdate = [
    rejectUnexpectedFields(ALLOWED_STATUS_FIELDS),

    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'resolved']).withMessage('Status must be "pending" or "resolved"'),

    handleValidationErrors,
];

// =====================================================
// MongoDB ObjectId param validation
// =====================================================
const validateObjectId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),

    handleValidationErrors,
];

module.exports = {
    validateLogin,
    validateSubmission,
    validateStatusUpdate,
    validateObjectId,
};
