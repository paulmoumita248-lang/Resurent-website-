import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle2, XCircle, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useAuth } from '../AuthProvider';
import { Booking } from '../../types';

export default function UserDashboard() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', profile.uid),
      orderBy('date', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
      setLoading(false);
    });

    return unsubscribe;
  }, [profile]);

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const archiveBooking = async (id: string) => {
    if (!confirm("Remove this booking from your dashboard? This will not delete the record.")) return;
    try {
      await updateDoc(doc(db, 'bookings', id), {
        isArchived: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'rejected': return 'text-red-800 bg-red-100';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings
    .filter(b => !b.isArchived)
    .filter(b => {
      if (filter === 'upcoming') return b.date >= todayStr && b.status !== 'cancelled' && b.status !== 'rejected';
      if (filter === 'past') return b.date < todayStr || b.status === 'cancelled' || b.status === 'rejected';
      return true;
    });

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-8 h-8 animate-spin text-heritage-brass" />
    </div>
  );

  return (
    <section id="dashboard" className="py-24 bg-white modern-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-heritage-brass mb-2 block">Personal Estate</span>
            <h2 className="text-4xl md:text-5xl font-serif text-heritage-charcoal">Your <span className="italic">History</span> with Us</h2>
          </div>
          
          {/* Filters */}
          <div className="flex bg-heritage-cream p-1.5 rounded-2xl border border-heritage-charcoal/5">
            {[
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past/Cancelled' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f.id ? 'bg-white text-heritage-charcoal shadow-sm' : 'text-heritage-charcoal/40 hover:text-heritage-charcoal'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-heritage-cream rounded-[2rem] p-12 text-center border border-dashed border-heritage-charcoal/10">
            <Calendar className="w-12 h-12 text-heritage-charcoal/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif mb-2">No Matching Records</h3>
            <p className="text-heritage-charcoal/60 text-sm max-w-sm mx-auto">Try adjusting your filters to see your other reservations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => {
              const isPast = booking.date < todayStr || booking.status === 'cancelled';
              return (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-[2rem] p-8 border border-heritage-charcoal/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group ${isPast ? 'grayscale-[0.5] opacity-80 bg-heritage-cream/10' : ''}`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-heritage-brass/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-heritage-brass/10 transition-colors ${isPast ? 'hidden' : ''}`} />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="uppercase tracking-widest">{booking.status}</span>
                    </div>
                    {isPast && booking.status !== 'cancelled' && (
                      <span className="text-[10px] text-heritage-brass font-bold uppercase tracking-widest bg-heritage-brass/10 px-3 py-1 rounded-full">Completed</span>
                    )}
                    <span className="text-[10px] text-heritage-charcoal/20 uppercase font-mono">Ref: {booking.id?.slice(0, 8)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 ${isPast ? 'text-heritage-charcoal/40' : 'text-heritage-brass'}`} />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest opacity-40 leading-none mb-1">Date</p>
                          <p className={`font-serif text-lg ${isPast ? 'text-heritage-charcoal/60' : ''}`}>{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className={`w-5 h-5 ${isPast ? 'text-heritage-charcoal/40' : 'text-heritage-brass'}`} />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest opacity-40 leading-none mb-1">Time</p>
                          <p className={`font-serif text-lg ${isPast ? 'text-heritage-charcoal/60' : ''}`}>{booking.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className={`w-5 h-5 ${isPast ? 'text-heritage-charcoal/40' : 'text-heritage-brass'}`} />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest opacity-40 leading-none mb-1">Guests</p>
                          <p className={`font-serif text-lg ${isPast ? 'text-heritage-charcoal/60' : ''}`}>{booking.guests} Pax</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-5 h-5 ${isPast ? 'text-heritage-charcoal/40' : 'text-heritage-brass'}`} />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest opacity-40 leading-none mb-1">Area</p>
                          <p className={`font-serif text-lg ${isPast ? 'text-heritage-charcoal/60' : ''}`}>{booking.areaName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-8 p-4 bg-heritage-cream/50 rounded-2xl border border-heritage-charcoal/5 italic text-sm text-heritage-charcoal/60">
                      "{booking.notes}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-heritage-charcoal/5">
                    <span className="text-[10px] text-heritage-charcoal/30">Reserved {booking.createdAt?.toDate ? new Date(booking.createdAt.toDate()).toLocaleDateString() : 'Recently'}</span>
                    <div className="flex items-center gap-4">
                      {!isPast && booking.status === 'pending' && (
                        <button 
                          onClick={() => cancelBooking(booking.id!)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest border-b border-transparent hover:border-red-500 pb-1"
                        >
                          Cancel
                        </button>
                      )}
                      {(isPast || booking.status === 'cancelled' || booking.status === 'rejected') && (
                        <button 
                          onClick={() => archiveBooking(booking.id!)}
                          className="flex items-center gap-2 text-xs font-bold text-heritage-charcoal/40 hover:text-heritage-charcoal transition-colors uppercase tracking-widest group/del"
                          title="Clear from dashboard"
                        >
                          <Trash2 className="w-4 h-4 group-hover/del:text-red-500 transition-colors" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
