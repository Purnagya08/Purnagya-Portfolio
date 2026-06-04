import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useNexusStore } from '../store/nexusStore';

// Mapping of module IDs to music file URLs (adjust paths as needed)
const ZONE_MUSIC = {
  origins: '/audio/zone/origins.mp3',
  training: '/audio/zone/training.mp3',
  challenges: '/audio/zone/challenges.mp3',
  missions: '/audio/zone/missions.mp3',
  research: '/audio/zone/research.mp3',
  achievements: '/audio/zone/achievements.mp3',
  present: '/audio/zone/present.mp3',
  future: '/audio/zone/future.mp3',
  nexusai: '/audio/zone/nexusai.mp3',
};

/**
 * Hook that manages background music per zone (module).
 * It lazily creates Howl instances, cross‑fades when the active module changes,
 * and respects the global audioEnabled / audioVolume settings.
 */
export function useZoneMusic() {
  const { currentModule, audioEnabled, audioVolume } = useNexusStore();
  const howlsRef = useRef({});

  // Helper to get or create a Howl for a given zone
  const getHowl = (zone) => {
    if (!ZONE_MUSIC[zone]) return null;
    if (!howlsRef.current[zone]) {
      howlsRef.current[zone] = new Howl({
        src: ZONE_MUSIC[zone],
        loop: true,
        volume: audioVolume,
        mute: !audioEnabled,
        html5: true,
      });
    }
    return howlsRef.current[zone];
  };

  // Cross‑fade when module changes
  useEffect(() => {
    const zone = currentModule || 'hub'; // fallback music if desired
    const activeHowl = getHowl(zone);
    if (!activeHowl) return;
    activeHowl.play();
    // Fade out other zones
    Object.entries(howlsRef.current).forEach(([key, howl]) => {
      if (key !== zone && howl.playing()) {
        howl.fade(howl.volume(), 0, 800);
        setTimeout(() => howl.stop(), 850);
      }
    });
  }, [currentModule, audioEnabled, audioVolume]);

  // React to mute/volume toggles
  useEffect(() => {
    Object.values(howlsRef.current).forEach((howl) => {
      howl.mute(!audioEnabled);
      howl.volume(audioVolume);
    });
  }, [audioEnabled, audioVolume]);

  // Optional public API
  return {
    enable: () => useNexusStore.getState().setAudioEnabled(true),
    disable: () => useNexusStore.getState().setAudioEnabled(false),
    setVolume: (v) => useNexusStore.getState().setAudioVolume(v),
  };
}

export default useZoneMusic;
