import Draft from '../models/Draft.js';
import { generateGeminiPost } from '../services/geminiService.js';

export const createDraft = async (req, res) => {
    const { campaignId, prompt, aiOutput, tone, platform, content } = req.body;
    const draft = await Draft.create({
        user: req.user._id,
        campaignId,
        prompt,
        aiOutput,
        tone,
        platform,
        content
    });
    res.status(201).json(draft);
};

export const updateDraft = async (req, res) => {
    const { finalVersion, reviewed, posted } = req.body;
    const draft = await Draft.findByIdAndUpdate(
        req.params.id,
        {
            finalVersion,
            reviewed,
            status: reviewed ? 'reviewed' : 'draft',
            ...(typeof posted === 'boolean' ? { posted } : {})
        },
        { new: true }
    );
    res.json(draft);
};

export const getDraftsByCampaign = async (req, res) => {
    const drafts = await Draft.find({
        user: req.user._id,
        campaignId: req.params.campaignId
    }).sort({ createdAt: -1 });
    res.json(drafts);
};

export const createAIDraft = async (req, res) => {
    const { title, tone, targetAudience, scheduledDate, platform, prompt, userEdit, campaignId } = req.body;

    if (!title || !tone || !targetAudience || !scheduledDate || !platform || !prompt) {
        return res.status(400).json({ message: 'All fields are required: title, tone, targetAudience, scheduledDate, platform, prompt.' });
    }

    try {
        // Generate AI content
        const aiContent = await generateGeminiPost(prompt, tone, platform, req.user._id);

        // Use userEdit if provided, else use aiContent
        const finalContent = userEdit && userEdit.trim() ? userEdit : aiContent;

        // Prepare draft data for POST /api/drafts
        const draftData = {
            user: req.user._id,
            campaignId,
            prompt,
            aiOutput: [aiContent],
            tone,
            platform,
            content: finalContent,
            title,
            targetAudience,
            scheduledDate,
            status: 'draft'
        };

        // Save draft using the same logic as POST /api/drafts
        const draft = await Draft.create(draftData);

        res.status(201).json({
            draftId: draft._id,
            aiContent,
            content: finalContent,
            message: 'Draft created with AI-generated content and saved.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate AI draft', error: error.message });
    }
};
