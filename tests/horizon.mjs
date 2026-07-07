// Long-horizon validation: generate and solver-verify every daily board for the
// next N years. Catches any pathological future day before players do.
// Run: node tests/horizon.mjs [days] [mode]   (default 3650 ≈ 10 years, mode 'normal')
import * as E from './engine.mjs';

const DAYS = Number(process.argv[2]) || 3650;
const MC = E.MODES[process.argv[3] || 'normal'];
if (!MC) { console.error('unknown mode', process.argv[3]); process.exit(1); }
console.log(`mode: ${MC.key} (steps ${MC.steps}, band [${MC.parMin},${MC.parMax}])`);
const t0 = performance.now();
let below = 0, unsolvable = 0, slow = [], pars = {}, worst = { ms: 0, day: 0 };

for (let d = 1; d <= DAYS; d++) {
  const s0 = performance.now();
  const b = E.dailyBoard(d, MC);
  const ms = performance.now() - s0;
  if (!b) { unsolvable++; console.error(`day ${d}: NO BOARD`); continue; }
  if (b.par < MC.parMin) { below++; console.error(`day ${d}: below band (par ${b.par})`); }
  pars[b.par] = (pars[b.par] || 0) + 1;
  if (ms > 5000) slow.push({ day: d, ms: Math.round(ms) });
  if (ms > worst.ms) worst = { ms: Math.round(ms), day: d };
  if (d % 365 === 0) console.log(`…year ${d / 365} done (${Math.round((performance.now() - t0) / 1000)}s elapsed)`);
}

console.log(`\n=== HORIZON ${DAYS} days (~${(DAYS / 365).toFixed(1)} years) ===`);
console.log('par distribution:', JSON.stringify(pars));
console.log(`unsolvable: ${unsolvable}, below band: ${below}`);
console.log(`slowest gen: day ${worst.day} at ${worst.ms}ms; days over 5s: ${slow.length}`, slow.slice(0, 10));
console.log(`total: ${Math.round((performance.now() - t0) / 1000)}s`);
process.exit(unsolvable || below ? 1 : 0);
