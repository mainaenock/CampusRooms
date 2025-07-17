import User from '../models/registrationModel.js';
import Listing from '../models/listingModel.js';
import Flag from '../models/flagModel.js';
import Settings from '../models/settingsModel.js';

// Admin: Toggle featured status of a listing
export async function toggleFeaturedListing(req, res) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    
    listing.isFeatured = !listing.isFeatured;
    await listing.save();
    
    const status = listing.isFeatured ? 'featured' : 'unfeatured';
    res.json({ 
      message: `Listing is now ${status} by admin.`,
      isFeatured: listing.isFeatured
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin failed to toggle featured status', error });
  }
}

// Admin: Feature any listing (legacy function - kept for backward compatibility)
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

export async function getAdminStats(req, res) {
  try {
    const [totalUsers, totalLandlords, totalStudents, totalListings, paidListings, featuredListings, flaggedListings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'landlord' }),
      User.countDocuments({ role: 'student' }),
      Listing.countDocuments(),
      Listing.countDocuments({ paid: true }),
      Listing.countDocuments({ isFeatured: true }),
      Listing.countDocuments({ flagCount: { $gt: 0 } })
    ]);
    res.json({
      totalUsers,
      totalLandlords,
      totalStudents,
      totalListings,
      paidListings,
      featuredListings,
      flaggedListings
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

export async function getFeaturedListings(req, res) {
  try {
    const listings = await Listing.find({ isFeatured: true })
      .populate('landlord', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured listings', error });
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

export async function getFlaggedListings(req, res) {
  try {
    const listings = await Listing.find({ flagCount: { $gt: 0 } })
      .populate('landlord', 'firstName lastName email')
      .sort({ flagCount: -1, createdAt: -1 });
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flagged listings', error });
  }
}

// Admin: Delete a flagged listing
export async function deleteFlaggedListing(req, res) {
  try {
    const { listingId } = req.params;
    
    // Check if listing exists and has flags
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.flagCount === 0) {
      return res.status(400).json({ message: 'This listing has no flags' });
    }
    
    // Delete all flags associated with this listing
    await Flag.deleteMany({ listing: listingId });
    console.log(`Deleted flags for listing: ${listingId}`);
    
    // Delete the listing
    await Listing.findByIdAndDelete(listingId);
    console.log(`Deleted flagged listing: ${listingId}`);
    
    res.json({ message: 'Flagged listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting flagged listing:', error);
    res.status(500).json({ message: 'Error deleting flagged listing', error: error.message });
  }
}

// Admin: Delete all flagged listings
export async function deleteAllFlaggedListings(req, res) {
  try {
    // Get all flagged listings
    const flaggedListings = await Listing.find({ flagCount: { $gt: 0 } });
    
    if (flaggedListings.length === 0) {
      return res.status(400).json({ message: 'No flagged listings found' });
    }
    
    const listingIds = flaggedListings.map(listing => listing._id);
    
    // Delete all flags associated with these listings
    await Flag.deleteMany({ listing: { $in: listingIds } });
    console.log(`Deleted flags for ${listingIds.length} listings`);
    
    // Delete all flagged listings
    await Listing.deleteMany({ _id: { $in: listingIds } });
    console.log(`Deleted ${listingIds.length} flagged listings`);
    
    res.json({ 
      message: `Successfully deleted ${listingIds.length} flagged listings`,
      deletedCount: listingIds.length
    });
  } catch (error) {
    console.error('Error deleting all flagged listings:', error);
    res.status(500).json({ message: 'Error deleting all flagged listings', error: error.message });
  }
}

// Send WhatsApp notification to landlord when property is flagged
export async function sendWhatsAppNotification(req, res) {
  try {
    const { listingId } = req.params;
    
    // Get the listing with landlord info
    const listing = await Listing.findById(listingId).populate('landlord', 'firstName lastName phoneNumber');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    
    // Get flag details
    const flags = await Flag.find({ listing: listingId }).populate('flaggedBy', 'firstName lastName');
    if (flags.length === 0) return res.status(400).json({ message: 'No flags found for this listing' });
    
    // Format phone number for WhatsApp (remove + and add country code if needed)
    let phoneNumber = listing.phoneNumber;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.substring(1); // Convert Kenyan number format
    }
    if (!phoneNumber.startsWith('254')) {
      phoneNumber = '254' + phoneNumber; // Add Kenya country code
    }
    
    // Create WhatsApp message
    const flagReasons = flags.map(flag => flag.reason).join(', ');
    const message = `Jambo ${listing.landlord.firstName},

Your property: (${listing.name}) has been flagged by students on CampusRooms.
Flag Reasons: ${flagReasons}
Total Flags: ${flags.length}
Please review your listing and make necessary updates. You can log in to your dashboard to see the details.

Best regards,
CampusRooms Team`;

    // Create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    res.json({ 
      message: 'WhatsApp notification prepared',
      whatsappUrl,
      phoneNumber,
      landlordName: `${listing.landlord.firstName} ${listing.landlord.lastName}`,
      listingName: listing.name,
      flagCount: flags.length
    });
    
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    res.status(500).json({ message: 'Error sending WhatsApp notification', error: error.message });
  }
}

// Send WhatsApp notification to all flagged landlords
export async function sendBulkWhatsAppNotifications(req, res) {
  try {
    // Get all flagged listings
    const flaggedListings = await Listing.find({ flagCount: { $gt: 0 } })
      .populate('landlord', 'firstName lastName phoneNumber');
    
    if (flaggedListings.length === 0) return res.status(400).json({ message: 'No flagged listings found' });
    
    const notifications = [];
    for (const listing of flaggedListings) {
      const flags = await Flag.find({ listing: listing._id });
      
      // Format phone number
      let phoneNumber = listing.phoneNumber;
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '254' + phoneNumber.substring(1);
      }
      if (!phoneNumber.startsWith('254')) {
        phoneNumber = '254' + phoneNumber;
      }
      
      // Create message
      const message = `Hello ${listing.landlord.firstName} ${listing.landlord.lastName},

Your property${listing.name} has been flagged by students on CampusRooms.

Total Flags: ${flags.length}

Please review your listing and make necessary updates. You can log in to your dashboard to see the details.

Best regards,
CampusRooms Team`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      notifications.push({
        listingId: listing._id,
        listingName: listing.name,
        landlordName: `${listing.landlord.firstName} ${listing.landlord.lastName}`,
        phoneNumber,
        whatsappUrl,
        flagCount: flags.length
      });
    }
    
    res.json({ 
      message: `Prepared ${notifications.length} WhatsApp notifications`,
      notifications
    });
    
  } catch (error) {
    console.error('Error sending bulk WhatsApp notifications:', error);
    res.status(500).json({ message: 'Error sending bulk WhatsApp notifications', error: error.message });
  }
}

// Admin: Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
}

// Admin: Get all listings by landlord
export async function getListingsByLandlord(req, res) {
  try {
    const { landlordId } = req.params;
    const listings = await Listing.find({ landlord: landlordId }).populate('landlord', 'firstName lastName email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listings for landlord', error });
  }
}

// Admin: Get payment requirement setting
export async function getPaymentRequirement(req, res) {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ requirePaymentForListing: true });
    }
    res.json({ requirePaymentForListing: settings.requirePaymentForListing });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment requirement', error });
  }
}

// Admin: Update payment requirement setting
export async function setPaymentRequirement(req, res) {
  try {
    const { requirePaymentForListing } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ requirePaymentForListing });
    } else {
      settings.requirePaymentForListing = requirePaymentForListing;
      await settings.save();
    }
    res.json({ requirePaymentForListing: settings.requirePaymentForListing });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment requirement', error });
  }
}
