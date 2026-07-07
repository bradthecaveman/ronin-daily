# RONIN — Project Status

> **Convention:** this file is the source of truth for project state. Update it at the end of
> any session that changes the game, the pipeline, or a decision. Git history records the how;
> this file records the what and why.

*Last updated: 2026-07-05 (difficulty investigation — DECISION PENDING, see below)*

## Live

**https://bradthecaveman.github.io/ronin-daily/** — GitHub Pages, repo `bradthecaveman/ronin-daily`
(public), serving `index.html` from `main`. Deploy = `cp ronin_daily_v1.html index.html && git push`;
Pages rebuilds automatically on push to `main` (usually live within ~1-2 minutes; confirmed via
`gh api repos/bradthecaveman/ronin-daily/pages/builds/latest`). No custom domain yet — see Roadmap.

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
- **2026-07-05** Bugfix (Brad hit it in play): guards could capture the Ronin *through a wall* —
  the diagonal-fallback capture shortcut skipped the `stepLegal` check. Now the fallback (incl. the
  capture) requires a legal step, so a guard can only reach the Ronin across a ring boundary via a
  stair. Repro + fix covered in `tests/`. Note: this weakened guards slightly, so daily boards
  regenerated (still 100% solvable; par spread 8–13). Side effect: solver search grows with weaker
  guards → worst-case gen ~7s.
- **2026-07-05** Added per-day board cache in localStorage (`store.board = {day, layout}`). Daily
  boards are deterministic, so generate once per day per device instead of on every page load —
  hides the gen-time regression above; reloads are instant. Verified cache matches fresh gen.
- **Clarified rule:** only the **two nearest guards** move each army turn — precisely, the two
  nearest that have a legal step toward the Ronin (a fully-boxed-in nearest guard is skipped for the
  next-nearest). The orange arrows always show exactly which guards will move.
- **2026-07-05** "REVEAL THE WAY IN ⛩" (Brad's idea): after a lost day (all 3 attempts failed,
  daily or practice), the end modal offers an animated replay of the solver's optimal line —
  board resets, the Ronin walks the par path move by move with a move counter, ends with
  "that was the way in… tomorrow, it's yours." Turns a frustrating loss into a lesson + a reason
  to return. Uses the existing solveBoard(wantPath) infrastructure; inputs stay locked during and
  after replay; results already saved so nothing is overwritten. Also fixed capture-flash decay to
  be time-based (was frame-based; stuck at full red on hidden tabs).
- **2026-07-05** 🏮 **Hint** (one per castle): HINT button consults the solver from the *current*
  position and queues the optimal next move (player can take it, undo it, or ignore it); status
  shows moves-remaining-from-here. Spent-state persists per day in localStorage (`store.hints`);
  practice boards get a fresh lantern each. Honesty stamp: using the hint adds 🏮 to the share
  string. Edge messages handled: already beside Emperor ("tap him"), and no-path-from-here (the
  hint spends itself telling you the attempt is doomed — informative on purpose). Scoring is
  otherwise unaffected; hint doesn't cost a move.

## Verified (browser, 2026-07-04)

Win flow, full 3-attempt loss flow, capture determinism (identical captures across attempts),
share text + clipboard fallback, localStorage persist/restore across reloads, stats/streaks,
countdown, practice mode isolation from daily record, mobile 375px layout. Bugs found and fixed
during verification: hidden-tab animation stall, input leaking through modals, retry double-tap
skipping an attempt.

## Visual pass (2026-07-05, Brad: "first visual impression is a little intimidating")

Diagnosis from a fresh look at the live board: the Ronin (the player's own piece) rendered as a
gold circle with a single diagonal line — which reads as a "no entry" sign, not a character —
while 12 bold, high-contrast red-ringed guards dominated the board. The piece you're meant to
identify with was the hardest thing to find; you looked surrounded before making a move.

Changes:
- **Ronin**: replaced the diagonal-line mark with a hooded-figure triangle silhouette (dark ink
  on gold), gave it its own drop shadow and a slightly larger radius — it's now the one piece
  the eye lifts to first.
- **Guards**: smaller radius, thinner ring, no shadow — present but visually secondary.
- **Palette**: lightened bottom/middle tier fills and tier-boundary walls (was near-black,
  now soft charcoal) — board reads as an inviting puzzle, not a war room.
- **Chrome**: cut the permanent two-line rules-reminder footer (fully redundant with the ⓘ help
  modal); restyled controls so HOLD/UNDO are quiet secondary actions and MOVE is the one bold
  primary button, instead of five equal-weight bordered boxes.
- **Bug found in passing**: `#moveBtn`/`#holdBtn` etc. were being silently overridden by the
  `#controls button` base rule — tied on ID count but the base rule's extra type selector gave
  it higher specificity, so the intended button colors (incl. the original indigo MOVE button)
  never actually rendered, even before this session. Fixed by scoping the overrides under
  `#controls #id` (two IDs beats one ID + one type, unambiguously). Worth knowing this pattern
  if future button color changes silently don't apply — check computed styles, not just the
  source CSS.

No engine/logic touched — `tests/rules.mjs` and `tests/parity.mjs` re-run clean after this pass.

## Difficulty modes — APPROVED spec (Brad, 2026-07-05)

Resolves the difficulty investigation below. Instead of replacing the live game, ship
**selectable modes**. If a session dies mid-build, this spec + release gate is everything
needed to finish.

- **normal** (new default): 3-step ronin, par band [6,10], seed salt `0x4E524D4C` ("NRML").
  The benchmarked 73%-naive-win variant.
- **hard**: the exact current live game — 2-step, band [8,14], seed salt `0x524F4E49`
  ("RONI", UNCHANGED so all published hard boards/days stay identical; verify with a
  board-continuity regression test snapshotted BEFORE refactor).
- **epic**: reserved, NOT in UI yet. Future: leap-capture / grapple / sight-line mechanics,
  each solver-integrated + lab-benchmarked one at a time.

Implementation checklist:
1. Engine: `MODES` table; `roninOptions/pathTo/solveBoard` take explicit `steps`;
   `generateFromSeed(seedBase, modeCfg)`; `dailyBoard(day, modeCfg)` = hash32(salt, day);
   practice salt = hash32(0x50524143, modeCfg.salt) combined. armyReply unchanged.
2. Storage v2 + migration: legacy `results/hints` → `s.modes.hard.*` (they were played on hard);
   `s.mode` remembered, default 'normal' for fresh users, 'hard' if legacy data exists.
   Board cache per mode. Per-mode stats/streaks/attempts/lantern.
3. UI: two-segment mode switcher in chip row (guard against switching while busy);
   share string gains ` ⚔ HARD` tag (normal untagged); help copy mentions steps per mode.
4. Tests: parity both modes; rules.mjs + hard-continuity snapshot; bench both modes;
   horizon takes mode arg — re-run 10-year for NORMAL (hard's already validated).
5. Full release gate + browser verify (both modes, switch mid-day, migration, mobile),
   sync index.html, deploy, update this section to "shipped".

## Difficulty investigation (2026-07-05) — resolved by modes spec above

Player feedback (via Brad): **too hard**, especially getting trapped in corners with a guard.
Benchmarked with `tests/lab.mjs` (parameterized engine variants) + `tests/runlab.mjs`. Key metric:
**naive-bot win %** — a greedy 1-ply player (heads for the Emperor, dodges only immediate
captures). Proxy floor for how a casual human fares; humans do better (3 attempts, recon, arrows,
hint).

| Variant | naive win % | par spread |
|---|---|---|
| LIVE game (2-step, band [8,14]) | **14%** | 8–13 |
| B: 2-step, easier band [6,10] | 26% | 6–10 |
| C: strip outer ring (9×9, army 4+2) | 42% | 5–9 |
| **A: 3-step ronin, 13×13, band [6,10]** | **73%** | 6–10 |
| D: 3-step + 9×9 combo | 98% (trivial) | ~4 |

Findings: corner-trap diagnosis confirmed — easier board *selection* (B) barely helps; the issue
is escape velocity (2 steps vs guards closing 1/turn diagonally). The 3rd ronin step is the
dominant lever. 3-deep rings (Brad's option 2) vetoed on mobile tap-size grounds (19×19 ≈ 19px
cells). Stripping the outer ring (option 3) helps less than expected and shrinks the game's
identity; combo (D) collapses the puzzle entirely.

**Recommendation (proposed, NOT yet approved by Brad): variant A** — RONIN_STEPS 2→3,
PAR band [8,14]→[6,10], help-text update ("up to 3 steps"). Expected human daily win rate
~85–95% (Wordle-like). ⚠ This regenerates ALL daily boards incl. already-published days —
acceptable now (day 3, no real audience), unacceptable later once streaks exist.
If approved: apply to HTML engine + tests/engine.mjs mirror, run full release gate, re-run
`tests/horizon.mjs` (10-year revalidation, ~25 min), browser-verify, deploy, update this section.

## Roadmap / open

1. **Playtest difficulty feel** — numbers say par 8–12; needs human confirmation that days feel
   varied and fair. Tuning levers: gate counts, par band, guard start-distance floor.
2. ~~Hosting~~ — **done 2026-07-05**, see Live section above. Next: sanity-check the name "RONIN"
   isn't already taken by another game before buying a custom domain; point domain at Pages once
   chosen.
3. Share-string polish once a domain exists (add link; consider streak emoji).
4. Hard mode shelf: grapple, leap-capture, hidden/alerted bonus moves, ronin classes.
5. Later: sound, richer animation, og-image, analytics-lite (respecting the no-tracking instinct).

## 10-year horizon validation (run 2026-07-05, `tests/horizon.mjs`)

All **3,650 daily boards** (2026-07-04 → mid-2036) generated and solver-verified: **0 unsolvable,
0 below the par band**. Par distribution across the decade: 8×1237, 9×929, 10×633, 11×424,
12×238, 13×118, 14×71 — healthy decay, full band used. 15 days generate slowly (worst 7.2s,
day 169); the per-day localStorage cache makes that a one-time cost per device, hidden behind the
loading veil, so no action needed. Re-run this after ANY engine change (it's the final word on
whether future players ever hit a broken day).

## Release gate — REQUIRED for every change, any session, any model

Before updating `index.html` / committing a gameplay or engine change:

1. `node tests/rules.mjs` — rules regressions (through-wall capture, stair capture,
   two-nearest-guards, tier crossing, determinism). Must pass 100%.
2. `node tests/parity.mjs` — the engine embedded in `ronin_daily_v1.html` and the mirror in
   `tests/engine.mjs` must produce identical boards (40/40). **If you edit the engine in one
   place you must sync the other** — this test is what catches drift.
3. `node tests/bench.mjs` — par distribution healthy, 0 unsolvable, replay validation 10/10.
4. Browser-verify the actual flows you touched (RoninDebug hooks: autoWin, holdUntilCaught,
   useHint, revealSolution, startPractice(seed)).
5. `cp ronin_daily_v1.html index.html`, update this file's decision log, commit.

**Never change without strong justification:** the seeded PRNG (mulberry32/hash32), the epoch,
armyReply's ordering/tiebreaks, or anything that alters daily board generation for dates already
played — that would silently change everyone's past/shared results. Rules changes (new mechanics,
guard behaviour) are design work: benchmark variants through the pipeline first (see the diagonal
guards decision for the pattern) and get Brad's sign-off on the data.

## Debug hooks

In-browser console: `RoninDebug.startPractice(seed)`, `RoninDebug.autoWin()` (solver plays out
the current position), `RoninDebug.holdUntilCaught()`, plus `RoninDebug.G` (live state) and
`RoninDebug.RE` (engine).
