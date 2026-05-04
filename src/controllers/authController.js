// Auth Controller — Register, Login, Get Profile
const bcrypt = require('bcryptjs');
const { Users } = require('../services/storage');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        // Check if user already exists
        const existing = Users.findByEmail(email.toLowerCase());
        if (existing) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = Users.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = Users.findByEmail(email.toLowerCase());
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
    try {
        const user = Users.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
};

module.exports = { register, login, getProfile };
