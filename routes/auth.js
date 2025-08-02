// const express = require('express');
// const router = express.Router();
// const User = require('../models/UserAuth');
// const UserProfile = require('../models/UserProfile');
// const Technician = require('../models/Technician');
// const { v4: uuidv4 } = require('uuid');

// // POST /api/register
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password, role, phone, location, address, name } = req.body;

//     if (!email || !password || !role || !phone || !location || !address || !name) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(409).json({ message: 'User already exists.' });

//     // Generate custom userId
//     const prefix = role === 'technician' ? 'T' : role === 'admin' ? 'A' : 'U';
//     const userId = `${prefix}${uuidv4().slice(0, 6).toUpperCase()}`;

//     // Create User
//     const newUser = await User.create({ userId, email, password, role });

//     // Create role-specific profile
//     if (role === 'user') {
//       await UserProfile.create({ userId, name, phone, location, address });
//     } else if (role === 'technician') {
//       await Technician.create({ userId, name, phone, location, skills: [], assignedTickets: 0 });
//     }

//     return res.status(201).json({ message: 'User registered successfully', userId });
//   } catch (err) {
//     console.error('Registration error:', err);
//     return res.status(500).json({ message: 'Server error during registration' });
//   }
// });
// // POST /api/login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check required fields
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

//     // Decide redirect route
//     let redirectTo = '/';
//     if (user.role === 'user') redirectTo = '/user';
//     else if (user.role === 'technician') redirectTo = '/technician';
//     else if (user.role === 'admin') redirectTo = '/admin';

//     return res.status(200).json({
//       message: 'Login successful',
//       userId: user.userId,
//       role: user.role,
//       redirect: redirectTo
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).json({ message: 'Server error during login' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../models/UserAuth');
// const Technician = require('../models/Technician');
// const bcrypt = require('bcrypt');

// const generateUserId = () => {
//   const digits = Math.floor(1000 + Math.random() * 9000);
//   const letters = Array.from({ length: 2 }, () =>
//     String.fromCharCode(65 + Math.floor(Math.random() * 26))
//   ).join('');
//   return T${digits}${letters};
// };

// // REGISTER
// router.post('/register', async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       role,
//       phone,
//       location,
//       address,
//       skill, // optional
//       age
//     } = req.body;

//     if (!name || !email || !password || !role || !phone || !location || !address || age === undefined) {
//       return res.status(400).json({ message: 'All fields except skill are required' });
//     }

//     if (typeof age !== 'number' || age <= 0) {
//       return res.status(400).json({ message: 'Invalid age' });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'Email already registered' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = generateUserId();

//     const user = new User({
//       userId,
//       name,
//       email,
//       password: hashedPassword, // ✅ Only hash once
//       role,
//       phone,
//       location,
//       address,
//       age
//     });

//     await user.save();

//     if (role === 'technician') {
//       const technician = new Technician({
//         userId,
//         name,
//         contact: phone,
//         location,
//         skill,
//       });
//       await technician.save();
//     }

//     res.status(201).json({ message: 'Registered successfully' });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check required fields
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

//     // Decide redirect route
//     let redirectTo = '/';
//     if (user.role === 'user') redirectTo = '/user';
//     else if (user.role === 'technician') redirectTo = '/technician';
//     else if (user.role === 'admin') redirectTo = '/admin';

//     return res.status(200).json({
//       message: 'Login successful',
//       userId: user.userId,
//       role: user.role,
//       redirect: redirectTo
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).json({ message: 'Server error during login' });
//   }
// });
// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/UserAuth');
const Technician = require('../models/Technician');
const bcrypt = require('bcrypt');

const generateUserId = () => {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  return `T${digits}${letters}`;
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      location,
      address,
      skill,
      age
    } = req.body;

    if (!name || !email || !password || !role || !phone || !location || !address || age === undefined) {
      return res.status(400).json({ message: 'All fields except skill are required' });
    }

    if (typeof age !== 'number' || age <= 0) {
      return res.status(400).json({ message: 'Invalid age' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const userId = generateUserId();

    const user = new User({
      userId,
      name,
      email,
      password, // 👉 store plain-text password
      role,
      phone,
      location,
      address,
      age
    });

    await user.save();

    if (role === 'technician') {
      const technician = new Technician({
        userId,
        name,
        contact: phone,
        location,
        skill,
      });
      await technician.save();
    }

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('LOGIN REQUEST:', email, password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ Use bcrypt here
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    console.log('Login successful');
    return res.status(200).json({
      message: 'Login successful',
      userId: user.userId,
      role: user.role,
      redirect: '/user'
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});
module.exports = router;