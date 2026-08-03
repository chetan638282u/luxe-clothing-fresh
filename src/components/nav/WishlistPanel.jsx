import { motion, AnimatePresence } from 'framer-motion'
import { useStore, toggleWishlist, addToBag, showToast } from '../../hooks/store'
import useMediaQuery from '../../hooks/useMediaQuery'

export default function WishlistPanel({ open, onClose }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const items = useStore(state => state.wishlist)

  const overlay = (
    <motion.div
      key="wishlist-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } : { opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] bg-black/50"
      onClick={onClose}
    />
  )

  const drawer = (
    <motion.div
      key="wishlist-drawer"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } : { x: '100%', pointerEvents: 'none' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-charcoal opacity-[0.99] border-l border-black/10 flex flex-col"
      style={{ contain: 'paint layout', willChange: 'transform' }}
    >
      <div className="flex items-center justify-between p-5 border-b border-black/10">
              <h2 className="font-heading text-lg text-ivory tracking-wide">
                Wishlist {items.length > 0 && <span className="text-gold text-sm ml-1">({items.length})</span>}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ivory/60 hover:text-gold hover:bg-black/10 transition-colors"
                aria-label="Close wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5" data-lenis-prevent="true">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ivory/20 mb-4">
                    <path d="M19 14c1.5-1.5 3-3.5 3-6 0-2.8-2.2-5-5-5-1.6 0-3 .7-4 1.8C12 3.7 10.6 3 9 3 6.2 3 4 5.2 4 8c0 2.5 1.5 4.5 3 6l5 5 7-7Z" />
                  </svg>
                  <p className="text-ivory/40 text-sm mb-2">Your wishlist is empty</p>
                  <p className="text-ivory/20 text-xs">Save items you love by tapping the heart icon</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="relative flex gap-4 bg-deep rounded-lg p-3"
                    >
                      <button
                        onClick={() => {
                          toggleWishlist(item)
                          showToast('Removed from Wishlist')
                        }}
                        className="absolute top-2 right-2 p-1 text-ivory/40 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <div className="w-20 h-24 shrink-0 bg-charcoal rounded overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm text-ivory truncate pr-6">{item.name}</h3>
                          <p className="text-gold text-xs mt-0.5">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              addToBag(item)
                              toggleWishlist(item)
                              showToast(`${item.name} added to Bag`)
                            }}
                            className="text-gold hover:text-ivory transition-colors text-xs tracking-[0.1em] uppercase"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
    </motion.div>
  )

  if (isMobile) {
    return open ? <>{overlay}{drawer}</> : null
  }

  return (
    <>
      <AnimatePresence>{open && overlay}</AnimatePresence>
      <AnimatePresence>{open && drawer}</AnimatePresence>
    </>
  )
}
