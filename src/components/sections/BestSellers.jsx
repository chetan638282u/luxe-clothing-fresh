import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { addToBag, toggleWishlist, isWishlisted, showToast } from '../../hooks/store'
import ProductDetail from '../women/ProductDetail'
import { bestSellersProducts as products } from '../../data/catalog'
import { ScrollTiltedGrid } from '../ui/ScrollTiltedGrid'

export default function BestSellers() {
  const sectionRef = useRef(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    if (selectedProduct) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [selectedProduct])

  return (
    <>
      <section ref={sectionRef} id="bestsellers" className="relative bg-deep py-24">

        <div className="overflow-hidden">
          <h2 className="font-heading text-3xl md:text-5xl text-center text-ivory mb-16 px-6 tracking-wide">
            Best Sellers
          </h2>
          <div className="w-24 h-px bg-gold/50 mx-auto mt-[-2rem] mb-16" />

          <ScrollTiltedGrid 
            products={products} 
            loop={false}
            onSelect={setSelectedProduct} 
          />
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export function ProductCard({ product, onSelect }) {
  const wishlisted = isWishlisted(product.name)

  return (
    <div
      className="product-card group w-full cursor-pointer flex flex-col"
      onClick={onSelect}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
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
          className="absolute top-3 right-3 transition-all duration-300 bg-black/40 rounded-full p-1.5 opacity-0 group-hover:opacity-100 max-lg:opacity-100"
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

        <div className="absolute bottom-4 left-4 right-4 transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 max-lg:opacity-100 max-lg:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              addToBag(product)
              showToast(`${product.name} added to Bag`)
            }}
            className="w-full py-2.5 text-xs tracking-[0.2em] uppercase text-ivory hover:text-gold transition-colors font-medium bg-deep rounded shadow-lg hover:bg-charcoal"
          >
            Add to Bag
          </button>
        </div>
      </div>

      <div className="mt-4 px-1">
        <h3 className="font-heading text-sm text-ivory">{product.name}</h3>
      </div>
    </div>
  )
}
