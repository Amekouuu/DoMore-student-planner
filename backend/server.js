const express = require('express');
const cors = require('cors');
const path = require('path');

require('./config/database');

const app = express();
const serv = process.env.PORT || 3000;

/* ========================
   Middleware
======================== */
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

/* ========================
   Basic routes
======================== */
app.get('/', (req, res) => {
  console.log('GET / - Serving index.html');
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/api/status', (req, res) => {
  console.log('GET /api/status - Status check');
  res.json({ status: 'ok' });
});

/* ========================
   API routes
======================== */
app.use('/api/folders', require('./routes/folders'));
app.use('/api/events', require('./routes/events'));
app.use('/api/files', require('./routes/files'));
app.use('/api/user', require('./routes/user'));
app.use('/api', require('./routes/auth')); // <-- login/signup mounted here

/* ========================
   Debug routes
======================== */

// list all registered routes
app.get('/api/_routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(mw => {
    if (mw.route) {
      routes.push({ path: mw.route.path, methods: mw.route.methods });
    } else if (mw.name === 'router') {
      mw.handle.stack.forEach(h => {
        if (h.route) routes.push({ path: h.route.path, methods: h.route.methods });
      });
    }
  });
  res.json(routes);
});

// confirm running build
app.get('/api/whoami', (req, res) => {
  res.json({
    ok: true,
    message: 'backend is running THIS build',
    time: new Date().toISOString()
  });
});

app.get('/api/debug', (req, res) => {
  res.json({
    message: 'This is the LIVE backend',
    time: new Date()
  });
});

/* ========================
   Start server
======================== */
app.listen(serv, () => {
  console.log(`Server running on port ${serv}`);
});
