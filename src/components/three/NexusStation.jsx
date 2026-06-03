import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Ring({ radius, tubeR, color, rotAxis, rotSpeed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * rotSpeed
    if (rotAxis === 'x') ref.current.rotation.x = t
    else if (rotAxis === 'y') ref.current.rotation.y = t
    else ref.current.rotation.z = t
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tubeR, 12, 80]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.15} />
    </mesh>
  )
}

function CoreSphere() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.1
    ref.current.rotation.x = clock.getElapsedTime() * 0.07
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.2, 2]} />
      <meshStandardMaterial
        color="#0d1830"
        metalness={0.95}
        roughness={0.05}
        emissive="#1a4060"
        emissiveIntensity={0.3}
        wireframe={false}
      />
    </mesh>
  )
}

function DataPanel({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.8, 1.4, 0.04]} />
      <meshStandardMaterial color="#0a1525" metalness={0.8} roughness={0.2} emissive="#1a3050" emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function NexusStation() {
  const stationRef = useRef()

  useFrame(({ clock }) => {
    if (!stationRef.current) return
    const t = clock.getElapsedTime()
    stationRef.current.rotation.y = t * 0.015
    stationRef.current.position.y = Math.sin(t * 0.3) * 0.4
  })

  return (
    <group ref={stationRef} position={[0, 0, -8]}>
      <CoreSphere />

      {/* Gyroscope rings */}
      <Ring radius={2.5} tubeR={0.045} color="#38b8d8" rotAxis="y" rotSpeed={0.15} />
      <Ring radius={2.5} tubeR={0.045} color="#c9a84c" rotAxis="x" rotSpeed={-0.12} />
      <Ring radius={2.5} tubeR={0.03}  color="#7dd8f0" rotAxis="z" rotSpeed={0.08}  />

      {/* Outer ring */}
      <Ring radius={3.8} tubeR={0.03}  color="#1a4060" rotAxis="y" rotSpeed={0.05}  />

      {/* Radial spokes */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <mesh key={i} position={[Math.cos(rad) * 1.8, Math.sin(rad) * 1.8, 0]} rotation={[0, 0, rad]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#263560" metalness={0.9} roughness={0.2} />
          </mesh>
        )
      })}

      {/* Solar panels */}
      <mesh position={[0, 3.2, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[2.4, 0.6, 0.04]} />
        <meshStandardMaterial color="#0a1830" metalness={0.7} roughness={0.3} emissive="#0a2040" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, -3.2, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[2.4, 0.6, 0.04]} />
        <meshStandardMaterial color="#0a1830" metalness={0.7} roughness={0.3} emissive="#0a2040" emissiveIntensity={0.2} />
      </mesh>

      {/* Data panels on station */}
      {[0, 90, 180, 270].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <DataPanel
            key={i}
            position={[Math.cos(rad) * 1.4, 0, Math.sin(rad) * 1.4]}
            rotation={[0, -rad, 0]}
          />
        )
      })}

      {/* Station light */}
      <pointLight color="#38b8d8" intensity={3} distance={20} />
      <pointLight position={[0, 4, 0]} color="#c9a84c" intensity={1} distance={15} />
    </group>
  )
}
