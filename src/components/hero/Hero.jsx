import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { scrollToAnchor } from '../../utils/scroll'

const panels = [
  {
    id: 1,
    image: '/women/women-01.jpg',
    speed: 0.1,
    className: 'col-span-12 md:col-span-3 md:mt-24 h-[40vh] md:h-[60vh]',
  },
  {
    id: 2,
    image: '/women/women-08.webp',
    speed: -0.05,
    className: 'col-span-12 md:col-span-5 h-[50vh] md:h-[80vh] z-10',
  },
  {
    id: 3,
    image: '/men/men-01.webp',
    speed: 0.15,
    className: 'col-span-12 md:col-span-4 md:mt-48 h-[40vh] md:h-[55vh]',
  },
]

function ParallaxPanel({ panel, scrollYProgress, panelVariants }) {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${panel.speed * 400}%`])

  return (
    <motion.div
      variants={panelVariants}
      className={`relative overflow-hidden cursor-pointer ${panel.className} transition-opacity duration-500 hover:!opacity-100 group-hover:opacity-50`}
      style={{ y }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10 pointer-events-none" />
      <img
        src={panel.image}
        alt="Lookbook"
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        loading="eager"
      />
    </motion.div>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Staggered entrance animation for panels
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const panelVariants = {
    hidden: { y: 60, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative bg-deep min-h-[120vh] md:min-h-[140vh] overflow-hidden flex flex-col items-center pt-24 pb-16"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep via-deep/90 to-deep z-0 pointer-events-none" />

      {/* Massive Typography - Positioned behind panels */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.h1 
          className="font-heading text-[20vw] md:text-[24vw] leading-none text-gold/20 select-none whitespace-nowrap tracking-tighter"
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '30%']) }}
        >
          MAISON
        </motion.h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-24">
        {/* Call to action text (Top left on desktop, center on mobile) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-12 md:mb-0 md:absolute md:top-0 md:left-8 md:max-w-[240px] text-center md:text-left z-20 mix-blend-difference"
        >
          <span className="block text-gold text-[10px] tracking-[0.25em] uppercase mb-4">
            Fall/Winter Collection
          </span>
          <h2 className="font-heading text-2xl md:text-3xl text-ivory mb-4">
            Timeless Elegance, Redefined.
          </h2>
          <button
            onClick={() => scrollToAnchor('#bestsellers')}
            className="text-ivory text-xs tracking-[0.2em] uppercase border-b border-gold/50 pb-1 hover:text-gold hover:border-gold transition-colors pointer-events-auto"
          >
            Shop the Collection
          </button>
        </motion.div>

        {/* The Staggered Panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-12 gap-4 md:gap-8 items-start group"
        >
          {panels.map((panel) => (
            <ParallaxPanel 
              key={panel.id} 
              panel={panel} 
              scrollYProgress={scrollYProgress} 
              panelVariants={panelVariants} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
