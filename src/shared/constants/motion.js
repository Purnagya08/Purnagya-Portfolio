export const NEXUS_EASING = {
  enter: [0.16, 1, 0.3, 1],
  transition: [0.65, 0, 0.35, 1],
  snap: [0.2, 0.8, 0.2, 1],
}

export const NEXUS_DURATION = {
  instant: 0.16,
  fast: 0.24,
  standard: 0.42,
  cinematic: 0.8,
}

export const NEXUS_MOTION = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: NEXUS_DURATION.standard,
      ease: NEXUS_EASING.enter,
    },
  },
  panel: {
    initial: { opacity: 0, scale: 0.98, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: 8 },
    transition: {
      duration: NEXUS_DURATION.standard,
      ease: NEXUS_EASING.enter,
    },
  },
}
