/**
 * Seed script — creates the initial admin user.
 * Run: node seed.js
 *
 * SECURITY: Credentials are read from environment variables only.
 * No hardcoded passwords.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// SECURITY: Read credentials from environment — never hardcode secrets
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    console.error('   See .env.example for reference.');
    process.exit(1);
}

async function seed() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital-services';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const existing = await Admin.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`Admin "${ADMIN_EMAIL}" already exists. Skipping.`);
        } else {
            await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
            console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
        }

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
