const db = require('../db/database');

// Simple level curve: level N requires N * 100 cumulative XP. Cheap, predictable, easy to demo.
function levelForXp(xp) {
  let level = 1;
  while (xp >= level * 100) level++;
  return level;
}

// Called after every attempt insert. Updates users.xp/coins/level and streaks, returns
// { leveledUp, newBadges } so the API response can drive celebration UI on the frontend.
function applyRewards({ userId, xpAwarded, coinsAwarded }) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const newXp = user.xp + xpAwarded;
  const newCoins = user.coins + coinsAwarded;
  const oldLevel = user.level;
  const newLevel = levelForXp(newXp);

  db.prepare('UPDATE users SET xp = ?, coins = ?, level = ? WHERE id = ?')
    .run(newXp, newCoins, newLevel, userId);

  updateStreak(userId);
  const newBadges = checkBadges(userId);

  return { leveledUp: newLevel > oldLevel, newLevel, newBadges };
}

function updateStreak(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const row = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(userId);
  if (!row) {
    db.prepare('INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 1, 1, ?)')
      .run(userId, today);
    return;
  }
  if (row.last_active_date === today) return; // already counted today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const nextStreak = row.last_active_date === yesterday ? row.current_streak + 1 : 1;
  const longest = Math.max(row.longest_streak, nextStreak);

  db.prepare('UPDATE streaks SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE user_id = ?')
    .run(nextStreak, longest, today, userId);
}

// Rule-based badge checks -- no ML, just threshold comparisons against condition_value.
function checkBadges(userId) {
  const earned = new Set(
    db.prepare('SELECT badge_id FROM user_badges WHERE user_id = ?').all(userId).map(r => r.badge_id)
  );
  const badges = db.prepare('SELECT * FROM badges').all();
  const stats = {
    activities_completed: db.prepare('SELECT COUNT(*) c FROM attempts WHERE user_id = ?').get(userId).c,
    streak: db.prepare('SELECT current_streak c FROM streaks WHERE user_id = ?').get(userId)?.c || 0,
    perfect_scores: db.prepare('SELECT COUNT(*) c FROM attempts WHERE user_id = ? AND score >= 1').get(userId).c
  };

  const newlyEarned = [];
  for (const badge of badges) {
    if (earned.has(badge.id)) continue;
    if (stats[badge.condition_type] >= badge.condition_value) {
      db.prepare('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(userId, badge.id);
      newlyEarned.push(badge);
    }
  }
  return newlyEarned;
}

// Adaptive difficulty (rule-based, no AI): look at the student's last 3 attempts in this
// topic. >=80% correct -> suggest harder next time, <40% -> suggest easier. Frontend/route
// can use this to pick which activity to serve next within a topic.
function suggestNextDifficulty(userId, topicId) {
  const recent = db.prepare(`
    SELECT a.correct FROM attempts a
    JOIN activities ac ON ac.id = a.activity_id
    WHERE a.user_id = ? AND ac.topic_id = ?
    ORDER BY a.completed_at DESC LIMIT 3
  `).all(userId, topicId);

  if (recent.length < 3) return null; // not enough data yet, no adjustment
  const correctRate = recent.filter(r => r.correct).length / recent.length;
  if (correctRate >= 0.8) return 'increase';
  if (correctRate < 0.4) return 'decrease';
  return 'same';
}

module.exports = { levelForXp, applyRewards, suggestNextDifficulty };
