import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message. Our concierge will reach out to you shortly.");
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-heritage-cream/30 -skew-x-12 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-heritage-brass mb-4 block">Get in Touch</span>
              <h2 className="text-4xl md:text-6xl font-serif text-heritage-charcoal mb-6 md:mb-8 leading-tight">
                Let's Start a <br /><span className="italic text-heritage-brass">Conversation</span>
              </h2>
              <p className="text-heritage-charcoal/60 text-base md:text-lg mb-8 md:mb-12 max-w-md">
                Whether you're planning a private event, inquiring about our seasonal menu, or simply wish to share your experience, we'd love to hear from you.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-heritage-cream flex items-center justify-center text-heritage-brass group-hover:bg-heritage-brass group-hover:text-white transition-all duration-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-heritage-charcoal/40 mb-1">Email Our Concierge</h4>
                    <a href="mailto:concierge@heritagehearth.com" className="text-xl font-serif hover:text-heritage-brass transition-colors">
                      concierge@heritagehearth.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-heritage-cream flex items-center justify-center text-heritage-brass group-hover:bg-heritage-brass group-hover:text-white transition-all duration-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-heritage-charcoal/40 mb-1">Direct Line</h4>
                    <a href="tel:+15558294721" className="text-xl font-serif hover:text-heritage-brass transition-colors">
                      +1 (555) 829-4721
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-heritage-cream flex items-center justify-center text-heritage-brass group-hover:bg-heritage-brass group-hover:text-white transition-all duration-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-heritage-charcoal/40 mb-1">Visit Us</h4>
                    <p className="text-xl font-serif">
                      124 Heritage Way,<br />
                      Gastronomy District, NY 10012
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex items-center gap-6">
                <a href="#" className="w-10 h-10 rounded-full border border-heritage-charcoal/10 flex items-center justify-center hover:bg-heritage-charcoal hover:text-white transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-heritage-charcoal/10 flex items-center justify-center hover:bg-heritage-charcoal hover:text-white transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-heritage-charcoal/10 flex items-center justify-center hover:bg-heritage-charcoal hover:text-white transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-heritage-cream p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[3rem] border border-heritage-charcoal/5 shadow-2xl shadow-heritage-charcoal/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-white border border-heritage-charcoal/5 rounded-2xl px-6 py-4 outline-none focus:border-heritage-brass transition-colors font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full bg-white border border-heritage-charcoal/5 rounded-2xl px-6 py-4 outline-none focus:border-heritage-brass transition-colors font-serif"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Subject</label>
                <select className="w-full bg-white border border-heritage-charcoal/5 rounded-2xl px-6 py-4 outline-none focus:border-heritage-brass transition-colors font-serif appearance-none">
                  <option>General Inquiry</option>
                  <option>Private Event</option>
                  <option>Press & Media</option>
                  <option>Careers</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Your Message</label>
                <textarea 
                  rows={6}
                  required
                  placeholder="How can we help you today?"
                  className="w-full bg-white border border-heritage-charcoal/5 rounded-2xl px-6 py-4 outline-none focus:border-heritage-brass transition-colors font-serif resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-heritage-charcoal text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-heritage-brass transition-all group overflow-hidden relative"
              >
                <span className="relative z-10 uppercase tracking-[0.2em] text-xs">Send Inquiry</span>
                <Send className="w-4 h-4 relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                <div className="absolute inset-0 bg-heritage-brass translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
