import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, Clock, MapPin, Search, Filter, 
  CheckCircle2, XCircle, AlertCircle, Loader2, ListFilter,
  Download, RefreshCcw, MoreHorizontal, Trash2
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  updateDoc, serverTimestamp, deleteDoc, limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Booking, BookingStatus } from '../../types';
import { SEATING_AREAS } from '../../constants';

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [filterArea, setFilterArea] = useState<string | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const archiveBooking = async (id: string, isArchived: boolean = true) => {
    if (isArchived && !confirm("Clear this booking from main dashboard? (Soft delete)")) return;
    try {
      await updateDoc(doc(db, 'bookings', id), {
        isArchived,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesArchive = showArchived ? b.isArchived === true : !b.isArchived;
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesArea = filterArea === 'all' || b.areaId === filterArea;
    const matchesSearch = b.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArchive && matchesStatus && matchesArea && matchesSearch;
  });

  const stats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    today: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length
  };

  return (
    <div id="admin" className="min-h-screen bg-[#FDFCF9] py-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-heritage-brass"></span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-heritage-brass">Estate Management</span>
            </div>
            <h1 className="text-5xl font-serif text-heritage-charcoal">Control <span className="italic">Center</span></h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            {[
              { label: 'Pending', val: stats.pending, color: 'text-amber-600' },
              { label: 'Confirmed', val: stats.confirmed, color: 'text-green-600' },
              { label: 'Today', val: stats.today, color: 'text-blue-600' },
              { label: 'Cancelled', val: stats.cancelled, color: 'text-red-500 opacity-50' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-heritage-charcoal/5 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">{s.label}</p>
                <p className={`text-2xl font-serif ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-3xl border border-heritage-charcoal/5 shadow-sm p-4 mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-charcoal/30" />
            <input 
              type="text" 
              placeholder="Search by name, email or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-heritage-cream/50 pl-12 pr-4 py-3 rounded-xl border border-transparent focus:border-heritage-brass focus:bg-white outline-none transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-heritage-cream/30 px-3 py-1.5 rounded-xl border border-heritage-charcoal/5">
              <Filter className="w-3 h-3 opacity-40" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-transparent text-xs font-semibold outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-heritage-cream/30 px-3 py-1.5 rounded-xl border border-heritage-charcoal/5">
              <MapPin className="w-3 h-3 opacity-40" />
              <select 
                value={filterArea} 
                onChange={(e) => setFilterArea(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none appearance-none cursor-pointer"
              >
                <option value="all">Every Area</option>
                {SEATING_AREAS.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-heritage-cream/30 px-3 py-1.5 rounded-xl border border-heritage-charcoal/5">
              <ListFilter className="w-3 h-3 opacity-40" />
              <button 
                onClick={() => setShowArchived(!showArchived)}
                className={`text-xs font-semibold outline-none transition-colors ${showArchived ? 'text-red-600' : 'text-heritage-charcoal/60'}`}
              >
                {showArchived ? 'View Active' : 'View Archived'}
              </button>
            </div>

            <button className="p-3 bg-heritage-charcoal text-white rounded-xl hover:bg-heritage-brass transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-[2.5rem] border border-heritage-charcoal/5 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-heritage-brass" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-heritage-cream/30 border-b border-heritage-charcoal/5">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-heritage-charcoal/40">Diner</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-heritage-charcoal/40">Schedule</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-heritage-charcoal/40">Seating</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-heritage-charcoal/40">Guests</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-heritage-charcoal/40">Status</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-heritage-charcoal/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-heritage-charcoal/5">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-heritage-cream/10 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-heritage-brass/10 flex items-center justify-center text-heritage-brass font-serif font-bold italic">
                            {booking.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-heritage-charcoal">{booking.userName}</p>
                            <p className="text-xs text-heritage-charcoal/40 font-mono">{booking.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-heritage-charcoal">
                            <Calendar className="w-3 h-3 text-heritage-brass" /> {booking.date}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-heritage-charcoal/40">
                            <Clock className="w-3 h-3" /> {booking.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs px-3 py-1 bg-heritage-cream rounded-full border border-heritage-charcoal/5 italic">{booking.areaName}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 font-serif text-sm">
                          <Users className="w-3 h-3 text-heritage-brass" /> {booking.guests}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                          ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                            booking.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {booking.status}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => updateStatus(booking.id!, 'confirmed')}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-100"
                              title="Confirm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                            <button 
                              onClick={() => updateStatus(booking.id!, 'rejected')}
                              className="p-2 bg-red-800 text-white rounded-lg hover:bg-black transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                            <button 
                              onClick={() => updateStatus(booking.id!, 'cancelled')}
                              className="p-2 bg-heritage-charcoal text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Cancel"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => archiveBooking(booking.id!, !showArchived)}
                            className="p-2 border border-heritage-charcoal/10 rounded-lg hover:bg-heritage-cream transition-colors group/trash"
                            title={showArchived ? "Restore" : "Clear from dashboard"}
                          >
                            <Trash2 className={`w-4 h-4 transition-colors ${showArchived ? 'text-green-600' : 'text-heritage-charcoal/40 group-hover/trash:text-red-500'}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filteredBookings.length === 0 && !loading && (
            <div className="p-20 text-center">
              <AlertCircle className="w-8 h-8 text-heritage-charcoal/20 mx-auto mb-4" />
              <p className="text-heritage-charcoal/40 text-sm">No bookings found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
