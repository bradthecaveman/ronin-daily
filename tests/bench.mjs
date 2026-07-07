// Benchmark + validation for the Ronin Daily generator/solver pipeline, per mode.
import * as E from './engine.mjs';

const DAYS = 120;
const hist = (arr) => {
  const m = {};
  for (const p of arr) m[p] = (m[p] || 0) + 1;
  return Object.keys(m).sort((a, b) => a - b).map(k => `par ${k}: ${'#'.repeat(m[k])} (${m[k]})`).join('\n');
};
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.floor(a.length * p)];

let failed = false;

for (const modeKey of Object.keys(E.MODES)) {
  const mc = E.MODES[modeKey];
  console.log(`\n########## MODE: ${modeKey} (steps ${mc.steps}, band [${mc.parMin},${mc.parMax}]) ##########`);

  // --- 1. Raw par distribution of first-candidate boards (acceptance off) ---
  let rawPars = [], rawUnsolved = 0;
  for (let d = 1; d <= DAYS; d++) {
    const rng = E.mulberry32(E.hash32(E.hash32(mc.salt, d), 0));
    const cand = E.genCandidate(rng);
    const res = cand && E.solveBoard(cand, { fLimit: 30, maxNodes: 250000, steps: mc.steps });
    if (res) rawPars.push(res.par); else rawUnsolved++;
  }
  console.log(`=== RAW first candidates (n=${DAYS}) ===`);
  console.log(hist(rawPars));
  console.log(`unsolvable/too-deep: ${rawUnsolved}`);

  // --- 2. Full deterministic daily generation with acceptance band ---
  console.log(`\n=== DAILY generation ===`);
  let pars = [], tries = [], times = [], fallbacks = 0, worst = { ms: 0, day: 0 };
  for (let d = 1; d <= DAYS; d++) {
    const t0 = performance.now();
    const b = E.dailyBoard(d, mc);
    const ms = performance.now() - t0;
    if (!b) { console.log(`day ${d}: TOTAL FAILURE`); failed = true; continue; }
    if (b.par < mc.parMin) fallbacks++;
    pars.push(b.par); tries.push(b.genTries); times.push(ms);
    if (ms > worst.ms) worst = { ms, day: d };
  }
  console.log(hist(pars));
  console.log(`fallback boards (below band): ${fallbacks}`);
  console.log(`tries  avg ${avg(tries).toFixed(1)}  p50 ${pct(tries, .5)}  p90 ${pct(tries, .9)}  max ${Math.max(...tries)}`);
  console.log(`time   avg ${avg(times).toFixed(0)}ms  p50 ${pct(times, .5).toFixed(0)}ms  p90 ${pct(times, .9).toFixed(0)}ms  max ${worst.ms.toFixed(0)}ms (day ${worst.day})`);
  if (fallbacks) failed = true;

  // --- 3. Self-consistency: replay solver's optimal path through the live rules ---
  let ok = 0;
  for (let d = 1; d <= 10; d++) {
    const b = E.dailyBoard(d, mc);
    const res = E.solveBoard(b, { fLimit: mc.parMax, maxNodes: 250000, wantPath: true, steps: mc.steps });
    if (!res || !res.path) { console.log(`day ${d}: no path`); failed = true; continue; }
    let ronin = { ...b.ronin }, army = b.army.map(p => ({ ...p })), dead = false;
    for (const ep of res.path) {
      const steps = E.pathTo(ronin, army, b.stairs, ep, mc.steps);
      if (!steps) { console.log(`day ${d}: unwalkable endpoint`, ep); dead = true; break; }
      ronin = { r: ep.r, c: ep.c };
      const rep = E.armyReply(ronin, army, b.stairs);
      if (rep.captured) { console.log(`day ${d}: captured on optimal path!`); dead = true; break; }
      army = rep.army;
    }
    if (dead) { failed = true; continue; }
    const turns = res.path.length + 1; // + ascend
    if (E.ringOf(ronin.r, ronin.c) === 1 && turns === res.par && res.par === b.par) ok++;
    else { console.log(`day ${d}: MISMATCH turns=${turns} par=${res.par}/${b.par}`); failed = true; }
  }
  console.log(`replay OK: ${ok}/10`);
}

process.exit(failed ? 1 : 0);
