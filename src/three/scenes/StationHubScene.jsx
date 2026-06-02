import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

// Minimal implementation to satisfy dynamic import used by NexusOsPage.
// Replace with full 3D station hub scene when available.
export function StationHubScene({ modules }) {
  return (
    <div className="relative h-[60vh] w-full">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={2} />
        </Canvas>
      </Suspense>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-nexus-md border border-(--glass-border) bg-void-950/40 px-6 py-4 text-center">
          <p className="font-mono text-sm text-starlight-300">
            Station hub ready. Modules: {modules?.length ?? 0}
          </p>
        </div>
      </div>
    </div>
  )
}

