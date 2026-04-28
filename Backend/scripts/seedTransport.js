const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TransportNode = require('../models/TransportNode');
const TransportRoute = require('../models/TransportRoute');
const { connectDB } = require('../db');

dotenv.config();

// Delhi Locations ~100 points
const locations = [
    // --- YELLOW LINE ---
    { name: 'Samaypur Badli', type: 'Metro', line: 'Yellow Line', lat: 28.7505, lon: 77.1200 },
    { name: 'Rohini Sector 18', type: 'Metro', line: 'Yellow Line', lat: 28.7391, lon: 77.1189 },
    { name: 'Haiderpur Badli Mor', type: 'Metro', line: 'Yellow Line', lat: 28.7288, lon: 77.1278 },
    { name: 'Jahangirpuri', type: 'Metro', line: 'Yellow Line', lat: 28.7186, lon: 77.1643 },
    { name: 'Adarsh Nagar', type: 'Metro', line: 'Yellow Line', lat: 28.7089, lon: 77.1691 },
    { name: 'Azadpur', type: 'Metro', line: 'Yellow Line', lat: 28.7027, lon: 77.1704, isInterchange: true },
    { name: 'Model Town', type: 'Metro', line: 'Yellow Line', lat: 28.6946, lon: 77.1895 },
    { name: 'GTB Nagar', type: 'Metro', line: 'Yellow Line', lat: 28.6976, lon: 77.2064 },
    { name: 'Vishwavidyalaya', type: 'Metro', line: 'Yellow Line', lat: 28.6896, lon: 77.2144 },
    { name: 'Vidhan Sabha', type: 'Metro', line: 'Yellow Line', lat: 28.6806, lon: 77.2217 },
    { name: 'Civil Lines', type: 'Metro', line: 'Yellow Line', lat: 28.6724, lon: 77.2272 },
    { name: 'Kashmere Gate', type: 'Metro', line: 'Yellow Line', lat: 28.6675, lon: 77.2285, isInterchange: true },
    { name: 'Chandni Chowk', type: 'Metro', line: 'Yellow Line', lat: 28.6579, lon: 77.2300 },
    { name: 'Chawri Bazar', type: 'Metro', line: 'Yellow Line', lat: 28.6492, lon: 77.2264 },
    { name: 'New Delhi', type: 'Metro', line: 'Yellow Line', lat: 28.6429, lon: 77.2218, isInterchange: true },
    { name: 'Rajiv Chowk', type: 'Metro', line: 'Yellow Line', lat: 28.6328, lon: 77.2197, isInterchange: true },
    { name: 'Patel Chowk', type: 'Metro', line: 'Yellow Line', lat: 28.6231, lon: 77.2148 },
    { name: 'Central Secretariat', type: 'Metro', line: 'Yellow Line', lat: 28.6186, lon: 77.2146, isInterchange: true },
    { name: 'Udyog Bhawan', type: 'Metro', line: 'Yellow Line', lat: 28.6116, lon: 77.2119 },
    { name: 'Lok Kalyan Marg', type: 'Metro', line: 'Yellow Line', lat: 28.6025, lon: 77.2149 },
    { name: 'Jor Bagh', type: 'Metro', line: 'Yellow Line', lat: 28.5886, lon: 77.2132 },
    { name: 'INA', type: 'Metro', line: 'Yellow Line', lat: 28.5746, lon: 77.2120, isInterchange: true },
    { name: 'AIIMS', type: 'Metro', line: 'Yellow Line', lat: 28.5654, lon: 77.2114 },
    { name: 'Green Park', type: 'Metro', line: 'Yellow Line', lat: 28.5583, lon: 77.2078 },
    { name: 'Hauz Khas', type: 'Metro', line: 'Yellow Line', lat: 28.5430, lon: 77.2065, isInterchange: true },
    { name: 'Malviya Nagar', type: 'Metro', line: 'Yellow Line', lat: 28.5298, lon: 77.2121 },
    { name: 'Saket', type: 'Metro', line: 'Yellow Line', lat: 28.5134, lon: 77.2096 },
    { name: 'Qutab Minar', type: 'Metro', line: 'Yellow Line', lat: 28.4988, lon: 77.1857 },
    { name: 'Chhatarpur', type: 'Metro', line: 'Yellow Line', lat: 28.5027, lon: 77.1729 },
    { name: 'Sultanpur', type: 'Metro', line: 'Yellow Line', lat: 28.4907, lon: 77.1685 },
    { name: 'Ghitorni', type: 'Metro', line: 'Yellow Line', lat: 28.4812, lon: 77.1472 },
    { name: 'Arjan Garh', type: 'Metro', line: 'Yellow Line', lat: 28.4807, lon: 77.1328 },
    { name: 'Guru Dronacharya', type: 'Metro', line: 'Yellow Line', lat: 28.4813, lon: 77.1118 },
    { name: 'Sikandarpur', type: 'Metro', line: 'Yellow Line', lat: 28.4819, lon: 77.0934, isInterchange: true },
    { name: 'MG Road', type: 'Metro', line: 'Yellow Line', lat: 28.4797, lon: 77.0803 },
    { name: 'IFFCO Chowk', type: 'Metro', line: 'Yellow Line', lat: 28.4727, lon: 77.0725 },
    { name: 'Huda City Centre', type: 'Metro', line: 'Yellow Line', lat: 28.4593, lon: 77.0724 },

    // --- BLUE LINE ---
    { name: 'Dwarka Sector 21', type: 'Metro', line: 'Blue Line', lat: 28.5521, lon: 77.0585, isInterchange: true },
    { name: 'Dwarka Sector 8', type: 'Metro', line: 'Blue Line', lat: 28.5701, lon: 77.0712 },
    { name: 'Dwarka Sector 9', type: 'Metro', line: 'Blue Line', lat: 28.5746, lon: 77.0645 },
    { name: 'Dwarka Sector 10', type: 'Metro', line: 'Blue Line', lat: 28.5785, lon: 77.0578 },
    { name: 'Dwarka Sector 11', type: 'Metro', line: 'Blue Line', lat: 28.5834, lon: 77.0501 },
    { name: 'Dwarka Sector 12', type: 'Metro', line: 'Blue Line', lat: 28.5901, lon: 77.0425 },
    { name: 'Dwarka Sector 13', type: 'Metro', line: 'Blue Line', lat: 28.5982, lon: 77.0356 },
    { name: 'Dwarka Sector 14', type: 'Metro', line: 'Blue Line', lat: 28.6025, lon: 77.0304 },
    { name: 'Dwarka', type: 'Metro', line: 'Blue Line', lat: 28.6138, lon: 77.0223 },
    { name: 'Dwarka Mor', type: 'Metro', line: 'Blue Line', lat: 28.6192, lon: 77.0321 },
    { name: 'Nawada', type: 'Metro', line: 'Blue Line', lat: 28.6214, lon: 77.0456 },
    { name: 'Uttam Nagar West', type: 'Metro', line: 'Blue Line', lat: 28.6245, lon: 77.0589 },
    { name: 'Uttam Nagar East', type: 'Metro', line: 'Blue Line', lat: 28.6267, lon: 77.0678 },
    { name: 'Janakpuri West', type: 'Metro', line: 'Blue Line', lat: 28.6294, lon: 77.0772, isInterchange: true },
    { name: 'Janakpuri East', type: 'Metro', line: 'Blue Line', lat: 28.6321, lon: 77.0865 },
    { name: 'Tilak Nagar', type: 'Metro', line: 'Blue Line', lat: 28.6365, lon: 77.0987 },
    { name: 'Subhash Nagar', type: 'Metro', line: 'Blue Line', lat: 28.6401, lon: 77.1089 },
    { name: 'Tagore Garden', type: 'Metro', line: 'Blue Line', lat: 28.6432, lon: 77.1156 },
    { name: 'Rajouri Garden', type: 'Metro', line: 'Blue Line', lat: 28.6496, lon: 77.1223, isInterchange: true },
    { name: 'Ramesh Nagar', type: 'Metro', line: 'Blue Line', lat: 28.6521, lon: 77.1325 },
    { name: 'Moti Nagar', type: 'Metro', line: 'Blue Line', lat: 28.6554, lon: 77.1428 },
    { name: 'Kirti Nagar', type: 'Metro', line: 'Blue Line', lat: 28.6578, lon: 77.1512, isInterchange: true },
    { name: 'Shadipur', type: 'Metro', line: 'Blue Line', lat: 28.6515, lon: 77.1585 },
    { name: 'Patel Nagar', type: 'Metro', line: 'Blue Line', lat: 28.6468, lon: 77.1664 },
    { name: 'Rajendra Place', type: 'Metro', line: 'Blue Line', lat: 28.6425, lon: 77.1782 },
    { name: 'Karol Bagh', type: 'Metro', line: 'Blue Line', lat: 28.6442, lon: 77.1885 },
    { name: 'Jhandewalan', type: 'Metro', line: 'Blue Line', lat: 28.6457, lon: 77.1994 },
    { name: 'RK Ashram Marg', type: 'Metro', line: 'Blue Line', lat: 28.6392, lon: 77.2087 },
    // Rajiv Chowk (Shared)
    { name: 'Barakhamba Road', type: 'Metro', line: 'Blue Line', lat: 28.6293, lon: 77.2256 },
    { name: 'Mandi House', type: 'Metro', line: 'Blue Line', lat: 28.6256, lon: 77.2341, isInterchange: true },
    { name: 'Supreme Court', type: 'Metro', line: 'Blue Line', lat: 28.6214, lon: 77.2418 },
    { name: 'Indraprastha', type: 'Metro', line: 'Blue Line', lat: 28.6185, lon: 77.2512 },
    { name: 'Yamuna Bank', type: 'Metro', line: 'Blue Line', lat: 28.6145, lon: 77.2654, isInterchange: true },
    { name: 'Akshardham', type: 'Metro', line: 'Blue Line', lat: 28.6181, lon: 77.2795 },
    { name: 'Mayur Vihar 1', type: 'Metro', line: 'Blue Line', lat: 28.6045, lon: 77.2941, isInterchange: true },
    { name: 'Mayur Vihar Ext', type: 'Metro', line: 'Blue Line', lat: 28.5948, lon: 77.3015 },
    { name: 'New Ashok Nagar', type: 'Metro', line: 'Blue Line', lat: 28.5896, lon: 77.3102 },
    { name: 'Noida Sector 15', type: 'Metro', line: 'Blue Line', lat: 28.5845, lon: 77.3185 },
    { name: 'Noida Sector 16', type: 'Metro', line: 'Blue Line', lat: 28.5789, lon: 77.3234 },
    { name: 'Noida Sector 18', type: 'Metro', line: 'Blue Line', lat: 28.5708, lon: 77.3265 },
    { name: 'Botanical Garden', type: 'Metro', line: 'Blue Line', lat: 28.5642, lon: 77.3341, isInterchange: true },
    { name: 'Golf Course', type: 'Metro', line: 'Blue Line', lat: 28.5671, lon: 77.3468 },
    { name: 'Noida City Centre', type: 'Metro', line: 'Blue Line', lat: 28.5745, lon: 77.3562 },
    { name: 'Noida Electronic City', type: 'Metro', line: 'Blue Line', lat: 28.6218, lon: 77.3734 },

    // --- VIOLET LINE (Partial) ---
    { name: 'ITO', type: 'Metro', line: 'Violet Line', lat: 28.6289, lon: 77.2432 },
    { name: 'Delhi Gate', type: 'Metro', line: 'Violet Line', lat: 28.6397, lon: 77.2408 },
    { name: 'Jama Masjid', type: 'Metro', line: 'Violet Line', lat: 28.6506, lon: 77.2343 },
    { name: 'Red Fort', type: 'Metro', line: 'Violet Line', lat: 28.6575, lon: 77.2384 },
    { name: 'Khan Market', type: 'Metro', line: 'Violet Line', lat: 28.6006, lon: 77.2273 },
    { name: 'Jawaharlal Nehru Stadium', type: 'Metro', line: 'Violet Line', lat: 28.5898, lon: 77.2375 },
    { name: 'Jangpura', type: 'Metro', line: 'Violet Line', lat: 28.5843, lon: 77.2421 },
    { name: 'Lajpat Nagar', type: 'Metro', line: 'Violet Line', lat: 28.5707, lon: 77.2427, isInterchange: true },
    { name: 'Moolchand', type: 'Metro', line: 'Violet Line', lat: 28.5638, lon: 77.2378 },
    { name: 'Kailash Colony', type: 'Metro', line: 'Violet Line', lat: 28.5552, lon: 77.2403 },
    { name: 'Nehru Place', type: 'Metro', line: 'Violet Line', lat: 28.5501, lon: 77.2514 },
    { name: 'Kalkaji Mandir', type: 'Metro', line: 'Violet Line', lat: 28.5476, lon: 77.2589, isInterchange: true },

    // --- BUS STOPS (Sample Routes) ---
    { name: 'Anand Vihar ISBT', type: 'Bus', line: 'Route 534', lat: 28.6469, lon: 77.3164 },
    { name: 'Laxmi Nagar', type: 'Bus', line: 'Route 534', lat: 28.6304, lon: 77.2774 },
    { name: 'Sarai Kale Khan', type: 'Bus', line: 'Route 534', lat: 28.5910, lon: 77.2558 },
    { name: 'Ashram', type: 'Bus', line: 'Route 534', lat: 28.5714, lon: 77.2570 },
    { name: 'Nehru Place Terminal', type: 'Bus', line: 'Route 534', lat: 28.5501, lon: 77.2514 },
    { name: 'Saket Terminal', type: 'Bus', line: 'Route 534', lat: 28.5140, lon: 77.2100 },
    { name: 'Mehrauli', type: 'Bus', line: 'Route 534', lat: 28.5186, lon: 77.1855 },

    // --- TAXI / AUTO STANDS (Generic Nodes) ---
    { name: 'IGI Airport T3', type: 'Taxi', line: 'Airport Express', lat: 28.5562, lon: 77.1000 },
    { name: 'New Delhi Railway Station', type: 'Taxi', line: 'City Taxi', lat: 28.6429, lon: 77.2218 },
    { name: 'Nizamuddin Railway Station', type: 'Auto', line: 'City Auto', lat: 28.5873, lon: 77.2541 }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for Seeding');

        // Clear existing
        await TransportNode.deleteMany({});
        await TransportRoute.deleteMany({});
        console.log('Cleared existing data');

        // 1. Create Nodes
        const nodeMap = {}; // name -> _id

        for (const loc of locations) {
            // Check if node exists (e.g. Interchange stations like Rajiv Chowk appear in both lists conceptually)
            let node = await TransportNode.findOne({ name: loc.name });
            if (!node) {
                node = await TransportNode.create({
                    name: loc.name,
                    type: loc.type,
                    line: loc.line,
                    location: {
                        type: 'Point',
                        coordinates: [loc.lon, loc.lat]
                    },
                    isInterchange: loc.isInterchange || false
                });
            }
            nodeMap[loc.name] = node._id;
        }
        console.log(`Seeded ${Object.keys(nodeMap).length} Transport Nodes`);

        // 2. Create Routes

        // Helper to get array of IDs from names
        const getIds = (names) => names.map(n => nodeMap[n]).filter(id => id);

        // Yellow Line
        const yellowStops = getIds([
            'Samaypur Badli', 'Rohini Sector 18', 'Haiderpur Badli Mor', 'Jahangirpuri', 'Adarsh Nagar', 'Azadpur', 'Model Town', 'GTB Nagar', 'Vishwavidyalaya',
            'Vidhan Sabha', 'Civil Lines', 'Kashmere Gate', 'Chandni Chowk', 'Chawri Bazar', 'New Delhi', 'Rajiv Chowk', 'Patel Chowk', 'Central Secretariat',
            'Udyog Bhawan', 'Lok Kalyan Marg', 'Jor Bagh', 'INA', 'AIIMS', 'Green Park', 'Hauz Khas', 'Malviya Nagar', 'Saket', 'Qutab Minar', 'Chhatarpur',
            'Sultanpur', 'Ghitorni', 'Arjan Garh', 'Guru Dronacharya', 'Sikandarpur', 'MG Road', 'IFFCO Chowk', 'Huda City Centre'
        ]);

        await TransportRoute.create({
            name: 'Yellow Line',
            mode: 'Metro',
            stops: yellowStops,
            color: '#FFD700',
            frequencyMin: 3,
            baseCost: 10,
            costPerKm: 2.5
        });

        // Blue Line
        const blueStops = getIds([
            'Dwarka Sector 21', 'Dwarka Sector 8', 'Dwarka Sector 9', 'Dwarka Sector 10', 'Dwarka Sector 11', 'Dwarka Sector 12',
            'Dwarka Sector 13', 'Dwarka Sector 14', 'Dwarka', 'Dwarka Mor', 'Nawada', 'Uttam Nagar West', 'Uttam Nagar East',
            'Janakpuri West', 'Janakpuri East', 'Tilak Nagar', 'Subhash Nagar', 'Tagore Garden', 'Rajouri Garden', 'Ramesh Nagar',
            'Moti Nagar', 'Kirti Nagar', 'Shadipur', 'Patel Nagar', 'Rajendra Place', 'Karol Bagh', 'Jhandewalan', 'RK Ashram Marg',
            'Rajiv Chowk', 'Barakhamba Road', 'Mandi House', 'Supreme Court', 'Indraprastha', 'Yamuna Bank', 'Akshardham',
            'Mayur Vihar 1', 'Mayur Vihar Ext', 'New Ashok Nagar', 'Noida Sector 15', 'Noida Sector 16', 'Noida Sector 18',
            'Botanical Garden', 'Golf Course', 'Noida City Centre', 'Noida Electronic City'
        ]);

        await TransportRoute.create({
            name: 'Blue Line',
            mode: 'Metro',
            stops: blueStops,
            color: '#0000FF',
            frequencyMin: 4,
            baseCost: 10,
            costPerKm: 2.5
        });

        // Violet Line
        const violetStops = getIds([
            'Kashmere Gate', 'Red Fort', 'Jama Masjid', 'Delhi Gate', 'ITO', 'Mandi House',
            'Janpath', 'Central Secretariat', 'Khan Market', 'Jawaharlal Nehru Stadium', 'Jangpura',
            'Lajpat Nagar', 'Moolchand', 'Kailash Colony', 'Nehru Place', 'Kalkaji Mandir'
        ]);
        // Note: Missing Janpath in nodes list, let's just use what we have
        // Filtered logic above handles missing keys gracefully

        await TransportRoute.create({
            name: 'Violet Line',
            mode: 'Metro',
            stops: violetStops,
            color: '#4B0082',
            frequencyMin: 5,
            baseCost: 10,
            costPerKm: 2.5
        });

        // Bus 534
        const bus534Stops = getIds([
            'Anand Vihar ISBT', 'Laxmi Nagar', 'Sarai Kale Khan', 'Ashram', 'Nehru Place Terminal',
            'Saket Terminal', 'Mehrauli'
        ]);

        await TransportRoute.create({
            name: 'Bus 534',
            mode: 'Bus',
            stops: bus534Stops,
            color: '#FFA500',
            frequencyMin: 15,
            baseCost: 5,
            costPerKm: 1.5
        });

        // --- SPECIAL MODES WITH FARE CHARGES ---

        // Taxi Service (Generic) - Represents a service rather than a physical route
        await TransportRoute.create({
            name: 'City Taxi',
            mode: 'Taxi',
            stops: [], // Available everywhere
            baseCost: 50,
            costPerKm: 15,
            color: '#000000'
        });

        // Auto Service (Generic)
        await TransportRoute.create({
            name: 'City Auto',
            mode: 'Auto',
            stops: [],
            baseCost: 30,
            costPerKm: 10,
            color: '#FFFF00'
        });

        console.log('Transport Routes Created');
        console.log('Seeding Completed Successfully');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
