// utils/gemini.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_KEY;

export const generatePostWithGemini = async (payload) => {
    const { name, industry, targetAudience, goals, tone, previousPosts } = payload;

    const prompt = `
You are a social media expert. Write a compelling post based on:
- Name: ${name}
- Industry: ${industry}
- Target Audience: ${targetAudience}
- Goals: ${goals}
- Tone: ${tone}
- Previous Posts: ${previousPosts.join('\n\n')}

Respond with only the generated post content.
`;

    const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        {
            contents: [{ parts: [{ text: prompt }] }],
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                key: GEMINI_API_KEY,
            },
        }
    );

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return aiText;
};
