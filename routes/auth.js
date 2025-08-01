const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
// router.post('/register', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ error: 'User already exists' });

//     const newUser = new User({ name, email, password, role });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// });

const UserProfile = require('../models/Userprofile'); // import profile model

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role, address, phone, location } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    // Create auth user
    const newUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();

    // Create user profile
    if (role === 'user') {
      const profile = new UserProfile({
        userId: savedUser._id,
        address,
        phone,
        location
      });
      await profile.save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
