const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/stats', (req, res) => {
  try {
    const totalStudents = db.prepare(`
      SELECT COUNT(*) as count FROM users WHERE role = 'student'
    `).get().count;

    let students = [];
    try {
      students = db.prepare(`
        SELECT 
          u.id, u.name, u.class_name, u.level, u.xp,
          COUNT(DISTINCT a.activity_id) as completed_activities,
          AVG(a.score) as avg_score,
          COUNT(DISTINCT ub.badge_id) as badges_earned
        FROM users u
        LEFT JOIN attempts a ON u.id = a.user_id
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        WHERE u.role = 'student'
        GROUP BY u.id
        ORDER BY u.xp DESC
      `).all();
    } catch (e) {
      console.log('Students query failed:', e.message);
    }

    let topicCompletion = [];
    try {
      topicCompletion = db.prepare(`
        SELECT 
          t.id, t.name, s.name as subject_name,
          COUNT(DISTINCT a.id) as total_activities,
          COUNT(DISTINCT CASE WHEN att.correct = 1 THEN att.activity_id END) as completed_count
        FROM topics t
        JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN activities a ON t.id = a.topic_id
        LEFT JOIN attempts att ON a.id = att.activity_id
        GROUP BY t.id
      `).all();
    } catch (e) {}

    let dailyParticipation = 0;
    try {
      dailyParticipation = db.prepare(`
        SELECT COUNT(DISTINCT user_id) as active_users
        FROM attempts
        WHERE DATE(completed_at) = DATE('now')
      `).get().active_users;
    } catch (e) {}

    res.json({
      totalStudents,
      students,
      topicCompletion,
      dailyParticipation,
      avgScore: students.length > 0 
        ? students.reduce((sum, s) => sum + (s.avg_score || 0), 0) / students.length 
        : 0
    });
  } catch (error) {
    console.error('Teacher stats error:', error);
    res.status(500).json({ error: 'Failed to fetch teacher stats' });
  }
});

module.exports = router;