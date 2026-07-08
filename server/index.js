const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const leaderboardRoutes = require('./routes/leaderboard');
const dashboardRoutes = require('./routes/dashboard');

// Debug: Check if routes loaded
console.log('Routes loaded:');
console.log('- auth:', typeof authRoutes);
console.log('- activity:', typeof activityRoutes);
console.log('- leaderboard:', typeof leaderboardRoutes);
console.log('- dashboard:', typeof dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', dashboardRoutes);

// Try to load optional routes
try {
  const userRoutes = require('./routes/user');
  const { authenticateToken } = require('./middleware/auth');
  app.use('/api/user', authenticateToken, userRoutes);
  console.log('✅ User routes registered');
} catch (e) {
  console.log('⚠️  User routes skipped:', e.message);
}

try {
  const dailyChallengeRoutes = require('./routes/dailyChallenge');
  const { authenticateToken } = require('./middleware/auth');
  app.use('/api/daily-challenge', authenticateToken, dailyChallengeRoutes);
  console.log('✅ Daily challenge routes registered');
} catch (e) {
  console.log('⚠️  Daily challenge routes skipped:', e.message);
}

try {
  const teacherRoutes = require('./routes/teacher');
  const { authenticateToken } = require('./middleware/auth');
  app.use('/api/teacher', authenticateToken, teacherRoutes);
  console.log('✅ Teacher routes registered');
} catch (e) {
  console.log('⚠️  Teacher routes skipped:', e.message);
}

// Serve React app
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}\n`);
});