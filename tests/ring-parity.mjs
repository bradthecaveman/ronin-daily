// Extract the ring engine embedded in round.html and verify it produces identical
// daily boards to the Node modules (ring-engine.mjs + ring-config.mjs) — for EVERY
// mode. Mirror of parity.mjs (the square game's gate). Run: node tests/ring-parity.mjs
import { readFileSync } from 'fs';
import { makeRingEngine, hash32 } from './ring-engine.mjs';
import { RING_MODES } from './ring-config.mjs';

const html = readFileSync(new URL('../round.html', import.meta.url), 'utf8');
const m = html.match(/<script id="engine">([\s\S]*?)<\/script>/);
if (!m) { console.error('engine block not found'); process.exit(1); }
const Emb = new Function(m[1] + '; return RingEngine;')();

const sig = (b) => b.par + ':' + b.genTries + ':' + b.ronin + ':' + b.army.join(',')
  + ':' + [...b.openInward].sort((x, y) => x - y).join('.');

// 10 days/mode is plenty: any transform slip in the embed breaks every board, not a
// specific day (gen runs the full solver, so more days just costs minutes for nothing).
const DAYS = 10;
let ok = 0, bad = 0, total = 0;
for (const modeKey of Object.keys(RING_MODES)) {
  if (!Emb.RING_MODES || !Emb.RING_MODES[modeKey]) { bad++; console.log(`mode ${modeKey}: MISSING in embedded engine`); continue; }
  const A = makeRingEngine(RING_MODES[modeKey]);
  const B = Emb.makeRingEngine(Emb.RING_MODES[modeKey]);
  for (let d = 1; d <= DAYS; d++) {
    total++;
    const a = A.generateFromSeed(hash32(RING_MODES[modeKey].salt, d));
    const b = B.generateFromSeed(Emb.hash32(Emb.RING_MODES[modeKey].salt, d));
    if (a && b && sig(a) === sig(b)) ok++;
    else { bad++; console.log(`${modeKey} day ${d}: MISMATCH`); }
  }
}
console.log(`ring-parity: ${ok}/${total} identical across modes [${Object.keys(RING_MODES).join(', ')}], ${bad} mismatches`);
process.exit(bad ? 1 : 0);
