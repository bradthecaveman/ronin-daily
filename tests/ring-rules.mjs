// Ring-engine rules regression — the graph-board analogues of the square game's invariants.
// Run: node tests/ring-rules.mjs   (exits non-zero on failure)
import { makeRingEngine } from './ring-engine.mjs';
import { RING_MODES } from './ring-config.mjs';

let pass = 0, fail = 0;
const t = (name, cond) => { if (cond) pass++; else { fail++; console.error('FAIL:', name); } };

const Etier = makeRingEngine(RING_MODES.easy);      // tier gating, 3-step
const Estep = makeRingEngine(RING_MODES.hard);      // every-ring gating, 3-step
const cand = (E, s) => { for (let i = 0; i < 20; i++) { const c = E.genCandidate(E.mulberry32(E.hash32(s, i))); if (c) return c; } throw new Error('no candidate'); };

// --- adjacency is a well-formed undirected graph: symmetric, orbit always present ---
{
  const c = cand(Etier, 1), adj = c.adj;
  let sym = true;
  for (let u = 0; u < Etier.cells.length; u++) for (const v of adj[u]) if (!adj[v].includes(u)) sym = false;
  t('adjacency is symmetric', sym);
  let orbitOk = true;
  for (let k = 1; k <= 6; k++) { const rg = Etier.byRing[k], n = rg.length;
    for (let i = 0; i < n; i++) { const cw = rg[(i + 1) % n], ccw = rg[(i - 1 + n) % n];
      if (!adj[rg[i]].includes(cw) || !adj[rg[i]].includes(ccw)) orbitOk = false; } }
  t('orbit neighbours are always adjacent (free orbit)', orbitOk);
}

// --- Through-wall capture: a guard may only cross a ring boundary through an open gate ---
{
  const g = Etier.byRing[2][0];
  const adjOpen = Etier.buildAdj(new Set([g]));           // one gate open on the ring2|1 boundary
  const inner = adjOpen[g].find(v => Etier.cells[v].ring === 1);
  t('an open gate creates an inward edge', inner !== undefined);
  t('guard captures across an OPEN gate', Etier.armyReply(inner, [g], adjOpen).captured === true);
  const adjClosed = Etier.buildAdj(new Set());            // no gates anywhere
  t('guard CANNOT capture through a wall (no gate)', Etier.armyReply(inner, [g], adjClosed).captured === false);
}

// --- Only the ARMY_MOVES nearest guards move, and movers reduce distance to the ronin ---
{
  const c = cand(Etier, 2), adj = c.adj;
  const dist = Etier.distFrom(c.ronin, adj);
  const sumBefore = c.army.reduce((s, g) => s + Math.max(0, dist[g]), 0);
  const rep = Etier.armyReply(c.ronin, c.army, adj);
  const sumAfter = rep.army.reduce((s, g) => s + Math.max(0, dist[g]), 0);
  const moved = rep.army.filter(x => !c.army.includes(x)).length;
  t('at most ARMY_MOVES guards move', moved <= RING_MODES.easy.armyMoves);
  t('movers strictly reduce total distance to ronin', sumAfter <= sumBefore && (moved === 0 || sumAfter < sumBefore));
}

// --- Ronin options: exclude occupied cells, offer HOLD, more reach with more steps ---
{
  const c = cand(Etier, 3);
  const opts = Etier.roninOptions(c.ronin, c.army, c.adj);
  t('ronin options exclude occupied cells', !opts.some(o => o >= 0 && c.army.includes(o)));
  t('HOLD offered when a move exists', opts.some(o => o < 0));
  const E2 = makeRingEngine({ ...RING_MODES.easy, roninSteps: 2 });
  const start = Etier.byRing[6][0], openNone = new Set();
  const o3 = Etier.roninOptions(start, [], Etier.buildAdj(openNone));
  const o2 = E2.roninOptions(start, [], E2.buildAdj(openNone));
  t('3-step reaches more cells than 2-step', o3.length > o2.length);
}

// --- Win = reach the inner ring, then Ascend (counts as the final move) ---
{
  const c = cand(Etier, 4);
  const res = Etier.solveBoard({ ronin: Etier.byRing[1][0], army: [], adj: c.adj }, { fLimit: 5 });
  t('ronin already on inner ring solves in 1 (Ascend)', res && res.par === 1);
}

// --- Gating structure: tier model opens within-tier boundaries, gates only tier walls ---
{
  const oi = cand(Etier, 5).openInward;
  const inRing = k => Etier.byRing[k].filter(x => oi.has(x)).length;
  t('tier: within-tier boundary fully open (ring 2)', inRing(2) === Etier.counts[1]);
  t('tier: within-tier boundary fully open (ring 4)', inRing(4) === Etier.counts[3]);
  t('tier: tier wall gated to gatesPerBoundary (ring 3)', inRing(3) === RING_MODES.easy.gatesPerBoundary);
  t('tier: tier wall gated to gatesPerBoundary (ring 5)', inRing(5) === RING_MODES.easy.gatesPerBoundary);
}
{
  const oi = cand(Estep, 6).openInward;
  let allGated = true;
  for (let k = 2; k <= 6; k++) if (Estep.byRing[k].filter(x => oi.has(x)).length !== RING_MODES.hard.gatesPerBoundary) allGated = false;
  t('stepping: every ring boundary gated to gatesPerBoundary', allGated);
}

// --- Determinism: same seed → same board; armyReply is pure ---
{
  const b1 = Etier.generateFromSeed(Etier.hash32(RING_MODES.easy.salt, 7));
  const b2 = Etier.generateFromSeed(Etier.hash32(RING_MODES.easy.salt, 7));
  t('generateFromSeed is deterministic', b1 && b2 && b1.ronin === b2.ronin && b1.par === b2.par && b1.army.join(',') === b2.army.join(','));
  const r1 = Etier.armyReply(b1.ronin, b1.army, b1.adj), r2 = Etier.armyReply(b1.ronin, b1.army, b1.adj);
  t('armyReply is pure/deterministic', r1.captured === r2.captured && r1.army.join(',') === r2.army.join(','));
}

// --- Modes are distinct and each daily board sits in its band ---
{
  const e = Etier.generateFromSeed(Etier.hash32(RING_MODES.easy.salt, 3));
  const h = Estep.generateFromSeed(Estep.hash32(RING_MODES.hard.salt, 3));
  t('easy board within its par band', e && e.par >= RING_MODES.easy.parMin && e.par <= RING_MODES.easy.parMax);
  t('hard board within its par band', h && h.par >= RING_MODES.hard.parMin && h.par <= RING_MODES.hard.parMax);
}

// --- Solver path (for hints + reveal-the-way-in): exists, right length, replays legally to the throne ---
{
  const b = Etier.generateFromSeed(Etier.hash32(RING_MODES.easy.salt, 11));
  const res = Etier.solveBoard(b, { fLimit: RING_MODES.easy.parMax, wantPath: true });
  t('solver returns a path when asked', res && Array.isArray(res.path));
  t('path length is par - 1 (moves before the Ascend)', res && res.path.length === res.par - 1);
  let ro = b.ronin, army = b.army, legal = true;
  for (const step of res.path) {
    const opts = Etier.roninOptions(ro, army, b.adj);
    const ok = step.hold ? opts.some(o => o < 0) : opts.includes(step.cell);
    if (!ok) { legal = false; break; }
    const rep = Etier.armyReply(step.hold ? (-1 - ro) : step.cell, army, b.adj);
    if (rep.captured) { legal = false; break; }
    ro = step.cell; army = rep.army;
  }
  t('optimal path replays legally without capture', legal);
  t('optimal path ends on the inner ring (ready to Ascend)', Etier.cells[ro].ring === 1);
}

console.log(`ring-rules: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
