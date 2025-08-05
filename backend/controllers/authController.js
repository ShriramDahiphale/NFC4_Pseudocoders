import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    const { name, email, password, preferredPlatforms } = req.body;
    if (!Array.isArray(preferredPlatforms) || preferredPlatforms.length === 0) {
        return res.status(400).json({ message: 'preferredPlatforms is required and must be a non-empty array.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, preferredPlatforms });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        token: generateToken(user._id),
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
        _id: user._id,
        name: user.name,
        token: generateToken(user._id),
    });
};
