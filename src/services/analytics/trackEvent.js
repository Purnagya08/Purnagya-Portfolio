export function trackEvent(name, properties = {}) {
  if (!import.meta.env.PROD) {
    console.info('[analytics]', name, properties)
  }
}
