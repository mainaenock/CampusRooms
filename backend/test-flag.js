import mongoose from 'mongoose';
import Flag from './models/flagModel.js';
import Listing from './models/listingModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to database');

// Test flag creation
try {
  // Get a sample listing
  const listing = await Listing.findOne();
  if (!listing) {
    console.log('No listings found in database');
    process.exit(1);
  }

  console.log('Testing with listing:', listing.name);

  // Create a test flag
  const testFlag = new Flag({
    listing: listing._id,
    flaggedBy: '507f1f77bcf86cd799439011', // Sample ObjectId
    reason: 'occupied',
    description: 'Test flag'
  });

  await testFlag.save();
  console.log('Test flag created successfully');

  // Update listing flag count
  listing.flagCount += 1;
  await listing.save();
  console.log('Listing flag count updated:', listing.flagCount);

  // Check if flag exists
  const foundFlag = await Flag.findOne({ listing: listing._id });
  console.log('Flag found:', !!foundFlag);

  // Get flagged listings
  const flaggedListings = await Listing.find({ flagCount: { $gt: 0 } });
  console.log('Flagged listings count:', flaggedListings.length);

  // Clean up test data
  await Flag.deleteOne({ _id: testFlag._id });
  listing.flagCount = Math.max(0, listing.flagCount - 1);
  await listing.save();
  console.log('Test data cleaned up');

} catch (error) {
  console.error('Test failed:', error);
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from database');
} 