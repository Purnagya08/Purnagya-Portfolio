import { NEXUS_COLORS } from '@shared/constants/designTokens'

export function FloatingShape() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.45, 2]} />
      <meshStandardMaterial
        color={NEXUS_COLORS.steel}
        metalness={0.75}
        roughness={0.36}
      />
    </mesh>
  )
}
