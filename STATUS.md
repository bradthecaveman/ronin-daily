# RONIN — Project Status

> **Convention:** this file is the source of truth for project state. Update it at the end of
> any session that changes the game, the pipeline, or a decision. Git history records the how;
> this file records the what and why.

## Where things stand — 2026-09-25

Read this block first. Everything below it is history, kept in full.

### Live now

- **RONIN ⬛ (the square daily) is live at `roninpuzzles.com`**, on its own domain, with Ko-fi
  tips wired in. This is the public product.
- **RONIN ◯ (the round board) is hidden, not retired.** Unlinked from `index.html` on
  2026-07-24 because it wasn't being played. Still deployed, still reachable by URL, and the
  link is commented out ready to restore. Brad has not given up on it.
- **The live site is twenty-four commits behind this repo.** Everything below is local only, so
  roninpuzzles.com still shows the flat pre-visual-pass board and the old share string.

### No board has changed, and that is proven

Every result, par and past puzzle is byte-identical to what players have already seen.

Most of the work since 2026-07-24 is drawing only. **Two changes did touch more than drawing
and are worth knowing about:**

- **The `<script id="engine">` block was edited on 2026-09-25** to rename the `normal` mode to
  `easy`. Boards are seeded from `mc.salt`, a fixed number, never the mode's name, so nothing
  moved. Verified by fingerprinting 40 days per mode before and after: identical.
  **`easy` must keep `salt: 0x4E524D4C` forever, whatever the mode is ever called.**
- **Stored data gained a schema v3 migration** on the same day, moving player history from
  `modes.normal` to `modes.easy`. Tested against a real pre-rename save.

The release gate was re-run on every commit regardless.

### Fives has moved out

Until 2026-08-09 this repo hosted Fives at `roninpuzzles.com/fives.html`. It now has its own
repo and its own domain, `fivesgame.online`. What remains here is a **215-line signpost** at
`fives.html` pointing at the new address. Its source lives in `~/Desktop/Projects/Links`, and
`Links/STATUS.md` is the source of truth for it, not this file.

### Local-only files, deliberately ring-fenced

`.gitignore` keeps these off the public repo. **They are not junk and must not be cleaned up:**

- `stones.html` — the Step Stone prototype. Parked, and Brad may come back to it.
- `links.html`, `RONIN_JOURNEY_BRIEF.md`, `tests/epic-lab.mjs`
- `CLAUDE.md` — project instructions, ignored deliberately because the repo is public and the
  file names the unpublished work above.

`tests/lab.mjs` is tracked, modified, and deliberately left unstaged. It has been that way for
months. **Do not stage it.**

### Committed locally, NOT pushed — twenty-four commits

**The next push puts all twenty-four live at once.** That is the whole visual pass plus two days
of panel and share work landing on roninpuzzles.com in one go, not just the most recent piece.
That is a bigger call than any single item and it is Brad's.

The visual pass, 09-15 to 09-22, all drawing only:

| | |
|---|---|
| `4f0ee10` | straight-move zigzag fixed |
| `e58cc09` | terrace elevation shadows |
| `72712c2` | gates cut through the walls, variant D |
| `2ddd0df` | the lit edge |
| `3af061d` | piece reflections, guards and Ronin |
| `014dfe6` | throne and flourish written up (docs only) |
| `420dede` | the throne |
| `9dc8650` | the win flourish |
| `e93b656` | flourish retimed, VICTORY! cut |

The design-audit fixes and panel work, 09-24 to 09-25:

| | |
|---|---|
| `9ab6142` | `attempt 1` wrap and eight status-line widows |
| `7a6d22b` | `roll` strand on the win screen at 320px |
| `29839bf` | every control one 80x37 box |
| `79777af` | pop-ups centre on the board (**also touches `round.html`**) |
| `c37e9b0` | statistics panel reworked, par dropped from the loss screen |
| `8ee23d2` | three decisions recorded (docs only) |
| `3d4775f` | fails bar redrawn, end-of-day numbers tightened |
| `d50cd1a` | share string rewritten, gold square for a par run |
| `73da412` | `normal` renamed `easy`, label and key, plus the migration |
| `aa887aa` | easy tag swapped to a dingbat so the share lines align |
| `9aa0dd2` | current-state block rewritten for handover (docs only) |
| `e7b0dc0` | rules box: 3-line card + how-to-play carousel |
| `a92b255` | unpushed count corrected (docs only) |
| `0239847` | carousel rebuilt on the real renderer |
| *head* | ronin walks its route; gate caption rewritten |

Count checked with `git log --oneline origin/main..HEAD | wc -l`, not by counting the rows.

`index.html` was re-synced in every commit that touched it, so source and deployed copy
are identical.

### Working tree

Clean apart from `tests/lab.mjs`, as above.

### Next up

1. **Gate legibility on the board** — the one rules finding this session did NOT close. The
   carousel now teaches the gate rule; whether the gates read clearly on the real board is a
   separate drawing question and is still open.
2. **Brad has one more topic** to open in a fresh session as of 2026-09-25. Not yet named.

**The design-audit list is clear** and **the visual pass is finished.** Nothing is outstanding
on either.

### Decisions that are closed — do not re-open without new information

- **The "You have been overwhelmed" widow**: will-not-fix. A long stranded word does not read
  as a widow to Brad.
- **The difficulty control stays a switch, not a stats filter.** It is the only route a player
  has to hard mode, so filtering needs a new home for switching first.
- **`round.html` is deliberately left behind** on the stats panel, the loss headline and the
  share string. It was only brought along for the modal centring.
- **The loss share keeps par** even though the loss screen no longer shows it.
- **Dead-centre modals**: superseded. Panels centre on the board, which serves the same intent.
- **The rules box does NOT mention par, hint, attempts or hard mode.** All four are already
  on screen at the point they matter. Brad's call 2026-09-25, deliberate under-explaining.
- **The guard copy no longer says "nearest".** It was false on 74% of boards, and the arrows
  only appear after you select, so they answer your move rather than mark a chase.
- **The carousel is three pages, not four.** A scene-setting page teaches nothing and a
  par/daily page was rejected because par is better learned by losing to it.
- **`round.html` keeps the old rules box**, including the false guard line. Brad's call.

### Standing rules

- **The repo is public.** Stage files by name, never `git add .`.
- **`parity.mjs` must pass before any release.** It proves the tuning mirror and the shipped
  engine generate identical boards.
- **Never change a mode's `salt`**, or every past board regenerates.

*Last updated: 2026-09-25 (THE RONIN NOW WALKS THE ROUTE IT DRAWS, and the gate caption
is plain English. Two faults Brad found in the built version: the piece glided straight to the
endpoint over the top of the tiles instead of following the marked route, and the endpoint dots
stayed lit through the move. Both were the carousel not copying `executeMove()`, which queues
one 150ms tween per cell of `selPath` and empties `G.opts` on commit. The carousel now walks
`RE.pathTo` at the same cadence, proved by tracking the red disc through the crop. Gate caption
is now "To cross a wall, step onto the gate itself", picked from three: the old line was not
clear, and it can be this plain because the board draws the bending route itself. Gate clean.
Prior: 2026-09-25 (THE CAROUSEL NOW DRAWS REAL BOARD SECTIONS. Brad saw the
flat CSS-grid version and reversed his own choice: it looked "out of sync visually with what
the person is going to experience". Each page is now a real 4x4 window onto a real position,
painted by the game's own `draw()` — one frame with `ctx` pointed at the page's canvas and
every global restored after. Cost: `const ctx` became `let ctx`, and nothing else in the
shipped path. The gate page improved by being checked rather than assumed: the straight move
through the doorway is NOT refused, the engine returns a route that bends through the gate,
so the board now draws its own detour and the detour is the lesson. Page 3's two destinations
came from `armyReply`, verified capture and non-capture before building. Live board state is
byte-identical after opening the panel, and crop tier colours match `RE.tierOf` cell for cell.
Boards 4x4, down from 5x5. Card's third line is Brad's wording. Gate clean.
Prior: 2026-09-25 (THE RULES BOX IS NOW A 3-LINE CARD WITH A HOW-TO-PLAY CAROUSEL
BEHIND IT. The old box was not long, it was compressed: 105 words in 6 bullets, every bullet
tuned to exactly 2 lines, carrying about 19 facts. A reference card being used as a tutorial.
The card is now 3 rules and the panel dropped from 471px to 342px at 375. Most of what left
was already taught in play, which is why it could go. TWO PARKED FINDINGS CLOSED: the guard
rule no longer claims "the two nearest" (false on 148 of the first 200 boards), and checking
it turned up something bigger, that the arrows are only drawn once you select a destination,
so they were never a chase indicator at all but the guards' answer to the move you are
weighing, which is what the copy now says. And the gate rule is finally SHOWN rather than
worded: carousel page 2 refuses the straight move through the doorway, then steps onto the
gate tile and out. Mini-boards are flat CSS grids reading their colours from COL, placed in
percentages so they scale; verified square and correctly aligned down to a 238px viewport.
NO ENGINE CODE TOUCHED, proven by sha of the `<script id="engine">` block against HEAD:
identical. Gate clean, site-check clean at 1280 and 420 (no widows, no contrast failures,
no overflow). Gate legibility on the real board is the one finding left open.
Prior: 2026-09-25 (SHARE TAGS NOW ALIGN WHEN STACKED. The flower emoji left the
squares 2.16px out of column; the fix was counter-intuitive, because the real mismatch was that
HARD is 3.4px wider than EASY, so the easy mark had to be WIDER than the sword, not matched to
it. Making the sword an emoji made it worse. Shipped `❀` (U+2740, a dingbat not an emoji) at
11.4px against the sword's 8.4px: squares now within 0.43px across four font stacks, EXACT in
monospace where an emoji's two cells can never align, and it cannot render in colour on any
platform. Prior: 2026-09-25 (THE SQUARE BOARD'S `normal` MODE IS NOW `easy`, label and storage
key both, and the share tags BOTH difficulties: `❀EASY` / `⚔HARD`, four characters each, so a
player pasting an easy and a hard result side by side to show progress gets two lines that
match. Brad's reasons: the flower makes easy feel gentle and hard look like something to
graduate to, and a planned EPIC mode for the square board fits the same four-character ladder.
NO BOARD MOVED, and that is proven, not assumed: the seed comes from `mc.salt`, a fixed number,
never the mode's name, and 40 days per mode fingerprint identically before and after. The salt
stays 0x4E524D4C forever whatever the mode is called. Cost was a schema v3 storage migration,
tested against a real pre-rename store: results, hints and the cached board all carried over.
Round keeps its own easy/normal/hard/brutal ladder. Gate clean.
Prior: 2026-09-25 (SHARE STRING REDESIGNED AND BUILT, down from three lines to two.
`RONIN #84 🟨⬜⬜ 6 · par 6` — the squares already said which attempt, so "Rescued on attempt N"
is gone, and a GOLD square now marks a rescue at par, carrying both which attempt and whether
it was clean without lengthening the line. Moves read as `9 · par 6`: Brad ruled out a bare
`+3` for not anchoring the number, and his own `9/6` was dropped because a slash implies a
ceiling so an over-par score reads as a mistake. Par is still named on a loss, which honours
the 09-24 decision and now fits the grammar rather than being an exception. Fixed for free:
`⚔` no longer means both HARD and perfect. Verified across all five shapes plus the clipboard
fallback. Gate clean. Prior: 2026-09-25 (FAILS BAR REDRAWN AND THE END-OF-DAY NUMBERS TIGHTENED. The fails
bar's isolating gap was what made it read as an error, not its colour: it is now evenly spaced
with the attempt rows and drawn as a 1.5px outline in the same red instead of a vermillion
fill. The end-of-day stat numbers move up against SHARE RESULT via a `tight` class keyed off
`statsHtml(includeDist=false)`, 26px to 20px; the remaining 16px is the reserved
"copied to clipboard!" line and stays, because losing it would make the panel jump AND
re-centre on copy. THE SHARE STRING IS UNDER DISCUSSION and nothing has been built: four
directions put to Brad (squares only / par delta / moves-par ratio / a gold square for a par
run), plus a real wart found — the string uses the sword glyph for BOTH `⚔HARD` and
`perfect ⚔️`. Gate clean.
Prior: 2026-09-24 (THREE DECISIONS, NO CODE. The loss share KEEPS par even though the
loss screen no longer shows it, and that difference is deliberate. The stats difficulty
control STAYS a switch rather than becoming a filter: Brad asked for filtering, then reversed
when it emerged that the segment is the only route to hard mode, so filtering would have
needed a new home for switching. And round.html is deliberately LEFT BEHIND on the stats panel
and loss headline, unlike the modal centring earlier today which was mirrored. All three are
recorded below so they are not re-opened.
Prior: 2026-09-24 (STATISTICS PANEL AND LOSS SCREEN reworked on Brad's review, SQUARE
ONLY. Attempt bars now align (fixed 58px label; proportional digits had made `attempt 1`
narrower and started its bar left), a `failed` bar added in vermillion after a gap, zero bars
narrowed to a 22px pill with the 0 centred, the four big numbers moved from system sans 800 to
Shippori 700, and par dropped from the loss headline (the SHARE string still carries it,
deliberately). Also established: the difficulty control does NOT filter the stats, it closes
the panel and switches the board, though stats are stored per difficulty — undecided whether
that should change. `round.html` is NOT mirrored and still lacks even the earlier `attempt 1`
wrap fix. Gate clean.
Prior: 2026-09-24 (POP-UPS NOW CENTRE ON THE BOARD, both games. Brad's ask. Every
panel centres on `#boardFrame` instead of sitting at a fixed 6vh from the top, which had left
short panels riding high: the win modal sat 192px above the board's centre on desktop, stats
164px, while the tall rules panel looked right at 375 only by coincidence. `positionModal()`
sets margin-top from the measured board and panel, clamped both ends so nothing can leave the
screen, and a ResizeObserver re-runs it because the stats countdown fills in after openModal
and left it 7px out. This SUPERSEDES 52cfe4c (07-31), though that commit's reasoning still
holds: window-centre is too low, the board is the thing to cover. Offset is 0px for every
panel on both games at 1280x900 and 375x812. First change to `round.html` in this batch, so
the next push touches it too. Gates clean, square and ring.
Prior: 2026-09-24 (THE DESIGN AUDIT LIST IS CLEAR. Control row evened up on Brad's
call: every control is one explicit 80x37 box, HOLD/UNDO/MOVE/HINT/RESCUE. The stagger was
NOT what the audit said — only MOVE has a larger font (its +1px), while HINT's +2px was the
🏮 glyph's line box, proven by swapping the label. Button padding went 11px to 8px so a
uniform box still fits `MOVE ⚠` (79px) and the bar stays ONE row at 360 and 375; RESCUE lost
its ⛩ to fit, MOVE kept its ⚠ because colour alone is a weaker warning. 320 is two rows as it
already was. `updateButtons()` had to switch from `inline-block` to `flex` or the centring
would have been overridden. Gate clean. Full numbers and the rejected options under "The
control row" below.
Prior: 2026-09-24 (THE DESIGN AUDIT LIST IS DOWN TO ONE ITEM. Ko-fi win line fixed:
`roll` stranded at a true 320px, joined "sausage roll" with a non-breaking space, verified
through the real win path. Two findings CLOSED without code: the "overwhelmed" widow is
Brad's will-not-fix ("overwhelmed is long enough to not feel like a widow", so the test is the
length of the stranded word, not the break), and the `now.` strand is not reproducible at any
real device width. Only the button-row stagger is left and it needs Brad's ruling, since it
may be deliberate hierarchy. **Also found: `scripts/audit.js` labels widths by
`window.innerWidth`, which runs 15px wide in this browser pane, so every width in the 09-18
findings is ~15px off. Use `document.documentElement.clientWidth`.** And a styled probe span
under-reports text set in `<b><i>`; measure the real element. Gate re-run clean.
Prior: 2026-09-24 (TWO DESIGN AUDIT FINDINGS FIXED: the `attempt 1` stats-modal wrap
(one CSS rule, `.dist .row span:first-child{ white-space:nowrap; flex:none; }`) and all eight
status-line widows from 09-18, joined with a real non-breaking space rather than reworded.
Drawing/copy untouched otherwise, byte-exact everywhere but the eight join points. Gate
re-run: rules 20/20, parity 40/40, bench 0 fallback + replay 10/10 both modes. Browser-verified
each fix at its own problem width against the actual fixed source strings. `index.html`
re-synced; ten commits now stacked locally, still none pushed. The "You have been overwhelmed"
widow is CLOSED the same day as will-not-fix: Brad's call, "overwhelmed is long enough to not
feel like a widow", so the test is the length of the stranded word, not the break itself.
Still open from the same audit: the three minor strands (now./roll/button-row stagger).
Prior: 2026-09-24 (FLOURISH RETIMED AND THE CAPTION CUT. VICTORY! is gone: Brad called
it overkill on 09-24, the wash carries the moment and the modal already says it. The modal was
scheduled at dur + hold, which floored it at 1800ms even with hold at 0 and left 1116ms of
motionless board, so it now has its own number measured from the win: modalAt 1250ms, giving
611ms of still board, measured. It also fades up over 500ms, scoped to the end-of-day modal so
the rules and stats panels still snap in. RoninDebug.FX exposed so timings can be retuned from
the console. Prior: 2026-09-22 (THE WIN FLOURISH BUILT, so the square board has a win moment for
the first time: blood wipe out from the throne on a multiply blend, the throne spared, VICTORY!
in the wordmark's treatment at 1296ms, the modal at 3650ms carrying the revenge line, and a tap
anywhere to skip with a 250ms dead zone so the winning tap cannot cancel it. Measured win to
modal at 3637ms against 3650 intended. New debug hooks playWinFlourish and clearFlourish,
matching round's, because autoWin takes 18s to play a day out. Loss path and the finished-day
reload both confirmed untouched. Prior, same day: THE THRONE BUILT: all five decisions plus the pulse ring moved to
.38-.43 to clear the bigger sun, which the spec had not anticipated. Gate green, engine block
proven byte-identical to HEAD, browser-verified desktop and 375px, index.html re-synced,
committed locally and NOT pushed; seven commits now stacked and the next push puts the whole
visual pass live at once. The draw-order question is CLOSED as not mattering: measured 19.0
against 19.8 luminance on a grid line under the shadow, indistinguishable, so it stays where
it was. Prior, same day: THE WIN FLOURISH DECIDED, NOT BUILT: the square board gets a win
moment for the first time. Round pulse out from the throne to the half diagonal so the corners
fill, `#6d0a12` on a MULTIPLY blend (plain alpha goes muddy, not bloody, the darker you push
it), effective alpha .95, flat, throne spared. Wipe 1800ms, VICTORY! lands at 1296ms in the
wordmark's own treatment (Shippori 800 at 0.30em, size fitted to the board), hold 1850ms,
modal at 3650ms carrying "The Emperor's revenge is swift and merciless" with `.modal h2` moved
to Shippori. Tap to skip with a 250ms dead zone so the winning tap cannot cancel it. Also
corrected a wrong finding in the 09-18 design audit: the loss heading does NOT widow on
desktop, the modal text box is capped at 424px and it fits. Prior, same day:
THE THRONE DECIDED, NOT BUILT: gold disc to `cell*.35` with the
core at `.168`, the red tile fills its cell (inset 0, radius 0), the centre tile takes the
tier shadow stack at half length, no lit edge on it, and the wall keyline corners get a 2px
patch. Four sizes and three shadow lengths were rendered off a scratchpad copy; nothing was
built and no file in the repo changed but this one. Also found and measured a real defect
Brad spotted: butt-capped keyline segments leave a 1px hole at nine of the twelve block
corners, missing from the 09-18 audit. One question left open, the centre tile's shadow
draw order. Prior: 2026-09-22 (piece reflections BUILT as variant 1: a hard terminator on the board's own light bearing, cached as a sprite per piece size; the Ronin's katana redrawn on that same curve with its gold light starting at the blade's outer edge. Drawing only, gate re-run, browser-verified desktop and 375px, committed locally and NOT pushed; five commits now stacked. The visual pass is finished. Prior: 2026-09-20 (gates BUILT as variant D: pure tier-to-tier foot, 1px gradient jambs, gate cells cut out of the tier silhouette so the shadow carries the gaps, stair drawn under its tier's shadow and lit back up as it climbs, gate grid line restored, two wall/jamb alignment faults fixed. Drawing only, gate re-run, browser-verified desktop and 375px, committed locally and NOT pushed; three commits now stacked. Prior: 2026-09-18 (terrace shadows BUILT to the signed-off stacked-pass x2 spec, and the #boardFrame box-shadow dropped on Brad's call; drawing only, gate re-run, browser-verified desktop and 375px, committed locally and NOT pushed. Reflections parked on all pieces. Design audit run, findings recorded above and not yet fixed. Prior: 2026-09-15 (straight-move zigzag fixed in `pathTo`, display only, boards proven unchanged against HEAD; committed locally as 4f0ee10 with index.html re-synced, not pushed. Guard-rule wording and gate legibility parked for the rules-section review. Prior: 2026-07-24 (custom domain roninpuzzles.com live; Ko-fi donations wired into both
games; round board hidden to focus on square; share strings carry the site link; og-images shipped.
Prior: 2026-07-19
DECISIONS: keep both boards permanently — beta/pick-a-winner framing retired; epic mode's stealth core settled as the square board's identity — vision-only cover, temporary/positional hiding, hold-and-cover guards, "tempo not skeleton key". No code changed — design only. Prior: 2026-07-13 v2 `round.html` deployed as beta, epoch puzzle #1 = 2026-07-13.))))*

---

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

## The rules box — DECIDED 2026-09-25, build follows

Brad's stated next stage. The three findings parked against it are addressed below.

### What was actually wrong

Not length. Measured at 375px the old box was **105 words in 6 bullets, every bullet exactly
2 lines, 471px tall, 56% of the phone screen**. The fault was compression: those 105 words
carried about **19 separate facts**, because the 2026-07-15 pass tuned every rule to land in
exactly two lines. The Move bullet alone said tap a marked cell, 3 a turn, 2 on hard, tap
again to commit, and HOLD waits. It was a reference card being used as a tutorial.

Most of it was already taught in play, at the moment it matters:

| bullet | already on screen |
|---|---|
| Move | status line, `ronin_daily_v1.html:1680`, plus "Tap again, or hit MOVE" on select |
| Rescue | "Beside the Emperor, tap him (or RESCUE) to finish" |
| Daily | the three attempt dots, and "Attempt N" in the status line |
| Hint | the HINT button is visible and disables after use |
| Walls | "Out of reach this turn, cross walls at the stair tiles" on a bad tap |
| Guards | arrows are drawn live, but the stated rule was wrong |

### The shape: a short card, with a carousel behind it

Brad picked this over a carousel alone, and over a short card alone. The box serves two
people: it **auto-shows on first visit** (`seenHelp`) and it is what the `?` button opens for
someone thirty days in. A carousel alone is good for the first and irritating for the second.

- **The card** is the premise line plus **three rules**, about 58 words, down from 105.
- **"show me how"** opens a **three-page carousel** in the same panel.

Card copy, as signed off:

> Tap a marked cell to plan your move, then tap again to take it.
> The walls open only at the **stair tiles**.
> Planning a move shows the guards' counter. **Avoid capture.**

The third line is Brad's own wording, tightened. It replaced a longer line about arrows.

**Par, hint, attempts and hard mode are deliberately absent.** All four are already on screen
at the point they matter. Brad's call, consistent with letting players work it out.

### Two parked findings, now resolved

**The guard rule was false, and the fix makes it more useful.** The old copy said "the two
nearest chase each move". `armyReply` (`ronin_daily_v1.html:281`) sorts by chebyshev distance
**straight through walls**, so the two movers are not the two nearest by walking distance on
**148 of the first 200 boards (74%)**. A second, larger point emerged while checking it: the
arrows are only drawn when a preview exists (`ronin_daily_v1.html:1015`), which means **they
appear after you select a destination**. They were never a chase indicator. They are the
guards' answer to the move you are considering, which is the actual tactical loop of the game
and is now what the copy says. No engine change, so no board moves.

**The gate rule is now shown rather than worded.** A gate is a tile you must stand on, not a
gap in the wall, so from one tile outside a door the diagonal through it is legal and straight
ahead is blocked. `stepLegal` sits under the generator and cannot be changed without
regenerating every published board, so the fix was always going to be visual. It is carousel
page 2, and it is the reason the carousel exists at all.

**Still parked: gate legibility on the real board.** If a tutorial page is needed to teach
gates, that is evidence the gates may not read clearly on the board itself. That is a drawing
question, deliberately out of scope here, and it stays open.

### The carousel, as signed off

Three pages, one rule each, every page a rule you can get wrong. A fourth scene-setting page
was rejected for teaching nothing, and a par/daily page was rejected because par is better
learned by losing to it.

1. **Moving** — the token steps three cells including a diagonal. *Up to three cells a turn,
   straight or diagonal.*
2. **Walls and gates** — the token tries the diagonal that cuts the doorway, is refused, holds
   a beat, then steps **onto** the gate tile and out the far side. *A gate is a tile you stand
   on, not a gap you pass beside.*
3. **Guards** — a destination is picked, two arrows answer, one lands on it and the ronin takes
   a red ring; a second destination is picked and the arrows fall elsewhere. *Pick a move and
   the arrows answer.*

### How it is built — REVERSED 2026-09-25 after Brad saw it

**First attempt: flat CSS-grid mini-boards reading their colours from `COL`.** Brad picked
that option knowing it would not carry the terrace shadows. On seeing it built he reversed:
*"this fake board looks incongruous... they look out of sync visually with what the person is
going to experience."* He was right, and the first version is gone.

**What ships instead: the game's own `draw()`, pointed at the carousel's canvases.** Each
page is a real 4x4 window onto a real position on the real 13x13 grid. For one frame the
panel swaps `ctx` for a page's canvas, sets `cell`, installs the scene in `G`/`vis`/`preview`,
calls `draw()`, then puts every global back. So the tiers, terrace shadows, lit edges, stair
treads, endpoint dots, route and guard arrows are not reproductions. They are the board.

**The only shipped-code change this needed was `const ctx` to `let ctx`** at
`ronin_daily_v1.html:604`. `draw()` turned out to be entirely canvas-agnostic: it reads only
`G.busy/layout/opts/phase/ronin/sel/selPath`, `vis.ronin/army`, `preview`, `flashT` and pure
`RE` helpers, with six balanced `save`/`restore` pairs and no `setTransform`. The one
`canvas.width` reference in that region belongs to `playWinFlourish`, not the draw path.
Verified: after opening the panel the live board's state is byte-identical, and the crops'
tier colours match `RE.tierOf` cell for cell.

**The gate page got better by being made honest.** The first version animated the straight
move through the doorway being *refused*. The engine says otherwise: `(7,2)` IS a legal
endpoint from `(7,1)`, because `roninOptions` has three steps to play with. What it returns
is the route `[(6,2), (7,2)]` — it bends to stand on the gate first. So the page now selects
that cell and lets the board draw its own detour. **The detour is the rule**, and nothing is
staged. Had this been drawn by hand the page would have taught something the game does not do.

**Page 3's two destinations were chosen from `armyReply`, not by eye.** From `(6,1)` with
guards on `(4,2)` and `(7,2)`: selecting `(6,2)` is answered by `7,2 → 6,2` and is a capture;
selecting `(5,1)` is not reachable by either. Both verified before being built.

Windows used, all rows 4-7: page 1 cols 0-3 (outer tier and one wall), pages 2 and 3
cols 1-4 (outer, wall, middle, wall, inner, with the gate at `(6,2)`).

Boards are 4x4 at 50px, down from 5x5, on Brad's call to save space.

### Two fixes on Brad's review of the built version

**The ronin now walks the route it just drew.** It was gliding straight from start to
endpoint, over the top of the tiles, ignoring the marked route. `executeMove()`
(`ronin_daily_v1.html`) queues **one 150ms tween per cell of `selPath`**, so the real ronin
steps through the route. The carousel now calls `RE.pathTo` for the endpoint and walks that
list at the same 150ms per step with the same easing, which also removed the hand-chained
hops on the gate page. Proved by tracking the red disc's centroid through the crop: it holds
column 0 through `(6,0)` and `(5,0)` before turning to `(4,1)`, where a straight glide would
have been at column 0.33 and 0.67.

**The endpoint dots now go out while the ronin moves.** `executeMove()` sets `G.opts = []`
on commit; the carousel was recomputing them every frame, so the dots stayed lit through the
move. Found while tracking the centroid, because the pips' red was polluting the sample.

**Gate caption rewritten.** *"A gate is a tile you stand on, not a gap you pass beside"* was
not clear, which Brad flagged. The rule, from `stepLegal`: a step that changes tier is legal
only if the square you leave **or** the square you land on is a stair. So the gate is a square
you have to occupy at one end of the crossing step, not a hole in the wall. Stand one square
to its side and you cannot cross at all, not even diagonally through the doorway. Now reads
**"To cross a wall, step onto the gate itself."** Brad picked it from three. It can be that
plain because the board now draws the bending route, so the caption only names what was
just watched.

**`round.html` is deliberately left behind again**, on Brad's call, consistent with the
09-24 decision. Its help still carries the same false guard line.

## "normal" becomes "easy", DECIDED AND BUILT 2026-09-25

Brad asked what renaming the square board's `normal` mode to `easy` would cost, so the share
line could tag both difficulties at a matching width. **Decision: rename both the label and
the storage key, tag both difficulties, and use a flower for easy.** Recorded before building.

### Why it is cheap, and the one thing that made it so

**Boards do not move.** `dailyBoard(dayNum, mc)` is `generateFromSeed(hash32(mc.salt, dayNum), mc)`
— seeded from **`mc.salt`, a fixed number**, never from the mode's name. `easy` keeps
`salt: 0x4E524D4C`, so every board, par and past result is untouched. This is what keeps the
change clear of the epoch/PRNG red line in `CLAUDE.md`. **The salt must stay `0x4E524D4C`
whatever the mode is ever called** — its `// "NRML"` comment is now historical, not a label.

**The word was only ever visible in one place**, the difficulty segment on the stats panel.
It is not a site-wide rename: of the five occurrences in the file, four were code.

### What the rename does cost

**A storage migration, and this is the real work.** Player results, streaks and hints live
under `s.modes.normal`. Renaming the key without moving the data does not merely lose history,
it throws: `modeState(s).results` would read `.results` of `undefined` on load. `migrate()`
already exists for the v1→v2 schema move and gains the v3 step: move `modes.normal` to
`modes.easy`, map `s.diff`, and carry the `boardCache` slot across so the first load after the
update does not re-run the solver. The board cached under `normal` is still valid because the
salt did not change.

### The decisions inside it

1. **Both difficulties get a tag**, so `❀EASY` now appears where the default previously had
   nothing. This costs about seven characters on the majority of shares, accepted deliberately:
   **Brad's players paste an easy and a hard result side by side to show progress**, which only
   reads if both are labelled.
2. **`EASY` and `HARD` are both four characters**, which is the typographic reason the rename
   was worth doing rather than just tagging `NORMAL`. **An `EPIC` mode for the square board is
   planned**, and it fits the same four-character ladder.
3. **A flower against the sword**, the first non-martial glyph in a set of swords, lanterns
   and torii, chosen on purpose: it makes easy read as gentle and is meant to make hard mode
   look like something to graduate to. **Shipped as `❀`, a dingbat, not the `🌸` emoji** —
   see the alignment section below for why the emoji could not line up.

### Verified

- **No board moved, proven rather than assumed.** 40 days of boards per mode were fingerprinted
  (par, ronin start, every guard position, every stair) before and after the rename, keyed by
  salt so the comparison survives the name change. Both digests identical:
  `salt_4e524d4c: 445751e8…`, `salt_524f4e49: c6e0865d…`.
- **Gate clean under the new name**: rules 20/20, parity 40/40 across `[easy, hard]`, bench 0
  fallback boards and replay 10/10 in both modes.
- **The v3 migration works on a real pre-rename store.** Planted one with 22 results, a hint
  and a cached board under `modes.normal`: all 22 results, the hint and the cache came across
  to `easy`, `modes.normal` was removed, `s.diff` mapped to `easy`, hard was untouched, and the
  stats panel rendered the migrated history correctly (22 played, 86%, best 19, 12/5/2/3).
- **The older v1 path still works**: a store with no `modes` at all still lands its history in
  hard and sets `diff` to hard.
- No console errors on any of those loads.

### The tags align, and the fix was the opposite of the obvious one — RESOLVED 2026-09-25

The first build paired `🌸EASY` with `⚔HARD` and the columns were out by 2.16px, enough to
shift the squares when two results are pasted one under the other, which is exactly how Brad's
players show progress.

**The obvious fix was wrong.** Making the sword a full emoji (`⚔️`, via a variation selector)
made it *worse*, because the mismatch was never really the glyphs: **`HARD` is 3.4px wider than
`EASY`** in a proportional face. The easy mark has to be *wider* than the sword to cancel that
out, and an emoji flower is 14px against the sword's 8.4px — too wide, in the wrong direction
to help.

**The answer is `❀` (U+2740 WHITE FLORETTE), a dingbat rather than an emoji.** At 11.4px it is
about 3px wider than `⚔`, which is very nearly the exact compensation needed.

Measured across four font stacks on a complete line, worst-case gap between the two:

| easy mark | system-ui | Helvetica | Segoe/Roboto | monospace | worst |
|---|---|---|---|---|---|
| `🌸` (first build) | 2.2 | 3.0 | 3.0 | 5.6 | **5.6px** |
| `✿` | −0.3 | 0.6 | 0.5 | 0 | 0.6px |
| **`❀` (shipped)** | **−0.4** | **0.4** | **0.4** | **0** | **0.4px** |

The squares now start within **0.43px** of each other, against 2.16px before, and with equal
scores the two lines are an identical 31 characters.

**Two reasons a dingbat beats an emoji here, both worth keeping:**

- **In monospace it is exact.** An emoji occupies two cells, so `🌸EASY` can never align with
  `⚔HARD` in any monospaced context. A dingbat takes one cell, like the sword, so the gap is
  0 — see the monospace column above.
- **It cannot turn colour.** `❀` is a Dingbat with no emoji presentation, so it stays
  monochrome on every platform. That matches the sword's world, which is what Brad asked for.

**One platform risk that remains, and is not ours to fix.** `⚔` (U+2694) *is* in the emoji set
with default text presentation, so a platform that force-renders it in colour would widen it
and break the alignment from the other side. `❀` has no such ambiguity. Nothing to do about it
beyond knowing it.

**Re-measure before swapping either glyph.** The balance is a coincidence of three widths, not
a property of flowers and swords.

### Deliberately not changed

- **`round.html` keeps its own four-mode ladder** (easy / normal / hard / brutal) with its own
  salts. The two games now disagree about what the names mean; round is hidden, and this
  follows the 09-24 "leave round" call.
- **The end-of-day panel's `splashSub` still shows `· ⚔ HARD` and nothing for easy.** Brad's
  ruling was about the share string. Tag it there too only if asked.

## The share string, REDESIGNED AND BUILT (2026-09-25)

Brad's brief: the one-line modifier example in the screens sheet was more elegant than the
real thing, and "rescued on attempt 1" just writes out what the squares already say. Settled
over a conversation; the decision was recorded before anything was built, then built.

**Verified live** against all five shapes by driving `shareText()` through each state: par win,
over-par win, a win on attempt 2, a loss, and hard-with-a-hint. Each produced its intended
string exactly. The clipboard fallback (breaks swapped for middots) was checked too and reads
`RONIN #84 🟩⬜⬜ 9 · par 6 · https://roninpuzzles.com/`.

### The format

```
RONIN #83 🟨⬜⬜ 6 · par 6          rescued at par, first attempt
RONIN #83 🟩⬜⬜ 9 · par 6          rescued over par, first attempt
RONIN #83 🟥🟥🟥 par 6              lost
RONIN #83 ⚔HARD 🟩⬜⬜ 🏮 9 · par 6  hard, and a hint was spent
https://roninpuzzles.com/
```

**Two lines, down from three.** The whole result is one line plus the link.

### The four decisions inside it

1. **"Rescued on attempt N" is gone.** It was the squares written out in words. 🟩⬜⬜ already
   says attempt 1, so the sentence was pure duplication.
2. **A gold square marks a par run.** Gold is the Emperor's own colour in the board palette.
   This is the part that earns its place: it carries *which attempt* and *whether it was
   clean* in a glyph that already exists, so the string gets no longer. Rejected alternatives
   for the same job: a separate `⭐`/`⛩` appended, and giving par its own fourth square —
   **the squares row encodes attempts, three slots, and a fourth would break the grammar that
   makes the silhouette readable.**
3. **Moves read as `9 · par 6`, not `9/6` and not `+3`.** Brad ruled out the bare delta
   because it does not anchor the number. `9/6` was his own suggestion and was then dropped:
   a slash means "out of", which implies a ceiling, so a score above par momentarily reads as
   a mistake. `9 · par 6` is the phrasing the modal headline already uses and the middot is
   already the share fallback's separator, so it needs no decoding.
4. **A par run still spells out `6 · par 6`.** Redundant against the gold square, deliberately:
   every share then has the same shape and nobody has to re-learn the format.

### Two things this fixed for free

- **The sword collision is gone.** The old string used `⚔` for HARD and `⚔️` for perfect, the
  same glyph for two unrelated meanings in one line. Perfect is now the gold square, so `⚔`
  means hard and nothing else.
- **Par survives on the loss line**, which was the 2026-09-24 decision ("the share keeps par",
  even though the loss *screen* dropped it). It now fits the grammar instead of being an
  exception: par is named on every result, and moves appear only when there are any.

## Statistics panel and the loss screen, BUILT (2026-09-24, SQUARE ONLY)

Brad reviewed the panels as a set and called five things. Four were changes, one was a
question that turned out to matter.

### What changed

1. **The bars now line up.** The three attempt bars started at different x positions because
   the label is proportional-digit text: `attempt 1` measured narrower than `attempt 2` and
   `3`, so its bar began further left. The label now has a **fixed 58px width** plus
   `font-variant-numeric:tabular-nums`. 58px is exact: measured label scroll width is 58px,
   so nothing clips. All four bars now start at the same x, verified.
2. **A fails bar.** `calcStats()` returns `fails: played - wins`, meaning days finished with
   no rescue at all. `maxD` now includes `fails` so all four scale together.
   **Revised 2026-09-25 after Brad saw it.** The first build separated it by a 10px gap and
   filled it with `--vermillion`; he read that as "too close to what we have and looks like
   an error". It is now **evenly spaced with the other rows (21px step, measured) and drawn
   as a 1.5px outline in `--indigo`**, the same red as the attempt bars, with the number in
   that red rather than white. The rule it is following: it should read as a sibling of the
   attempt rows that is measuring something else, not as a fault or a fourth attempt.
   The isolating gap was the part that made it look wrong, not the colour.
3. **Zero bars are narrower, with the 0 centred.** A zero bar was a percentage-width pill
   (~34px) with the number shoved to its right edge. Zero now takes a **fixed 22px** pill
   with `text-align:center`, measured at 8px of space either side of the glyph.
4. **The big stat numbers are Shippori now.** They were the body system sans at weight 800,
   which is why Brad read them as thicker and less refined next to the wordmark. Now
   `Shippori Mincho B1` at 700, the same face as the masthead and the modal headings.
5. **The loss screen no longer names par.** `The Emperor waits… (par N)` is now just
   `The Emperor waits…`. **The shared text still carries par** (`shareText()` is a separate
   string). **DECIDED 2026-09-24: leave the share alone.** The two are deliberately different:
   par is noise on the screen of someone who just lost, but it is the tease that makes a
   shared loss worth answering. Do not "tidy" this into consistency.

### The end-of-day numbers sit closer to SHARE RESULT (2026-09-25)

Brad asked to close the gap between the big numbers and the SHARE RESULT button above them.
`.statgrid` is shared with the Statistics panel, so the tightening is **scoped by the signal
that already exists**: `statsHtml(includeDist)` is called with `false` only from
`showEndModal`, so that call now adds a `tight` class. `.statgrid.tight` drops the top margin
from 14px to 4px.

**Most of the gap was not the margin.** Measured, it was 26px made of three parts: 6px of
`#shareFeedback` margin, its 16px `min-height`, and the 4px grid margin. The margin is gone,
giving **20px**. The 16px is the reserved line for "copied to clipboard!" and is **staying**:
without it the panel changes height when you copy, and since the panel now re-centres on the
board via a ResizeObserver, that would move the whole thing rather than just grow it. To go
below 20px means accepting that jump, which is a worse trade. Not done.

### The difficulty control is a switch, not a filter — CLOSED 2026-09-24, leave it

Brad asked whether pressing it shows that difficulty's stats. **It does not.** `setDiff()`
writes the new difficulty, then calls `closeModal()` and `startDaily()`: the panel closes and
the board is replaced with that difficulty's castle for today.

Stats *are* per difficulty — `calcStats()` reads `modeState(readStore())`, which is
`s.modes[G.diff]` — so reopening the panel afterwards does show that difficulty's figures.

**Brad first asked for it to filter in place, then reversed and left it as it is, once the
cost was on the table.** The cost: `modeSegHtml` is rendered in exactly one place, the stats
panel (`ronin_daily_v1.html:1637`), so that segment is **the only way a player can reach hard
mode at all** — `RoninDebug.setDiff` is a debug hook, not player-facing. Making it a filter
means inventing somewhere else for switching to live, which is a bigger change than the wart
is worth.

**Do not re-propose filtering without also answering where switching goes.** The three shapes
already considered and declined: a PLAY HARD TODAY button that appears when viewing the other
difficulty; a permanent "playing normal today · switch" line; and moving the choice to the
rules panel.

### Not mirrored to round — DECIDED 2026-09-24, leave round alone

`round.html` has the same panel and the same loss headline (`round.html:1304`), and none of
this was applied there. It also **never received the 09-24 `attempt 1` wrap fix**, so that
original defect is still live on the round board.

**Brad's call: leave round.** Note this diverges from the modal-centring change earlier the
same day, which he did want mirrored — the difference is that centring was a fault on every
panel, while this is a set of refinements to a board nobody is currently playing. So the two
games are now deliberately out of step on the stats panel and the loss headline. Anyone
picking round back up should read this section first.

## Pop-ups centre on the board, BUILT (2026-09-24, BOTH GAMES)

Brad: "can we make sure the rules board and the win modal, basically any of the other windows
that pop up, can we centralise those to the board." Every panel now centres on `#boardFrame`
rather than sitting at a fixed distance from the top of the window.

### This revisits 52cfe4c, and the reason it existed still holds

On 2026-07-31 the modals were moved from dead-centre to `align-items:flex-start` with a 6vh
top pad, because dead-centre "read as too low": the board sits high on the page, so a panel
centred in the *window* left a band of dimmed empty space below it.

**That complaint was right, and centring on the board is a better answer to it than 6vh.**
Window-centre is too low; a fixed top pad is only correct for one panel height. The board is
the thing the panel should cover, so centre on that. Dead-centre is still wrong and should
not be re-proposed.

### Why the shorter panels looked worst

Every panel was pinned at the same top regardless of its height, so the shorter it was, the
higher it rode. Measured before the change:

| panel | height | above the board's centre, 1280x900 | at 375x842 |
|---|---|---|---|
| win modal | 227px | **192px** | 139px |
| stats | 283px | **164px** | 94px |
| rules / help | 471px | 70px | 0px |

The rules panel looked right at 375 purely by coincidence: 6vh of an 842px window happened to
land its centre on the board's. That is why this read as "some of them are off" rather than
"all of them are off".

### How it works

`positionModal()` measures `#boardFrame` and the panel, then sets the panel's `margin-top` so
the two centres line up. `#overlay` keeps `align-items:flex-start` and its 16px pad is now
only the clamp floor, not the resting position.

- **Clamped both ends**, so a panel taller than the space can never run off screen:
  `max(16, min(ideal, innerHeight - height - 16))`.
- **Called on open, on resize, and from a `ResizeObserver` on `#modal`.** The observer is not
  optional: the stats countdown fills in *after* `openModal` returns and made the panel 14px
  taller, which left it 7px off centre until the observer re-ran it. SHARE's feedback line
  does the same thing.
- Round's debounced re-settle calls it twice, matching how that game already re-runs `resize`.

### Verified

Offset from the board's centre is **0px** for every panel on both games: splash, rules, stats,
attempt-failed and the win modal, at 1280x900 and 375x812. Nothing clipped at either end.

Clamp checked at deliberately short windows, where `max-height:88vh` does most of the work:
at 375x500 the rules panel caps at 440px and sits 44 to 484 with internal scroll; at 320x360
it caps at 317px and sits 27 to 344. No page overflow at any width checked.

## The control row — one box for every control, BUILT (2026-09-24)

Brad: "lets give every control the same explicit width and height." Every control is now
**80 × 37px**: HOLD, UNDO, MOVE, HINT and RESCUE.

### What was actually causing the stagger

The 09-18 audit blamed "MOVE and HINT use larger font sizes". Half right. Measured on a live
board: HOLD and UNDO 35.5px, MOVE 36.5px, HINT 37.5px.

- **MOVE's +1px is the font**, 13.5px against everything else's 12.5px. That is deliberate
  hierarchy and it survives the change — MOVE still reads larger inside the same box.
- **HINT's +2px was the 🏮 glyph**, not the font. Its font-size is 12.5px, identical to
  HOLD and UNDO. Swapping the label to a plain "HINT" dropped it to exactly 35.5px. An emoji
  carries a taller line box than the text beside it, and with `line-height:normal` that sets
  the button's height.

An explicit `height` fixes the class of bug, not just this instance: no future glyph or label
can set the row's height again.

### The width problem, and why RESCUE lost its ⛩

Natural widths, measured with `min-width` off: HOLD 62.4, UNDO 63.8, MOVE 66.8, **MOVE ⚠
85.0**, HINT 73.1, **RESCUE ⛩ 97.1**. The trailing glyphs are what make the two wide ones
wide: the ⚠ costs MOVE 18px and the ⛩ costs RESCUE 17px.

One row of four needs each button under **84.2px at 375, 80.5px at 360, 70.5px at 320**
(viewport minus 20px container padding and 18px of gaps, divided by four). So a uniform box
big enough for `MOVE ⚠` at the old padding would have pushed the control bar onto two rows on
every common phone, where it is one row today.

Resolved by trimming the button padding from `9px 11px` to `9px 8px`, which takes `MOVE ⚠`
to 79px and fits an 80px box with room, **and** dropping the ⛩ from RESCUE. Brad picked this
over the alternatives. The ⚠ on MOVE was deliberately kept: the red `.danger` fill carries
the same warning, but colour alone is a weaker signal than colour plus a glyph.

**Rejected, with the numbers:**

- **A 92px uniform box keeping every glyph.** Honest uniformity with no label changes, but
  the bar wraps to two rows at 375 and 360. Rejected: those are the common widths.
- **Leaving RESCUE at its own 97px** as a deliberate exception. Rejected because Brad asked
  for *every* control to match.
- **`align-items:stretch` on `#controls`.** A one-word fix that equalises heights only, but
  it lets the lantern's accidental line box set the height for all of them.

### Verified

All five controls measure exactly 80 × 37 including `MOVE ⚠` and the gold RESCUE, with every
label on **one line** and no overflow in either axis (widest label is `MOVE ⚠` at 60px of ink
inside an 80px box). Control bar is **one row at 1280, 375 and 360**. At 320 it is two rows,
which it already was: the four natural widths summed 285.3px against 320 − 38 = 282 available.
No horizontal page overflow at any width checked.

**One implementation trap.** `updateButtons()` shows HINT and RESCUE with
`style.display = 'inline-block'`, which would have overridden the `display:flex` that centres
the label inside the fixed box. Both now set `'flex'`. Anything else made visible from JS
needs the same treatment.

## The win flourish — BUILT (2026-09-22)

Built exactly to the spec below. Drawing and timing only: the `<script id="engine">` block is
byte-identical to the previous commit, so no board, par or result has moved.

Gate at build: **rules 20/20, parity 40/40, bench exit 0 with zero fallback boards in both
modes and replay 10/10 in both.**

**New debug hooks.** `RoninDebug.playWinFlourish()` runs the wipe on the board as it stands
without having to win first, and `clearFlourish()` puts the board back. Both match what the
round board has always had. `RoninDebug.FX` is also exposed live, so the timings can be
retuned from the console without editing the file. Use these rather than `autoWin()`, which
takes about 18 seconds to play a day out.

### Verified, and these are the ones that could have gone wrong

- **The modal lands where it should.** On a clean run the game finalised at 17698ms, the
  3650ms timer registered at 17683 and fired at 21334, and the overlay opened at 21335.
  **Gap from win to modal: 3637ms against the intended 3650.**
- **The skip guard holds.** A tap 121ms after the win is ignored, which is the case that
  matters: the tap that wins the game must not cancel the thing it just triggered. A tap at
  902ms opened the modal 2ms later instead of at 3650ms.
- **A skip lands on the finished frame, not a frozen half-wipe.** After skipping at 902ms the
  board read washed at the corner and mid-board, with the word fully drawn.
- **Reloading a finished day does not replay it.** The restore path calls `showEndModal`
  directly rather than going through `finalizeDay`, so the board comes back clean with the
  modal on top. Measured: corner 207.2, which is the unwashed board.
- **The spared throne is exact, not approximate.** At 375px, five probe points across the
  throne tile are pixel-identical with the wash up and with it down. It is blitted back from
  the snapshot at 1:1, so there is no resampling.
- **The corners really are covered.** `maxR` is the half diagonal, which only just reaches
  them, so this was worth checking rather than assuming. Fifteen samples along the top-left
  diagonal and the top edge all read washed at 700ms.
- **The loss path is untouched.** `attemptFailed` handles attempts 1 and 2 with its own modal
  and never reaches `finalizeDay`; the third goes through it and takes the `!won` branch,
  which keeps the original 650ms and never starts a flourish.
- Browser-verified at desktop and 375px. At 375px the board is 325px and the word measures
  210px of ink across it.

### One pre-existing wart this made visible

On a win the status line under the board still reads whatever it said during play, usually
"Beside the Emperor, tap him (or RESCUE) to finish". `finalizeDay` has never set a message on
a win and still does not. It was easy to miss when the modal arrived after 250ms. Now that the
board sits there for 3.65 seconds first, it is on screen the whole time. Not a regression and
not fixed here, but worth a line when the rules-box work happens.

## The win flourish — as specced, 2026-09-22

Until now the square board has had **no win moment at all**: `ascend()` calls `finalizeDay(true)`
and the modal opens 250ms later. This ports round's flourish across and then takes it further.
Source to port from is `round.html:935`. Built and tuned in a scratchpad copy with a replay
bar; nothing in the repo changed. Every number below is settled.

### The shape of it

**A round pulse, not square.** The first port walked the square board's own rings
(`RE.ringOf = max(|r-6|,|c-6|)`, concentric square annuli). Brad's call was to keep it round
as the round board has it. So it is one continuous front travelling out from the throne, drawn
as a radial gradient rather than stepped rings, and the radius runs to the **half diagonal**
(`px * Math.SQRT1_2`) so the circle keeps growing past the board edges until the corners are
covered. It reaches full coverage at `FX_SPREAD` = 0.38 of the run, unchanged from round.

The flash that decayed ring by ring in round becomes a band riding just behind the front, the
same width in time: `maxR * (0.16 / FX_SPREAD)`.

### The colour: multiply, not alpha

**This is the part that is not obvious.** Laying a darker red over the board with plain alpha
does not read bloodier, it reads muddier: the board is cream, so the darker the hex the more
the result lands in a desaturated brown middle. `globalCompositeOperation = 'multiply'`
darkens *through* the board instead, so the tier tones, keylines and terrace shadows still
read underneath and the red stays saturated.

Settled values, "Blood deep": `#6d0a12`, multiply, rest `.90`, flash `.15`, no corona.
With the strength dial at 1.9 the effective alpha caps at **0.95**. Pooling is **off**: the
wash is flat, not graduated.

### The throne is spared, and the reason is counter-intuitive

The blood runs out **from** the Emperor's cell but none settles on it. Implemented by painting
that one cell back from the pre-flourish snapshot, which keeps it exact.

Brad asked for this and an early measurement said it was wrong. Measured properly it depends
entirely on how dark the wash is, and it **flips**. Throne red tile against the inner tier
beside it:

| wash strength | throne covered | throne spared |
|---|---|---|
| 1.0 | 1.76:1 | 1.48:1 |
| 1.9 (as set) | 1.63:1 | **1.75:1** |

Unwashed, for reference, the throne reads 2.7:1. So at light settings sparing it makes the
throne blend, because an unwashed mid red sits in a lightly darkened red surround and the two
converge. Once the surround is dark enough, the unwashed throne is the only bright thing left
and sparing wins. **Spared is correct at this strength and only at this strength.** If the
wash is ever lightened, re-measure before keeping it.

### Timing, as shipped 2026-09-24

| moment | ms | note |
|---|---|---|
| wipe duration | 1800 | `FX.dur`. The animation curve only, see below |
| front reaches the corners | 684 | 0.38 of the run, measured at 698 |
| flash has finished fading | 972 | 0.54 of the run. **Nothing moves on screen after this** |
| modal starts fading up | **1250** | `FX.modalAt`, measured at 1309 |
| modal fully up | 1750 | `FX.modalFade` 500ms, measured 442 to full opacity |

**`FX.modalAt` is measured from the win, not from the end of the animation, and that matters.**
It was originally `dur + hold`, which meant the modal could never arrive before the animation
finished even with hold at 0: the floor was 1800ms, leaving 1116ms of motionless board. Brad
tried 0 on the slider on 09-24, found it still too long, and asked for that gap halved. It
cannot be expressed as a hold, so the modal got its own number. **Do not re-tie it to `dur`.**

Still board before the modal is now **566ms by the numbers and 611ms measured**, against 1116
at the old floor. The modal arrives 278ms after the last movement on screen, so pulling
`modalAt` below about 1000 would start it while the flash is still fading.

### The modal fades up

500ms ease on the end-of-day modal only. `#overlay` goes from `display:none` to `display:flex`,
which a transition cannot cross, so `.open` puts it on screen at opacity 0 and `.shown` is
added two frames later to give the transition two states to run between. `closeModal` clears
all three classes, or the next open would start already visible.

**Scoped to the end-of-day modal deliberately.** The rules and stats panels still snap in:
those are controls someone tapped, not a moment arriving, and half a second of fade on the
stats button reads as lag. A loss snaps in too, since there is no flourish behind it. There is
a `prefers-reduced-motion` opt-out.

### The VICTORY! caption: built, then cut

Built on 09-22 and removed on 09-24. Brad: overkill. The wash carries the moment on its own
and the modal already says it. Recorded because it was a lot of work and the reasoning is
worth keeping if anyone is tempted again: caps, `Shippori Mincho B1` 800, tracked at 0.30em,
which is exactly the wordmark's 9px on 30px. Size was solved against the board rather than
fixed, landing at 47px on desktop and 29px at 375px against the masthead's own 30px.

The thing that made it work typographically is the thing that made it too much: one word can
carry logo tracking, so it read as the masthead shouting, at the exact moment the board had
just gone blood red. Two strong gestures on top of each other.

Removing it took its five config values and a now-unused tracking helper with it.

### Where the line lives

**"The Emperor's revenge is swift and merciless" is the modal heading**, replacing
"The Emperor is free". **`.modal h2` is Shippori**, so the end of a run speaks in the same
voice as the masthead: `font-family:"Shippori Mincho B1","Iowan Old Style",Palatino,Georgia,serif`.
That was chosen while the canvas word still existed, and it still earns its place without it.

### Tap to skip

A tap anywhere **snaps the flourish to its finished frame** and opens the modal immediately,
rather than freezing a half-drawn wipe.

**It needs a dead zone at the start.** The very tap that wins the game will otherwise bleed
straight through and cancel the flourish it just triggered. 250ms, measured working: a tap at
121ms is ignored, a tap at 902ms opens the modal 2ms later instead of waiting. **Still to
decide: which chrome must not swallow the skip**, HOLD and HINT in particular.

### Rejected, do not re-propose

- **Round's own values on this board.** `#bc002d` at .26 flat reads as pale pink over cream.
- **Darker reds with plain alpha.** `#7d0d18` at .42 and `#6a0a12` at .58 both go muddy
  rather than bloody. This is why multiply is not optional.
- **Pooling, the graduated wash.** Built and dialled to 0, Brad wants it flat.
- **Square ring pulse.** Faithful to this board's geometry but not what Brad wanted.
- **Any caption on the canvas at all.** Two lines of Shippori below centre came first, then
  VICTORY! in the wordmark's treatment. Both built, both cut. The wash is the moment and the
  modal carries the words.
- **Dropping the exclamation, and tightening the tracking to 0.16em.** Both looked at and ruled
  out on 2026-09-22.

### A correction to the 2026-09-18 design audit

That audit records **"You have been overwhelmed" widowing at every width, desktop included.**
The desktop half of that is **wrong**. `.modal` is `max-width:460px` with 18px padding each
side, so the heading's text box is capped at **424px on any desktop, however wide the window**.
At 24px the string measures 352px in Iowan Old Style and 364px in Shippori, so it fits on one
line and does not widow. Measured on the real modal, not a probe, in both faces.

It **does** widow at 320, 375 and 414px, in both faces, and the font change does not fix it.
That part of the audit stands and is still to be fixed.

One thing the font change does fix for free: at 320px the new win heading widows as
`merciless` alone in Iowan, but breaks as `and merciless` in Shippori.

### Observation, not a defect

Once the modal opens it dims the board, so VICTORY! sits behind the overlay scrim. It gets
2.35 seconds clear first. If that ever reads as a waste, the word could fade as the modal
rises rather than being dimmed by it.

## The throne — BUILT (2026-09-22)

Gate at build: **rules 20/20, parity 40/40, bench exit 0 with zero fallback boards in both
modes and replay 10/10 in both.** That exit code is worth trusting rather than skimming:
`bench.mjs` sets `failed` on any below-band board and ends `process.exit(failed ? 1 : 0)`,
so a 0 is a real pass, not an absence of complaint.

Drawing only, and proven so rather than assumed: the `<script id="engine">` block was compared
byte for byte against HEAD and is identical, so no board, par or result can have moved.

Browser-verified at desktop and 375px. All twelve block corners read exactly `#42382f` where
nine of them were showing bare surface colour before. The throne reads `#a63b31` into its cell
corner. No console errors, no horizontal scroll. **Also checked, because the corner patch
would have hidden it:** the throne's wall keyline is at full strength on all four edge
midpoints. It looks weaker than before only because the red now meets it directly instead of
through a pale gap, so it reads as the block's own edge rather than a frame around it.


Brad's question was what the Emperor looks like if he fills the centre square. Four sizes
were rendered off a scratchpad copy of the real board, then a second round on the red tile,
then the shadow, then the corners. Nothing was built. Every number below was measured at
cell 40, the desktop size, and eyeballed again at the phone board size. Note for anyone
repeating this: the browser emulator reports `innerWidth` a little wide, so a 375px check
renders at cell 26 rather than the 25 a real phone gets. Close enough to judge a look, not
close enough to quote. The five decisions are final.

### The five decisions

1. **Gold disc grows to `cell * .35`**, from `.27` today. The red core dot goes to
   `cell * .168`, from `.13`, which holds the core at 48% of the disc exactly as it is now.
   For scale: today's gold sun is 21.6px in a 40px cell and a guard stone is 33.6px, so the
   Emperor is currently the smallest thing on the board. At `.35` he is 28px.
2. **The red throne tile fills its cell.** Inset goes from `max(2, cell * .07)` to 0 and the
   corner radius from 3 to 0. This removes the pale halo between the red and the dark wall
   keyline, which was the tier colour showing through the inset plus the tile's own drop
   shadow falling inside its own cell. The inset is 2px on a 25px cell against 2.8px on a
   40px cell, so the halo is proportionally wider on a phone and the fill does more there.
3. **The centre tile gets the tier shadow stack at half length.** The same five
   `TERRACE_SHADOW` passes and the same alphas, with every offset and blur multiplied by
   0.5. This replaces the single pass at offset `.07/.09`, blur `.18`, alpha `.4`. The
   centre tile is the highest block on the board but casts the weakest shadow, one pass at
   2.8 by 3.6px with 7px of blur where a tier gets five passes running out to 48 by 62px
   with 100px of blur. That mismatch is why it read as a sticker on the inner tier.
4. **No lit edge on the centre tile.** Tried and rejected on the day. The tiers' catch,
   `rgba(255,252,242,.5)` at `cell * .035`, reads as a subtle catch on the cream tiers but
   as a pink stripe on the red, because the same colour has far more contrast against red.
   If it is ever revisited it needs a lower alpha for the red, not the tier value.
5. **Wall keyline corners get a 2px patch.** See the fault below. `lineCap: 'square'` was
   the other candidate and was rejected.

### Rejected, do not re-propose

- **The gold filling the tile, `.43` or a rounded gold square.** Both work as drawings but
  the red throne stops reading as red: at `.43` it survives only as four corner slivers, and
  as a square not at all. The Emperor becomes gold with a red dot, which changes what he is
  rather than how big he is.
- **The full unscaled tier stack on the centre tile.** It throws a shadow longer than the
  block is wide, so a one-cell tile smudges about two cells of the keep.
- **The first two passes of the stack only.** Crisp, but it loses the long falloff that is
  what makes the tiers read tall in the first place.
- **`lineCap: 'square'` for the wall keylines.** It closes all twelve corners correctly with
  a one-word change, but a square cap extends every segment 1px at both ends, including
  where a segment stops at a gate. Measured: the gate gap goes from 39px to 38px and a nub
  pokes into the doorway. Not worth nibbling at gate work that was only settled on 09-20.

### The wall keyline corners are wrong, and have been all along

Brad spotted this and it is real. It is not in the 2026-09-18 design audit.

The wall keylines are drawn as separate one-cell segments with `lineCap = 'butt'`
(`ronin_daily_v1.html:907`). A 2px line centred on the boundary covers 1px either side, but
a butt cap stops dead at the segment's end, so where a vertical segment meets a horizontal
one the 1px square on the outside of the turn is covered by neither. The outer wall is not
affected because it is a single `strokeRect`, a closed path that mitres its own corners.

Measured at all twelve corners of the three blocks. Wall colour is `#42382f`.

| corner | middle tier | inner tier | centre tile | reads as |
|---|---|---|---|---|
| top-left | `#dbcfae` | `#e9e0c4` | `#f7f1de` | clean hole, exactly the surface underneath |
| top-right | `#c1b598` | `#cdc3ab` | `#dbd4c3` | no wall, just darkened by shadow |
| bottom-left | `#b5aa8f` | `#c2b99f` | `#d0cab8` | no wall, just darkened by shadow |
| bottom-right | `#433b2e` | `#473e33` | `#655e53` | looks right, by accident |

Nine of twelve are visibly wrong. The three that pass do so only because the block's own
drop shadow lands exactly on the gap and fills it with something near wall colour.

**The fix: fill a 2px square at each block corner after the keylines are drawn.** Verified to
bring all twelve to exactly `#42382f`, with the gate gap measuring 39px before and after.

**A patch square can never be orphaned in a gate.** This is from the generator, not a sample.
Outer gates are placed at offsets 3 to 9 along rows and columns 2 and 10, inner gates at
offsets 5 to 7 along rows and columns 4 and 8 (`tests/engine.mjs:263`). None of those can
occupy or touch any of the twelve corner intersections, on any board the generator can ever
produce.

### The draw-order question, CLOSED 2026-09-22: it does not matter

The worry was that the tiers cast their shadows before the grid, so grid lines sit on top of
them, while the centre tile is drawn after the grid and its shadow would therefore lie on top
of the grid lines instead.

**Built both and measured: the difference is nil.** Taking a horizontal grid line where the
throne's shadow crosses it, the line reads as a luminance step of **19.0 as built and 19.8 if
the tile is moved up with the terraces**, against 17.9 for the same line clear of the shadow
altogether. At half length the shadow is soft and thin enough where it crosses a grid line
that painting the grid over it or under it is indistinguishable.

**Left as built**, drawn after the grid where it has always been. Smaller diff and no
reordering of a draw sequence that the gates, the lit edge and the reflections all depend on.
If the shadow is ever lengthened, this stops being free and should be re-measured.

### One change the spec did not anticipate

**The ready-to-rescue pulse had to move.** It breathed at `cell * (.30 + .05 * sin)`, which
the sun now occupies at `.35`. It is now `.38 + .05 * sin`, so it runs .38 to .43 with the
cell edge at .50, and it does not bleed into neighbouring cells.

Worth knowing why the tight end is not a problem: **the radius and the opacity share the same
sine**, so the ring is brightest exactly when it is widest and has faded to alpha .15 by the
time it is at its tightest. The moment where the ring would sit on the sun's edge is the
moment it is almost invisible. That was luck rather than design, but it holds.

## Piece reflections — BUILT (2026-09-22)

Brad's "variant 1", chosen over a version with no katana at all. Drawing only.

### What a reflection is here

A **terminator**: a hard edge where the light starts, brightest right at that line, falling
away to nothing by the rim. Brad's words: "like light on a phone screen". The edge is an arc
that follows the counter's own curve, but only slightly, so it reads as a curved line rather
than a crescent wrapping the rim. Everything sits on the board's own light bearing,
`Math.atan2(-.81, -.58)`, which is the direction of the piece drop shadow's `(.05, .07)`
offset. Guards and Ronin use the same geometry and the same strength, so one sun lights both.

Shared parameters, in `REFLECT`:

| | value | what it controls |
|---|---|---|
| `peak` | .14 | alpha right at the hard edge |
| `edge` | .35 | where the edge crosses the light axis, as a fraction of the radius |
| `bow` | 6.5 | how far the line's middle sits off a straight line between its own ends, in px at the desktop piece radius of 16.8, held as a fraction of the radius so the shape is the same at every board size |
| `depth` | .65 | how far the light carries out from the edge; .65 reaches the rim |

Guards take tint `236,228,207` and no radial shift. The Ronin takes gold `230,186,72` and a
shift of `r * KATANA_W`, so its light starts exactly at the outer edge of the blade. Both
arcs share a centre, so the gap between blade and light stays even along the whole length
rather than pinching at the ends.

**The katana was redrawn**, not removed. It now lies along the reflection's own terminator,
tapering to a point at each end, half-width `r * .11`. Blade and light share one curve
instead of pulling against each other.

Measured on a guard: body `51` untouched below the cut, `76` at the peak one pixel past the
edge, against `77` predicted for alpha .14, easing to 68-70 by the rim. Identical at 375px,
where the piece radius drops from 16.8 to 10.5.

### How it is drawn, and why not the obvious way

The reflection is built **once per piece size into a cached sprite** and stamped with one
`drawImage` per piece. The sprite is: an annular band filled with a radial gradient (so
nothing inside the hard edge is painted at all), then both ends tapered away with two
`destination-out` linear gradients, then masked to the piece with `destination-in`.

The first implementation drew the angular taper as a fan of constant-alpha wedges. **Do not
go back to that.** Two faults, both found by measuring rather than looking:

1. **Alpha quantisation.** 48 wedges is invisible on a thin band and obvious as radial
   stripes once the lit area is large.
2. **Overlap stacking.** The wedges overlapped by a fixed angle to avoid hairline gaps, so
   at 120 wedges each overlapped its neighbour by about a third of its width and the alpha
   compounded. The reflection measured .19 when it was set to .14. Raising the wedge count
   made the banding vanish while making the brightness error worse, which is the trap.

### Rejected, do not re-propose

- **Constant-brightness marks**: a crescent riding the rim, a straight chord across the lit
  half, a crisp band set in from the rim. Brad: "a little too hard and vector based".
- **The straight chord** also collides with the Ronin's katana: guards would wear the mark
  that means "this is the Ronin".
- **A filled crescent.** Light carrying from a 66% edge all the way to the rim turns the
  stone into a two-tone disc. Strengths .22, .32, .50 and .70 were all seen and rejected.
- **A tight wrap concentric with the rim.** Brad wanted "a slight curve, not a wrap".
- **For the Ronin: dropping the katana entirely** with gold at .50. Seen at full board size
  and rejected. On record as the reason: the katana is the Ronin's only shape cue, and
  without it the Ronin is separated from a guard by a 1.95:1 luminance ratio and hue alone,
  on 21px pieces at 375px.
- **Shifting the blade inside the terminator** (.18, .26, .34 of the radius) to let the light
  show beyond it. Rejected because shifting it inward also slides it off the piece's centre,
  since both are measured along the same axis. The accepted fix was to leave the blade on the
  terminator and push the light's start outward instead.

### One measurement trap worth keeping

The bow was twice reported wrong before it was right. Measuring it across the piece's own
chord under-reports it, because the line's endpoints are further out than that chord. The
correct value is `bow = r(1 - edge²) / (2 · curl)`, where `curl` is how far back the arc's
centre sits in piece radii. Confirmed against the pixels at three points across the line.

Gate at build: rules 20/20, parity 40/40, bench 0 fallback boards and replay 10/10 both
modes. Browser-verified at desktop and 375px, no console errors, no horizontal overflow.

## The lit edge — BUILT (2026-09-20)

A thin warm-white catch just inside the top and left edges of each raised tier, the two
sun-facing sides. The drop shadow says "raised" by what falls away behind a tier; this says it
by what the edge itself catches. `rgba(255,252,242,.5)` at width `cell*.035`, as recorded on
2026-09-18. It skips the gate cells, since there is no wall standing there to catch anything,
which keeps it consistent with the notches.

**The recorded spec had a flaw, now fixed.** It put the catch starting on the tier boundary.
The wall keyline is 2px straddling that boundary and is drawn later, so it covered all but
about 0.4px of the catch. Drawn exactly to spec, three quarters of the effect was invisible.
It now starts at the wall's inner edge, `1 + lw/2`. If the version Brad saw on 2026-09-18 was
drawn to the recorded spec, he was ruling on a quarter of it, which may be why it went
unruled for two days.

Measured: tier surface `rgb(233,224,196)`, the catch `rgb(244,238,219)` across about 1.5px.
At 375px the line is 0.91 CSS px, which still paints at full strength at device pixel ratio 2.
On an old non-retina screen it would be weaker. Brad: "keep it at this strength."

Gate at build: rules 20/20, parity 40/40, bench 0 fallback boards and replay 10/10 both modes.

## Gates as cuts — the gate item, BUILT (2026-09-20)

Brad picked **variant D** from four. This replaced the gate recipe settled on 2026-09-18,
which he moved away from during the session. What shipped:

1. **Foot colour is a pure transition**, bottom tier straight to top tier. `src` held flat to
   28% of the climb, then running to the destination tier. **No foot shadow band.** The
   2026-09-18 recipe had the foot at `source × 0.76` plus a band at alpha `.66` over 42% of
   the cell. Brad asked for it at half, then at nothing: "a pure transition from bottom tier
   to top tier". The `shade()` helper that recipe needed is gone.
2. **Jambs, 1px**, down the two climb edges, gradient from `COL.wall` at the ring wall to the
   destination tier colour at the top, so the wall turns into the gate and dissolves. The
   2026-09-18 spec said 2px solid; Brad asked for 1px and the gradient.
3. **The gate cells are cut out of the tier silhouette** with an even-odd path, so the stacked
   shadow passes cast the gaps for free, correctly blurred. This is what makes the tiers stop
   reading as three stacked squares. Brad: "I like the notches."
4. **The stair is drawn in three passes at three depths.** `tile` goes under its own tier so
   the tier's shadow falls across it for real. `lit` paints the tile back with alpha ramping
   0 at the foot to 1 at the top, which tapers that shadow out as the stair climbs back to
   tier level, and carries the treads. `jambs` go on top with the other keylines.
5. **Grid line at the gate restored.** The old order let the tile fill swallow the grid lines
   on its own left and top edges, so a gate boundary had no line at all when every other cell
   boundary does. The new ordering puts the main grid pass after the tiles, which fixes it
   with no extra code.
6. **Two alignment faults fixed**, both found by Brad off a render and confirmed on a
   device-pixel map. The ring wall stopped at the boundary while the jamb started at the cell
   edge, leaving the corner pixel at (boundary − 1) unpainted: jambs now start 1px beyond the
   boundary, which is the wall's outer edge. And the far jamb sat at `boundary − 0.5` while
   this board's grid convention puts a boundary line at `boundary + 0.5`, so it was one pixel
   high: it now lands on the grid line.

**Measured**, r8 c10, % darkening along the climb from foot to top, plus the ground outside:

| | foot | .3 | .5 | .7 | top | ground |
|---|---|---|---|---|---|---|
| before any of this | 0 | — | — | — | — | 73.3 |
| D as built | 35.2 | 30.3 | 23.0 | 14.6 | −5.1 | 32.3 |

Negative means it has reached the middle tier's own lit colour. The foot lands within 3
points of the ground it meets, against a 73 point cliff before. 14 probe points away from any
gate are byte-identical to the pre-change render, so nothing else moved.

**One difference from the render Brad approved.** The scratch copy left canvas shadow state
set when it drew the stairs between the terrace passes, so every stair fill and tread was
casting a stray wide shadow at alpha .12. The build clears it. That makes the foot 6 points
lighter and the ground just outside 2 points lighter than the approved render, and it happens
to land on the "foot flush with the ground" option Brad was offered and never answered. He was
told. If he wants the foot deeper again, it is a deliberate darkening, not a restored bug.

**Rejected along the way, do not re-propose:**

- **A, the wash.** A ground-coloured wedge painted over the shadow out through the opening,
  62% at the mouth fading over 2.2 cells, softened with a canvas blur filter. Brad liked the
  theatre of it. Rejected in favour of D. Three problems it had: it dilutes rather than
  removes (73.3 → 42.8, never to zero), its strength is fixed so it cannot know how deep the
  shadow under it is, and it paints one tier's colour so it needs clipping or it can smear the
  wrong tone onto a neighbouring tier. It also needed `ctx.filter`, which older iOS Safari
  ignores, and it would have rendered as a hard-edged wedge there.
- **B**, the notch with the stair still sitting on top of the shadow, which needed a
  `getImageData` per gate per frame to sample the ground and paint the shade back on.
- **C**, the notch with the stair under the shadow but no relight. The stair got *darker* as
  it climbed, 34.6 at the foot to 78.4 at the top, which is backwards: the top of the climb is
  flush with the lit tier. Brad: "the top just doesn't read correctly."

D needs no canvas readback and no blur filter, so both of A's and B's shipping risks are gone.

Gate at build: rules 20/20, parity 40/40, bench 0 fallback boards and replay 10/10.
Browser-verified at desktop and 375px, no console errors, no horizontal overflow at either.

## Shadow methodology — what finally worked, and why (2026-09-18)

Six rounds of shadow variants, all rejected, before the cause was found. Recorded so it is
never re-derived.

### The spec to build — BUILT 2026-09-18

Built exactly as written below, as `TERRACE_SHADOW` plus the `terrace()` helper in `draw()`
(`ronin_daily_v1.html:638`). One thing the spec did not say, found in the build: a tier's
whole stack must run before the next tier's starts. Interleaving them lets the middle tier's
later fills paint over the inner tier's earlier shadow passes.

`#boardFrame`'s CSS `box-shadow` was removed in the same change, which was the loose end from
Brad's original brief. He called it on 2026-09-18: "drop the boardFrame shadow".

Re-measured on an isolated rig after the build, as % darkening in linear luminance against the
middle terrace, sampling the inner tier's shadow (the same basis as the numbers below):

| | contact | 3px | 8px | 16px | 30px | 50px |
|---|---|---|---|---|---|---|
| predicted | 94.1 | 82.4 | 68.2 | 54 | 34.7 | 25.7 |
| built | 94.5 | 85.9 | 76.7 | 66.1 | 44.6 | 26.7 |
| the old single pass | 60.6 | 57.7 | 49.9 | 34.7 | 10.7 | 0 |

Contact lands at 94.5 against the keyline's 94.4, so the cliff is gone: it was a 34-point step
before. The built falloff holds a few points darker than predicted through the middle of the
walk, same shape, still monotonic. Walking diagonally out from the inner tier's shadow-facing
corner now goes 92.9 → 86 → 78.7 → 72.1 → 64.1, darkest at the tier.

Gate at build: rules 20/20, parity 40/40, bench 0 fallback boards and replay 10/10 in both
modes. The engine was not touched, so those could not have changed, but they were run.
Browser-verified at desktop and at 375px: board 338px wide inside a 375px viewport, no
horizontal overflow at either width.

Replace the single shadow pass in `draw()` with five stacked passes, applied **identically
to both tiers** (matched, not graduated). Offsets and blurs are in cells; colour is
`rgba(40,32,24,a)`:

| pass | offset x | offset y | blur | alpha |
|---|---|---|---|---|
| contact | .06 | .08 | .08 | 1.0 |
| 2 | .28 | .36 | .44 | .40 |
| 3 | .52 | .68 | .90 | .26 |
| 4 | .84 | 1.10 | 1.60 | .18 |
| 5 | 1.20 | 1.56 | 2.50 | .12 |

Each pass sets `shadowColor`/`shadowBlur`/`shadowOffsetX`/`shadowOffsetY` then re-fills the
same rect, so the shadows accumulate. **The contact pass must never be scaled** if the throw
is changed later; it sits at the tier whatever the sun does.

Measured: contact pixel 94.1% darkening against the keyline's 94.4%, so no step at the join.
Falloff 94.1 → 82.4 → 68.2 → 54 → 34.7 → 25.7% at 1/3/8/16/30/50px. Cost at 40px cells: ink
19.88 and 47 of 150 playable cells in deep shade, against today's 7.20 and 26. Endpoint dot
contrast 1.64 against today's 1.68, so the move markers are unaffected. Drawing only, so the
engine is untouched and no board, par or result can change — but still run the release gate.

**The complaint.** Brad: "the tiers look like they are floating"; "the corners look detached
from the shadow"; and his spec, which turned out to be the key: "the shadow would be darkest
at the pixel next to the tier and then fade to nothing... the shadow would also have a
harder edge at the connection point and blur and/or fade out the further away you got."

**Why nothing worked for six rounds.** Canvas `shadowBlur` is a **single uniform value**.
It cannot be sharp at the contact and soft at the tip. Every single-pass variant therefore
has the same edge softness everywhere, which is why offset, blur, opacity and ambient
tuning all failed to produce a connection. This is the whole answer.

**The two measurable symptoms.**

1. *The cliff.* The tier keyline is 94.4% darkening. A single-pass shadow peaks around 58
   to 65% at the contact. So there was a ~31 point step from the keyline into the shadow,
   which reads as an outline with a detached wash beyond it.
2. *The floating corner.* Walking diagonally out from a tier's top-right corner, today's
   shadow gets **darker** as you move away: 16.2 → 17.1 → 18.9 → 20.8%. The darkest point
   is off in space, not at the tier. That is literally the float Brad kept pointing at.
   Cause: an offset shadow is the shape moved down-right, so the top of the right edge and
   the left of the base get no shadow core at all, only blur spill.

**The fix.** Stack passes. A tight near-opaque pass with a *small but non-zero* offset for
the contact, then progressively wider, lighter, further-offset passes for the penumbra.
They accumulate into a shadow that is darkest against the tier, sharp there, and softer and
fainter with distance. Contact goes from 58.7% to 94.1%, killing the cliff entirely.

**The trap that cost an extra round.** The contact pass needs an offset of about `.06/.08`
cells. At `.02/.03` it is sub-pixel and never emerges from under the tier, giving only 23 to
33% and looking no better than before. A single tight pass at `ox .06, oy .08, blur .08,
alpha 1.0` reaches 86.9% on its own.

**What the stacked approach does NOT fix.** x2's corner still peaks 2px out rather than at
the tier itself (28.3 → 37.2 → 27.4%). The projected-silhouette V2 was the only variant that
got the corner perfectly (87.2% right at it, falling away monotonically) but its body was a
flat 59.3% plateau from 3px to 30px with a hard cut outer edge, which is what Brad disliked.
**A combination of V2's corner geometry with x2's stacked falloff was identified but never
built.** That is the obvious next move if x2's corner ever bothers him.

**Practical notes.**

- The Browser pane stopped compositing frames repeatedly during this session, so screenshots
  timed out and several variants were sent to Brad unseen. If it recurs, put a single
  variant into a copy of the game and let Brad open it himself rather than building
  multi-panel comparison pages.
- Comparison harnesses from this session are in the scratchpad: `ronin-frame-depth.html`,
  `ronin-connected-shadow.html`, `ronin-edge.html`, `ronin-lit.html`, `ronin-stacked.html`,
  `ronin-3way.html`. They are throwaway, outside the repo, and will not survive a reboot.
- Brad's reference for the feel is a framed print on a wall: soft broad shadow, hard line at
  the contact, and the frame's own thickness doing the connecting work.
- **Token cost was Brad's stated reason for stopping.** Six rounds of rendered variants is
  too many. Next time, get a reference image first and lead with the physics, not options.

## Visual pass 1 — terrace elevation shadows (REVERTED) + design audit (2026-09-18)

> **The shadow build described below was reverted at Brad's request and is NOT in the
> code.** It is recorded because the measurements are reusable and because the next attempt
> should not repeat it. The design audit findings further down are still live and unfixed.

### What was built, and then taken out

**Terrace elevation shadows, item 1 of the visual list.** Two changes, both drawing only:

1. `#boardFrame`'s CSS `box-shadow` removed, so the board sits flat on the page. The outer
   ring is the ground; a shadow under the whole board made the outer ring look raised too.
2. Each terrace now gets its **own** shadow length instead of both sharing one setting.
   Middle offset `.50/.66` cells, inner `.92/1.20`, blur `.38`, alpha `.52`. The inner
   throwing further than the middle is what reads as the height difference.

Each terrace draws **two** passes. An offset shadow alone leaves the left of the base and
the top of the right edge completely unshaded, which is what made the terraces look like
floating plates — **not** the blur radius, which was the first diagnosis and was wrong.
The extra tight pass (blur `.10`, offset `.07/.09`, alpha `.45`) puts shade on all four
sides. Measured on the live board: darkest at the wall on every sampled column, fading
away from it, zero unshaded samples along the base.

Engine untouched. Gates re-run: rules 20/20, parity 40/40, bench identical par
distribution with 0 below band and replay 10/10. Browser-verified at 900px and a settled
375px (canvas 325px at x 25–350, no horizontal scroll, all 169 cells kept).

**Note for browser testing (still true, worth keeping):** an emulated resize leaves
`resize()` holding a stale viewport width, so the canvas keeps its old cell size and
overflows. It looks exactly like a layout bug and is not one. Reload after resizing.
`round.html` has a debounced re-settle for this; the square board does not.

**Outcome: reverted.** Brad's verdict on seeing it in the game was "that's wrong, I want to
start again from the current live version." It passed every gate and every measurement,
which is worth remembering: the numbers were not the problem, the look was. Reverted
file-scoped so `tests/lab.mjs` was never at risk.

### Settled with Brad but NOT built (2026-09-18)

Decided from rendered comparisons, deliberately held back so the visual items land one at
a time. Numbers are final, so these can be built without redoing the analysis.

- **Gate foot colour.** Brad's rule: the foot matches the tier the stair leaves, the top
  stays on the tier it climbs into. Taken literally this nearly erases the gate, because
  adjacent terrace colours are only ~1.17 apart in brightness by design, so tier colours
  cannot carry a gate's visibility. Final recipe: three-stop gradient, foot at
  `source × 0.76`, pure source at 28%, destination at 100%, **plus** a foot shadow band
  over 42% of the cell at alpha `.66`. With the keylines that measures 1.43 mean cell
  contrast against today's 1.36, so the gate ends up slightly more visible than now, which
  also serves the "make the stairs more obvious" ask. Bonus: today's invented shades make
  outer gates more prominent than inner ones (1.92 vs 1.69); deriving from tier colours
  makes all five gates on a board read with equal weight.
- **Stair side keylines**, 2px in `COL.wall` down the two climb edges. Brad wants these
  first and will decide on side shadowing afterwards. Note they re-close the wall keyline
  gap that gates currently have, reversing that earlier decision.

### Parked

- **Reflections on every piece**, guards and Ronin both. A hard-line gloss rendered well
  on the guards, but the Ronin's yellow line collided with the gold katana and Brad did not
  like it. To be taken up as a standalone piece of work on the pieces themselves.
- **Shadow approaches Brad rejected.** Do not re-propose any of these: a
  projected-silhouette hexagon shadow (V1/V2/V3, "I don't think I like it"); a wall
  side-face on the shadow-facing edges; a contact band hugging each terrace edge; the
  two-pass graduated offset shadow that was built and reverted; a zero-offset ambient wrap;
  widening the blur alone; and raising the single-pass opacity to 0.70. Also **graduated
  tiers are out** — Brad asked for both tiers matched on 2026-09-18.
- **The lit edge is available but unused.** A bright 1-2px catch inside each tier's top and
  left edges, `rgba(255,252,242,.5)` at width `cell*.035`. Brad asked to see it isolated and
  did not rule on it. It is the cheapest thing tried and arguably did more for the raised
  read than any shadow change. Worth putting to him again.

### Design audit findings (2026-09-18, first two fixed 2026-09-24)

Measured in the browser at 320/360/375/390/414/1280. Real defects, awaiting their own pass:

- **FIXED 2026-09-24.** ~~`attempt 1` wraps in the stats modal, on desktop as well as
  mobile~~ (`ronin_daily_v1.html:1135`). `.dist .row` is flex, the label has `min-width:auto`
  and `flex-shrink:1`, and the bar takes up to 90% of the row, so the label gets 50.8px when
  it needs ~55px. Row heights came out 28/17/17px, only on the row with the widest bar,
  which is why it looked intermittent. Fix: `.dist .row span:first-child{ white-space:nowrap;
  flex:none; }`. Re-measured with a seeded 20/0/0 distribution (the worst case, widest
  possible bar): all three rows now 17px. Browser-verified at 1280px only, since the wrap
  was never width-dependent — it was the bar's own width squeezing the label.
- **CLOSED 2026-09-24, will not fix.** ~~"You have been overwhelmed" widows at every width,
  desktop included~~, always breaking as "You have been / overwhelmed". Captured modal and
  final loss modal heading. The desktop half of the finding was wrong and was corrected
  separately (see below): it does not widow on desktop, only at 320/375/414px. **Brad's call
  on 09-24: leave it. "overwhelmed is long enough to not feel like a widow."** The rule he is
  applying is about the length of the stranded word, not the fact of the break, so do not
  re-propose this one. A short word alone still counts, which is why `now.` and `roll` below
  are a different question.
- **FIXED 2026-09-24.** ~~Six status-line messages widow at 375px, three stranding a lone
  emoji (`⚠`, `⛩`, `🏮`) on its own line. Also one at 360px and one at 414px.~~ Eight
  messages in total, all fixed the same way: a ` ` (real non-breaking space, not the
  `&nbsp;` entity — `setMsg` writes via `textContent`/`innerHTML` string concatenation, so
  the entity would have rendered as literal text) joining the final two tokens of each
  message, so the line-break can no longer fall between them. Wording unchanged, byte-exact
  everywhere else. Re-verified live at each message's own problem width (375, 390, 360, 414)
  against the exact fixed source strings, fetched rather than retyped to rule out a typo
  reintroducing a plain space: none widow any more, all now carry 2+ words on the last line.
  The messages: "...up to 3 cells a turn." (375, 390), "...the guards will take you. ⚠"
  (375, 390), "...(or RESCUE) to finish! ⛩" (375), "...trust your instincts. 🏮" (375),
  "...refresh to play today's puzzle." (375), "...first, inside the keep." (375), "...cross
  walls at the stair tiles." (360), "...or practice below." (414).
- **FIXED 2026-09-24.** ~~The win screen's Ko-fi line strands `roll` at 320px only.~~
  Confirmed real at a true 320px layout width (iPhone SE): "enjoyed the rescue? buy the ronin
  a sausage roll" broke with `roll` alone. Same non-breaking-space fix, joining
  "sausage roll", which is a compound that should never break anyway. Verified through the
  real win path (`startPractice` + `autoWin`, not an injected modal) at 320px: last line now
  reads "sausage roll". Still one line at 375px, unchanged. **The footer's copy of the same
  phrase was checked and left alone** — it is 156px on one line at 320px and does not break.
- **CLOSED 2026-09-24, not reproducible.** ~~"You know their ways a little better now."
  strands `now.` at 360px only.~~ Re-measured on the real element at true layout widths: at
  360px the whole sentence fits on **one line** (308px box), and at 320px it breaks as
  "...a little / **better now.**", two words on the last line. It does not strand at any real
  device width. See the width-labelling note below for why the original finding said 360.
- **FIXED 2026-09-24, and the audit's explanation was wrong.** ~~Button row heights stagger
  35.5/35.5/36.5/37.5px because MOVE and HINT use larger font sizes.~~ Only MOVE has a larger
  font (13.5px against 12.5px), and that accounts for its +1px. **HINT's +2px was the 🏮
  glyph inflating the line box, nothing to do with font size** — measured by swapping the
  label to plain "HINT", which dropped it to exactly 35.5px. Brad's call was to even it up.
  See "The control row" below.

### The 09-18 audit's width labels run ~15px wide — read them with care

Found on 2026-09-24 while chasing the `now.` strand. In this browser pane, `window.innerWidth`
reports **15px wider than the actual layout viewport**: at an emulated 360, `innerWidth` is
375 while `document.documentElement.clientWidth` is 360, and the body and `#status` both
measure 360. CSS wrapping follows the layout viewport, so `clientWidth` is the honest number.

`scripts/audit.js` labels its output `viewport: window.innerWidth`, so **every width in the
09-18 findings is about 15px wider than the width actually rendered.** Its "360" was really
~345, which is why `now.` appeared to strand there and does not at a real 360. This does not
undermine the findings that were re-confirmed at real widths (the eight status-line messages,
the `attempt 1` wrap, the `roll` strand); it only means the width *labels* were off.

**Measure `document.documentElement.clientWidth`, not `innerWidth`**, and quote that. Related
trap already on record: an emulated resize leaves `resize()` holding a stale viewport width on
the square board, so reload after resizing.

**One more measurement trap, same day.** A probe span styled from the paragraph's own computed
font under-reports a line set in `<b><i>`, because the real text is bolder and wider than the
probe. That mis-predicted where "You know their ways..." would break. Measure the real element
with `getClientRects()` per word, never a styled probe standing in for it.

Release gate re-run after these two fixes: rules 20/20, parity 40/40, bench 0 fallback
boards and replay 10/10 in both modes. Neither fix touches the `<script id="engine">` block
(one CSS rule, eight message strings), so the gate was never in doubt, but it was run anyway.

**Checked and cleared, do not chase these:** Shippori Mincho B1 *is* loading and painting
(h1 measures 154.41px with it, 164.96px without) — the audit script's `notResolving` flag
is a false positive from its probe string. The stats bar numbers are **8.23:1**, not the
1.27:1 the sampler reports, because it skips an element's own background. No horizontal
overflow at any width. 62KB total with zero embedded base64.

**Structural note:** the file has **no media queries and no fluid type at all**. Every size
is fixed px plus `max-width`, which is why these widows cluster — a 24px heading has to
survive a 252px modal on a 320px phone with nothing adapting underneath it.


### The status-line widows in full, measured on the real element

| width | message ends | alone on the last line |
|---|---|---|
| 375 | ...up to 3 cells a | `turn.` |
| 375 | ...the guards will take you. | `⚠` |
| 375 | ...(or RESCUE) to finish! | `⛩` |
| 375 | ...trust your instincts. | `🏮` |
| 375 | ...refresh to play today's | `puzzle.` |
| 375 | ...first, inside the | `keep.` |
| 360 | ...cross walls at the stair | `tiles.` |
| 390 | ...up to 3 cells a | `turn.` |
| 390 | ...the guards will take you. | `⚠` |
| 414 | ...return tomorrow, or practice | `below.` |

### Shadow lengths that were measured and rejected

Brad picked the third of four sun heights. For reference if it is ever revisited, of 150
playable cells the deep-shaded count went 9 / 18 / 25 / 33 across the four, while the
endpoint-dot contrast in the deepest shade stayed flat at 1.37–1.40 for the last three.
So the per-cell penalty does not worsen with length; only the affected area grows. Brad's
call was to leave the endpoint dots alone, since low contrast there is deliberate hierarchy.

## Straight-move routing fixed + two rule findings (2026-09-15)

Brad reported three things in play. All three were checked against the real engine rather
than the docs.

**1. The zigzag — FIXED.** Moving two or three tiles in a straight line drew a detour, up
one and back down. Cause: `pathTo`'s breadth-first search took its neighbour order from
nested loops running row offset -1, 0, +1 and column offset -1, 0, +1, so the up-left
diagonal was tried first and the straight step almost last. A straight two-away target is
reachable in two steps by either a diagonal pair or a straight pair, so the search returned
whichever it found first, which the loop order guaranteed was the diagonal. Measured on an
open board: **57% of straight 2-step moves and 58% of straight 3-step moves** drew a
detour, which is why it felt random rather than constant.

Fix: a named `PATH_DIRS` list above `pathTo`, orthogonals before diagonals, used for the
search loop. Result: **0% detours in both modes.** Pure diagonals still draw as pure
diagonals, and an offset target still draws a sensible mixed route.

Why it was safe: `pathTo` has **zero callers inside the engine**, is asserted by no test,
and sits outside board generation. `refreshHints` (`ronin_daily_v1.html:866`) computes the
guard reply from the selected endpoint alone, so the drawn route never reaches `armyReply`.
The hold branch of `pathTo` was deliberately left on the old ordering: it is not a zigzag,
and changing it would alter the HOLD animation's direction.

**`roninOptions` must keep its current order** even though it contains a visually identical
loop. `solveBoard` iterates its output into the A* buckets, so the order breaks ties and
changes the node count, and `genCandidate` runs the solver under `maxNodes: 60000` — a
different order could push a borderline board over the cap and change which seeds pass the
par band. Same red line for `armyReply` and `stepLegal`.

Verified: rules 20/20, parity 40/40, bench 0 below band + replay 10/10, 240 boards
byte-identical to `HEAD` including par, 1,314 endpoints across 120 boards with no route
lost and no illegal step. Browser-verified at 900px and 375px: straight dashed preview,
second-tap commit, capture-warning select, UNDO, HOLD, HINT, `autoWin`, the win modal's
par replay, and the three-attempt loss flow's "REVEAL THE WAY IN" replay. Off-centre tap
still snaps at 375px on the 22px tolerance floor, no horizontal scroll.

**2. Diagonal moves through a gate — NOT a bug, parked.** The rule is consistent but its
shape is unintuitive. A gate is a **tile you must touch**, not a gap in the wall, because
`stepLegal` allows a tier crossing when either the tile you leave or the tile you land on
is a stair. So the door fans out three ways from its own tile and zero ways from the tile
beside it. Worked example, gate (10,3) on day 74:

| move | result | looks like |
|---|---|---|
| (10,3) → (11,3) | legal | straight out of the door |
| (10,3) → (11,2) / (11,4) | legal | diagonal out of the door |
| (10,4) → (11,3) | **blocked** | diagonal cutting the same doorway |
| (11,4) → (10,3) | legal | diagonal into the door |
| (11,4) → (10,4) | **blocked** | straight ahead, one tile from the door |

The last pair is the confusing one: stood just outside the door, the diagonal works and
straight ahead does not. Cannot be changed on the live board — `stepLegal` sits under the
generator. Any fix is visual or copy, so it waits for the rules-section review.

**3. The guard rule — engine and copy disagree, parked on Brad's call.** The help box says
"the two nearest chase each move — arrows show who". `armyReply` sorts by **chebyshev
distance straight through walls**, tiebreaking on generation order. Across the first 200
daily boards the two guards that move are **not** the two nearest by walking distance on
**148 of them (74%)**. Day 1: a guard 4 tiles away but 10 walking steps away, behind a
wall, moves; a guard 8 tiles away with a clear run does nothing. Also counted 181 chasers
with a wall between them and the ronin, and 56 mover steps that closed no distance at all,
which is a guard sliding along a wall face while still using one of the two slots.

The arrows are honest — they come from the real engine, so they always show exactly who
will move. The mismatch is in the word "nearest". **Brad's call 2026-09-15: leave it, and
revisit with the rules section.** Fixing it in the engine would regenerate every published
board, so the candidate home for walking-distance guards is the reserved **epic** mode,
where nothing has shipped.

## Live

**https://roninpuzzles.com** — custom domain (bought 2026-07-24), served by GitHub Pages, repo
`bradthecaveman/ronin-daily` (public), `index.html` from `main`. The old
**https://bradthecaveman.github.io/ronin-daily/** still works and 301-redirects to the domain. Deploy = `cp ronin_daily_v1.html index.html && git push`;
Pages rebuilds automatically on push to `main` (usually live within ~1-2 minutes; confirmed via
`gh api repos/bradthecaveman/ronin-daily/pages/builds/latest`).

**https://roninpuzzles.com/round.html** — RONIN ◯, the v2 circular board (BETA since 2026-07-13;
puzzle #1 = launch day). **HIDDEN since 2026-07-24, not retired.** It was unlinked from
`index.html` because it wasn't being played, not because a winner was picked. Still deployed and
still reachable by typing the URL; the link in `index.html` is commented out with the exact markup
needed to restore it. Brad has not given up on it. Separate storage namespace (`ronin.round.v1` vs
`ronin.daily.v1`) so stats never mix. Deploying a round change = edit `round.html`, run the ring
gates (`ring-rules.mjs`, `ring-parity.mjs`), push.

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
