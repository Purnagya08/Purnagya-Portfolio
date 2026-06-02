import knowledgeBase from '@modules/nexus-ai/data/nexusKnowledgeBase.json'

const sectionOrder = [
  ['memories', 'Memories'],
  ['projects', 'Projects'],
  ['achievements', 'Achievements'],
  ['learningJourney', 'Learning Journey'],
  ['futureGoals', 'Future Goals'],
]

const curatedIntents = [
  {
    pattern: /\bdevora\b/i,
    section: 'projects',
    itemId: 'devora',
    heading: 'Archive record // Devora',
  },
  {
    pattern: /hardest\s+challenge|toughest\s+challenge|hardest\s+part/i,
    section: 'memories',
    itemId: 'hardest-challenge',
    heading: 'Archive record // Hardest challenge',
  },
  {
    pattern: /why\s+java|reason\s+for\s+java|choose\s+java/i,
    section: 'memories',
    itemId: 'why-java',
    heading: 'Archive record // Why Java',
  },
  {
    pattern: /show\s+achievements|achievements|milestones/i,
    section: 'achievements',
    heading: 'Archive index // Achievements',
  },
  {
    pattern: /future\s+vision|future\s+goals|long\s*term/i,
    section: 'futureGoals',
    itemId: 'future-vision',
    heading: 'Archive record // Future vision',
  },
]

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim()
}

function tokenize(text) {
  return normalize(text)
    .split(/\s+/)
    .filter((token) => token.length > 1)
}

function recordSearchText(record) {
  return normalize(
    [record.title, record.summary, record.details, ...(record.tags ?? [])].join(
      ' ',
    ),
  )
}

function scoreRecord(queryTokens, record) {
  const text = recordSearchText(record)
  let score = 0

  for (const token of queryTokens) {
    if (text.includes(token)) {
      score += 1
    }
  }

  if (text.includes(normalize(record.title))) {
    score += 0.5
  }

  return score
}

function allRecords() {
  const records = []

  for (const [sectionKey, sectionLabel] of sectionOrder) {
    for (const item of knowledgeBase[sectionKey] ?? []) {
      records.push({ ...item, sectionKey, sectionLabel })
    }
  }

  return records
}

function pickIntent(query) {
  return curatedIntents.find((intent) => intent.pattern.test(query))
}

function indexOverview(sectionKey) {
  const sectionItems = knowledgeBase[sectionKey] ?? []

  return {
    heading: `Archive index // ${sectionOrder.find(([key]) => key === sectionKey)?.[1] ?? 'Section'}`,
    narrative:
      'Curator note: multiple records match this request. The key entries are listed below for directed exploration.',
    entries: sectionItems.slice(0, 4).map((item) => ({
      title: item.title,
      summary: item.summary,
      source: sectionKey,
      tags: item.tags ?? [],
    })),
    confidence: 0.92,
  }
}

function singleRecordResponse(record, heading) {
  return {
    heading: heading ?? `Archive record // ${record.title}`,
    narrative: record.details,
    entries: [
      {
        title: record.title,
        summary: record.summary,
        source: record.sectionLabel,
        tags: record.tags ?? [],
      },
    ],
    confidence: 0.97,
  }
}

export function getKnowledgeSourceStats() {
  return sectionOrder.map(([sectionKey, sectionLabel]) => ({
    key: sectionKey,
    label: sectionLabel,
    count: (knowledgeBase[sectionKey] ?? []).length,
  }))
}

export function answerArchiveQuery(query) {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return {
      heading: 'Archive curator ready',
      narrative:
        'Submit a question and the curator will retrieve relevant records from the local archive.',
      entries: [],
      confidence: 1,
    }
  }

  const intent = pickIntent(trimmedQuery)
  if (intent) {
    if (intent.itemId) {
      const record = (knowledgeBase[intent.section] ?? []).find(
        (item) => item.id === intent.itemId,
      )

      if (record) {
        return singleRecordResponse(
          {
            ...record,
            sectionLabel:
              sectionOrder.find(([key]) => key === intent.section)?.[1] ??
              intent.section,
          },
          intent.heading,
        )
      }
    }

    return indexOverview(intent.section)
  }

  const tokens = tokenize(trimmedQuery)
  const ranked = allRecords()
    .map((record) => ({ record, score: scoreRecord(tokens, record) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (ranked.length === 0) {
    return {
      heading: 'Archive gap detected',
      narrative:
        'No direct match found in the current records. Try asking by project name, challenge, technology choice, achievements, or future vision.',
      entries: [],
      confidence: 0.35,
    }
  }

  return {
    heading: 'Curated archive response',
    narrative:
      'The records below are the closest archival matches for your question.',
    entries: ranked.map(({ record }) => ({
      title: record.title,
      summary: record.summary,
      source: record.sectionLabel,
      tags: record.tags ?? [],
    })),
    confidence: 0.75,
  }
}