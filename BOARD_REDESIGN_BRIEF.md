# RONIN — Circular Board Redesign Brief

*Created 2026-07-08. Self-contained handover for continuing this design (new chat, or the
Fable build session). Pair with the two reference files named below — together they're enough
to continue without re-deriving anything. Sits alongside `STATUS.md` (the live square game's
source of truth); this brief covers the **proposed next-generation board** only.*

> **2026-07-11 — RESOLVED: the board is the GRID-TILE board.** The scattered-stone look
> (Options 1/2, the `-1b`/`-2c` lozenge mockups) lost the bake-off; it read too busy for an
> infiltration board. The winning direction is **one continuous polar board** — cells touch
> edge-to-edge, split by thin keylines like the square game (concentric ring walls + radial
> spokes), with **ascending "terrace" drop-shadows** climbing to the throne. Gates are a
> **single stair cell** (see the gate section below). The two gating models survive as a
> generation parameter and still map to the difficulty ladder, now both rendered in this grid
> language. Canonical references: **`ronin-ring-reference-3.html`** (stepping-stone gating) and
> **`ronin-ring-reference-3-tier.html`** (tier-gate). The stepping-stone *look* is parked
> separately as the "Step Stone" maze-game idea, not part of this game. Difficulty ladder,
> movement/graph model, guard-AI TODO, and build order below are all unchanged by this.

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
(rendered as a single stair cell — see gate section). Reach the inner ring, then ascend.

## The two gating models (both kept — a generation parameter, not a fork)

Same physical geometry (6 rings) and same grid-tile look; they differ only in **where the walls/gates
are**. Both are now rendered in the grid-tile language and both feed the difficulty ladder:

- **Stepping-stone gating** (`ronin-ring-reference-3.html`): every ring boundary is a wall.
  **Two gates per ring boundary** (5 boundaries → 10 gates), each a single stair cell. Tighter,
  more chokepoints, more forced angular detours, higher par, spikier difficulty. → normal/hard/epic.
- **Tier-gate gating** (`ronin-ring-reference-3-tier.html`): only the two **tier boundaries** are
  walls (2 boundaries → ~4 gates). You move **freely within a 2-ring tier** (orbit + cross between
  its two rings), and the three tiers read as three colour-band terraces. Calmer, more forgiving,
  reads more cleanly. → easy.

Engineering note that makes both cheap: the engine is **a graph of cells + gate-edges**, so the
only difference between the models is a **generation parameter** — *gate every ring boundary*
(stepping-stone) vs *gate only tier boundaries, open within a tier* (tier-gate). One engine, one
generator, a per-mode gating config. Neither reference is wasted.

## Difficulty ladder (Brad's proposal, 2026-07-08 — leading candidate)

Each rung raises difficulty on a **different axis**, so each mode has its own identity, not just
bigger numbers:

| Mode   | Gating               | Moves/turn | Extra                                          |
|--------|----------------------|-----------|-------------------------------------------------|
| easy   | tier-gate (2 walls)  | 3         | gentle                                          |
| normal | stepping-stone (5 walls) | 3     | —                                               |
| hard   | stepping-stone (5 walls) | 2     | —                                               |
| epic   | stepping-stone (5 walls) | 2     | + mechanics (see epic sketch in STATUS.md)      |

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
either an **orbit step** (to the adjacent cell on the same ring) or a **gate step** (inward
through a stair cell's opening). N = moves/turn (3 or 2 per the ladder). Guards: step toward the
ronin along the graph (reduce graph-distance), the two nearest, deterministic — cleaner than the
square game's polar-angle logic. Guard behaviour on the ring graph is **not yet specified** —
needs defining + lab-tuning. Ascend rule still open (Option A: reach any inner-ring cell → ascend;
Option B: a final gate to the throne too) — see STATUS.md.

## Visual / rendering language (grid-tile — embodied in the reference-3 files)

Read the two `reference-3*` HTML files for the exact, working implementation. Key decisions:

- **One continuous board, not scattered pieces.** Each ring is a full annulus of cells that
  **touch edge-to-edge** (cell radial height = one `step`, so ring *k*'s outer edge is ring
  *k+1*'s inner edge — no gaps). The cells are split by **thin keylines**, exactly the square
  game's two-tier treatment: faint **radial spokes** at every cell edge (`GRID` ≈
  `rgba(58,50,43,.13)`) and slightly stronger **concentric ring walls** (`WALL` ≈ `.26–.32`).
- **Palette**: monochrome cream (live game's v1.8 art direction). Stepping-stone board uses a
  per-ring gradient (darkest outer → lightest throne); tier board uses **3 tier colour bands**.
  Emperor + Ronin are the only saturated (red/gold) elements; guards are dark charcoal **discs**
  — the round actors are the *only* circles left, which pops them off the flat mosaic floor.
- **Ascending terraces**: each ring (stepping-stone) / each tier (tier board) casts a drop shadow
  onto its outer/lower neighbour, drawn outer→inner, so the board reads as terraces climbing to
  the throne — a ziggurat, not a flat dartboard. On the tier board the lift steps as **3 plateaus**
  (both rings of a tier share a height); on the stepping-stone board it climbs per-ring.
- **Gates = a single stair cell** (settled 2026-07-11; not a fused double). The gate is the OUTER
  cell of a crossing — the one you climb from. It renders like the square game's stair: a radial
  gradient from a **darker "foot"** at its outer edge (`darken(shade, FOOTF=0.86)`) up to **exactly
  the destination ring/tier's colour** at the top (the wall it opens through), plus ~5 thin
  **concentric tread arcs** that lighten as they ascend (square's `treadCols` palette). The ring
  wall **opens** (keyline arc skipped) across the gate, so the stair leads through the gap onto a
  normal inner cell beyond. Mechanically a gate is just one graph edge; shading one cell is enough
  — one clean chokepoint. (The old fused-lozenge double is retired.)
- **Emperor**: red tile, gold sun, red core, round, in the central throne chamber (paper moat
  around it).
- **Ronin**: red lacquer disc with a gold curved-katana slash.

Still open (Brad, 2026-07-11): "still wants to adjust some design touches" — expect more visual
iteration before this is frozen. Tread-arc weight, keyline weights, and terrace-lift strength are
the live dials. Whatever we settle, apply to BOTH gating boards so they stay identical.

## Reference files (canonical)

- **`ronin-ring-reference-3.html`** — grid-tile board, **stepping-stone gating** (5 walls, 2 gates
  per ring boundary). Single stair-cell gates, terrace shadows, radial per-ring gradient.
- **`ronin-ring-reference-3-tier.html`** — grid-tile board, **tier-gate gating** (2 walls, free
  within each 2-ring tier). Same stair-cell + terrace treatment, 3 colour-band tiers.
- Superseded — ignore: `ronin-ring-reference-1b.html` / `-2c.html` (the stone/lozenge look; the
  look itself is parked as the separate "Step Stone" maze idea), `ronin-tiered-board.html` (original
  sketch), and all earlier iterations (`ronin-ring-reference.html`, `-2.html`, `-2b.html`,
  `_polar_mock*.html`).

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
