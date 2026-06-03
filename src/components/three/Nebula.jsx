import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Build a soft cloud texture procedurally on a canvas
function makeNebulaTexture(color1, color2, size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')

  // Multi-pass radial gradients for cloud look
  for (let i = 0; i < 8; i++) {
    const x = size * (0.2 + Math.random() * 0.6)
    const y = size * (0.2 + Math.random() * 0.6)
    const r = size * (0.15 + Math.random() * 0.3)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color1.replace(')', `, ${0.08 + Math.random() * 0.12})`).replace('rgb', 'rgba'))
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  for (let i = 0; i < 4; i++) {
    const x = size * (0.1 + Math.random() * 0.8)
    const y = size * (0.1 + Math.random() * 0.8)
    const r = size * (0.08 + Math.random() * 0.15)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color2.replace(')', `, ${0.06 + Math.random() * 0.1})`).replace('rgb', 'rgba'))
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function NebulaPlane({ position, rotation, scale, color1, color2, rotSpeed }) {
  const ref = useRef()
  const texture = useMemo(() => makeNebulaTexture(color1, color2), [color1, color2])

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.z += rotSpeed
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function Nebula() {
  return (
    <group>
      <NebulaPlane
        position={[-80, 20, -200]}
        rotation={[0.2, 0.3, 0]}
        scale={[300, 200, 1]}
        color1="rgb(26,127,168)"
        color2="rgb(56,184,216)"
        rotSpeed={0.00005}
      />
      <NebulaPlane
        position={[100, -30, -300]}
        rotation={[-0.1, -0.2, 0.1]}
        scale={[250, 180, 1]}
        color1="rgb(120,60,200)"
        color2="rgb(80,40,160)"
        rotSpeed={-0.00004}
      />
      <NebulaPlane
        position={[40, 60, -180]}
        rotation={[0.4, -0.1, 0.2]}
        scale={[200, 150, 1]}
        color1="rgb(201,168,76)"
        color2="rgb(160,100,40)"
        rotSpeed={0.00003}
      />
      <NebulaPlane
        position={[-120, -50, -250]}
        rotation={[0.1, 0.4, -0.2]}
        scale={[280, 200, 1]}
        color1="rgb(20,80,140)"
        color2="rgb(40,120,180)"
        rotSpeed={-0.00006}
      />
    </group>
  )
}
