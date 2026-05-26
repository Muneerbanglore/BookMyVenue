// Load environment configuration before anything else
require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/config/logger');

// Capture top-level synchronous uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`CRITICAL: Uncaught Exception detected! ${error.message}`, {
    stack: error.stack,
  });
  // Safely terminate process (since process is now in an undefined state)
  process.exit(1);
});


// Initialize Firebase connection
require('./src/config/firebase');


// Bind and listen to HTTP requests
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Application successfully started in '${process.env.NODE_ENV}' mode on port ${PORT}`);
});

// Capture asynchronous unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error(`CRITICAL: Unhandled Promise Rejection detected! ${error.message}`, {
    stack: error.stack,
  });

  // Gracefully terminate the server listener before exiting
  server.close(() => {
    logger.info('HTTP server listener closed.');
    process.exit(1);
  });
});
