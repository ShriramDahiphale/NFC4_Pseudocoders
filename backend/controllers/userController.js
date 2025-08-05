// controllers/userController.js
import User from '../models/User.js';

// Onboarding: update user profile after registration
export const updateOnboarding = async (req, res) => {
    const {
        tonePreference,
        preferredPlatforms,
        contentGoals,
        audience,
        pastPosts,
        toneProfileSummary,
        generationSchedule
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.tonePreference = tonePreference;
    user.preferredPlatforms = preferredPlatforms;
    user.contentGoals = contentGoals;
    user.audience = audience;
    user.pastPosts = pastPosts;
    user.toneProfileSummary = toneProfileSummary;
    user.generationSchedule = generationSchedule;
    await user.save();

    res.status(200).json({ message: 'Onboarding updated successfully' });
};

// Get onboarding info for dashboard/profile
export const getOnboarding = async (req, res) => {
    const user = await User.findById(req.user._id).select(
        'name tonePreference preferredPlatforms contentGoals audience pastPosts toneProfileSummary generationSchedule'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
};

// Dashboard profile summary
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select(
        'name email tonePreference preferredPlatforms contentGoals audience toneProfileSummary generationSchedule'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
};

// Update profile/settings
export const updateUserPreferences = async (req, res) => {
    const {
        tonePreference,
        preferredPlatforms,
        contentGoals,
        generationSchedule,
        audience
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (tonePreference) user.tonePreference = tonePreference;
    if (preferredPlatforms) user.preferredPlatforms = preferredPlatforms;
    if (contentGoals) user.contentGoals = contentGoals;
    if (generationSchedule !== undefined) user.generationSchedule = generationSchedule;
    if (audience !== undefined) user.audience = audience;
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
};
