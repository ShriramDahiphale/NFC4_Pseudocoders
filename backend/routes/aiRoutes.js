// routes/aiRoutes.js
import express from 'express';
import { generatePost } from '../controllers/aiController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/generate', protect, generatePost);

export default router;
