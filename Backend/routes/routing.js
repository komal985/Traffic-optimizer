const express = require('express');
const axios = require('axios');
const router = express.Router();
const TrafficData = require('../models/TrafficData');
const RouteHistory = require('../models/RouteHistory');

const isValidCoordinate = (value) => Number.isFinite(value);

const parseCoordinateString = (value) => {
  if (typeof value !== 'string') return null;
  const parts = value.split(',').map((part) => parseFloat(part.trim()));
  if (parts.length !== 2 || !isValidCoordinate(parts[0]) || !isValidCoordinate(parts[1])) {
    return null;
  }

  return {
    lat: parts[0],
    lon: parts[1],
    display_name: `${parts[0]}, ${parts[1]}`
  };
};

// Helper to geocode address
const geocodeAddress = async (address) => {
  const parsedCoordinates = parseCoordinateString(address);
  if (parsedCoordinates) return parsedCoordinates;

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1 },
      headers: {
        'User-Agent': 'TrafficOptimizer/1.0 (route-planner)',
        'Accept-Language': 'en'
      }
    });
    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon),
        display_name: response.data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

// POST /routing/calculate-route
router.post('/calculate-route', async (req, res) => {
  try {
    const { start, destination } = req.body;

    if (!start || !destination) {
      return res.status(400).json({ error: 'Start and destination are required' });
    }

    // Geocode locations
    const startLoc = typeof start === 'string' ? await geocodeAddress(start) : start;
    const endLoc = typeof destination === 'string' ? await geocodeAddress(destination) : destination;

    if (!startLoc || !endLoc) {
      return res.status(404).json({ error: 'Could not find one or both locations' });
    }

    // Get Route from OSRM
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${startLoc.lon},${startLoc.lat};${endLoc.lon},${endLoc.lat}?overview=full&geometries=geojson&steps=true`;

    const routeRes = await axios.get(osrmUrl);

    if (!routeRes.data.routes || routeRes.data.routes.length === 0) {
      return res.status(404).json({ error: 'No route found' });
    }

    const route = routeRes.data.routes[0];

    // Calculate simple congestion factor based on TrafficData
    // In a real system, we'd map match the route against traffic points
    // Here we'll do a simple proximity check for the start/end points

    // Count high traffic points near the route start (using $geoWithin since $near doesn't work in count)
    const trafficCount = await TrafficData.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [[startLoc.lon, startLoc.lat], 5 / 6378.1]
        }
      },
      intensity: { $gt: 70 }
    });

    // Heuristic congestion level
    let congestionLevel = "Low";
    if (trafficCount > 20) congestionLevel = "High";
    else if (trafficCount > 5) congestionLevel = "Moderate";

    // Adjust duration based on congestion
    const congestionFactor = congestionLevel === "High" ? 1.5 : (congestionLevel === "Moderate" ? 1.2 : 1.0);
    const estimatedDuration = Math.round(route.duration * congestionFactor);
    const distanceKm = Number((route.distance / 1000).toFixed(2));
    const path = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

    // Persist route planning history for route planner + navigation experiences.
    try {
      await RouteHistory.create({
        destination: destination,
        destinationCoords: [endLoc.lat, endLoc.lon],
        origin: start,
        originCoords: [startLoc.lat, startLoc.lon],
        mode: 'driving',
        distance: route.distance,
        duration: estimatedDuration
      });
    } catch (historyError) {
      console.warn('Route history save warning:', historyError.message);
    }

    res.json({
      start: startLoc,
      destination: endLoc,
      // Legacy fields used elsewhere.
      distanceText: `${distanceKm} km`,
      durationText: `${Math.round(estimatedDuration / 60)} mins`,
      // Route Planner fields (numeric + leafet polyline-friendly).
      distance: distanceKm,
      duration: estimatedDuration,
      path,
      startCoords: [startLoc.lat, startLoc.lon],
      destinationCoords: [endLoc.lat, endLoc.lon],
      raw_duration: route.duration,
      geometry: route.geometry,
      steps: route.legs[0].steps,
      congestion: congestionLevel,
      congestion_level: congestionLevel,
      vehicle_count: trafficCount * 15 // Mock estimation
    });

  } catch (error) {
    console.error('Routing error:', error);
    res.status(500).json({ error: 'Failed to calculate route', details: error.message });
  }
});

module.exports = router;