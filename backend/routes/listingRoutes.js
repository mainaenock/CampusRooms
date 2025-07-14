import express from 'express';

import {
  createListing,
  getListings,
  getMyListings,
  payForListing,
  featureListing
} from '../controllers/listingController.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public: Get all listings (with filters)
router.get('/', getListings);

// Landlord: Create a new listing (with image upload)
router.post('/', protect, upload.array('images', 5), createListing);

// Landlord: Get own listings
router.get('/my', protect, getMyListings);

// Landlord: Pay for a listing
router.post('/:id/pay', protect, payForListing);

// Landlord: Feature a listing
router.post('/:id/feature', protect, featureListing);

export default router;
