import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ContactModalProps {
  property: Property | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ property, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('Hello, I am interested in this property and would like more details.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!property) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createEnquiry({
        propertyId: property.id,
        message
      });
      setSent(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <Phone className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Contact Listing Host</h2>
          </div>
          <p className="text-xs text-emerald-200">
            Reach out directly to the authorized host for this listing.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Host Contact Info Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">{property.hostName}</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-500" />
                <span>Verified Host</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-700">
              <a 
                href={`tel:${property.hostPhone}`}
                className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 text-emerald-900 font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{property.hostPhone}</span>
              </a>

              <a 
                href={`mailto:${property.hostEmail}?subject=Inquiry for ${property.title} (${property.id})`}
                className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 text-emerald-900 font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate">{property.hostEmail}</span>
              </a>
            </div>
          </div>

          {/* Quick Message Form */}
          {sent ? (
            <div className="text-center py-4 space-y-2 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200">
              <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Message Sent to Host</p>
              <p className="text-[11px] text-gray-600">The host will review your enquiry and contact you via phone or email shortly.</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3">
              {error && (
                <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Send Direct Inquiry Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message to Host'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
