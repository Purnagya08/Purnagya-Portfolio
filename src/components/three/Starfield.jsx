import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Star layer (one BufferGeometry per layer for perf) ────────
function StarLayer({ count, spread, size, color, speed, depth }) {
  const ref = useRef()

  const { positions, opacities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const opacities = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const r = spread * (0.3 + Math.random() * 0.7)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      opacities[i] = 0.3 + Math.random() * 0.7
    }
    return { positions, opacities }
  }, [count, spread])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += speed * 0.0001
    ref.current.rotation.x += speed * 0.00003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[opacities, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Shooting star ────────────────────────────────────────────
function ShootingStar() {
  const ref = useRef()
  const data = useMemo(() => ({
    startX: (Math.random() - 0.5) * 200,
    startY: 30 + Math.random() * 40,
    startZ: -50 - Math.random() * 100,
    dx: -0.8 - Math.random() * 0.4,
    dy: -0.5 - Math.random() * 0.3,
    speed: 0.3 + Math.random() * 0.4,
    life: 0,
    maxLife: 80 + Math.random() * 60,
    reset: Math.random() * 400,
  }), [])

  const positions = useMemo(() => new Float32Array([0, 0, 0, -8, -4, 0]), [])

  useFrame(() => {
    if (!ref.current) return
    data.life++
    if (data.life < data.reset) return

    const t = (data.life - data.reset) / data.maxLife
    if (t > 1) {
      data.life = 0
      data.reset = Math.random() * 200
      return
    }

    ref.current.position.x = data.startX + data.dx * (data.life - data.reset) * data.speed
    ref.current.position.y = data.startY + data.dy * (data.life - data.reset) * data.speed * 0.5
    ref.current.position.z = data.startZ

    const fade = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1
    ref.current.material.opacity = fade * 0.9
  })

  return (
    <line ref={ref} position={[data.startX, data.startY, data.startZ]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </line>
  )
}

// ─── Main Starfield ───────────────────────────────────────────
export default function Starfield() {
  return (
    <group>
      {/* Far background stars — tiny, dense */}
      <StarLayer count={4000} spread={800} size={0.3}  color="#ffffff" speed={0.1} />
      {/* Mid layer — slightly larger, blueish */}
      <StarLayer count={2000} spread={400} size={0.5}  color="#aaddff" speed={0.2} />
      {/* Near layer — larger, warm tint */}
      <StarLayer count={800}  spread={200} size={0.8}  color="#ffe8cc" speed={0.3} />
      {/* Feature stars — big, bright */}
      <StarLayer count={150}  spread={300} size={1.5}  color="#ffffff"  speed={0.15} />
      {/* Gold dust — rare sparkle */}
      <StarLayer count={60}   spread={250} size={2.0}  color="#c9a84c" speed={0.08} />

      {/* Shooting stars */}
      {Array.from({ length: 6 }, (_, i) => <ShootingStar key={i} />)}
    </group>
  )
}
