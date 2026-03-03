/**
 * Submission Routes
 * -------------------------------------------------
 * POST   /api/submissions      — public: create a new submission
 * GET    /api/submissions      — admin only: list all submissions
 * PATCH  /api/submissions/:id  — admin only: update status
 * DELETE /api/submissions/:id  — admin only: delete
 * -------------------------------------------------
 */

const express = require('express');
const Submission = require('../models/Submission');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSubmission, validateStatusUpdate, validateObjectId } = require('../middleware/validators');
const { submissionLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/submissions — public: create a new submission
// SECURITY: submissionLimiter = 10 per 15 min per IP
// SECURITY: validateSubmission = schema validation + field whitelist
router.post('/', submissionLimiter, ...validateSubmission, async (req, res) => {
    try {
        // Only extract allowed fields (defense in depth — validators already whitelist)
        const { name, email, phone, problem, message } = req.body;

        const submission = await Submission.create({
            name,
            email,
            phone: phone || '',
            problem: problem || '',
            message,
            status: 'pending',
        });

        console.log(`📩 New submission from ${name} (${email})`);

        // --- Send emails (non-blocking — failures won't break the API response) ---
        const transporter = req.app.get('emailTransporter');
        if (transporter) {
            const adminEmail = process.env.EMAIL_TO || process.env.ADMIN_EMAIL;

            // 1) Confirmation email to the user
            transporter.sendMail({
                from: `"Digital Services" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'We received your enquiry — Digital Services',
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 28px 24px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 22px;">Digital Services</h1>
                        </div>
                        <div style="padding: 28px 24px; color: #333;">
                            <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
                            <p>Thank you for reaching out! We've received your enquiry and our team will get back to you as soon as possible.</p>
                            <div style="background: #f8f9fa; border-left: 4px solid #6366f1; padding: 14px 16px; border-radius: 4px; margin: 20px 0;">
                                <p style="margin: 0 0 6px; font-weight: 600; color: #6366f1;">Your Enquiry Summary</p>
                                <p style="margin: 4px 0;"><strong>Problem:</strong> ${problem || 'N/A'}</p>
                                <p style="margin: 4px 0;"><strong>Message:</strong> ${message}</p>
                            </div>
                            <p style="color: #777; font-size: 13px;">If you didn't submit this form, you can safely ignore this email.</p>
                        </div>
                        <div style="background: #f1f1f1; padding: 14px 24px; text-align: center; font-size: 12px; color: #999;">
                            &copy; ${new Date().getFullYear()} Digital Services. All rights reserved.
                        </div>
                    </div>
                `,
            }).then(() => {
                console.log(`✅ Confirmation email sent to ${email}`);
            }).catch((err) => {
                console.error(`⚠️  Failed to send confirmation email to ${email}:`, err.message);
            });

            // 2) Notification email to admin
            if (adminEmail) {
                transporter.sendMail({
                    from: `"Digital Services" <${process.env.EMAIL_USER}>`,
                    to: adminEmail,
                    subject: `New Enquiry from ${name}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 28px 24px; text-align: center;">
                                <h1 style="color: #fff; margin: 0; font-size: 22px;">📩 New Enquiry</h1>
                            </div>
                            <div style="padding: 28px 24px; color: #333;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="padding: 8px 0; font-weight: 600; width: 100px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Phone</td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Problem</td><td style="padding: 8px 0;">${problem || 'Not specified'}</td></tr>
                                </table>
                                <div style="background: #f8f9fa; padding: 14px 16px; border-radius: 4px; margin-top: 16px;">
                                    <p style="margin: 0 0 6px; font-weight: 600;">Message</p>
                                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                                </div>
                            </div>
                            <div style="background: #f1f1f1; padding: 14px 24px; text-align: center; font-size: 12px; color: #999;">
                                Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </div>
                        </div>
                    `,
                }).then(() => {
                    console.log(`✅ Admin notification sent to ${adminEmail}`);
                }).catch((err) => {
                    console.error(`⚠️  Failed to send admin notification:`, err.message);
                });
            }
        } else {
            console.log('ℹ️  Email transporter not configured — skipping email notifications');
        }

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
// SECURITY: validateObjectId = ensures :id is a valid MongoDB ObjectId
// SECURITY: validateStatusUpdate = whitelist fields + enum check
router.patch('/:id', authMiddleware, ...validateObjectId, ...validateStatusUpdate, async (req, res) => {
    try {
        const { status } = req.body;

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
// SECURITY: validateObjectId = ensures :id is a valid MongoDB ObjectId
router.delete('/:id', authMiddleware, ...validateObjectId, async (req, res) => {
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
