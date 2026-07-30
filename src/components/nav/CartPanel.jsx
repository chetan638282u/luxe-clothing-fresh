import { motion, AnimatePresence } from 'framer-motion'
import { useStore, setCheckoutItems, removeOneFromBag, removeFromBagByName, addToBag, showToast } from '../../hooks/store'
import useMediaQuery from '../../hooks/useMediaQuery'

export default function CartPanel({ open, onClose }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const items = useStore(state => state.bagItems)

  const grouped = items.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name)
    if (existing) existing.count++
    else acc.push({ ...item, count: 1 })
    return acc
  }, [])

  const overlay = (
    <motion.div
      key="cart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] bg-black/50"
      onClick={onClose}
    />
  )

  const drawer = (
    <motion.div
      key="cart-drawer"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%', pointerEvents: 'none' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-charcoal border-l border-black/10 flex flex-col"
      style={{ contain: 'paint layout', willChange: 'transform' }}
    >
      <div className="flex items-center justify-between p-5 border-b border-black/10">
              <h2 className="font-heading text-lg text-ivory tracking-wide">
                Cart {items.length > 0 && <span className="text-gold text-sm ml-1">({items.length})</span>}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ivory/60 hover:text-gold hover:bg-black/10 transition-colors"
                aria-label="Close cart"
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
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p className="text-ivory/40 text-sm mb-2">Your cart is empty</p>
                  <p className="text-ivory/20 text-xs">Add items you love by tapping Add to Bag</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {grouped.map((item) => (
                    <div
                      key={item.name}
                      className="flex gap-4 bg-deep rounded-lg p-3"
                    >
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
                          <h3 className="text-sm text-ivory truncate">{item.name}</h3>
                          <p className="text-gold text-xs mt-0.5">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { if (item.count <= 1) { removeFromBagByName(item.name); showToast('Removed from Cart') } else { removeOneFromBag(item.name) } }}
                            className="w-6 h-6 rounded-full border border-black/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center text-xs"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="text-ivory text-xs w-4 text-center">{item.count}</span>
                          <button
                            onClick={() => { addToBag(item); showToast(`${item.name} added to Bag`) }}
                            className="w-6 h-6 rounded-full border border-black/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center text-xs"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <button
                            onClick={() => {
                              removeFromBagByName(item.name)
                              showToast('Removed from Cart')
                            }}
                            className="text-ivory/40 hover:text-red-400 transition-colors text-xs tracking-[0.1em] uppercase ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center shrink-0">
                        <button
                          onClick={() => { setCheckoutItems(Array.from({ length: item.count }, () => ({ name: item.name, price: item.price, image: item.image }))); window.dispatchEvent(new Event('open-checkout')) }}
                          className="bg-gold text-deep hover:bg-ivory transition-colors px-3 py-1.5 text-xs tracking-[0.1em] uppercase font-semibold rounded"
                        >
                          Purchase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="shrink-0 p-5 border-t border-black/10">
                <button
                  onClick={() => { setCheckoutItems([...items]); window.dispatchEvent(new Event('open-checkout')) }}
                  className="w-full bg-gold text-deep hover:bg-ivory transition-all py-3.5 text-xs tracking-[0.2em] uppercase font-semibold"
                >
                  Purchase
                </button>
              </div>
            )}
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
