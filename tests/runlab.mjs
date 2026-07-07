// Difficulty variant comparison for Brad's "too hard" feedback.
import { benchConfig } from './lab.mjs';
import * as SHIPPED from './engine.mjs';

// Baseline naive-bot on REAL shipped boards (exact boards players see).
function shippedNaive(days = 120) {
  let wins = 0, total = 0;
  const h = (r, c) => { const d = SHIPPED.ringOf(r, c); return d <= 1 ? 1 : Math.ceil((d - 1) / SHIPPED.RONIN_STEPS) + 1; };
  for (let d = 1; d <= days; d++) {
    const b = SHIPPED.dailyBoard(d);
    if (!b) continue;
    total++;
    let ronin = { ...b.ronin }, army = b.army.map(p => ({ ...p })), won = false;
    for (let turn = 0; turn < 40; turn++) {
      if (SHIPPED.ringOf(ronin.r, ronin.c) === 1) { won = true; break; }
      const opts = SHIPPED.roninOptions(ronin, army, b.stairs);
      let best = null, bestScore = Infinity;
      for (const ep of opts) {
        const rep = SHIPPED.armyReply(ep, army, b.stairs);
        if (rep.captured) continue;
        const score = h(ep.r, ep.c) * 100 + SHIPPED.ringOf(ep.r, ep.c);
        if (score < bestScore) { bestScore = score; best = { ep, rep }; }
      }
      if (!best) break;
      ronin = { r: best.ep.r, c: best.ep.c };
      army = best.rep.army;
    }
    if (won) wins++;
  }
  return Math.round(100 * wins / total);
}

console.log('SHIPPED baseline (real boards, 2-step, band [8,14], 13x13): naive-bot win % =', shippedNaive(), '\n');

const configs = [
  { name: 'A: 3-step ronin, 13x13, band [6,10]', depths: [2, 2, 2], roninSteps: 3, armyMoves: 2, armyCounts: [6, 4, 2], gates: [3, 2], parMin: 6, parMax: 10 },
  { name: 'B: 2-step, 13x13, easier band [6,10]', depths: [2, 2, 2], roninSteps: 2, armyMoves: 2, armyCounts: [6, 4, 2], gates: [3, 2], parMin: 6, parMax: 10 },
  { name: 'C: strip outer ring — 9x9, 2-step, army 4+2, band [5,9]', depths: [2, 2], roninSteps: 2, armyMoves: 2, armyCounts: [4, 2], gates: [3], parMin: 5, parMax: 9 },
  { name: 'D: 3-step + 9x9 combo, army 4+2, band [4,8]', depths: [2, 2], roninSteps: 3, armyMoves: 2, armyCounts: [4, 2], gates: [3], parMin: 4, parMax: 8 },
];

for (const cfg of configs) {
  const r = benchConfig(cfg, 120);
  console.log(`=== ${r.name} (N=${r.N}) ===`);
  console.log('  raw par dist:   ', JSON.stringify(r.rawPars), r.rawUnsolved ? `(unsolved: ${r.rawUnsolved})` : '');
  console.log('  banded par dist:', JSON.stringify(r.bandedPars), r.fallbacks ? `(FALLBACKS: ${r.fallbacks})` : '');
  console.log('  gen: tries avg', r.genTriesAvg, '· ms avg', r.genMsAvg, '· ms max', r.genMsMax);
  console.log('  >>> naive-bot win %:', r.naiveWinPct, '\n');
}
