// routes/homeRoute.js
const express = require('express');
const router = express.Router();
const Home = require('../models/Home');

// @route   GET /api/home
// @desc    Get all home items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const homeItems = await Home.findAll({
      order: [['date', 'DESC']],
    });
    res.json(homeItems);
  } catch (error) {
    console.error('Error fetching home items:', error);
    res.status(500).json({ 
      message: 'Error fetching home items', 
      error: error.message 
    });
  }
});

// @route   GET /api/home/:id
// @desc    Get single home item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const homeItem = await Home.findByPk(req.params.id);
    
    if (!homeItem) {
      return res.status(404).json({ message: 'Home item not found' });
    }
    
    res.json(homeItem);
  } catch (error) {
    console.error('Error fetching home item:', error);
    res.status(500).json({ 
      message: 'Error fetching home item', 
      error: error.message 
    });
  }
});

// @route   POST /api/home
// @desc    Create new home item
// @access  Private (add authentication middleware as needed)
router.post('/', async (req, res) => {
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
      image,
    } = req.body;

    // Basic validation
    if (!title_en || !title_np || !description_en || !description_np) {
      return res.status(400).json({ 
        message: 'Required fields missing: title_en, title_np, description_en, description_np' 
      });
    }

    const newHomeItem = await Home.create({
      title_en,
      title_np,
      subtitle_en,
      subtitle_np,
      tag_en,
      tag_np,
      description_en,
      description_np,
      date,
      image,
    });

    res.status(201).json(newHomeItem);
  } catch (error) {
    console.error('Error creating home item:', error);
    res.status(500).json({ 
      message: 'Error creating home item', 
      error: error.message 
    });
  }
});

// @route   PUT /api/home/:id
// @desc    Update home item
// @access  Private (add authentication middleware as needed)
router.put('/:id', async (req, res) => {
  try {
    const homeItem = await Home.findByPk(req.params.id);
    
    if (!homeItem) {
      return res.status(404).json({ message: 'Home item not found' });
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
      image,
    } = req.body;

    await homeItem.update({
      title_en,
      title_np,
      subtitle_en,
      subtitle_np,
      tag_en,
      tag_np,
      description_en,
      description_np,
      date,
      image,
    });

    res.json(homeItem);
  } catch (error) {
    console.error('Error updating home item:', error);
    res.status(500).json({ 
      message: 'Error updating home item', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/home/:id
// @desc    Delete home item
// @access  Private (add authentication middleware as needed)
router.delete('/:id', async (req, res) => {
  try {
    const homeItem = await Home.findByPk(req.params.id);
    
    if (!homeItem) {
      return res.status(404).json({ message: 'Home item not found' });
    }

    await homeItem.destroy();
    res.json({ message: 'Home item deleted successfully' });
  } catch (error) {
    console.error('Error deleting home item:', error);
    res.status(500).json({ 
      message: 'Error deleting home item', 
      error: error.message 
    });
  }
});

module.exports = router;