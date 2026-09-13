import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addToBag, setCheckoutItems, showToast } from '../../hooks/store'
import { womenProducts, menProducts, accessoriesProducts, newArrivalsProducts, bestSellersProducts } from '../../data/catalog'

const allProducts = [
  ...womenProducts,
  ...menProducts,
  ...accessoriesProducts,
  ...newArrivalsProducts,
  ...bestSellersProducts,
]

// Get unique products by name to avoid duplicates in related section
const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.name, item])).values())

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductPage({ productSlug }) {
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  useEffect(() => {
    // Find product by matching slugified name
    const foundProduct = allProducts.find(
      p => p.name.replace(/\s+/g, '-').toLowerCase() === productSlug
    )
    
    if (foundProduct) {
      setProduct(foundProduct)
      
      // Get 4 random related products (excluding current one)
      const others = uniqueProducts.filter(p => p.name !== foundProduct.name)
      setRelatedProducts(others.slice(0, 4))
    }
  }, [productSlug])

  // Scroll to top when product changes
  useEffect(() => {
    const scrollToTop = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }

    scrollToTop()
    requestAnimationFrame(scrollToTop)
    const timer = setTimeout(scrollToTop, 100)
    
    return () => clearTimeout(timer)
  }, [productSlug])

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center text-ivory">
        <p>Product not found.</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToBag({ ...product, size: selectedSize })
    showToast(`${qty} × ${product.name} (${selectedSize}) added to Bag`)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToBag({ ...product, size: selectedSize })
    setCheckoutItems(Array.from({ length: qty }, () => ({ name: product.name, price: product.price, image: product.image, size: selectedSize })))
    window.dispatchEvent(new Event('open-checkout'))
  }

  const handleProductClick = (prod) => {
    const slug = prod.name.replace(/\s+/g, '-').toLowerCase()
    window.location.hash = '#product/' + slug
  }

  // Calculate a consistent, varying discount percentage for demonstration purposes
  const numericPrice = parseFloat(product.price.replace('$', '').replace(/,/g, '')) || 0
  
  // Only apply a discount to some products to show variety
  const hasDiscount = product.name.length % 2 === 0
  // Generate a different percentage (10%, 20%, 30%, or 40%) based on the product name
  const discountPercentage = product.discountPercentage || (hasDiscount ? 10 + (product.name.length % 4) * 10 : 0)
  
  const originalPrice = discountPercentage ? Math.floor(numericPrice / (1 - discountPercentage / 100)) : null

  return (
    <>
      <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-ivory">
      
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-charcoal">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
          {product.season && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-50 text-rose-900 text-xs font-medium tracking-wide">
                ✨ {product.season.charAt(0).toUpperCase() + product.season.slice(1)} Collection
              </span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-heading mb-2">{product.name}</h1>
          <p className="text-ivory/70 text-sm mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-medium">{product.price}</span>
            {originalPrice && (
              <>
                <span className="text-ivory/50 line-through">${originalPrice}</span>
                <span className="text-[#b3401e] text-sm font-medium">{discountPercentage}% OFF</span>
              </>
            )}
          </div>
          <p className="text-xs text-ivory/50 mb-8">(inclusive of all taxes)</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Select size</span>
            <button 
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-gold underline underline-offset-4 hover:text-ivory transition-colors"
            >
              Size guide
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`border rounded-sm py-2 px-4 text-sm transition-colors ${
                  selectedSize === s 
                    ? 'border-gold text-gold bg-gold/10' 
                    : 'border-ivory/20 text-ivory/80 hover:border-ivory/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium">Qty:</span>
            <div className="border border-ivory/20 rounded-sm flex items-center">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1.5 text-ivory/70 hover:text-white transition-colors"
              >−</button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1.5 text-ivory/70 hover:text-white transition-colors"
              >+</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full">
            <button 
              onClick={handleAddToCart}
              className="w-full sm:flex-1 bg-[#b3401e] hover:bg-[#963519] text-white py-3.5 px-6 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Add To Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full sm:flex-1 border border-ivory text-ivory hover:bg-ivory hover:text-deep py-3.5 px-6 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
          </div>

          {/* Shop With Confidence */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Shop with confidence
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>Loved by 10,000+ customers globally</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>5 countries served seamlessly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>Trusted in fashion for 20 years</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>Personalized styling assistance included</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>100% Authentic designer labels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>Exclusive member benefits & rewards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ivory/50 mt-0.5">•</span>
                <span>Best coupons and seasonal offers</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="mt-32 border-t border-ivory/10 pt-16">
        <h2 className="text-2xl font-heading mb-8">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map(prod => (
            <div 
              key={prod.id} 
              onClick={() => handleProductClick(prod)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden rounded bg-charcoal mb-4 relative">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium text-sm md:text-base text-ivory/90 group-hover:text-gold transition-colors">{prod.name}</h3>
              <p className="text-black font-semibold text-sm mt-1">{prod.price}</p>
            </div>
          ))}
        </div>
      </div>

    </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-deep border border-ivory/20 rounded-lg p-6 max-w-2xl w-full text-ivory max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading">Size Guide (US Standard)</h2>
                <button 
                  onClick={() => setShowSizeGuide(false)}
                  className="text-ivory/60 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/40 text-ivory/70">
                    <tr>
                      <th className="px-4 py-3 rounded-tl">Size</th>
                      <th className="px-4 py-3">US Size</th>
                      <th className="px-4 py-3">Chest (in)</th>
                      <th className="px-4 py-3">Waist (in)</th>
                      <th className="px-4 py-3 rounded-tr">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory/10">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-gold">S</td>
                      <td className="px-4 py-3">4 - 6</td>
                      <td className="px-4 py-3">34 - 35</td>
                      <td className="px-4 py-3">26 - 27</td>
                      <td className="px-4 py-3">36 - 37</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-gold">M</td>
                      <td className="px-4 py-3">8 - 10</td>
                      <td className="px-4 py-3">36 - 37</td>
                      <td className="px-4 py-3">28 - 29</td>
                      <td className="px-4 py-3">38 - 39</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-gold">L</td>
                      <td className="px-4 py-3">12 - 14</td>
                      <td className="px-4 py-3">38 - 40</td>
                      <td className="px-4 py-3">30 - 32</td>
                      <td className="px-4 py-3">40 - 42</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-gold">XL</td>
                      <td className="px-4 py-3">16 - 18</td>
                      <td className="px-4 py-3">41 - 43</td>
                      <td className="px-4 py-3">33 - 35</td>
                      <td className="px-4 py-3">43 - 45</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-gold">XXL</td>
                      <td className="px-4 py-3">20 - 22</td>
                      <td className="px-4 py-3">44 - 46</td>
                      <td className="px-4 py-3">36 - 38</td>
                      <td className="px-4 py-3">46 - 48</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-ivory/50">Measurements are shown in inches. If you are between sizes, we recommend sizing up for a more relaxed fit.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
