import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/nav'
import Hero from './components/hero'
import Sections from './components/sections'
import Footer from './components/footer'
import Chatbot from './components/chat'
import WomenCollection from './components/women'
import MenCollection from './components/men'
import AccessoriesCollection from './components/accessories'
import NewArrivalsCollection from './components/newarrivals'
import WishlistPanel from './components/nav/WishlistPanel'
import CartPanel from './components/nav/CartPanel'
import CheckoutPage from './components/checkout'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { womenProducts, menProducts, accessoriesProducts, newArrivalsProducts, bestSellersProducts } from './data/catalog'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

function App() {
  const [toast, setToast] = useState({ show: false, message: '' })
  const [showWomen, setShowWomen] = useState(false)
  const [showMen, setShowMen] = useState(false)
  const [showAccessories, setShowAccessories] = useState(false)
  const [showNewArrivals, setShowNewArrivals] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      const msg = typeof e.detail === 'string' ? e.detail : ''
      setToast({ show: true, message: msg })
      setTimeout(() => setToast({ show: false, message: '' }), 2500)
    }
    window.addEventListener('toast-show', handler)
    return () => window.removeEventListener('toast-show', handler)
  }, [])

  // Preload all product images to ensure they display instantly when a collection is opened
  useEffect(() => {
    const allProducts = [
      ...womenProducts,
      ...menProducts,
      ...accessoriesProducts,
      ...newArrivalsProducts,
      ...bestSellersProducts,
    ]
    // Extract unique image URLs
    const imageUrls = [...new Set(allProducts.map(p => p.image))]
    
    // Silently preload them in the background
    imageUrls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }, [])

  useEffect(() => {
    // Only enable smooth scrolling on desktop devices
    if (window.innerWidth < 1024) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const scrollFn = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(scrollFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(scrollFn)
    }
  }, [])

  useEffect(() => {
    const isOverlayOpen = showWomen || showMen || showAccessories || showNewArrivals || showCheckout || wishlistOpen || cartOpen;
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showWomen, showMen, showAccessories, showNewArrivals, showCheckout, wishlistOpen, cartOpen]);

  useEffect(() => {
    const syncFromHash = () => {
      const search = new URLSearchParams(window.location.search)
      const view = search.get('view') || ''
      const hash = view.split('/')[0]
      setShowWomen(hash === 'women')
      setShowMen(hash === 'men')
      setShowAccessories(hash === 'accessories')
      setShowNewArrivals(hash === 'newarrivals')
      setShowCheckout(hash === 'checkout')
      setCartOpen(hash === 'cart')
      setWishlistOpen(hash === 'wishlist')
    }
    syncFromHash()
    window.addEventListener('popstate', syncFromHash)
    return () => window.removeEventListener('popstate', syncFromHash)
  }, [])

  useEffect(() => {
    const pushView = (view) => {
      window.history.pushState({}, '', `?view=${view}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    const openW = () => pushView('women')
    const closeW = () => window.history.back()
    const openM = () => pushView('men')
    const closeM = () => window.history.back()
    const openA = () => pushView('accessories')
    const closeA = () => window.history.back()
    const openNA = () => pushView('newarrivals')
    const closeNA = () => window.history.back()
    const openWL = () => pushView('wishlist')
    const openCart = () => pushView('cart')
    const openCheckout = () => pushView('checkout')
    const closeCheckout = () => window.history.back()
    window.addEventListener('open-women-collection', openW)
    window.addEventListener('close-women-collection', closeW)
    window.addEventListener('open-men-collection', openM)
    window.addEventListener('close-men-collection', closeM)
    window.addEventListener('open-accessories-collection', openA)
    window.addEventListener('close-accessories-collection', closeA)
    window.addEventListener('open-newarrivals-collection', openNA)
    window.addEventListener('close-newarrivals-collection', closeNA)
    window.addEventListener('open-wishlist', openWL)
    window.addEventListener('open-cart', openCart)
    window.addEventListener('open-checkout', openCheckout)
    window.addEventListener('close-checkout', closeCheckout)
    return () => {
      window.removeEventListener('open-women-collection', openW)
      window.removeEventListener('close-women-collection', closeW)
      window.removeEventListener('open-men-collection', openM)
      window.removeEventListener('close-men-collection', closeM)
      window.removeEventListener('open-accessories-collection', openA)
      window.removeEventListener('close-accessories-collection', closeA)
      window.removeEventListener('open-newarrivals-collection', openNA)
      window.removeEventListener('close-newarrivals-collection', closeNA)
      window.removeEventListener('open-wishlist', openWL)
      window.removeEventListener('open-cart', openCart)
      window.removeEventListener('open-checkout', openCheckout)
      window.removeEventListener('close-checkout', closeCheckout)
    }
  }, [])



  return (
    <div className="min-h-screen bg-deep text-ivory font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Navbar />
        <Hero />
        <Sections />
        <Footer />
      </motion.div>


      {showWomen && (
        <WomenCollection
          key="women"
          hash="women"
          onClose={() => window.dispatchEvent(new Event('close-women-collection'))}
        />
      )}
      {showMen && (
        <MenCollection
          key="men"
          hash="men"
          onClose={() => window.dispatchEvent(new Event('close-men-collection'))}
        />
      )}
      {showAccessories && (
        <AccessoriesCollection
          key="accessories"
          hash="accessories"
          onClose={() => window.dispatchEvent(new Event('close-accessories-collection'))}
        />
      )}
      {showNewArrivals && (
        <NewArrivalsCollection
          key="newarrivals"
          hash="newarrivals"
          onClose={() => window.dispatchEvent(new Event('close-newarrivals-collection'))}
        />
      )}
      {showCheckout && (
        <CheckoutPage
          key="checkout"
          onClose={() => window.dispatchEvent(new Event('close-checkout'))}
        />
      )}

      <Chatbot />

      <WishlistPanel open={wishlistOpen} onClose={() => window.history.length > 1 ? window.history.back() : (window.history.replaceState({}, '', window.location.pathname), window.dispatchEvent(new PopStateEvent('popstate')))} />
      <CartPanel open={cartOpen} onClose={() => window.history.length > 1 ? window.history.back() : (window.history.replaceState({}, '', window.location.pathname), window.dispatchEvent(new PopStateEvent('popstate')))} />

      <AnimatePresence>
        {toast.show && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-3 rounded-lg text-sm text-ivory/90 whitespace-nowrap"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
