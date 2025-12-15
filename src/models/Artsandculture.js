// src/models/ArtsAndCulture.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const ArtsAndCulture = sequelize.define('ArtsAndCulture', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Main photo/image
  photo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Path to the main image (e.g., uploads/arts/art-123.jpg)',
  },

  // Tag (e.g., "Art", "Festival", "Heritage", "Music", "Dance")
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

  // Published/Event date
  date: {
    type: DataTypes.DATEONLY, // Stores only date (YYYY-MM-DD), no time
    allowNull: false,
    defaultValue: DataTypes.NOW, // Defaults to today
  },

}, {
  tableName: 'arts_and_culture',
  timestamps: true, // Adds createdAt and updatedAt
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',

  indexes: [
    { fields: ['date'] },
    { fields: ['tag_en'] },
  ],
});

module.exports = ArtsAndCulture;