const express = require('express');
const Submission = require('../models/Submission');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/submissions — public: create a new submission
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, problem, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const submission = await Submission.create({
            name,
            email,
            phone: phone || '',
            problem: problem || '',
            message,
            status: 'pending',
        });

        console.log(`📩 New submission from ${name} (${email})`);

        res.status(201).json({ success: true, submission });
    } catch (err) {
        console.error('Error creating submission:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/submissions — admin only: list all submissions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find().sort({ created_at: -1 });
        res.json({ success: true, submissions });
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH /api/submissions/:id — admin only: update status
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Status must be "pending" or "resolved"' });
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({ success: true, submission });
    } catch (err) {
        console.error('Error updating submission:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/submissions/:id — admin only: delete
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting submission:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
