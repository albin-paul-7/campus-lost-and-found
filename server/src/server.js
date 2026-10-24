const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or curl) or if origin is in whitelist
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
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

// Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'Campus Lost and Found Portal API',
    version: '1.0.0',
    documentation: '/api/items and /api/auth'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'healthy'
  });
});

// Mount Resource Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// 404 Route Not Found Middleware
app.use(notFound);

// Central Error Handling Middleware (Section 6.3)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Campus Lost & Found API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
