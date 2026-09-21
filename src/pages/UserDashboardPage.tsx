import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookmarkCheck, 
  Calendar, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BookingRequest, VisitRequest, Enquiry, PredictionRecord, Property } from '../types';
import { formatPrice, PropertyCard } from '../components/PropertyCard';

interface UserDashboardPageProps {
  onNavigate: (page: string) => void;
  onViewDetails: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
  onContactHost: (property: Property) => void;
  onBookProperty: (property: Property) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onViewDetails,
  onRequestVisit,
  onContactHost,
  onBookProperty,
  savedIds,
  onToggleSave
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'visits' | 'saved' | 'predictions' | 'enquiries'>('bookings');

  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      setLoading(true);
      try {
        const [bList, vList, sList, pList, eList] = await Promise.all([
          api.getBookings().catch(() => []),
          api.getVisits().catch(() => []),
          api.getSavedProperties().catch(() => []),
          api.getPredictionHistory().catch(() => []),
          api.getEnquiries().catch(() => [])
        ]);
        setBookings(bList);
        setVisits(vList);
        setSavedProperties(sList);
        setPredictions(pList);
        setEnquiries(eList);
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm">
        <User className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Sign in to Access Dashboard</h2>
        <p className="text-xs text-gray-500">Please log in with your registered account to manage your property bookings, visits, and saved listings.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'Rescheduled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-100 text-purple-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Rescheduled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending Host Review</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-emerald-900 to-forest-950 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl font-bold font-serif ring-2 ring-amber-400/50">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">{user.name}</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700">
                {user.accountType}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1">{user.email} • {user.phone}</p>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center w-full sm:w-auto">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <span className="text-lg font-bold text-amber-300">{bookings.length}</span>
            <span className="text-[10px] text-emerald-200 block">Bookings</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <span className="text-lg font-bold text-amber-300">{visits.length}</span>
            <span className="text-[10px] text-emerald-200 block">Visits</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <span className="text-lg font-bold text-amber-300">{savedProperties.length}</span>
            <span className="text-[10px] text-emerald-200 block">Saved</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'bookings'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>My Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'visits'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled Visits ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'saved'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Listings ({savedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'predictions'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Valuations ({predictions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'enquiries'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages & Enquiries ({enquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div key={b.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 block">{b.id} • {b.propertyId}</span>
                      <h4 className="text-sm font-bold text-gray-900">{b.propertyTitle}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{b.propertyLocation}</span>
                      </p>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Asking Price:</span>
                      <span className="font-bold text-emerald-900">{formatPrice(b.propertyPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Requested Date & Time:</span>
                      <span className="font-semibold text-gray-800">{b.preferredDate} at {b.preferredTime}</span>
                    </div>
                    {b.message && (
                      <div className="pt-1 border-t border-gray-200 text-gray-600 italic">
                        "{b.message}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <BookmarkCheck className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Active Property Bookings</h3>
              <p className="text-xs text-gray-500">When you book a house or land parcel, your priority consultation requests appear here.</p>
              <button
                onClick={() => onNavigate('houses')}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
              >
                Explore Properties
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Scheduled Visits */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {visits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map(v => (
                <div key={v.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 block">{v.id} • {v.propertyId}</span>
                      <h4 className="text-sm font-bold text-gray-900">{v.propertyTitle}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{v.propertyLocation}</span>
                      </p>
                    </div>
                    {getStatusBadge(v.status)}
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Visit Scheduled For:</span>
                      <span className="font-bold text-emerald-900">{v.preferredDate} at {v.preferredTime}</span>
                    </div>
                    {v.rescheduleNote && (
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-900 text-xs mt-1 border border-amber-200">
                        <strong>Host Note:</strong> {v.rescheduleNote}
                      </div>
                    )}
                    {v.message && (
                      <div className="pt-1 text-gray-600 italic">
                        "{v.message}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Scheduled Site Visits</h3>
              <p className="text-xs text-gray-500">Request an in-person physical tour on any property details page to schedule inspection with verified hosts.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Properties */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={onViewDetails}
                  onRequestVisit={onRequestVisit}
                  onContactHost={onContactHost}
                  onBookProperty={onBookProperty}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <Heart className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Saved Listings Yet</h3>
              <p className="text-xs text-gray-500">Click the heart icon on any property to save it to your wishlist for later review.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: AI Predictions History */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {predictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map(pred => (
                <div key={pred.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-mono">{pred.id} • {new Date(pred.createdAt || pred.date).toLocaleDateString()}</span>
                      <h4 className="text-sm font-bold text-gray-900">{pred.locality}, {pred.city}</h4>
                      <p className="text-xs text-emerald-800 font-medium capitalize">{pred.category} • {pred.propertyType}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-800 text-white">
                      {formatPrice(pred.predictedPrice)}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate / Sq.Ft:</span>
                      <span className="font-semibold text-gray-900">₹{pred.pricePerSqft.toLocaleString('en-IN')}/sq.ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Range:</span>
                      <span className="font-semibold text-emerald-800">{pred.estimatedRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ML Model:</span>
                      <span className="font-semibold text-gray-800">{pred.modelUsed}</span>
                    </div>
                  </div>

                  {pred.factors && pred.factors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Valuation Factors</span>
                      <div className="flex flex-wrap gap-1.5">
                        {pred.factors.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-700">
                            {f.factor}: <strong>{f.impact}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Prediction History</h3>
              <p className="text-xs text-gray-500">Calculate house or land property valuations using our ML engine, and they will automatically save here.</p>
              <button
                onClick={() => onNavigate('prediction')}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
              >
                Calculate Valuation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length > 0 ? (
            <div className="space-y-3">
              {enquiries.map(enq => (
                <div key={enq.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{enq.propertyTitle}</span>
                    <span className="text-[10px] text-gray-400">{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    "{enq.message}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Messages Sent</h3>
              <p className="text-xs text-gray-500">When you send enquiries to verified listing hosts, the thread history will appear here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
