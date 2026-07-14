// RONIN ring board — horizon validation. Generates every daily board across a span for all four
// modes and proves the release gate: 0 unsolvable, 0 below-band. Mirrors the square game's
// tests/horizon.mjs. Run: node tests/ring-horizon.mjs [days]   (365 = fast confidence read)
import { makeRingEngine, hash32 } from './ring-engine.mjs';
import { RING_MODES } from './ring-config.mjs';

const DAYS = +(process.argv[2] || 365);
const only = process.argv[3];   // optional: run a single mode key (for parallel decade runs)
const fmt = o => Object.keys(o).sort((a, b) => +a - +b).map(k => `${k}×${o[k]}`).join(' ');
const avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);

console.log(`\nRING HORIZON — ${DAYS} days/mode${only ? ' — ' + only : ''}\n`);
let allPass = true;
for (const key of (only ? [only] : Object.keys(RING_MODES))) {
  const mc = RING_MODES[key];
  const E = makeRingEngine(mc);
  const pars = {}; let unsolvable = 0, belowBand = 0, parSum = 0, n = 0;
  const tries = [], times = [];
  const t0all = performance.now();
  for (let d = 1; d <= DAYS; d++) {
    const t0 = performance.now();
    const b = E.generateFromSeed(hash32(mc.salt, d));
    times.push(performance.now() - t0);
    if (!b) { unsolvable++; continue; }
    if (b.par < mc.parMin) belowBand++;
    pars[b.par] = (pars[b.par] || 0) + 1; parSum += b.par; tries.push(b.genTries); n++;
  }
  const pass = unsolvable === 0 && belowBand === 0;
  allPass = allPass && pass;
  const secs = ((performance.now() - t0all) / 1000).toFixed(1);
  console.log(`── ${key}  band[${mc.parMin},${mc.parMax}]  ${pass ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`   unsolvable ${unsolvable}   below-band ${belowBand}   mean-par ${(parSum / n).toFixed(1)}`);
  console.log(`   par: ${fmt(pars)}`);
  console.log(`   gen: ${avg(tries).toFixed(1)} tries avg · ${Math.round(avg(times))}ms avg · ${Math.round(Math.max(...times))}ms max · ${secs}s total\n`);
}
console.log(allPass ? '✓ ALL MODES PASS\n' : '✗ SOME MODES FAILED — tune bands/config\n');
