import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        maxlength: 50
    },
    prompt: {
        type: String,
        required: true,
        maxlength: 500
    },
    exampleOutput: {
        type: String,
        maxlength: 1000
    },
    tone: {
        type: String,
        enum: ['Witty', 'Professional', 'Inspirational', 'Storytelling', 'Educational']
    },
    platform: {
        type: String,
        enum: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Template', templateSchema);
