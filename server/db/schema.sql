-- Theta Hackathon: Gamified NCERT Learning App
-- SQLite schema. Deliberately flat/simple: one file DB, no ORM overhead, fast to seed and inspect.

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student','teacher')),
  class_name TEXT,                 -- e.g. '9-A', used for teacher class-wise filtering
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE          -- 'Mathematics' | 'Science'
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- One row per activity. `type` selects which frontend engine renders `content_json`.
-- type in: 'quiz' | 'match' | 'dragdrop' | 'sequence' | 'memory'
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,        -- engine-specific JSON payload, see /server/db/seed.js for shape
  difficulty INTEGER NOT NULL DEFAULT 1,  -- 1=easy 2=medium 3=hard, used by adaptive-difficulty logic
  base_xp INTEGER NOT NULL DEFAULT 10,
  base_coins INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  correct INTEGER NOT NULL,          -- 0/1
  score REAL NOT NULL DEFAULT 0,     -- 0..1 accuracy for partials (e.g. match/sequence)
  time_taken_seconds INTEGER,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  coins_awarded INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS streaks (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT             -- 'YYYY-MM-DD'
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  condition_type TEXT NOT NULL,     -- 'activities_completed' | 'streak' | 'topic_mastery' | 'perfect_scores'
  condition_value INTEGER NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏅'
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id INTEGER NOT NULL REFERENCES users(id),
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  earned_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, badge_id)
);

-- Daily spin-the-wheel: one claim per user per day
CREATE TABLE IF NOT EXISTS daily_spins (
  user_id INTEGER NOT NULL REFERENCES users(id),
  spin_date TEXT NOT NULL,          -- 'YYYY-MM-DD'
  reward_type TEXT NOT NULL,        -- 'coins' | 'xp' | 'badge'
  reward_value INTEGER NOT NULL,
  PRIMARY KEY (user_id, spin_date)
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_topic ON activities(topic_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
