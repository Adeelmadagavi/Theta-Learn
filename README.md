# Theta Learn -- Gamified NCERT Learning App

Hackathon scaffold for Theta Dynamics' "Gamified Learning App for NCERT Students" brief.
Built for speed: SQLite (zero setup), one deployable service (Express serves the built
React app), and a **content-driven activity engine** pattern so 30 activities = 30 JSON
objects, not 30 hand-built screens.

## Why it's structured this way
The brief explicitly grades "scalable architecture." Instead of coding 30 unique activity
screens, there are 5 generic engines (Quiz, Match, DragDrop, Sequence, Memory) that each
take a `content` JSON object and render themselves. Adding a new activity = adding a row
in `server/db/seed.js`, not writing new code. Adding a new *type* of engine = one new
component + one line in `client/src/pages/ActivityPlayer.jsx`.

## Run it locally

```bash
# 1. Server
cd server
npm install
npm run seed      # populates SQLite with 2 subjects, 10 topics, 30 activities, 7 badges
npm run dev        # http://localhost:4000

# 2. Client (separate terminal)
cd client
npm install
npm run dev        # http://localhost:5173, proxies /api to :4000
```

Register a student account and a teacher account (use the role dropdown on the register
form) to see both dashboards.

## Deploy (single service, low cost)

```bash
cd client && npm run build   # outputs client/dist
cd ../server && npm install --production
node db/seed.js
node index.js                 # serves API + built client on one port
```

Push `server/` (which now contains the built `client/dist`) to Render/Railway free tier.
No separate frontend hosting, no CORS config needed in production.

## What's done vs. what's left

**Working end-to-end:** auth (register/login/JWT), subjects → topics → activities flow,
QuizEngine and MatchEngine (fully playable), attempt submission with XP/coins/level/streak/
badge logic, rule-based adaptive-difficulty hint, leaderboard (daily/weekly/overall),
student dashboard, teacher dashboard.

**Stubbed, same contract, needs building:** DragDropEngine, SequenceEngine, MemoryEngine
(`client/src/components/engines/`). Each currently renders a placeholder "mark as done"
button. See `PROMPT.md` for a ready-to-use prompt to generate these fast.

**Not built (deliberately cut for the 24h window):** spin-the-wheel daily reward, parent
view, avatar customization. Cheap to add later using the same `daily_spins` table already
in the schema for the wheel.
