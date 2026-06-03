import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

// ─── Engine glow sprite ────────────────────────────────────────
function EngineGlow({ position, color, size }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const pulse = 0.8 + Math.sin(t * 6 + position[0]) * 0.2
    ref.current.scale.setScalar(pulse)
    ref.current.material.opacity = 0.6 + Math.sin(t * 8) * 0.2
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// ─── Engine exhaust cone ──────────────────────────────────────
function ExhaustCone({ position, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.material.opacity = 0.3 + Math.sin(t * 10) * 0.1
    ref.current.scale.x = 0.9 + Math.sin(t * 7) * 0.1
    ref.current.scale.y = 0.9 + Math.cos(t * 5) * 0.1
  })
  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.18, 1.2, 8, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// ─── The spacecraft body (procedural geometry) ────────────────
function SpacecraftMesh() {
  return (
    <group>
      {/* Main fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.38, 2.4, 12]} />
        <meshStandardMaterial color="#1a2540" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.22, 0.9, 12]} />
        <meshStandardMaterial color="#243060" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Cockpit glass */}
      <mesh position={[0, 1.0, 0.15]}>
        <sphereGeometry args={[0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#38b8d8" metalness={0.1} roughness={0} transparent opacity={0.7} emissive="#1a6080" emissiveIntensity={0.5} />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.8, -0.3, 0]} rotation={[0, 0, Math.PI * 0.08]}>
        <boxGeometry args={[1.2, 0.06, 0.6]} />
        <meshStandardMaterial color="#151e38" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Left wing tip */}
      <mesh position={[-1.3, -0.35, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.3, 0.05, 0.35]} />
        <meshStandardMaterial color="#1a2548" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.8, -0.3, 0]} rotation={[0, 0, -Math.PI * 0.08]}>
        <boxGeometry args={[1.2, 0.06, 0.6]} />
        <meshStandardMaterial color="#151e38" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right wing tip */}
      <mesh position={[1.3, -0.35, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.05, 0.35]} />
        <meshStandardMaterial color="#1a2548" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Tail fin */}
      <mesh position={[0, -0.8, -0.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.06, 0.6, 0.5]} />
        <meshStandardMaterial color="#1a2540" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Engine nacelle left */}
      <mesh position={[-0.55, -0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 8]} />
        <meshStandardMaterial color="#0d1525" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Engine nacelle right */}
      <mesh position={[0.55, -0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 8]} />
        <meshStandardMaterial color="#0d1525" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Gold accent stripe */}
      <mesh position={[0, 0.2, 0.22]}>
        <boxGeometry args={[0.04, 1.6, 0.03]} />
        <meshStandardMaterial color="#c9a84c" metalness={1} roughness={0} emissive="#c9a84c" emissiveIntensity={0.4} />
      </mesh>

      {/* Nav lights */}
      <mesh position={[-1.4, -0.35, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      <mesh position={[1.4, -0.35, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#44ff88" />
      </mesh>

      {/* Engine glow & exhaust */}
      <EngineGlow position={[-0.55, -1.05, 0]} color="#38b8d8" size={0.12} />
      <EngineGlow position={[0.55,  -1.05, 0]} color="#38b8d8" size={0.12} />
      <EngineGlow position={[-0.55, -1.05, 0]} color="#7dd8f0" size={0.22} />
      <EngineGlow position={[0.55,  -1.05, 0]} color="#7dd8f0" size={0.22} />
      <ExhaustCone position={[-0.55, -1.3, 0]} color="#38b8d8" />
      <ExhaustCone position={[0.55,  -1.3, 0]} color="#38b8d8" />

      {/* Point lights for dramatic lighting */}
      <pointLight position={[0, -1, 0]}    color="#38b8d8" intensity={2}   distance={8} />
      <pointLight position={[0, 0.5, 0.3]} color="#c9a84c" intensity={0.8} distance={5} />
    </group>
  )
}

// ─── Spacecraft with flight path ──────────────────────────────
export default function Spacecraft({ orbitRadius = 18, orbitSpeed = 0.08, yOffset = 2, tilt = 0.3 }) {
  const groupRef  = useRef()
  const bodyRef   = useRef()
  const trailRef  = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (!groupRef.current) return

    // Elliptical orbit
    const angle = t * orbitSpeed
    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius * 0.55
    const y = yOffset + Math.sin(t * 0.4) * 1.5

    groupRef.current.position.set(x, y, z)

    // Always face direction of travel (tangent to orbit)
    const nextAngle = angle + 0.01
    const nx = Math.cos(nextAngle) * orbitRadius
    const nz = Math.sin(nextAngle) * orbitRadius * 0.55
    groupRef.current.lookAt(nx, y, nz)
    groupRef.current.rotation.x += tilt

    // Gentle body roll / wobble
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(t * 0.7) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Trail */}
      <Trail
        width={1.5}
        length={12}
        color={new THREE.Color('#38b8d8')}
        attenuation={(w) => w * w}
        decay={1}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial />
        </mesh>
      </Trail>

      {/* Body */}
      <group ref={bodyRef}>
        <SpacecraftMesh />
      </group>
    </group>
  )
}
