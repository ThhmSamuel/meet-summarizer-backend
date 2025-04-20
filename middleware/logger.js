/**
 * Logger middleware for debugging API requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logger = (req, res, next) => {
    const start = Date.now();
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    
    // Add a response hook to log the response status
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
      return originalSend.call(this, body);
    };
    
    next();
  };
  
  module.exports = logger;