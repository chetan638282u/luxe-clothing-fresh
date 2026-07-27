import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, removeFromCheckoutByName, incrementInCheckout, decrementFromCheckout, clearBag, showToast } from '../../hooks/store'

export default function CheckoutPanel({ open, onClose }) {
  const items = useStore(state => state.checkoutItems)
  const [placed, setPlaced] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '', expiry: '', cvc: '' })

  useEffect(() => {
    if (open) {
      setPlaced(false)
      setForm({ name: '', email: '', address: '', card: '', expiry: '', cvc: '' })
    }
  }, [open])

  const grouped = items.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name)
    if (existing) existing.count++
    else acc.push({ ...item, count: 1 })
    return acc
  }, [])

  const total = grouped.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/[^0-9]/g, ''))
    return sum + (isNaN(num) ? 0 : num * item.count)
  }, 0)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handlePlaceOrder = () => {
    if (!form.name || !form.email) return
    setPlaced(true)
    clearBag()
    showToast('Order placed successfully!')
    setTimeout(() => onClose(), 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', contain: 'paint layout', willChange: 'transform' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-charcoal rounded-xl w-full max-w-lg max-h-[calc(100vw*1.6)] border border-white/10 grid grid-rows-[auto_1fr] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h2 className="font-heading text-lg text-ivory tracking-wide">Checkout</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-ivory/60 hover:text-gold transition-colors"
                aria-label="Close checkout"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto min-h-0 p-5" data-lenis-prevent="true">
              {placed ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-6"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a961" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <h3 className="font-heading text-xl text-ivory mb-2">Order Confirmed</h3>
                  <p className="text-ivory/50 text-sm">Thank you for your purchase!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ivory/20 mb-4">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      <p className="text-ivory/40 text-sm mb-2">Nothing to checkout</p>
                      <p className="text-ivory/20 text-xs">Add items to your bag first</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-3">Order Summary</p>
                        <div className="space-y-3">
                          {grouped.map((item) => (
                            <div key={item.name} className="flex gap-3 bg-deep rounded-lg p-3">
                              <div className="w-14 h-16 shrink-0 bg-charcoal rounded overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h3 className="text-sm text-ivory truncate">{item.name}</h3>
                                <p className="text-gold text-xs mt-0.5">{item.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => { if (item.count <= 1) { removeFromCheckoutByName(item.name) } else { decrementFromCheckout(item.name) } }}
                                    className="w-5 h-5 rounded-full border border-white/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center"
                                  >
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                  </button>
                                  <span className="text-ivory text-xs w-3 text-center">{item.count}</span>
                                  <button
                                    onClick={() => incrementInCheckout(item)}
                                    className="w-5 h-5 rounded-full border border-white/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center"
                                  >
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFromCheckoutByName(item.name)}
                                className="flex items-center text-ivory/40 hover:text-red-400 transition-colors text-xs tracking-[0.1em] uppercase"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                          <span className="text-ivory/60 text-sm">Total</span>
                          <span className="text-gold text-lg font-heading">${total}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-3">Shipping Details</p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange('name')}
                            className="w-full bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange('email')}
                            className="w-full bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                          />
                          <textarea
                            placeholder="Shipping Address"
                            value={form.address}
                            onChange={handleChange('address')}
                            rows={2}
                            className="w-full bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-3">Payment</p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Card Number"
                            value={form.card}
                            onChange={handleChange('card')}
                            maxLength={19}
                            className="w-full bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                          />
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={form.expiry}
                              onChange={handleChange('expiry')}
                              maxLength={5}
                              className="flex-1 bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                            />
                            <input
                              type="text"
                              placeholder="CVC"
                              value={form.cvc}
                              onChange={handleChange('cvc')}
                              maxLength={4}
                              className="flex-1 bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={!form.name || !form.email}
                        className="w-full bg-gold text-deep hover:bg-ivory transition-all py-3.5 text-xs tracking-[0.2em] uppercase font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Place Order — ${total}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
