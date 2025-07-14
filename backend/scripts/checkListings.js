import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Listing from '../models/listingModel.js';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const listings = await Listing.find();
  console.log('Listings:', listings);
  await mongoose.disconnect();
}

main().catch(console.error);
