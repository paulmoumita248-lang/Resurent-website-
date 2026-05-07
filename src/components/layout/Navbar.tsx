import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '../AuthProvider';

export type AppView = 'home' | 'dashboard' | 'admin';

export default function Navbar({ onBookClick, setView }: { onBookClick: () => void, setView: (view: AppView) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') return;
      console.error("Login failed:", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        alert("Domain Not Authorized: Please add this domain to your Firebase Console under 'Authentication > Settings > Authorized Domains'.");
      } else {
        alert(`Login Error: ${error.message}`);
      }
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-heritage-cream/80 backdrop-blur-md border-b border-heritage-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-serif font-bold tracking-tighter text-heritage-charcoal uppercase">
              Heritage <span className="text-heritage-brass">Hearth</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setView('home')} className="text-sm font-medium hover:text-heritage-brass transition-colors">Home</button>
            <a href="#about" onClick={() => setView('home')} className="text-sm font-medium hover:text-heritage-brass transition-colors">About</a>
            <a href="#menu" onClick={() => setView('home')} className="text-sm font-medium hover:text-heritage-brass transition-colors">Menu</a>
            <a href="#areas" onClick={() => setView('home')} className="text-sm font-medium hover:text-heritage-brass transition-colors">Dining Areas</a>
            <a href="#contact" onClick={() => setView('home')} className="text-sm font-medium hover:text-heritage-brass transition-colors">Contact</a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onBookClick}
                  className="bg-heritage-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-heritage-brass transition-all"
                >
                  Book a Table
                </button>
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-heritage-charcoal/5 transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-heritage-charcoal/5 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button 
                      onClick={() => setView('dashboard')}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-cream gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => setView('admin')}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-cream gap-2"
                      >
                        <Settings className="w-4 h-4" /> Admin Panel
                      </button>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 border border-heritage-charcoal px-6 py-2 rounded-full text-sm font-medium hover:bg-heritage-charcoal hover:text-white transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-heritage-cream border-b border-heritage-charcoal/10 px-4 py-6 space-y-4"
          >
            <button onClick={() => { setView('home'); setIsOpen(false); }} className="block w-full text-left text-lg font-serif">Home</button>
            <a href="#about" onClick={() => { setView('home'); setIsOpen(false); }} className="block text-lg font-serif">About</a>
            <a href="#menu" onClick={() => { setView('home'); setIsOpen(false); }} className="block text-lg font-serif">Menu</a>
            <a href="#areas" onClick={() => { setView('home'); setIsOpen(false); }} className="block text-lg font-serif">Dining Areas</a>
            <a href="#contact" onClick={() => { setView('home'); setIsOpen(false); }} className="block text-lg font-serif">Contact</a>
            {user ? (
              <>
                <button onClick={() => { setView('dashboard'); setIsOpen(false); }} className="block w-full text-left text-lg font-serif text-heritage-brass">Dashboard</button>
                <button onClick={handleLogout} className="text-lg font-serif text-red-600">Logout</button>
              </>
            ) : (
              <button onClick={handleLogin} className="block text-lg font-serif text-heritage-brass">Sign In</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
