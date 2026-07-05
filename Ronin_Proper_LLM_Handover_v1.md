# Ronin Proper – LLM Handover (v1)

## Project Summary
Ronin Proper is a turn-based tactical stealth board game currently implemented as a single HTML prototype.
The authoritative playable build is Prototype v17.

## Design Philosophy
- Preserve working gameplay.
- Change one mechanic at a time.
- Never rewrite large sections unnecessarily.
- Every version is a complete HTML file.
- Prefer hard-coded coordinates for board layout.

## Board
- 13x13 grid
- Four tiers:
  - Bottom
  - Middle
  - Inner
  - Emperor

Tier changes occur only via stair tiles.

## Ronin
- 1 piece
- Starts on one of 8 start tiles
- 3 moves (4 if hidden)
- Leap capture
- Grapple (2 uses)
- Ascend by standing adjacent to the Emperor then clicking the Emperor.

## Army
- 6 bottom
- 4 middle
- 2 inner

Moves:
- Up to 2 different pieces per turn
- 3 if alerted
- Captures by moving onto the Ronin.

## Current Development Goal
Starting from v17, change ONLY the middle-tier stair positions.
Everything else must remain identical.

## Refactoring Priorities
1. Remove duplicate functions.
2. Separate rendering from logic.
3. Centralise configuration.
4. Make stair positions configurable.
5. Preserve gameplay.

## Long-term Roadmap
- Stable mechanics
- Better AI
- Animation
- Sound
- Save/load
- 3D presentation
