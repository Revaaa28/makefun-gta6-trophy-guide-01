# Leonida Legend — GTA VI Trophy Atlas

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Revaaa28/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Revaaa28/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

A fan-made trophy guide and progress tracker for Grand Theft Auto VI on PlayStation 5. It covers all 55 official PS5 trophies — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 of them hidden — and runs completely offline as a static web app: no build step, no network requests, no account.

## What it does

- **Checklist & tracker** — every trophy with its official name, description and grade. Tick trophies off as you earn them; progress is saved in your browser (localStorage) and can be exported to a JSON file and imported back on another machine.
- **Cited guides** — each trophy carries a short guide written in our own words, and every guide pane opens with a bordered SOURCES box naming where its facts come from (Exophase, PSNProfiles, Output Lag). Specific steps are only stated where a source states them; where a trigger is not yet pinned down, the guide says so.
- **Counters with steppers** — the 19 counted trophies (stunts, range golds, vehicles, areas, dollars and more) have − / + / +10 steppers in the guide pane, clamped to the trophy's target.
- **Per-trophy notes** — a notes field on every trophy, saved with your progress.
- **Filters & search** — filter by kind (story, missable, collectibles, activities, online), by grade, by earned/remaining, or search names and descriptions. The online filter is honest: there are no online trophies at launch.
- **Spoiler protection** — hidden trophies stay covered ("Hidden trophy", no description, no giveaway chips) until you earn them, whatever the settings say. A separate Hide spoilers toggle additionally masks the descriptions of unearned story trophies.
- **Roadmap to the Platinum** — eight stages in the order the game lets you play them, each with guidance and its own progress bar, from the save-discipline stage (no mission replay, no New Game+) to the 100% grind.
- **Missables page** — there is exactly one true missable: Lucia's Chapter 1 balcony meditation, which counts toward Positive Mental Attitude and is gone forever once Chapter 1 ends. It gets a red hero card; everything else, including the time-sensitive Race Against Yago strand, is listed as a lesser caution.
- **Next Up Planner** — a personal queue built from your progress: the missable first, then the next story beat, then whichever counters you are closest to finishing.

## Run it

Requires Node 22 or newer. No dependencies to install.

Preview the app locally:

```
node serve.ts
```

then open http://localhost:8080 (pass `--port 3000` for a different port).

Build the hand-in bundle (copies `app/` and `screenshots/` into the output directory and writes `dossier.json` there):

```
node main.ts
```

The output directory defaults to `/output` and can be changed with the `MAKEFUN_OUTPUT_DIR` environment variable.

## Screenshots

- `screenshots/1-cover.jpg` — the checklist with demo progress (13 of 55 earned): header and filter row, unearned hidden trophies covered as "Hidden trophy", and Sneakthief's guide pane open beside the list with its SOURCES box on top.
- `screenshots/2-detail.jpg` — Cunning Stunts in the guide pane: SOURCES box, the progress stepper reading 137 of 250, and a player note in the notes field.
- `screenshots/3-roadmap.jpg` — the Roadmap view: the eight-stage road to the Platinum as stage cards with per-stage progress bars.
- `screenshots/4-missables.jpg` — the Missables view: the red hero card for Positive Mental Attitude, the one true missable, with its source line inside the card and the lesser cautions below.

Leonida Legend is a fan-made guide. It is not affiliated with Rockstar Games or Take-Two Interactive.
