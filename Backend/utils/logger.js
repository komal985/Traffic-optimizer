const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  };
  
  const logError = (err) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${err.stack}`);
  };
  
  module.exports = { logRequest, logError };