import { motion } from 'framer-motion'

const collections = [
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format',
    id: 'women',
  },
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&q=80&auto=format',
    id: 'men',
  },
  {
    name: 'Accessories',
    image: '/outfit-Accessories.jpg',
    id: 'accessories',
  },
  {
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80&auto=format',
    id: 'newarrivals',
  },
]

export default function FeaturedCollections() {
  const handleSelect = (item) => {
    if (item.id === 'women') {
      window.dispatchEvent(new Event('open-women-collection'))
    } else if (item.id === 'men') {
      window.dispatchEvent(new Event('open-men-collection'))
    } else if (item.id === 'accessories') {
      window.dispatchEvent(new Event('open-accessories-collection'))
    } else if (item.id === 'newarrivals') {
      window.dispatchEvent(new Event('open-newarrivals-collection'))
    }
  }

  return (
    <section id="collections" className="w-full min-h-screen bg-deep py-32 px-6 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-16">
          <h1 className="font-heading font-bold text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tighter uppercase text-ivory">
            COLLECTIONS
            <span className="text-[0.4em] align-top relative top-[0.6em] ml-2 font-mono tabular-nums lowercase text-gold">
              ({collections.length})
            </span>
          </h1>
          <h2 className="font-heading font-bold text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tighter text-ivory/40">
            CURATED
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
              onClick={() => handleSelect(item)}
              className="group cursor-pointer relative h-[60vh] lg:h-[65vh] bg-charcoal overflow-hidden shadow-2xl"
            >
              <div className="absolute top-4 left-4 text-ivory font-mono text-xs opacity-50 z-20 transition-opacity group-hover:opacity-100">
                {String(i + 1).padStart(2, '0')}
              </div>
              
              <div className="relative w-full h-full brightness-75 group-hover:brightness-100 transition-all duration-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="font-heading text-2xl text-ivory mb-4 leading-tight">{item.name}</h3>
                <div className="w-full py-3 glass border border-white/10 flex items-center justify-center pointer-events-auto transition-colors hover:bg-white/10">
                  <span className="text-xs tracking-[0.2em] uppercase text-ivory/90 font-medium">Explore</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
