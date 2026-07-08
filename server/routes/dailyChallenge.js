const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get today's daily challenge for the user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Check if user already has a daily challenge assigned for today
    let challenge = db.prepare(`
      SELECT dc.*, a.id as activity_id, a.title, a.type, a.topic_id, t.name as topic_name, s.name as subject_name
      FROM daily_challenges dc
      JOIN activities a ON dc.activity_id = a.id
      JOIN topics t ON a.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE dc.user_id = ? AND dc.challenge_date = ?
    `).get(userId, today);

    if (!challenge) {
      // Pick a random uncompleted activity
      const uncompletedActivity = db.prepare(`
        SELECT a.id, a.title, a.type, a.topic_id, t.name as topic_name, s.name as subject_name
        FROM activities a
        JOIN topics t ON a.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE a.id NOT IN (
          SELECT activity_id FROM attempts WHERE user_id = ? AND correct = 1
        )
        ORDER BY RANDOM()
        LIMIT 1
      `).get(userId);

      if (uncompletedActivity) {
        db.prepare(`
          INSERT INTO daily_challenges (user_id, activity_id, challenge_date)
          VALUES (?, ?, ?)
        `).run(userId, uncompletedActivity.id, today);

        challenge = { ...uncompletedActivity, activity_id: uncompletedActivity.id, completed: false, challenge_date: today };
      } else {
        // All activities completed - pick any random one
        const randomActivity = db.prepare(`
          SELECT a.id, a.title, a.type, a.topic_id, t.name as topic_name, s.name as subject_name
          FROM activities a
          JOIN topics t ON a.topic_id = t.id
          JOIN subjects s ON t.subject_id = s.id
          ORDER BY RANDOM()
          LIMIT 1
        `).get();

        if (randomActivity) {
          db.prepare(`
            INSERT INTO daily_challenges (user_id, activity_id, challenge_date)
            VALUES (?, ?, ?)
          `).run(userId, randomActivity.id, today);

          challenge = { ...randomActivity, activity_id: randomActivity.id, completed: false, challenge_date: today };
        }
      }
    } else {
      // Check if completed today
      const completed = db.prepare(`
        SELECT id FROM attempts 
        WHERE user_id = ? AND activity_id = ? AND DATE(completed_at) = ?
      `).get(userId, challenge.activity_id, today);

      challenge.completed = !!completed;
    }

    res.json({ challenge });
  } catch (error) {
    console.error('Daily challenge error:', error);
    res.status(500).json({ error: 'Failed to fetch daily challenge' });
  }
});

module.exports = router; 