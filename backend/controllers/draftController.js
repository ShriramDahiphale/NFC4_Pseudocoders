import Draft from '../models/Draft.js';

export const createDraft = async (req, res) => {
    const { campaignId, prompt, aiOutput } = req.body;
    const draft = await Draft.create({
        userId: req.user.id,
        campaignId,
        prompt,
        aiOutput
    });
    res.status(201).json(draft);
};

export const updateDraft = async (req, res) => {
    const { finalVersion } = req.body;
    const draft = await Draft.findByIdAndUpdate(
        req.params.id,
        { finalVersion, status: 'reviewed' },
        { new: true }
    );
    res.json(draft);
};

export const getDraftsByCampaign = async (req, res) => {
    const drafts = await Draft.find({
        userId: req.user.id,
        campaignId: req.params.campaignId
    }).sort({ createdAt: -1 });
    res.json(drafts);
};
