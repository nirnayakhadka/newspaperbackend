// models/Main.js 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Main = sequelize.define('Main', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // TRANSLATABLE TEXT FIELDS (English & Nepali)
  title_en: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Title in English',
  },
  title_np: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'शीर्षक नेपालीमा',
  },

  subtitle_en: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Subtitle in English',
  },
  subtitle_np: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'उपशीर्षक नेपालीमा',
  },

  tag_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Tag/Category in English (e.g., Politics, Sports)',
  },
  tag_np: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'ट्याग/श्रेणी नेपालीमा',
  },

  description_en: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Full description/content in English',
  },
  description_np: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'पूर्ण विवरण/सामग्री नेपालीमा',
  },

  // NON-TRANSLATABLE FIELDS
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Publication date (YYYY-MM-DD)',
  },

  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Image path or URL (e.g., /uploads/news1.jpg)',
  },

}, {
  tableName: 'main',                 
  timestamps: true,                   // createdAt & updatedAt
  underscored: true,                  // Uses snake_case for auto-generated fields
  charset: 'utf8mb4',                 // Full Unicode support (important for Nepali script)
  collate: 'utf8mb4_unicode_ci',
});

module.exports = Main;