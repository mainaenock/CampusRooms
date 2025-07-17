import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  requirePaymentForListing: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings; 