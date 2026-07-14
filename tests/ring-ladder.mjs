// Difficulty gradient for the ring board: naive-bot win % (the proxy for "how a decent-but-
// imperfect player fares") across candidate rungs, so we can space the ladder evenly and pick
// the base. Humans do better than the naive bot (3 attempts + recon + hint), so treat these as
// a floor. Square reference: normal ~73% (gentle default), original hard ~14% (felt too hard).
import { makeRingEngine, hash32, mulberry32, refCounts } from './ring-engine.mjs';

const base = { rings: 6, counts: refCounts(6), armyCounts: [6, 4, 2], armyMoves: 2, genMaxTries: 400 };
const N = 100;
const seedBase = d => hash32(0x4C4144, d); // "LAD"

function measure(label, cfg) {
  const E = makeRingEngine(cfg);
  let solved = 0, wins = 0, played = 0, parSum = 0;
  for (let d = 1; d <= N; d++) {
    // first solvable candidate each day (what the generator would ship, band aside)
    let board = null;
    for (let t = 0; t < 30; t++) {
      const cand = E.genCandidate(mulberry32(hash32(seedBase(d), t)));
      if (!cand) continue;
      const res = E.solveBoard(cand, { fLimit: 30, maxNodes: 150000 });
      if (res) { board = { ...cand, par: res.par }; break; }
    }
    if (!board) continue;
    solved++; parSum += board.par;
    const nb = E.naiveBot(board); played++; if (nb.win) wins++;
  }
  const win = Math.round(100 * wins / (played || 1));
  console.log(`  ${label.padEnd(34)} naive-win ${String(win).padStart(3)}%   mean-par ${(parSum/solved).toFixed(1)}   (${solved}/${N} solvable)`);
  return win;
}

console.log(`\nRING DIFFICULTY GRADIENT — naive-bot win % (${N} boards each), army 6/4/2 unless noted\n`);
measure('tier, 3-step',            { ...base, gating: 'tier',     roninSteps: 3, gatesPerBoundary: 2 });
measure('tier, 2-step',            { ...base, gating: 'tier',     roninSteps: 2, gatesPerBoundary: 2 });
measure('every-ring 4g, 3-step',   { ...base, gating: 'stepping', roninSteps: 3, gatesPerBoundary: 4 });
measure('every-ring 4g, 2-step',   { ...base, gating: 'stepping', roninSteps: 2, gatesPerBoundary: 4 });
console.log('\n  --- guard-count as a fine-tuning lever (tier, 3-step) ---');
measure('tier 3-step, army 8/5/3', { ...base, gating: 'tier', roninSteps: 3, gatesPerBoundary: 2, armyCounts: [8,5,3] });
measure('tier 3-step, army 10/6/4',{ ...base, gating: 'tier', roninSteps: 3, gatesPerBoundary: 2, armyCounts: [10,6,4] });
