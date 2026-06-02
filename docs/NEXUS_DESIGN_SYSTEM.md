# NEXUS Design System

## Creative Direction

NEXUS: The Logbook of an Engineer is a premium engineering documentary told
through a mission archive. It should feel like a space exploration record, an
aerospace control room, and a high-end museum exhibit: cinematic, precise,
quietly technical, and handcrafted.

The interface must avoid common AI-generated sci-fi habits. Do not use neon
cyan, neon purple, neon pink, neon gradients, cyberpunk styling, Matrix
textures, generic AI SaaS effects, excessive particles, or glowing borders as a
default treatment.

Use the system in this order:

1. Start with semantic Tailwind tokens from `src/shared/styles/tokens.css`.
2. Use shared React primitives from `src/shared/components/ui`.
3. Use shared CSS recipes from `src/shared/styles/components.css`.
4. Add module-specific presentation only when the shared system cannot express
   the feature.

## File Map

| File                                   | Responsibility                                                    |
| -------------------------------------- | ----------------------------------------------------------------- |
| `src/shared/styles/index.css`          | CSS entrypoint, base page color, selection, and focus rules       |
| `src/shared/styles/fonts.css`          | Font delivery                                                     |
| `src/shared/styles/tokens.css`         | Tailwind v4 theme tokens and semantic CSS variables               |
| `src/shared/styles/components.css`     | Reusable metal, glass, card, button, navigation, and label recipes |
| `src/shared/styles/utilities.css`      | Space backgrounds, archival gradients, grids, and scanline texture |
| `src/shared/constants/motion.js`       | Framer Motion durations, easings, and variants                    |
| `src/shared/constants/designTokens.js` | JS colors for Three.js and non-CSS contexts                       |
| `src/shared/utils/cn.js`               | Shared class-name composition                                     |

## Color Palette

### Environment And Materials

| Token           | Value     | Use                                         |
| --------------- | --------- | ------------------------------------------- |
| `void-950`      | `#050608` | Deepest page background                     |
| `void-900`      | `#0a0d12` | Primary space background                    |
| `void-850`      | `#10151d` | Dim atmospheric layer                       |
| `void-800`      | `#161d27` | Dark panel foundation                       |
| `hull-700`      | `#202936` | Brushed metal panels                        |
| `hull-600`      | `#2c3644` | Raised controls and hover surfaces          |
| `hull-500`      | `#46515f` | Rules, dividers, and low-emphasis metadata  |
| `starlight-50`  | `#f2efe7` | Off-white high-emphasis text                |
| `starlight-100` | `#e7e1d6` | Warm UI text and button hover fill          |
| `starlight-200` | `#cfc8ba` | Body copy                                   |
| `starlight-300` | `#a9b0b6` | Secondary copy                              |
| `starlight-400` | `#79828c` | Supporting metadata                         |
| `starlight-500` | `#58616b` | Quiet labels and disabled text              |

### Instrument Signals

| Token           | Value     | Use                                              |
| --------------- | --------- | ------------------------------------------------ |
| `signal-steel`  | `#9aa6ad` | Default status dots, passive module glyphs       |
| `signal-blue`   | `#7f99ad` | Navigation context, selected data, archive links |
| `signal-brass`  | `#c4a96b` | Primary action, focus, active navigation         |
| `signal-sage`   | `#91a082` | Nominal, success, available systems              |
| `signal-copper` | `#b27a5e` | Historic artifact, warmth, discovery             |
| `signal-red`    | `#b56a63` | Error, destructive, unavailable state            |

Signals are muted instrument colors, not light sources. Most screens should be
space, slate, metal, and off-white with one intentional signal.

```jsx
<p className="text-signal-brass">Transfer ready</p>
<div className="border-hull-600 bg-void-800" />
```

## Tailwind Theme

The live Tailwind v4 theme lives in `src/shared/styles/tokens.css`.

```css
@theme {
  --color-void-950: #050608;
  --color-void-900: #0a0d12;
  --color-hull-700: #202936;
  --color-hull-600: #2c3644;
  --color-starlight-50: #f2efe7;
  --color-starlight-200: #cfc8ba;
  --color-signal-blue: #7f99ad;
  --color-signal-brass: #c4a96b;
  --color-signal-sage: #91a082;
  --color-signal-copper: #b27a5e;
}

:root {
  --gradient-space: /* deep-space wash */;
  --gradient-interface: /* quiet panel reflection */;
  --gradient-archive: /* off-white, blue, brass */;
  --metal-brush: /* subtle horizontal material texture */;
}
```

Use `bg-nexus-space` for the global environment, `bg-nexus-interface` for
subtle surface reflection, `bg-nexus-archive` for rare progress or separators,
and `bg-nexus-instrument` for warm mission moments.

## Typography System

| Role    | Font           | Tailwind utility | Use                                             |
| ------- | -------------- | ---------------- | ----------------------------------------------- |
| Display | Space Grotesk  | `font-display`   | Cinematic titles and mission identifiers        |
| Heading | Space Grotesk  | `font-heading`   | Section titles, card titles, editorial headings |
| Body    | Inter          | `font-sans`      | Narrative copy and long-form reading            |
| Data    | JetBrains Mono | `font-mono`      | Labels, metadata, status, coordinates, controls |

Use tracking with discipline. Mission labels can be wide and precise; paragraphs
should remain comfortable and editorial.

## Surfaces

Glass is allowed only when it communicates overlay depth or instrumentation.
Most surfaces should feel like dark brushed metal, matte archive panels, or
museum display cases.

| Recipe                 | Use                                             |
| ---------------------- | ----------------------------------------------- |
| `nexus-glass-subtle`   | Navigation bars and quiet overlay framing       |
| `nexus-glass`          | Standard mission panels                         |
| `nexus-glass-elevated` | Active windows, dialogs, focused control panels |

Rules:

- Never stack more than two translucent surfaces.
- Prefer border contrast and material texture over blur.
- Elevated surfaces may use `shadow-instrument`; do not fake luminous energy.
- Static documentary content should feel calm and grounded.

## Component Redesign

### Buttons

Primary buttons use brass fill, deep text, and restrained depth. Secondary
buttons use a brass border and quiet fill. Ghost buttons should remain mostly
typographic until hover.

```jsx
<Button>Begin sequence</Button>
<Button variant="secondary">Open archive</Button>
<Button variant="ghost">Dismiss</Button>
```

### Cards

Cards are mission records. They should feel like museum placards or engineering
log entries, not floating AI product tiles.

- Static cards do not move.
- Interactive cards rise by `0.25rem`, reveal a faint interface reflection, and
  strengthen the border.
- Card titles use `font-heading`; metadata uses `font-mono`.
- Avoid decorative corner brackets unless they encode real status or affordance.

### Module Glyphs

Glyphs are instrument labels. Use muted `steel`, `blue`, `brass`, `sage`, or
`copper` tones. They should read as engraved controls, not glowing app icons.

### System Badges

Badges use a small solid status dot and label text. The dot color must be paired
with text because color alone is not accessible.

## Hover Redesign

Hover states should feel tactile and expensive.

- Buttons rise by `0.125rem`; fill or border becomes slightly warmer.
- Interactive cards rise by `0.25rem`; shadow deepens and border warms.
- Navigation links reveal a brass hairline with no glow.
- Window controls change border and text color only.
- Static narrative, captions, and museum records do not animate.
- Touch interaction must never depend on hover alone.

## Animation Redesign

Animation should feel like documentary editing and aerospace instrumentation:
measured, legible, and purposeful.

| Utility                 | Use                                           |
| ----------------------- | --------------------------------------------- |
| `animate-nexus-pulse`   | Slow status heartbeat, never decorative glow  |
| `animate-nexus-scan`    | Rare scanner pass for boot or diagnostics     |
| `animate-nexus-float`   | Minimal orbital movement, reduced by default  |
| `animate-nexus-flicker` | Rare archival terminal texture                |

Motion rules:

- Use opacity, small y-offsets, and gentle scale changes.
- Prefer durations from `src/shared/constants/motion.js`.
- Use Framer Motion for UI state, GSAP for directed cinematic sequences, and
  R3F `useFrame` only for continuous 3D motion.
- Disable nonessential particles in reduced motion.
- Avoid looping motion unless it communicates active system state.

## Good And Bad Choices

| Good                                                         | Bad                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| Brass focus ring on a slate control                          | Neon outline around every control                       |
| Warm off-white body copy on deep space                       | Pure white text over saturated gradients                |
| Subtle brushed-metal texture on panels                       | Heavy glassmorphism on every card                       |
| One muted signal color per section                           | Multiple bright competing accent colors                 |
| Slow documentary fade and small lift                         | Bouncy SaaS microinteractions                           |
| Sparse starfield or archival grid texture                    | Dense particles, starbursts, or decorative energy lines |
| Museum placard spacing and calm hierarchy                    | Generic futuristic dashboard clutter                    |
| Material shadow and border changes for hover                 | Glow as the primary interaction feedback                |

## Accessibility And Performance

- Keep body copy at `starlight-200` or brighter against space backgrounds.
- Use signal color plus text or icon labels; never rely on color alone.
- Preserve visible focus states through the global `:focus-visible` rule.
- Keep blur layers shallow and intentional.
- Prefer CSS transitions for simple hover states.
- Reserve JavaScript animation for coordinated sequences.
- Use JS token exports for Three.js materials so scene colors remain aligned
  with the CSS system.
