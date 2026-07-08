const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  const { period = 'overall' } = req.query; // daily, weekly, overall

  let dateFilter = '';
  if (period === 'daily') {
    dateFilter = `AND DATE(a.completed_at) = DATE('now')`;
  } else if (period === 'weekly') {
    dateFilter = `AND DATE(a.completed_at) >= DATE('now', '-7 days')`;
  }

  try {
    const leaderboard = db.prepare(`
      SELECT 
        u.id,
        u.name,
        u.level,
        u.xp,
        COUNT(DISTINCT a.activity_id) as completed_activities,
        COUNT(DISTINCT ub.badge_id) as badges_earned
      FROM users u
      LEFT JOIN attempts a ON u.id = a.user_id ${dateFilter}
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.xp DESC
      LIMIT 100
    `).all();

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({ leaderboard: rankedLeaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;