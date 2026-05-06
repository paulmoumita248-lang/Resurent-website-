import React from 'react';
import { motion } from 'motion/react';
import { History, Award, Heart } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80" 
                alt="Chef at work" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-heritage-charcoal/10" />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 bg-heritage-brass p-10 rounded-[2rem] shadow-xl text-white hidden md:block">
              <span className="text-5xl font-serif italic mb-2 block">100+</span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">Years of Excellence</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-heritage-brass mb-6 block">Our Story</span>
            <h2 className="text-5xl md:text-6xl font-serif text-heritage-charcoal mb-8 leading-tight">
              Honoring the <span className="italic">Past</span>, Tasting the <span className="text-heritage-brass italic">Future.</span>
            </h2>
            <p className="text-heritage-charcoal/70 text-lg mb-10 leading-relaxed">
              Founded in the golden age of hospitality, Heritage Hearth has stood as a beacon of culinary craftsmanship for over a century. From our humble beginnings as a family tavern to a world-renowned destination, our soul remains unchanged: a commitment to ingredients with stories and recipes with history.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: History, title: 'Preserved Legacy', text: 'Original family recipes passed down through 5 generations.' },
                { icon: Award, title: 'Culinary Craft', text: 'Modern techniques applied to heritage ingredients.' },
                { icon: Heart, title: 'Authentic Soul', text: 'Farm-to-table sourcing from long-term heritage partners.' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="p-3 bg-heritage-cream w-fit rounded-xl">
                    <item.icon className="w-6 h-6 text-heritage-brass" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-heritage-charcoal">{item.title}</h4>
                  <p className="text-sm text-heritage-charcoal/60 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
