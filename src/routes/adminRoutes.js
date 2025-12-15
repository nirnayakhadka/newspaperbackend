const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const Admin = require('../models/Admin');

const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// POST /api/admin/login - LOGIN ROUTE (NO AUTH REQUIRED)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await Admin.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/users - CREATE USER (AUTH + ADMIN REQUIRED)
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    // Check for existing user
    const existingUser = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this username or email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password || Math.random().toString(36).slice(2),
      10
    );

    // Create new user
    const newUser = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;