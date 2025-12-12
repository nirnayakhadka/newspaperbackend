// src/routes/moreRoutes.js
const express = require('express');
const router = express.Router();
const More = require('../models/More'); // Correct path: two levels up
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory (using public/ for easy static serving)
const uploadDir = 'public/more';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'more-' + uniqueSuffix + path.extname(file.originalname));
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

// GET all items (latest first)
router.get('/', async (req, res) => {
  try {
    const items = await More.findAll({
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
    const item = await More.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create new item
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

    const item = await More.create(data);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT - Update item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const item = await More.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const imagePath = req.file ? req.file.path : req.body.image || item.image;

    const updatedData = {
      ...req.body,
      image: imagePath,
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
    const item = await More.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Optional: delete image
    if (item.image && fs.existsSync(item.image)) {
      fs.unlinkSync(item.image);
    }

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;