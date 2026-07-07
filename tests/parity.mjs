// Extract the engine embedded in ronin_daily_v1.html and verify it produces
// identical daily boards to the mirror in tests/engine.mjs — for EVERY mode.
import { readFileSync } from 'fs';
import * as E from './engine.mjs';

const html = readFileSync(new URL('../ronin_daily_v1.html', import.meta.url), 'utf8');
const m = html.match(/<script id="engine">([\s\S]*?)<\/script>/);
if (!m) { console.error('engine block not found'); process.exit(1); }
const RoninEngine = new Function(m[1] + '; return RoninEngine;')();

const sig = (b) => b.par + ':' + b.genTries + ':' + b.ronin.r + ',' + b.ronin.c + ':'
  + [...b.stairs].sort((x, y) => x - y).join('.') + ':' + JSON.stringify(b.army);

let ok = 0, bad = 0, total = 0;
for (const modeKey of Object.keys(E.MODES)) {
  if (!RoninEngine.MODES || !RoninEngine.MODES[modeKey]) { bad++; console.log(`mode ${modeKey}: MISSING in embedded engine`); continue; }
  for (let d = 1; d <= 20; d++) {
    total++;
    const a = E.dailyBoard(d, E.MODES[modeKey]);
    const b = RoninEngine.dailyBoard(d, RoninEngine.MODES[modeKey]);
    if (sig(a) === sig(b)) ok++;
    else { bad++; console.log(`${modeKey} day ${d}: MISMATCH`); }
  }
}
console.log(`parity: ${ok}/${total} identical across modes [${Object.keys(E.MODES).join(', ')}], ${bad} mismatches`);
process.exit(bad ? 1 : 0);
