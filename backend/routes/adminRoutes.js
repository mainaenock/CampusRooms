
import express from 'express';
import { getAdminStats, getRecentListings, getRecentUsers } from '../controllers/adminController.js';
import { protect } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();


// All routes are protected and admin-only
router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/recent-listings', protect, isAdmin, getRecentListings);
router.get('/recent-users', protect, isAdmin, getRecentUsers);

export default router;
