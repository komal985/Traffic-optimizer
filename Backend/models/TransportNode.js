const mongoose = require('mongoose');

const transportNodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    type: {
        type: String,
        enum: ['Metro', 'Bus', 'Train', 'Swap', 'Walk', 'Auto', 'Taxi'], // Swap is likely for interchange
        required: true
    },
    line: { // e.g., "Yellow Line", "Blue Line", or null for general bus stops
        type: String
    },
    isInterchange: {
        type: Boolean,
        default: false
    }
});

// Index for geospatial queries
transportNodeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('TransportNode', transportNodeSchema);
