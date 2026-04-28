const express = require('express');
const RouteHistory = require('../models/RouteHistory');
const SavedLocation = require('../models/SavedLocation');

const router = express.Router();

// ============ RECENT SEARCHES ============

// GET /navigation/recent - Get recent searches
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const recentSearches = await RouteHistory.find()
            .sort({ searchedAt: -1 })
            .limit(limit)
            .lean();

        // Transform for frontend
        const searches = recentSearches.map(search => ({
            id: search._id.toString(),
            destination: search.destination,
            destinationCoords: search.destinationCoords,
            origin: search.origin,
            mode: search.mode,
            distance: search.distance,
            duration: search.duration,
            searchedAt: search.searchedAt
        }));

        res.json({ searches });
    } catch (error) {
        console.error('Error fetching recent searches:', error);
        res.status(500).json({ error: 'Failed to fetch recent searches', searches: [] });
    }
});

// POST /navigation/recent - Save a search to history
router.post('/recent', async (req, res) => {
    try {
        const { destination, destinationCoords, origin, originCoords, mode, distance, duration } = req.body;

        if (!destination || !destinationCoords) {
            return res.status(400).json({ error: 'Destination and coordinates are required' });
        }

        // Check if same destination was searched recently (within last hour)
        const recentDuplicate = await RouteHistory.findOne({
            destination: destination,
            searchedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
        });

        if (recentDuplicate) {
            // Update timestamp instead of creating duplicate
            recentDuplicate.searchedAt = new Date();
            await recentDuplicate.save();
            return res.json({ success: true, message: 'Search updated' });
        }

        const newSearch = new RouteHistory({
            destination,
            destinationCoords,
            origin: origin || 'Current Location',
            originCoords,
            mode: mode || 'driving',
            distance,
            duration
        });

        await newSearch.save();

        // Keep only last 50 searches
        const count = await RouteHistory.countDocuments();
        if (count > 50) {
            const oldest = await RouteHistory.find().sort({ searchedAt: 1 }).limit(count - 50);
            await RouteHistory.deleteMany({ _id: { $in: oldest.map(s => s._id) } });
        }

        res.status(201).json({ success: true, message: 'Search saved' });
    } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).json({ error: 'Failed to save search' });
    }
});

// DELETE /navigation/recent - Clear all recent searches
router.delete('/recent', async (req, res) => {
    try {
        await RouteHistory.deleteMany({});
        res.json({ success: true, message: 'Search history cleared' });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

// ============ SAVED LOCATIONS ============

// GET /navigation/saved - Get all saved locations
router.get('/saved', async (req, res) => {
    try {
        const locations = await SavedLocation.find()
            .sort({ createdAt: -1 })
            .lean();

        const savedLocations = locations.map(loc => ({
            id: loc._id.toString(),
            name: loc.name,
            address: loc.address,
            coords: loc.coords,
            icon: loc.icon,
            color: loc.color
        }));

        res.json({ locations: savedLocations });
    } catch (error) {
        console.error('Error fetching saved locations:', error);
        res.status(500).json({ error: 'Failed to fetch saved locations', locations: [] });
    }
});

// POST /navigation/saved - Add a new saved location
router.post('/saved', async (req, res) => {
    try {
        const { name, address, coords, icon, color } = req.body;

        if (!name || !address || !coords) {
            return res.status(400).json({ error: 'Name, address, and coordinates are required' });
        }

        // Check for duplicate name
        const existing = await SavedLocation.findOne({ name: name });
        if (existing) {
            return res.status(400).json({ error: 'A location with this name already exists' });
        }

        const newLocation = new SavedLocation({
            name,
            address,
            coords,
            icon: icon || '📍',
            color: color || '#64ffda'
        });

        await newLocation.save();

        res.status(201).json({
            success: true,
            location: {
                id: newLocation._id.toString(),
                name: newLocation.name,
                address: newLocation.address,
                coords: newLocation.coords,
                icon: newLocation.icon,
                color: newLocation.color
            }
        });
    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ error: 'Failed to save location' });
    }
});

// DELETE /navigation/saved/:id - Delete a saved location
router.delete('/saved/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await SavedLocation.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.json({ success: true, message: 'Location deleted' });
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ error: 'Failed to delete location' });
    }
});

// PUT /navigation/saved/:id - Update a saved location
router.put('/saved/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, coords, icon, color } = req.body;

        const location = await SavedLocation.findByIdAndUpdate(
            id,
            { name, address, coords, icon, color },
            { new: true }
        );

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.json({
            success: true,
            location: {
                id: location._id.toString(),
                name: location.name,
                address: location.address,
                coords: location.coords,
                icon: location.icon,
                color: location.color
            }
        });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: 'Failed to update location' });
    }
});

module.exports = router;
