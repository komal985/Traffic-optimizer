const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const trafficRoutes = require('./routes/traffic');
const routingRoutes = require('./routes/routing');
const Ai = require('./routes/ai');
const { logRequest, logError } = require('./utils/logger'); // Custom logger utility
const rateLimit = require('express-rate-limit'); // Rate limiting for API protection
const parkingRoutes = require('./routes/parking');
const commuterRoutes = require('./routes/commuter');
const carpoolingRoutes = require('./routes/carpooling');
const navigationRoutes = require('./routes/navigation');
const { connectDB } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(logRequest); // Log all incoming requests
app.use(limiter); // Apply rate limiting to all routes

// Routes
app.use('/traffic', trafficRoutes); // Traffic-related routes
app.use('/routing', routingRoutes); // Routing-related routes
app.use('/ai', Ai); // AI-related routes
app.use('/parking', parkingRoutes);
app.use('/commuter', commuterRoutes);
app.use('/carpooling', carpoolingRoutes);
app.use('/navigation', navigationRoutes);
const bookingRoutes = require('./routes/booking');
const authRoutes = require('./routes/auth');

app.use('/booking', bookingRoutes);
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
const errorHandler = require('./middleware/errorHandler');

// ... (other imports)

// Global error handler
app.use(errorHandler);

// Start server only after DB connection is ready
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database connection:', error.message);
    process.exit(1);
  }
};

startServer();