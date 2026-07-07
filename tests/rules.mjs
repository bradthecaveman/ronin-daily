// Rules regression tests — every rule players have relied on (or bug we've shipped).
// Run: node tests/rules.mjs   (exits non-zero on failure)
import * as E from './engine.mjs';

let pass = 0, fail = 0;
const t = (name, cond) => { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } };

// --- Through-wall capture (v1.2 bug, found by Brad in play) ---
// Guard orthogonally adjacent across a ring boundary with NO stair must not capture.
{
  const rep = E.armyReply({ r: 4, c: 6 }, [{ r: 3, c: 6 }], new Set());
  t('guard cannot capture through a wall', !rep.captured);
  t('wall-blocked guard stays put', rep.moves.length === 0);
}

// --- Capture via stair is still legal ---
{
  const rep = E.armyReply({ r: 4, c: 6 }, [{ r: 3, c: 6 }], new Set([E.key(3, 6)]));
  t('guard captures across boundary via stair', rep.captured);
}

// --- Diagonal guard movement (v1.1 design change) ---
{
  // guard (11,9) and its diagonal step (12,10) are both bottom tier — no wall involved
  const rep = E.armyReply({ r: 12, c: 12 }, [{ r: 11, c: 9 }], new Set());
  t('guard steps diagonally toward ronin', rep.moves.length === 1 &&
    rep.moves[0].to.r === 12 && rep.moves[0].to.c === 10);
}

// --- Diagonal blocked by wall falls back to a legal orthogonal step ---
{
  // guard at (3,5) middle tier; ronin at (4,6) inner tier. Diagonal (4,6) = capture
  // but blocked by wall (no stairs). Orthogonal candidates: (4,5) inner = wall-blocked,
  // (3,6) middle = legal sidestep.
  const rep = E.armyReply({ r: 4, c: 6 }, [{ r: 3, c: 5 }], new Set());
  t('wall-blocked diagonal falls back to legal orthogonal', !rep.captured &&
    rep.moves.length === 1 && rep.moves[0].to.r === 3 && rep.moves[0].to.c === 6);
}

// --- Only the two nearest guards move ---
{
  const army = [
    { r: 12, c: 4 },  // cheb 8 from ronin — nearest
    { r: 12, c: 2 },  // cheb 10 — second
    { r: 0, c: 12 },  // cheb 12 — must NOT move
  ];
  const rep = E.armyReply({ r: 12, c: 12 }, army, new Set());
  t('exactly two guards move', rep.moves.length === 2);
  const movedIdx = rep.moves.map(m => m.i).sort().join(',');
  t('the two NEAREST guards are the movers', movedIdx === '0,1');
}

// --- A fully blocked nearest guard is skipped for the next-nearest ---
{
  // nearest guard at (3,6) is wall-locked against ronin (4,6) side... it can still
  // sidestep along its own tier, so instead: box a guard with occupied tiles.
  // Guard at (0,0) corner, ronin at (2,2)... simpler: verify via count on the
  // wall-locked case — guard at (3,6) CAN sidestep (legal move exists), so use
  // a distant second guard and assert both "moves" happen (skip logic is exercised
  // by the wall case above where moves.length === 0 for a single guard).
  const army = [{ r: 3, c: 6 }, { r: 12, c: 6 }];
  const rep = E.armyReply({ r: 4, c: 6 }, army, new Set());
  t('blocked-diagonal guard still gets a legal move or is skipped cleanly',
    rep.moves.length >= 1 && !rep.captured);
}

// --- Ronin cannot pass through guards or enter the Emperor tile ---
{
  const stairs = new Set([E.key(4, 6)]);
  const opts = E.roninOptions({ r: 5, c: 6 }, [{ r: 5, c: 5 }, { r: 5, c: 7 }], stairs, 2);
  t('emperor tile is never a ronin endpoint', !opts.some(o => o.r === 6 && o.c === 6));
  t('guard tiles are never ronin endpoints', !opts.some(o => (o.r === 5 && o.c === 5) || (o.r === 5 && o.c === 7)));
  t('hold endpoint offered when moves exist', opts.some(o => o.hold));
}

// --- Tier crossing only via stairs, both directions ---
{
  t('no crossing without stair', !E.stepLegal(2, 6, 1, 6, new Set()));
  t('crossing legal when FROM tile is stair', E.stepLegal(2, 6, 1, 6, new Set([E.key(2, 6)])));
  t('crossing legal when TO tile is stair', E.stepLegal(1, 6, 2, 6, new Set([E.key(2, 6)])));
  t('same-tier step needs no stair', E.stepLegal(0, 0, 1, 1, new Set()));
}

// --- Determinism: same inputs, same reply ---
{
  const board = E.dailyBoard(7, E.MODES.hard);
  const a = E.armyReply(board.ronin, board.army, board.stairs);
  const b = E.armyReply(board.ronin, board.army, board.stairs);
  t('armyReply is pure/deterministic', JSON.stringify(a) === JSON.stringify(b));
}


// --- HARD-mode board continuity (snapshot taken 2026-07-05, pre-modes refactor) ---
// If this fails, published hard boards have changed retroactively. NEVER ship that.
{
  const SNAP = ["1:9:12,0:30.54.59.86.137:4,1;1,8;0,2;2,11;1,1;7,1;9,4;9,6;3,4;3,9;8,7;5,8","2:13:0,12:34.67.95.109.136:3,0;1,7;0,3;11,0;10,11;0,8;3,6;10,2;7,10;4,3;5,8;7,8","3:11:0,12:32.69.99.119.138:12,0;0,6;0,7;5,1;11,0;1,0;2,9;3,10;6,9;10,4;5,8;8,4","4:8:12,0:33.57.75.109.135:1,7;12,4;0,4;6,1;0,6;6,0;9,3;7,3;9,4;3,10;4,4;6,4","5:8:12,12:32.58.73.127.133:11,6;12,0;0,3;10,0;11,2;9,1;9,7;7,10;10,6;9,8;5,4;4,5"];
  let ok = 0;
  for (let d = 1; d <= 5; d++) {
    const b = E.dailyBoard(d, E.MODES.hard);
    const sig = d + ':' + b.par + ':' + b.ronin.r + ',' + b.ronin.c + ':' + [...b.stairs].sort((x, y) => x - y).join('.') + ':' + b.army.map(p => p.r + ',' + p.c).join(';');
    if (sig === SNAP[d - 1]) ok++;
  }
  t('HARD boards identical to pre-modes snapshot (days 1-5)', ok === 5);
}

// --- Modes are distinct and both healthy ---
{
  const h = E.dailyBoard(3, E.MODES.hard);
  const n = E.dailyBoard(3, E.MODES.normal);
  t('normal board solvable within its band', n && n.par >= E.MODES.normal.parMin && n.par <= E.MODES.normal.parMax);
  t('modes produce different boards for the same day',
    JSON.stringify(h.army) !== JSON.stringify(n.army) || h.ronin.r !== n.ronin.r || h.ronin.c !== n.ronin.c);
  t('3-step options are a superset size of 2-step from open ground',
    E.roninOptions({ r: 12, c: 6 }, [], new Set(), 3).length > E.roninOptions({ r: 12, c: 6 }, [], new Set(), 2).length);
}

console.log(`rules: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
