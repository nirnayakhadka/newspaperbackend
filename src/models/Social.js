// backend/models/Social.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Social = sequelize.define('Social', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Badge (e.g., "Trending", "Viral", "Community")
  badge_en: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  badge_np: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  // Title (required in both languages)
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

  // Main image path
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Path to social post image (e.g., /uploads/social-123.jpg)',
  },

  // Category
  category_en: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  category_np: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  // Tags (single tag or main tag)
  tag_en: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  tag_np: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  // Published date
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'published_at', // Maps to column name with underscore
  },

}, {
  tableName: 'social',
  timestamps: true, // Adds createdAt and updatedAt automatically
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',

  // Proper indexes
  indexes: [
    {
      fields: ['published_at'],
    },
    {
      fields: ['category_en'],
    },
    {
      fields: ['tag_en'],
    },
  ],
});

module.exports = Social;