import Flag from '../models/flagModel.js';
import Listing from '../models/listingModel.js';

// Student: Flag a listing
export async function flagListing(req, res) {
  try {
    const { listingId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user.id;
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user has already flagged this listing
    const existingFlag = await Flag.findOne({ listing: listingId, flaggedBy: userId });
    if (existingFlag) {
      return res.status(400).json({ message: 'You have already flagged this listing' });
    }

    // Create new flag
    const flag = new Flag({
      listing: listingId,
      flaggedBy: userId,
      reason,
      description
    });

    await flag.save();

    // Update listing flag count
    listing.flagCount += 1;
    await listing.save();

    res.status(201).json({ message: 'Listing flagged successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already flagged this listing' });
    }
    res.status(500).json({ message: 'Error flagging listing', error: error.message });
  }
}

// Admin: Get all flags for a listing
export async function getFlagsForListing(req, res) {
  try {
    const { listingId } = req.params;
    
    const flags = await Flag.find({ listing: listingId })
      .populate('flaggedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flags', error: error.message });
  }
}

// Admin: Get all flagged listings with flag counts
export async function getFlaggedListings(req, res) {
  try {
    const listings = await Listing.find({ flagCount: { $gt: 0 } })
      .populate('landlord', 'firstName lastName email')
      .sort({ flagCount: -1, createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flagged listings', error: error.message });
  }
}

// Helper function to check if all flags for a listing are resolved
async function checkAndUpdateListingFlagStatus(listingId) {
  try {
    // Get all flags for this listing
    const flags = await Flag.find({ listing: listingId });
    
    if (flags.length === 0) {
      return; // No flags to check
    }
    
    // Check if all flags are resolved
    const allResolved = flags.every(flag => flag.status === 'resolved');
    
    if (allResolved) { // Update listing flag count to 0 (unflag)
      await Listing.findByIdAndUpdate(listingId, { flagCount: 0 });
    } else {
      // Count unresolved flags and update listing flag count
      const unresolvedCount = flags.filter(flag => flag.status !== 'resolved').length;
      await Listing.findByIdAndUpdate(listingId, { flagCount: unresolvedCount });
    }
  } catch (error) {
    console.error('Error checking and updating listing flag status:', error);
  }
}

// Admin: Update flag status
export async function updateFlagStatus(req, res) {
  try {
    const { flagId } = req.params;
    const { status } = req.body;

    const flag = await Flag.findByIdAndUpdate(
      flagId,
      { status },
      { new: true }
    );

    if (!flag) {
      return res.status(404).json({ message: 'Flag not found' });
    }

    // Check if all flags for this listing are now resolved
    await checkAndUpdateListingFlagStatus(flag.listing);

    res.json(flag);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flag status', error: error.message });
  }
}

// Student: Check if user has flagged a listing
export async function checkUserFlag(req, res) {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const flag = await Flag.findOne({ listing: listingId, flaggedBy: userId });
    
    res.json({ hasFlagged: !!flag });
  } catch (error) {
    res.status(500).json({ message: 'Error checking flag status', error: error.message });
  }
} 