# Leonida Legend — GTA VI Trophy Atlas

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Revaaa28/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Revaaa28/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline trophy guide and tracker for **all 55 official Grand Theft Auto VI
trophies on PlayStation 5** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 of
them hidden. Built for the make.fun bounty
[gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Checklist & tracker** — every trophy with its official name, description
  and grade. Tick trophies off, track counters toward their targets (250
  stunts, 100 vehicles, $250,000 laundered…), and keep a private note per
  trophy. Progress saves itself in the browser; export it to a file and
  import it anywhere.
- **A cited guide for every trophy** — written in our own words, and every
  guide pane opens with a **SOURCES** box naming where its facts come from
  (Exophase, PSNProfiles, Output Lag), plus an honest status line where a
  guide is partly our own advice the game has not confirmed yet.
- **Filters & search** — by kind (story, missable, collectibles, activities,
  online), grade and earned status. The online filter answers honestly:
  there are no online trophies at launch.
- **Spoiler setting** — "Hide spoilers" masks unearned story trophies
  everywhere, planner included, until you earn them.
- **Roadmap to the Platinum** — eight stages in play order, from save
  discipline (there is no mission replay and no New Game+) to the 100%
  grind, each with live per-stage progress.
- **Missables page** — GTA VI has exactly one true missable: Lucia's
  Chapter 1 balcony meditation inside *Positive Mental Attitude*. It gets a
  red card of its own, with its source printed on it.
- **Next Up planner** — the missable first, then your next story beat, then
  whichever counters you are closest to finishing.

## Run it

The guide is plain static files — no build step, no network requests, every
file it loads lives in `app/`.

```sh
node serve.ts            # preview at http://localhost:8080
node main.ts             # hand-in: copies app/ + screenshots/ to /output
                         # and writes dossier.json (see MAKEFUN_OUTPUT_DIR)
```

Requires Node 22+. Trophy names and descriptions are the official
PlayStation list; Leonida Legend is a fan-made guide and is not affiliated
with Rockstar Games.

## Screenshots

1. `screenshots/1-cover.jpg` — the checklist with Sneakthief's guide open and
   its SOURCES box at the top of the pane.
2. `screenshots/2-roadmap.jpg` — the eight-stage roadmap to the Platinum.
3. `screenshots/3-missables.jpg` — the one true missable, flagged in red with
   its source line.
4. `screenshots/4-planner.jpg` — the Next Up planner with spoilers hidden.
