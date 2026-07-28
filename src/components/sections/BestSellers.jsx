import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { addToBag, toggleWishlist, isWishlisted, showToast } from '../../hooks/store'
import ProductDetail from '../women/ProductDetail'
import { bestSellersProducts as products } from '../../data/catalog'

export default function BestSellers() {
  const sectionRef = useRef(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const cards = section.querySelectorAll('.card-stagger')
        cards.forEach(c => { c.style.animationPlayState = 'running' })
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -15% 0px' })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

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
        <style>{`
          @keyframes cardFadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        <div className="overflow-hidden">
          <h2 className="font-heading text-3xl md:text-4xl text-center text-ivory mb-16 px-6">
            Best Sellers
          </h2>

          <div
            className="flex flex-nowrap gap-6 px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
          >
            {products.map((product, i) => (
              <div
                key={product.name}
                className="card-stagger flex-shrink-0 w-[clamp(260px,28vw,360px)] max-lg:w-[75vw] snap-center"
                style={{
                  animation: 'cardFadeIn 0.5s ease-out forwards',
                  animationDelay: `${i * 0.08}s`,
                  animationPlayState: 'paused',
                }}
              >
                <ProductCard product={product} onSelect={() => setSelectedProduct(product)} />
              </div>
            ))}
            
            {/* Spacer for proper last item snapping alignment on mobile */}
            <div className="flex-shrink-0 w-6 lg:w-0" />
          </div>
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

function ProductCard({ product, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const wishlisted = isWishlisted(product.name)

  return (
    <div
      className="product-card group relative aspect-[3/4] overflow-hidden bg-charcoal cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
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
        className="absolute top-3 right-3 transition-all duration-300 bg-black/40 rounded-full p-1.5"
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

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <h3 className="font-heading text-sm text-ivory mb-1">{product.name}</h3>
        <p className="text-gold text-xs tracking-wide">{product.price}</p>
      </div>

      <div
        className="absolute bottom-4 left-4 right-4 transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(8px)' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            addToBag(product)
            showToast(`${product.name} added to Bag`)
          }}
          className="glass w-full py-2.5 text-xs tracking-[0.2em] uppercase text-ivory/90 hover:text-gold transition-colors"
        >
          Add to Bag
        </button>
      </div>
    </div>
  )
}
