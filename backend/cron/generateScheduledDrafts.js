import cron from 'node-cron';
import User from '../models/User.js';
import { generateGeminiPost } from '../services/geminiService.js';
import Draft from '../models/Draft.js';

cron.schedule('0 9 * * *', async () => {  // Every day at 9am
    const users = await User.find({ generationSchedule: { $ne: null } });

    for (const user of users) {
        const prompt = 'Weekly update in my niche'; // Placeholder or user-defined
        const tone = user.tonePreference || 'Professional';
        const platform = user.preferredPlatforms?.[0] || 'LinkedIn';

        const content = await generateGeminiPost(prompt, tone, platform, user._id);
        await Draft.create({
            user: user._id,
            prompt,
            tone,
            platform,
            content
        });
    }
});
