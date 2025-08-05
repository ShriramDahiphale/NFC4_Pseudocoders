// services/geminiService.js
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Draft from '../models/Draft.js';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateGeminiPost = async (prompt, tone, platform, userId) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Fetch 2 recent drafts to personalize style
    const pastDrafts = await Draft.find({ user: userId }).sort({ createdAt: -1 }).limit(2);
    const examples = pastDrafts.map((d, i) => `Example ${i + 1}: ${d.content || d.finalVersion || ''}`).join('\n\n');

    const fullPrompt = `
You are a professional social media assistant.

${examples ? `Here are the user's past post styles:\n${examples}\n\n` : ''}

Now write a ${tone} post suitable for ${platform}.
Topic: ${prompt}
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
};

export const rewriteGeminiPost = async (original, newTone) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `Rewrite the following content in a ${newTone} tone:\n\n${original}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
