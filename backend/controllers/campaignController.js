import Campaign from '../models/Campaign.js';

export const createCampaign = async (req, res) => {
    const { name, platform, tone, audience } = req.body;
    const campaign = await Campaign.create({
        userId: req.user.id,
        name,
        platform,
        tone,
        audience
    });
    res.status(201).json(campaign);
};

export const getUserCampaigns = async (req, res) => {
    const campaigns = await Campaign.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(campaigns);
};
