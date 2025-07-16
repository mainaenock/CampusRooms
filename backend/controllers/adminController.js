// Admin: Feature any listing
export async function adminFeatureListing(req, res) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    listing.isFeatured = true;
    await listing.save();
    res.json({ message: 'Listing is now featured by admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Admin failed to feature listing', error });
  }
}
import User from '../models/registrationModel.js';
import Listing from '../models/listingModel.js';

export async function getAdminStats(req, res) {
  try {
    const [totalUsers, totalLandlords, totalStudents, totalListings, paidListings, featuredListings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'landlord' }),
      User.countDocuments({ role: 'student' }),
      Listing.countDocuments(),
      Listing.countDocuments({ paid: true }),
      Listing.countDocuments({ isFeatured: true })
    ]);
    res.json({
      totalUsers,
      totalLandlords,
      totalStudents,
      totalListings,
      paidListings,
      featuredListings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats', error });
  }
}

export async function getRecentListings(req, res) {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }).limit(10).populate('landlord', 'firstName lastName email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent listings', error });
  }
}

export async function getRecentUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent users', error });
  }
}
