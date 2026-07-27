import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CollectionSurfer } from '../ui/CollectionSurfer'
import ProductDetail from '../women/ProductDetail'
import { bestSellersProducts, newArrivalsProducts } from '../../data/catalog'

// Combine and pick some top products to feature
const featuredProducts = [
  ...bestSellersProducts.slice(0, 4),
  ...newArrivalsProducts.slice(0, 4)
].map(p => ({ ...p, category: p.category || 'Featured' }))

export default function FeaturedCollections() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      <section id="collections" className="relative w-full h-[80vh] md:h-[90vh]">
        <CollectionSurfer 
          items={featuredProducts} 
          onSelect={setSelectedProduct} 
          title="FEATURED" 
          subtitle="COLLECTION" 
        />
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
