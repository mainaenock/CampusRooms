import express from 'express';
const router = express.Router();

import {
  createListing,
  getListings,
  getMyListings,
  payForListing,
  featureListing,
  getListingById,
  updateListing
} from '../controllers/listingController.js';

// Landlord: Update a listing
router.put('/:id', protect, updateListing);
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';



// Public: Get all listings (with filters)
router.get('/', getListings);

// Landlord: Create a new listing (with image upload)
router.post('/', protect, upload.array('images', 5), createListing);

// Landlord: Get own listings
router.get('/my', protect, getMyListings);


// Public: Get a single listing by ID
router.get('/:id', getListingById);

// Landlord: Delete a listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await (await import('../models/listingModel.js')).default.findOne({ _id: req.params.id, landlord: req.user.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error });
  }
});

// Landlord: Pay for a listing
router.post('/:id/pay', protect, payForListing);

// Landlord: Feature a listing
router.post('/:id/feature', protect, featureListing);

export default router;
