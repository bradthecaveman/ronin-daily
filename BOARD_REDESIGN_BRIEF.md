# RONIN — Circular Board Redesign Brief

*Created 2026-07-08. Self-contained handover for continuing this design (new chat, or the
Fable build session). Pair with the two reference files named below — together they're enough
to continue without re-deriving anything. Sits alongside `STATUS.md` (the live square game's
source of truth); this brief covers the **proposed next-generation board** only.*

## The pivot

The live game (`ronin_daily_v1.html`, deployed) uses a **13×13 square grid**. We're exploring
replacing the board with a **concentric ring graph** — stones arranged in rings around a central
Emperor — for a much stronger visual identity and a native rising-sun victory. The *rules soul*
(infiltrate inward past guards, reach the throne, daily seed + solver-verified par, 3 attempts)
is preserved; the **geometry, rendering, movement, guard AI and generator are a ground-up rewrite**.
Think of it as a second engine that reuses the whole product shell (modes, storage, hints, reveal,
share, stats, modals, release-gate discipline, the solver-first + lab-benchmark methodology).

Board structure: **6 rings + Emperor at centre**, grouped as **3 tiers of 2 rings** (outer /
middle / inner), lightening toward the throne. The Emperor sits in a slightly larger central
"throne chamber." You **orbit any ring freely**; you cross **inward** only through a **gate**
(rendered as two stones fused into a lozenge / figure-8). Reach the inner ring, then ascend.

## The two board models (THE core open decision)

Same physical geometry (6 rings); they differ only in **where the walls/gates are**:

- **Option 1 — "stepping-stone"** (`ronin-ring-reference-1b.html`): every ring boundary is a wall.
  **Two gates per ring boundary** (5 boundaries → 10 gates), each a simple 2-stone join (we tried
  forks — a stone joining the two straddling inner stones — but removed them; single joins only for
  now). Tighter, more chokepoints, more forced angular detours, higher par, spikier difficulty.
- **Option 2 — "tier-gate"** (`ronin-ring-reference-2c.html`): only the two **tier boundaries** are
  walls (2 boundaries → ~5 gates incl. one fork in the mock). You move **freely within a 2-ring
  tier** (orbit + cross between its two rings). Calmer, flows more, more forgiving, reads more
  cleanly. Brad: "Option 2 reads so much more cleanly."

Engineering note that makes both cheap: if the engine is **a graph of stones + gate-edges**, the
only difference between the models is a **generation parameter** — *gate every ring boundary*
(Opt 1) vs *gate only tier boundaries, open within a tier* (Opt 2). One engine, one generator, a
per-mode gating config. Neither reference is wasted.

## Difficulty ladder (Brad's proposal, 2026-07-08 — leading candidate)

Each rung raises difficulty on a **different axis**, so each mode has its own identity, not just
bigger numbers:

| Mode   | Board            | Moves/turn | Extra                                             |
|--------|------------------|-----------|---------------------------------------------------|
| easy   | Option 2 (2 walls) | 3       | gentle                                            |
| normal | Option 1 (5 walls) | 3       | —                                                 |
| hard   | Option 1 (5 walls) | 2       | —                                                 |
| epic   | Option 1 (5 walls) | 2       | + mechanics (see epic sketch in STATUS.md)        |

Rationale: easy→normal changes **board complexity**; normal→hard changes **mobility** (from the
square-game lab, 3→2 moves was a huge swing — ~73% naive-win to ~14% — so this is a real cliff,
tunable via guards/par); hard→epic adds **new mechanics** (line-of-sight + move-4-when-hidden,
guards move 2, sight-blocker obstacles, curved/one-way stairs — full sketch already banked in
STATUS.md under the epic slot). The existing **modes architecture ports straight over** (per-mode
seeds, boards, streaks, switcher, storage migration).

Open within the ladder: which mode is the **daily default** (lean: normal, with easy one tap
away); whether **guard count** should also scale per mode (likely yes — 4th lever alongside
geometry/moves/mechanics); confirm each jump size in the lab so hard isn't *impossible* and easy
isn't *trivial*.

## Movement model (changes from the square game)

From "king moves up to N squares" to **"traverse up to N edges along the graph."** An edge is
either an **orbit step** (to the adjacent stone on the same ring) or a **gate step** (inward
through a lozenge). N = moves/turn (3 or 2 per the ladder). Guards: step toward the ronin along
the graph (reduce graph-distance), the two nearest, deterministic — cleaner than the square
game's polar-angle logic. Guard behaviour on the ring graph is **not yet specified** — needs
defining + lab-tuning. Ascend rule still open (Option A: reach any inner-ring stone → ascend;
Option B: a final gate to the throne too) — see STATUS.md.

## Visual / rendering language (settled — embodied in the reference files)

Read the two reference HTML files for the exact, working implementation. Key decisions:

- **Palette**: monochrome cream (from the live game's v1.8 art direction) — Option 1 uses a smooth
  per-ring radial gradient (darkest outer edge → lightest throne); Option 2 uses 3 tier bands.
  Emperor + Ronin are the only saturated (red/gold) elements. Guards are dark charcoal stones.
- **Stones**: matte lacquered look — darker core + a **hard-edged inset rim** (a defined band
  just inside a crisp boundary — NOT a blur) + subtle drop shadow (sun top-left). The rim is what
  makes them read as stepping stones.
- **Gates = lozenges**: two stones fused into **one continuous silhouette** — a true peanut/figure-8
  with a pinched waist that flares **tangentially** into each stone's perimeter (no straight-bar
  look), filled with **one continuous gradient across the whole shape** (no visible inner-circle
  seams), a darker core, and the **same hard inset rim** as single stones so a gate and a single
  stone share one material language. Built via an offscreen canvas so the merged shape casts a
  single clean shadow; the rim is made by **eroding the union silhouette and subtracting** (a blur
  feathers the edge and looks wrong — eroding keeps it crisp). Current dials: `DARKF`=0.87 (gate
  ~13% darker than field), `WAIST`=1.05, `RIMW`=step*0.11, rim alpha 0.17.
- **Emperor**: red tile, gold sun, red core, in the enlarged central chamber.
- **Ronin**: red lacquer stone with a gold curved-katana slash.

Still not fully nailed (Brad): Option 1's stone/gate **edge rendering** ("still not quite right" —
the rim/edge crispness). Whatever we settle there, apply to BOTH models so they stay identical.

## Reference files (canonical)

- **`ronin-ring-reference-1b.html`** — Option 1 (stepping-stone), current best. 2 gates/ring,
  lozenge joins, eroded rim, radial gradient, throne chamber.
- **`ronin-ring-reference-2c.html`** — Option 2 (tier-gate), current best. Same treatment, gates
  only at tier boundaries.
- `ronin-tiered-board.html` — Brad's original Claude.ai sketch (lineage).
- Earlier iterations (`ronin-ring-reference.html`, `-2.html`, `-2b.html`, `_polar_mock*.html`) are
  superseded — ignore.

## Build guidance / cost

- **Bigger than the polar-grid rewrite; smaller than starting from zero.** New: coordinates,
  adjacency, graph movement, guard AI, distance heuristic, renderer, and a graph generator (with
  the gating-config dial). Reused: solver architecture, the entire product shell, lab methodology,
  release gate. Graph search is natural for the solver.
- **Order**: build the graph engine + generator + solver first; **lab-validate** (solvable,
  in-band par, healthy difficulty per mode via the naive-bot win-rate) BEFORE polishing rendering;
  then port the modes/UI shell; then the visual language from the reference files.
- **Regenerates all boards** — fine now (near-zero players); this door closes as players arrive.
- Do the board FIRST in isolation (easy/normal/hard), epic mechanics after, one at a time — same
  discipline as always. Plan-mode territory: spec it before engine code.
- Token note: Brad builds in **Fable** and tokens get eaten by the build, so the plan must be as
  complete as possible *before* starting. This brief + the two reference files are that plan's
  foundation.
