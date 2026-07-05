# RONIN — Project Status

> **Convention:** this file is the source of truth for project state. Update it at the end of
> any session that changes the game, the pipeline, or a decision. Git history records the how;
> this file records the what and why.

*Last updated: 2026-07-05 (v1.1 — diagonal guards + visual pass)*

## What this project is

**RONIN 浪人** — a Wordle-path daily puzzle game. One castle per day, same for every player,
generated deterministically from the date. Reach the Emperor at the centre in as few moves as
you can; three attempts; shareable result. Goal: live online, low/zero maintenance, ad-supported
eventually.

Descended from **Ronin Proper** (tiered stealth board game, `ronin_prototype_v17.html`), stripped
back for the daily format. `chess-ronin-001*` is an unrelated earlier side exploration.

## Current build

- **`ronin_daily_v1.html`** — the game, complete in one file (engine + UI + styles). No
  dependencies, no build step.
- **`index.html`** — deploy copy of the current release. When a new version ships, copy it over
  index.html.
- **`tests/`** — Node harness: `engine.mjs` (mirror of the embedded engine for benchmarking),
  `bench.mjs` (par distribution / gen-time across 120 days + solver-vs-rules replay validation),
  `parity.mjs` (extracts the engine from the HTML, confirms identical boards to the mirror).
  Run with `node tests/bench.mjs` / `node tests/parity.mjs`. **parity.mjs must pass before any
  release** — it guarantees the tuning mirror and the shipped engine agree.

## Rules as tuned (v1)

- 13×13 board, 3 rings + Emperor centre tile. Ring crossings only at stair tiles.
- Daily layout: 3 outer gates + 2 inner gates (positions randomized), Ronin start (1 of 8 edge
  tiles), 12 guards (6/4/2 by ring). Board geometry itself never changes.
- Ronin: up to **2 steps/turn** (8-directional), or HOLD. No grapple/leap in v1 (parked for hard
  mode, along with ronin classes with different skills).
- Guards: after each Ronin turn, the **2 nearest** each take 1 step toward the Ronin,
  **8-directionally (diagonal allowed)**, falling back to the dominant orthogonal axis when a wall
  or occupant blocks the diagonal (deterministic: distance sort, index tiebreak). Guard onto
  Ronin = captured.
- Win: end a turn beside the Emperor, then Ascend (tap him) — counts as a move.
- 3 attempts/day, same castle. Score = moves; par = solver optimum shown up front.
- Par acceptance band **[8, 14]**; generator re-rolls candidate seeds until the A* solver proves
  the board winnable inside the band. Epoch: puzzle #1 = 2026-07-04 (local dates).

## Key decisions log

- **2026-07-04** Pivot to daily-puzzle format agreed (Brad). Strip rules first, add depth later.
- **2026-07-04** 3 attempts/day (Brad) — deterministic guards make attempt 1 reconnaissance.
- **2026-07-04** Ronin moves 2 (not 3, as v17): benchmark showed 3-step compresses par to 6–7;
  2-step spreads 8–12. Bench: 0 unsolvable boards in 120 days; gen avg ~250ms, worst ~1.8s.
- **2026-07-04** Solver-first architecture: no board ships unproven. Solver also yields par.
- **2026-07-04** Guard-intent arrows shown to player (deterministic AI = fair to show; deaths
  should be planning errors, not gotchas).
- **2026-07-05** Repo initialized; index.html deploy copy; harness moved into `tests/`.
- **2026-07-05** Guards move diagonally now (was orthogonal). Brad flagged the orthogonal AI let
  the king-moving Ronin slip past diagonally — "a bit of a cheat." Benchmark confirmed: orthogonal
  piled daily pars at the floor (8:74, 9:30, 10:14); diagonal spreads them across the band
  (8:44, 9:25, 10:25, 11:17, 12:6, 13:2, 14:1) while staying 100% solver-verified. Fewer gen
  tries (avg 2.6 vs 5.8), gen time still fine (p90 ~0.9s, max ~3.3s behind veil).
- **2026-07-05** Visual pass: Ronin recoloured to gold+red-ring (Emperor family, was hard to spot
  as pale disc); stair treads now run across direction of travel (vertical treads on E/W gates,
  horizontal on N/S — previously all horizontal); guards recoloured to centered red dot + red ring
  (was off-center dot + cream ring).

## Verified (browser, 2026-07-04)

Win flow, full 3-attempt loss flow, capture determinism (identical captures across attempts),
share text + clipboard fallback, localStorage persist/restore across reloads, stats/streaks,
countdown, practice mode isolation from daily record, mobile 375px layout. Bugs found and fixed
during verification: hidden-tab animation stall, input leaking through modals, retry double-tap
skipping an attempt.

## Roadmap / open

1. **Playtest difficulty feel** — numbers say par 8–12; needs human confirmation that days feel
   varied and fair. Tuning levers: gate counts, par band, guard start-distance floor.
2. **Hosting** — GitHub Pages (repo ready; needs `gh auth login` + push + enable Pages). Then a
   custom domain and the share string gains a URL.
3. Share-string polish once hosted (add link; consider streak emoji).
4. Hard mode shelf: grapple, leap-capture, hidden/alerted bonus moves, ronin classes.
5. Later: sound, richer animation, og-image, analytics-lite (respecting the no-tracking instinct).

## Debug hooks

In-browser console: `RoninDebug.startPractice(seed)`, `RoninDebug.autoWin()` (solver plays out
the current position), `RoninDebug.holdUntilCaught()`, plus `RoninDebug.G` (live state) and
`RoninDebug.RE` (engine).
