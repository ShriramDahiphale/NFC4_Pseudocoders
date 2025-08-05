import Schedule from '../models/Schedule.js';
import Draft from '../models/Draft.js';

export const schedulePost = async (req, res) => {
    const { draftId, campaignId, scheduleTime } = req.body;

    if (!draftId || !campaignId || !scheduleTime) {
        return res.status(400).json({ message: 'draftId, campaignId, and scheduleTime are required.' });
    }

    // Create schedule entry
    const schedule = await Schedule.create({
        userId: req.user.id,
        draftId,
        campaignId,
        scheduledDate: scheduleTime
    });

    // Update the draft's scheduledDate field
    await Draft.findByIdAndUpdate(draftId, { scheduledDate: scheduleTime });

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

    // If status is published, mark the draft as posted
    if (status === 'published' && schedule?.draftId) {
        await Draft.findByIdAndUpdate(schedule.draftId, { posted: true });
    }

    res.json(schedule);
};
