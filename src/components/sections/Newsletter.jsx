import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'

export default function Newsletter() {
  const containerRef = useRef(null)
  const [subscribed, setSubscribed] = useState(false)
  const emailRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (emailRef.current?.value) {
      setSubscribed(true)
      emailRef.current.value = ''
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section
      id="newsletter"
      ref={containerRef}
      className="bg-charcoal py-24 px-6 text-center"
    >
      <div className="max-w-lg mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-ivory">
          Join the Inner Circle
        </h2>
        <p className="font-sans text-ivory/60 text-sm md:text-base mt-4 mb-10 max-w-md mx-auto">
          Be the first to receive exclusive collections, private previews, and
          atelier updates.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            ref={emailRef}
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1 bg-transparent border border-white/20 text-ivory placeholder:text-ivory/40 px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            className="bg-transparent border border-gold/50 text-gold hover:bg-gold hover:text-deep transition-all px-6 py-3.5 text-xs tracking-[0.2em] uppercase whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        <AnimatePresence>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gold text-sm mt-4"
            >
              Thank you! You've been added to the Inner Circle.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
