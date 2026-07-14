# RONIN v2 — Fable Build Spec (circular ring board)

*Created 2026-07-13. The complete, self-contained build plan for assembling RONIN v2 in Fable.
Everything hard (engine, difficulty, solvability) is already built and decade-validated in Node —
**Fable's job is assembly, not derivation.** Pair this with: the frozen engine in `tests/`, the
visual references (`ronin-ring-reference-3-tier.html`, `ronin-ring-reference-3.html`,
`ronin-win-flourish.html`), the shipped v1 game to port the shell from (`ronin_daily_v1.html`),
and `STATUS.md` (project source of truth).*

> **Golden rule for the build:** do NOT reinvent the engine, the geometry, or the difficulty. They
> are frozen and validated. Embed the engine verbatim, lift the render from the references, and port
> the product shell from v1. When in doubt, copy the v1 pattern.

---

## 1. What we're building

RONIN v2 — a daily puzzle. Same *soul* as the live v1 square game (infiltrate inward past guards,
reach the Emperor, 3 attempts, daily seed, solver-verified par, shareable), but on a **concentric
ring graph** instead of a 13×13 square grid.

**BETA COEXISTENCE (2026-07-13 decision):** v2 does NOT replace v1 yet. During beta the two run
side by side so we can gather opinions before committing. Ship v2 as a **separate page in the
existing repo** — `round.html` alongside the square `index.html` — with a small cross-link between
them ("try the circular board" / "back to the classic"). Same GitHub Pages site, no new repo needed.
Because they share an origin, v2 MUST namespace its localStorage separately from the square game
(§8) — square stats stay square, round stats stay round; no sharing, no migration. Which board
"wins" and becomes the sole game is deferred until beta feedback. v1 also remains archived in
`archive-v1-square/`.

**Hard constraints (non-negotiable):**
- **Single HTML file**, no dependencies, no build step (same as v1).
- **No network calls, ever** (no telemetry, no CDN, no fonts-over-network beyond v1's existing
  graceful-fallback pattern). This is a standing project rule.
- **Deterministic**: same date + mode → same board on every device. Never change the seeded PRNG,
  the salts, the epoch, or `armyReply` ordering once published.
- **Mobile-first**: must work at 375px. The board is 150 cells; we **keep all cells and shrink the
  whole board to fit** — do NOT reduce cell count. Handle small taps with generous hit-areas
  (snap-tap-to-nearest-cell), not fewer cells.

---

## 2. The engine (FROZEN — embed, don't rewrite)

The engine lives in **`tests/ring-engine.mjs`** + **`tests/ring-config.mjs`**. It is decade-validated
(§9). Embed it into the HTML the way v1 does: a `<script id="engine">` block whose contents are
generated 1:1 from these two files (strip `export`/`import`, concatenate engine then config). Add a
`tests/ring-parity.mjs` (mirror v1's `parity.mjs`) that extracts the embedded engine from the HTML
and asserts it produces byte-identical boards to the Node module — **parity must pass before ship.**

### 2.1 API surface

```
import { makeRingEngine } from './ring-engine.mjs';
import { RING_MODES }     from './ring-config.mjs';

const E = makeRingEngine(RING_MODES.base);   // one engine per mode
```

`makeRingEngine(cfg)` returns:
- `cells` — array of `{ id, ring, idx, ang }`. `id` is a flat integer; `ring` 1=innermost..6=outer;
  `idx` position in ring; `ang` angle (radians, `-PI/2` = 12 o'clock, clockwise).
- `byRing[k]` — array of cell ids in ring k. `counts` — cells per ring `[10,16,22,28,34,40]`.
- `generateFromSeed(seedBase)` → the board: `{ ronin, army, adj, openInward, par, genTries }`.
  `ronin` = cell id; `army` = sorted array of guard cell ids; `adj` = adjacency list (per-board,
  respects gates); `par` = solver optimum (turns incl. final Ascend).
- `dailyBoard`: compute `seedBase = hash32(mode.salt, dayNumber)` then `generateFromSeed(seedBase)`.
  (Mirror v1's `dailyBoard`/`practiceBoard`; practice salt = `hash32(hash32(0x50524143, salt), seed)`.)
- `roninOptions(ronin, army, adj)` → array of destination cell ids reachable this turn (1..STEPS
  edges), **plus a HOLD** encoded as a negative number `-(ronin+1)`. Occupied cells excluded.
- `armyReply(roninEnd, army, adj)` → `{ army, captured }`. Pass the ronin's chosen cell id (or the
  HOLD encoding). The two nearest guards each take one graph-distance-reducing step; stepping onto
  the ronin = `captured:true`. Deterministic.
- `solveBoard(board, {fLimit, maxNodes})` → `{ par, nodes }` or null. Used for gen + par.
- `distFrom(src, adj)`, `buildAdj(openInward)`, `naiveBot(board)` — helpers (lab/debug).

### 2.2 Solver path — DONE (2026-07-13)

`solveBoard(board, {wantPath:true})` now returns `path` (array of per-turn moves `{cell, hold}`; the
final Ascend is implicit, so `path.length === par - 1`) — used for **hints** (solve from the current
position, take `path[0]`) and **reveal-the-way-in** (animate the whole path). `pathTo(ronin, army,
adj, target)` returns the shortest edge-path `[ronin, …, target]` for the move animation. Both are in
`ring-engine.mjs` and covered by `ring-rules.mjs` (path replays legally to the inner ring). No further
engine work needed — embed as-is. **`ring-parity.mjs` is still a Phase-3 task** (write it against the
`round.html` you produce, mirroring v1's `parity.mjs`).

---

## 3. The four modes (LOCKED)

From `ring-config.mjs`. **`easy` is the daily default** (the board Brad tuned as "sometimes it beats
you"); normal/hard/brutal are opt-in steps up. Guard count is the difficulty lever; the 3→2 move drop
is a cliff reserved for brutal. (Naive-bot win% is a difficulty *ranking* floor — humans do better
with 3 attempts + hint; real rates need playtesting.)

| key (= display name) | board gating | guards (o/m/i) | moves | par band | salt | feel |
|-----|--------------|----------------|-------|----------|------|------|
| **easy** (daily default) | tier (2 walls) | 8/5/3 | 3 | [6,12] | 0x52494E31 | quick daily, ~60% naive — sometimes it beats you |
| **normal** | tier (2 walls) | 10/6/4 | 3 | [7,13] | 0x52494E32 | ~43% naive |
| **hard** | every-ring (4 gates/ring) | 6/4/2 | 3 | [7,14] | 0x52494E33 | ~31% naive, chokepoint texture |
| **brutal** | every-ring (4 gates/ring) | 6/4/2 | 2 | [10,18] | 0x52494E34 | ~21% naive, brutal marathon |

Keys double as player-facing names. Brutal ships **without** extra mechanics for v2; sight-lines etc.
layer on later, one at a time through the lab.

---

## 4. Game rules (for the UI)

- **Board**: 6 rings around a central Emperor; 3 tiers of 2 rings (tier1 inner … tier3 outer).
- **Move**: tap a highlighted destination. The ronin traverses up to N graph edges/turn (N = mode
  moves). An edge is an **orbit** step (±1 around a ring, free) or a **gate/cross** step (inward or
  outward where a wall opens — a stair cell). HOLD is allowed. Use `roninOptions` for the legal set;
  animate along the shortest path to the tapped cell.
- **Guards**: after each ronin turn, `armyReply` moves the two nearest guards one step each toward
  the ronin (deterministic). Show **guard-intent arrows** for exactly the guards that will move
  (v1 does this — deterministic AI means it's fair to telegraph; deaths should be planning errors).
- **Capture**: a guard stepping onto the ronin ends the attempt.
- **Win**: reach any **inner-ring (ring 1)** cell, then **Ascend** = tap the Emperor (counts as the
  final move → that's why par includes +1). Trigger the win flourish (§6).
- **Attempts**: 3/day, same castle. Score = moves; par shown up front. Deterministic guards make
  attempt 1 reconnaissance.

---

## 5. Geometry & rendering

**Lift the render wholesale from the reference files** — they are the settled visual language:
- `ronin-ring-reference-3-tier.html` → the **tier board** (base + hard).
- `ronin-ring-reference-3.html` → the **every-ring board** (severe + epic).
Both: continuous cream board, thin keylines (radial spokes + concentric walls, `rgba(58,50,43,.14)`
spokes / `.26–.32` walls), **single stair-cell gates** (fade from a dark foot up to the destination
ring's colour + tread arcs, wall opens at the gate), **ascending terrace drop-shadows**, tier colour
bands. Emperor = red tile + gold sun; ronin = red lacquer stone w/ gold katana slash; guards = dark
charcoal stones. Monochrome-cream art direction (v1.8): the red faction is the only saturated thing.

**Cell ↔ screen mapping (critical):** the engine and the references use the **same geometry**, so a
cell id maps to a fixed screen position. For cell `c`: angle = `c.ang`; radius from `c.ring` using the
reference's scaling (`step = SIZE*0.445/6.5`, `R = offset + (c.ring-1)*step`, `offset = 1.5*step`).
Draw pieces at `(CX + R·cos(ang), CY + R·sin(ang))`. Tap → nearest cell by (ring-band, angle).

**Mobile**: scale the whole board to `min(vw, someMax)`; keep all 150 cells; expand tap hit-areas
(match tap to nearest legal `roninOptions` cell within a tolerance) so the ~small outer cells stay
playable at 375px.

---

## 6. Win flourish

From **`ronin-win-flourish.html`** (working code). On Ascend: a red **pulse floods out from the
centre** (the freed Emperor) up the terraces, settling as a **~26% translucent red wash** over the
still-readable board — an allusion to the rising sun / flag, NOT a solid disc. Then "The Emperor is
free" fades in. Dials in the file: `REST` 0.26 (resting wash), `FLASH` 0.20, `DUR` 1150, `SPREAD`
0.38. Lift the `drawWin`/`play` functions and snapshot approach directly.

---

## 7. Product shell to port from v1 (`ronin_daily_v1.html`)

All of this exists and works in v1 — **port the patterns, re-point at the ring engine.** Board-shape
is the only thing that changes; the shell is board-agnostic.

- **Modes + switcher** (v1 puts it in the ≡ stats modal). 4 modes now instead of 2. Daily default = easy.
- **Daily seed** from the date (`dayNumber` since epoch) → `dailyBoard(day, mode)`.
- **Per-day board cache** in localStorage (deterministic → generate once/device, hide gen behind a
  loading veil). Worst-case gen is cached (§9).
- **3 attempts**, attempt dots, per-mode.
- **🏮 Hint** (one per castle): consult the solver from the *current* position, queue the optimal
  next move (needs the §2.2 path addition). Spent-state persists per day; adds 🏮 to the share.
- **Reveal-the-way-in** on a lost day: animate the solver's optimal line move-by-move (needs §2.2).
- **Share string** (§9), **stats/streaks** modal, **captured modal**, **success splash**, **countdown**
  to next puzzle, **practice mode** (isolated from the daily record).
- **Guard-intent arrows**, input locking during modals/animations.
- **Debug hooks**: `RoninDebug` (autoWin, holdUntilCaught, useHint, revealSolution, startPractice, G, RE).

---

## 8. Storage schema

Mirror v1's per-mode structure, but **use a DISTINCT localStorage key from the square game** — v2
lives at `round.html` on the same origin as the square `index.html`, so they share `localStorage`.
Use a separate root key (e.g. `ronin_round` vs the square's key) so square stats stay square and
round stays round. **No migration, no sharing** (confirmed 2026-07-13). Per mode: results (per day:
attempts used, moves, win/loss), hints spent, stats/streaks, board cache `{day, board}`. Plus
`s.mode` (current selection, default 'easy'). Version the store so future migrations are clean.

**Epoch (decided 2026-07-13): puzzle #1 = the v2 launch date** (round.html's own day-numbering, not
v1's). Store as a UTC constant like v1's `EPOCH_UTC`, clearly marked. Since the exact launch day is
only known at deploy, leave it as a single obvious TODO constant and **set it to the actual deploy
date when round.html goes live** — do not hardcode a placeholder that could ship wrong.

---

## 9. Validation status (decade horizon, 2026-07-13)

All four modes passed the 10-year gate — **14,600 boards (3650×4), 0 unsolvable, 0 below-band.**

| mode | band | mean-par | gen avg / max |
|------|------|----------|---------------|
| easy | [6,12] | 8.5 | 389ms / 9.4s |
| normal | [7,13] | 9.5 | 758ms / 13.8s |
| hard | [7,14] | 9.4 | 323ms / 8.9s |
| brutal | [10,18] | 13.5 | 305ms / 8.0s |

Worst-case gen is bounded (`genMaxNodes=60000` cap in the config) and cached per-day, so players see
it at most once per unlucky day per device, behind the loading veil.

---

## 10. Build order (in Fable)

1. Scaffold the single HTML file; embed the engine (§2) in `<script id="engine">`; smoke-test that
   `makeRingEngine(RING_MODES.base).dailyBoard(1)` returns a board.
2. Render the static board for all 4 modes (lift from references §5); place pieces from cell ids.
3. Interaction: tap-to-move (roninOptions → shortest-path animate), HOLD, guard reply + intent arrows,
   capture/win detection.
4. Port the shell (§7): modes, daily seed + cache, attempts, share, stats, modals, countdown, practice.
5. Hints + reveal (needs §2.2 done first).
6. Win flourish (§6).
7. Mobile pass at 375px (§5).

---

## 11. QA gate & deploy (mirror v1's release gate)

Before shipping: `node tests/ring-rules.mjs` (24/24), `node tests/ring-parity.mjs` (embedded ==
Node), a spot `node tests/ring-horizon.mjs 365` for any engine touch, and browser-verify every flow
you touched (win, 3-attempt loss, share, storage persist/restore, stats, countdown, practice, mobile
375px, mode switch). **Deploy = add `round.html` to the repo alongside `index.html` (do NOT overwrite
index.html during beta)** + a cross-link between the two pages, then push (deliberate, confirm-first
remote step — Brad has git anxiety; keep it local until he okays the push). Update `STATUS.md`.

---

## 12. Decisions (resolved 2026-07-13) / later

Resolved:
- **Mode names** → easy / normal / hard / brutal (easy = daily default). ✓
- **Beta coexistence** → v2 ships as `round.html` beside the square `index.html`; both live; pick the
  winner after feedback. ✓
- **Stats** → fresh, no migration; square-for-square, round-for-round (distinct localStorage key). ✓
- **Epoch** → puzzle #1 = the v2 launch date; stamp `EPOCH_UTC` at deploy (§8). ✓

Still open:
- **Playtest difficulty feel** — naive-bot % is a floor; confirm the easy daily feels right for humans
  once real people play the beta (that's the whole point of coexistence).
- **Brutal mechanics** — sight-lines / move-4-when-hidden / guards-move-2 / sight-blockers / curved
  stairs. Layer on one at a time through the lab AFTER v2 ships. Full sketch in STATUS.md.
