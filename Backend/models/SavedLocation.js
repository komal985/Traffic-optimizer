const mongoose = require('mongoose');

const savedLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    coords: {
        type: [Number], // [lat, lon]
        required: true
    },
    icon: {
        type: String,
        default: '📍'
    },
    color: {
        type: String,
        default: '#64ffda'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SavedLocation = mongoose.model('SavedLocation', savedLocationSchema);

module.exports = SavedLocation;
