const mongoose = require('mongoose');

/**
 * Submission Schema
 * -------------------------------------------------
 * SECURITY: maxlength constraints enforce size limits at the
 * database level as defense-in-depth (validators also check).
 * -------------------------------------------------
 */
const submissionSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, default: '', maxlength: 20 },
    problem: { type: String, default: '', maxlength: 200 },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, default: 'pending', enum: ['pending', 'resolved'] },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Submission', submissionSchema);
