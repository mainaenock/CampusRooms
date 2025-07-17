import express from 'express';
import { getPaymentRequirement } from '../controllers/adminController.js';
import fetch from 'node-fetch';

const router = express.Router();

// Public endpoint to get payment requirement
router.get('/payment-requirement', getPaymentRequirement);

// Proxy for Nominatim geocoding
router.get('/geocode', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CampusRooms/1.0 (your-email@example.com)'
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Nominatim' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed', details: error.message });
  }
});

export default router; 