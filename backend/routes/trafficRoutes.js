const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to connect Facebook using Pixel ID and Conversion Token
router.post('/api/traffic/connect-facebook', async (req, res) => {
    const { pixelId, conversionToken } = req.body;

    if (!pixelId || !conversionToken) {
        return res.status(400).json({ message: 'Pixel ID and Conversion Token are required' });
    }

    try {
        // Send a test event to verify the connection
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${pixelId}/events`, 
            {
                data: [
                    {
                        event_name: "TestEvent",
                        event_time: Math.floor(Date.now() / 1000),
                        action_source: "website",
                        user_data: {
                            client_ip_address: "127.0.0.1",
                            client_user_agent: "Mozilla/5.0"
                        }
                    }
                ],
                access_token: conversionToken
            }
        );

        res.status(200).json({
            message: 'Facebook connected successfully!',
            pixel_id: pixelId,
            response: response.data
        });

    } catch (error) {
        console.error('Error connecting to Facebook:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Failed to connect to Facebook',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
