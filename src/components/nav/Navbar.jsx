import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import NavLinks from './NavLinks'
import NavIcons from './NavIcons'
import MobileMenu from './MobileMenu'
import { scrollToAnchor } from '../../utils/scroll'
import { womenProducts, menProducts, accessoriesProducts, newArrivalsProducts, bestSellersProducts } from '../../data/catalog'
import useMediaQuery from '../../hooks/useMediaQuery'
import ProductDetail from '../women/ProductDetail'

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFeedback, setSearchFeedback] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const searchInputRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const q = searchQuery.toLowerCase().trim()
    const allProducts = [
      ...womenProducts, ...menProducts,
      ...accessoriesProducts, ...newArrivalsProducts,
      ...bestSellersProducts,
    ]
    const matches = allProducts.filter(p => p.name.toLowerCase().includes(q))
    const uniqueMatches = Array.from(new Map(matches.map(item => [item.id, item])).values())
    setSearchResults(uniqueMatches.slice(0, 5))
  }, [searchQuery])

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', {
        y: -12,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      })
      gsap.from('.nav-underline-bar', {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out',
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="absolute inset-0 border-b backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          backgroundColor: 'rgba(217, 212, 199, 0.85)',
          borderColor: 'rgba(0, 0, 0, 0.08)',
        }}
      />

      <nav ref={navRef} className="relative z-10 flex items-center justify-between h-20 px-6 lg:px-12">
        <div className="nav-item flex items-center gap-6">
          <button
            className="lg:hidden text-ivory/80 hover:text-gold transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <span
            onClick={() => scrollToAnchor('#hero')}
            className="font-heading text-gold text-xl tracking-[0.3em] uppercase select-none cursor-pointer"
          >
            MAISON
          </span>
        </div>

        <div className="nav-item">
          <NavLinks />
        </div>

        <div className="nav-item flex items-center gap-4 relative">
          <AnimatePresence>
            {searchOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-8 mt-6 w-72 bg-charcoal border border-black/10 shadow-xl rounded-lg overflow-hidden z-[100]"
              >
                {searchResults.map(product => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-4 p-3 hover:bg-black/5 cursor-pointer transition-colors border-b border-black/5 last:border-0"
                    onClick={() => {
                       setSelectedProduct(product)
                       setSearchOpen(false)
                       setSearchQuery('')
                    }}
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-sm" />
                    <div>
                      <p className="text-ivory text-sm">{product.name}</p>
                      <p className="text-gold text-xs mt-1">{product.price}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (searchResults.length > 0) {
                        setSelectedProduct(searchResults[0])
                        setSearchOpen(false)
                        setSearchQuery('')
                        setSearchFeedback('')
                      } else if (searchQuery.trim()) {
                        setSearchFeedback('product not exist')
                        setTimeout(() => setSearchFeedback(''), 2000)
                      }
                    }
                    if (e.key === 'Escape') {
                      setSearchOpen(false)
                      setSearchQuery('')
                      setSearchFeedback('')
                      setSearchResults([])
                    }
                  }}
                  onBlur={() => setTimeout(() => { setSearchFeedback('') }, 200)}
                  placeholder="Search..."
                  className="w-36 lg:w-48 bg-transparent border-b border-white/20 text-ivory text-sm placeholder:text-ivory/30 pb-1 focus:outline-none focus:border-gold transition-colors"
                  autoFocus
                />
                {searchFeedback && (
                  <span className="absolute top-full left-0 mt-2 text-red-400 text-[11px] tracking-[0.1em] uppercase whitespace-nowrap">
                    {searchFeedback}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <NavIcons searchOpen={searchOpen} onSearchToggle={() => { setSearchOpen(p => !p); setSearchQuery('') }} />
        </div>

        <div className="nav-underline-bar absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gold/30 scale-x-0" />
      </nav>

      {isMobile ? (
        mobileMenuOpen && <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      ) : (
        <AnimatePresence>
          {mobileMenuOpen && <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </header>
  )
}
