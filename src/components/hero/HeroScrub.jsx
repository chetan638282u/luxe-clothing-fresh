import { motion } from 'framer-motion'

export default function HeroScrub({ canvasRef, isReady }) {
  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full object-cover -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        filter: 'brightness(0.75) saturate(1.3)',
      }}
    />
  )
}
