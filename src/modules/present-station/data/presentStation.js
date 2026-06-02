export const stationSummary = [
  ['STATE', 'Active engineering operations center'],
  ['PROJECTS', '3 live missions'],
  ['LEARNING', '3 goals in motion'],
  ['RESEARCH', '3 open threads'],
]

export const currentProjects = [
  {
    id: 'portfolio-logbook',
    code: 'PRJ-01',
    title: 'Portfolio logbook refinements',
    status: 'In review',
    phase: 'Interface composition',
    summary:
      'Sharpen the narrative pacing so each page feels like a guided inspection instead of a static gallery.',
    progress: 82,
    signal: 'Hierarchy and copy are aligned',
    nextStep:
      'Validate the mobile reading order and keep the reveal timing restrained.',
    tags: ['Narrative', 'Responsive', 'Story pacing'],
    pulse: [68, 74, 63, 81, 77, 84],
  },
  {
    id: 'nexus-os-registry',
    code: 'PRJ-02',
    title: 'NEXUS OS mission registry',
    status: 'Active',
    phase: 'Station hub alignment',
    summary:
      'Keep the orbital module launcher, routing, and window system synchronized with the updated story language.',
    progress: 67,
    signal: 'Hub registry synchronized',
    nextStep:
      'Add the Present Station to the dock and verify keyboard navigation.',
    tags: ['Routing', 'Interaction', 'Module hub'],
    pulse: [52, 58, 66, 71, 75, 79],
  },
  {
    id: 'scene-composition',
    code: 'PRJ-03',
    title: '3D scene composition pass',
    status: 'Steady',
    phase: 'Atmospheric staging',
    summary:
      'Use the space scene as a framing device rather than spectacle, preserving clarity under motion.',
    progress: 54,
    signal: 'Lighting simplified, depth cues preserved',
    nextStep:
      'Profile the hero scene on a mid-range device and reduce visual noise where possible.',
    tags: ['Three.js', 'Performance', 'Atmosphere'],
    pulse: [44, 49, 57, 55, 61, 65],
  },
]

export const learningGoals = [
  {
    id: 'react-orchestration',
    code: 'LRN-01',
    title: 'Modern React orchestration',
    focus:
      'useEffectEvent, transition boundaries, and state choreography for richer screens.',
    progress: 76,
    cadence: '3 sessions this week',
    nextMilestone: 'Reduce unnecessary rerenders in the station pages.',
  },
  {
    id: 'motion-grammar',
    code: 'LRN-02',
    title: 'Motion grammar',
    focus:
      'Subtle GSAP sequences, deliberate pacing, and entrance timing that supports reading.',
    progress: 61,
    cadence: '2 passes remaining',
    nextMilestone: 'Unify reveal rhythm across the mission pages.',
  },
  {
    id: 'spatial-composition',
    code: 'LRN-03',
    title: 'Spatial composition',
    focus:
      'Three.js scene staging, light discipline, and performance budgets for the hero space.',
    progress: 48,
    cadence: 'Weekly practice',
    nextMilestone: 'Profile the hero scene on a mobile viewport.',
  },
]

export const researchInterests = [
  {
    title: 'Documentary interface systems',
    status: 'Primary thread',
    body:
      'Studying interfaces that read like field notes and production logs instead of marketing pages.',
  },
  {
    title: 'Ambient telemetry',
    status: 'Active inquiry',
    body:
      'Exploring how to expose state, time, and progress without turning the layout into a dashboard.',
  },
  {
    title: 'Narrative motion',
    status: 'In analysis',
    body:
      'Testing motion that clarifies sequence and attention, especially when the page carries dense meaning.',
  },
]

export const githubActivity = {
  headline: 'Shipping cadence',
  streak: '12-day streak',
  note:
    'Recent commits centered on the NEXUS OS, the research archive, and this station.',
  metrics: [
    ['Commits', '18 this week'],
    ['Pull requests', '4 active'],
    ['Reviews', '5 merged'],
    ['Branches', '3 open'],
  ],
  series: [42, 58, 51, 66, 74, 62, 79, 68, 83, 71, 88, 76],
  recentSignals: [
    'Present Station logbook wired into navigation.',
    'Mission panels tuned for smaller screens.',
    'Scene lighting and copy passes underway.',
  ],
}

export const readingList = [
  {
    title: 'The Design of Everyday Things',
    status: 'Reading now',
    note:
      'A reminder that clarity is a feature of the interface itself, not just the content.',
  },
  {
    title: 'Refactoring UI',
    status: 'Revisiting',
    note:
      'Useful when hierarchy needs to be earned rather than decorated.',
  },
  {
    title: 'A Philosophy of Software Design',
    status: 'Queued',
    note: 'Supports the current focus on removing incidental complexity.',
  },
  {
    title: 'Designing Interfaces',
    status: 'In progress',
    note: 'A good reference for nested flows and dense systems.',
  },
]

export const focusAreas = [
  {
    label: 'Narrative hierarchy',
    value: '34%',
    note: 'Reinforcing story beats before ornament.',
  },
  {
    label: 'Responsive behavior',
    value: '29%',
    note: 'Keeping the logbook legible from mobile to desktop.',
  },
  {
    label: 'Performance budgets',
    value: '22%',
    note: 'Holding motion and 3D scenes to a restrained budget.',
  },
  {
    label: 'Content systems',
    value: '15%',
    note: 'Making data easy to revise without redesigning the page.',
  },
]

export const missionLog = [
  {
    time: '08:20',
    label: 'Station sync',
    note:
      'Updated the live work inventory and aligned the module registry.',
  },
  {
    time: '10:05',
    label: 'Story pass',
    note:
      'Refined page pacing so the active state reads before the detail panels.',
  },
  {
    time: '13:40',
    label: 'Research note',
    note:
      'Captured ongoing themes around documentary design and ambient telemetry.',
  },
  {
    time: '18:15',
    label: 'Deployment watch',
    note: 'Left room for follow-up refinements after validation.',
  },
]