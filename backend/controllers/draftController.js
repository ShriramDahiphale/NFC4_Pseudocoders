import Draft from '../models/Draft.js';

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
    const { finalVersion, reviewed } = req.body;
    const draft = await Draft.findByIdAndUpdate(
        req.params.id,
        { finalVersion, reviewed, status: reviewed ? 'reviewed' : 'draft' },
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
