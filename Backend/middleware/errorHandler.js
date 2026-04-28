const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logError(err);
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            error: 'Validation Error',
            messages
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Duplicate field value entered'
        });
    }

    // Cast error (invalid ID)
    if (err.name === 'CastError') {
        return res.status(404).json({
            error: 'Resource not found'
        });
    }

    res.status(err.statusCode || 500).json({
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;
