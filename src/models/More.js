// src/models/More.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const More = sequelize.define('More', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Main image
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Path to the main image (e.g., public/more/more-123.jpg)',
  },

  // Date (e.g., publication date)
  date: {
    type: DataTypes.DATEONLY, // YYYY-MM-DD
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  // Tag (e.g., "Lifestyle", "Travel", "Food", "Environment")
  tag_en: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tag_np: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  // Title (bilingual)
  title_en: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  title_np: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },

  // Subtitle (optional)
  subtitle_en: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  subtitle_np: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  // Full description/content
  description_en: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  description_np: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },

}, {
  tableName: 'more',
  timestamps: true, // Adds createdAt & updatedAt automatically
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',

  indexes: [
    { fields: ['date'] },
    { fields: ['tag_en'] },
  ],
});

module.exports = More;