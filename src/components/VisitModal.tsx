import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface VisitModalProps {
  property: Property | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VisitModal: React.FC<VisitModalProps> = ({ property, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('04:00 PM');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
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
      await api.createVisit({
        propertyId: property.id,
        preferredDate,
        preferredTime,
        message,
        name,
        phone
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit visit request');
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
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Schedule Property Visit</h2>
          </div>
          <p className="text-xs text-emerald-200">
            Request an on-site physical inspection tour with the verified property host.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Visit Scheduled!</h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                  Your visit request has been sent to host <strong>{property.hostName}</strong> for property <strong>{property.id}</strong>.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 text-left space-y-1">
                <p>• Date & Time: <strong>{preferredDate}</strong> at <strong>{preferredTime}</strong></p>
                <p>• Location: <strong>{property.locality}, {property.city}</strong></p>
                <p>• Host Contact: <strong>{property.hostPhone}</strong></p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                <p className="font-bold text-gray-900 truncate">{property.title}</p>
                <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{property.locality}, {property.city}</span>
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Preferred Time</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Morning)</option>
                    <option value="02:30 PM">02:30 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                    <option value="05:30 PM">05:30 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Special Inquiries or Instructions</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Bringing family members, interested in checking water source and legal deed papers..."
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {loading ? 'Scheduling...' : 'Request On-Site Visit'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
