import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: false
  },
  gridFsId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload; 