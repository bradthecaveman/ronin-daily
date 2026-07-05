// Extract the engine embedded in ronin_daily_v1.html and verify it produces
// identical daily boards to the benchmarked engine.mjs.
import { readFileSync } from 'fs';
import * as E from './engine.mjs';

const html = readFileSync(new URL('../ronin_daily_v1.html', import.meta.url), 'utf8');
const m = html.match(/<script id="engine">([\s\S]*?)<\/script>/);
if (!m) { console.error('engine block not found'); process.exit(1); }
const RoninEngine = new Function(m[1] + '; return RoninEngine;')();

let ok = 0, bad = 0;
for (let d = 1; d <= 40; d++) {
  const a = E.dailyBoard(d);
  const b = RoninEngine.dailyBoard(d);
  const same =
    a.par === b.par &&
    a.genTries === b.genTries &&
    a.ronin.r === b.ronin.r && a.ronin.c === b.ronin.c &&
    JSON.stringify([...a.stairs].sort((x, y) => x - y)) === JSON.stringify([...b.stairs].sort((x, y) => x - y)) &&
    JSON.stringify(a.army) === JSON.stringify(b.army);
  if (same) ok++; else { bad++; console.log(`day ${d}: MISMATCH`, a.par, b.par); }
}
console.log(`parity: ${ok}/40 identical, ${bad} mismatches`);
console.log('day 1 board: par', RoninEngine.dailyBoard(1).par, '· constants:', RoninEngine.RONIN_STEPS, 'steps, band', RoninEngine.PAR_MIN, '-', RoninEngine.PAR_MAX);
