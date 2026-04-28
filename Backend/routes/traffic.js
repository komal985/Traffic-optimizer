const express = require('express');
const TrafficData = require('../models/TrafficData');
const router = express.Router();

// GET /traffic/heatmap - Get traffic intensity points
router.get('/heatmap', async (req, res) => {
  try {
    // Return all active traffic points (limit 1000 for performance)
    // In a real app we would filter by viewport bounds (lat/lon query)
    const trafficPoints = await TrafficData.find()
      .select('location intensity area vehicleCount -_id')
      .limit(2000)
      .lean();

    // Transform for frontend: simple array of [lat, lon, intensity]
    const heatmapData = trafficPoints.map(point => [
      point.location.coordinates[1], // lat
      point.location.coordinates[0], // lon
      point.intensity
    ]);

    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching traffic heatmap:', error);
    res.status(500).json({ error: 'Failed to fetch traffic data' });
  }
});

module.exports = router;