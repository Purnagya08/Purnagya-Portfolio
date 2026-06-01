import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls } from '@react-three/drei'
import { FloatingShape } from '@three/components/FloatingShape'

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 48 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.8} />
      <directionalLight intensity={3} position={[3, 4, 5]} />
      <Float rotationIntensity={0.75} speed={1.8}>
        <FloatingShape />
      </Float>
      <Environment preset="city" />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  )
}
