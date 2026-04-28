const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
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
    intensity: {
        type: Number,
        required: true,
        min: 0,
        max: 100 // 0 = empty, 100 = jammed
    },
    vehicleCount: {
        type: Number,
        default: 0
    },
    area: {
        type: String,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 3600 // Auto-delete after 1 hour (TTL index)
    }
});

// Create 2dsphere index for geospatial queries
trafficDataSchema.index({ location: '2dsphere' });

const TrafficData = mongoose.model('TrafficData', trafficDataSchema);

module.exports = TrafficData;
