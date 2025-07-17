import mongoose from 'mongoose';

const flagSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
    index: true
  },
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reason: {
    type: String,
    enum: ['occupied', 'misleading_info', 'fake_listing', 'other'],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
}, { timestamps: true });

// Compound index to prevent duplicate flags from same user on same listing
flagSchema.index({ listing: 1, flaggedBy: 1 }, { unique: true });

const Flag = mongoose.model('Flag', flagSchema);
export default Flag; 