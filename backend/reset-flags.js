import mongoose from 'mongoose';
import Flag from './models/flagModel.js';
import Listing from './models/listingModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to database');

try {
  // Delete all flags
  await Flag.deleteMany({});
  console.log('All flags deleted');

  // Reset all listing flag counts to 0
  await Listing.updateMany({}, { flagCount: 0 });
  console.log('All listing flag counts reset to 0');

  console.log('Flag system reset completed');
} catch (error) {
  console.error('Reset failed:', error);
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from database');
} 