import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore, removeFromCheckoutByName, incrementInCheckout, decrementFromCheckout, clearBag, showToast } from '../../hooks/store'
import useMediaQuery from '../../hooks/useMediaQuery'

export default function CheckoutPage({ onClose }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const items = useStore(state => state.checkoutItems)
  const [placed, setPlaced] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '', expiry: '', cvc: '' })

  useEffect(() => {
    setPlaced(false)
    setForm({ name: '', email: '', address: '', card: '', expiry: '', cvc: '' })
  }, [])

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

  const [orderId, setOrderId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          items: items.map(i => ({ name: i.name, price: i.price })),
          total,
        }),
      })
      if (!res.ok) throw new Error('Order failed')
      const data = await res.json()
      setOrderId(data.orderId)
      setPlaced(true)
      clearBag()
      showToast('Order placed successfully!')
      setTimeout(() => onClose(), 3000)
    } catch {
      showToast('Order failed. Please try again.')
    }
    setSubmitting(false)
  }

  if (placed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.05 } }}
        transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[110] overflow-y-auto bg-deep pt-28 pb-32 px-6"
      style={{ contain: 'paint layout', willChange: 'transform' }}
      >
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-6"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a961" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h3 className="font-heading text-3xl text-ivory mb-3">Order Confirmed</h3>
          <p className="text-ivory/50">Thank you for your purchase!</p>
          {orderId && <p className="text-gold text-sm mt-4 font-mono tracking-wider">{orderId}</p>}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.05 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[110] overflow-y-auto bg-deep pt-28 pb-32 px-6"
      style={{ contain: 'paint layout', willChange: 'transform' }}
      data-lenis-prevent="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-ivory/60 hover:text-gold transition-colors text-sm tracking-[0.15em] uppercase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
          <h2 className="font-heading text-3xl md:text-4xl text-ivory">Checkout</h2>
          <div className="w-16" />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ivory/20 mb-4">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p className="text-ivory/40 text-lg mb-1">Nothing to checkout</p>
            <p className="text-ivory/20 text-sm">Add items to your bag first</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-5">Order Summary</p>
              <div className="space-y-3">
                {grouped.map((item) => (
                  <div key={item.name} className="flex gap-4 bg-charcoal rounded-xl p-4">
                    <div className="w-16 h-20 shrink-0 bg-white/40 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-sm text-ivory truncate">{item.name}</h3>
                      <p className="text-gold text-sm mt-0.5">{item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => { if (item.count <= 1) { removeFromCheckoutByName(item.name) } else { decrementFromCheckout(item.name) } }}
                          className="w-6 h-6 rounded-full border border-black/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <span className="text-ivory text-sm w-4 text-center font-mono">{item.count}</span>
                        <button
                          onClick={() => incrementInCheckout(item)}
                          className="w-6 h-6 rounded-full border border-black/15 text-ivory/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
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
              <div className="flex justify-between items-center mt-6 pt-5 border-t border-black/10">
                <span className="text-ivory/60">Total</span>
                <span className="text-gold text-2xl font-heading">${total}</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-charcoal rounded-xl p-6 border border-black/5">
                <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-5">Shipping Details</p>
                <div className="space-y-3.5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange('name')}
                    className="w-full bg-deep border border-black/10 rounded-lg px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="w-full bg-deep border border-black/10 rounded-lg px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <textarea
                    placeholder="Shipping Address"
                    value={form.address}
                    onChange={handleChange('address')}
                    rows={3}
                    className="w-full bg-deep border border-black/10 rounded-lg px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>

                <p className="text-ivory/50 text-xs tracking-[0.15em] uppercase mb-5 mt-8">Payment</p>
                <div className="space-y-3.5">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={form.card}
                    onChange={handleChange('card')}
                    maxLength={19}
                    className="w-full bg-deep border border-black/10 rounded-lg px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <div className="flex gap-3.5">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={handleChange('expiry')}
                      maxLength={5}
                      className="flex-1 min-w-0 bg-deep border border-black/10 rounded-lg px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={form.cvc}
                      onChange={handleChange('cvc')}
                      maxLength={4}
                      onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
                      className="flex-1 min-w-0 bg-deep border border-black/10 rounded-lg px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!form.name || !form.email}
                  className="w-full bg-gold text-deep hover:bg-ivory transition-all py-4 text-xs tracking-[0.2em] uppercase font-semibold rounded-lg mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Place Order — ${total}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
