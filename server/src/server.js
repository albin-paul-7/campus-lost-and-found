const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server/.env or current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (Section 7.4)
// Allows same-origin, onrender.com, custom domains, and localhost
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// API Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const database = dbStateMap[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'healthy',
    database,
    databaseConfigured: !!(process.env.MONGO_URI || process.env.MONGODB_URI)
  });
});

// Mount Resource Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// Serve static React client in production (ICTAK Section 9: Deployment & Hosting)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'online',
      project: 'Campus Lost and Found Portal API',
      version: '1.0.0',
      documentation: '/api/items and /api/auth'
    });
  });
}

// 404 Route Not Found Middleware
app.use(notFound);

// Central Error Handling Middleware (Section 6.3)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Campus Lost & Found API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
