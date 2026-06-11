# WildGrow — Project Handover

> Handover document for continuing development. Read this first, then explore the codebase.

## What This Project Is

**WildGrow** is a mobile-first educational growing game (PWA) that teaches children aged 6–14 real agro-ecological skills through pixel-art gameplay. It is explicitly NOT FarmVille — it teaches real science:

- **No-dig growing** based on Charles Dowding's teachings (all beds are no-dig by default; compost applied 1 inch, once a year, in autumn/winter)
- **Companion planting** with real botanical data
- **Crop rotation** aligned with Dowding's philosophy (light feeders repeat freely, legumes fix nitrogen, no-dig reduces rotation penalties)
- **Biodiversity creation** — ponds, wildflower meadows, bug hotels, bird boxes, log piles, compost loos
- **Bridge to the real world** — children earn real seeds, tools, and growing kits; community features connect them to local market gardens hosting education events

The hidden curriculum trains future land stewards. The end goal for players is a thriving 1-acre regenerative market garden (see Garden Stages below) that benefits nature and humans through community and local food growing.

## Owner & Context

- User email: edmo.brandconsultant@gmail.com
- Repo: `edmobrandconsultant-alt/marketing-engine` (GitHub, use MCP tools, no `gh` CLI)
- **Branch: `claude/mobile-farming-game-8wnme`** — all development on this branch, push with `git push -u origin claude/mobile-farming-game-8wnme`
- Do NOT create a PR unless explicitly asked

## Tech Stack

- Next.js 16.2.1 (App Router, Turbopack), TypeScript, Tailwind CSS
- Zustand store with localStorage persistence (`src/store/game-store.ts` + `src/lib/storage.ts`)
- No game engine — emoji sprites + CSS animations
- System fonts only (Google Fonts blocked in build environment — do not re-add `next/font/google`)
- Verify with `npm run build` before every commit

## Architecture Map

| Area | Files |
|------|-------|
| State | `src/store/game-store.ts` (Zustand, all game state + actions), `src/lib/storage.ts` (SaveData interface — keep in sync when adding state) |
| Growth engine | `src/game/engine.ts` (tick-based, multiplicative modifiers: companion × biodiversity × no-dig × water × soil × rotation × weather) |
| Game systems | `src/game/` — `crop-rotation.ts` (Dowding), `soil-health.ts`, `weather.ts`, `seasons.ts` (UK calendar-based), `companion-planting.ts`, `biodiversity.ts`, `wildlife-engine.ts`, `quest-engine.ts`, `progression.ts` (levels 0–10, Seedling → Earth Guardian) |
| Data | `src/data/` — `plants.ts` (22 plants), `biodiversity-features.ts` (13 features incl. polytunnel, food forest, field kitchen, wash & pack, cob roundhouse, compost loo), `garden-stages.ts` (5 expansion stages), `wildlife.ts` (16 UK species), `character-items.ts` (27 items), `trading.ts` (5 NPC traders), `quests.ts`, `rewards.ts` |
| Hooks | `src/hooks/` — `useGameTick.ts`, `useWeather.ts`, `useWaterRegen.ts`, `useQuestTracker.ts`, `useWildlife.ts` |
| Pages | `src/app/` — garden, almanac (4 tabs: Plants/Pairs/Rotation/Wildlife), quests, rewards, community (placeholder), character, trading |
| Garden UI | `src/components/garden/` — GardenGrid, PlotCell, PlantSelector, FeatureSelector, InfoPanel, Toolbar, Tutorial, WildlifeOverlay, WildlifeLog, CropRotationWarning |

## Key Design Decisions (do not regress)

1. **All plots are no-dig from the start** — `isNoDigBed: true` is the default; it's a philosophy, not an upgrade
2. **Compost is annual** — `applyAnnualCompost()` whole-garden action, autumn/winter only, once per calendar year (`lastCompostYear`)
3. **Garden expands automatically** via `checkGardenExpansion()` after harvests, based on level + totalHarvests (`src/data/garden-stages.ts`): Backyard Plot 6×6 → Allotment 8×8 → Market Garden 10×10 → Community Farm 12×10 → 1-Acre Regenerative Farm 14×12
4. **Everything is earned, never bought** — no microtransactions; items unlock via gameplay
5. **Education is embedded, not bolted on** — Dowding notes, real-world tips, fun facts appear inside gameplay UI, not separate lessons
6. **Seasons follow the real UK calendar** (`getCurrentSeason()` from real month)
7. Adaptive difficulty: 'seedling' (ages 6–9, advanced plants hidden) vs 'explorer' (10–14)

## Completed Features (all committed & pushed)

1. Phase 1 core: 22 plants, companion planting, biodiversity scoring, seasons, quests, rewards, 5-page app
2. Quest auto-completion engine, water regen (1/30s, max 50, offline catch-up), 9-step tutorial
3. Weather (7 types, frost damage, mulch protection), per-plot soil health (fertility/moisture/biology), Dowding crop rotation with feeding levels
4. Annual compost dressing; compost loo feature with deep educational content
5. Garden expansion system (5 stages) + market-garden structures (polytunnel, food forest, field kitchen, wash & pack station, cob roundhouse) — inspired by user's 1-acre market garden blueprint image
6. Character customisation: 27 artisan items (mushroom cap hat, Dowding's signature fleece, hand-forged hori hori, silver leaf pendant, carved walking stick, heirloom seeds, plug plants...) across 6 categories with rarity + unlock conditions
7. NPC trading: 5 traders (Old Tom, Meadow, The Blacksmith, Fungi Fred, Seed Sarah) on the Trading page
8. Wildlife visitors: 16 real UK species attracted by biodiversity features, animated overlay, tap-for-facts, Wildlife Journal (X/16 discovery tracking)

## In Progress / Next Up

1. **⏸ ON HOLD — Seasonal Planting Calendar**: User has a detailed sowing spreadsheet ("Roots Sowing timeline" PDF) they are getting ready. They will copy it into `/home/user/marketing-engine/` — watch for a new PDF/CSV file there. When it arrives, parse it and build month-level sowing/transplanting/harvest windows (current system is season-granularity only — see `canPlantInSeason` in `src/game/seasons.ts`). Likely a new Almanac tab + PlantSelector integration.
2. Real reward redemption flow (claim UI, parent approval) — bridge-to-real-world
3. Community Hub build-out (currently placeholder): market garden finder, events, veg box sign-ups
4. Player-to-player trading (needs backend)
5. Sound & haptics
6. PWA polish (manifest, offline, icons) + Vercel deploy

## Conventions

- Build-test with `npm run build` before committing; commit with descriptive messages; push to the branch above after each feature
- When adding state: update GameState interface, initialState, the saved-state `Object.assign` restoration block, AND SaveData in `src/lib/storage.ts`
- React 19: `useRef<T>(undefined)` requires explicit initial arg
- UI: Tailwind with custom classes `pixel-border`, `pixel-border-thin`, `resource-pill`, `pixel-progress`; emoji sprites; `'use client'` on all interactive components
- Educational content must be real and accurate (UK-focused)
