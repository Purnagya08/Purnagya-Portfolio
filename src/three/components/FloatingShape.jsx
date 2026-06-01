export function FloatingShape() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.45, 2]} />
      <meshStandardMaterial color="#22d3ee" metalness={0.75} roughness={0.2} />
    </mesh>
  )
}
