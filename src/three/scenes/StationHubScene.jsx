import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Edges, Environment } from '@react-three/drei'
import gsap from 'gsap'
import { NEXUS_COLORS } from '@shared/constants/designTokens'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'

const HUB_RADIUS = 3.15
const PANEL_RADIUS = 3.55

const toneColors = {
  blue: NEXUS_COLORS.blue,
  brass: NEXUS_COLORS.brass,
  copper: NEXUS_COLORS.copper,
  sage: NEXUS_COLORS.sage,
  steel: NEXUS_COLORS.steel,
}

export function StationHubScene({ activeModuleId, modules, onSelect }) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto absolute inset-0 -z-10"
    >
      <Canvas
        camera={{ fov: 42, position: [0, 2.25, 7.2] }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        performance={{ min: 0.65 }}
      >
        <color args={[NEXUS_COLORS.void]} attach="background" />
        <fog args={[NEXUS_COLORS.void, 9, 22]} attach="fog" />
        <Suspense fallback={null}>
          <StationWorld
            activeModuleId={activeModuleId}
            modules={modules}
            onSelect={onSelect}
            reduceMotion={reduceMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function StationWorld({ activeModuleId, modules, onSelect, reduceMotion }) {
  const stationRef = useRef(null)
  const panelLayout = useMemo(
    () =>
      modules.map((module, index) => {
        const angle = (index / modules.length) * Math.PI * 2 - Math.PI / 2

        return {
          angle,
          module,
          position: [
            Math.cos(angle) * PANEL_RADIUS,
            0.55,
            Math.sin(angle) * PANEL_RADIUS,
          ],
        }
      }),
    [modules],
  )
  const activePanel =
    panelLayout.find(({ module }) => module.id === activeModuleId) ??
    panelLayout[0]

  useFrame((_, delta) => {
    if (!reduceMotion && stationRef.current) {
      stationRef.current.rotation.y += delta * 0.035
    }
  })

  return (
    <>
      <ambientLight color="#cfc8ba" intensity={0.48} />
      <directionalLight color="#f2efe7" intensity={1.8} position={[4, 5, 6]} />
      <pointLight color="#c4a96b" intensity={0.34} position={[-3, 1.4, -2]} />
      <pointLight color="#7f99ad" intensity={0.22} position={[3.5, 0.6, 3]} />

      <CameraRig activePanel={activePanel} reduceMotion={reduceMotion} />

      <group ref={stationRef}>
        <CentralStation />
        <ArchiveRing />
        <ObservationArms />
      </group>

      <NavigationRing
        activeModuleId={activeModuleId}
        modules={modules}
        onSelect={onSelect}
        panelLayout={panelLayout}
      />

      <ContactShadows
        blur={2.8}
        far={7}
        opacity={0.22}
        position={[0, -1.05, 0]}
        scale={8}
      />
      <Environment preset="warehouse" />
    </>
  )
}

function CameraRig({ activePanel, reduceMotion }) {
  const { camera } = useThree()
  const targetRef = useRef({ x: 0, y: 0.15, z: 0 })

  useEffect(() => {
    if (!activePanel) {
      return undefined
    }

    const [x, , z] = activePanel.position
    const cameraTarget = {
      x: x * 0.42,
      y: reduceMotion ? 2.1 : 2.35,
      z: z * 0.42 + 6.15,
    }
    const lookTarget = {
      x: x * 0.12,
      y: 0.12,
      z: z * 0.12,
    }
    const timeline = gsap.timeline({
      defaults: {
        duration: reduceMotion ? 0.2 : 1.25,
        ease: 'power3.inOut',
      },
    })

    timeline.to(camera.position, cameraTarget, 0)
    timeline.to(targetRef.current, lookTarget, 0)

    return () => timeline.kill()
  }, [activePanel, camera, reduceMotion])

  useFrame(() => {
    camera.lookAt(targetRef.current.x, targetRef.current.y, targetRef.current.z)
  })

  return null
}

function CentralStation() {
  return (
    <group>
      <mesh position={[0, -0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.45, 2.72, 0.18, 80]} />
        <meshStandardMaterial
          color={NEXUS_COLORS.hull}
          metalness={0.72}
          roughness={0.48}
        />
      </mesh>

      <mesh position={[0, -0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.12, 0.035, 8, 120]} />
        <meshStandardMaterial
          color={NEXUS_COLORS.brass}
          metalness={0.8}
          roughness={0.36}
        />
      </mesh>

      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[1.1, 1.18, 0.62, 72]} />
        <meshStandardMaterial
          color="#161d27"
          metalness={0.7}
          roughness={0.42}
        />
      </mesh>

      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.68, 0.92, 0.46, 72]} />
        <meshStandardMaterial
          color="#202936"
          metalness={0.82}
          roughness={0.34}
        />
      </mesh>

      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.92, 0.025, 8, 96]} />
        <meshStandardMaterial
          color={NEXUS_COLORS.starlight}
          metalness={0.5}
          roughness={0.42}
        />
      </mesh>
    </group>
  )
}

function ArchiveRing() {
  const bays = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2

        return {
          angle,
          key: `archive-bay-${index}`,
          position: [
            Math.cos(angle) * HUB_RADIUS,
            -0.18,
            Math.sin(angle) * HUB_RADIUS,
          ],
        }
      }),
    [],
  )

  return (
    <group>
      {bays.map((bay) => (
        <mesh
          key={bay.key}
          position={bay.position}
          rotation={[0, -bay.angle, 0]}
        >
          <boxGeometry args={[0.64, 0.5, 0.08]} />
          <meshStandardMaterial
            color="#202936"
            metalness={0.72}
            roughness={0.5}
          />
          <Edges color="#58616b" />
        </mesh>
      ))}
    </group>
  )
}

function ObservationArms() {
  const arms = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2

        return {
          angle,
          key: `observation-arm-${index}`,
        }
      }),
    [],
  )

  return (
    <group>
      {arms.map((arm) => (
        <group key={arm.key} rotation={[0, arm.angle, 0]}>
          <mesh position={[1.85, -0.24, 0]}>
            <boxGeometry args={[2.15, 0.12, 0.16]} />
            <meshStandardMaterial
              color="#2c3644"
              metalness={0.78}
              roughness={0.44}
            />
          </mesh>
          <mesh position={[2.9, -0.15, 0]}>
            <boxGeometry args={[0.4, 0.36, 0.42]} />
            <meshStandardMaterial
              color="#161d27"
              metalness={0.72}
              roughness={0.48}
            />
            <Edges color="#79828c" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function NavigationRing({ activeModuleId, onSelect, panelLayout }) {
  return (
    <group>
      {panelLayout.map(({ angle, module, position }) => (
        <NavigationPanel
          angle={angle}
          isActive={activeModuleId === module.id}
          key={module.id}
          module={module}
          onSelect={onSelect}
          position={position}
        />
      ))}
    </group>
  )
}

function NavigationPanel({ angle, isActive, module, onSelect, position }) {
  const panelRef = useRef(null)
  const color = toneColors[module.tone] ?? NEXUS_COLORS.steel

  useFrame((state) => {
    if (panelRef.current) {
      panelRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.45 + angle) * 0.018
    }
  })

  return (
    <group
      onClick={() => onSelect(module.id)}
      position={position}
      ref={panelRef}
      rotation={[0, -angle + Math.PI / 2, 0]}
    >
      <mesh>
        <boxGeometry args={[0.98, 0.52, 0.025]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.08 : 0.025}
          metalness={0.38}
          opacity={isActive ? 0.34 : 0.18}
          roughness={0.62}
          transparent
        />
        <Edges color={isActive ? NEXUS_COLORS.brass : '#58616b'} />
      </mesh>
      <mesh position={[0, 0.11, 0.03]}>
        <boxGeometry args={[0.42, 0.018, 0.012]} />
        <meshStandardMaterial
          color={isActive ? NEXUS_COLORS.starlight : NEXUS_COLORS.steel}
          metalness={0.42}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, -0.025, 0.03]}>
        <boxGeometry args={[0.62, 0.012, 0.012]} />
        <meshStandardMaterial
          color={isActive ? NEXUS_COLORS.brass : '#79828c'}
          metalness={0.42}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, -0.105, 0.03]}>
        <boxGeometry args={[0.28, 0.012, 0.012]} />
        <meshStandardMaterial
          color={isActive ? NEXUS_COLORS.brass : '#58616b'}
          metalness={0.42}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
