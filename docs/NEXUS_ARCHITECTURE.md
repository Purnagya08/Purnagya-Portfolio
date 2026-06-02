# NEXUS: The Logbook of an Engineer

## Architecture Blueprint

NEXUS is an immersive portfolio application presented as an explorable operating
system. Each portfolio area is a self-contained feature module. Shared runtimes
coordinate routing, state, animation, audio, and 3D rendering so that modules do
not duplicate infrastructure.

## Design Rules

1. A module owns its content, feature UI, local hooks, and scene composition.
2. Cross-module behavior lives in `core`, `shared`, `services`, or `three`.
3. Modules communicate through typed-by-convention events, route navigation, or
   store actions. They do not import another module's internal files.
4. Every module exposes a small public API from its `index.js`.
5. Route metadata, module metadata, audio metadata, and asset metadata each have
   one canonical registry.
6. Expensive experiences are loaded only when requested and are disposed when
   the user leaves them.

## Folder Placement

```text
public/
  audio/                       # Streamable audio files
  models/                      # Large compressed GLB assets
  textures/                    # Large compressed textures
src/
  assets/
    fonts/
    icons/
    images/                    # Bundled UI images and small previews
  core/
    config/                    # Environment, feature flags, quality defaults
    layouts/                   # BootLayout, NexusLayout, TerminalLayout
    providers/                 # AppProviders and runtime providers
    routing/                   # Router, route registry, guards, preload helpers
    store/
      slices/                  # Global Zustand slices
      selectors/               # Stable cross-module selectors
      useNexusStore.js         # Composed global store
  data/
    content/                   # Portfolio copy and structured content
    manifests/                 # Modules, missions, achievements, fragments
    registries/                # Audio, assets, navigation, scene metadata
  modules/
    boot-sequence/
    nexus-os/
    station-hub/
    museum-of-origins/
    training-facility/
    challenge-galaxy/
    mission-control/
    research-labs/
    achievement-observatory/
    present-station/
    future-galaxy/
    communication-terminal/
    nexus-ai/
    memory-fragments/
    not-found/
  services/
    analytics/                 # Tracking adapter
    api/                       # HTTP adapter
    audio/                     # Audio engine and asset loader
    events/                    # Application event bus
    persistence/               # Versioned local storage adapter
    telemetry/                 # Performance measurements
  shared/
    components/
      feedback/                # Loaders, error boundaries, reduced-mode notices
      layout/                  # Shared shell components
      ui/                      # Buttons, panels, cards, typography
    constants/
    hooks/
    lib/
    styles/
    utils/
  three/
    components/                # Reusable R3F primitives
    effects/                   # Shared post-processing presets
    hooks/                     # Asset loading, disposal, quality hooks
    loaders/                   # GLTF, texture, and preloading helpers
    runtime/                   # Canvas host, quality manager, scene registry
    scenes/                    # Shared shell scenes and module scene entrypoints
    shaders/
    utils/
```

Each feature module follows one template:

```text
modules/<module-name>/
  components/                  # Feature-only UI
  hooks/                       # Feature-only orchestration
  pages/                       # Route entry component
  scenes/                      # Optional feature scene composition
  store/                       # Optional local Zustand store
  data.js                      # Optional feature-local static data
  index.js                     # Public exports only
```

Do not create empty subfolders until a module needs them.

## Application Routing

Use React Router with a declarative route registry in
`src/core/routing/routeRegistry.js`. The registry is the only source used to
create routes, navigation items, breadcrumbs, access checks, and route preloads.

| Path                           | Module                  | Layout                      | Loading policy      |
| ------------------------------ | ----------------------- | --------------------------- | ------------------- |
| `/`                            | Boot Sequence           | `BootLayout`                | Eager               |
| `/nexus`                       | NEXUS OS                | `NexusLayout`               | Eager after boot    |
| `/nexus/hub`                   | Station Hub             | `NexusLayout`               | Preload during boot |
| `/nexus/origins`               | Museum of Origins       | `NexusLayout`               | Lazy                |
| `/nexus/training`              | Training Facility       | `NexusLayout`               | Lazy                |
| `/nexus/challenges`            | Challenge Galaxy        | `NexusLayout`               | Lazy                |
| `/nexus/missions`              | Mission Control         | `NexusLayout`               | Lazy                |
| `/nexus/labs`                  | Research Labs           | `NexusLayout`               | Lazy                |
| `/nexus/achievements`          | Achievement Observatory | `NexusLayout`               | Lazy                |
| `/nexus/present`               | Present Station         | `NexusLayout`               | Lazy                |
| `/nexus/future`                | Future Galaxy           | `NexusLayout`               | Lazy                |
| `/nexus/contact`               | Communication Terminal  | `TerminalLayout`            | Lazy                |
| `/nexus/ai`                    | NEXUS AI                | `NexusLayout` overlay route | Lazy                |
| `/nexus/memories/:fragmentId?` | Memory Fragments        | `NexusLayout` overlay route | Lazy                |

`Boot Sequence` redirects returning visitors to `/nexus/hub` only after the
persisted session has been hydrated. Overlay routes retain the active station in
the background. Unknown paths render the shared `not-found` module.

Route guards belong in `core/routing/guards`. They evaluate module metadata and
global selectors; feature pages never implement their own unlock logic.

## Module Registry

Create `src/data/manifests/modules.js` as the canonical list of stations. Each
record contains:

```text
id, path, label, description, icon, sceneId, audioZoneId,
unlockRuleId, preloadPriority, capabilities
```

Station Hub renders destinations from this registry. Mission Control, NEXUS AI,
and the navigation shell read the same records. No module maintains a second
navigation list.

## Global State Architecture

Use one composed Zustand store in `src/core/store/useNexusStore.js`. Place slice
factories in `src/core/store/slices` and expose stable selectors from
`src/core/store/selectors`.

| Slice              | Owns                                                        | Persistence                 |
| ------------------ | ----------------------------------------------------------- | --------------------------- |
| `sessionSlice`     | boot status, hydration status, visit count, reduced mode    | Persist selected fields     |
| `navigationSlice`  | active station, previous station, overlay, transition lock  | Session only                |
| `progressSlice`    | unlocked stations, missions, achievements, fragments        | Persist with schema version |
| `preferencesSlice` | audio consent, volume, mute, motion preference, quality     | Persist                     |
| `audioSlice`       | active zone, playback status, current cue                   | Session only                |
| `aiSlice`          | terminal visibility, conversation session, pending response | Session only                |
| `runtimeSlice`     | WebGL support, FPS tier, loading state, recoverable errors  | Session only                |

State that stays local:

- Form fields remain in Communication Terminal components.
- Hover, focus, modal animation, and scene interaction state remain local.
- Loaded Three.js objects remain inside R3F and loader caches, never Zustand.
- Audio node instances remain inside the audio engine, never Zustand.
- NEXUS AI message transport details remain inside its service adapter.

Persist only user progress and preferences through
`services/persistence/nexusStorage.js`. Add a schema version and migration map
before persisting the first release.

## Animation Architecture

Use three layers with clear ownership:

| Tool           | Responsibility                                                           |
| -------------- | ------------------------------------------------------------------------ |
| Framer Motion  | React UI transitions, overlays, panels, route-shell states               |
| GSAP           | Directed timelines, boot choreography, scroll sequences, complex reveals |
| R3F `useFrame` | Continuous 3D movement and shader uniforms                               |

Place shared motion tokens in `shared/constants/motion.js`, reusable Framer
variants in `shared/lib/motion`, and GSAP timeline helpers in
`shared/lib/animation`.

The route transition coordinator lives in `core/providers/AnimationProvider`.
Modules request transitions through a shared hook and supply timeline segments;
they do not create competing page-level transition systems.

Honor `prefers-reduced-motion`. Reduced mode skips cinematic timelines, lowers
camera movement, disables nonessential particles, and shortens UI transitions.

## Audio Architecture

Create a single `AudioProvider` backed by `services/audio/audioEngine.js`.
Browsers require user interaction before playback, so Boot Sequence owns the
audio consent action and engine unlock.

Audio is data-driven through `data/registries/audio.js`:

```text
trackId, url, type, zoneId, volume, loop, preload, crossfadeMs
```

The engine owns ambient loops, one-shot cues, crossfades, mute state, and audio
node cleanup. Modules call `useAudio().playCue(trackId)` or activate a zone;
they never instantiate `Audio`, `AudioContext`, or loaders directly.

Preload only the boot cue and Station Hub ambience. Stream station audio after
intent, then cache it. Always expose mute and volume controls in the NEXUS OS
shell.

## 3D Architecture

Use one long-lived `CanvasHost` in `three/runtime` for NEXUS routes. Station
modules register scene entrypoints in `three/runtime/sceneRegistry.js` and
render scene composition from their own `scenes` folder.

Shared Three.js responsibilities:

| Folder             | Responsibility                                           |
| ------------------ | -------------------------------------------------------- |
| `three/runtime`    | Canvas lifecycle, scene switching, capability detection  |
| `three/loaders`    | Draco/KTX2-aware asset loading and preload helpers       |
| `three/components` | Reusable stars, portals, camera rig, lighting primitives |
| `three/effects`    | Quality-tiered post-processing presets                   |
| `three/hooks`      | Quality, visibility, asset, and disposal hooks           |

Never create a separate canvas per station. A second small canvas is acceptable
only for an isolated preview with a measured reason.

Use GLB models with Draco or Meshopt compression, KTX2 textures where practical,
and explicit asset manifests. Pause frame updates when the document is hidden.
Dispose station-only resources when leaving a station.

Provide three quality tiers:

| Tier       | Behavior                                               |
| ---------- | ------------------------------------------------------ |
| `high`     | Full effects, higher DPR cap, richer particles         |
| `balanced` | Reduced particles, restrained post-processing, DPR cap |
| `reduced`  | Minimal effects or static fallback image               |

## Data Architecture

Keep static portfolio content separate from runtime state:

```text
data/
  content/
    profile.js
    experience.js
    projects.js
    research.js
  manifests/
    achievements.js
    fragments.js
    missions.js
    modules.js
  registries/
    assets.js
    audio.js
    scenes.js
```

Feature modules select records by ID. They do not copy content records into
component files. Validate manifest references in a small build-time script once
content volume increases.

Remote data is accessed only through `services/api`. Keep adapters narrow so
static data can be replaced by a CMS without rewriting page components.

## Module Communication

Use the least powerful communication mechanism that fits:

1. Use component props for parent-child communication.
2. Use route navigation for station changes and shareable state.
3. Use Zustand actions for durable cross-module application state.
4. Use `services/events/nexusEvents.js` for transient effects such as
   `mission:completed`, `fragment:discovered`, or `station:entered`.
5. Use service adapters for side effects such as analytics, persistence, audio,
   and API calls.

Events carry serializable payloads and use namespaced constants from
`shared/constants/events.js`. Event handlers must unsubscribe during cleanup.
The event bus is not a hidden state store.

## Lazy Loading And Code Splitting

Use route-level `lazy()` boundaries for every station. Keep Boot Sequence, the
minimal NEXUS OS shell, and Station Hub preload helper in the initial path.

Split further at these boundaries:

- Load each station scene independently after route intent.
- Load the R3F runtime only after WebGL capability detection and boot completion.
- Load NEXUS AI transport and UI only when its overlay opens.
- Load audio files outside the JavaScript bundle through the audio registry.
- Load large models and textures from `public` through asset manifests.
- Lazy-load heavyweight optional UI such as editors, charts, or code viewers.

Use intent-based preloading on destination hover, keyboard focus, and idle time.
Preload the next likely station from registry priority after the current scene
becomes interactive.

## Performance Strategy

Set measurable budgets before adding visual detail:

| Area                     | Initial budget                               |
| ------------------------ | -------------------------------------------- |
| Initial JavaScript       | Under 250 KB gzip                            |
| Station route chunk      | Under 120 KB gzip excluding 3D runtime       |
| Initial critical assets  | Under 1.5 MB                                 |
| Largest compressed model | Under 3 MB where possible                    |
| Interaction readiness    | Under 3 seconds on a mid-range mobile device |

Apply these controls:

- Use route and scene boundaries so Station Hub is interactive before optional
  assets load.
- Preload only assets needed for the next interaction.
- Use `frameloop="demand"` for static scenes and invalidate on interaction.
- Clamp DPR by quality tier and monitor FPS through the quality manager.
- Pool particles and reusable geometries; avoid allocating in `useFrame`.
- Memoize stable R3F components and Zustand selectors.
- Use image dimensions, modern formats, and responsive sources.
- Pause animations, audio, and rendering when the page is hidden.
- Provide static fallbacks when WebGL is unavailable or reduced mode is active.
- Track route load time, scene readiness, asset failures, and WebGL context loss.

## Ownership Matrix

| Concern                        | Owner                            | Modules consume through               |
| ------------------------------ | -------------------------------- | ------------------------------------- |
| Routes and guards              | `core/routing`                   | Route registry and navigation helpers |
| Global application state       | `core/store`                     | Selectors and actions                 |
| UI components                  | `shared/components`              | Shared component imports              |
| Motion tokens and coordination | `shared/lib/animation`, provider | Shared hooks                          |
| Audio playback                 | `services/audio`, provider       | `useAudio`                            |
| Canvas lifecycle and quality   | `three/runtime`                  | Scene registry and shared hooks       |
| Portfolio content              | `data/content`                   | IDs and selectors                     |
| Cross-module effects           | `services/events`                | Namespaced event API                  |
| Persistence                    | `services/persistence`           | Store middleware adapter              |

## Implementation Order

1. Replace generic starter routes with Boot Sequence, NEXUS OS, and Station Hub.
2. Add the composed Zustand store, persistence adapter, and module registry.
3. Add animation coordination and reduced-motion behavior.
4. Add the audio provider and consent flow.
5. Add the long-lived Canvas host, scene registry, and quality manager.
6. Build station modules one at a time from registry-driven data.
7. Add NEXUS AI and Memory Fragments after the shared runtime is stable.
8. Add manifest validation, telemetry, and performance budget checks.
