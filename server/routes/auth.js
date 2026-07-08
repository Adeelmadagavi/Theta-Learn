const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role, class_name } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password, role are required' });
  }
  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ error: "role must be 'student' or 'teacher'" });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const info = db.prepare(
    'INSERT INTO users (name, email, password_hash, role, class_name) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, hash, role, class_name || null);

  db.prepare('INSERT INTO streaks (user_id, current_streak, longest_streak) VALUES (?, 0, 0)').run(info.lastInsertRowid);

  const token = jwt.sign({ id: info.lastInsertRowid, role, name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: info.lastInsertRowid, name, role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role, xp: user.xp, coins: user.coins, level: user.level }
  });
});

module.exports = router;
