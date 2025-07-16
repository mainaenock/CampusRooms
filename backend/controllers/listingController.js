// Update a listing by ID
export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const landlord = req.user.id;
    const listing = await Listing.findOne({ _id: id, landlord });
    if (!listing) {
      console.error('Listing not found:', id);
      return res.status(404).json({ message: 'Listing not found' });
    }
    Object.assign(listing, req.body);
    try {
      await listing.save();
    } catch (saveError) {
      console.error('Error saving listing:', saveError);
      return res.status(500).json({ message: 'Error saving listing', error: saveError });
    }
    res.json({ message: 'Listing updated', listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Error updating listing', error });
  }
}
// Get a single listing by ID
export async function getListingById(req, res) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error });
  }
}
import Listing from '../models/listingModel.js';

// Create a new listing (landlord only)
export async function createListing(req, res) {
  try {
    const { name, university, distance, rent, depositRequired, amenities, roomType, phoneNumber } = req.body;
    const landlord = req.user.id;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      // fallback for images sent as URLs (optional)
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    const listing = await Listing.create({
      name,
      university,
      distance,
      rent,
      depositRequired,
      amenities,
      roomType,
      phoneNumber,
      occupied: false,
      images,
      landlord,
      paid: false,
      isFeatured: false
    });
    res.status(201).json({ message: 'Listing created. Please pay Ksh 100 to publish.', listing });
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing', error });
  }
}

// Get all listings (public, with filters)
export async function getListings(req, res) {
  try {
    const { university, minRent, maxRent, amenities, featured } = req.query;
    let filter = {};
    if (university) filter.university = { $regex: university, $options: 'i' };
    if (featured) filter.isFeatured = true;
    if (minRent || maxRent) filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
    if (amenities) filter.amenities = { $all: amenities.split(',') };
    const listings = await Listing.find(filter).populate('landlord', 'firstName lastName email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error });
  }
}

// Get landlord's own listings
export async function getMyListings(req, res) {
  try {
    const landlord = req.user.id;
    const listings = await Listing.find({ landlord }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your listings', error });
  }
}

// Simulate payment for listing
export async function payForListing(req, res) {
  try {
    const { id } = req.params;
    const listing = await Listing.findOne({ _id: id, landlord: req.user.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    listing.paid = true;
    await listing.save();
    res.json({ message: 'Listing published! Your house is now visible to students.' });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error });
  }
}

// Simulate feature payment
export async function featureListing(req, res) {
  try {
    const { id } = req.params;
    const listing = await Listing.findOne({ _id: id, landlord: req.user.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.paid) return res.status(400).json({ message: 'Pay for the listing first.' });
    listing.isFeatured = true;
    await listing.save();
    res.json({ message: 'Listing is now featured and will appear at the top and on the landing page.' });
  } catch (error) {
    res.status(500).json({ message: 'Feature payment failed', error });
  }
}
