import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
};

export const updateUserPreferences = async (req, res) => {
    const { tonePreference, preferredPlatforms, contentGoals, audience } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { tonePreference, preferredPlatforms, contentGoals, audience },
        { new: true }
    );
    res.json(user);
};
