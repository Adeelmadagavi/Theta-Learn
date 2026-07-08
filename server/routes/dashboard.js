const express = require('express');
const db = require('../db/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ---- Student dashboard ----
router.get('/student/dashboard', requireAuth, requireRole('student'), (req, res) => {
  const user = db.prepare('SELECT id, name, xp, coins, level FROM users WHERE id = ?').get(req.user.id);
  const streak = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(req.user.id);
  const totalActivities = db.prepare('SELECT COUNT(*) c FROM activities').get().c;
  const completed = db.prepare('SELECT COUNT(DISTINCT activity_id) c FROM attempts WHERE user_id = ?').get(req.user.id).c;
  const badges = db.prepare(`
    SELECT b.* FROM badges b JOIN user_badges ub ON ub.badge_id = b.id
    WHERE ub.user_id = ? ORDER BY ub.earned_at DESC LIMIT 5
  `).all(req.user.id);
  const nextLevelXp = user.level * 100;

  // subject-wise progress
  const subjectProgress = db.prepare(`
    SELECT s.name as subject, COUNT(DISTINCT ac.id) as total,
           COUNT(DISTINCT at.activity_id) as done
    FROM subjects s
    JOIN topics t ON t.subject_id = s.id
    JOIN activities ac ON ac.topic_id = t.id
    LEFT JOIN attempts at ON at.activity_id = ac.id AND at.user_id = ?
    GROUP BY s.id
  `).all(req.user.id);

  res.json({
    user,
    streak: streak || { current_streak: 0, longest_streak: 0 },
    progress: { completed, total: totalActivities, pending: totalActivities - completed },
    nextLevelXp,
    recentBadges: badges,
    subjectProgress
  });
});

// ---- Teacher dashboard ----
router.get('/teacher/dashboard', requireAuth, requireRole('teacher'), (req, res) => {
  const students = db.prepare("SELECT id, name, class_name, xp, coins, level FROM users WHERE role = 'student'").all();
  const totalActivities = db.prepare('SELECT COUNT(*) c FROM activities').get().c;

  const withStats = students.map(s => {
    const completed = db.prepare('SELECT COUNT(DISTINCT activity_id) c FROM attempts WHERE user_id = ?').get(s.id).c;
    const avgScore = db.prepare('SELECT AVG(score) a FROM attempts WHERE user_id = ?').get(s.id).a;
    const activeToday = db.prepare("SELECT 1 FROM attempts WHERE user_id = ? AND date(completed_at) = date('now') LIMIT 1").get(s.id);
    return {
      ...s,
      completed,
      total: totalActivities,
      avgScore: avgScore ? Math.round(avgScore * 100) : 0,
      activeToday: !!activeToday
    };
  });

  const classGroups = {};
  withStats.forEach(s => {
    const cls = s.class_name || 'Unassigned';
    if (!classGroups[cls]) classGroups[cls] = [];
    classGroups[cls].push(s);
  });

  res.json({
    totalStudents: students.length,
    dailyActiveCount: withStats.filter(s => s.activeToday).length,
    classGroups,
    students: withStats
  });
});

module.exports = router;
