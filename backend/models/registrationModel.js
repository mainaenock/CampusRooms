import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
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
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
    index: true // Added index for fast lookup
  },

  password: {
    type: String,
    required: function() {
      // Password is required only if user is not using Google OAuth
      return !this.googleId;
    }
  },

  googleId: {
    type: String,
    sparse: true, // Allows multiple null values
    index: true
  },

  profilePicture: {
    type: String,
    default: null
  },

  resetPasswordToken: {
    type: String,
    default: null
  },

  resetPasswordExpires: {
    type: Date,
    default: null
  }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
