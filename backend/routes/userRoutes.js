import express from 'express';
import {
    updateOnboarding,
    getOnboarding,
    getUserProfile,
    updateUserPreferences,
} from '../controllers/userController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// Onboarding endpoints
router.put('/onboarding', protect, updateOnboarding);
router.get('/onboarding', protect, getOnboarding);

// Profile endpoints
router.get('/me', protect, getUserProfile);
router.put('/preferences', protect, updateUserPreferences);

export default router;
