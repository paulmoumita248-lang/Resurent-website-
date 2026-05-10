import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../constants';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[1]);

  return (
    <section id="menu" className="py-16 md:py-24 bg-heritage-cream/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-heritage-brass mb-4 block underline underline-offset-8">Curated Selection</span>
          <h2 className="text-3xl md:text-6xl font-serif text-heritage-charcoal italic leading-tight">The Heritage Palette</h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 md:mb-20">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 sm:px-8 py-1.5 sm:py-3 rounded-full text-[10px] sm:text-sm font-medium transition-all ${activeCategory === cat ? 'bg-heritage-charcoal text-white shadow-xl' : 'bg-white text-heritage-charcoal/60 hover:bg-heritage-charcoal/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20"
          >
            {MENU_ITEMS.filter(item => item.category === activeCategory).map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col gap-2 sm:gap-4 group"
              >
                <div className="flex justify-between items-end border-b border-heritage-charcoal/10 pb-2 sm:pb-4 relative">
                  <h4 className="text-lg sm:text-2xl font-serif text-heritage-charcoal group-hover:text-heritage-brass transition-colors">{item.name}</h4>
                  <div className="h-[1px] flex-grow mx-2 sm:mx-4 bg-heritage-charcoal/5 group-hover:bg-heritage-brass/20 transition-all origin-left mb-2" />
                  <span className="text-base sm:text-xl font-serif text-heritage-brass">{item.price}</span>
                </div>
                <p className="text-xs sm:text-sm text-heritage-charcoal/50 leading-relaxed italic pr-4 sm:pr-20">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 md:mt-24 text-center">
          <button className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold border-b-2 border-heritage-brass pb-2 hover:text-heritage-brass transition-colors">Download Full Menu PDF</button>
        </div>
      </div>
    </section>
  );
}
