import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  {
    title: 'Women',
    items: ['Dresses & Gowns', 'Tops & Blouses', 'Tailored Suits', 'Evening Wear'],
  },
  {
    title: 'Men',
    items: ['Tailored Suits', 'Shirts & Polos', 'Outerwear', 'Footwear'],
  },
  {
    title: 'Accessories',
    items: ['Leather Goods', 'Jewelry', 'Scarves & Ties', 'Eyewear'],
  },
  {
    title: 'New Arrivals',
    items: ['Spring Collection', 'Limited Edition', 'Runway Looks', 'Pre-Order'],
  },
]

export default function CollectionMenu({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-8 rounded-lg glass min-w-[580px]"
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div key={cat.title}>
                <h3 className="font-heading text-gold text-sm tracking-[0.15em] uppercase mb-4">
                  {cat.title}
                </h3>
                <ul className="space-y-2.5">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="nav-underline-sub text-sm text-ivory/60 hover:text-gold transition-colors duration-300 w-fit"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
