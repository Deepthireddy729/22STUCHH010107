const express = require('express');
const cors = require('cors');
const logger = require('../logging-middleware/logger');
const { addUrl, getUrl, addClick, getClicks } = require('./urlStore');

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

// Health check
app.get('/', (req, res) => {
  res.send('URL Shortener Backend Running');
});

// Create Short URL
app.post('/shorturls', (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }
    let code = shortcode;
    if (code && (!/^[a-zA-Z0-9]{3,10}$/.test(code))) {
      return res.status(400).json({ error: 'Shortcode must be alphanumeric and 3-10 chars' });
    }
    const urlObj = addUrl({ url, validity, shortcode: code });
    return res.status(201).json({
      shortLink: `${req.protocol}://${req.get('host')}/${urlObj.code}`,
      expiry: urlObj.expiry.toISOString(),
    });
  } catch (err) {
    if (err.message.includes('Shortcode already exists')) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve Short URL Statistics
app.get('/shorturls/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const urlObj = getUrl(code);
  if (!urlObj) return res.status(404).json({ error: 'Shortcode not found' });
  const clickData = getClicks(code);
  res.json({
    url: urlObj.url,
    createdAt: urlObj.createdAt,
    expiry: urlObj.expiry,
    totalClicks: urlObj.clicks,
    clicks: clickData,
  });
});

// Redirection
app.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const urlObj = getUrl(code);
  if (!urlObj) return res.status(404).send('Shortcode not found');
  if (new Date() > urlObj.expiry) return res.status(410).send('Short link expired');
  // Log click
  addClick(code, {
    timestamp: new Date().toISOString(),
    referrer: req.get('referer') || '',
    ip: req.ip,
    // geo: ... (could be added with a geoip lib)
  });
  res.redirect(urlObj.url);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 