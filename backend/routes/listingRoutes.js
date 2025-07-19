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

import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import connectDb from '../config/db.js';

// Landlord: Update a listing
router.put('/:id', protect, updateListing);
import { protect } from '../middlewares/auth.js';
import upload, { uploadToGridFS } from '../middlewares/upload.js';



// Public: Get all listings (with filters)
router.get('/', getListings);

// Landlord: Create a new listing (with image upload)
router.post('/', protect, upload.array('images', 5), uploadToGridFS, createListing);

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

// Serve image from GridFS by file ID
router.get('/image/:id', async (req, res) => {
  try {
    const db = (await mongoose.connection.asPromise()).db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', files[0].contentType || files[0].metadata?.mimetype || 'image/jpeg');
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving image', error: err.message });
  }
});

export default router;
