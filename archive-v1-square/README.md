# RONIN v1 — square-grid version (ARCHIVED, do not delete)

Archived **2026-07-12**. This is the complete, self-contained daily game on the **13×13 square
grid** — the version that has been **live**. It is kept as a **fallback**: we're replacing the
board with the circular ring-graph design (v2). If the circle version doesn't work out, restore
this.

## What this is
- `ronin_daily_v1.html` — a byte copy of the shipped game as of this archive (engine + UI + styles
  in one file, no dependencies, no build step). Open it in a browser to play.

## Live deployment (unchanged for now)
- Was/is live at **https://bradthecaveman.github.io/ronin-daily/** (GitHub Pages, repo
  `bradthecaveman/ronin-daily`), served from the repo-root `index.html`, which is a deploy copy
  of this same file.
- **The live square game is still deployed and untouched** — archiving did not take it down.
  It keeps running until the ring version is ready to replace it.

## To restore v1 as the live game
It's self-contained, so:
1. `cp archive-v1-square/ronin_daily_v1.html index.html` (from the Ronin/ root), then
2. push to the `main` branch — Pages redeploys automatically.
   *(Touching the remote is a deliberate, confirm-first step — see git notes in STATUS.md.)*

## Related (left in place, not moved)
- Square tuning harness: `../tests/engine.mjs`, `bench.mjs`, `parity.mjs`, `rules.mjs`,
  `horizon.mjs`, `lab.mjs`, `runlab.mjs` — the v1 mirror + benchmarks, still runnable.
- Full state/history: `../STATUS.md` and git history. This whole repo state at the time of
  archiving is also recoverable from git.

The ring-board (v2) engine + lab live alongside in `../tests/ring-*.mjs`; its plan is in
`../BOARD_REDESIGN_BRIEF.md`.
