import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-heritage-charcoal text-heritage-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif font-bold mb-6 italic">Heritage <span className="text-heritage-brass">Hearth</span></h2>
            <p className="text-heritage-cream/60 max-w-sm mb-8 leading-relaxed">
              Preserving tradition through culinary excellence. Join us for an unforgettable journey through flavors that span generations, served in a setting that honors history.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 border border-heritage-cream/20 rounded-full hover:bg-heritage-brass transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 border border-heritage-cream/20 rounded-full hover:bg-heritage-brass transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 border border-heritage-cream/20 rounded-full hover:bg-heritage-brass transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-heritage-cream/60 text-sm">
                <MapPin className="w-5 h-5 text-heritage-brass shrink-0" />
                <span>123 Historic Drive,<br />Old Town, Heritage District</span>
              </li>
              <li className="flex items-center gap-3 text-heritage-cream/60 text-sm">
                <Phone className="w-5 h-5 text-heritage-brass shrink-0" />
                <span>+1 (555) 482-1925</span>
              </li>
              <li className="flex items-center gap-3 text-heritage-cream/60 text-sm">
                <Mail className="w-5 h-5 text-heritage-brass shrink-0" />
                <span>concierge@heritagehearth.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Opening Hours</h3>
            <ul className="space-y-4 text-heritage-cream/60 text-sm">
              <li className="flex justify-between">
                <span>Mon - Thu</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between font-bold text-heritage-brass">
                <span>Fri - Sat</span>
                <span>11:00 AM - 11:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 09:00 PM</span>
              </li>
              <li className="mt-4 italic text-xs opacity-50">Last seating 1 hour before closing</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-heritage-cream/40">
          <p>© 2026 Heritage Hearth. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-heritage-brass">Privacy Policy</a>
            <a href="#" className="hover:text-heritage-brass">Terms of Service</a>
            <a href="#" className="hover:text-heritage-brass">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
