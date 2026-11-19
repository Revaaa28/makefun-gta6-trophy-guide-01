# Leonida Legend — GTA VI Trophy Atlas

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Revaaa28/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Revaaa28/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 of them hidden on PSN. Every trophy carries its official name, description and grade, plus a guide written for this atlas in its own words that cites its sources beside the trophy: what to do, where and how, and when it can be missed.

What is inside:

- **Checklist & tracker** — tick trophies off, bump per-trophy counters toward their official targets (250 stunts, 42 Shooting Range gold medals, 100 WAiNK locations, $250,000 laundered, and 15 more), and add a personal note per trophy. Everything saves in the browser (localStorage) and can be exported to a JSON file and imported back.
- **Filters & search** — by kind (story, missable, collectibles, activities, online), by grade, by earned/remaining, plus full-text search. The online filter says it plainly: there are no online trophies at launch.
- **Spoiler setting** — "Hide spoilers" masks the names, descriptions and guides of unearned story trophies until they are earned.
- **Roadmap to the Platinum** — seven stages from the Chapter 1 opening to the 100% grind, each with its trophies, its own progress, and its key warning, built from the official descriptions.
- **Missables page** — the one true missable (the Chapter 1 balcony meditation behind Positive Mental Attitude), the time-sensitive Race Against Yago, and the save discipline that protects the run: no mission replay, a save at the start of every chapter, no cheats on a trophy save.
- **Next Up planner** — the next five trophies in roadmap order and the counters nearest completion, computed from your saved progress.

The app is plain static files under `app/` with no build step and no libraries: it works with the network off, loads nothing from outside its own files, and uses no Rockstar artwork — the night-ledger look is its own. Trophy names, descriptions and grades follow the official list as published by Exophase and PSNProfiles (2026-11-18); gameplay specifics cite the Output Lag trophy guide of Nov 19, 2026 and Leonida Hub's confirmed list of Nov 19, 2026.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the atlas serves from `app/`.

To hand the entry in the way the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`.

<sub>Entered on [make.fun](https://make.fun/?ref=revaaa28&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
