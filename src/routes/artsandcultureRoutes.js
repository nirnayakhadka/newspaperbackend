// src/routes/artsandcultureRoutes.js
const express = require('express');
const router = express.Router();
const ArtsAndCulture = require('../models/Artsandculture');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/arts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'art-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
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

// GET all arts & culture items (latest first)
router.get('/', async (req, res) => {
  try {
    const items = await ArtsAndCulture.findAll({
      order: [['date', 'DESC']],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await ArtsAndCulture.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create new arts & culture entry
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const photoPath = req.file ? req.file.path : req.body.photo;

    if (!photoPath) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    const data = {
      ...req.body,
      photo: photoPath,
    };

    const item = await ArtsAndCulture.create(data);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT - Update item
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const item = await ArtsAndCulture.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const photoPath = req.file ? req.file.path : req.body.photo || item.photo;

    const updatedData = {
      ...req.body,
      photo: photoPath,
    };

    await item.update(updatedData);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Remove item
router.delete('/:id', async (req, res) => {
  try {
    const item = await ArtsAndCulture.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Optional: delete photo from disk
    if (item.photo && fs.existsSync(item.photo)) {
      fs.unlinkSync(item.photo);
    }

    await item.destroy();
    res.json({ message: 'Arts & Culture item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;