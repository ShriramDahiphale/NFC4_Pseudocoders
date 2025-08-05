import Schedule from '../models/Schedule.js';

export const schedulePost = async (req, res) => {
    const { draftId, campaignId, scheduledDate } = req.body;
    const schedule = await Schedule.create({
        userId: req.user.id,
        draftId,
        campaignId,
        scheduledDate
    });
    res.status(201).json(schedule);
};

export const getUserSchedule = async (req, res) => {
    const schedule = await Schedule.find({ userId: req.user.id }).populate('draftId');
    res.json(schedule);
};

export const updateSchedule = async (req, res) => {
    const { scheduledDate, status } = req.body;
    const schedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        { scheduledDate, status },
        { new: true }
    );
    res.json(schedule);
};
