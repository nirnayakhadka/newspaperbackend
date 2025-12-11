// src/models/Interview.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Main image (photo of interviewee or related)
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Path to interview image (e.g., uploads/interviews/int-123.jpg)',
  },

  // Interview date
  date: {
    type: DataTypes.DATEONLY, // YYYY-MM-DD only
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  // Tag (e.g., "Politics", "Entertainment", "Sports", "Business")
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

  // Full description / interview content
  description_en: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  description_np: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },

}, {
  tableName: 'interviews',
  timestamps: true, // createdAt & updatedAt
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',

  indexes: [
    { fields: ['date'] },
    { fields: ['tag_en'] },
  ],
});

module.exports = Interview;