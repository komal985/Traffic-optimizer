const mongoose = require('mongoose');

const routeHistorySchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true
    },
    destinationCoords: {
        type: [Number], // [lat, lon]
        required: true
    },
    origin: {
        type: String,
        default: 'Current Location'
    },
    originCoords: {
        type: [Number] // [lat, lon]
    },
    mode: {
        type: String,
        enum: ['driving', 'walking', 'cycling'],
        default: 'driving'
    },
    distance: {
        type: Number // in meters
    },
    duration: {
        type: Number // in seconds
    },
    searchedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for recent searches query
routeHistorySchema.index({ searchedAt: -1 });

const RouteHistory = mongoose.model('RouteHistory', routeHistorySchema);

module.exports = RouteHistory;
