// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error with timestamp and request details
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
  console.error(`Route: ${req.method} ${req.originalUrl}`);
  if (err.stack) console.error(err.stack);

  // Default error shape
  const error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.type = 'validation';
    error.details = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'JsonWebTokenError') {
    error.status = 401;
    error.type = 'auth';
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    error.status = 400;
    error.type = 'invalid_id';
    error.message = 'Invalid ID format';
  }

  // Add request ID for tracking (if configured)
  if (req.id) {
    error.requestId = req.id;
  }

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'development' && err.stack) {
    error.stack = err.stack;
  }

  res.status(error.status).json({ error });
};

// Handle uncaught exceptions and rejections
const setupErrorLogging = (app) => {
  process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] Uncaught Exception:`);
    console.error(err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[${new Date().toISOString()}] Unhandled Rejection:`);
    console.error(err);
    process.exit(1);
  });

  // Optional: Add request ID middleware
  app.use((req, res, next) => {
    req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    next();
  });
};

export { errorHandler, setupErrorLogging };