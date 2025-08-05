import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    tonePreference: {
        type: String,
        enum: ['Witty', 'Professional', 'Inspirational', 'Storytelling', 'Educational'],
        default: 'Professional'
    },
    preferredPlatforms: {
        type: [String],
        validate: [arrayLimit, 'At least one platform is required']
    },
    contentGoals: {
        type: [String],
        default: []
    },
    audience: {
        type: String,
        maxlength: 100,
        default: ''
    },
    pastPosts: {
        type: [String],
        default: [],
        maxlength: 10
    },
    toneProfileSummary: {
        type: String,
        maxlength: 300
    }, generationSchedule: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

function arrayLimit(val) {
    return val.length > 0;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
