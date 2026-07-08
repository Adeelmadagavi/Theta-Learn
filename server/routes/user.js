const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/stats', (req, res) => {
  const userId = req.user.id;

  try {
    const user = db.prepare(`
      SELECT id, name, email, role, xp, coins, level, class_name
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let streak = { current_streak: 0, longest_streak: 0 };
    try {
      const s = db.prepare(`
        SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?
      `).get(userId);
      if (s) streak = s;
    } catch (e) {}

    let completedActivities = 0;
    try {
      completedActivities = db.prepare(`
        SELECT COUNT(DISTINCT activity_id) as count
        FROM attempts WHERE user_id = ? AND correct = 1
      `).get(userId).count;
    } catch (e) {}

    let badgesEarned = 0;
    try {
      badgesEarned = db.prepare(`
        SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?
      `).get(userId).count;
    } catch (e) {}

    let recentAchievements = [];
    try {
      recentAchievements = db.prepare(`
        SELECT b.name, b.icon, b.description, ub.earned_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
        ORDER BY ub.earned_at DESC LIMIT 5
      `).all(userId);
    } catch (e) {}

    res.json({
      ...user,
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      completedActivities,
      badgesEarned,
      recentAchievements
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

module.exports = router;