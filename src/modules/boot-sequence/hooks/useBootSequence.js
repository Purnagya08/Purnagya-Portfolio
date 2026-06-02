import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  BOOT_DURATION,
  bootOperations,
} from '@modules/boot-sequence/data/bootSequence'

const EXIT_START = 5.85

export function useBootSequence({ onComplete }) {
  const rootRef = useRef(null)
  const lineRefs = useRef([])
  const progressRefs = useRef([])
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const timeScale = reduceMotion ? 5 : 1
    const timeline = gsap.timeline()
    const progressState = { value: 0 }

    timeline.to(progressState, {
      duration: BOOT_DURATION - 0.25,
      ease: 'none',
      onUpdate: () => setProgress(Math.round(progressState.value)),
      value: 100,
    })

    bootOperations.forEach((operation, index) => {
      const line = lineRefs.current[index]
      const progressBar = progressRefs.current[index]
      const typingState = { characters: 0 }

      timeline
        .set(line, { autoAlpha: 1 }, operation.start)
        .to(
          typingState,
          {
            characters: operation.label.length,
            duration: operation.duration * 0.62,
            ease: 'none',
            onUpdate: () => {
              line.textContent = operation.label.slice(
                0,
                Math.round(typingState.characters),
              )
            },
          },
          operation.start,
        )
        .to(
          progressBar,
          {
            duration: operation.duration,
            ease: 'power2.inOut',
            scaleX: 1,
          },
          operation.start + 0.1,
        )
        .set(
          line,
          { color: 'var(--color-signal-sage)' },
          operation.start + operation.duration,
        )
    })

    timeline.call(() => setIsExiting(true), [], EXIT_START)
    timeline.call(onComplete, [], BOOT_DURATION)
    timeline.timeScale(timeScale)

    return () => timeline.kill()
  }, [onComplete])

  return {
    isExiting,
    lineRefs,
    progress,
    progressRefs,
    rootRef,
  }
}
