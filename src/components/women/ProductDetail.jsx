import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { addToBag, toggleWishlist, isWishlisted, showToast, setCheckoutItems } from '../../hooks/store'
import useMediaQuery from '../../hooks/useMediaQuery'

const sizes = ['XS', 'S', 'M', 'L', 'XL']

export default function ProductDetail({ product, onClose }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToBag(product)
    showToast(`${qty} × ${product.name} (${selectedSize}) added to Bag`)
    onClose()
  }

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToBag(product)
    setCheckoutItems(Array.from({ length: qty }, () => ({ name: product.name, price: product.price, image: product.image })))
    onClose()
    setTimeout(() => window.dispatchEvent(new Event('open-checkout')), 350)
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={isMobile ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.05 } }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', willChange: 'transform' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-charcoal rounded-xl overflow-hidden w-full max-w-5xl max-h-[calc(100vw*1.6)] md:max-h-[85vh] border border-white/10 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full md:w-[55%] min-h-[300px] md:min-h-[500px] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${product.name === 'Gold Chain Bracelet' ? 'scale-[1.15] object-right-top' : ''}`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(product)
              showToast(isWishlisted(product.name) ? 'Removed from Wishlist' : 'Added to Wishlist')
            }}
            className="absolute top-3 right-3 z-10 bg-black/40 rounded-full p-1.5 transition-colors"
            aria-label="Add to wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted(product.name) ? '#c9a961' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={isWishlisted(product.name) ? 'text-gold' : 'text-ivory/80 hover:text-gold'}>
              <path d="M19 14c1.5-1.5 3-3.5 3-6 0-2.8-2.2-5-5-5-1.6 0-3 .7-4 1.8C12 3.7 10.6 3 9 3 6.2 3 4 5.2 4 8c0 2.5 1.5 4.5 3 6l5 5 7-7Z" />
            </svg>
          </button>
        </div>

        <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col justify-between gap-4 overflow-y-auto" data-lenis-prevent="true">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-xl md:text-2xl text-ivory">{product.name}</h2>
              <p className="text-gold text-lg mt-1">{product.price}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-ivory/80 hover:text-gold transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <p className="text-ivory/60 text-sm leading-relaxed">
            {product.description}
          </p>

          <div>
            <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-3">Select Size</p>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 text-xs font-medium rounded-full border transition-all ${
                    selectedSize === s
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-white/15 text-ivory/60 hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-full border border-white/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="text-ivory text-base w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-full border border-white/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-gold/50 text-gold hover:bg-gold hover:text-deep transition-all py-3 text-xs tracking-[0.2em] uppercase"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gold text-deep hover:bg-ivory transition-all py-3 text-xs tracking-[0.2em] uppercase"
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
