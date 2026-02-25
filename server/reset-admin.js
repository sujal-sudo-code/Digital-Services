/**
 * Reset Admin — removes all admins so a new one is seeded on next server start.
 * Run: node reset-admin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function resetAdmin() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) { console.error('No MONGODB_URI in .env'); process.exit(1); }

        await mongoose.connect(uri);
        const result = await Admin.deleteMany({});
        console.log(`✅ Removed ${result.deletedCount} admin(s) from database.`);
        console.log('ℹ️  Restart the server to create a new admin from .env credentials.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

resetAdmin();
