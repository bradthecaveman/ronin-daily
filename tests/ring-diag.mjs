import { makeRingEngine, hash32, mulberry32, refCounts } from './ring-engine.mjs';

const base = { rings: 6, counts: refCounts(6), armyCounts: [6, 4, 2], armyMoves: 2, gating: 'stepping', genMaxTries: 400 };
const N = 50;
const seedBase = d => hash32(0x484152, d);
const fmt = o => Object.keys(o).sort((a, b) => a - b).map(k => `${k}×${o[k]}`).join(' ');

// raw: solve the first candidate each day (no band) — solvability + natural par + gen cost
for (const steps of [3, 2]) {
  console.log(`\n=== ronin ${steps}-step, every-ring board, army 6/4/2 (${N} boards each) ===`);
  for (const gates of [3, 4, 5]) {
    const E = makeRingEngine({ ...base, roninSteps: steps, gatesPerBoundary: gates });
    const pars = {}; let solved = 0, ms = 0, nodes = 0;
    for (let d = 1; d <= N; d++) {
      const cand = E.genCandidate(mulberry32(hash32(seedBase(d), 0)));
      if (!cand) continue;
      const t0 = performance.now();
      const res = E.solveBoard(cand, { fLimit: 28, maxNodes: 120000 });
      ms += performance.now() - t0;
      if (res) { solved++; pars[res.par] = (pars[res.par] || 0) + 1; nodes += res.nodes; }
    }
    console.log(`  ${gates} gates/ring: ${Math.round(100*solved/N)}% solvable · par ${fmt(pars)} · ${(ms/N).toFixed(0)}ms/board`);
  }
}
