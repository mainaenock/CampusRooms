import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  roomType: {
    type: String,
    enum: ['bed-sitter', 'single room', 'one bedroom', 'two bedroom'],
    required: true
  },
  university: {
    type: String,
    required: true,
    trim: true,
    index: true // Added index for fast university search
  },
  distance: {
    type: Number, // in meters
    required: true
  },
  rent: {
    type: Number,
    required: true,
    index: true // Added index for fast rent queries
  },
  depositRequired: {
    type: Boolean,
    default: false
  },
  amenities: [{
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String // URLs or file paths
  }],
  phoneNumber: {
    type: String,
    required: true
  },
  occupied: {
    type: Boolean,
    default: false
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Added index for fast landlord queries
  },
  paid: {
    type: Boolean,
    default: false
  },
  flagCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Compound index for university and rent
listingSchema.index({ university: 1, rent: 1 });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
