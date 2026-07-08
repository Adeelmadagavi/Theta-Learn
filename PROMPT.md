# Prompt: finish Theta Learn (gamified NCERT app) from this scaffold

Paste this into Claude Code (or any AI coding assistant) with this project folder open,
to continue building against the existing conventions instead of starting over.

---

I have a working scaffold for a gamified NCERT learning app (React + Vite + Tailwind
frontend, Express + SQLite backend). The architecture is deliberately content-driven:
each "activity" is a row in the `activities` table with a `type` column (`quiz` | `match`
| `dragdrop` | `sequence` | `memory`) and a `content_json` column. The frontend maps
`type` to a React "engine" component in `client/src/components/engines/`, and
`client/src/pages/ActivityPlayer.jsx` renders whichever engine matches.

Two engines are fully built and working: `QuizEngine.jsx` and `MatchEngine.jsx`. Read
both before writing anything -- they establish the conventions to follow exactly:
- Props are always `{ content, onComplete }`.
- `onComplete` is called exactly once, with `{ correct: boolean, score: number (0..1),
  timeTakenSeconds: number }`.
- Styling uses Tailwind utility classes only, with the custom tokens defined in
  `client/tailwind.config.js` (`bg-ink`, `bg-coral`, `bg-mint`, `bg-sunshine`, `bg-sky`,
  `bg-grape`, `rounded-xl2`, `font-display`, `font-body`). Don't invent new colors.
- Cards are `bg-white rounded-xl2 shadow-md p-6`, max width `max-w-xl mx-auto`.
- Buttons are `font-display font-bold text-white`, with `bg-ink` for neutral actions and
  `bg-coral` for the primary "continue" action.
- Keep interactions keyboard-accessible (buttons, not raw divs, for anything clickable).

## Task 1 -- Build the three remaining engines

Replace the placeholder implementations in:
- `client/src/components/engines/DragDropEngine.jsx`
- `client/src/components/engines/SequenceEngine.jsx`
- `client/src/components/engines/MemoryEngine.jsx`

Content shapes already seeded in `server/db/seed.js` (use these exact shapes, don't
redesign them, or the existing seed data breaks):

```js
// dragdrop
{ instruction: string, items: string[], targets: string[], correctMap: { [item]: target } }

// sequence
{ instruction: string, steps: string[] }   // `steps` is the CORRECT order; shuffle client-side for display

// memory
{ instruction: string, pairs: { a: string, b: string }[] }  // flip-card pairs
```

Requirements per engine:
- **DragDropEngine**: HTML5 drag-and-drop (or click-to-assign as a touch-friendly
  fallback -- mobile responsiveness is a graded requirement) of each item onto a target;
  score = fraction of items placed correctly; call `onComplete` once all items are placed,
  with `score` = correct/total and `correct` = (score === 1).
- **SequenceEngine**: shuffle `steps` on mount, let the user reorder them (drag or
  up/down buttons for mobile), compare to original order on submit; `score` = 1 if fully
  correct else a partial credit based on longest correct run, `correct` = (score === 1).
- **MemoryEngine**: classic flip-two-cards memory game built from `pairs`, one card per
  side of each pair, shuffled; track moves and completion; `correct` = true and `score` =
  1 once all pairs are found (this type doesn't really "fail," so keep it low-stakes and
  fun -- maybe track moves for a small bonus-XP hook later, but don't block completion).

## Task 2 -- Spin-the-wheel daily reward (bonus feature)

The `daily_spins` table already exists in `server/db/schema.sql` (one row per user per
day: `reward_type`, `reward_value`). Add:
- `POST /api/daily-spin` in a new `server/routes/dailySpin.js`: if the user already
  spun today, return 409; otherwise pick a weighted-random reward from a fixed array
  (e.g. mostly small coin amounts, rarely a bigger XP or a badge), insert the row, apply
  the reward via the existing `applyRewards` helper in `server/lib/gamification.js`,
  return the result.
- A `SpinWheel.jsx` component (CSS `@keyframes` rotation, no external animation library)
  shown on the student dashboard if today's spin hasn't been claimed yet.

## Task 3 -- Wire everything into `ActivityPlayer.jsx` and verify

- Confirm all 5 engine types render correctly for all 30 seeded activities (`node
  server/db/seed.js` then click through every topic).
- Confirm mobile responsiveness at a 375px viewport (this is a graded non-functional
  requirement in the brief).

Don't restructure the database schema, the routing, or the auth flow -- the goal is to
extend this scaffold, not rebuild it.
