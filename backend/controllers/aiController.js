import { generateGeminiPost, rewriteGeminiPost } from '../services/geminiService.js';
import Draft from '../models/Draft.js';

export const generateContent = async (req, res) => {
    const { prompt, tone, platform } = req.body;
    const userId = req.user._id;

    if (!prompt || !tone || !platform) {
        return res.status(400).json({ message: 'Prompt, tone, and platform are required' });
    }

    try {
        const content = await generateGeminiPost(prompt, tone, platform, userId);

        const draft = new Draft({
            user: userId,
            prompt,
            tone,
            platform,
            content,
            reviewed: false,
        });
        await draft.save();

        res.status(200).json({
            content,
            message: 'AI-generated content created and saved as draft',
            draftId: draft._id,
        });
    } catch (error) {
        console.error('Gemini generation failed:', error);
        res.status(500).json({ message: 'AI generation failed' });
    }
};

export const retoneContent = async (req, res) => {
    const { originalContent, newTone } = req.body;

    if (!originalContent || !newTone) {
        return res.status(400).json({ message: 'Original content and new tone are required' });
    }

    try {
        const rewritten = await rewriteGeminiPost(originalContent, newTone);
        res.status(200).json({ rewritten });
    } catch (error) {
        console.error('Tone rewriting failed:', error);
        res.status(500).json({ message: 'Failed to rewrite content' });
    }
};
