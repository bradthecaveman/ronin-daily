# RONIN — Project Status

> **Convention:** this file is the source of truth for project state. Update it at the end of
> any session that changes the game, the pipeline, or a decision. Git history records the how;
> this file records the what and why.

*Last updated: 2026-07-24 (custom domain roninpuzzles.com live; Ko-fi donations wired into both
games; round board hidden to focus on square; share strings carry the site link; og-images shipped.
Prior: 2026-07-19
DECISIONS: keep both boards permanently — beta/pick-a-winner framing retired; epic mode's stealth core settled as the square board's identity — vision-only cover, temporary/positional hiding, hold-and-cover guards, "tempo not skeleton key". No code changed — design only. Prior: 2026-07-13 v2 `round.html` deployed as beta, epoch puzzle #1 = 2026-07-13.)*

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
24/24. **v2 ships as `round.html` ALONGSIDE the square `index.html` (both live), not a
replacement** — distinct localStorage namespace so square/round stats never mix. Mode names
easy/normal/hard/brutal (easy = daily default), fresh stats.
**DECISION 2026-07-19: KEEP BOTH PERMANENTLY — the "beta / pick-a-winner" framing is RETIRED.**
Brad: square's gameplay is obvious and works; the circular board adds a dimension he likes
*over and above* the gameplay. They are **independent-but-related, not square-OR-circular — play
either/or.** Two coexisting games sharing DNA, not v1/v2 of one. This makes square a permanent
product (not a fallback awaiting a verdict), which unblocks **epic mode as the square board's
stealth identity** — see the epic section below.
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

## Input unification — round's endpoint-tap ported to square (2026-07-15)

**Direction (Brad): square + round are two STRANDS of the same game, not a bake-off** — players
pick a favourite; both live long-term. So shared language matters: the input model is now unified
on round's (tap a marked endpoint → engine auto-routes → dashed path + guard arrows → tap-again/
MOVE commits; UNDO/Backspace/Escape clear the selection). Square's step-by-step queue is gone —
mechanically the route never mattered (armyReply in both engines sees only the endpoint), so the
queue was pure interaction cost: ~4 precise taps/turn down to 2, and all legal endpoints are now
visible up front as dots. Engine UNTOUCHED (roninOptions/pathTo already existed for solver/hint);
boards/pars/results identical. Hint now sets the selection (incl. hold advice via the out-and-back
pathTo). DELIBERATELY NOT unified, each board keeps its own soul: movement grammar (square =
8-way king moves incl. diagonal stair entry; round = orbit+radial only — diagonals are undefined
between rings of different cell counts) and guard AI (square = chebyshev-nearest; round =
graph-distance-nearest — nearest-by-walking-distance; both present the same player-facing rule,
"two nearest chase, arrows show who"). Changing either engine would alter published boards — red
line. Gates: rules 20/20, parity 40/40. Browser-verified at 375px: endpoint dots, off-centre snap,
capture-warning select (red ring + MOVE ⚠), second-tap commit, UNDO, hint-select, autoWin,
perfect-run par-button hide, help copy still 2 lines/rule.

## UI pass — rules box + par replay (2026-07-15, BOTH games)

Brad's brief: de-emoji the rules box, tighter copy, wider box, and a way to study par after a win.
- **Rules box (square + round):** all emojis removed; every rule reworded to land in exactly two
  lines at 375px (verified by measuring rendered line counts, 6/6 rules × 2 lines in both games);
  modal max-width 420→460px, padding 22→18px, list indent 20→18px, li font 14.5→14px (desktop
  gets wider, mobile text gains width from the trims).
- **"HOW TO GET TO PAR ⛩" (square + round):** the win modal now offers the same solver replay the
  loss modal has, whenever `finalMoves > par` (hidden on a perfect run — nothing to teach).
  `revealSolution(won)` picks the closing line: win → "par N, the old maps' route. Yours: M.";
  loss flow byte-for-byte unchanged.
- Engines untouched. Gates: square rules 20/20 + parity 40/40, ring rules 24/24 + ring-parity
  40/40. Browser-verified at 375px on both games (help line counts; win → button → replay →
  closing message; loss-button markup unchanged).

## Going properly live — share links + og-image (2026-07-24)

Brad's brief: get the games "properly live" and add a way for people to donate. Split into what
needs an account (Brad's) and what is code (here). **Done here, NOT pushed** — the working tree is
release-ready and nothing has touched the remote.

- **Share strings now carry the site link** (both games). New `SHARE_URL` const at the top of each
  UI script (deliberately outside the `<script id="engine">` block so parity is unaffected);
  `shareText()` appends it as a third line. Each game points at ITSELF — square →
  `/ronin-daily/`, round → `/ronin-daily/round.html` — so a shared ◯ result lands on the round
  board, not the square one. This was Roadmap item 3, previously blocked on "once a domain
  exists"; unblocked because Pages 301-redirects the github.io URL to a custom domain once one is
  configured, so links shared now keep working after a domain lands. One place to change per file.
- **Clipboard fallback fixed for the third line:** the catch path used `.replace('\n', ' — ')`,
  which only replaces the FIRST newline, so a 3-line share would have rendered broken in the
  one-line feedback div. Now `.replace(/\n/g, ' · ')`, matching the separator the result line
  already uses.
- **og-image shipped: `og-square.png` + `og-round.png`** (1200×630, one per board) plus the full
  meta set on both pages: `og:image` + width/height/alt, `og:url`, `og:type`, `og:site_name`,
  `twitter:card=summary_large_image`, `theme-color`. Shared links previously rendered as a grey
  nothing on WhatsApp/iMessage/Discord.
  - **How they were generated (repeatable):** scratchpad copies of the two game files with an
    og-composer script appended, rendered by headless Chrome (`--headless --screenshot`,
    `--virtual-time-budget`, window 1300×1300, crop to 1200×630 in PIL). The composer waits for
    `document.fonts.ready` + a rendered board, then draws the REAL board canvas next to the title
    block, so the card uses the game's own art and its own Shippori Mincho. The shipped game files
    were never modified to do this. Note `--headless=new` hangs on this machine; plain
    `--headless` works.
  - The board on each card is that day's real board, not a mock. Regenerate the same way if the
    art direction changes.
- **Gates after these edits: square rules 20/20 + parity 40/40 + bench (0 below band, replay
  10/10), ring rules 24/24 + ring-parity 40/40.** `index.html` re-synced from
  `ronin_daily_v1.html`. Browser-verified: meta tags present, board renders, share text correct on
  all three files (win / loss / perfect, square and round).

**Donations: Ko-fi, WIRED IN 2026-07-24.** Chosen over Patreon (Patreon = recurring membership =
tiers = owing subscribers content monthly; a self-running daily puzzle has nothing to give them).
Ko-fi takes 0% (card processing only). Brad's page: **`ko-fi.com/bradtheronin`**, tip unit named a
"Sausage Roll", "Get all of Ko-fi" 5%-for-features toggle left OFF (keeps 0%), PayPal payout,
one-off tips only (memberships off). Wired into BOTH games as a plain `<a href target="_blank"
rel="noopener">`, **never the embedded widget** (widget = third-party JS = tracking on a page that
has none): footer link ("buy the ronin a sausage roll") + a muted win-screen line ("enjoyed the
rescue? buy the ronin a sausage roll") shown ONLY on a win (`${won ? … : ''}`, never on a loss).
Change the link in one place per file if the Ko-fi handle ever changes.

**Round board HIDDEN 2026-07-24 (Brad's call: ship the square game now, refine round later).** The
square footer's "try the circular board ◯" link is removed (replaced by the Ko-fi link); a comment
marks how to restore it. `round.html` is NOT deleted — still deployed and reachable by direct URL,
just unlinked so players don't discover it. Ko-fi was added to round too (footer + win line) so it's
ready if/when un-hidden. This is why the "ROUND · BETA" copy issue is moot for now — nobody's routed
there.

**Custom domain LIVE 2026-07-24: `roninpuzzles.com`.** Brad bought it (Namecheap, domain only, no
add-ons), pointed the four GitHub Pages A records (185.199.108–111.153) at `@` + a `www` CNAME to
`bradthecaveman.github.io`, set it as the custom domain in repo Settings → Pages (GitHub commits its
own `CNAME` file), and it went green. HTTPS enforce + first-visit confirmation were the last steps on
Brad's side. The github.io URL 301-redirects to the domain, so links already shared keep working.
Note: moving origin reset localStorage-based streaks — done now while the player base is ~nil, as
planned.

## Live

**https://roninpuzzles.com** — custom domain (bought 2026-07-24), served by GitHub Pages, repo
`bradthecaveman/ronin-daily` (public), `index.html` from `main`. The old
**https://bradthecaveman.github.io/ronin-daily/** still works and 301-redirects to the domain. Deploy = `cp ronin_daily_v1.html index.html && git push`;
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
- **epic**: reserved, NOT in UI yet. **Core design RESOLVED 2026-07-19 (see block below);
  original sketch 2026-07-07 kept for provenance.**

  **STEALTH CORE — settled 2026-07-19 (Brad):** epic is the **square board's stealth
  identity**, distinct from the circular game (see the "keep both permanently" decision at the
  top of this file). The mechanic is internally consistent — every piece reinforces one
  intent: **stealth buys tempo, not a free run at the throne.**
  - **Spine = line of sight.** Unseen by ALL guards → Ronin moves 4 (vs 3 when seen). Resurrect
    v17's hidden/canSee. Needs a seen/hidden indicator in the UI.
  - **Sight-blockers are VISION-ONLY** (decision made — was the open fork). Columns block
    sightlines, NOT movement — "cover, not walls." Rationale: the tier/stair topology is
    ALREADY Ronin's movement-constraint system; a second one would just make it more of the
    maze it already is. Vision-only adds a NEW orthogonal axis (where you can *go* vs where you
    can be *seen*) and is what makes the moves-4 bonus load-bearing — it decouples "unseen"
    from "unreachable" so the real decision (short exposed route vs long covered route) exists.
    Fiction agrees: you walk *around* a column. Generator places them; adds daily variety.
  - **Hiding is TEMPORARY & POSITIONAL** — break sight for a beat, gain tempo, guard can walk
    around and re-acquire. NOT a safe pocket you can sit in.
  - **Guard-when-blind = HOLD-AND-COVER** (decision made — the load-bearing AI rule). When no
    guard sees the Ronin, blind guards fall back to DEFEND the approach (gates + up-tier route
    to the Emperor), they do NOT chase the last-seen tile. Rationale: moves-4 is already the
    reward for being unseen; letting guards ALSO abandon posts to chase your ghost stacks two
    rewards on one action, blows the par band, and would make epic easier than hard (backwards).
    Deterministic (daily scores must stay comparable). Final numbers are a lab question; this
    fixes the *intent* the lab tunes toward.
  - **Difficulty floor:** Ronin moves 3; guards step **2 each** (two nearest, two steps — deadlier
    kill radius). Pure tuning, no new UI; the base epic hardness the stealth layer sits on.
  - **Curved stairs — DROPPED from square epic (2026-07-19).** Given to the *circular* board to
    own, since ring gates are already inherently directional; keeping it off square keeps epic
    focused purely on the stealth axis so the two games stay distinct. Not building on square.

  **Build order (per discipline below):** guards-step-2 (floor) → line-of-sight + vision-only
  blockers + hold-and-cover (the stealth core = the identity). That's the whole mode; curved
  stairs is no longer part of it.
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
3. ~~Share-string polish~~ — **link added 2026-07-24** (see the section above); streak emoji still
   unconsidered. Remember to update `SHARE_URL` in both files if a domain lands.
4. Hard mode shelf: grapple, leap-capture, hidden/alerted bonus moves, ronin classes.
5. Later: sound, richer animation, ~~og-image~~ (**done 2026-07-24**), analytics-lite (respecting
   the no-tracking instinct).
6. ~~Ko-fi link~~ — **done 2026-07-24**, `ko-fi.com/bradtheronin` in both games (see above).
7. **`round.html` still says "ROUND · BETA" in its header.** Now hidden (unlinked from square), so
   moot until it's un-hidden — but if it ever goes back on, the beta framing needs retiring
   (decision 2026-07-19: keep both permanently) and needs Brad's wording.
8. **When Brad promotes the game**, the domain move is already done, so no streak-reset worry
   remains — safe to share widely.

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

## ⮕ STEP STONES prototype v3 — `stones.html` (2026-07-19, NOT deployed, untracked)

One-thumb mobile river crossing in the Ronin world: ten seeded rivers toward the castle. Single
self-contained file, no network calls, storage root `ronin.stones.v2` (separate from square/round).

**v3 rebuild after Brad's 2026-07-19 playtest of v2** ("static soldiers = easy chokepoints, only
the archer sidesteps were engaging, monotonous"). Brad chose: MOVING sentries one-at-a-time; more
koi; a 2-token special pool. Design now:
- **Sentries WAKE into a hunter.** Dormant sentries lurk (their reach marked red — stepping into it
  still wakes+strikes same turn). Come within HUNT_RANGE=138 and the nearest wakes and CHASES —
  strictly ONE hunter at a time (Brad's call); others hold. Hunter has stamina 7, then kneels →
  becomes plain terrain (wall opens permanently). **Key tuning: hunter reach 80 < ronin hop 100**,
  so a chase is outrunnable with good routing — the board's gaps supply the difficulty, not raw
  speed. Two earlier v2 pursuit variants (homing, tether) cornered even perfect play; the slower
  wake-chase-kneel loop is the fair version.
- **Reactive strike vs chase-wake are separate:** ANY sentry within reach (80) of your landing tile
  takes you that turn (honest red ticks); the one-at-a-time rule governs only which sentry MOVES.
- **Koi 2–4/river** (Brad wanted more randomness), varied speed/direction; **koi now EAT soldiers**
  on their struck tile — this is what makes BAIT a weapon. Telegraph = bubbles + vermillion ring.
- **Specials — 2 shared tokens/run, any mix** (Brad's "2 tokens, any mix" pick): DASH (leap ~216px,
  ~3 stones) · BAIT (retarget a koi's next strike onto a chosen in-range stone; feed it a hunter
  using the hunter's own intent arrow) · REED (a turn underwater — immune to blade + arrow, NOT the
  koi). All verified: DASH expands reach 6→23 and consumes a token; BAIT sets koi override + eats a
  soldier on the tile; REED survives adjacent hunter + arrow, dies to koi-on-tile.
- **Chase-from-behind soldiers REMOVED** — the wake-chase IS the moving soldier; keeps "one on
  screen at a time." Archers unchanged (volley AT ronin's row, act 3, earlier on late rivers).
  Lily pads (2-turn hold) + leashed tide (≤330 behind) + whorl-grain art all retained from v2.
- **Validation ladder** (in-file bots, `StonesDebug.runAll('naive'|'dodge'|'plan')`, all NO-SPECIALS):
  threat-blind bot loses ALL 10 (t3–11); immediate-dodge bot wins II–V,VII only (real middle tier);
  safe-lane-routing+duel bot wins ALL 10 (16→35 turns). **Bar: every river beatable without spending
  a token** — specials are recovery/expression, not a key. Seeds hardcoded to hold this profile
  (rivers I–VII seeds 37/22/33/44/55/66/77; VIII–X reseeded to 101/177/149).

Status: awaiting Brad's next playtest — deliberately NOT in git, NOT deployed, not linked from
square/round. Open: does the wake-chase-duel feel land on human thumbs (vs bot heuristics), ladder-
vs-daily decision, and whether this art language gets ratified for a wider Ronin redesign (stones
.html is serving as the style tile). Note real-time animation relies on rAF; a backgrounded tab can
stall a hop mid-animation (watchdog recovers when timers fire) — non-issue on a foreground device.

## ⮕ Journey / linked-games idea — BANKED 2026-07-17, NOT actioned

Brad's sketch: several games, each fully standalone, linked as one journey (forge → crossing →
castle → turret) where earlier games earn the ronin coarse boons (extra step / hide / extra
attempt) for later stages. Full self-contained brief: `RONIN_JOURNEY_BRIEF.md`. **Red line
recorded there: carried boons never enter the square/round dailies** (breaks share/par
comparability + the solver guarantees); stones is the sandbox (ladder, no daily contract), and
word game → stones is the first experiment IF ever actioned. The merge-game ("little alchemy")
idea is explicitly split off as its own standalone title, not a chain gate. Idea only — no build;
the brief sits uncommitted alongside stones.html pending Brad's word (repo is public; committing
= publishing the idea).
