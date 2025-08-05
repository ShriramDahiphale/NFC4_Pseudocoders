import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    draftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Draft',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required'],
        validate: {
            validator: function (v) {
                return v > Date.now();
            },
            message: 'Scheduled date must be in the future'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'published'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Schedule', scheduleSchema);
