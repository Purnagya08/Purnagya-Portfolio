# NEXUS: The Logbook of an Engineer

An immersive, modular portfolio foundation built with React and Vite.

## Architecture

The target application architecture, module ownership rules, loading strategy,
and performance plan are documented in
[`docs/NEXUS_ARCHITECTURE.md`](docs/NEXUS_ARCHITECTURE.md).

The reusable visual language, Tailwind tokens, shared component recipes, and
usage rules are documented in
[`docs/NEXUS_DESIGN_SYSTEM.md`](docs/NEXUS_DESIGN_SYSTEM.md).

## Commands

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run build
npm run preview
```

## Stack

- React 19 and Vite
- Tailwind CSS
- React Router
- Framer Motion and GSAP
- Zustand
- React Three Fiber, Drei, and Three.js
- ESLint and Prettier

## Structure

```text
public/
src/
  assets/
    fonts/
    icons/
    images/
    models/
  core/
    config/
    layouts/
    providers/
    routing/
    store/
  data/
  modules/
    about/
    contact/
    home/
    not-found/
    projects/
  services/
    analytics/
    api/
  shared/
    components/
      layout/
      ui/
    constants/
    hooks/
    lib/
    styles/
    utils/
  three/
    components/
    hooks/
    scenes/
    utils/
```

## Deployment

Import the repository into Vercel. The included `vercel.json` sends client-side
routes to `index.html`, so React Router routes work on direct visits.
