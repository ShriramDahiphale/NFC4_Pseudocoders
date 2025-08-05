import express from 'express';
import {
    createCampaign,
    getUserCampaigns,
} from '../controllers/campaignController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, createCampaign);
router.get('/', protect, getUserCampaigns);

export default router;
