import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addToBag, toggleWishlist, isWishlisted, showToast } from '../../hooks/store'
import ProductDetail from '../women/ProductDetail'
import { newArrivalsProducts as products } from '../../data/catalog'
import useMediaQuery from '../../hooks/useMediaQuery'

function ProductCard({ product, onSelect, hovered, onHover }) {
  const wishlisted = isWishlisted(product.name)

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: product.id * 0.05 }}
      className="group flex flex-col cursor-pointer"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onSelect}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <button
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product)
            showToast(wishlisted ? 'Removed from Wishlist' : 'Added to Wishlist')
          }}
          className="absolute top-3 right-3 transition-all duration-300 z-10 bg-black/40 rounded-full p-1.5"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <svg
            width="18" height="18"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill={wishlisted ? '#c9a961' : 'none'}
            className={wishlisted ? 'text-gold' : 'text-ivory/80 hover:text-gold'}
          >
            <path d="M19 14c1.5-1.5 3-3.5 3-6 0-2.8-2.2-5-5-5-1.6 0-3 .7-4 1.8C12 3.7 10.6 3 9 3 6.2 3 4 5.2 4 8c0 2.5 1.5 4.5 3 6l5 5 7-7Z" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-col items-start px-1">
        <h3 className="font-heading text-sm text-ivory mb-1">{product.name}</h3>
        <p className="text-ivory/60 text-xs mb-4">{product.price}</p>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            addToBag(product)
            showToast(`${product.name} added to Bag`)
          }}
          className="text-[10px] tracking-[0.2em] uppercase text-ivory border-b border-ivory/30 pb-1 hover:border-ivory transition-colors w-max"
        >
          Add to Bag
        </button>
      </div>
    </motion.div>
  )
}

function ProductRow({ items, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
      {items.map((p) => (
        <ProductCardWrapper key={p.id} product={p} onSelect={() => onSelect(p)} />
      ))}
    </div>
  )
}

function ProductCardWrapper({ product, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return <ProductCard product={product} onSelect={onSelect} hovered={hovered} onHover={setHovered} />
}

export default function NewArrivalsCollection({ onClose, hash }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [selectedProduct, setSelectedProduct] = useState(null)



  const handleSelect = (product) => {
    setSelectedProduct(product)
    window.history.pushState({}, '', `?view=${hash}/detail`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  useEffect(() => {
    const onHashChange = () => {
      const full = new URLSearchParams(window.location.search).get('view') || ''
      if (full === hash) setSelectedProduct(null)
    }
    window.addEventListener('popstate', onHashChange)
    return () => window.removeEventListener('popstate', onHashChange)
  }, [hash])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={isMobile ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.05 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] bg-deep overflow-y-auto no-scrollbar"
      style={{ contain: 'paint layout' }}
      data-lenis-prevent="true"
    >
      <div className="min-h-full flex flex-col px-6">
        <div className="max-w-7xl mx-auto w-full pt-12 md:pt-16 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-ivory/60 hover:text-gold transition-colors text-sm tracking-[0.15em] uppercase"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
            <h2 className="font-heading text-3xl md:text-4xl text-ivory">New Arrivals</h2>
            <div className="w-16" />
          </div>

          <div className="flex-1 pb-16">
            <ProductRow items={products} onSelect={handleSelect} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => { setSelectedProduct(null); window.history.pushState({}, '', `?view=${hash}`); window.dispatchEvent(new PopStateEvent('popstate')) }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
