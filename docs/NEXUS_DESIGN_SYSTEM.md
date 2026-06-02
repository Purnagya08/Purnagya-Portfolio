# NEXUS Design System

## Creative Direction

NEXUS is an interactive sci-fi documentary: a space journey presented through
an operating system, a digital museum, and a futuristic engineering interface.
The visual language should feel precise and cinematic rather than decorative.

Use the system in this order:

1. Start with semantic Tailwind tokens from `src/shared/styles/tokens.css`.
2. Use shared React primitives from `src/shared/components/ui`.
3. Use shared CSS recipes from `src/shared/styles/components.css`.
4. Add module-specific presentation only when the shared system cannot express
   the feature.

## File Map

| File                                   | Responsibility                                              |
| -------------------------------------- | ----------------------------------------------------------- |
| `src/shared/styles/index.css`          | CSS entrypoint and global base rules                        |
| `src/shared/styles/fonts.css`          | Font delivery                                               |
| `src/shared/styles/tokens.css`         | Tailwind v4 design tokens and semantic CSS variables        |
| `src/shared/styles/components.css`     | Reusable glass, card, button, navigation, and label recipes |
| `src/shared/styles/utilities.css`      | Reusable backgrounds, grids, scanlines, and gradient text   |
| `src/shared/constants/motion.js`       | Framer Motion durations, easings, and variants              |
| `src/shared/constants/designTokens.js` | JS colors for Three.js and non-CSS contexts                 |
| `src/shared/utils/cn.js`               | Shared class-name composition                               |

## Color Palette

### Environment Neutrals

| Token           | Value     | Use                        |
| --------------- | --------- | -------------------------- |
| `void-950`      | `#02040b` | Deepest page background    |
| `void-900`      | `#050916` | Primary space background   |
| `void-850`      | `#081020` | Layered background         |
| `void-800`      | `#0b1428` | Dark panel foundation      |
| `hull-700`      | `#13213b` | Raised interface surfaces  |
| `hull-600`      | `#1d3152` | Borders and hover surfaces |
| `hull-500`      | `#294469` | Quiet accents              |
| `starlight-50`  | `#f5fbff` | High-emphasis text         |
| `starlight-200` | `#c4d9eb` | Body text                  |
| `starlight-300` | `#91abc2` | Supporting text            |
| `starlight-400` | `#647f99` | Muted metadata             |

### Interface Signals

| Token            | Value     | Use                                             |
| ---------------- | --------- | ----------------------------------------------- |
| `signal-cyan`    | `#59f3ff` | Primary action, active navigation, system state |
| `signal-blue`    | `#5b8cff` | Informational state, gradient bridge            |
| `signal-violet`  | `#a67cff` | Research and AI accents                         |
| `signal-magenta` | `#ef7dff` | Rare discovery accents                          |
| `signal-amber`   | `#ffc857` | Caution, achievements, temporal markers         |
| `signal-green`   | `#63f5ad` | Success and online states                       |
| `signal-red`     | `#ff667d` | Error and destructive states                    |

Use signal colors sparingly. Most screens should be neutral space surfaces with
one dominant active signal.

```jsx
<p className="text-signal-cyan">System online</p>
<div className="border-hull-600 bg-void-800" />
```

## Typography System

| Role    | Font           | Tailwind utility | Use                                                 |
| ------- | -------------- | ---------------- | --------------------------------------------------- |
| Display | Orbitron       | `font-display`   | Hero titles, station names, rare interface branding |
| Heading | Space Grotesk  | `font-heading`   | Section titles, card titles, editorial headings     |
| Body    | Inter          | `font-sans`      | Narrative copy and long-form reading                |
| Data    | JetBrains Mono | `font-mono`      | Labels, metadata, status, coordinates, controls     |

Use display type with restraint. Orbitron becomes difficult to read in long
sentences, so paragraph text always remains Inter.

### Type Scale

| Utility            | Use                                  |
| ------------------ | ------------------------------------ |
| `text-display-2xl` | Boot title or major cinematic moment |
| `text-display-xl`  | Homepage hero                        |
| `text-display-lg`  | Station title                        |
| `text-heading-xl`  | Page title                           |
| `text-heading-lg`  | Section title                        |
| `text-heading-md`  | Card title                           |
| `text-body-lg`     | Introductory narrative               |
| `text-body-md`     | Default narrative                    |
| `text-body-sm`     | Supporting text                      |
| `text-label`       | Interface metadata                   |

Tracking utilities: `tracking-display`, `tracking-interface`, and
`tracking-data`.

## Spacing System

The token scale is intentionally small and repeatable.

| Utility suffix | Value     |
| -------------- | --------- |
| `nexus-1`      | `0.25rem` |
| `nexus-2`      | `0.5rem`  |
| `nexus-3`      | `0.75rem` |
| `nexus-4`      | `1rem`    |
| `nexus-5`      | `1.5rem`  |
| `nexus-6`      | `2rem`    |
| `nexus-7`      | `3rem`    |
| `nexus-8`      | `4rem`    |
| `nexus-9`      | `6rem`    |
| `nexus-10`     | `8rem`    |

Use `py-section` for page sections and `px-(--spacing-gutter)` for responsive
page gutters.

## Glassmorphism System

Use glass surfaces to establish interface hierarchy. Avoid stacking more than
two glass layers because each backdrop blur has a rendering cost.

| Recipe                 | Use                                                |
| ---------------------- | -------------------------------------------------- |
| `nexus-glass-subtle`   | Navigation, low-priority overlays, canvas framing  |
| `nexus-glass`          | Standard panels                                    |
| `nexus-glass-elevated` | Focused dialogs, command surfaces, active overlays |

Use the `GlassPanel` component when a glass surface needs rounded corners:

```jsx
<GlassPanel variant="elevated" className="p-nexus-5">
  Mission telemetry
</GlassPanel>
```

## Card System

`Card` owns the shared panel, border, depth, and hover behavior.

```jsx
<Card className="p-nexus-5">Static museum record</Card>
<Card interactive className="p-nexus-5">
  Selectable station
</Card>
```

Use interactive cards only when selecting the card causes navigation or an
action. Static cards do not lift on hover.

## Button System

| Variant     | Use                                      |
| ----------- | ---------------------------------------- |
| `primary`   | One leading action per view              |
| `secondary` | Alternate action or important navigation |
| `ghost`     | Quiet action inside an existing panel    |

```jsx
<Button>Begin sequence</Button>
<Button variant="secondary">Open logbook</Button>
<Button variant="ghost">Dismiss</Button>
```

`Button` accepts an `as` prop for router links:

```jsx
<Button as={Link} to="/projects">
  Explore projects
</Button>
```

## Hover System

Hover states communicate capability:

- Buttons rise by `0.125rem` and strengthen their signal.
- Interactive cards rise by `0.375rem`, brighten their border, and reveal an
  interface gradient.
- Navigation links reveal a cyan hairline.
- Static documentary content does not move.
- Touch interaction must never depend on hover alone.

Focus rings remain visible through the global `:focus-visible` rule.

## Animation System

### CSS Animations

| Utility                 | Use                                     |
| ----------------------- | --------------------------------------- |
| `animate-nexus-pulse`   | System beacons and loading placeholders |
| `animate-nexus-scan`    | Rare scanner line treatment             |
| `animate-nexus-float`   | Decorative orbital objects              |
| `animate-nexus-flicker` | Rare terminal or boot-sequence texture  |

### Framer Motion

Import shared variants from `src/shared/constants/motion.js`:

```jsx
<motion.div {...NEXUS_MOTION.panel}>Panel content</motion.div>
```

Use Framer Motion for interface state transitions. Use GSAP for directed
cinematic timelines. Use R3F `useFrame` for continuous 3D movement. Never
reimplement the same transition in multiple modules.

The global stylesheet respects `prefers-reduced-motion` and collapses animation
durations for users who request it.

## Shadows

| Utility               | Use                                |
| --------------------- | ---------------------------------- |
| `shadow-panel`        | Default interface depth            |
| `shadow-panel-raised` | Elevated overlays and hover states |
| `shadow-glow-cyan`    | Active system signal               |
| `shadow-glow-violet`  | AI and research signal             |
| `shadow-glow-amber`   | Achievement and caution signal     |

Do not apply glow to every surface. Glow indicates active energy or focus.

## Gradients

| Utility               | Use                              |
| --------------------- | -------------------------------- |
| `bg-nexus-space`      | Global deep-space background     |
| `bg-nexus-interface`  | Quiet panel highlight            |
| `bg-nexus-horizon`    | Cyan-blue-violet emphasis        |
| `bg-nexus-sunrise`    | Amber-magenta discovery emphasis |
| `text-nexus-gradient` | Rare display-text emphasis       |

Supporting texture utilities:

| Utility           | Use                          |
| ----------------- | ---------------------------- |
| `nexus-grid`      | Engineering coordinate plane |
| `nexus-scanlines` | Light terminal texture       |
| `nexus-hairline`  | Gradient section separator   |

## Accessibility And Performance

- Keep body copy at `starlight-200` or brighter against space backgrounds.
- Use signal color plus text or icon labels; never rely on color alone.
- Preserve visible focus states for keyboard users.
- Keep blur layers shallow and use elevated glass only where hierarchy requires
  it.
- Prefer CSS transitions for simple hover states and reserve JavaScript
  animation for coordinated sequences.
- Use JS token exports for Three.js materials so scene colors remain aligned
  with the CSS system.
