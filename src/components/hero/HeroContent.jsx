import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { scrollToAnchor } from '../../utils/scroll'

export default function HeroContent({ isReady }) {
  const ctaRef = useRef(null)

  useEffect(() => {
    if (!isReady || !ctaRef.current) return

    gsap.from(ctaRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.5,
    })
  }, [isReady])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
      
      {/* Massive Interlocking Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isReady ? 1 : 0, scale: isReady ? 1 : 0.95 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden mix-blend-difference pointer-events-none"
      >
        <h1 className="font-heading text-[12vw] sm:text-[14vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw] leading-none text-white select-none whitespace-nowrap tracking-widest mt-[-8vh] md:mt-0">
          MAISON
        </h1>
      </motion.div>

      {/* Call To Action Block (Normal blending) */}
      <div 
        ref={ctaRef}
        className="absolute bottom-12 md:bottom-24 flex flex-col items-center px-6 text-center z-10"
      >
        <span className="text-white text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4 opacity-80 mix-blend-difference">
          Fall/Winter Collection
        </span>
        <p className="text-white text-sm sm:text-base md:text-lg max-w-md mt-2 mb-8 opacity-90 mix-blend-difference">
          Luxury craftsmanship meets modern design. Discover a new standard of refined dressing.
        </p>
        <button
          onClick={() => scrollToAnchor('#bestsellers')}
          className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-400 px-8 py-3.5 text-sm tracking-[0.2em] uppercase pointer-events-auto mix-blend-difference"
        >
          Shop the Collection
        </button>
      </div>

    </div>
  )
}
