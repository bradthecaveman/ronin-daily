// RONIN ring-graph lab — benchmarks the ring engine the same way tests/lab.mjs benchmarks
// the square variants: raw par distribution, banded gen (tries/time/fallbacks), and the
// naive-bot win % difficulty proxy. Run: node tests/ring-lab.mjs [days]
import { makeRingEngine, hash32, mulberry32, refCounts } from './ring-engine.mjs';

function benchConfig(cfg, days) {
  const E = makeRingEngine(cfg);
  const seedBase = d => hash32(0x4C414221, d); // "LAB!"
  const rawPars = {}; let rawUnsolved = 0;
  for (let d = 1; d <= days; d++) {
    for (let t = 0; t < 60; t++) {
      const rng = mulberry32(hash32(seedBase(d), t));
      const cand = E.genCandidate(rng);
      if (!cand) continue;
      const res = E.solveBoard(cand, { fLimit: 30 });
      if (res) { rawPars[res.par] = (rawPars[res.par] || 0) + 1; break; }
      if (t === 59) rawUnsolved++;
    }
  }
  const pars = {}, naive = { wins: 0, total: 0 };
  const tries = [], times = []; let fallbacks = 0;
  for (let d = 1; d <= days; d++) {
    const t0 = performance.now();
    const b = E.generateFromSeed(seedBase(d));
    const ms = performance.now() - t0;
    if (!b) { fallbacks++; continue; }
    if (b.par < cfg.parMin) fallbacks++;
    pars[b.par] = (pars[b.par] || 0) + 1;
    tries.push(b.genTries); times.push(ms);
    const nb = E.naiveBot(b); naive.total++; if (nb.win) naive.wins++;
  }
  const avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
  const fmt = o => Object.keys(o).sort((a, b) => a - b).map(k => `${k}×${o[k]}`).join(' ');
  return {
    name: cfg.name, cells: E.cells.length,
    rawPars: fmt(rawPars), rawUnsolved,
    bandedPars: fmt(pars), fallbacks,
    genTriesAvg: +avg(tries).toFixed(1), genMsAvg: Math.round(avg(times)), genMsMax: Math.round(Math.max(...times, 0)),
    naiveWinPct: Math.round(100 * naive.wins / (naive.total || 1)),
  };
}

const DAYS = +(process.argv[2] || 60);
const base = { rings: 6, counts: refCounts(6), armyCounts: [6, 4, 2], armyMoves: 2, gatesPerBoundary: 2, parMin: 6, parMax: 14, genMaxTries: 400 };
const configs = [
  { ...base, name: 'easy   (tier, 3-step)',     gating: 'tier',     roninSteps: 3, parMin: 6, parMax: 12 },
  { ...base, name: 'normal (stepping, 3-step)', gating: 'stepping', roninSteps: 3, parMin: 6, parMax: 12 },
  { ...base, name: 'hard   (stepping, 2-step)', gating: 'stepping', roninSteps: 2, parMin: 8, parMax: 14 },
];

console.log(`\nRING-GRAPH LAB — ${DAYS} days/config, counts ${base.counts.join(',')} = ${base.counts.reduce((a,b)=>a+b,0)} cells, army ${base.armyCounts.join('/')}\n`);
for (const cfg of configs) {
  const t0 = performance.now();
  const r = benchConfig(cfg, DAYS);
  const secs = ((performance.now() - t0) / 1000).toFixed(1);
  console.log(`── ${r.name}`);
  console.log(`   raw par:    ${r.rawPars}   ${r.rawUnsolved ? '⚠ unsolved ' + r.rawUnsolved : ''}`);
  console.log(`   banded par: ${r.bandedPars}   fallbacks ${r.fallbacks}`);
  console.log(`   gen: ${r.genTriesAvg} tries avg · ${r.genMsAvg}ms avg · ${r.genMsMax}ms max`);
  console.log(`   naive-bot win: ${r.naiveWinPct}%   (bench ${secs}s)\n`);
}
