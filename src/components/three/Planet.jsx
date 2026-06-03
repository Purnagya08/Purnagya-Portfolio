import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Make a procedural planet surface texture
function makePlanetTexture(size = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')

  // Base deep ocean color
  ctx.fillStyle = '#0a1428'
  ctx.fillRect(0, 0, size, size)

  // Continent blobs
  const continentColors = ['#1a3060', '#243870', '#1e4080', '#162850']
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const rx = 20 + Math.random() * 80
    const ry = 15 + Math.random() * 60
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.random() * Math.PI)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry))
    g.addColorStop(0, continentColors[i % continentColors.length])
    g.addColorStop(0.7, continentColors[i % continentColors.length] + 'aa')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Cloud streaks
  ctx.globalAlpha = 0.15
  for (let i = 0; i < 8; i++) {
    const y = Math.random() * size
    const g = ctx.createLinearGradient(0, y - 20, size, y + 20)
    g.addColorStop(0,   'rgba(180,210,240,0)')
    g.addColorStop(0.3, 'rgba(180,210,240,0.4)')
    g.addColorStop(0.7, 'rgba(180,210,240,0.4)')
    g.addColorStop(1,   'rgba(180,210,240,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, y - 15, size, 30)
  }
  ctx.globalAlpha = 1

  // City light dots (night side hint)
  ctx.fillStyle = 'rgba(201,168,76,0.6)'
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, 0.8 + Math.random() * 1.2, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// Atmosphere shader material
function AtmosphereMaterial({ color, opacity }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.opacity = opacity + Math.sin(clock.getElapsedTime() * 0.5) * 0.02
  })
  return (
    <meshBasicMaterial
      ref={ref}
      color={color}
      transparent
      opacity={opacity}
      side={THREE.BackSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  )
}

// Ring system
function PlanetRings({ innerR, outerR, color }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const g = ctx.createLinearGradient(0, 0, 512, 0)
    g.addColorStop(0,    'rgba(0,0,0,0)')
    g.addColorStop(0.1,  color + '40')
    g.addColorStop(0.3,  color + '90')
    g.addColorStop(0.45, color + '60')
    g.addColorStop(0.55, color + '80')
    g.addColorStop(0.7,  color + '50')
    g.addColorStop(0.9,  color + '30')
    g.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 32)
    const t = new THREE.CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [color])

  return (
    <mesh rotation={[Math.PI * 0.08, 0, 0.15]}>
      <ringGeometry args={[innerR, outerR, 80]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function Planet({ position = [-30, -8, -60] }) {
  const planetRef = useRef()
  const cloudRef  = useRef()
  const texture   = useMemo(() => makePlanetTexture(), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (planetRef.current) planetRef.current.rotation.y = t * 0.02
    if (cloudRef.current)  cloudRef.current.rotation.y  = t * 0.025
  })

  return (
    <group position={position}>
      {/* Planet body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.0}
          roughness={0.8}
          emissiveMap={texture}
          emissiveIntensity={0.08}
          emissive="#1a3060"
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[12.15, 48, 48]} />
        <meshStandardMaterial
          color="#b0c8e8"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[12, 32, 32]} />
        <AtmosphereMaterial color="#1a6090" opacity={0.18} />
      </mesh>

      {/* Outer atmosphere halo */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[12, 32, 32]} />
        <AtmosphereMaterial color="#0a3860" opacity={0.10} />
      </mesh>

      {/* Far atmosphere scatter */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[12, 24, 24]} />
        <AtmosphereMaterial color="#071830" opacity={0.06} />
      </mesh>

      {/* Ring system */}
      <PlanetRings innerR={14} outerR={22} color="#4a6090" />

      {/* Planet key light */}
      <pointLight position={[40, 20, 30]} color="#e8d8b0" intensity={1.5} distance={200} />
      {/* Rim fill */}
      <pointLight position={[-30, 10, -20]} color="#1a4080" intensity={0.5} distance={100} />
    </group>
  )
}
