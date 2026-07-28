import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { scrollToAnchor } from '../../utils/scroll'

const collections = [
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format',
  },
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&q=80&auto=format',
  },
  {
    name: 'Accessories',
    image: '/outfit-Accessories.jpg',
  },
  {
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80&auto=format',
  },
]

export default function FeaturedCollections() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.collection-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="collections" ref={containerRef} className="py-24 px-6">
      <h2 className="font-heading text-3xl md:text-4xl text-center text-ivory mb-16">
        Curated Collections
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              if (item.name === 'Women') {
                window.dispatchEvent(new Event('open-women-collection'))
              } else if (item.name === 'Men') {
                window.dispatchEvent(new Event('open-men-collection'))
              } else if (item.name === 'Accessories') {
                window.dispatchEvent(new Event('open-accessories-collection'))
              } else if (item.name === 'New Arrivals') {
                window.dispatchEvent(new Event('open-newarrivals-collection'))
              } else {
                scrollToAnchor('#bestsellers')
              }
            }}
            className="collection-card group relative aspect-[4/5] overflow-hidden cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="transition-transform duration-400 group-hover:-translate-y-16 max-lg:-translate-y-16">
                <h3 className="font-heading text-2xl text-ivory tracking-wide drop-shadow-md">
                  {item.name}
                </h3>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 transition-all duration-400 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 max-lg:opacity-100 max-lg:translate-y-0">
              <div className="w-full py-3.5 text-center bg-black/40 backdrop-blur-md rounded border border-ivory/20 transition-colors group-hover:bg-black/60">
                <span className="text-ivory font-medium text-xs tracking-[0.2em] uppercase">
                  Explore
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
