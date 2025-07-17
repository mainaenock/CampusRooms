import mongoose from 'mongoose';
import ChatMessage from '../models/chatMessageModel.js';
import User from '../models/registrationModel.js';
import Listing from '../models/listingModel.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/campusrooms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkChatMessages() {
  try {
    console.log('Checking chat messages in database...\n');

    // Check total messages
    const totalMessages = await ChatMessage.countDocuments();
    console.log(`Total chat messages: ${totalMessages}`);

    if (totalMessages === 0) {
      console.log('No chat messages found in database.');
      return;
    }

    // Get all messages
    const messages = await ChatMessage.find().sort({ timestamp: -1 }).limit(10);
    console.log('\nRecent messages:');
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg.message} (from: ${msg.sender}, to: ${msg.receiver}, listing: ${msg.listingId})`);
    });

    // Check for landlords
    const landlords = await User.find({ role: 'landlord' });
    console.log(`\nTotal landlords: ${landlords.length}`);
    landlords.forEach(landlord => {
      console.log(`- ${landlord.firstName} ${landlord.lastName} (ID: ${landlord._id})`);
    });

    // Check for students
    const students = await User.find({ role: 'student' });
    console.log(`\nTotal students: ${students.length}`);
    students.forEach(student => {
      console.log(`- ${student.firstName} ${student.lastName} (ID: ${student._id})`);
    });

    // Check listings
    const listings = await Listing.find();
    console.log(`\nTotal listings: ${listings.length}`);
    listings.forEach(listing => {
      console.log(`- ${listing.name} (ID: ${listing._id}, Landlord: ${listing.landlord})`);
    });

  } catch (error) {
    console.error('Error checking chat messages:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkChatMessages(); 