const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const { NotFoundError } = require('./utils/errors');
const ErrorCodes = require('./constants/errorCodes');

const app = express();
const path = require('path');

// Serve the interactive developer testing client
app.get('/test-client', (req, res) => {
  res.sendFile(path.join(__dirname, '../../test-client.html'));
});


app.use(helmet());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// 3. Body parsers
app.use(express.json({ limit: '10kb' })); // Max payload size limits
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Max requests per window per IP
  standardHeaders: true, // Return RateLimit headers
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: ErrorCodes.TOO_MANY_REQUESTS,
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  }
});

// Apply rate limiter to all API endpoints
app.use('/api/', apiLimiter);
app.use('/api/v1', routes);

// 6. Handle unmatched routes (404 Fallback)
app.use((req, res, next) => {
  next(
    new NotFoundError(
      `Cannot find requested route ${req.method} ${req.originalUrl} on this server.`,
      ErrorCodes.RESOURCE_NOT_FOUND
    )
  );
});

// 7. Global central Error handling block
app.use(errorHandler);

module.exports = app;
