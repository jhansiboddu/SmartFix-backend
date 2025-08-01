const express = require('express');
const router = express.Router();
const User = require('../models/UserAuth');
const UserProfile = require('../models/UserProfile');
const Technician = require('../models/Technician');
const { v4: uuidv4 } = require('uuid');

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, contact, location, address, name } = req.body;

    if (!email || !password || !role || !contact || !location || !address || !name) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists.' });

    // Generate custom userId
    const prefix = role === 'technician' ? 'T' : role === 'admin' ? 'A' : 'U';
    const userId = `${prefix}${uuidv4().slice(0, 6).toUpperCase()}`;

    // Create User
    const newUser = await User.create({ userId, email, password, role });

    // Create role-specific profile
    if (role === 'user') {
      await UserProfile.create({ userId, name, contact, location, address });
    } else if (role === 'technician') {
      await Technician.create({ userId, name, contact, location, skills: [], assignedTickets: 0 });
    }

    return res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});
// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    // Decide redirect route
    let redirectTo = '/';
    if (user.role === 'user') redirectTo = '/user';
    else if (user.role === 'technician') redirectTo = '/technician';
    else if (user.role === 'admin') redirectTo = '/admin';

    return res.status(200).json({
      message: 'Login successful',
      userId: user.userId,
      role: user.role,
      redirect: redirectTo
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
