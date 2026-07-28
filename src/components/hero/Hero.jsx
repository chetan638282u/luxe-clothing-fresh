import HeroVideo from './HeroVideo'
import HeroContent from './HeroContent'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-deep w-full overflow-hidden h-[160vw] md:h-[56vw] min-h-[500px]"
      style={{ contain: 'paint layout', willChange: 'transform' }}
    >
      {/* Background Native Video */}
      <HeroVideo />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-deep/40 z-10 pointer-events-none" />

      {/* Content Layer (Interlocked) */}
      <div className="absolute inset-0 z-50 pointer-events-auto">
        <HeroContent />
      </div>
    </section>
  )
}
