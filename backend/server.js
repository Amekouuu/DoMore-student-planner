const express = require('express');
const cors = require('cors');
const path = require('path');
const serv = process.env.PORT || 3000;

require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

app.get('/', (req, res) => {
  console.log('GET / - Serving index.html');
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/api/status', (req, res) => {
  console.log('GET /api/status - Status check');
  res.json({ status: 'ok' });
});

app.use('/api/folders', require('./routes/folders'));
app.use('/api/events', require('./routes/events'));
app.use('/api/files', require('./routes/files'));
app.use('/api/user', require('./routes/user'));
app.use('/api', require('./routes/auth'));

app.listen(serv, () => {
  console.log(`Server running on http://localhost:${serv}`);
});
