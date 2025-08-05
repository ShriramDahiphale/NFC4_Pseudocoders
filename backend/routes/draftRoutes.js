import express from 'express';
import {
    createDraft,
    updateDraft,
    getDraftsByCampaign,
    createAIDraft
} from '../controllers/draftController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, createDraft);
router.put('/:id', protect, updateDraft);
router.get('/:campaignId', protect, getDraftsByCampaign);
router.post('/create-ai-draft', protect, createAIDraft);

export default router;
