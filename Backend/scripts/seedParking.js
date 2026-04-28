const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const ParkingSpot = require('../models/ParkingSpot');
const { connectDB } = require('../db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const landmarks = [
    // User Requested
    { name: "AIIMS Main Parking", area: "AIIMS", lat: 28.5650, lon: 77.2075 },
    { name: "IIT Delhi Visitor Parking", area: "Hauz Khas", lat: 28.5450, lon: 77.1926 },
    { name: "Delhi University (North Campus) Parking", area: "North Campus", lat: 28.6904, lon: 77.2072 },
    { name: "Lotus Temple Parking", area: "Kalkaji", lat: 28.5535, lon: 77.2588 },
    { name: "Qutub Minar Complex Parking", area: "Mehrauli", lat: 28.5245, lon: 77.1855 },
    { name: "Red Fort Public Parking", area: "Chandni Chowk", lat: 28.6562, lon: 77.2410 },

    // Major Hubs
    { name: "Connaught Place Inner Circle", area: "Connaught Place", lat: 28.6315, lon: 77.2167 },
    { name: "Connaught Place Outer Circle", area: "Connaught Place", lat: 28.6328, lon: 77.2197 },
    { name: "Shivaji Stadium Metro Parking", area: "Connaught Place", lat: 28.6293, lon: 77.2117 },
    { name: "India Gate Parking", area: "Rajpath", lat: 28.6129, lon: 77.2295 },
    { name: "Khan Market Parking", area: "Khan Market", lat: 28.6003, lon: 77.2270 },
    { name: "Hauz Khas Heritage Parking", area: "Hauz Khas", lat: 28.5494, lon: 77.1936 },
    { name: "Select Citywalk Parking", area: "Saket", lat: 28.5283, lon: 77.2185 },
    { name: "Nehru Place Multi-Level Parking", area: "Nehru Place", lat: 28.5494, lon: 77.2536 },
    { name: "Lajpat Nagar Central Market", area: "Lajpat Nagar", lat: 28.5677, lon: 77.2433 },
    { name: "Sarojini Nagar Market Parking", area: "Sarojini Nagar", lat: 28.5756, lon: 77.1989 },
    { name: "DLF Promenade Parking", area: "Vasant Kunj", lat: 28.5422, lon: 77.1565 },
    { name: "Ambience Mall Vasant Kunj", area: "Vasant Kunj", lat: 28.5408, lon: 77.1549 },
    { name: "Pacific Mall Parking", area: "Subhash Nagar", lat: 28.6424, lon: 77.1055 },
    { name: "Akshardham Temple Parking", area: "Pandav Nagar", lat: 28.6127, lon: 77.2773 },
    { name: "Humayun's Tomb Parking", area: "Nizamuddin", lat: 28.5933, lon: 77.2507 },
    { name: "Lodhi Garden Parking", area: "Lodhi Estate", lat: 28.5931, lon: 77.2227 },
    { name: "Dilli Haat INA", area: "INA", lat: 28.5729, lon: 77.2081 },
    { name: "Janakpuri District Center", area: "Janakpuri", lat: 28.6289, lon: 77.0792 },
    { name: "Unity One Mall", area: "Janakpuri", lat: 28.6219, lon: 77.0878 },
    { name: "Rajouri Garden Metro Parking", area: "Rajouri Garden", lat: 28.6496, lon: 77.1219 },
    { name: "Netaji Subhash Place (NSP)", area: "Pitampura", lat: 28.6936, lon: 77.1519 },
    { name: "Adventure Island Parking", area: "Rohini", lat: 28.7237, lon: 77.1126 },
    { name: "Majnu Ka Tilla Parking", area: "Civil Lines", lat: 28.7029, lon: 77.2298 },
    { name: "Pragati Maidan Gate 1", area: "Pragati Maidan", lat: 28.6143, lon: 77.2444 },
    { name: "Supreme Court Metro Parking", area: "Pragati Maidan", lat: 28.6175, lon: 77.2407 },
    { name: "Bangla Sahib Gurudwara", area: "Connaught Place", lat: 28.6262, lon: 77.2090 },
    { name: "Jama Masjid Gate 2", area: "Chandni Chowk", lat: 28.6507, lon: 77.2334 },
    { name: "Old Delhi Railway Station", area: "Chandni Chowk", lat: 28.6600, lon: 77.2260 },
    { name: "New Delhi Railway Station (Paharganj)", area: "Paharganj", lat: 28.6420, lon: 77.2185 },
    { name: "New Delhi Railway Station (Ajmeri Gate)", area: "Ajmeri Gate", lat: 28.6420, lon: 77.2220 },
    { name: "IGI Airport T3 Parking", area: "Airport", lat: 28.5562, lon: 77.1000 },
    { name: "Aerocity Worldmark", area: "Aerocity", lat: 28.5505, lon: 77.1210 },
    { name: "Dwarka Sector 21 Metro", area: "Dwarka", lat: 28.5524, lon: 77.0583 },
    { name: "Vegas Mall Parking", area: "Dwarka", lat: 28.5772, lon: 77.0423 },
    { name: "South Ex Part 1 Market", area: "South Extension", lat: 28.5682, lon: 77.2230 },
    { name: "South Ex Part 2 Market", area: "South Extension", lat: 28.5662, lon: 77.2210 },
    { name: "Defence Colony Market", area: "Defence Colony", lat: 28.5739, lon: 77.2343 },
    { name: "Greater Kailash 1 (M Block)", area: "Greater Kailash", lat: 28.5516, lon: 77.2413 },
    { name: "Greater Kailash 2 (M Block)", area: "Greater Kailash", lat: 28.5323, lon: 77.2497 },
    { name: "Chanakyapuri Diplomatic Enclave", area: "Chanakyapuri", lat: 28.5975, lon: 77.1865 },
    { name: "Yashwant Place", area: "Chanakyapuri", lat: 28.5839, lon: 77.1950 },
    { name: "Chattarpur Temple", area: "Chattarpur", lat: 28.5037, lon: 77.1812 },
    { name: "Garden of Five Senses", area: "Saket", lat: 28.5134, lon: 77.1969 },
    { name: "Jamia Millia Islamia", area: "Jamia Nagar", lat: 28.5615, lon: 77.2801 },
    { name: "Noida Sector 18 (Centrestage Mall)", area: "Noida", lat: 28.5708, lon: 77.3218 }, // NCR
    { name: "DLF Cyber Hub", area: "Gurgaon", lat: 28.4950, lon: 77.0895 }, // NCR
    { name: "Ambience Mall Gurgaon", area: "Gurgaon", lat: 28.5031, lon: 77.0971 }, // NCR
];

const variants = ["North", "South", "East", "West", "Gate 1", "Gate 2", "Underground", "Multi-level"];
const parkingTypes = ["Public", "Metro", "Mall", "Market", "Private"];
const guaranteedAvailableAreas = new Set(['connaught place', 'nehru place', 'gurgaon']);

const generateRandomSpot = (idx) => {
    // If we run out of unique landmarks, start generating based on them with variations
    let place = landmarks[idx];
    let name = "";

    if (place) {
        name = place.name;
    } else {
        const randomLandmark = landmarks[Math.floor(Math.random() * landmarks.length)];
        const variant = variants[Math.floor(Math.random() * variants.length)];
        const type = parkingTypes[Math.floor(Math.random() * parkingTypes.length)];
        name = `${randomLandmark.area} ${type} Parking ${variant}`;
        place = {
            area: randomLandmark.area,
            lat: randomLandmark.lat + (Math.random() - 0.5) * 0.01, // Slight offset
            lon: randomLandmark.lon + (Math.random() - 0.5) * 0.01
        };
    }

    const totalSlots = Math.floor(Math.random() * 200) + 50;
    let availableSlots = Math.floor(Math.random() * totalSlots);

    // Ensure key requested areas always have visible availability.
    if (guaranteedAvailableAreas.has(String(place.area).toLowerCase())) {
        availableSlots = Math.max(availableSlots, Math.floor(totalSlots * 0.4));
    }
    const hourlyRate = Math.floor(Math.random() * 10) * 10 + 20; // 20, 30, ... 110

    return {
        name: name,
        area: place.area,
        location: {
            type: 'Point',
            coordinates: [place.lon, place.lat]
        },
        totalSlots: totalSlots,
        availableSlots: availableSlots,
        hourlyRate: hourlyRate,
        security: Math.random() > 0.3,
        valetParking: Math.random() > 0.7,
        evCharging: Math.random() > 0.5,
        twoWheeler: Math.random() > 0.1,
        rating: (3 + Math.random() * 2).toFixed(1),
        peakHours: Math.random() > 0.5 ? "9:00 AM - 11:00 AM" : "5:00 PM - 8:00 PM"
    };
};

const seedParking = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected...');

        await ParkingSpot.deleteMany({});
        console.log('Cleared existing parking data.');

        const parkingDocs = [];
        for (let i = 0; i < 200; i++) {
            parkingDocs.push(generateRandomSpot(i));
        }

        await ParkingSpot.insertMany(parkingDocs);
        console.log(`Successfully seeded ${parkingDocs.length} parking spots.`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding parking data:', err);
        process.exit(1);
    }
};

seedParking();
