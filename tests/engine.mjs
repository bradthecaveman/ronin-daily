// Ronin Daily — pure game engine (no DOM).
// Tuning copy for Node benchmarking; authoritative copy ships inside ronin_daily_v1.html.

export const N = 13, C = 6;
export const RONIN_STEPS = 2;   // ronin steps per turn
export const ARMY_MOVES = 2;    // distinct army pieces moved per army turn
export const PAR_MIN = 8, PAR_MAX = 14;
export const GEN_MAX_TRIES = 400;
export const EPOCH_UTC = Date.UTC(2026, 6, 4); // puzzle #1 = 2026-07-04 (local date)

export const START_TILES = [[0,0],[0,6],[0,12],[6,0],[6,12],[12,0],[12,6],[12,12]];

export const key = (r, c) => r * 13 + c;
export const cheb = (r1, c1, r2, c2) => Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));
export const ringOf = (r, c) => Math.max(Math.abs(r - C), Math.abs(c - C));
// tiers: 0 emperor, 1 inner, 2 middle, 3 bottom
export const tierOf = (r, c) => { const d = ringOf(r, c); return d === 0 ? 0 : d <= 2 ? 1 : d <= 4 ? 2 : 3; };

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
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

export function dayNumber(date) {
  const d = date || new Date();
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH_UTC) / 86400000) + 1;
}

// Geometry-only step legality (ignores occupancy).
export function stepLegal(fr, fc, tr, tc, stairs) {
  if (tr < 0 || tr > 12 || tc < 0 || tc > 12) return false;
  if (cheb(fr, fc, tr, tc) !== 1) return false;
  if (tr === C && tc === C) return false; // emperor tile unwalkable
  const a = tierOf(fr, fc), b = tierOf(tr, tc);
  if (a === b) return true;
  return stairs.has(key(fr, fc)) || stairs.has(key(tr, tc));
}

// Deterministic army reply. Returns { army, moves, captured }.
export function armyReply(ronin, army, stairs) {
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
    // DIAGONAL VARIANT: guards step 8-directionally toward the ronin (chebyshev),
    // keeping both axes when possible; fall back to an orthogonal step if the
    // diagonal is blocked by a wall/occupant.
    let dr = Math.sign(ronin.r - a.r), dc = Math.sign(ronin.c - a.c);
    if (dr === 0 && dc === 0) continue;
    let tr = a.r + dr, tc = a.c + dc;
    if (!stepLegal(a.r, a.c, tr, tc, stairs) || occ.has(key(tr, tc))) {
      // diagonal blocked — try the dominant orthogonal axis, then the other
      const rd = Math.abs(ronin.r - a.r), cd = Math.abs(ronin.c - a.c);
      const tries = (rd >= cd)
        ? [[a.r + dr, a.c], [a.r, a.c + dc]]
        : [[a.r, a.c + dc], [a.r + dr, a.c]];
      let picked = null;
      for (const [er, ec] of tries) {
        if (er === a.r && ec === a.c) continue;
        if (!stepLegal(a.r, a.c, er, ec, stairs)) continue; // never reach through a wall
        if (er === ronin.r && ec === ronin.c) { picked = [er, ec]; break; }
        if (!occ.has(key(er, ec))) { picked = [er, ec]; break; }
      }
      if (!picked) continue;
      tr = picked[0]; tc = picked[1];
    }
    if (tr === ronin.r && tc === ronin.c) {
      moves.push({ i, from: { r: a.r, c: a.c }, to: { r: tr, c: tc } });
      a.r = tr; a.c = tc;
      return { army: arr, moves, captured: true };
    }
    if (occ.has(key(tr, tc))) continue;
    occ.delete(key(a.r, a.c)); occ.add(key(tr, tc));
    moves.push({ i, from: { r: a.r, c: a.c }, to: { r: tr, c: tc } });
    a.r = tr; a.c = tc; done++;
  }
  return { army: arr, moves, captured: false };
}

// All distinct end-tiles the ronin can finish a turn on (1..RONIN_STEPS steps),
// plus a "hold" pseudo-endpoint (step out and back) whenever any step exists.
export function roninOptions(ronin, army, stairs) {
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

// Shortest legal step-path (<= RONIN_STEPS) from ronin to target, or null.
export function pathTo(ronin, army, stairs, target) {
  if (target.hold || (target.r === ronin.r && target.c === ronin.c)) {
    // out-and-back on any legal neighbour
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = ronin.r + dr, nc = ronin.c + dc;
      if (!stepLegal(ronin.r, ronin.c, nr, nc, stairs)) continue;
      if (army.some(p => p.r === nr && p.c === nc)) continue;
      return [{ r: nr, c: nc }, { r: ronin.r, c: ronin.c }];
    }
    return null;
  }
  const occ = new Set(army.map(p => key(p.r, p.c)));
  const prev = new Map([[key(ronin.r, ronin.c), null]]);
  let frontier = [ronin];
  for (let s = 0; s < RONIN_STEPS; s++) {
    const nxt = [];
    for (const p of frontier) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = p.r + dr, nc = p.c + dc;
        if (!stepLegal(p.r, p.c, nr, nc, stairs)) continue;
        const k = key(nr, nc);
        if (occ.has(k) || prev.has(k)) continue;
        prev.set(k, p);
        if (nr === target.r && nc === target.c) {
          const path = [];
          let cur = { r: nr, c: nc };
          while (cur && !(cur.r === ronin.r && cur.c === ronin.c)) {
            path.unshift({ r: cur.r, c: cur.c });
            cur = prev.get(key(cur.r, cur.c));
          }
          return path;
        }
        nxt.push({ r: nr, c: nc });
      }
    }
    frontier = nxt;
  }
  return null;
}

// A* over (ronin, army) states; army reply is deterministic, so this is
// single-agent search. Returns { par, nodes, path? } or null.
// par counts ronin turns including the final Ascend.
export function solveBoard(board, opts = {}) {
  const stairs = board.stairs instanceof Set ? board.stairs : new Set(board.stairs);
  const maxNodes = opts.maxNodes ?? 250000;
  const fLimit = Math.min(opts.fLimit ?? 60, 60);
  const wantPath = !!opts.wantPath;
  const h = (r, c) => { const d = ringOf(r, c); return d <= 1 ? 1 : Math.ceil((d - 1) / RONIN_STEPS) + 1; };
  const sKey = (ro, ar) => { let s = '' + (ro.r * 13 + ro.c); for (const p of ar) s += ',' + (p.r * 13 + p.c); return s; };

  const start = { ro: { r: board.ronin.r, c: board.ronin.c }, army: board.army.map(p => ({ r: p.r, c: p.c })), g: 0 };
  const f0 = h(start.ro.r, start.ro.c);
  if (f0 > fLimit) return null;

  const buckets = [];
  const push = (f, node) => { (buckets[f] || (buckets[f] = [])).push(node); };
  const visited = new Map();
  const parent = wantPath ? new Map() : null;
  const k0 = sKey(start.ro, start.army);
  visited.set(k0, 0);
  if (wantPath) parent.set(k0, null);
  push(f0, start);

  let nodes = 0;
  for (let f = f0; f <= fLimit; f++) {
    const bucket = buckets[f];
    if (!bucket) continue;
    for (let bi = 0; bi < bucket.length; bi++) {
      const node = bucket[bi];
      const kk = sKey(node.ro, node.army);
      if (visited.get(kk) < node.g) continue; // stale entry
      if (ringOf(node.ro.r, node.ro.c) === 1) {
        const result = { par: node.g + 1, nodes };
        if (wantPath) {
          const path = [];
          let ck = kk;
          while (ck) {
            const ent = parent.get(ck);
            if (ent) path.unshift(ent.ep);
            ck = ent ? ent.pk : null;
          }
          result.path = path; // endpoint per turn; Ascend follows
        }
        return result;
      }
      if (++nodes > maxNodes) return null;
      for (const ep of roninOptions(node.ro, node.army, stairs)) {
        const rep = armyReply(ep, node.army, stairs);
        if (rep.captured) continue;
        const g2 = node.g + 1;
        const f2 = g2 + h(ep.r, ep.c);
        if (f2 > fLimit) continue;
        const child = { ro: { r: ep.r, c: ep.c }, army: rep.army, g: g2 };
        const ck = sKey(child.ro, child.army);
        const prevG = visited.get(ck);
        if (prevG !== undefined && prevG <= g2) continue;
        visited.set(ck, g2);
        if (wantPath) parent.set(ck, { pk: kk, ep: { r: ep.r, c: ep.c, hold: !!ep.hold } });
        push(f2, child);
      }
    }
  }
  return null;
}

// One candidate layout from an RNG stream: gates, ronin start, army.
export function genCandidate(rng) {
  const stairs = new Set();
  const sidesO = shuffle([0, 1, 2, 3], rng).slice(0, 3); // outer gates: 3 of 4 sides
  for (const s of sidesO) {
    const off = 3 + Math.floor(rng() * 7); // 3..9 along the ring-4 band
    let r, c;
    if (s === 0) { r = 2; c = off; } else if (s === 1) { r = off; c = 10; }
    else if (s === 2) { r = 10; c = off; } else { r = off; c = 2; }
    stairs.add(key(r, c));
  }
  const sidesI = shuffle([0, 1, 2, 3], rng).slice(0, 2); // inner gates: 2 of 4 sides
  for (const s of sidesI) {
    const off = 5 + Math.floor(rng() * 3); // 5..7 along the ring-2 band
    let r, c;
    if (s === 0) { r = 4; c = off; } else if (s === 1) { r = off; c = 8; }
    else if (s === 2) { r = 8; c = off; } else { r = off; c = 4; }
    stairs.add(key(r, c));
  }
  const [sr, sc] = START_TILES[Math.floor(rng() * 8)];
  const ronin = { r: sr, c: sc };

  const bottom = [], middle = [], inner = [];
  for (let r = 0; r < 13; r++) for (let c = 0; c < 13; c++) {
    const d = ringOf(r, c);
    if (stairs.has(key(r, c))) continue;
    if (d >= 5) { if (cheb(r, c, ronin.r, ronin.c) >= 4) bottom.push({ r, c }); }
    else if (d >= 3) middle.push({ r, c });
    else if (d === 2) inner.push({ r, c });
  }
  shuffle(bottom, rng); shuffle(middle, rng); shuffle(inner, rng);
  const army = [...bottom.slice(0, 6), ...middle.slice(0, 4), ...inner.slice(0, 2)];
  if (army.length !== 12) return null;
  return { ronin, army, stairs };
}

// Deterministic daily/practice board: iterate candidate seeds until one
// solves inside the par band. Identical on every client.
export function generateFromSeed(seedBase) {
  let fallback = null;
  for (let t = 0; t < GEN_MAX_TRIES; t++) {
    const rng = mulberry32(hash32(seedBase, t));
    const cand = genCandidate(rng);
    if (!cand) continue;
    const res = solveBoard(cand, { fLimit: PAR_MAX, maxNodes: 60000 });
    if (!res) continue;
    if (res.par >= PAR_MIN) return { ...cand, par: res.par, genTries: t + 1 };
    if (!fallback) fallback = { ...cand, par: res.par, genTries: t + 1 };
  }
  return fallback;
}

export const dailyBoard = (dayNum) => generateFromSeed(hash32(0x524F4E49, dayNum));   // "RONI"
export const practiceBoard = (seed) => generateFromSeed(hash32(0x50524143, seed));    // "PRAC"
