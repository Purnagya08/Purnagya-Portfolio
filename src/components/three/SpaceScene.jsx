import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

import Starfield      from './Starfield'
import Nebula         from './Nebula'
import Spacecraft     from './Spacecraft'
import Planet         from './Planet'
import NexusStation   from './NexusStation'
import { useNexusStore } from '../../store/nexusStore'

function CameraRig() {
  const { camera } = useThree()
  const { cursorPos, warpActive } = useNexusStore()
  const targetRef = useRef({ x: 0, y: 0 })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const driftX = Math.sin(t * 0.06) * 2.5
    const driftY = Math.cos(t * 0.04) * 1.2
    const cx = ((cursorPos.x / window.innerWidth)  - 0.5) * 1.5
    const cy = ((cursorPos.y / window.innerHeight) - 0.5) * 1.0
    targetRef.current.x += (cx - targetRef.current.x) * 0.02
    targetRef.current.y += (cy - targetRef.current.y) * 0.02
    camera.position.x = driftX + targetRef.current.x
    camera.position.y = driftY - targetRef.current.y
    camera.position.z = warpActive ? camera.position.z - 2 : 20
    camera.lookAt(0, 0, 0)
  })

  return null
}

function SpaceLights() {
  return (
    <>
      <ambientLight intensity={0.08} color="#0a1830" />
      <directionalLight position={[50, 30, 20]} intensity={0.6} color="#e8d8c0" castShadow={false} />
      <pointLight position={[-40, 20, -30]} color="#1a4080" intensity={0.4} distance={200} />
      <pointLight position={[30, -20, 10]}  color="#c9a84c" intensity={0.2} distance={100} />
    </>
  )
}

function SpaceEffects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.8} luminanceThreshold={0.3} luminanceSmoothing={0.9} blendFunction={BlendFunction.ADD} />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new Vector2(0.0008, 0.0008)} />
      <Vignette eskil={false} offset={0.3} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

function WarpEffect() {
  const { warpActive } = useNexusStore()
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    ref.current.visible = warpActive
  })

  return (
    <group ref={ref} visible={false}>
      {Array.from({ length: 40 }, (_, i) => {
        const angle = (i / 40) * Math.PI * 2
        const r = 1 + Math.random() * 3
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, -5]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.02, 0.02, 30 + Math.random() * 20]} />
            <meshBasicMaterial color="#38b8d8" transparent opacity={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

function SceneFallback() { return null }

export default function SpaceScene({ style = {} }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const isLowEnd = typeof window !== 'undefined' &&
    (navigator.hardwareConcurrency <= 4 ||
     (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 4))

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: isMobile ? 75 : 60, near: 0.1, far: 2000 }}
      gl={{
        antialias:        !isMobile,
        alpha:            false,
        powerPreference:  isMobile ? 'default' : 'high-performance',
        toneMapping:      3,
        toneMappingExposure: 0.8,
      }}
      style={{ position: 'fixed', inset: 0, background: '#02040c', ...style }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      frameloop={isLowEnd ? 'demand' : 'always'}
    >
      <color attach="background" args={['#02040c']} />
      <fog attach="fog" args={['#02040c', isMobile ? 60 : 80, 500]} />

      <SpaceLights />
      <CameraRig />

      <Suspense fallback={<SceneFallback />}>
        <Starfield />
        {!isMobile && <Nebula />}
        <Planet />
        <NexusStation />
        <Spacecraft orbitRadius={18} orbitSpeed={0.07}  yOffset={2}  tilt={0.25} />
        {!isMobile && <Spacecraft orbitRadius={26} orbitSpeed={-0.045} yOffset={-3} tilt={-0.2} />}
        <WarpEffect />
        {!isMobile && !isLowEnd && <SpaceEffects />}
      </Suspense>
    </Canvas>
  )
}
