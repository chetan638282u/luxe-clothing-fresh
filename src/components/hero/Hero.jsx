import { useEffect } from 'react'
import useVideoLoop from '../../hooks/useVideoLoop'
import HeroVideo from './HeroVideo'
import HeroContent from './HeroContent'

export default function Hero() {
  const { canvasRef, isReady } = useVideoLoop(30)

  useEffect(() => {
    if (isReady) {
      setTimeout(() => window.dispatchEvent(new Event('hero-ready')), 0)
    }
  }, [isReady])

  return (
    <section
      id="hero"
      className="relative bg-deep h-screen w-full overflow-hidden"
      style={{ contain: 'paint layout' }}
    >
      {/* Background Cinematic Loop */}
      <HeroVideo canvasRef={canvasRef} isReady={isReady} />
      
      {/* Loading State */}
      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-deep pointer-events-auto">
          <div className="flex flex-col items-center gap-5">
            <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <span className="font-heading text-gold text-lg tracking-[0.3em] uppercase">MAISON</span>
            <span className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase">Loading experience...</span>
          </div>
        </div>
      )}

      {/* Gradient Overlay (Removed heavy tint to allow true colors to pop for difference blend) */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-deep/40 z-10 pointer-events-none" />

      {/* Content Layer (Interlocked) */}
      <div className="absolute inset-0 z-50 pointer-events-auto">
        <HeroContent isReady={isReady} />
      </div>
    </section>
  )
}
