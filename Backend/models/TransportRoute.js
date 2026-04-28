const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    mode: {
        type: String,
        enum: ['Metro', 'Bus', 'Train', 'Walk', 'Auto', 'Taxi'],
        required: true
    },
    stops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransportNode'
    }],
    frequencyMin: { // Average frequency in minutes
        type: Number,
        default: 10
    },
    firstTrain: { type: String }, // e.g. "06:00"
    lastTrain: { type: String }, // e.g. "23:00"
    color: { type: String }, // e.g. "#FFD700" for Yellow Line
    costPerKm: { type: Number, default: 0 }, // Cost per KM (for Taxi/Auto)
    baseCost: { type: Number, default: 0 } // Base fare (starting price)
});

module.exports = mongoose.model('TransportRoute', transportRouteSchema);
