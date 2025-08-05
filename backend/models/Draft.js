import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    prompt: {
        type: String,
        required: [true, 'Prompt is required'],
        maxlength: 300
    },
    tone: {
        type: String,
        enum: ['Witty', 'Professional', 'Inspirational', 'Storytelling', 'Educational'],
        default: 'Professional'
    },
    platform: {
        type: String,
        enum: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'],
        default: 'LinkedIn'
    },
    content: {
        type: String,
        maxlength: 1000
    },
    aiOutput: {
        type: [String],
        default: []
    },
    finalVersion: {
        type: String,
        maxlength: 1000
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'reviewed'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Draft', draftSchema);
