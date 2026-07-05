# 浪人 RONIN

A daily rescue puzzle. One castle, one Emperor, one ronin — you.

Every day, the same castle for everyone: slip past the guards, cross the walls at the golden
stairs, reach the Emperor in as few moves as you can. Three attempts. The guards are perfectly
predictable — every failure teaches you their ways.

**Play:** open `index.html` — the whole game is one file, no install, no build.

## How it works

The day's date seeds a deterministic generator. An A* solver proves every daily castle is
winnable within a target difficulty band before it ships to you, and computes **par** — the
optimal number of moves. Match par for a perfect rescue.

## Development

- `ronin_daily_v1.html` — current version (single file: engine, UI, styles)
- `STATUS.md` — project state, decisions, roadmap
- `tests/` — Node harness (`node tests/bench.mjs`, `node tests/parity.mjs`)
- `ronin_prototype_v17.html` — the original Ronin Proper prototype this descends from

No dependencies. No server. No tracking.
