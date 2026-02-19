const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());

// ===== Data Storage =====
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory + file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}

function getSubmissions() {
    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveSubmission(submission) {
    const submissions = getSubmissions();
    submissions.push(submission);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
    return submission;
}

// ===== Email Transporter (Nodemailer) =====
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com') {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Verify connection
    transporter.verify()
        .then(() => console.log('✅ Email transporter ready'))
        .catch((err) => {
            console.log('⚠️  Email transporter not configured:', err.message);
            console.log('   Form submissions will still be saved to file.');
            transporter = null;
        });
} else {
    console.log('ℹ️  Email not configured. Update .env with your credentials.');
    console.log('   Form submissions will be saved to data/submissions.json');
}

// ===== Routes =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        emailConfigured: transporter !== null,
    });
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, problem, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required.',
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format.',
            });
        }

        // Create submission record
        const submission = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            name,
            email,
            phone: phone || '',
            problem: problem || '',
            message,
            timestamp: new Date().toISOString(),
            emailSent: false,
        };

        // Save to file
        saveSubmission(submission);
        console.log(`📩 New submission from ${name} (${email})`);

        // Send email notification
        if (transporter) {
            try {
                // 1. Send Admin Notification
                await transporter.sendMail({
                    from: `"Digital Services Website" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                    replyTo: email,
                    subject: `New Contact Form: ${problem || 'General Inquiry'} — ${name}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #1e40af, #0891b2); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                            </div>
                            <div style="padding: 30px;">
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                                <p><strong>Subject:</strong> ${problem || 'N/A'}</p>
                                <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    `,
                });

                // 2. Send User Auto-Reply
                await transporter.sendMail({
                    from: `"Digital Services Support" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: `We've received your message — Digital Services`,
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
                            </div>
                            <div style="padding: 30px; color: #374151; line-height: 1.6;">
                                <p>Hi ${name},</p>
                                <p>We have received your message regarding <strong>"${problem || 'your inquiry'}"</strong>.</p>
                                <p>Our team is reviewing it and will get back to you shortly to resolve your issue properly.</p>
                                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                                <p style="font-size: 14px; color: #6b7280;">
                                    <strong>Digital Services Team</strong><br>
                                    Banking & Networking Infrastructure Specialists<br>
                                    Gaya, Bihar
                                </p>
                            </div>
                        </div>
                    `,
                });
            } catch (emailErr) {
                console.log(`  ⚠️  Email failed: ${emailErr.message}`);
                // Don't fail the whole request — data is still saved
            }
        }

        res.json({
            success: true,
            message: 'Your message has been received! We\'ll get back to you soon.',
            id: submission.id,
        });

    } catch (error) {
        console.error('❌ Error processing contact form:', error);
        res.status(500).json({
            success: false,
            error: 'Something went wrong. Please try again later.',
        });
    }
});

// Get all submissions (basic admin endpoint)
app.get('/api/submissions', (req, res) => {
    const submissions = getSubmissions();
    res.json({
        success: true,
        count: submissions.length,
        submissions: submissions.reverse(), // newest first
    });
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Digital Services Backend');
    console.log(`   Server:  http://localhost:${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/api/health`);
    console.log(`   Admin:   http://localhost:${PORT}/api/submissions`);
    console.log('');
});
