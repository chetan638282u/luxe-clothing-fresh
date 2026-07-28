import { motion } from 'framer-motion'

export default function HeroVideo({ canvasRef, isReady }) {
  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{
        contain: 'paint layout',
        willChange: 'transform',
        filter: 'brightness(0.85) saturate(1.1)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />
  )
}
