const express = require('express');
const cors = require('cors');
const helmet = require('helmet');                           // SECURITY: HTTP security headers
const mongoSanitize = require('express-mongo-sanitize');    // SECURITY: NoSQL injection prevention
const nodemailer = require('nodemailer');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const Admin = require('./models/Admin');
const { globalLimiter } = require('./middleware/rateLimiter');

// =============================================================
// SECURITY: Startup validation — refuse to run without secrets
// =============================================================
function validateEnv() {
    const required = ['JWT_SECRET', 'MONGODB_URI'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        console.error('   Copy server/.env.example to server/.env and fill in your values.');
        process.exit(1);
    }

    // Warn about weak JWT secrets
    if (process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  JWT_SECRET is shorter than 32 characters — consider using a stronger secret.');
    }
}

validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-seed admin user if none exists
async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        console.log('ℹ️  No ADMIN_EMAIL/ADMIN_PASSWORD in .env — skipping admin seed');
        return;
    }
    try {
        const count = await Admin.countDocuments();
        if (count === 0) {
            await Admin.create({ email, password });
            console.log(`✅ Admin created: ${email}`);
        }
    } catch (err) {
        console.error('⚠️  Auto-seed failed:', err.message);
    }
}

// ===== Security Middleware =====

// SECURITY: Helmet sets various HTTP headers to protect against
// common attacks (clickjacking, MIME sniffing, XSS, etc.)
app.use(helmet());

// SECURITY: Global rate limiter — 100 requests per 15 min per IP
app.use(globalLimiter);

// SECURITY: CORS — restrict origins via environment variable
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));

// SECURITY: Limit JSON body size to 10KB to prevent large-payload DoS
app.use(express.json({ limit: '10kb' }));

// SECURITY: Sanitise user input — strips MongoDB operators ($gt, $ne, etc.)
// Prevents NoSQL injection attacks
app.use(mongoSanitize());

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

    transporter.verify()
        .then(() => console.log('✅ Email transporter ready'))
        .catch((err) => {
            console.log('⚠️  Email transporter not configured:', err.message);
            transporter = null;
        });
} else {
    console.log('ℹ️  Email not configured. Update .env with your credentials.');
}

// Make transporter available to routes
app.set('emailTransporter', transporter);

// ===== Routes =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        emailConfigured: transporter !== null,
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Submission routes
app.use('/api/submissions', submissionRoutes);

// ===== Connect DB & Start Server =====
connectDB().then(async () => {
    await seedAdmin();
    app.listen(PORT, () => {
        console.log('');
        console.log('🚀 Digital Services Backend');
        console.log(`   Server:  http://localhost:${PORT}`);
        console.log(`   Health:  http://localhost:${PORT}/api/health`);
        console.log('');
    });
});
