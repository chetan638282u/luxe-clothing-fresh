import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    quote: 'The quality of the fabric is extraordinary. You can feel the difference the moment you put it on — it drapes differently, moves differently. Truly unparalleled craftsmanship.',
    name: 'Catherine Moreau',
  },
  {
    quote: "I've never owned anything quite like this. Every detail, from the stitching to the lining, speaks of an attention that's become rare in modern fashion.",
    name: 'James Whitfield',
  },
  {
    quote: 'Shipping was impeccable and the packaging alone felt like a gift. The piece itself exceeded every expectation — worth every penny and more.',
    name: 'Elena Vasquez',
  },
  {
    quote: 'Their customer service team helped me find the perfect fit over a video consultation. The result was a garment that feels like it was made for me — because it was.',
    name: 'David Harrington',
  },
  {
    quote: 'I receive compliments every time I wear it. But more than that, I feel different wearing it — more confident, more myself. That is the true mark of exceptional design.',
    name: 'Sophia Laurent',
  },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function Testimonials() {
  const [[index, dir], setIndex] = useState([0, 0])
  const intervalRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback(
    (i) => {
      setIndex(([current]) => {
        const next = (i + testimonials.length) % testimonials.length
        return [next, next > current ? 1 : -1]
      })
    },
    [],
  )

  const next = useCallback(() => goTo(index + 1), [index, goTo])
  const prev = useCallback(() => goTo(index - 1), [index, goTo])

  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(next, 4000)
    return () => clearInterval(intervalRef.current)
  }, [next, isPaused])

  const current = testimonials[index]

  return (
    <section id="testimonials" className="py-24 px-6">
      <div
        className="max-w-2xl mx-auto text-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="glass p-8 md:p-12 rounded-lg w-full"
            >
              <p className="font-heading text-xl md:text-2xl italic text-ivory/90 leading-relaxed">
                &ldquo;{current.quote}&rdquo;
              </p>

              <div className="h-px w-12 bg-gold/40 mx-auto my-6" />

              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xs font-semibold">
                    {current.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <p className="text-gold text-sm tracking-wide">{current.name}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6 mt-8">
          <button
            onClick={prev}
            className="text-ivory/40 hover:text-gold transition-colors"
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-gold w-6' : 'bg-white/20'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="text-ivory/40 hover:text-gold transition-colors"
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
