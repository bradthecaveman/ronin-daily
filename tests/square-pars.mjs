// Current par distribution of the SHIPPED square boards, straight from the daily generator.
import { MODES, dailyBoard } from './engine.mjs';
const DAYS = +(process.argv[2] || 180);
const fmt = o => Object.keys(o).sort((a, b) => a - b).map(k => `${k}×${o[k]}`).join('  ');
for (const key of ['normal', 'hard']) {
  const mc = MODES[key]; const pars = {}; let sum = 0, n = 0, fb = 0;
  for (let d = 1; d <= DAYS; d++) {
    const b = dailyBoard(d, mc);
    if (!b) { fb++; continue; }
    if (b.par < mc.parMin) fb++;
    pars[b.par] = (pars[b.par] || 0) + 1; sum += b.par; n++;
  }
  console.log(`\n${key.toUpperCase()}  band[${mc.parMin},${mc.parMax}] steps${mc.steps}  (${DAYS} days)`);
  console.log(`  par: ${fmt(pars)}`);
  console.log(`  mean ${(sum/n).toFixed(1)}   fallbacks ${fb}`);
}
