import React from 'react';
import { motion } from 'motion/react';
import { SEATING_AREAS } from '../../constants';
import { ArrowRight, Users } from 'lucide-react';

export default function DiningAreas() {
  return (
    <section id="areas" className="py-24 bg-heritage-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-heritage-brass mb-4 block">Spatial Experience</span>
            <h2 className="text-5xl font-serif text-white leading-tight">Define Your <span className="italic text-heritage-brass">Atmosphere</span></h2>
          </div>
          <p className="text-white/40 text-sm max-w-[300px] leading-relaxed mb-2">
            Each area of our estate offers a distinct sensory journey through time and design.
          </p>
        </div>

        <div className="flex flex-col space-y-32">
          {SEATING_AREAS.map((area, i) => (
            <motion.div 
              key={area.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              <div className="w-full lg:w-3/5 relative">
                <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl group">
                  <img src={area.imageUrl} alt={area.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-heritage-charcoal/20 group-hover:bg-transparent transition-all" />
                </div>
                {/* Decorative floating info */}
                <div className={`absolute -bottom-8 ${i % 2 === 0 ? '-right-8' : '-left-8'} bg-white p-6 rounded-2xl shadow-xl hidden md:block`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-heritage-brass" />
                    <span className="font-serif text-2xl">{area.capacity} Pax</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-heritage-charcoal/40 font-bold">Capacity Limit</p>
                </div>
              </div>

              <div className="w-full lg:w-2/5 space-y-6">
                <span className="text-xs font-mono text-heritage-brass opacity-50 italic">Location 0{i + 1}</span>
                <h3 className="text-4xl font-serif text-white">{area.name}</h3>
                <p className="text-white/60 leading-relaxed text-lg italic">{area.description}</p>
                <div className="pt-6">
                  <button className="flex items-center gap-3 text-white text-xs uppercase tracking-[0.4em] font-bold group">
                    View Gallery <ArrowRight className="w-4 h-4 text-heritage-brass group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
