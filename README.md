[![Entry](https://make.fun/api/competitions/gta6-trophy-guide-01/badge.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Bounty](https://make.fun/api/competitions/gta6-trophy-guide-01/badge.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Leaderboard](https://make.fun/api/competitions/gta6-trophy-guide-01/badge.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Atlas

A fan-made, fully offline trophy tracker for Grand Theft Auto VI (PS5). All 55 trophies from the official list, each with a short guide written as cited steps — every specific claim names its source inline, and the detail pane prints the full source list above the guide, never below it.

Guides draw on five sources: Exophase and PSNProfiles for the official list, Output Lag's trophy guide, the PowerPyx Trophy Guide & Roadmap, and Push Square's guide coverage. Where the guides disagree — the Chapter 1 meditation, Personal Best — both readings are printed and the disagreement is flagged instead of hidden.

## Features

- Checklist of all 55 trophies with official names, descriptions and grades
- Filters for kind (story / missable / collectibles / activities / online), grade and status, plus text search
- Per-trophy counter steppers for the 19 grind trophies (stunts, range golds, WAiNK scans, dollars…) and a notes field per trophy
- Progress saved in your browser (localStorage), with export / import as a JSON file
- Spoiler discipline: hidden trophies stay fully covered until earned, and a Hide spoilers toggle masks story descriptions
- Roadmap view: eight stages from save discipline to the 100% grind, with per-stage progress
- Missables view: the one Chapter 1 missable flagged in red, plus the time-sensitive warnings
- Next Up planner: the next unearned trophies in roadmap order

## Run it

- Hand-in build: `node main.ts` copies `app/` and `screenshots/` into the output directory and writes `dossier.json`.
- Local preview: `node serve.ts --port 8080`, or just open `app/index.html` in a browser — the app makes zero network requests beyond its own files.

## Screenshots

- `screenshots/1-cover.jpg` — Checklist with the Sneakthief guide open — cited steps and sources on show.
- `screenshots/2-detail.jpg` — Cunning Stunts at 137 of 250 with its cited guide and your own note.
- `screenshots/3-roadmap.jpg` — The roadmap: eight stages with the PowerPyx time plan up top.
- `screenshots/4-missables.jpg` — Missables: the one Chapter 1 meditation, flagged with its sources.

Fan-made and unaffiliated with Rockstar Games or Take-Two Interactive. No official artwork is used.
