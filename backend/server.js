import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import draftRoutes from './routes/draftRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import templateRoutes from './routes/templateRoutes.js';

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not set in environment variables.');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        if (err.message && err.message.includes('authentication failed')) {
            console.error('MongoDB authentication failed. Check your username, password, and connection string.');
            process.exit(1);
        }
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/templates', templateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
