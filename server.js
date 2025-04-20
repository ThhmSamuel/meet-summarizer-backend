// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const audioRoutes = require('./routes/audio');
// const summaryRoutes = require('./routes/summary');

// // Initialize Express
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Routes
// app.use('/api/audio', audioRoutes);
// app.use('/api/summary', summaryRoutes);

// // Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const audioRoutes = require('./routes/audio');
const summaryRoutes = require('./routes/summary');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(logger); // Add logger middleware

// Routes
app.use('/api/audio', audioRoutes);
app.use('/api/summary', summaryRoutes);

// Health check route
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  console.log('Database connection status:', mongoose.connection.readyState);
  res.status(200).json({ 
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});