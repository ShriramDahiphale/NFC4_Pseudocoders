import express from 'express';
import {
    getUserProfile,
    updateUserPreferences,
} from '../controllers/userController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.get('/me', protect, getUserProfile);
router.put('/preferences', protect, updateUserPreferences);

export default router;
