import { useEffect } from 'react'
import useVideoScrub from '../../hooks/useVideoScrub'
import HeroScrub from './HeroScrub'
import Hero3D from './Hero3D'
import HeroContent from './HeroContent'

export default function Hero() {
  const { sectionRef, canvasRef, isReady } = useVideoScrub()

  useEffect(() => {
    if (isReady) {
      setTimeout(() => window.dispatchEvent(new Event('hero-ready')), 0)
    }
  }, [isReady])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative bg-deep h-[calc(100vw*1.5)] lg:h-[calc(100vw*0.5625)] overflow-hidden"
    >
      <HeroScrub canvasRef={canvasRef} isReady={isReady} />
      
      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-deep pointer-events-auto">
          <div className="flex flex-col items-center gap-5">
            <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <span className="font-heading text-gold text-lg tracking-[0.3em] uppercase">MAISON</span>
            <span className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase">Loading experience...</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/15 to-deep/40 z-30 pointer-events-none" />

      <div className="absolute inset-0 hidden md:block z-40 pointer-events-none">
        <Hero3D />
      </div>

      <div className="absolute inset-0 z-50 pointer-events-auto">
        <HeroContent />
      </div>
    </section>
  )
}
