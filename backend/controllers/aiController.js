// controllers/aiController.js
import { generatePostWithGemini } from '../utils/gemini.js';

export const generatePost = async (req, res) => {
    try {
        const {
            name,
            industry,
            targetAudience,
            goals,
            tone,
            previousPosts,
        } = req.body;

        if (!name || !industry || !targetAudience || !goals || !tone || !previousPosts) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const post = await generatePostWithGemini({
            name,
            industry,
            targetAudience,
            goals,
            tone,
            previousPosts,
        });

        res.status(200).json({ post });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate post' });
    }
};
