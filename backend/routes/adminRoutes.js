
import express from 'express';
import { getAdminStats, getRecentListings, getRecentUsers, adminFeatureListing } from '../controllers/adminController.js';
const router = express.Router();

// Admin: Feature any listing
router.post('/feature-listing/:id', protect, isAdmin, adminFeatureListing);
import { protect } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';



// All routes are protected and admin-only
router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/recent-listings', protect, isAdmin, getRecentListings);
router.get('/recent-users', protect, isAdmin, getRecentUsers);

export default router;
