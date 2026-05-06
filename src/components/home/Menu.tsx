import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../constants';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[1]);

  return (
    <section id="menu" className="py-24 bg-heritage-cream/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-heritage-brass mb-4 block underline underline-offset-8">Curated Selection</span>
          <h2 className="text-5xl md:text-6xl font-serif text-heritage-charcoal italic leading-tight">The Heritage Palette</h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-heritage-charcoal text-white shadow-xl' : 'bg-white text-heritage-charcoal/60 hover:bg-heritage-charcoal/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <AnimatePresence mode="wait">
            {MENU_ITEMS.filter(item => item.category === activeCategory).map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4 group"
              >
                <div className="flex justify-between items-end border-b border-heritage-charcoal/10 pb-4 relative">
                  <h4 className="text-2xl font-serif text-heritage-charcoal group-hover:text-heritage-brass transition-colors">{item.name}</h4>
                  <div className="h-[1px] flex-grow mx-4 bg-heritage-charcoal/5 group-hover:bg-heritage-brass/20 transition-all origin-left mb-2" />
                  <span className="text-xl font-serif text-heritage-brass">{item.price}</span>
                </div>
                <p className="text-sm text-heritage-charcoal/50 leading-relaxed italic pr-20">{item.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-24 text-center">
          <button className="text-xs uppercase tracking-[0.4em] font-bold border-b-2 border-heritage-brass pb-2 hover:text-heritage-brass transition-colors">Download Full Menu PDF</button>
        </div>
      </div>
    </section>
  );
}
