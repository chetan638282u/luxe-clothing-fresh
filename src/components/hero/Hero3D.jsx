import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles, Environment } from '@react-three/drei'

export default function Hero3D() {
  const sparklesCount = useMemo(() => {
    return window.innerWidth < 1024 ? 15 : 25
  }, [])

  return (
    <Canvas
      camera={{ fov: 45, position: [0, 0, 6] }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="city" />
      <Sparkles
        count={sparklesCount}
        scale={5}
        size={0.4}
        speed={0.2}
        color="#c9a961"
        opacity={0.2}
      />
    </Canvas>
  )
}
