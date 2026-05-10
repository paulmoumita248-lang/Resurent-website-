import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Users, MapPin, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SEATING_AREAS } from '../../constants';
import { useAuth } from '../AuthProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { format } from 'date-fns';
import axios from 'axios';

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date(),
    time: '19:00',
    guests: 2,
    areaId: SEATING_AREAS[0].id,
    notes: ''
  });

  const handleBooking = async () => {
    if (!profile) return;
    setLoading(true);
    const path = 'bookings';
    try {
      const area = SEATING_AREAS.find(a => a.id === formData.areaId);
      await addDoc(collection(db, path), {
        userId: profile.uid,
        userName: profile.displayName,
        userEmail: profile.email,
        date: format(formData.date, 'yyyy-MM-dd'),
        time: formData.time,
        guests: formData.guests,
        areaId: formData.areaId,
        areaName: area?.name || 'Main Hall',
        status: 'pending',
        notes: formData.notes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSuccess(true);
      
      // Send confirmation email via backend
      try {
        await axios.post('/api/confirm-booking', {
          email: profile.email,
          bookingDetails: {
            date: format(formData.date, 'yyyy-MM-dd'),
            time: formData.time,
            guests: formData.guests,
            areaName: area?.name || 'Main Hall',
            reference: 'Ref: HT-' + Math.random().toString(36).substr(2, 6).toUpperCase()
          }
        });
      } catch (err) {
        console.error("Failed to send confirmation email:", err);
      }

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setStep(1);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-heritage-charcoal/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-heritage-cream rounded-3xl shadow-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-heritage-charcoal/5">
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden max-h-[90vh] md:max-h-none">
              {/* Left Panel - Progress */}
              <div className="md:w-1/3 bg-heritage-charcoal p-6 md:p-8 flex flex-col justify-between items-start">
                <div className="w-full">
                  <h2 className="text-xl md:text-2xl font-serif text-heritage-cream mb-2 leading-tight">Secure Your<br /><span className="text-heritage-brass italic">Legacy Table</span></h2>
                  <div className="mt-6 md:mt-12 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4 md:gap-8 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    {[
                      { s: 1, label: 'Details', icon: Calendar },
                      { s: 2, label: 'Seating', icon: MapPin },
                      { s: 3, label: 'Confirm', icon: CheckCircle2 }
                    ].map((item) => (
                      <div key={item.s} className={`flex items-center gap-3 md:gap-4 transition-colors shrink-0 ${step >= item.s ? 'text-heritage-brass' : 'text-heritage-cream/20'}`}>
                        <div className={`p-1.5 md:p-2 rounded-lg border ${step >= item.s ? 'border-heritage-brass' : 'border-heritage-cream/10'}`}>
                          <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold hidden sm:inline-block md:inline-block">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 md:mt-8 hidden md:block">
                  <p className="text-[10px] text-heritage-cream/30 uppercase tracking-[0.2em]">Crafting Memories Since 1925</p>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="flex-1 p-6 md:p-12 bg-heritage-cream overflow-y-auto">
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-4"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-2 text-heritage-charcoal">Reserving Your Legacy</h3>
                    <p className="text-xs md:text-sm text-heritage-charcoal/60 mb-6 md:mb-8 max-w-[280px]">
                      Your request has been received. A confirmation email has been dispatched to <span className="font-semibold text-heritage-charcoal">{profile?.email}</span>.
                    </p>

                    <div className="w-full bg-heritage-cream py-4 md:py-6 px-6 md:px-8 rounded-2xl md:rounded-3xl border border-heritage-charcoal/5 mb-6 md:mb-8 space-y-3 text-left shadow-inner">
                      <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="opacity-40 uppercase tracking-widest">Date & Time</span>
                        <span className="font-serif font-bold">{format(formData.date, 'MMM do')} @ {formData.time}</span>
                      </div>
                      <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="opacity-40 uppercase tracking-widest">Guests</span>
                        <span className="font-serif font-bold">{formData.guests} Persons</span>
                      </div>
                      <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="opacity-40 uppercase tracking-widest">Location</span>
                        <span className="font-serif font-bold italic">{SEATING_AREAS.find(a => a.id === formData.areaId)?.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col w-full gap-2 md:gap-3">
                      <a 
                        href="#dashboard" 
                        onClick={onClose}
                        className="w-full bg-heritage-charcoal text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-heritage-brass transition-all shadow-lg shadow-heritage-charcoal/20 text-center text-sm md:text-base"
                      >
                        Manage My Bookings
                      </a>
                      <button 
                        onClick={onClose}
                        className="w-full py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-heritage-charcoal/40 hover:text-heritage-charcoal transition-colors"
                      >
                        Close Window
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                          <label className="block text-[10px] uppercase tracking-widest font-bold text-heritage-charcoal/40">Select Date & Guests</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="relative border-b border-heritage-charcoal/20 pb-2">
                              <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-brass" />
                              <DatePicker
                                selected={formData.date}
                                onChange={(date: Date | null) => date && setFormData({ ...formData, date })}
                                minDate={new Date()}
                                className="bg-transparent w-full outline-none text-base md:text-lg font-serif"
                              />
                            </div>
                            <div className="relative border-b border-heritage-charcoal/20 pb-2">
                              <Users className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-brass" />
                              <select 
                                value={formData.guests}
                                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                className="bg-transparent w-full outline-none text-base md:text-lg font-serif appearance-none"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} Guests</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                          <label className="block text-[10px] uppercase tracking-widest font-bold text-heritage-charcoal/40">Preferred Time</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['18:00', '18:30', '19:00', '19:30', '20:00', '21:00'].map(t => (
                              <button
                                key={t}
                                onClick={() => setFormData({ ...formData, time: t })}
                                className={`py-2.5 md:py-3 text-xs md:text-sm rounded-xl border transition-all ${formData.time === t ? 'bg-heritage-charcoal text-white border-heritage-charcoal shadow-md' : 'border-heritage-charcoal/10 hover:border-heritage-brass hover:text-heritage-brass'}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button onClick={() => setStep(2)} className="w-full bg-heritage-brass text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 font-semibold hover:bg-heritage-charcoal transition-all mt-4 md:mt-8 group text-sm md:text-base">
                          Next Path <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 md:space-y-6">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-heritage-charcoal/40">Choose Your Atmosphere</label>
                        <div className="grid grid-cols-1 gap-2.5 md:gap-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {SEATING_AREAS.map(area => (
                            <button
                              key={area.id}
                              onClick={() => setFormData({ ...formData, areaId: area.id })}
                              className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all text-left ${formData.areaId === area.id ? 'border-heritage-brass bg-heritage-brass/5 ring-1 ring-heritage-brass' : 'border-heritage-charcoal/10 hover:border-heritage-charcoal/30'}`}
                            >
                              <img src={area.imageUrl} alt={area.name} className="w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl object-cover" />
                              <div>
                                <h4 className="font-serif text-base md:text-lg">{area.name}</h4>
                                <p className="text-[10px] md:text-xs text-heritage-charcoal/50 leading-snug mt-1">{area.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
                          <button onClick={() => setStep(1)} className="flex-1 border border-heritage-charcoal/10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:bg-heritage-charcoal hover:text-white transition-all text-sm md:text-base">Back</button>
                          <button onClick={() => setStep(3)} className="flex-[2] bg-heritage-brass text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:bg-heritage-charcoal transition-all text-sm md:text-base">Review & Finish</button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 md:space-y-6">
                        <div className="bg-heritage-charcoal/5 p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-3 md:space-y-4">
                          <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-heritage-charcoal/10">
                            <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-50">Date & Time</span>
                            <span className="font-serif text-sm md:text-base">{format(formData.date, 'MMMM do, yyyy')} • {formData.time}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-heritage-charcoal/10">
                            <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-50">Guests</span>
                            <span className="font-serif text-sm md:text-base">{formData.guests} Persons</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-50">Area</span>
                            <span className="font-serif text-sm md:text-base">{SEATING_AREAS.find(a => a.id === formData.areaId)?.name}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-heritage-charcoal/40">Special Requests (Optional)</label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Allergies, anniversaries, or preferences..."
                            className="w-full bg-transparent border border-heritage-charcoal/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm focus:border-heritage-brass outline-none transition-all placeholder:text-heritage-charcoal/20 h-20 md:h-24 resize-none"
                          />
                        </div>

                        <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
                          <button onClick={() => setStep(2)} className="flex-1 border border-heritage-charcoal/10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:bg-heritage-charcoal hover:text-white transition-all disabled:opacity-50 text-sm md:text-base" disabled={loading}>Back</button>
                          <button 
                            onClick={handleBooking} 
                            disabled={loading}
                            className="flex-[2] bg-heritage-brass text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:bg-heritage-charcoal transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                          >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Reservation'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
