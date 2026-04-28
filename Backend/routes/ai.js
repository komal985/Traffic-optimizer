const express = require('express');
const axios = require('axios');
const router = express.Router();

// Define a route to get predictions from DeepSeek
router.post('/predict', async (req, res) => {
    try {
        const { input } = req.body;
        if (!input) {
            return res.status(400).json({ error: 'Input is required' });
        }

        // Make a request to the local Ollama API
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "deepseek", // Use the correct DeepSeek model
            prompt: input,
        });

        // Extract prediction from response
        const prediction = response.data.response;

        res.json({ prediction });
    } catch (error) {
        console.error('Error getting prediction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
