const axios = require('axios');

// Replace with your actual Bearer token if required
const AUTH_TOKEN = '<YOUR_BEARER_TOKEN_HERE>';
const LOGGING_URL = 'http://20.244.56.144/evaluation-service/logs';

const logger = async (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
    };
    try {
      await axios.post(
        LOGGING_URL,
        logData,
        {
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      // Optionally handle logging errors (do not throw)
    }
  });
  next();
};

module.exports = logger; 