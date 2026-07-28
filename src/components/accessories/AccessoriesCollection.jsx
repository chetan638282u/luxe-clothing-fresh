import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductDetail from '../women/ProductDetail'
import { accessoriesProducts as products } from '../../data/catalog'
import useMediaQuery from '../../hooks/useMediaQuery'
import { ProductGrid } from '../ui/ProductGrid'

export default function AccessoriesCollection({ onClose, hash }) {
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
      className="fixed inset-0 z-[60] bg-deep flex flex-col px-6"
      style={{ contain: 'paint layout' }}
      data-lenis-prevent="true"
    >
      <div className="max-w-7xl mx-auto w-full shrink-0 pt-28 pointer-events-none z-50">
        <div className="flex items-center justify-between mb-4 pointer-events-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-ivory/60 hover:text-gold transition-colors text-sm tracking-[0.15em] uppercase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
          <div className="w-16" />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col pt-32 pb-6 px-6">
          <ProductGrid products={products} onSelect={handleSelect} title="ACCESSORIES" subtitle="COLLECTION" />
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
