import React, { useState } from 'react';
import { X, BookmarkCheck, Calendar, Clock, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatPrice } from './PropertyCard';

interface BookingModalProps {
  property: Property | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createBooking({
        propertyId: property.id,
        preferredDate,
        preferredTime,
        message
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <BookmarkCheck className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">Book Property Priority Request</h2>
          </div>
          <p className="text-xs text-emerald-200">
            Submit your priority reservation request for direct confirmation with the host.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Booking Request Submitted!</h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                  Your priority reservation request for <strong>{property.title}</strong> has been transmitted to host <strong>{property.hostName}</strong>.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 text-left space-y-1">
                <p>• Preferred Consultation Date: <strong>{preferredDate}</strong> at <strong>{preferredTime}</strong></p>
                <p>• Host direct contact: <strong>{property.hostPhone}</strong></p>
                <p>• Status: <strong>Pending Host Confirmation</strong></p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Close & Return to Listings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property Summary */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{property.title}</h4>
                  <p className="text-[11px] text-gray-500">{property.locality}, {property.city}</p>
                  <p className="text-xs font-bold text-emerald-800">{formatPrice(property.price)}</p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Preferred Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Note or Requirements for Host (Optional)</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Inquiring regarding immediate registration, loan eligibility, or token deposit terms..."
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <strong>Booking Assurance:</strong> No online advance payment required. Booking directly reserves your spot with host verification and official in-person contract review.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {loading ? 'Submitting...' : 'Confirm Priority Booking'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
