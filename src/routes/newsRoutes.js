// src/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/news';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowed.test(file.mimetype);
    if (allowed.test(ext) && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// GET all news
router.get('/', async (req, res) => {
  try {
    const news = await News.findAll({
      order: [['publishedAt', 'DESC']],
    });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create news (supports both with and without image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // req.body is already parsed by multer for form-data
    // If no file, client can send image as string (path)
    const imagePath = req.file ? req.file.path : req.body.image;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const newsData = {
      ...req.body,
      image: imagePath,
    };

    const news = await News.create(newsData);
    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT - Update news
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });

    const imagePath = req.file ? req.file.path : req.body.image || news.image;

    const updatedData = {
      ...req.body,
      image: imagePath,
    };

    await news.update(updatedData);
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });

    // Optional: delete image file from disk
    if (news.image && fs.existsSync(news.image)) {
      fs.unlinkSync(news.image);
    }

    await news.destroy();
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;