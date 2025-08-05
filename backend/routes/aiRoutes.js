// routes/aiRoutes.js
import express from 'express';
import { generateContent, retoneContent } from '../controllers/aiController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/generate', protect, generateContent);

router.post('/retone', protect, retoneContent);

export default router;
