export const terminalCommands = [
  {
    command: 'help',
    description: 'List available commands and intent.',
  },
  {
    command: 'journey',
    description: 'Show a guided summary of the engineering journey.',
    route: '/nexus/present',
  },
  {
    command: 'devora',
    description: 'Open records related to the Devora project.',
    route: '/nexus/projects',
  },
  {
    command: 'java',
    description: 'Explain why Java became foundational.',
    route: '/nexus/training',
  },
  {
    command: 'achievements',
    description: 'Display key milestones and completed achievements.',
    route: '/nexus/training',
  },
  {
    command: 'future',
    description: 'Inspect long-horizon future direction.',
    route: '/nexus/future',
  },
  {
    command: 'resume',
    description: 'Summarize current profile and resume context.',
    route: '/nexus/about',
  },
  {
    command: 'contact',
    description: 'Open communication channel details.',
    route: '/nexus/contact',
  },
]

const commandRecords = {
  achievements: {
    heading: 'Achievement ledger',
    lines: [
      '• Completed a 365-day technical training cycle with sustained execution.',
      '• Built and shipped the NEXUS multi-module archive portfolio system.',
      '• Established a repeatable evidence-first learning and documentation workflow.',
    ],
  },
  contact: {
    heading: 'Communication channel',
    lines: [
      'Preferred path: open the Contact module for channel details.',
      'Use this route for collaboration requests and mission discussions.',
    ],
  },
  devora: {
    heading: 'Project record // Devora',
    lines: [
      'Devora is documented as a mission-oriented project with traceable decisions.',
      'It focuses on disciplined product structure and engineering storytelling.',
      'Use route hint to inspect broader project context in Mission Archive.',
    ],
  },
  future: {
    heading: 'Future direction',
    lines: [
      'Next horizon includes advanced AI research, startup building, open source,',
      'large-scale systems, and technical leadership as a compounding trajectory.',
      'Route hint points to Future Galaxy for milestone and forecast detail.',
    ],
  },
  java: {
    heading: 'Why Java',
    lines: [
      'Java provided strong architectural discipline and clear object modeling.',
      'It remains foundational for backend reliability and scalable system thinking.',
      'Training records in the facility module capture the full progression.',
    ],
  },
  journey: {
    heading: 'Journey brief',
    lines: [
      'Origins established intent, training built discipline, and challenges forged resilience.',
      'Present Station tracks active operations while Future Galaxy maps long-horizon ambition.',
      'The journey is continuous, not a closed chapter.',
    ],
  },
  resume: {
    heading: 'Resume context',
    lines: [
      'Current role focus: creative engineer, immersive interfaces, evidence-first execution.',
      'Core strengths: systems thinking, structured storytelling, disciplined delivery.',
      'Open About for profile details and narrative alignment.',
    ],
  },
}

export const terminalShortcuts = [
  ['Tab', 'Accept top suggestion'],
  ['ArrowUp / ArrowDown', 'Traverse command history'],
  ['Ctrl+L', 'Clear terminal output'],
  ['Ctrl+K', 'Focus command input'],
]

export function getCommandRecord(command) {
  return commandRecords[command]
}

export function findCommand(input) {
  const normalized = input.trim().toLowerCase()
  return terminalCommands.find((item) => item.command === normalized) ?? null
}

export function getSuggestions(input) {
  const normalized = input.trim().toLowerCase()

  if (!normalized) {
    return terminalCommands.slice(0, 6)
  }

  return terminalCommands.filter((item) =>
    item.command.startsWith(normalized),
  )
}