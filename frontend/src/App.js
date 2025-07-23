import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState(null);

  const handleInputChange = (idx, field, value) => {
    const newUrls = [...urls];
    newUrls[idx][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const handleShorten = async () => {
    setResults([]);
    setErrors([]);
    const promises = urls.map(async (item) => {
      if (!item.url) return { error: 'URL required' };
      try {
        const res = await axios.post(`${BACKEND_URL}/shorturls`, {
          url: item.url,
          validity: item.validity ? parseInt(item.validity) : undefined,
          shortcode: item.shortcode || undefined,
        });
        return res.data;
      } catch (err) {
        return { error: err.response?.data?.error || 'Error' };
      }
    });
    const resArr = await Promise.all(promises);
    setResults(resArr);
  };

  const handleStats = async (shortcode) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/shorturls/${shortcode}`);
      setStats(res.data);
    } catch (err) {
      setStats({ error: err.response?.data?.error || 'Error' });
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>URL Shortener</Typography>
        <Grid container spacing={2}>
          {urls.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2 }}>
                <TextField
                  label="Long URL"
                  value={item.url}
                  onChange={e => handleInputChange(idx, 'url', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Validity (minutes, optional)"
                  value={item.validity}
                  onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                  type="number"
                  margin="normal"
                  sx={{ mr: 2 }}
                />
                <TextField
                  label="Custom Shortcode (optional)"
                  value={item.shortcode}
                  onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                  margin="normal"
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={handleShorten}>Shorten URLs</Button>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={addUrlField} disabled={urls.length >= 5}>Add Another URL</Button>
        <Box mt={4}>
          <Typography variant="h6">Results</Typography>
          <List>
            {results.map((res, idx) => (
              <ListItem key={idx}>
                {res.shortLink ? (
                  <ListItemText
                    primary={
                      <span>
                        <a href={res.shortLink} target="_blank" rel="noopener noreferrer">{res.shortLink}</a>
                        {' '} (expires: {new Date(res.expiry).toLocaleString()})
                        <Button size="small" sx={{ ml: 2 }} onClick={() => handleStats(res.shortLink.split('/').pop())}>Stats</Button>
                      </span>
                    }
                  />
                ) : (
                  <ListItemText primary={res.error || 'Error'} />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
        {stats && (
          <Box mt={4}>
            <Typography variant="h6">Statistics</Typography>
            {stats.error ? (
              <Typography color="error">{stats.error}</Typography>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography>Original URL: {stats.url}</Typography>
                <Typography>Created: {new Date(stats.createdAt).toLocaleString()}</Typography>
                <Typography>Expires: {new Date(stats.expiry).toLocaleString()}</Typography>
                <Typography>Total Clicks: {stats.totalClicks}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Click Details:</Typography>
                <List>
                  {stats.clicks.map((click, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`Time: ${new Date(click.timestamp).toLocaleString()}, Referrer: ${click.referrer}, IP: ${click.ip}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App; 