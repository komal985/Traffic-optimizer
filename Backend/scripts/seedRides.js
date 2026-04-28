const mongoose = require('mongoose');
const Ride = require('../models/Ride');
const { connectDB } = require('../db');
require('dotenv').config();

// Delhi locations for realistic data
const delhiLocations = [
    'Connaught Place', 'Karol Bagh', 'Dwarka', 'Rohini', 'Janakpuri',
    'Lajpat Nagar', 'Saket', 'Vasant Kunj', 'Nehru Place', 'Greater Kailash',
    'Hauz Khas', 'Kashmere Gate', 'Chandni Chowk', 'Red Fort', 'India Gate',
    'Rajouri Garden', 'Pitampura', 'Model Town', 'Civil Lines', 'Khan Market',
    'South Extension', 'Defence Colony', 'Green Park', 'Malviya Nagar', 'Kalkaji',
    'Noida Sector 62', 'Cyber City Gurgaon', 'Aerocity', 'IGI Airport', 'Okhla',
    'Mayur Vihar', 'Preet Vihar', 'Laxmi Nagar', 'Anand Vihar', 'Vaishali'
];

const organizations = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM', 'Oracle', 'Adobe'];

const carModels = [
    'Maruti Swift', 'Hyundai Creta', 'Honda City', 'Toyota Innova', 'Maruti Dzire',
    'Hyundai Verna', 'Tata Nexon', 'Mahindra XUV500', 'Kia Seltos', 'MG Hector',
    'Skoda Octavia', 'Volkswagen Polo', 'Renault Kwid', 'Honda Amaze', 'Maruti Baleno'
];

const driverNames = [
    'Rahul Sharma', 'Priya Patel', 'Vikram Singh', 'Ananya Gupta', 'Amit Kumar',
    'Sneha Reddy', 'Arjun Mehta', 'Kavya Nair', 'Rohan Verma', 'Divya Joshi',
    'Karan Malhotra', 'Pooja Sinha', 'Aditya Rao', 'Meera Kapoor', 'Nikhil Agarwal',
    'Riya Sharma', 'Varun Khanna', 'Shruti Das', 'Manish Gupta', 'Tanvi Bhatia'
];

const tagOptions = [
    ['Air Conditioned', 'Music'],
    ['No Smoking', 'Pet Friendly'],
    ['Women Only', 'Verified Driver'],
    ['Premium Ride', 'Air Conditioned'],
    ['Student Friendly', 'Budget'],
    ['Silent Ride', 'No Smoking'],
    ['Music', 'Luggage Space'],
    ['Air Conditioned', 'Verified Driver'],
    ['Pet Friendly', 'Music'],
    ['No Smoking', 'Air Conditioned']
];

const departureTimes = [
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM',
    '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
];

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRide() {
    const pickup = randomElement(delhiLocations);
    let destination = randomElement(delhiLocations);
    while (destination === pickup) {
        destination = randomElement(delhiLocations);
    }

    const driverIndex = Math.floor(Math.random() * driverNames.length);
    const gender = driverIndex % 2 === 0 ? 'men' : 'women';
    const avatarNum = Math.floor(Math.random() * 90) + 1;

    return {
        pickupLocation: pickup,
        destination: destination,
        driver: driverNames[driverIndex],
        avatar: `https://randomuser.me/api/portraits/${gender}/${avatarNum}.jpg`,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
        departureTime: randomElement(departureTimes),
        seatsAvailable: Math.floor(Math.random() * 4) + 1, // 1 to 4
        costPerPerson: Math.floor(Math.random() * 150) + 50, // 50 to 200
        carModel: randomElement(carModels),
        carbonSaved: (Math.random() * 3 + 1).toFixed(1), // 1.0 to 4.0 kg
        tags: randomElement(tagOptions),
        organization: randomElement(organizations),
        rideStatus: 'Ongoing',
        carpoolingPreference: true,
        createdAt: new Date()
    };
}

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Clear existing rides
        await Ride.deleteMany({});
        console.log('🗑️ Cleared existing rides');

        // Generate 50 rides
        const rides = [];
        for (let i = 0; i < 500; i++) {
            rides.push(generateRide());
        }

        // Insert all rides
        await Ride.insertMany(rides);
        console.log(`Seeded ${rides.length} rides successfully!`);

        // Show sample
        console.log('\n📋 Sample rides:');
        const samples = await Ride.find().limit(3);
        samples.forEach((ride, i) => {
            console.log(`\n${i + 1}. ${ride.driver} - ${ride.pickupLocation} → ${ride.destination}`);
            console.log(`   🚗 ${ride.carModel} | ⭐ ${ride.rating} | 💺 ${ride.seatsAvailable} seats | ₹${ride.costPerPerson}/person`);
            console.log(`   🏢 ${ride.organization} | 🏷️ ${ride.tags.join(', ')}`);
        });

        console.log('\n Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error(' Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
