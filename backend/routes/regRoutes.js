import express from 'express';
import { createUser, forgotPassword, getUsers, loginUser, resetPassword, googleSignIn } from '../controllers/regLoginControllers.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../middlewares/validation.js';
import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// Helper middleware to handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', registerValidation, handleValidation, createUser);
router.post('/google', authLimiter, googleSignIn); // Google Sign-In route
router.get('/', protect, getUsers);
router.post('/login', authLimiter, loginValidation, handleValidation, loginUser);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, handleValidation, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, handleValidation, resetPassword);

// Test email endpoint (remove in production)
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    await sendEmail({
      to: email,
      subject: 'Test Email from CampusRooms',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
    });
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
});

export default router;