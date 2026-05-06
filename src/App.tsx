import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Navbar, { AppView } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import About from './components/home/About';
import Menu from './components/home/Menu';
import Contact from './components/home/Contact';
import DiningAreas from './components/home/DiningAreas';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminPanel from './components/admin/AdminPanel';
import BookingModal from './components/booking/BookingModal';
import { Loader2 } from 'lucide-react';
import { auth, googleProvider } from './lib/firebase';
import { signInWithPopup } from 'firebase/auth';

function AppContent() {
  const { user, profile, loading, isAdmin } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [view, setView] = useState<AppView>('home');

  const handleBookClick = () => {
    if (!user) {
      signInWithPopup(auth, googleProvider).catch(err => console.error(err));
      return;
    }
    setIsBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-heritage-cream">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-heritage-brass mx-auto" />
          <p className="font-serif italic text-heritage-charcoal opacity-40">Connecting to the Hearth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onBookClick={handleBookClick} setView={setView} />
      
      <main className="pt-20">
        {view === 'home' && (
          <>
            <Hero onBookClick={handleBookClick} />
            <About />
            <DiningAreas />
            <Menu />
            <Contact />
          </>
        )}

        {view === 'dashboard' && user && (
          <div className="min-h-[80vh]">
            <UserDashboard />
          </div>
        )}

        {view === 'admin' && isAdmin && (
          <div className="min-h-[80vh]">
            <AdminPanel />
          </div>
        )}
      </main>

      <Footer />

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
