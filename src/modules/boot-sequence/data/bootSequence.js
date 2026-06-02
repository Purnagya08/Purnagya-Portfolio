export const BOOT_DURATION = 6.8

export const bootOperations = [
  {
    id: 'kernel',
    label: 'Initializing NEXUS...',
    meta: 'CORE SYSTEM',
    start: 0.45,
    duration: 0.95,
  },
  {
    id: 'memory',
    label: 'Loading Memory Archive...',
    meta: 'ARCHIVE 07',
    start: 1.65,
    duration: 1.05,
  },
  {
    id: 'logs',
    label: 'Synchronizing Captain Logs...',
    meta: 'LOGBOOK',
    start: 2.95,
    duration: 1.05,
  },
  {
    id: 'station',
    label: 'Connecting to Station...',
    meta: 'UPLINK',
    start: 4.3,
    duration: 1.05,
  },
]
