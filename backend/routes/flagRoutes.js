import express from 'express';
import { flagListing, getFlagsForListing, getFlaggedListings, updateFlagStatus, checkUserFlag, unflagListing } from '../controllers/flagController.js';
import { protect } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Test route to verify flag routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Flag routes are working' });
});

// Admin: Unflag a listing completely (must come before /:listingId route)
router.delete('/unflag/:listingId', protect, isAdmin, unflagListing);

// Student: Flag a listing
router.post('/:listingId', protect, flagListing);

// Student: Check if user has flagged a listing
router.get('/check/:listingId', protect, checkUserFlag);

// Admin: Get all flags for a specific listing
router.get('/listing/:listingId', protect, isAdmin, getFlagsForListing);

// Admin: Get all flagged listings
router.get('/flagged-listings', protect, isAdmin, getFlaggedListings);

// Admin: Update flag status
router.put('/:flagId/status', protect, isAdmin, updateFlagStatus);

export default router; 