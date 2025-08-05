import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema({
    userId: {
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
    aiOutput: {
        type: [String],
        required: true,
        validate: [v => Array.isArray(v) && v.length > 0, 'At least one AI output is required']
    },
    finalVersion: {
        type: String,
        maxlength: 1000
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
