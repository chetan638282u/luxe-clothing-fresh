import { motion } from 'framer-motion'
import { useState } from 'react'

export default function HeroVideo({ onReady }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadedData = () => {
    setIsLoaded(true)
    if (onReady) onReady()
  }

  return (
    <motion.video
      src="/hero-editorial.mp4"
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={handleLoadedData}
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{
        contain: 'paint layout',
        willChange: 'transform',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />
  )
}
