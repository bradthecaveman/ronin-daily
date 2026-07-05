// Benchmark + validation for the Ronin Daily generator/solver pipeline.
import * as E from './engine.mjs';

const DAYS = 120;

// --- 1. Raw par distribution of first-candidate boards (acceptance off) ---
let rawPars = [], rawUnsolved = 0;
for (let d = 1; d <= DAYS; d++) {
  const rng = E.mulberry32(E.hash32(E.hash32(0x524F4E49, d), 0));
  const cand = E.genCandidate(rng);
  const res = cand && E.solveBoard(cand, { fLimit: 30, maxNodes: 250000 });
  if (res) rawPars.push(res.par); else rawUnsolved++;
}
const hist = (arr) => {
  const m = {};
  for (const p of arr) m[p] = (m[p] || 0) + 1;
  return Object.keys(m).sort((a, b) => a - b).map(k => `par ${k}: ${'#'.repeat(m[k])} (${m[k]})`).join('\n');
};
console.log(`=== RAW first candidates (n=${DAYS}) ===`);
console.log(hist(rawPars));
console.log(`unsolvable/too-deep: ${rawUnsolved}`);

// --- 2. Full deterministic daily generation with acceptance band ---
console.log(`\n=== DAILY generation, par band [${E.PAR_MIN}, ${E.PAR_MAX}] ===`);
let pars = [], tries = [], times = [], fallbacks = 0, worst = { ms: 0, day: 0 };
for (let d = 1; d <= DAYS; d++) {
  const t0 = performance.now();
  const b = E.dailyBoard(d);
  const ms = performance.now() - t0;
  if (!b) { console.log(`day ${d}: TOTAL FAILURE`); continue; }
  if (b.par < E.PAR_MIN) fallbacks++;
  pars.push(b.par); tries.push(b.genTries); times.push(ms);
  if (ms > worst.ms) worst = { ms, day: d };
}
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.floor(a.length * p)];
console.log(hist(pars));
console.log(`fallback boards (below band): ${fallbacks}`);
console.log(`tries  avg ${avg(tries).toFixed(1)}  p50 ${pct(tries, .5)}  p90 ${pct(tries, .9)}  max ${Math.max(...tries)}`);
console.log(`time   avg ${avg(times).toFixed(0)}ms  p50 ${pct(times, .5).toFixed(0)}ms  p90 ${pct(times, .9).toFixed(0)}ms  max ${worst.ms.toFixed(0)}ms (day ${worst.day})`);

// --- 3. Self-consistency: replay solver's optimal path through the live rules ---
console.log('\n=== PATH REPLAY validation (10 days) ===');
let ok = 0;
for (let d = 1; d <= 10; d++) {
  const b = E.dailyBoard(d);
  const res = E.solveBoard(b, { fLimit: E.PAR_MAX, maxNodes: 250000, wantPath: true });
  if (!res || !res.path) { console.log(`day ${d}: no path`); continue; }
  let ronin = { ...b.ronin }, army = b.army.map(p => ({ ...p })), dead = false;
  for (const ep of res.path) {
    const steps = E.pathTo(ronin, army, b.stairs, ep);
    if (!steps) { console.log(`day ${d}: unwalkable endpoint`, ep); dead = true; break; }
    ronin = { r: ep.r, c: ep.c };
    const rep = E.armyReply(ronin, army, b.stairs);
    if (rep.captured) { console.log(`day ${d}: captured on optimal path!`); dead = true; break; }
    army = rep.army;
  }
  if (dead) continue;
  const turns = res.path.length + 1; // + ascend
  if (E.ringOf(ronin.r, ronin.c) === 1 && turns === res.par && res.par === b.par) ok++;
  else console.log(`day ${d}: MISMATCH ring=${E.ringOf(ronin.r, ronin.c)} turns=${turns} par=${res.par}/${b.par}`);
}
console.log(`replay OK: ${ok}/10`);
