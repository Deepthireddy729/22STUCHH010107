const { v4: uuidv4 } = require('uuid');

// In-memory storage
const urls = {};
const clicks = {};

function generateShortcode() {
  // Simple alphanumeric shortcode generator
  return uuidv4().slice(0, 6);
}

function addUrl({ url, validity, shortcode }) {
  const code = shortcode || generateShortcode();
  const now = new Date();
  const expiry = new Date(now.getTime() + (validity || 30) * 60000);
  if (urls[code]) throw new Error('Shortcode already exists');
  urls[code] = {
    url,
    createdAt: now,
    expiry,
    code,
    clicks: 0,
  };
  clicks[code] = [];
  return urls[code];
}

function getUrl(code) {
  return urls[code];
}

function addClick(code, clickData) {
  if (urls[code]) {
    urls[code].clicks += 1;
    clicks[code].push(clickData);
  }
}

function getClicks(code) {
  return clicks[code] || [];
}

module.exports = { addUrl, getUrl, addClick, getClicks }; 