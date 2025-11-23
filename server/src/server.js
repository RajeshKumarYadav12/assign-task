require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const keys = require('./config/keys');

// Connect to database
connectDB();

// Start server
const PORT = keys.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${keys.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.error(`❌ Error: ${err.message}`);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  console.error(`❌ Error: ${err.message}`);
  
  // Exit process
  process.exit(1);
});

module.exports = server;
