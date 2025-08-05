import express from 'express';
import {
    createDraft,
    updateDraft,
    getDraftsByCampaign,
} from '../controllers/draftController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, createDraft);
router.put('/:id', protect, updateDraft);
router.get('/:campaignId', protect, getDraftsByCampaign);

export default router;
