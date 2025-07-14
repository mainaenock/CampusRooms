import express from 'express';
import { createUser, forgotPassword, getUsers, loginUser, resetPassword } from '../controllers/regLoginControllers.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../middlewares/validation.js';
import { validationResult } from 'express-validator';

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
router.get('/', protect, getUsers);
router.post('/login', authLimiter, loginValidation, handleValidation, loginUser);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, handleValidation, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, handleValidation, resetPassword);

export default router;