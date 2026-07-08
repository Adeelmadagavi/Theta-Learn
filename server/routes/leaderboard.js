const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/leaderboard?range=daily|weekly|overall
router.get('/', requireAuth, (req, res) => {
  const range = req.query.range || 'overall';

  let dateFilter = '1=1';
  if (range === 'daily') dateFilter = "date(a.completed_at) = date('now')";
  if (range === 'weekly') dateFilter = "date(a.completed_at) >= date('now', '-6 days')";

  const rows = db.prepare(`
    SELECT u.id, u.name, u.level,
           COALESCE(SUM(a.xp_awarded), 0) as xp,
           COUNT(a.id) as activities_completed
    FROM users u
    LEFT JOIN attempts a ON a.user_id = u.id AND ${dateFilter}
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY xp DESC
    LIMIT 50
  `).all();

  const withRank = rows.map((r, i) => ({ ...r, rank: i + 1 }));
  const myRank = withRank.find(r => r.id === req.user.id) || null;

  res.json({ range, leaderboard: withRank, myRank });
});

module.exports = router;
