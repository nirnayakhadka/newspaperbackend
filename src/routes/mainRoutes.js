// routes/mainRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Main = require('../models/Main');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/main');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration - Accept ANY file type and NO size limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to public/main/
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random suffix + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'main-' + uniqueSuffix + ext);
  }
});

// No file filter and no size limit
const upload = multer({
  storage: storage,
  // Remove limits and fileFilter to allow all formats and any size
  limits: {}, // Empty limits object = no restrictions
});


// GET: Fetch all articles (latest first)
router.get('/', async (req, res) => {
  try {
    const mains = await Main.findAll({
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });
    res.status(200).json(mains);
  } catch (error) {
    console.error('Error fetching mains:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Fetch single article by ID
router.get('/:id', async (req, res) => {
  try {
    const main = await Main.findByPk(req.params.id);
    if (!main) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(main);
  } catch (error) {
    console.error('Error fetching main:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Create a new article with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title_en,
      title_np,
      subtitle_en,
      subtitle_np,
      tag_en,
      tag_np,
      description_en,
      description_np,
      date,
    } = req.body;

    // Basic validation
    if (!title_en || !title_np || !description_en || !description_np) {
      return res.status(400).json({ message: 'English and Nepali title & description are required' });
    }

    // Get image path if uploaded
    const image = req.file ? `/main/${req.file.filename}` : null;

    const newMain = await Main.create({
      title_en,
      title_np,
      subtitle_en: subtitle_en || null,
      subtitle_np: subtitle_np || null,
      tag_en: tag_en || null,
      tag_np: tag_np || null,
      description_en,
      description_np,
      date: date || new Date(),
      image,
    });

    res.status(201).json({
      message: 'Article created successfully',
      data: newMain,
    });
  } catch (error) {
    console.error('Error creating main:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Update an existing article (with optional image update)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const main = await Main.findByPk(req.params.id);
    if (!main) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const {
      title_en,
      title_np,
      subtitle_en,
      subtitle_np,
      tag_en,
      tag_np,
      description_en,
      description_np,
      date,
    } = req.body;

    // If new image uploaded, use it; otherwise keep old one
    const image = req.file ? `/main/${req.file.filename}` : main.image;

    // Optional: Delete old image if new one is uploaded
    if (req.file && main.image) {
      const oldImagePath = path.join(__dirname, '../public', main.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await main.update({
      title_en: title_en !== undefined ? title_en : main.title_en,
      title_np: title_np !== undefined ? title_np : main.title_np,
      subtitle_en: subtitle_en !== undefined ? subtitle_en : main.subtitle_en,
      subtitle_np: subtitle_np !== undefined ? subtitle_np : main.subtitle_np,
      tag_en: tag_en !== undefined ? tag_en : main.tag_en,
      tag_np: tag_np !== undefined ? tag_np : main.tag_np,
      description_en: description_en !== undefined ? description_en : main.description_en,
      description_np: description_np !== undefined ? description_np : main.description_np,
      date: date !== undefined ? date : main.date,
      image,
    });

    // Reload to get updated data
    await main.reload();

    res.status(200).json({
      message: 'Article updated successfully',
      data: main,
    });
  } catch (error) {
    console.error('Error updating main:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Delete an article by ID (also delete image file)
router.delete('/:id', async (req, res) => {
  try {
    const main = await Main.findByPk(req.params.id);
    if (!main) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Delete associated image file
    if (main.image) {
      const imagePath = path.join(__dirname, '../public', main.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await main.destroy();
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting main:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;