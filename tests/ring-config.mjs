// RONIN ring board — LOCKED difficulty ladder (2026-07-12), from the lab gradient.
// All rungs at 3 moves except epic; difficulty walked down by guard count (smooth lever) then
// gating (medium step), keeping the 3→2 cliff for epic. Naive-bot win% is a ranking floor;
// humans do better (3 attempts + hint). Par bands are accept/reject targets for the generator.
// Board density is LOCKED at the reference 150 cells (shrink-to-fit on mobile, don't reduce cells).
import { refCounts } from './ring-engine.mjs';

// genMaxNodes caps the solver during generation: a board whose solve would blow past it is
// abandoned and the generator re-rolls, instead of grinding for 20s. This bounds worst-case gen
// time AND guarantees every shipped board is cheap for the in-browser solver (hints/reveal) too.
// Part of the locked, deterministic config — same cap → same boards on every client.
const common = { rings: 6, counts: refCounts(6), armyMoves: 2, genMaxTries: 400, genMaxNodes: 60000 };

// Player-facing names: easy / normal / hard / brutal (2026-07-13). "easy" is the DAILY DEFAULT
// (the ~60%-naive board Brad tuned as "sometimes it beats you"); the rest are opt-in steps up.
// Salts stay bound to their exact configs, so these are the SAME decade-validated boards, relabelled.
export const RING_MODES = {
  // DAILY default. tier board, ~60% naive (~85% human): quick, usually win, sometimes it beats you.
  easy:   { key: 'easy',   daily: true, ...common, gating: 'tier',     roninSteps: 3, gatesPerBoundary: 2, armyCounts: [8, 5, 3],  parMin: 6,  parMax: 12, salt: 0x52494E31 }, // "RIN1"
  // same tier board, more guards (~43% naive). You lose a fair bit.
  normal: { key: 'normal',              ...common, gating: 'tier',     roninSteps: 3, gatesPerBoundary: 2, armyCounts: [10, 6, 4], parMin: 7,  parMax: 13, salt: 0x52494E32 }, // "RIN2"
  // every-ring walls @ 4 gates (~31% naive) — chokepoint puzzle, real teeth.
  hard:   { key: 'hard',                ...common, gating: 'stepping', roninSteps: 3, gatesPerBoundary: 4, armyCounts: [6, 4, 2],  parMin: 7,  parMax: 14, salt: 0x52494E33 }, // "RIN3"
  // every-ring @ 4 gates + the 2-step cliff (~21% naive). Brutal marathon; mechanics layer on later.
  brutal: { key: 'brutal',              ...common, gating: 'stepping', roninSteps: 2, gatesPerBoundary: 4, armyCounts: [6, 4, 2],  parMin: 10, parMax: 18, salt: 0x52494E34 }, // "RIN4"
};
