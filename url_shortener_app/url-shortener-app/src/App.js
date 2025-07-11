import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const LOG = (...args) => {
  // Simulate logging middleware
  console.log('[Custom Logger]:', ...args);
};

const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const generateShortCode = () => Math.random().toString(36).substring(2, 8);

const App = () => {
  const [urls, setUrls] = useState([{ long: '', validity: 30, custom: '' }]);
  const [shortened, setShortened] = useState([]);
  const [clickStats, setClickStats] = useState({});

  const handleInputChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const handleShorten = () => {
    const results = [];
    for (let entry of urls) {
      if (!validateURL(entry.long)) {
        alert(`Invalid URL: ${entry.long}`);
        return;
      }
      const shortCode = entry.custom ? entry.custom : generateShortCode();
      const expiry = parseInt(entry.validity) || 30;
      results.push({
        id: uuidv4(),
        long: entry.long,
        code: shortCode,
        expiry,
        createdAt: new Date(),
        clicks: []
      });
      LOG('Shortened URL created:', entry.long, '->', shortCode);
    }
    setShortened(prev => [...prev, ...results]);
  };

  const handleAddField = () => {
    if (urls.length < 5) setUrls([...urls, { long: '', validity: 30, custom: '' }]);
  };

  const handleClick = (short) => {
    const now = new Date();
    const stat = clickStats[short.code] || [];
    stat.push({
      timestamp: now,
      source: 'localhost',
      location: 'India'
    });
    setClickStats({ ...clickStats, [short.code]: stat });
    LOG('URL clicked:', short.code, now);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>React URL Shortener</Typography>
      {urls.map((entry, i) => (
        <Grid container spacing={2} key={i}>
          <Grid item xs={4}>
            <TextField label="Long URL" fullWidth value={entry.long} onChange={(e) => handleInputChange(i, 'long', e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Validity (min)" fullWidth value={entry.validity} onChange={(e) => handleInputChange(i, 'validity', e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Custom Code (optional)" fullWidth value={entry.custom} onChange={(e) => handleInputChange(i, 'custom', e.target.value)} />
          </Grid>
        </Grid>
      ))}
      <Button onClick={handleAddField} disabled={urls.length >= 5} sx={{ mt: 2 }}>Add URL Field</Button>
      <Button onClick={handleShorten} variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>Shorten URLs</Button>

      <Typography variant="h5" sx={{ mt: 4 }}>Shortened URLs</Typography>
      {shortened.map((s) => (
        <Paper key={s.id} sx={{ p: 2, mt: 2 }}>
          <Typography>Short: <a href={`#${s.code}`} onClick={() => handleClick(s)}>{`http://localhost:3000/${s.code}`}</a></Typography>
          <Typography>Long: {s.long}</Typography>
          <Typography>Expiry: {s.expiry} minutes</Typography>
          <Typography>Created At: {s.createdAt.toString()}</Typography>
        </Paper>
      ))}

      <Typography variant="h5" sx={{ mt: 4 }}>URL Statistics</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short Code</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(clickStats).map(([code, clicks]) => (
            <TableRow key={code}>
              <TableCell>{code}</TableCell>
              <TableCell>{clicks.length}</TableCell>
              <TableCell>
                {clicks.map((c, i) => (
                  <div key={i}>{c.timestamp.toString()} - {c.source} - {c.location}</div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default App;
