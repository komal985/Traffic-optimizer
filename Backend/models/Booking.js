const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    parkingSpotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true
    },
    userId: {
        type: String, // Ideally ObjectId if users exist, but using string for guest/demo for now
        default: 'guest'
    },
    userName: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
