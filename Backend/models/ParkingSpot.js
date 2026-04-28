const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        index: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    totalSlots: {
        type: Number,
        required: true
    },
    availableSlots: {
        type: Number,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    security: {
        type: Boolean,
        default: false
    },
    valetParking: {
        type: Boolean,
        default: false
    },
    evCharging: {
        type: Boolean,
        default: false
    },
    twoWheeler: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    peakHours: {
        type: String,
        default: "10:00 AM - 7:00 PM"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create 2dsphere index for geospatial queries
parkingSpotSchema.index({ location: '2dsphere' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

module.exports = ParkingSpot;
