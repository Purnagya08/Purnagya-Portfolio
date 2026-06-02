import { useMemo } from 'react'
import { motion } from 'framer-motion'

export function TrainingFacilityPage() {
  const paragraphs = useMemo(
    () => [
      'The 365-day engineering training archive.',
      'This module is a placeholder to keep routing stable until the training pages are finalized.',
    ],
    [],
  )

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      className="mx-auto w-full max-w-3xl px-(--spacing-gutter) py-10"
    >
      <h1 className="font-display text-heading-lg font-semibold text-starlight-50">
        Training Facility
      </h1>
      <div className="mt-4 space-y-3 font-mono text-body-sm text-starlight-300">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </motion.div>
  )
}

