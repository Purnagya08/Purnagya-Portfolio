# NEXUS — The Logbook of an Engineer

> Interactive sci-fi documentary portfolio. Space station. OS boot. 10 modules. AI assistant. Terminal.

**Engineer:** Purnagya Raj  
**Stack:** React 18 · Vite 6 · Three.js · Framer Motion · Zustand · Web Audio API  
**Deploy:** Vercel

---

## Quick Start

```bash
cd Purnagya-Portfolio
npm install --legacy-peer-deps
npm run dev          # → http://localhost:3000
npm run build        # production build
```

## Add Your Photo

Drop a file named `profile.jpg` into the `public/` folder.  
It appears automatically in the Captain's Profile module.

## Deploy

```bash
npm install -g vercel
vercel
# Framework: Vite · Build: npm run build · Output: dist
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `` ` `` | Open / close Terminal Mode |
| `Esc` | Close Terminal |

## Terminal Commands

```
help          list all commands
whoispurnagya engineer profile
skills        tech stack
achievements  awards & milestones
projects      project portfolio
learnings     current focus
contact       contact info
stack         detailed stack
profile       captain's profile
hub           return to hub
clear         clear screen
```

`cd <module>` also works: `cd origins`, `cd missions`, `cd research`, etc.

## Module Map

```
Hub (3×3 hex grid)     HUD buttons
─────────────────     ─────────────
Origins               NEXUS AI
Training              Captain Profile
Challenges
Missions
Research
Achievements
Present
Future
```

## Folder Structure

```
src/
├── App.jsx
├── audio/audioEngine.js          procedural Web Audio — no files
├── components/
│   ├── boot/                     EntryGate + BootSequence
│   ├── cursor/NexusCursor.jsx    rAF cursor, shockwave, trail
│   ├── hub/                      hex grid, portals, module shell
│   ├── modules/                  10 content modules
│   ├── overlays/                 ErrorBoundary, AchievementUnlock,
│   │                             MemoryFragmentCompletion, OfflineBanner
│   ├── shared/ModuleComponents.jsx  reusable building blocks
│   ├── space/DynamicEvents.jsx   meteor/flare/interference/wormhole
│   ├── terminal/TerminalMode.jsx full CLI — backtick to open
│   ├── three/                    SpaceScene, Starfield, Nebula,
│   │                             Planet, NexusStation, Spacecraft
│   └── ui/                       HUDOverlay, WarpTransition
├── data/modules.js
├── hooks/useZoneMusic.js         per-zone ambient crossfade
├── pages/NotFound.jsx
├── store/nexusStore.js           Zustand + localStorage persist
└── styles/globals.css
```

## Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| Gold  | `#c9a84c` | Primary accent, titles |
| Cyan  | `#38b8d8` | UI, HUD, data |
| Green | `#60d8a0` | Success, live status |
| Purple| `#a070e0` | Challenge, future |
| Text  | `#d8e4f0` | Body paragraphs |

---

*NEXUS OS v4.2.1 · Built by Purnagya Raj · 2025*
