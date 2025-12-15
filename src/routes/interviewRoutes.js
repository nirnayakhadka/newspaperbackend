// src/routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview'); // Correct path: two levels up
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if not exists
const uploadDir = 'public/interviews';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'int-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// GET all interviews (latest first)
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.findAll({
      order: [['date', 'DESC']],
    });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single interview by ID
router.get('/:id', async (req, res) => {
  try {
    const interview = await Interview.findByPk(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create new interview
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : req.body.image;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const data = {
      ...req.body,
      image: imagePath,
    };

    const interview = await Interview.create(data);
    res.status(201).json(interview);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT - Update interview
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const interview = await Interview.findByPk(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const imagePath = req.file ? req.file.path : req.body.image || interview.image;

    const updatedData = {
      ...req.body,
      image: imagePath,
    };

    await interview.update(updatedData);
    res.json(interview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Remove interview
router.delete('/:id', async (req, res) => {
  try {
    const interview = await Interview.findByPk(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    // Optional: delete image file
    if (interview.image && fs.existsSync(interview.image)) {
      fs.unlinkSync(interview.image);
    }

    await interview.destroy();
    res.json({ message: 'Interview deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;