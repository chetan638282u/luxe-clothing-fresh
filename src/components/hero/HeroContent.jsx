import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { scrollToAnchor } from '../../utils/scroll'

export default function HeroContent() {
  const containerRef = useRef(null)
  const hasEntered = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (!hasEntered.current) {
      hasEntered.current = true
      gsap.from(el.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      })
    }
  }, [])



  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
    >
      <span className="text-gold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4">
        Fall/Winter Collection
      </span>
      <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight text-ivory max-w-4xl">
        Timeless Elegance, Redefined
      </h1>
      <p className="text-ivory/60 text-sm sm:text-base md:text-lg max-w-md mt-4 mb-8">
        Luxury craftsmanship meets modern design. Discover a new standard of refined dressing.
      </p>
      <button
        onClick={() => scrollToAnchor('#bestsellers')}
        className="bg-transparent border border-gold/50 text-gold hover:bg-gold hover:text-deep transition-all duration-400 px-8 py-3.5 text-sm tracking-[0.2em] uppercase"
      >
        Shop the Collection
      </button>
    </div>
  )
}
