const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    problem: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'resolved'] },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Submission', submissionSchema);
