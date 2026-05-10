import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';

export default function Hero({ onBookClick }: { onBookClick: () => void }) {
  const videoSource = "/Hand_pour_sauce_on_lamb_202605071246.mp4";
  const fallbackImage = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80";

  return (
    <section id="home" className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden bg-heritage-charcoal py-12 md:py-0">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          key={videoSource}
          autoPlay 
          muted 
          loop 
          playsInline 
          webkit-playsinline="true"
          preload="auto"
          poster={fallbackImage}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-charcoal via-heritage-charcoal/60 to-transparent" />
        <div className="absolute inset-0 bg-heritage-charcoal/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <span className="w-8 h-px bg-heritage-brass"></span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-bold text-heritage-brass">Since 1925 • Michelin Starred</span>
            </div>
            
            <h1 className="text-2xl sm:text-6xl md:text-8xl font-serif text-white mb-4 md:mb-8 leading-tight tracking-tight">
              Where <span className="italic font-normal">Heritage</span> Meets <br className="hidden sm:block" />
              <span className="text-heritage-brass">Modernity.</span>
            </h1>

            <p className="text-heritage-cream/70 text-sm md:text-lg mb-6 md:mb-12 leading-relaxed max-w-md">
              A culinary sanctuary preserved in time, reinvented for the contemporary palate. Experience the legacy of flavors passed down through generations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center sm:items-start w-full sm:w-auto">
              <button 
                onClick={onBookClick}
                className="w-full sm:w-auto bg-heritage-brass text-white px-6 md:px-10 py-3.5 md:py-5 rounded-full font-semibold hover:bg-white hover:text-heritage-charcoal transition-all flex items-center justify-center gap-3 group text-sm md:text-base"
              >
                Reserve Your Table <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-4 py-2 sm:py-0">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-heritage-charcoal bg-heritage-brass/20" />
                  ))}
                </div>
                <div>
                  <div className="flex text-heritage-brass mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Recommended by 2k+ Diners</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Rail Text */}
      <div className="absolute right-8 bottom-0 h-1/2 flex items-end justify-center pointer-events-none hidden lg:flex">
        <span className="writing-vertical-rl text-[8vw] font-serif text-white/5 uppercase select-none font-black italic">Heritage</span>
      </div>
    </section>
  );
}
