const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const TrafficData = require('../models/TrafficData');
const { connectDB } = require('../db');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedTraffic = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected...');

        // Clear existing data
        await TrafficData.deleteMany({});
        console.log('Cleared existing traffic data.');

        const trafficDocs = [];
        const baseLat = 28.6139;
        const baseLon = 77.2090;

        // Generate grid of points around Delhi
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                // Random offset spread ~10km
                const lat = baseLat + (Math.random() - 0.5) * 0.2;
                const lon = baseLon + (Math.random() - 0.5) * 0.2;

                // Random intensity with clusters (simplistic)
                let intensity = Math.floor(Math.random() * 100);

                // Make CP area more congested
                const distToCP = Math.sqrt(Math.pow(lat - baseLat, 2) + Math.pow(lon - baseLon, 2));
                if (distToCP < 0.05) intensity = Math.min(100, intensity + 30);

                trafficDocs.push({
                    location: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    },
                    intensity: intensity,
                    vehicleCount: Math.floor(intensity * 1.5),
                    area: "Delhi Grid"
                });
            }
        }

        await TrafficData.insertMany(trafficDocs);
        console.log(`Successfully seeded ${trafficDocs.length} traffic points.`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding traffic data:', err);
        process.exit(1);
    }
};

seedTraffic();
