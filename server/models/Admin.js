const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
