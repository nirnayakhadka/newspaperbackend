// Server.js
const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors');
// Import routes

const mainRoutes = require('./src/routes/mainRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const artsandcultureRoutes = require('./src/routes/artsandcultureRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
const interviewRoutes = require('./src/routes/interviewRoutes');
const moreRoutes = require('./src/routes/moreRoutes');
const socialRoutes = require('./src/routes/socialRoutes');
const homeRoutes = require('./src/routes/homeRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const path = require('path');
// Serve static files (images, frontend, etc.)
// app.use(express.static('public'));
// app.use('/main', express.static(path.join(__dirname, 'public/main')));
// app.use('/uploads', express.static('uploads')); // Important: serve uploaded images!
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use('/uploads', express.static('uploads'));
// Only parse JSON for routes that send pure JSON (we'll handle multipart separately in routes)
app.use(express.json()); // You can keep this — but we'll bypass it for file uploads
// Optional: For production, you can be more strict:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('Hello! Newspaper API is running. Database ready.');
});

// Mount routes
app.use('/api/main', mainRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/artsandculture', artsandcultureRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/more', moreRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
// Global error handler (catches invalid JSON gracefully)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next(err);
});

// Start server AFTER database connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: false }); // or { force: false }
    console.log('Models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();