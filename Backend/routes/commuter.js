const express = require('express');
const axios = require('axios');
const router = express.Router();
const TransportNode = require('../models/TransportNode');
const TransportRoute = require('../models/TransportRoute');
const RouteHistory = require('../models/RouteHistory');

const locationAliases = {
  cyberhub: 'DLF Cyber Hub, Gurgaon',
  'cyber hub': 'DLF Cyber Hub, Gurgaon',
  delhi: 'Connaught Place, Delhi'
};

const parseCoordinateString = (value) => {
  if (typeof value !== 'string') return null;
  const parts = value.split(',').map((part) => parseFloat(part.trim()));
  if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  return {
    lat: parts[0],
    lon: parts[1],
    display_name: `${parts[0]}, ${parts[1]}`
  };
};

// Helper to geocode address
const geocodeAddress = async (address) => {
  const coordinateInput = parseCoordinateString(address);
  if (coordinateInput) return coordinateInput;

  const normalized = String(address || '').trim().toLowerCase();
  const query = locationAliases[normalized] || address;
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: 'json', limit: 1 },
      headers: {
        'User-Agent': 'TrafficOptimizer/1.0 (integrated-connectivity)',
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

// GET /commuter/get-route
router.get("/get-route", async (req, res) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Missing origin or destination" });
    }

    // Geocode
    const startLoc = await geocodeAddress(origin);
    const endLoc = await geocodeAddress(destination);

    if (!startLoc || !endLoc) {
      return res.status(404).json({ error: 'Could not find locations' });
    }

    // 1. Find nearest transport nodes (Metro/Bus)
    const nearestStartNode = await TransportNode.findOne({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [startLoc.lon, startLoc.lat] }
        }
      }
    });

    const nearestEndNode = await TransportNode.findOne({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [endLoc.lon, endLoc.lat] }
        }
      }
    });

    const routes = [];

    // 2. Simple Driving Route (Baseline from OSRM)
    try {
      const drivingRes = await axios.get(`http://router.project-osrm.org/route/v1/driving/${startLoc.lon},${startLoc.lat};${endLoc.lon},${endLoc.lat}?overview=false`);
      if (drivingRes.data.routes.length > 0) {
        const dRoute = drivingRes.data.routes[0];
        const distKm = dRoute.distance / 1000;

        // Fetch Taxi/Auto Rates from DB
        const taxiService = await TransportRoute.findOne({ mode: 'Taxi' });
        const autoService = await TransportRoute.findOne({ mode: 'Auto' });

        const taxiCost = taxiService ? (taxiService.baseCost + (distKm * taxiService.costPerKm)) : (50 + (distKm * 15));
        const autoCost = autoService ? (autoService.baseCost + (distKm * autoService.costPerKm)) : (30 + (distKm * 10));

        routes.push({
          mode: "Taxi (Cab)",
          totalDuration: Math.ceil(dRoute.duration / 60),
          cost: Math.ceil(taxiCost),
          segments: [{ mode: "Taxi", from: "Origin", to: "Destination", duration: Math.ceil(dRoute.duration / 60) }]
        });

        routes.push({
          mode: "Auto Rickshaw",
          totalDuration: Math.ceil(dRoute.duration / 60 * 1.1), // Slightly slower
          cost: Math.ceil(autoCost),
          segments: [{ mode: "Auto", from: "Origin", to: "Destination", duration: Math.ceil(dRoute.duration / 60 * 1.1) }]
        });

        // Walking Option (if close)
        if (distKm < 5) {
          routes.push({
            mode: "Walk",
            totalDuration: Math.ceil(distKm * 12), // approx 12 mins per km
            cost: 0,
            segments: [{ mode: "Walk", from: "Origin", to: "Destination", duration: Math.ceil(distKm * 12) }]
          });
        }
      }
    } catch (e) { console.error("OSRM Error", e.message); }

    // 3. Public Transport Logic
    if (nearestStartNode && nearestEndNode) {
      const commonRoute = await TransportRoute.findOne({
        stops: { $all: [nearestStartNode._id, nearestEndNode._id] }
      });

      if (commonRoute) {
        const distToStart = 0.5;
        const distFromEnd = 0.5;
        const rideDuration = 20;

        // Dynamic Fare for Metro/Bus
        // Simple logic: base + approx distance factor (simplified)
        const estimatedFare = commonRoute.baseCost + (commonRoute.costPerKm * 5); // Assuming 5km avg ride for now

        routes.push({
          mode: `Public: ${commonRoute.mode} (${commonRoute.name})`,
          totalDuration: 10 + rideDuration + 10,
          cost: Math.ceil(estimatedFare),
          segments: [
            { mode: "Walk", from: "Origin", to: nearestStartNode.name, duration: 10, distance: "0.5 km" },
            { mode: commonRoute.mode, from: nearestStartNode.name, to: nearestEndNode.name, duration: rideDuration, line: commonRoute.name },
            { mode: "Walk", from: nearestEndNode.name, to: "Destination", duration: 10, distance: "0.5 km" }
          ]
        });
      }
    }

    // Persist commuter planning to DB history for navigation insights.
    try {
      await RouteHistory.create({
        destination: destination,
        destinationCoords: [endLoc.lat, endLoc.lon],
        origin: origin,
        originCoords: [startLoc.lat, startLoc.lon],
        mode: 'driving'
      });
    } catch (historyError) {
      console.warn('Commuter history save warning:', historyError.message);
    }

    res.json({
      origin: startLoc.display_name,
      destination: endLoc.display_name,
      recommended: routes
    });

  } catch (error) {
    console.error("Commuter route error:", error);
    res.status(500).json({ error: "Failed to fetch commuter routes" });
  }
});

module.exports = router;
