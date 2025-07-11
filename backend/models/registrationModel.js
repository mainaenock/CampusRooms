import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address']
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
 