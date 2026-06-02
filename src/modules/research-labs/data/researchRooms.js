export const researchRooms = [
  {
    id: 'ml-lab',
    code: 'LAB-ML',
    room: 'Machine Learning Lab',
    focus: 'Modeling and training practice',
    roomsCount: '04 benches',
    story:
      'A disciplined environment for experimentation. Hypotheses are recorded, parameters are tuned with care, and each improvement is preserved as evidence—not inspiration.',
    equipment:
      'Feature instrumentation, training schedules, evaluation protocols, and reproducibility checks.',
    questions: [
      'What signal indicates genuine generalization?',
      'Which metrics represent mission success?',
      'How do we prevent “good on paper” from becoming “unstable in reality”?',
    ],
  },
  {
    id: 'cv-lab',
    code: 'LAB-CV',
    room: 'Computer Vision Lab',
    focus: 'Perception pipelines and measurement',
    roomsCount: '03 bays',
    story:
      'The lab treats perception as an engineering problem. It measures errors, isolates failure modes, and documents the practical path from data to reliable outputs.',
    equipment:
      'Dataset curation, augmentation strategy, evaluation by coverage, and failure-case review.',
    questions: [
      'What do our errors look like—systematic or random?',
      'Which datasets represent deployment reality?',
      'How do we verify robustness under controlled variation?',
    ],
  },
  {
    id: 'nlp-lab',
    code: 'LAB-NLP',
    room: 'NLP Lab',
    focus: 'Language understanding as protocol',
    roomsCount: '02 suites',
    story:
      'Text becomes a structured signal. The lab emphasizes careful definitions, stable evaluation, and traceable transformations from raw language to usable outcomes.',
    equipment:
      'Normalization rules, annotation guidance, task-specific evaluation, and error taxonomy.',
    questions: [
      'What is the task definition in operational terms?',
      'How do we score correctness beyond fluency?',
      'Which categories of errors should we eliminate first?',
    ],
  },
  {
    id: 'experimental-zone',
    code: 'LAB-XZ',
    room: 'Experimental Zone',
    focus: 'Controlled research under constraint',
    roomsCount: '01 enclosure',
    story:
      'A reserved space for method exploration. Experiments run with explicit constraints and documented assumptions, ensuring discoveries can be evaluated and reused.',
    equipment:
      'A/B study design, ablation reasoning, instrumentation planning, and result archiving.',
    questions: [
      'Which assumptions are we testing—not merely assuming?',
      'What would falsify this direction?',
      'How do we record results so others can reproduce them?',
    ],
  },
]

export const researchSummary = [
  ['Center type', 'Scientific research'],
  ['Labs', '04 operational'],
  ['Workflow', 'Evidence-first'],
  ['Archive', 'Traceable outcomes'],
]

export const publicationThemes = [
  {
    title: 'Evaluation protocols',
    body:
      'Benchmarks are treated as instruments. We design measurement that maps to mission objectives and exposes what fails.',
  },
  {
    title: 'Reproducibility records',
    body:
      'Every run becomes a record: settings, data versions, and assumptions. Results are archived so future work starts with clarity.',
  },
  {
    title: 'Failure-case mapping',
    body:
      'The lab prioritizes error taxonomy. Not to assign blame, but to make improvement decisions measurable.',
  },
]

