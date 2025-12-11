const { Sequelize } = require('sequelize');
require('dotenv').config();  // Loads .env variables

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT,
    logging: console.log,  // Set to false in production for less noise
    pool: {
      max: 5,      // Maximum connections
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,  // Automatically add createdAt/updatedAt
      underscored: true  // Use snake_case for column names
    }
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;