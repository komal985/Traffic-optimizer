const mongoose = require('mongoose');

const authActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    action: {
        type: String,
        enum: ['register', 'login'],
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    ipAddress: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuthActivity', authActivitySchema);
