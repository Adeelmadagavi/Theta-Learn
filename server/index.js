const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const leaderboardRoutes = require('./routes/leaderboard');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', dashboardRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve the built React app (run `npm run build` in /client first) as one deployable unit --
// avoids a second hosting service and CORS setup during the hackathon.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
