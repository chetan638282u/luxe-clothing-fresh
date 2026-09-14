import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useStore, 
  removeFromCheckoutByNameAndSize, 
  incrementInCheckout, 
  decrementFromCheckoutByKey, 
  clearBag, 
  showToast,
  toggleWishlist,
  isWishlisted,
  addToBag
} from '../../hooks/store'
import useMediaQuery from '../../hooks/useMediaQuery'
import { womenProducts, menProducts, accessoriesProducts, newArrivalsProducts, bestSellersProducts } from '../../data/catalog'

const allProducts = [
  ...womenProducts, ...menProducts, ...accessoriesProducts, ...newArrivalsProducts, ...bestSellersProducts
]
const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.name, p])).values())

export default function CheckoutPage({ onClose }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const items = useStore(state => state.checkoutItems)
  const wishlist = useStore(state => state.wishlist) // trigger re-render for wishlist icons
  const [placed, setPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [activeTab, setActiveTab] = useState('best-paired')
  const [randomProducts, setRandomProducts] = useState([])
  const [includeKit, setIncludeKit] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const kitPrice = 9

  useEffect(() => {
    setPlaced(false)
    setOrderId('')
    const shuffled = [...uniqueProducts].sort(() => 0.5 - Math.random())
    setRandomProducts(shuffled.slice(0, 4))
  }, [])

  const grouped = items

  const rawTotal = grouped.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/[^0-9]/g, ''))
    return sum + (num * (item.count || 1))
  }, 0)

  const discount = Math.floor(rawTotal * 0.15)
  const total = rawTotal - discount + (includeKit ? kitPrice : 0)

  const handleProceedToAddress = () => {
    setShowAddressForm(true)
  }

  const handleFinalPlaceOrder = (e) => {
    e.preventDefault()
    const id = Math.random().toString(36).substring(2, 10).toUpperCase()
    setOrderId(id)
    setShowAddressForm(false)
    setPlaced(true)
    setTimeout(() => {
      clearBag()
      onClose()
      showToast(`Order ${id} placed successfully!`)
    }, 3000)
  }

  const handleMoveToWishlist = (item) => {
    if (!isWishlisted(item.name)) {
      toggleWishlist(item)
    }
    removeFromCheckoutByNameAndSize(item.name, item.size)
    showToast(`${item.name} moved to Wishlist`)
  }

  const handleAddToCart = (product) => {
    addToBag({ ...product, size: 'M' })
    showToast(`${product.name} added to Bag`)
  }

  if (placed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-deep flex items-center justify-center"
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
    <>
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-deep/80 backdrop-blur-md overflow-y-auto p-4 flex"
            style={{ contain: 'paint layout', willChange: 'transform' }}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-charcoal border border-ivory/10 rounded-xl p-6 w-full max-w-lg relative m-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-2xl text-ivory">Delivery Address</h3>
                <button onClick={() => setShowAddressForm(false)} className="text-ivory/50 hover:text-ivory">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <form onSubmit={handleFinalPlaceOrder} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/70 mb-1">First Name</label>
                    <input required type="text" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-ivory/70 mb-1">Last Name</label>
                    <input required type="text" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-ivory/70 mb-1">Phone Number</label>
                  <input required type="tel" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                </div>

                <div>
                  <label className="block text-ivory/70 mb-1">Street Address</label>
                  <input required type="text" placeholder="House number and street name" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold mb-3" />
                  <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/70 mb-1">City</label>
                    <input required type="text" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-ivory/70 mb-1">State</label>
                    <input required type="text" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-ivory/70 mb-1">ZIP / Postal Code</label>
                  <input required type="text" className="w-full bg-deep border border-ivory/20 rounded-lg p-3 text-ivory focus:outline-none focus:border-gold" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b3401e] text-white hover:bg-[#963519] transition-all py-4 px-4 text-xs tracking-widest uppercase font-bold rounded-lg mt-6 shadow-lg"
                >
                  PLACE ORDER (${total.toLocaleString()})
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } : { display: 'none', opacity: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[110] bg-deep flex flex-col"
      style={{ contain: 'paint layout', willChange: 'transform' }}
    >
      <div className={`flex-1 ${showAddressForm ? 'overflow-hidden' : 'overflow-y-auto'} pt-20 pb-8 px-4 md:px-8`} data-lenis-prevent="true">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-ivory/60 hover:text-gold transition-colors text-sm tracking-[0.15em] uppercase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: ITEMS & TABS */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Header: My Bag */}
              <div className="flex justify-between items-end border-b border-ivory/10 pb-4">
                <h2 className="font-heading text-2xl md:text-3xl text-ivory">
                  My Bag <span className="text-lg md:text-xl text-ivory/60 font-sans tracking-normal">({grouped.length} Items)</span>
                </h2>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {grouped.map((item, idx) => {
                  const originalPrice = parseInt(item.price.replace(/[^0-9]/g, ''))
                  const discountedPrice = Math.floor(originalPrice * 0.85) // 15% off local to item
                  return (
                    <div key={`${item.name}-${item.size}-${idx}`} className="bg-charcoal border border-ivory/5 rounded-xl p-4 md:p-5 flex flex-row gap-6 md:gap-8 relative">
                      {/* Image */}
                      <div className="w-36 md:w-44 shrink-0 bg-white/40 rounded-lg overflow-hidden self-stretch">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"  />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg text-ivory font-medium">{item.name}</h3>
                            {/* Action Buttons (Desktop) */}
                            <div className="hidden md:flex items-center gap-4 text-xs text-ivory/60">
                              <button onClick={() => removeFromCheckoutByNameAndSize(item.name, item.size)} className="flex items-center gap-1.5 hover:text-red-400 transition-colors uppercase tracking-wider">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                Remove
                              </button>
                              <button onClick={() => handleMoveToWishlist(item)} className="flex items-center gap-1.5 hover:text-gold transition-colors uppercase tracking-wider">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(item.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                Move to Wishlist
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-ivory/70 mb-2">Luxe Designer Collection</p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ivory/70 mb-3">
                            <span>Color: <span className="text-ivory">Standard</span></span>
                            <span>Size: <span className="text-ivory">{item.size}</span></span>
                            <button className="underline underline-offset-2 hover:text-ivory transition-colors">Add Details</button>
                          </div>

                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-ivory/50 text-sm line-through">${originalPrice.toLocaleString()}</span>
                            <span className="text-ivory font-bold text-lg">${discountedPrice.toLocaleString()}</span>
                            <span className="text-[#b3401e] text-xs font-semibold tracking-wide">(15% OFF)</span>
                          </div>
                        </div>

                        {/* Footer area of card */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-ivory/70">Qty:</span>
                            <div className="flex items-center border border-ivory/20 rounded-md">
                              <button onClick={() => { if ((item.count || 1) <= 1) { removeFromCheckoutByNameAndSize(item.name, item.size) } else { decrementFromCheckoutByKey(item.name, item.size) } }} className="w-8 h-8 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors">
                                -
                              </button>
                              <span className="text-ivory text-sm w-6 text-center font-mono">{item.count || 1}</span>
                              <button onClick={() => incrementInCheckout(item)} className="w-8 h-8 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors">
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-ivory/50 space-y-1">
                            <p className="flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              Standard Delivery by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                              2 days return/exchange available
                            </p>
                          </div>
                        </div>


                        {/* Action Buttons (Mobile) */}
                        <div className="flex flex-wrap md:hidden items-center gap-3 mt-4 pt-4 border-t border-ivory/10 text-[10px] text-ivory/60">
                          <button onClick={() => removeFromCheckoutByNameAndSize(item.name, item.size)} className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase tracking-wider">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            Remove
                          </button>
                          <button onClick={() => handleMoveToWishlist(item)} className="flex items-center gap-1 hover:text-gold transition-colors uppercase tracking-wider">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill={isWishlisted(item.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* Event Box */}
              <div className="bg-charcoal border border-ivory/10 rounded-xl overflow-hidden transition-all">
                <button 
                  onClick={() => setShowEventDetails(!showEventDetails)}
                  className="w-full p-4 flex justify-between items-center text-sm hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <span className="text-ivory/90 font-medium">Ordering this for an event?</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-ivory/50 transition-transform ${showEventDetails ? 'rotate-180' : ''}`}><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <AnimatePresence>
                  {showEventDetails && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="p-3 bg-deep rounded-lg text-sm text-ivory/80 border border-ivory/5">
                        <p className="mb-2 text-ivory">Let us know the date of your event!</p>
                        <input type="date" className="w-full bg-charcoal border border-ivory/20 rounded p-2 text-ivory text-sm focus:outline-none focus:border-gold/50 mb-2" />
                        <p className="text-xs text-ivory/60">We prioritize event orders to ensure your items arrive on time. You can also add personalized gift wrapping on the next step.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Coupon Box */}
              <div className="bg-charcoal border border-ivory/10 rounded-xl overflow-hidden transition-all">
                <button 
                  onClick={() => setShowCouponInput(!showCouponInput)}
                  className="w-full p-4 flex justify-between items-center text-sm hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b3401e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                    <span className="text-ivory/90 font-medium uppercase tracking-wide text-xs">Apply Coupon</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-ivory/50 transition-transform ${showCouponInput ? 'rotate-180' : ''}`}><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <AnimatePresence>
                  {showCouponInput && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter coupon code" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-deep border border-ivory/20 rounded p-2 text-ivory text-sm focus:outline-none focus:border-[#b3401e] uppercase tracking-wider"
                        />
                        <button className="bg-[#b3401e] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#963519] transition-colors">
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Details Card */}
              <div className="bg-charcoal border border-ivory/10 rounded-xl p-5 md:p-6 mt-2">
                <h4 className="text-ivory font-medium mb-5">Price Details</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-ivory/70">Bag Total</span>
                    <span className="text-ivory">${rawTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#b3401e]">
                    <span>Luxe Discount</span>
                    <span>- ${discount.toLocaleString()}</span>
                  </div>
                  
                  {/* Kit Checkbox */}
                  <label className="flex justify-between items-center cursor-pointer border border-ivory/10 rounded-lg p-3 mt-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-ivory/90">Travel & Storage Kit</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ivory/50"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-ivory">${kitPrice.toLocaleString()}</span>
                      <input 
                        type="checkbox" 
                        checked={includeKit} 
                        onChange={(e) => setIncludeKit(e.target.checked)}
                        className="w-4 h-4 accent-[#b3401e] rounded bg-transparent border-ivory/30"
                      />
                    </div>
                  </label>
                  
                  <div className="flex justify-center mt-2 mb-4">
                    <span className="text-xs font-semibold tracking-widest text-[#b3401e] uppercase flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      Free Shipping!!!
                    </span>
                  </div>
                </div>

                <div className="border-t border-ivory/10 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-ivory font-semibold">Total Payable</span>
                    <span className="text-ivory font-bold">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#b3401e] font-medium">
                    <span>Your Total Savings</span>
                    <span>${discount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-center mt-6 mb-2">
                  <button className="text-xs text-ivory/70 underline hover:text-ivory transition-colors">Add Gift Card</button>
                </div>
                
                <div className="bg-[#b3401e]/10 border border-[#b3401e]/20 rounded-lg p-3 flex justify-center items-center gap-2 mt-4 cursor-pointer hover:bg-[#b3401e]/20 transition-colors text-[#b3401e] text-xs font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Login to Redeem Wallet / Cash / Gift Card
                </div>

                <button
                  onClick={handleProceedToAddress}
                  className="hidden md:flex w-full bg-[#b3401e] text-white hover:bg-[#963519] transition-all py-4 px-4 text-xs tracking-widest uppercase font-bold rounded-lg mt-5 justify-center items-center shadow-lg"
                >
                  PROCEED TO ADD ADDRESS
                </button>
              </div>
              
              <div className="flex justify-center items-center gap-2 text-[10px] text-ivory/40 uppercase tracking-widest mt-2 text-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </div>

            </div>
          </div>
        )}
      </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      {items.length > 0 && (
        <div className="md:hidden shrink-0 bg-deep border-t border-ivory/10 p-4 z-[90]">
          <button
            onClick={handleProceedToAddress}
            className="w-full bg-[#b3401e] text-white hover:bg-[#963519] transition-all py-4 px-4 text-xs tracking-widest uppercase font-bold rounded-lg flex justify-center items-center shadow-lg"
          >
            PROCEED TO ADD ADDRESS
          </button>
        </div>
      )}
    </motion.div>
    </>
  )
}
