// RONIN difficulty lab — parameterized engine for benchmarking rule/geometry variants.
// Mirrors shipped semantics (diagonal guards w/ orthogonal fallback, hold, A*).
// Not for shipping — a lab tool. cfg = {name, depths:[outer..inner], roninSteps,
// armyMoves, armyCounts:[outer..inner], gates:[outer..inner boundaries], parMin, parMax}

export function makeEngine(cfg) {
  const total = cfg.depths.reduce((a, b) => a + b, 0);
  const N = 2 * total + 1, C = total;
  const RONIN_STEPS = cfg.roninSteps, ARMY_MOVES = cfg.armyMoves;

  const key = (r, c) => r * N + c;
  const cheb = (r1, c1, r2, c2) => Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));
  const ringOf = (r, c) => Math.max(Math.abs(r - C), Math.abs(c - C));
  // tier index: 0 = emperor, 1 = innermost ring, ... counting outward
  const cums = []; { let acc = 0; for (let i = cfg.depths.length - 1; i >= 0; i--) { acc += cfg.depths[i]; cums.push(acc); } }
  const tierOf = (r, c) => { const d = ringOf(r, c); if (d === 0) return 0; for (let i = 0; i < cums.length; i++) if (d <= cums[i]) return i + 1; return cums.length; };

  function stepLegal(fr, fc, tr, tc, stairs) {
    if (tr < 0 || tr >= N || tc < 0 || tc >= N) return false;
    if (cheb(fr, fc, tr, tc) !== 1) return false;
    if (tr === C && tc === C) return false;
    const a = tierOf(fr, fc), b = tierOf(tr, tc);
    if (a === b) return true;
    return stairs.has(key(fr, fc)) || stairs.has(key(tr, tc));
  }

  function armyReply(ronin, army, stairs) {
    const arr = army.map(p => ({ r: p.r, c: p.c }));
    const order = arr.map((_, i) => i).sort((x, y) => {
      const dx = cheb(arr[x].r, arr[x].c, ronin.r, ronin.c);
      const dy = cheb(arr[y].r, arr[y].c, ronin.r, ronin.c);
      return dx - dy || x - y;
    });
    const occ = new Set(arr.map(p => key(p.r, p.c)));
    const moves = [];
    let done = 0;
    for (const i of order) {
      if (done >= ARMY_MOVES) break;
      const a = arr[i];
      const dr = Math.sign(ronin.r - a.r), dc = Math.sign(ronin.c - a.c);
      if (dr === 0 && dc === 0) continue;
      let tr = a.r + dr, tc = a.c + dc;
      if (!stepLegal(a.r, a.c, tr, tc, stairs) || occ.has(key(tr, tc))) {
        const rd = Math.abs(ronin.r - a.r), cd = Math.abs(ronin.c - a.c);
        const tries = (rd >= cd) ? [[a.r + dr, a.c], [a.r, a.c + dc]] : [[a.r, a.c + dc], [a.r + dr, a.c]];
        let picked = null;
        for (const [er, ec] of tries) {
          if (er === a.r && ec === a.c) continue;
          if (!stepLegal(a.r, a.c, er, ec, stairs)) continue;
          if (er === ronin.r && ec === ronin.c) { picked = [er, ec]; break; }
          if (!occ.has(key(er, ec))) { picked = [er, ec]; break; }
        }
        if (!picked) continue;
        tr = picked[0]; tc = picked[1];
      }
      if (tr === ronin.r && tc === ronin.c) {
        moves.push({ i }); a.r = tr; a.c = tc;
        return { army: arr, moves, captured: true };
      }
      if (occ.has(key(tr, tc))) continue;
      occ.delete(key(a.r, a.c)); occ.add(key(tr, tc));
      moves.push({ i }); a.r = tr; a.c = tc; done++;
    }
    return { army: arr, moves, captured: false };
  }

  function roninOptions(ronin, army, stairs) {
    const occ = new Set(army.map(p => key(p.r, p.c)));
    const seen = new Set([key(ronin.r, ronin.c)]);
    let frontier = [ronin];
    const out = [];
    let anyStep = false;
    for (let s = 0; s < RONIN_STEPS; s++) {
      const nxt = [];
      for (const p of frontier) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = p.r + dr, nc = p.c + dc;
          if (!stepLegal(p.r, p.c, nr, nc, stairs)) continue;
          const k = key(nr, nc);
          if (occ.has(k) || seen.has(k)) continue;
          seen.add(k);
          const q = { r: nr, c: nc };
          nxt.push(q); out.push(q);
          anyStep = true;
        }
      }
      frontier = nxt;
    }
    if (anyStep) out.push({ r: ronin.r, c: ronin.c, hold: true });
    return out;
  }

  const h = (r, c) => { const d = ringOf(r, c); return d <= 1 ? 1 : Math.ceil((d - 1) / RONIN_STEPS) + 1; };

  function solveBoard(board, opts = {}) {
    const stairs = board.stairs;
    const maxNodes = opts.maxNodes ?? 120000;
    const fLimit = Math.min(opts.fLimit ?? 40, 40);
    const sKey = (ro, ar) => { let s = '' + (ro.r * N + ro.c); for (const p of ar) s += ',' + (p.r * N + p.c); return s; };
    const start = { ro: { ...board.ronin }, army: board.army.map(p => ({ ...p })), g: 0 };
    const f0 = h(start.ro.r, start.ro.c);
    if (f0 > fLimit) return null;
    const buckets = [];
    const push = (f, node) => { (buckets[f] || (buckets[f] = [])).push(node); };
    const visited = new Map();
    visited.set(sKey(start.ro, start.army), 0);
    push(f0, start);
    let nodes = 0;
    for (let f = f0; f <= fLimit; f++) {
      const bucket = buckets[f];
      if (!bucket) continue;
      for (let bi = 0; bi < bucket.length; bi++) {
        const node = bucket[bi];
        const kk = sKey(node.ro, node.army);
        if (visited.get(kk) < node.g) continue;
        if (ringOf(node.ro.r, node.ro.c) === 1) return { par: node.g + 1, nodes };
        if (++nodes > maxNodes) return null;
        for (const ep of roninOptions(node.ro, node.army, board.stairs)) {
          const rep = armyReply(ep, node.army, board.stairs);
          if (rep.captured) continue;
          const g2 = node.g + 1;
          const f2 = g2 + h(ep.r, ep.c);
          if (f2 > fLimit) continue;
          const child = { ro: { r: ep.r, c: ep.c }, army: rep.army, g: g2 };
          const ck = sKey(child.ro, child.army);
          const prevG = visited.get(ck);
          if (prevG !== undefined && prevG <= g2) continue;
          visited.set(ck, g2);
          push(f2, child);
        }
      }
    }
    return null;
  }

  function hash32(a, b) {
    let x = 2166136261 >>> 0;
    x = Math.imul(x ^ (a >>> 0), 16777619);
    x = Math.imul(x ^ (b >>> 0), 16777619);
    x ^= x >>> 13; x = Math.imul(x, 0x5bd1e995); x ^= x >>> 15;
    return x >>> 0;
  }
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) | 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // boundary radii, outermost boundary first (between tier k and k+1)
  const boundaryRadii = cums.slice(0, cums.length - 1).reverse(); // e.g. depths [2,2,2] -> cums [2,4,6] -> boundaries [4,2]

  function genCandidate(rng) {
    const stairs = new Set();
    for (let b = 0; b < boundaryRadii.length; b++) {
      const R = boundaryRadii[b];
      const count = cfg.gates[b];
      const sides = shuffle([0, 1, 2, 3], rng).slice(0, count);
      for (const s of sides) {
        const span = 2 * R - 1;
        const off = (C - R + 1) + Math.floor(rng() * span);
        let r, c;
        if (s === 0) { r = C - R; c = off; } else if (s === 1) { r = off; c = C + R; }
        else if (s === 2) { r = C + R; c = off; } else { r = off; c = C - R; }
        stairs.add(key(r, c));
      }
    }
    const startTiles = [[0, 0], [0, C], [0, N - 1], [C, 0], [C, N - 1], [N - 1, 0], [N - 1, C], [N - 1, N - 1]];
    const [sr, sc] = startTiles[Math.floor(rng() * 8)];
    const ronin = { r: sr, c: sc };

    const tierCells = cfg.armyCounts.map(() => []);
    const nTiers = cfg.depths.length;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const d = ringOf(r, c);
      if (d === 0 || stairs.has(key(r, c))) continue;
      const t = tierOf(r, c); // 1 = innermost
      const idx = nTiers - t;  // 0 = outermost in armyCounts order
      if (idx < 0 || idx >= nTiers) continue;
      if (idx === 0 && cheb(r, c, ronin.r, ronin.c) < 4) continue;       // outermost: keep clear of start
      if (idx === nTiers - 1 && d === 1) continue;                        // innermost: keep ascend ring clear
      tierCells[idx].push({ r, c });
    }
    const army = [];
    for (let i = 0; i < nTiers; i++) {
      shuffle(tierCells[i], rng);
      if (tierCells[i].length < cfg.armyCounts[i]) return null;
      army.push(...tierCells[i].slice(0, cfg.armyCounts[i]));
    }
    return { ronin, army, stairs };
  }

  function generateFromSeed(seedBase) {
    let fallback = null;
    for (let t = 0; t < 400; t++) {
      const rng = mulberry32(hash32(seedBase, t));
      const cand = genCandidate(rng);
      if (!cand) continue;
      const res = solveBoard(cand, { fLimit: cfg.parMax });
      if (!res) continue;
      if (res.par >= cfg.parMin) return { ...cand, par: res.par, genTries: t + 1 };
      if (!fallback) fallback = { ...cand, par: res.par, genTries: t + 1 };
    }
    return fallback;
  }

  // Greedy 1-ply player: prefers progress toward the emperor, refuses moves that
  // get it captured immediately. Its win rate ~= how forgiving the board is for
  // a decent-but-not-perfect player.
  function naiveBot(board, maxTurns = 40) {
    let ronin = { ...board.ronin }, army = board.army.map(p => ({ ...p })), moves = 0;
    for (let turn = 0; turn < maxTurns; turn++) {
      if (ringOf(ronin.r, ronin.c) === 1) return { win: true, moves: moves + 1 };
      const opts = roninOptions(ronin, army, board.stairs);
      let best = null, bestScore = Infinity;
      for (const ep of opts) {
        const rep = armyReply(ep, army, board.stairs);
        if (rep.captured) continue;
        const score = h(ep.r, ep.c) * 100 + ringOf(ep.r, ep.c);
        if (score < bestScore) { bestScore = score; best = { ep, rep }; }
      }
      if (!best) return { win: false, moves };
      ronin = { r: best.ep.r, c: best.ep.c };
      army = best.rep.army;
      moves++;
    }
    return { win: false, moves };
  }

  return { N, C, cfg, key, cheb, ringOf, tierOf, stepLegal, armyReply, roninOptions, solveBoard, genCandidate, generateFromSeed, naiveBot, hash32 };
}

// ---- benchmark runner ----
export function benchConfig(cfg, days = 120) {
  const E = makeEngine(cfg);
  const seedBase = (d) => E.hash32(0x4C414221, d); // "LAB!"
  const rawPars = {};
  let rawUnsolved = 0;
  for (let d = 1; d <= days; d++) {
    // raw: first solvable candidate regardless of band
    for (let t = 0; t < 50; t++) {
      const rng = (function () { let x = E.hash32(seedBase(d), t); return makeRng(x); })();
      const cand = E.genCandidate(rng);
      if (!cand) continue;
      const res = E.solveBoard(cand, { fLimit: 30 });
      if (res) { rawPars[res.par] = (rawPars[res.par] || 0) + 1; break; }
      if (t === 49) rawUnsolved++;
    }
  }
  function makeRng(seed) {
    let t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) | 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  const pars = {}, naive = { wins: 0, total: 0 };
  let tries = [], times = [], fallbacks = 0;
  for (let d = 1; d <= days; d++) {
    const t0 = performance.now();
    const b = E.generateFromSeed(seedBase(d));
    const ms = performance.now() - t0;
    if (!b) { fallbacks++; continue; }
    if (b.par < cfg.parMin) fallbacks++;
    pars[b.par] = (pars[b.par] || 0) + 1;
    tries.push(b.genTries); times.push(ms);
    const nb = E.naiveBot(b);
    naive.total++;
    if (nb.win) naive.wins++;
  }
  const avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
  return {
    name: cfg.name, N: E.N,
    rawPars, rawUnsolved,
    bandedPars: pars, fallbacks,
    genTriesAvg: +avg(tries).toFixed(1), genMsAvg: Math.round(avg(times)), genMsMax: Math.round(Math.max(...times, 0)),
    naiveWinPct: Math.round(100 * naive.wins / (naive.total || 1)),
  };
}
