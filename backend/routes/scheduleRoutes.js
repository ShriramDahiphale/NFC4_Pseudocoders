import express from 'express';
import {
    schedulePost,
    getUserSchedule,
    updateSchedule,
} from '../controllers/scheduleController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, schedulePost);
router.get('/', protect, getUserSchedule);
router.put('/:id', protect, updateSchedule);

export default router;
