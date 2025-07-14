import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/registrationModel.js';
import bcrypt from 'bcryptjs';

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const email = 'campusroomske@gmail.com';
  const password = 'Engineer001.';
  const firstName = 'Campus';
  const lastName = 'Admin';
  const role = 'admin';

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Existing user promoted to admin.');
    } else {
      console.log('Admin user already exists.');
    }
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    firstName,
    lastName,
    role,
    email,
    password: hashedPassword
  });
  console.log('Admin user created.');
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
