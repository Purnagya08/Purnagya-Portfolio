# NEXUS — The Logbook of an Engineer

> An interactive sci-fi documentary portfolio. Space station. OS boot. 10 modules. AI assistant. Terminal mode. Memory fragments.

**Engineer:** Purnagya Raj  
**Stack:** React 18 · Vite 6 · Three.js · Framer Motion · Zustand · Web Audio API  
**Live:** [Deploy to Vercel — see instructions below]

---

## What is NEXUS?

NEXUS is a fully immersive 3D portfolio built as a space station operating system. Visitors enter through a cinematic docking sequence, watch the OS boot, then navigate nine content modules via a hexagonal Command Hub — all set against a live 3D starfield with spacecraft, nebulae, a ringed planet, and a gyroscopic station.

It is not just a portfolio. It is a logbook.

---

## Engineer Profile

| | |
|---|---|
| **Name** | Purnagya Raj |
| **Degree** | B.Tech CSE — UEM Jaipur (2022–26) |
| **GPA** | 8.795 / 10.0 · 3× Semester Rank Holder (250+ cohort) |
| **Achievements** | NPTEL Java 100/100 · LaserHacks International Finalist · 2× Hackathon Winner |
| **Status** | Open to SWE Internships |
| **GitHub** | github.com/Purnagya08 |
| **LinkedIn** | linkedin.com/in/purnagya-raj |
| **LeetCode** | leetcode.com/u/techXpurna |

---

## Quick Start

```bash
cd Purnagya-Portfolio
npm install --legacy-peer-deps
npm run dev          # → http://localhost:3000
npm run build        # production build
npm run preview      # preview built site locally
```

---

## Add Your Photo

Drop a file named `profile.jpg` into the `public/` folder.  
The Captain's Profile avatar loads it automatically. Falls back to "PR" initials if missing.

---

## Add Ambient Audio

Place your ambient track at:
```
public/audio/nexus_audio.mp3
```
The audio engine loads it automatically on first user interaction. Falls back to a procedural synthesized drone if the file is missing.

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel

# Settings (auto-detected):
# Framework:  Vite
# Build:      npm run build
# Output:     dist
```

`vercel.json` is pre-configured with SPA routing rewrites, security headers, and immutable asset caching.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `` ` `` | Open / close Terminal Mode |
| `Esc` | Close Terminal |

---

## Terminal Commands

Open terminal with `` ` `` from anywhere on the site.

```
help            list all commands
hub             return to Central Command Hub
cd <module>     navigate to a module
profile         Captain's Profile
ai              NEXUS AI assistant
whoispurnagya   engineer profile
skills          tech stack
achievements    awards & milestones
projects        project portfolio
learnings       current focus areas
contact         contact information
stack           detailed stack breakdown
reset           clear all memory fragments
clear           clear terminal screen
exit            close terminal
```

**Module navigation via terminal:**
```
cd origins       Museum of Origins
cd training      Training Facility
cd challenges    Challenge Galaxy
cd missions      Mission Control
cd research      Research Labs
cd achievements  Achievement Observatory
cd present       Present Station
cd future        Future Galaxy
cd nexusai       NEXUS AI
cd profile       Captain's Profile
```

---

## Module Map

```
┌─────────────────────────────────────────────────┐
│              CENTRAL COMMAND HUB                │
│                                                 │
│   ORIGINS     TRAINING    CHALLENGES            │
│   MOD-01      MOD-02      MOD-03                │
│                                                 │
│   MISSIONS    [NEXUS]     RESEARCH              │
│   MOD-04       HUB        MOD-05                │
│                                                 │
│  ACHIEVEMENTS  PRESENT    FUTURE                │
│   MOD-06      MOD-07      MOD-08                │
└─────────────────────────────────────────────────┘

HUD Buttons (top-right, always accessible):
  CAPTAIN   →  Captain's Profile (hobbies, interests, reset)
  NEXUS·AI  →  Archive intelligence query system
  CONTACT   →  Open Channel overlay (email, GitHub, LinkedIn)
  AUDIO     →  Toggle ambient audio ON / OFF
```

---

## URL Routing

Each module has its own URL — browser back/forward works.

```
/              →  Central Command Hub
/origins       →  Museum of Origins
/training      →  Training Facility
/challenges    →  Challenge Galaxy
/missions      →  Mission Control
/research      →  Research Labs
/achievements  →  Achievement Observatory
/present       →  Present Station
/future        →  Future Galaxy
/nexusai       →  NEXUS AI Assistant
/profile       →  Captain's Profile
```

---

## Memory Fragments

15 collectible Memory Fragments are hidden across all modules — story quotes that unlock when clicked. Progress is tracked in the bottom-right HUD and persists across sessions via localStorage.

**To reset fragments:**
- Captain's Profile → scroll to bottom → Reset Logbook
- Terminal → type `reset` → Enter

---

## Folder Structure

```
Purnagya-Portfolio/
├── public/
│   ├── favicon.svg
│   ├── profile.jpg              ← add your photo here
│   └── audio/
│       └── nexus_audio.mp3      ← add your ambient track here
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── audio/audioEngine.js
│   ├── components/
│   │   ├── boot/                EntryGate + BootSequence
│   │   ├── cursor/              NexusCursor (rAF, trail, shockwave)
│   │   ├── hub/                 CentralCommandHub, ModulePortal, ModuleShell
│   │   ├── modules/             10 content modules (lazy loaded)
│   │   ├── overlays/            ErrorBoundary, AchievementUnlock,
│   │   │                        MemoryFragmentCompletion, OfflineBanner,
│   │   │                        ContactOverlay
│   │   ├── shared/              ModuleComponents (RevealBlock, StatCard, etc.)
│   │   ├── space/               DynamicEvents (meteor/flare/wormhole)
│   │   ├── terminal/            TerminalMode (full CLI)
│   │   ├── three/               SpaceScene, Starfield, Nebula,
│   │   │                        Planet, NexusStation, Spacecraft
│   │   └── ui/                  HUDOverlay, WarpTransition
│   ├── data/modules.js
│   ├── hooks/                   useZoneMusic, useOnlineStatus
│   ├── pages/NotFound.jsx
│   ├── store/nexusStore.js      Zustand + localStorage persist
│   └── styles/globals.css
├── vercel.json
├── vite.config.js
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 + Vite 6 |
| 3D Engine | Three.js r170 + React Three Fiber 8 + Drei |
| Animation | Framer Motion 11 |
| State | Zustand 5 + persist middleware |
| Styling | Tailwind CSS 3 + inline CSS-in-JS |
| Audio | Web Audio API (procedural SFX + ambient mp3) |
| Post-FX | @react-three/postprocessing (Bloom, CA, Vignette) |
| Deploy | Vercel |

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Gold | `#c9a84c` / `#e8c96a` | Primary accent, titles, HUD |
| Cyan | `#38b8d8` | UI elements, data panels |
| Green | `#60d8a0` | Success, live status |
| Purple | `#a070e0` | Challenge, future galaxy |
| Text | `#d8e4f0` | Body paragraphs |
| Background | `#02040c` | Deep space void |

---

## Performance Notes

- All 10 modules are lazy-loaded — only the active module's JS is fetched
- Three.js is split into its own chunk — loads in parallel with UI
- Mobile: Nebula, second spacecraft, and post-processing disabled automatically
- Low-end hardware: `frameloop='demand'` enabled automatically
- Run Lighthouse after deploying — target Performance > 60 on mobile

---

## Content Editing Guide

| What to change | File |
|---|---|
| Personal details, hobbies, interests | `src/components/modules/CaptainProfile.jsx` |
| Projects | `src/components/modules/MissionControl.jsx` |
| Skills | `src/components/modules/TrainingFacility.jsx` |
| Achievements | `src/components/modules/AchievementObservatory.jsx` |
| Hackathons | `src/components/modules/ChallengeGalaxy.jsx` |
| Origin / timeline | `src/components/modules/MuseumOfOrigins.jsx` |
| Current status | `src/components/modules/PresentStation.jsx` |
| Future goals | `src/components/modules/FutureGalaxy.jsx` |
| AI knowledge base | `src/components/modules/NexusAI.jsx` → `KB` object |
| Contact links | `src/components/overlays/ContactOverlay.jsx` → `LINKS` array |

---

*NEXUS OS v4.2.1 · Built by Purnagya Raj · 2025*  
*"The logbook of an engineer — built to be read, not just seen."*
