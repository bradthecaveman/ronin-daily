# RONIN — Project Status

> **Convention:** this file is the source of truth for project state. Update it at the end of
> any session that changes the game, the pipeline, or a decision. Git history records the how;
> this file records the what and why.

*Last updated: 2026-07-13 (v2 `round.html` DEPLOYED as beta alongside the square game — epoch stamped puzzle #1 = 2026-07-13, cross-links live both ways, all four gates green at deploy)*

## ⮕ Circular board redesign (v2) — DEPLOYED AS BETA (2026-07-13)

Replacing the square grid with a **concentric ring graph** (6 rings + Emperor, 3 tiers). Design
settled on the **grid-tile board** (continuous polar board, thin keylines, single stair-cell gates,
ascending terrace shadows) — see `BOARD_REDESIGN_BRIEF.md` + references `ronin-ring-reference-3.html`
(every-ring gating) / `ronin-ring-reference-3-tier.html` (tier gating) + `ronin-win-flourish.html`
(rising-sun win). The old scattered-stone mockups (`-1b`/`-2c`) are superseded; that look is parked
as the "Step Stone" maze idea.

**v1 (square game) archived** to `archive-v1-square/` as a recoverable fallback; still live/deployed,
untouched. Cell density LOCKED at reference 150 cells (shrink-to-fit mobile, don't reduce cells).

**Engine built + lab-validated in Node (outside Fable), 2026-07-12/13.** New in `tests/`:
`ring-engine.mjs` (graph engine — orbit+gate edges, deterministic graph-distance guard AI, A* par,
seeded gen w/ `genMaxNodes=60000` cap), `ring-config.mjs` (locked 4-mode ladder), `ring-rules.mjs`
(20/20 pass), `ring-horizon.mjs` (+ `ring-lab/diag/ladder.mjs` benchmarks).

**LOCKED difficulty ladder** (all 3-move except epic; guard count is the smooth lever, gating the
medium step, the 3→2 move cliff reserved for epic). Naive-bot win% = ranking floor; needs playtest.

| mode (2026-07-13 names) | board | guards | steps | band | ~naive-win | 10yr result |
|------|-------|--------|-------|------|-----------|-------------|
| **easy** (daily default) | tier | 8/5/3 | 3 | [6,12] | ~60% | ✓ 0/0, mean-par 8.5 |
| **normal** | tier | 10/6/4 | 3 | [7,13] | ~43% | ✓ 0/0, mean-par 9.5 |
| **hard** | every-ring 4-gate | 6/4/2 | 3 | [7,14] | ~31% | ✓ 0/0, mean-par 9.4 |
| **brutal** | every-ring 4-gate | 6/4/2 | 2 | [10,18] | ~21% | ✓ 0/0, mean-par 13.5 |

**10-year horizon (2026-07-13): all 14,600 boards (3650×4) solver-verified — 0 unsolvable, 0
below-band, every mode.** Gen: base 389ms/9.4s, hard 758ms/13.8s, severe 323ms/8.9s, epic 305ms/8.0s
(avg/max; worst-case cached per-day). Re-run after ANY engine change: `node tests/ring-horizon.mjs`.

**Phase 2 DONE (2026-07-13): Fable handover spec written** → `RONIN_v2_FABLE_BUILD_SPEC.md` (complete
build plan). Solver `wantPath` (hints/reveal) + `pathTo` (move anim) added to the engine; rules now
24/24. **Beta plan: v2 ships as `round.html` ALONGSIDE the square `index.html` (both live), not a
replacement** — gather opinions first, pick the winner later; distinct localStorage namespace so
square/round stats never mix. Mode names easy/normal/hard/brutal (easy = daily default), fresh stats.
**Phase 3 DONE (2026-07-13): `round.html` built in Fable.** Single self-contained file, no network
calls beyond v1's font-fallback pattern. Engine embedded 1:1 in `<script id="engine">` (generated from
`tests/ring-engine.mjs` + `ring-config.mjs`; new gate `tests/ring-parity.mjs` proves embedded == Node,
40/40 across all 4 modes; `ring-rules.mjs` still 24/24). Board render lifted from the two references
(tier board for easy/normal, every-ring for hard/brutal), win flourish lifted from
`ronin-win-flourish.html`. Full v1 shell ported and re-pointed at the ring engine: 4-mode switcher
(stats modal), daily seed + per-day/per-mode board cache, 3 attempts, endpoint tap-to-move
(select → dashed path + guard-intent arrows → tap-again/MOVE commits), HOLD, one-lantern hint,
reveal-the-way-in, share string (`RONIN ◯ #N`), stats/streaks, captured/success modals, countdown,
practice mode, `RoninDebug` hooks (+ `playWinFlourish`). Storage root `ronin.round.v1` — fully
separate from the square game's `ronin.daily.v1` on the same origin (verified side-by-side). Guard
arrows/animation use a display-only mirror of `armyReply` cross-checked against the engine reply
every turn (engine stays authoritative). Browser-verified: win (flourish + modal + share + stats),
3-loss day (captured modals, reveal replays par line), hint (incl. hold-hint), practice isolation,
mode switch re-render, done-day reload restore. **Mobile 375px: first pass caught a canvas-overflow
bug (stale viewport width during emulated resize); fixed (layout-viewport read + debounced re-settle
in `resize()`) and screenshot-verified 2026-07-13** — at 375×812: board circle fully inside the
viewport (canvas 351px at x 12–363, zero horizontal scroll), all 150 cells kept, and an off-centre
tap on an outer-ring endpoint still snaps and selects (the 22px tolerance floor is what's active at
this board size). Confirmed on both a fresh load at 375px and a live desktop→mobile emulated resize
with no reload (the original bug path). No code changes; engine untouched, ring-parity re-run 40/40.
**DEPLOYED 2026-07-13 (beta, alongside the square game — single push):** (1) `EPOCH_UTC` stamped:
puzzle #1 = 2026-07-13 — NEVER change it again (it would renumber every player's days and
regenerate their boards); (2) cross-links live both ways ("try the circular board ◯" in the square
footer ↔ "⬅ back to the classic square castle" in round's — square↔round round-trip
browser-verified at 375px); (3) shipped `round.html` + `tests/ring-{engine,config,rules,parity}.mjs`
(so both gates run from a fresh clone) + the cross-linked `ronin_daily_v1.html`/`index.html` + this
file; (4) gates at deploy: square rules 20/20 + parity 40/40, ring rules 24/24 + ring-parity 40/40.
Square engine/boards/stats untouched throughout (the footer link is the square page's only change). Brutal mechanics layer on later, one at a time. Live square game
unchanged/deployed throughout.

## Live

**https://bradthecaveman.github.io/ronin-daily/** — GitHub Pages, repo `bradthecaveman/ronin-daily`
(public), serving `index.html` from `main`. Deploy = `cp ronin_daily_v1.html index.html && git push`;
Pages rebuilds automatically on push to `main` (usually live within ~1-2 minutes; confirmed via
`gh api repos/bradthecaveman/ronin-daily/pages/builds/latest`). No custom domain yet — see Roadmap.

**https://bradthecaveman.github.io/ronin-daily/round.html** — RONIN ◯, the v2 circular board
(BETA since 2026-07-13; puzzle #1 = launch day), live ALONGSIDE the square game while opinions
gather — winner picked later. Separate storage namespace (`ronin.round.v1` vs `ronin.daily.v1`)
so stats never mix; footer cross-links both ways. Deploying a round change = edit `round.html`,
run the ring gates (`ring-rules.mjs`, `ring-parity.mjs`), push.

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

## Difficulty modes — SHIPPED v1.6 (2026-07-07; spec approved by Brad 2026-07-05)

Resolves the difficulty investigation below. Instead of replacing the live game, shipped
**selectable modes**. All checklist items below completed and browser-verified 2026-07-07:
hard-board continuity (snapshot test in rules.mjs, days 1-5 byte-identical), legacy storage
migration (v1 results/hints → modes.hard, legacy players boot into hard, fresh users into
normal), per-mode hints/stats/streaks/board-cache, share tag ⚔HARD, mode switcher in chip row,
practice inherits mode, 3-step queue, mobile 375px. Embedded engine now GENERATED 1:1 from
tests/engine.mjs (python splice) — parity is by construction. Gate: rules 20/20, parity 40/40
(both modes), bench both modes 0 fallbacks + replay 10/10 each. Normal-mode 10-year horizon
completed post-ship: **all 3,650 boards clean — 0 unsolvable, 0 below band.** Par distribution
across the decade: 6×2354, 7×877, 8×322, 9×84, 10×13 (skews easy by design — it's the default
mode). Slowest gen 4.2s (day 2584), no day over 5s, absorbed by the per-day cache. Hard mode's
decade was validated 2026-07-05 and its boards are unchanged (continuity test).

- **normal** (new default): 3-step ronin, par band [6,10], seed salt `0x4E524D4C` ("NRML").
  The benchmarked 73%-naive-win variant.
- **hard**: the exact current live game — 2-step, band [8,14], seed salt `0x524F4E49`
  ("RONI", UNCHANGED so all published hard boards/days stay identical; verify with a
  board-continuity regression test snapshotted BEFORE refactor).
- **epic**: reserved, NOT in UI yet. **Brad's design sketch (2026-07-07):**
  - Ronin moves 3; guards step **2 each** (the two nearest, two steps each — much deadlier
    kill radius; balance must go through the lab).
  - **Line of sight**: if NO guard can see the Ronin, he moves 4 (the stealth payoff —
    resurrect v17's hidden/canSee mechanic). Needs a seen/hidden indicator in the UI.
  - **Sight-blocker obstacles** on the board (new tile type; decide: block movement too, or
    vision only?). Generator places them; adds daily variety.
  - **Curved stairs**: gates can be straight OR curved — curved limits which directions you
    can exit at the top (directional/edge-based legality, not just tile-based; stepLegal
    grows a direction parameter). Routing depth: some gates become nearly one-way.
  Build discipline unchanged: one mechanic at a time through tests/lab.mjs (already
  parameterized for steps/army), solver integration + naive-bot win-rate + par-band tuning
  per mechanic, Brad signs off on the data before each ships.

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

## Visual redesign v1.7 (2026-07-07, Brad's 9-point brief + reference images)

Brad supplied reference images: a traditional Japanese pigment card (粉白 cream / 砖红 brick red /
唐茶 tang tea / 蕉鹃 celadon / 幽冥 dark), a red-sun ronin poster, and a shadowed 3D tile grid.

- **Palette**: rings now tell the infiltration story — celadon forest (outer), tang-tea rooftops
  (middle), cream palace (inner), brick-red throne. Emperor + Ronin are the red faction; guards
  the dark 幽冥 charcoal. All UI chrome (buttons, modals, dots) re-derived from the same card;
  primary action colour is brick red.
- **Elevation**: rings painted as raised blocks with soft drop shadows (terraces), per reference.
- **Walls**: uniform 2px charcoal keylines on all boundaries INCLUDING the outer perimeter
  (was 3.5px, mixed gold/ink, no outer wall).
- **Stairs + emperor tile inset** ~7% inside their cells (rounded corners) so they no longer
  bleed across wall keylines. Stairs are now wood-brown with cream treads.
- **Pieces fill their cells** (radius = cell/2 minus ~2.5px gap). Ronin back to a slash mark per
  Brad — now a *curved* katana arc, cream on red. Emperor: gold sun ring with red core.
- **Typography**: 'Shippori Mincho B1' (Google Fonts — first external dependency; graceful serif
  fallback offline) for RONIN + 浪人, stacked vertically with the three attempt dots (16px)
  centred beneath.
- **Mode switcher moved out of the chip row into the ≡ stats modal** ("difficulty" segment).
- **Instructions**: bold-italic headline "Rescue the Emperor in the tower." + plain second line.
- **Buttons compacted to fit one row on 375px mobile.**

Gate: rules 20/20, parity 40/40 both modes (engine untouched). Browser-verified desktop + mobile,
stats-modal mode switch, hard continuity (day 4 par 8).

## Refinement v1.7.1 (2026-07-07, Brad's follow-up)

- Stairs: tread strokes removed — flat inset wood tiles with their own small lift shadow
  (the wall gap still marks them as gates). Help wording updated ("stair tiles").
- Guards: outline ring removed — flat charcoal discs, red core.
- Board frame removed: the 2px outer wall keyline is now the only border, matching interior
  walls; board itself casts one big soft shadow.
- Consistent light direction: sun top-left, all shadows (rings, stairs, emperor tile, ronin,
  board) fall bottom-right; ring shadows strengthened.
- Ronin slash is a tapered crescent (filled double-quadratic, points at both ends).
- 浪人 kanji removed everywhere (title, header, help, share string).
- Front screen shows only: title, attempt dots, board, instructions, buttons. Day number and
  moves/par now appear ONLY on the end splash (subline "RONIN #N · ⚔ HARD" added there).

Gate: rules 20/20, parity 40/40. Browser-verified mobile + splash content.

**Open visual question (Brad, 2026-07-07):** flat stairs "don't look quite right but not sure
why." Working hypothesis: the lift shadow makes gates read as solid raised blocks (obstacles)
when they should read as openings/passages. Candidate fixes when revisited: recess them
(inner shadow, carved-into-the-wall look), restore treads without the lift, or an arch mark.

## Monochrome art direction v1.8 (2026-07-07, Brad, extended iteration)

Dropped the coloured rings entirely — they carried no mechanical meaning and fought the
reference poster (cream + ink + red). The board is now a single cream luminance ramp; structure
is read from shadows, keylines, and stair gradients alone. Net effect: the red faction (Ronin +
Emperor) is the only saturated thing on the board, so the eye connects "get this red to that red"
instantly.

- **Terraces**: three cream shades (outer→inner lightening toward the throne) with a strong
  top-left sun (shadows fall bottom-right, blur/offset bumped).
- **Pieces** (all): matte lacquered-stone look — soft low-contrast radial bevel (dark core →
  slightly lighter rim, NO bright edge highlight or outline ring), plus a small drop shadow so
  they sit like backgammon stones. Guards lost their red dot (they're the only dark discs, so
  "enemy" already reads). Ronin's slash is now gold (echoes the Emperor — "carries the mission"),
  longer, tapered crescent.
- **Stairs**: full-cell squares (no rounded inset, no drop shadow). Gradient runs up the climb —
  a few shades below the source tier at the foot, landing on the destination tier's exact cream at
  the top (illusion of height, and the stair visually belongs to where it leads). Plus 4 hairline
  treads (1px, matching grid) running across the climb, lightening as they ascend.
- **Captured modal**: "You have been overwhelmed" / "attempt N of 3" / reset line / bold-italic
  "You know their ways a little better now" / button. Centred.
- **Success splash**: header "The Emperor is free" (no emoji); RONIN #N tucked small beneath it;
  result shown as circles matching the board/header dots (green win / red fail), grouped with the
  moves·par line; attempt-distribution bars removed (kept in ≡ stats menu only); countdown +
  practice link grouped.

Engine untouched. Gate: rules 20/20, parity 40/40 both modes. Browser-verified desktop + both
modals + captured/success flows.

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
