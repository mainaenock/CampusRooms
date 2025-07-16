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
    trim: true
  },
  distance: {
    type: Number, // in meters
    required: true
  },
  rent: {
    type: Number,
    required: true
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
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
