// backend/routes/socialRoutes.js
const express = require('express');
const router = express.Router();
const Social = require('../models/Social');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'public/uploads/social';
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
    cb(null, 'social-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowed.test(file.mimetype);

    if (allowed.test(ext) && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  },
});

// GET all social posts (latest first)
router.get('/', async (req, res) => {
  try {
    const socials = await Social.findAll({
      order: [['publishedAt', 'DESC']],
    });
    res.json(socials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET single social post by ID
router.get('/:id', async (req, res) => {
  try {
    const social = await Social.findByPk(req.params.id);
    if (!social) return res.status(404).json({ error: 'Social post not found' });
    res.json(social);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST - Create social post (image required on create)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imagePath = `/uploads/social/${req.file.filename}`;

    const socialData = {
      badge_en: req.body.badge_en || null,
      badge_np: req.body.badge_np || null,
      title_en: req.body.title_en?.trim(),
      title_np: req.body.title_np?.trim(),
      subtitle_en: req.body.subtitle_en?.trim() || null,
      subtitle_np: req.body.subtitle_np?.trim() || null,
      description_en: req.body.description_en?.trim(),
      description_np: req.body.description_np?.trim(),
      image: imagePath,
      category_en: req.body.category_en?.trim() || null,
      category_np: req.body.category_np?.trim() || null,
      tag_en: req.body.tag_en?.trim() || null,
      tag_np: req.body.tag_np?.trim() || null,
      publishedAt: req.body.publishedAt || new Date(),
    };

    const social = await Social.create(socialData);
    res.status(201).json(social);
  } catch (err) {
    console.error('Create social error:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT - Update social post (image optional – keep old if not sent)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const social = await Social.findByPk(req.params.id);
    if (!social) return res.status(404).json({ error: 'Social post not found' });

    let imagePath = social.image;

    if (req.file) {
      // Delete old image
      const oldPath = 'public' + social.image;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      imagePath = `/uploads/social/${req.file.filename}`;
    }
    // If client sends image as string (rare case), allow it
    else if (req.body.image) {
      imagePath = req.body.image;
    }

    const updatedData = {
      badge_en: req.body.badge_en ?? social.badge_en,
      badge_np: req.body.badge_np ?? social.badge_np,
      title_en: req.body.title_en?.trim() ?? social.title_en,
      title_np: req.body.title_np?.trim() ?? social.title_np,
      subtitle_en: req.body.subtitle_en?.trim() ?? social.subtitle_en,
      subtitle_np: req.body.subtitle_np?.trim() ?? social.subtitle_np,
      description_en: req.body.description_en?.trim() ?? social.description_en,
      description_np: req.body.description_np?.trim() ?? social.description_np,
      image: imagePath,
      category_en: req.body.category_en?.trim() ?? social.category_en,
      category_np: req.body.category_np?.trim() ?? social.category_np,
      tag_en: req.body.tag_en?.trim() ?? social.tag_en,
      tag_np: req.body.tag_np?.trim() ?? social.tag_np,
      publishedAt: req.body.publishedAt || social.publishedAt,
    };

    await social.update(updatedData);
    res.json(social);
  } catch (err) {
    console.error('Update social error:', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Remove social post + image file
router.delete('/:id', async (req, res) => {
  try {
    const social = await Social.findByPk(req.params.id);
    if (!social) return res.status(404).json({ error: 'Social post not found' });

    // Delete image from disk
    if (social.image) {
      const fullPath = 'public' + social.image;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await social.destroy();
    res.json({ message: 'Social post deleted successfully' });
  } catch (err) {
    console.error('Delete social error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;