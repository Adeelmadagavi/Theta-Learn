const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { applyRewards, suggestNextDifficulty } = require('../lib/gamification');

const router = express.Router();

router.get('/subjects', requireAuth, (req, res) => {
  const subjects = db.prepare('SELECT * FROM subjects').all();

  res.json({
    subjects
  });
});

router.get('/subjects/:id/topics', requireAuth, (req, res) => {
  const topics = db.prepare('SELECT * FROM topics WHERE subject_id = ? ORDER BY order_index').all(req.params.id);
  res.json(topics);
});

router.get('/topics/:id/activities', requireAuth, (req, res) => {
  const activities = db.prepare('SELECT * FROM activities WHERE topic_id = ? ORDER BY order_index').all(req.params.id);

  // Attach per-user completion status so the frontend can show pending vs done.
  const completedIds = new Set(
    db.prepare(`
      SELECT DISTINCT activity_id FROM attempts
      WHERE user_id = ? AND activity_id IN (${activities.map(a => a.id).join(',') || '0'})
    `).all(req.user.id).map(r => r.activity_id)
  );

  const shaped = activities.map(a => ({
    ...a,
    content: JSON.parse(a.content_json),
    content_json: undefined,
    completed: completedIds.has(a.id)
  }));

  res.json({
    activities: shaped,
    difficultyHint: suggestNextDifficulty(req.user.id, req.params.id)
  });
});

// Submit an attempt. `correct` (bool) and `score` (0..1, for partial-credit engines like
// match/sequence) come from the frontend engine's own scoring logic.
router.post('/activities/:id/attempt', requireAuth, (req, res) => {
  const { correct, score, timeTakenSeconds } = req.body;
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });

  const firstTry = !db.prepare('SELECT 1 FROM attempts WHERE user_id = ? AND activity_id = ?')
    .get(req.user.id, activity.id);

  const xpAwarded = Math.round(activity.base_xp * (score ?? (correct ? 1 : 0.3)) + (firstTry && correct ? 5 : 0));
  const coinsAwarded = correct ? activity.base_coins : 0;

  db.prepare(`
    INSERT INTO attempts (user_id, activity_id, correct, score, time_taken_seconds, xp_awarded, coins_awarded)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, activity.id, correct ? 1 : 0, score ?? (correct ? 1 : 0), timeTakenSeconds || null, xpAwarded, coinsAwarded);

  const rewardResult = applyRewards({ userId: req.user.id, xpAwarded, coinsAwarded });

  res.json({ xpAwarded, coinsAwarded, ...rewardResult });
});

module.exports = router;
