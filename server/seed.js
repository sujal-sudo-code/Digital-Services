/**
 * Seed script — creates the initial admin user.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const ADMIN_EMAIL = 'test.sujalrathore@gmail.com';
const ADMIN_PASSWORD = 'admin123';

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
            console.log(`✅ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
        }

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
