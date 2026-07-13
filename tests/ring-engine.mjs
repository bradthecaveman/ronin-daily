// RONIN — ring-graph engine (Node, no DOM). The next-generation board: a concentric
// ring GRAPH instead of a square grid. Mirrors the shipped square engine's methodology
// (deterministic guards, A* par/solver, seeded gen with a par-band accept/reject, naive-bot
// difficulty proxy) so tests/lab.mjs-style benchmarking applies unchanged.
//
// Cells are indexed by a flat integer id. Geometry: RINGS rings (1 = innermost, adjacent to
// the Emperor at centre; RINGS = outermost) each with counts[k] cells evenly spaced. Movement
// is along graph EDGES: an ORBIT step (±1 around a ring, wraps) or a RADIAL step (cross to the
// nearest cell of the neighbouring ring) — the radial step is legal only where the boundary is
// open (tier-gate model, within a tier) or where that specific cell is a gate (a single stair).
//
// Two gating models, one generation parameter (per the board brief):
//   'stepping' — every ring boundary is a wall; gatesPerBoundary gates on each (→ normal/hard).
//   'tier'     — only the two tier boundaries are walls with gates; open within a 2-ring tier (→ easy).

const TAU = Math.PI * 2;

export function hash32(a, b) {
  let h = 2166136261 >>> 0;
  h = Math.imul(h ^ (a >>> 0), 16777619);
  h = Math.imul(h ^ (b >>> 0), 16777619);
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return h >>> 0;
}
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}

// counts matching the visual reference: max(8, round(TAU*R/step /2)*2), R = 1.5 + (k-1) step units
export function refCounts(rings) {
  const out = [];
  for (let k = 1; k <= rings; k++) { const R = 1.5 + (k - 1); out.push(Math.max(8, Math.round((TAU * R) / 2) * 2)); }
  return out; // rings=6 -> [10,16,22,28,34,40]
}

export function makeRingEngine(cfg) {
  const RINGS = cfg.rings;
  const counts = cfg.counts || refCounts(RINGS);
  const STEPS = cfg.roninSteps, ARMY_MOVES = cfg.armyMoves;
  const tierOf = k => cfg.tierOf ? cfg.tierOf(k) : (k <= 2 ? 1 : k <= 4 ? 2 : 3);

  // ---- build cells + static adjacency (orbit + radial-nearest), gating-independent ----
  const cells = [];          // {id, ring, idx, ang}
  const byRing = [];         // byRing[k] = [ids...]
  for (let k = 1; k <= RINGS; k++) {
    byRing[k] = [];
    for (let i = 0; i < counts[k - 1]; i++) {
      const id = cells.length;
      cells.push({ id, ring: k, idx: i, ang: (i / counts[k - 1]) * TAU - Math.PI / 2 });
      byRing[k].push(id);
    }
  }
  const angDiff = (a, b) => { let d = a - b; while (d <= -Math.PI) d += TAU; while (d > Math.PI) d -= TAU; return d; };
  const nearestIn = (k, ang) => { // nearest cell of ring k-1 by angle
    let best = -1, bd = 1e9;
    for (const id of byRing[k - 1]) { const d = Math.abs(angDiff(cells[id].ang, ang)); if (d < bd) { bd = d; best = id; } }
    return best;
  };
  const orbitCW = [], orbitCCW = [], radialIn = [], radialOut = [];
  for (const c of cells) { orbitCW[c.id] = orbitCCW[c.id] = radialIn[c.id] = -1; radialOut[c.id] = []; }
  for (let k = 1; k <= RINGS; k++) {
    const rg = byRing[k], n = rg.length;
    for (let i = 0; i < n; i++) { orbitCW[rg[i]] = rg[(i + 1) % n]; orbitCCW[rg[i]] = rg[(i - 1 + n) % n]; }
    if (k > 1) for (const id of rg) { const inn = nearestIn(k, cells[id].ang); radialIn[id] = inn; radialOut[inn].push(id); }
  }
  const boundaryIsTier = k => tierOf(k) !== tierOf(k - 1); // boundary between ring k and k-1

  // ---- per-board adjacency: fix which radial edges are open (gates), build adj[] ----
  // openInward: Set of OUTER cell ids whose radial-inward edge is legal.
  function buildAdj(openInward) {
    const adj = cells.map(() => []);
    for (const c of cells) {
      adj[c.id].push(orbitCW[c.id], orbitCCW[c.id]);          // orbit always legal
      if (c.ring > 1 && openInward.has(c.id)) adj[c.id].push(radialIn[c.id]); // step inward through open edge
      for (const o of radialOut[c.id]) if (openInward.has(o)) adj[c.id].push(o); // step outward where the outer cell's edge is open
    }
    return adj;
  }

  // ---- BFS graph-distance from a source cell over adj (walls/gates respected) ----
  function distFrom(src, adj) {
    const d = new Int16Array(cells.length).fill(-1); d[src] = 0;
    let frontier = [src];
    while (frontier.length) { const nxt = []; for (const u of frontier) for (const v of adj[u]) if (d[v] < 0) { d[v] = d[u] + 1; nxt.push(v); } frontier = nxt; }
    return d;
  }

  // ---- ronin move options: distinct cells reachable in 1..STEPS edges, plus HOLD ----
  function roninOptions(ronin, army, adj) {
    const occ = new Set(army);
    const seen = new Set([ronin]);
    let frontier = [ronin]; const out = []; let anyStep = false;
    for (let s = 0; s < STEPS; s++) {
      const nxt = [];
      for (const u of frontier) for (const v of adj[u]) { if (occ.has(v) || seen.has(v)) continue; seen.add(v); nxt.push(v); out.push(v); anyStep = true; }
      frontier = nxt;
    }
    if (anyStep) out.push(-1 - ronin); // encode HOLD as -(ronin+1)
    return out;
  }
  const decodeEnd = (ep, ronin) => ep < 0 ? ronin : ep; // resolve HOLD to the ronin's cell

  // ---- deterministic guard reply: the ARMY_MOVES nearest guards each take one graph-step
  // that strictly reduces distance to the ronin; tiebreak inward then lowest cell id ----
  function armyReply(roninEnd, army, adj) {
    const R = roninEnd < 0 ? (-1 - roninEnd) : roninEnd; // resolve HOLD encoding to the ronin's cell
    const dist = distFrom(R, adj);
    const occ = new Set(army);
    const order = army.slice().sort((x, y) => (dist[x] - dist[y]) || (x - y));
    const out = army.slice(); const outSet = new Set(out);
    let done = 0, captured = false;
    for (const g of order) {
      if (done >= ARMY_MOVES) break;
      if (dist[g] < 0) continue;
      let best = -1, bestD = dist[g], bestRing = 99, bestId = 1e9;
      for (const v of adj[g]) {
        if (v === R) { best = v; captured = true; break; } // step onto ronin = capture
        if (outSet.has(v)) continue;
        const dv = dist[v]; if (dv < 0 || dv >= dist[g]) continue; // must strictly progress
        const ring = cells[v].ring;
        if (dv < bestD || (dv === bestD && (ring < bestRing || (ring === bestRing && v < bestId)))) { bestD = dv; best = v; bestRing = ring; bestId = v; }
      }
      if (captured) { return { army: out, captured: true }; }
      if (best < 0) continue;
      outSet.delete(g); outSet.add(best);
      out[out.indexOf(g)] = best; done++;
    }
    out.sort((a, b) => a - b);
    return { army: out, captured: false };
  }

  // ---- A* over (ronin, army) states; deterministic reply → single-agent search ----
  const hOf = ring => ring <= 1 ? 1 : Math.ceil((ring - 1) / STEPS) + 1; // admissible: turns to reach ring1 + ascend
  function solveBoard(board, opts = {}) {
    const adj = board.adj;
    const maxNodes = opts.maxNodes ?? 200000;
    const fLimit = Math.min(opts.fLimit ?? 40, 40);
    const wantPath = !!opts.wantPath;   // reconstruct the optimal line (for hints / reveal-the-way-in)
    const sKey = (ro, ar) => ro + ':' + ar.join(',');
    const start = { ro: board.ronin, army: board.army.slice().sort((a, b) => a - b), g: 0 };
    const f0 = hOf(cells[start.ro].ring);
    if (f0 > fLimit) return null;
    const buckets = []; const push = (f, n) => { (buckets[f] || (buckets[f] = [])).push(n); };
    const visited = new Map(); const k0 = sKey(start.ro, start.army); visited.set(k0, 0);
    const parent = wantPath ? new Map([[k0, null]]) : null;
    push(f0, start);
    let nodes = 0;
    for (let f = f0; f <= fLimit; f++) {
      const bucket = buckets[f]; if (!bucket) continue;
      for (let bi = 0; bi < bucket.length; bi++) {
        const node = bucket[bi];
        const kk = sKey(node.ro, node.army);
        if (visited.get(kk) < node.g) continue;
        if (cells[node.ro].ring === 1) {
          const out = { par: node.g + 1, nodes };
          if (wantPath) { const path = []; let ck = kk;   // walk parents → the ronin's move sequence
            while (parent.get(ck)) { const e = parent.get(ck); path.unshift(e.ep); ck = e.pk; }
            out.path = path; }                              // path = end-cells per turn; the final Ascend is implicit (+1)
          return out;
        }
        if (++nodes > maxNodes) return null;
        for (const ep of roninOptions(node.ro, node.army, adj)) {
          const end = decodeEnd(ep, node.ro);
          const rep = armyReply(ep < 0 ? ep : end, node.army, adj);
          if (rep.captured) continue;
          const g2 = node.g + 1, f2 = g2 + hOf(cells[end].ring);
          if (f2 > fLimit) continue;
          const ck = sKey(end, rep.army);
          const prevG = visited.get(ck); if (prevG !== undefined && prevG <= g2) continue;
          visited.set(ck, g2);
          if (wantPath) parent.set(ck, { pk: kk, ep: { cell: end, hold: ep < 0 } });
          push(f2, { ro: end, army: rep.army, g: g2 });
        }
      }
    }
    return null;
  }

  // Shortest legal edge-path (<= STEPS) from the ronin to a chosen destination cell, for the move
  // animation. Returns the cell sequence [ronin, ..., target], or null. HOLD/no-move → [ronin].
  function pathTo(ronin, army, adj, target) {
    if (target < 0 || target === ronin) return [ronin];
    const occ = new Set(army);
    const prev = new Map([[ronin, -1]]);
    let frontier = [ronin];
    for (let s = 0; s < STEPS; s++) {
      const nxt = [];
      for (const u of frontier) for (const v of adj[u]) {
        if (occ.has(v) || prev.has(v)) continue;
        prev.set(v, u);
        if (v === target) { const path = []; let c = v; while (c !== -1) { path.unshift(c); c = prev.get(c); } return path; }
        nxt.push(v);
      }
      frontier = nxt;
    }
    return null;
  }

  // ---- generator: choose gates per gating model, ronin start (outer ring), army by tier ----
  function chooseGates(rng) {
    const openInward = new Set();
    for (let k = 2; k <= RINGS; k++) {
      const gated = cfg.gating === 'stepping' ? true : boundaryIsTier(k);
      if (!gated) { for (const id of byRing[k]) openInward.add(id); continue; } // open boundary: every cell crosses
      const rg = byRing[k], n = rg.length, g = cfg.gatesPerBoundary;
      const start = Math.floor(rng() * n);
      for (let j = 0; j < g; j++) openInward.add(rg[(start + Math.round(j * n / g)) % n]); // g gates spread around
    }
    return openInward;
  }
  function genCandidate(rng) {
    const openInward = chooseGates(rng);
    const adj = buildAdj(openInward);
    const ronin = byRing[RINGS][Math.floor(rng() * counts[RINGS - 1])];
    // army by tier (outer→inner counts), keep ronin's neighbourhood and the ascend ring clear
    const nTiers = 3;
    const tierCells = [[], [], []]; // index 0 = outer tier(3), 1 = middle(2), 2 = inner(1)
    const clear = new Set([ronin, ...adj[ronin]]);
    for (const c of cells) {
      if (c.ring === 1) continue;                 // ascend ring stays clear
      if (clear.has(c.id)) continue;              // don't spawn on/next to the ronin
      const t = tierOf(c.ring); tierCells[3 - t].push(c.id);
    }
    const army = [];
    for (let i = 0; i < nTiers; i++) { shuffle(tierCells[i], rng); if (tierCells[i].length < cfg.armyCounts[i]) return null; army.push(...tierCells[i].slice(0, cfg.armyCounts[i])); }
    return { ronin, army: army.sort((a, b) => a - b), adj, openInward };
  }
  function generateFromSeed(seedBase) {
    let fallback = null;
    for (let t = 0; t < (cfg.genMaxTries ?? 400); t++) {
      const rng = mulberry32(hash32(seedBase, t));
      const cand = genCandidate(rng);
      if (!cand) continue;
      const res = solveBoard(cand, { fLimit: cfg.parMax, maxNodes: cfg.genMaxNodes ?? 200000 });
      if (!res) continue;   // unsolvable-in-band OR too expensive → re-roll the seed
      if (res.par >= cfg.parMin) return { ...cand, par: res.par, genTries: t + 1 };
      if (!fallback) fallback = { ...cand, par: res.par, genTries: t + 1 };
    }
    return fallback;
  }

  // ---- naive 1-ply bot: greedy toward the throne, refuses immediate capture (difficulty proxy) ----
  function naiveBot(board, maxTurns = 40) {
    let ronin = board.ronin, army = board.army.slice(), moves = 0;
    for (let turn = 0; turn < maxTurns; turn++) {
      if (cells[ronin].ring === 1) return { win: true, moves: moves + 1 };
      let best = null, bestScore = Infinity;
      for (const ep of roninOptions(ronin, army, board.adj)) {
        const end = decodeEnd(ep, ronin);
        const rep = armyReply(ep < 0 ? ep : end, army, board.adj);
        if (rep.captured) continue;
        const score = hOf(cells[end].ring) * 100 + cells[end].ring;
        if (score < bestScore) { bestScore = score; best = { end, army: rep.army }; }
      }
      if (!best) return { win: false, moves };
      ronin = best.end; army = best.army; moves++;
    }
    return { win: false, moves };
  }

  return { cfg, RINGS, counts, cells, byRing, tierOf, boundaryIsTier, buildAdj, distFrom,
    roninOptions, armyReply, solveBoard, pathTo, genCandidate, generateFromSeed, naiveBot, hash32, mulberry32 };
}
