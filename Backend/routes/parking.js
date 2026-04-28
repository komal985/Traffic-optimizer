const express = require("express");
const ParkingSpot = require("../models/ParkingSpot");
const router = express.Router();

const locationAliases = {
  "caugnaught place": "Connaught Place",
  "connaught place": "Connaught Place",
  "cp": "Connaught Place",
  "cyberhub": "Cyber Hub",
  "cyber hub": "Cyber Hub",
  "nehru palce": "Nehru Place",
  "nehru place": "Nehru Place"
};

let criticalSpotsInitialized = false;

const criticalSpots = [
  {
    name: "Connaught Place Priority Parking",
    area: "Connaught Place",
    location: { type: "Point", coordinates: [77.2167, 28.6315] },
    totalSlots: 180,
    availableSlots: 72,
    hourlyRate: 80,
    security: true,
    valetParking: true,
    evCharging: true,
    twoWheeler: true,
    rating: 4.6,
    peakHours: "5:00 PM - 8:00 PM"
  },
  {
    name: "Cyber Hub Priority Parking",
    area: "Gurgaon",
    location: { type: "Point", coordinates: [77.0895, 28.4950] },
    totalSlots: 220,
    availableSlots: 88,
    hourlyRate: 100,
    security: true,
    valetParking: true,
    evCharging: true,
    twoWheeler: true,
    rating: 4.7,
    peakHours: "6:00 PM - 9:00 PM"
  },
  {
    name: "Nehru Place Priority Parking",
    area: "Nehru Place",
    location: { type: "Point", coordinates: [77.2536, 28.5494] },
    totalSlots: 160,
    availableSlots: 64,
    hourlyRate: 70,
    security: true,
    valetParking: false,
    evCharging: true,
    twoWheeler: true,
    rating: 4.5,
    peakHours: "10:00 AM - 1:00 PM"
  }
];

const ensureCriticalParkingSpots = async () => {
  if (criticalSpotsInitialized) return;

  await Promise.all(
    criticalSpots.map((spot) =>
      ParkingSpot.findOneAndUpdate(
        { name: spot.name },
        { $set: spot },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  criticalSpotsInitialized = true;
};

// GET /parking/available - Search parking spots
router.get("/available", async (req, res) => {
  try {
    await ensureCriticalParkingSpots();
    const { location, lat, lon, radius = 2000 } = req.query;

    let query = {};

    if (lat && lon) {
      // Geospatial query using Mongo's $near
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) // meters
        }
      };
    } else if (location) {
      const normalizedLocation = String(location).trim().toLowerCase();
      const canonicalLocation = locationAliases[normalizedLocation] || location;

      // Text search by area or name (case-insensitive regex)
      query.$or = [
        { area: { $regex: canonicalLocation, $options: "i" } },
        { name: { $regex: canonicalLocation, $options: "i" } }
      ];
    } else {
      // Default: return all spots (limit 50)
      return res.json(await ParkingSpot.find().limit(50));
    }

    const spots = await ParkingSpot.find(query).limit(50);

    // Calculate distance if lat/lon provided (for sorting/display if needed) [Optimized by $near already]
    res.json(spots);
  } catch (err) {
    console.error("Error fetching parking spots:", err);
    res.status(500).json({ error: "Failed to fetch parking data" });
  }
});

// GET /parking/stats/delhi - Aggregate statistics
router.get("/stats/delhi", async (req, res) => {
  try {
    await ensureCriticalParkingSpots();
    const stats = await ParkingSpot.aggregate([
      {
        $group: {
          _id: null,
          totalParking: { $sum: "$totalSlots" },
          availableNow: { $sum: "$availableSlots" },
          avgHourlyRate: { $avg: "$hourlyRate" }
        }
      }
    ]);

    // Find highest demand area (lowest available percentage)
    const demandStats = await ParkingSpot.aggregate([
      {
        $group: {
          _id: "$area",
          total: { $sum: "$totalSlots" },
          available: { $sum: "$availableSlots" }
        }
      },
      {
        $project: {
          area: "$_id",
          occupancyRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $multiply: [{ $divide: [{ $subtract: ["$total", "$available"] }, "$total"] }, 100] }
            ]
          }
        }
      },
      { $sort: { occupancyRate: -1 } }
    ]);

    const result = stats[0] || { totalParking: 0, availableNow: 0 };
    const highestDemand = demandStats[0] ? demandStats[0].area : "N/A";
    const lowestDemand = demandStats[demandStats.length - 1] ? demandStats[demandStats.length - 1].area : "N/A";

    const avgOccupancy = result.totalParking > 0
      ? Math.round(((result.totalParking - result.availableNow) / result.totalParking) * 100)
      : 0;

    res.json({
      totalParking: result.totalParking,
      availableNow: result.availableNow,
      avgOccupancy,
      highestDemand,
      lowestDemand,
      peakTime: "5:00 PM - 7:00 PM" // Could be dynamic if we tracked history
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// POST /parking/book - Simulating booking a spot
router.post("/book", async (req, res) => {
  try {
    const { id } = req.body;
    const spot = await ParkingSpot.findById(id);

    if (!spot) {
      return res.status(404).json({ error: "Parking spot not found" });
    }

    if (spot.availableSlots > 0) {
      spot.availableSlots -= 1;
      await spot.save();
      res.json({ success: true, message: "Booking confirmed", spot });
    } else {
      res.status(400).json({ error: "No slots available" });
    }
  } catch (err) {
    console.error("Error booking spot:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

module.exports = router;
