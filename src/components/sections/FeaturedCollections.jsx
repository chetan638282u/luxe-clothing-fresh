import { scrollToAnchor } from '../../utils/scroll'
import { CollectionSurfer } from '../ui/CollectionSurfer'

const collections = [
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format',
    id: 'women',
  },
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&q=80&auto=format',
    id: 'men',
  },
  {
    name: 'Accessories',
    image: '/outfit-Accessories.jpg',
    id: 'accessories',
  },
  {
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80&auto=format',
    id: 'newarrivals',
  },
]

export default function FeaturedCollections() {
  const handleSelect = (item) => {
    if (item.id === 'women') {
      window.dispatchEvent(new Event('open-women-collection'))
    } else if (item.id === 'men') {
      window.dispatchEvent(new Event('open-men-collection'))
    } else if (item.id === 'accessories') {
      window.dispatchEvent(new Event('open-accessories-collection'))
    } else if (item.id === 'newarrivals') {
      window.dispatchEvent(new Event('open-newarrivals-collection'))
    }
  }

  return (
    <section id="collections" className="w-full">
      <CollectionSurfer 
        items={collections} 
        onSelect={handleSelect} 
        title="COLLECTIONS" 
        subtitle="CURATED" 
        pageScroll={true}
      />
    </section>
  )
}
