import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGsapReveal(options = {}) {
  const elementRef = useRef(null)
  const { delay = 0, distance = 24 } = options

  useEffect(() => {
    const animation = gsap.fromTo(
      elementRef.current,
      { autoAlpha: 0, y: distance },
      { autoAlpha: 1, delay, duration: 0.8, ease: 'power3.out', y: 0 },
    )

    return () => animation.revert()
  }, [delay, distance])

  return elementRef
}
