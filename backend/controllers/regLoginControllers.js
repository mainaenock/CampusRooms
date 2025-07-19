import User from "../models/registrationModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js'; 
import axios from 'axios';

// Google Sign-In handler
export async function googleSignIn(req, res) {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Google ID token using Google's public API
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      const payload = response.data;
      
      const { email, given_name, family_name, picture, sub } = payload;

      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        // User exists, log them in
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '12h' }
        );

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            email: user.email
          }
        });
      } else {
        // Create new user
        const newUser = await User.create({
          firstName: given_name,
          lastName: family_name,
          email,
          role,
          password: crypto.randomBytes(32).toString('hex'), // Random password for Google users
          googleId: sub,
          profilePicture: picture
        });

        const token = jwt.sign(
          { id: newUser._id, role: newUser.role },
          process.env.JWT_SECRET,
          { expiresIn: '12h' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            name: `${newUser.firstName} ${newUser.lastName}`,
            role: newUser.role,
            email: newUser.email
          }
        });
      }
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError);
      return res.status(401).json({ message: 'Invalid Google token' });
    }
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(500).json({ message: 'Google Sign-In failed' });
  }
}


export async function createUser(req, res) {
  try {
    const { firstName, lastName, role, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      role,
      email,
      password: hashedPassword
    });

    res.status(201).json({ 
      message: 'User created', 
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: `${newUser.firstName} ${newUser.lastName}`,
        role: newUser.role,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('User creating function error:', error);
    res.status(500).json({ message: "Server error while creating user" });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Getting users error:', error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
}



export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}



// Forgot Password

export async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');

  
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  const message = `
    <h2>Password Reset Requested</h2>
    <p>Hello ${user.firstName},</p>
    <p>You requested to reset your password. Click the button below:</p>
    <a href="${resetURL}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>If you didn't request this, just ignore this email.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: message
    });

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({ message: 'Failed to send email' });
  }
}

// Reset Password
export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Generate JWT token
  const jwtToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.status(200).json({
    message: 'Password reset successfully',
    token: jwtToken,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      email: user.email
    }
  });
}