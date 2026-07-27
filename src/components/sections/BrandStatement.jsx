import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function BrandStatement() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.divider-line', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.8,
        ease: 'power2.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="brand"
      ref={containerRef}
      className="py-32 px-6 text-center"
    >
      <div className="max-w-3xl mx-auto">
        <div className="divider-line h-px w-16 bg-gold/30 mx-auto mb-10" />

        <p className="font-heading text-2xl md:text-3xl leading-relaxed text-ivory/90">
          Crafted for those who recognize the difference between fashion and legacy.
          Every stitch, every seam, every fabric — a testament to uncompromising quality.
        </p>

        <div className="divider-line h-px w-16 bg-gold/30 mx-auto mt-10" />
      </div>
    </section>
  )
}
