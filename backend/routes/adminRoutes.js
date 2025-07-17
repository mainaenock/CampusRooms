
import express from 'express';
import { getAdminStats, getRecentListings, getFeaturedListings, getRecentUsers, adminFeatureListing, toggleFeaturedListing, getFlaggedListings, deleteFlaggedListing, deleteAllFlaggedListings, sendWhatsAppNotification, sendBulkWhatsAppNotifications, getAllUsers, getListingsByLandlord, getPaymentRequirement, setPaymentRequirement } from '../controllers/adminController.js';
import { protect } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// All routes are protected and admin-only
router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/recent-listings', protect, isAdmin, getRecentListings);
router.get('/featured-listings', protect, isAdmin, getFeaturedListings);
router.get('/recent-users', protect, isAdmin, getRecentUsers);
router.get('/flagged-listings', protect, isAdmin, getFlaggedListings);
router.get('/all-users', protect, isAdmin, getAllUsers);
router.get('/landlord-listings/:landlordId', protect, isAdmin, getListingsByLandlord);
router.get('/payment-requirement', protect, isAdmin, getPaymentRequirement);
router.post('/payment-requirement', protect, isAdmin, setPaymentRequirement);
router.post('/feature-listing/:id', protect, isAdmin, adminFeatureListing);
router.patch('/toggle-featured/:id', protect, isAdmin, toggleFeaturedListing);
router.delete('/flagged-listing/:listingId', protect, isAdmin, deleteFlaggedListing);
router.delete('/flagged-listings/all', protect, isAdmin, deleteAllFlaggedListings);

// WhatsApp notification routes
router.post('/whatsapp-notify/:listingId', protect, isAdmin, sendWhatsAppNotification);
router.post('/whatsapp-notify-all', protect, isAdmin, sendBulkWhatsAppNotifications);

export default router;
