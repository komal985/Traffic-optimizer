const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    pickupLocation: {
        type: String,
        required: true,
        index: true
    },
    destination: {
        type: String,
        required: true
    },
    driver: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://randomuser.me/api/portraits/lego/1.jpg'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5
    },
    departureTime: {
        type: String,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true,
        min: 0,
        max: 8
    },
    costPerPerson: {
        type: Number,
        required: true,
        min: 0
    },
    carModel: {
        type: String,
        required: true
    },
    carbonSaved: {
        type: Number,
        default: 2.0
    },
    tags: {
        type: [String],
        default: []
    },
    organization: {
        type: String,
        index: true
    },
    rideStatus: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Cancelled'],
        default: 'Ongoing'
    },
    carpoolingPreference: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create text index for location search
rideSchema.index({ pickupLocation: 'text', destination: 'text' });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
