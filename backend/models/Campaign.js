import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Campaign name is required'],
        maxlength: 100,
        trim: true
    },
    platform: {
        type: String,
        enum: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'],
        required: [true, 'Platform is required']
    },
    tone: {
        type: String,
        enum: ['Witty', 'Professional', 'Inspirational', 'Storytelling', 'Educational'],
        default: 'Professional'
    },
    audience: {
        type: String,
        maxlength: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Campaign', campaignSchema);
