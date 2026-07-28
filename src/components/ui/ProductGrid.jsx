import React from 'react';
import { motion } from 'framer-motion';

export function ProductGrid({ products, onSelect, title, subtitle }) {
  return (
    <div className="w-full h-full overflow-y-auto overscroll-contain pb-20">
      <div className="max-w-7xl mx-auto w-full pt-12">
        <h1 className="font-heading font-bold text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-tighter uppercase mb-2 text-ivory">
          {title} <span className="text-[0.4em] align-top relative top-[0.6em] ml-2 font-mono tabular-nums lowercase text-gold">({products?.length || 0})</span>
        </h1>
        {subtitle && (
          <p className="font-heading font-bold text-[clamp(1.5rem,3vw,2rem)] leading-[0.9] tracking-tighter text-ivory/60 mb-12">
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => onSelect(product)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-charcoal mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-heading text-lg text-ivory group-hover:text-gold transition-colors">{product.name}</h3>
              <p className="text-ivory/60 text-sm mt-1">{product.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
