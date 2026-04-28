const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ParkingSpot = require('../models/ParkingSpot');

// POST /booking/reserve - Create a new reservation
router.post('/reserve', async (req, res) => {
    try {
        const { parkingSpotId, userName, vehicleNumber, startTime, durationHours } = req.body;

        // Validate inputs
        if (!parkingSpotId || !userName || !vehicleNumber || !startTime || !durationHours) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if spot exists
        const spot = await ParkingSpot.findById(parkingSpotId);
        if (!spot) {
            return res.status(404).json({ error: 'Parking spot not found' });
        }

        if (spot.availableSlots <= 0) {
            return res.status(400).json({ error: 'No slots available at this location' });
        }

        // Calculate times and cost
        const start = new Date(startTime);
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
        const totalAmount = spot.hourlyRate * durationHours;

        // Create booking
        const booking = new Booking({
            parkingSpotId,
            userName,
            vehicleNumber,
            startTime: start,
            endTime: end,
            totalAmount
        });

        await booking.save();

        // Decrement available slots (simple logic for now)
        spot.availableSlots -= 1;
        await spot.save();

        res.status(201).json({
            message: 'Booking confirmed',
            booking,
            spotName: spot.name
        });

    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

module.exports = router;
