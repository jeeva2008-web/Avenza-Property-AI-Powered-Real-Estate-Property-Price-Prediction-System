import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Edit3, 
  MapPin, 
  Calendar, 
  BookmarkCheck, 
  AlertCircle,
  X,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Property, BookingRequest, VisitRequest } from '../types';
import { DistrictInfo } from '../../backend/locationsData';
import { formatPrice } from '../components/PropertyCard';

interface HostDashboardPageProps {
  onNavigate: (page: string) => void;
  onViewDetails: (property: Property) => void;
}

export const HostDashboardPage: React.FC<HostDashboardPageProps> = ({ onNavigate, onViewDetails }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [locations, setLocations] = useState<DistrictInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings' | 'visits'>('properties');

  // Add Property Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [category, setCategory] = useState<'house' | 'land'>('house');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [district, setDistrict] = useState('Coimbatore');
  const [city, setCity] = useState('Pollachi');
  const [locality, setLocality] = useState('Mahalingapuram');
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Villa');
  const [landArea, setLandArea] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [floors, setFloors] = useState('2');
  const [parking, setParking] = useState('2');
  const [roadWidth, setRoadWidth] = useState('33');
  const [propertyAge, setPropertyAge] = useState('0');
  const [imagesInput, setImagesInput] = useState('');

  // Proximity inputs
  const [distSchool, setDistSchool] = useState('0.8');
  const [distHospital, setDistHospital] = useState('1.2');
  const [distBusStop, setDistBusStop] = useState('0.5');
  const [distMainRoad, setDistMainRoad] = useState('0.3');

  // Reschedule visit state
  const [reschedulingVisitId, setReschedulingVisitId] = useState<string | null>(null);
  const [rescheduleNote, setRescheduleNote] = useState('');

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [allProps, bList, vList, locs] = await Promise.all([
        api.getProperties(),
        api.getHostBookings().catch(() => []),
        api.getHostVisits().catch(() => []),
        api.getLocations()
      ]);

      // Filter properties owned by this host (or fallback to user.id matching)
      const hostProps = allProps.filter((p: Property) => p.hostId === user.id || p.hostId === 'host_1');
      setProperties(hostProps);
      setBookings(bList);
      setVisits(vList);
      setLocations(locs);
    } catch (err) {
      console.error('Failed to load host dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  if (!user || user.accountType !== 'host') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm">
        <Building2 className="w-12 h-12 text-emerald-800 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Host Account Required</h2>
        <p className="text-xs text-gray-500">
          This portal is reserved for registered property hosts and owners. Please log in with or register a Host account to list and manage properties.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const currentDistrictObj = locations.find(d => (d.district || d.name) === district);
  const availableCities = currentDistrictObj ? currentDistrictObj.cities : [];
  const currentCityObj = availableCities.find(c => c.name === city);
  const availableLocalities = currentCityObj ? currentCityObj.localities : [];

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const dist = locations.find(x => (x.district || x.name) === d);
    if (dist && dist.cities.length > 0) {
      setCity(dist.cities[0].name);
      if (dist.cities[0].localities.length > 0) {
        setLocality(dist.cities[0].localities[0].name);
      } else {
        setLocality('');
      }
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const parsedImages = imagesInput
        ? imagesInput.split('\n').map(s => s.trim()).filter(Boolean)
        : category === 'house'
          ? ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
          : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'];

      const payload = {
        title,
        description,
        category,
        propertyType,
        price: parseFloat(price),
        district,
        city,
        locality,
        address: address || `${locality}, ${city}, ${district}, Tamil Nadu`,
        landArea: parseFloat(landArea),
        builtUpArea: category === 'house' ? parseFloat(builtUpArea || landArea) : undefined,
        bedrooms: category === 'house' ? parseInt(bedrooms, 10) : undefined,
        bathrooms: category === 'house' ? parseInt(bathrooms, 10) : undefined,
        floors: category === 'house' ? parseInt(floors, 10) : undefined,
        parking: category === 'house' ? parseInt(parking, 10) : undefined,
        roadWidth: parseFloat(roadWidth),
        propertyAge: category === 'house' ? parseInt(propertyAge, 10) : undefined,
        images: parsedImages,
        features: category === 'house' 
          ? ['Borewell & Corporation Water', 'Covered Car Porch', 'Vastu Compliant Layout', 'DTCP & RERA Approved']
          : ['Clear Title & Patta Documented', 'Fencing & Corner Stone Demarcated', 'Copious Ground Water Zone', 'Wide Tar Road Access'],
        nearbyFacilities: {
          school: parseFloat(distSchool) || 1.0,
          hospital: parseFloat(distHospital) || 1.5,
          busStop: parseFloat(distBusStop) || 0.5,
          mainRoad: parseFloat(distMainRoad) || 0.4
        }
      };

      await api.createProperty(payload as any);
      setShowAddModal(false);
      resetForm();
      await loadDashboardData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setLandArea('');
    setBuiltUpArea('');
    setAddress('');
    setImagesInput('');
  };

  const handleUpdateStatus = async (propertyId: string, status: 'Available' | 'Booked' | 'Sold') => {
    try {
      await api.updatePropertyStatus(propertyId, status);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to permanently delete this listing?')) {
      try {
        await api.deleteProperty(propertyId);
        await loadDashboardData();
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'Confirmed' | 'Rejected' | 'Completed') => {
    try {
      await api.updateBookingStatus(bookingId, status);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleUpdateVisitStatus = async (visitId: string, status: 'Confirmed' | 'Rejected' | 'Completed') => {
    try {
      await api.updateVisitStatus(visitId, status);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to update visit status');
    }
  };

  const handleRescheduleVisit = async (visitId: string) => {
    if (!rescheduleNote) {
      alert('Please provide a note or suggested time for rescheduling');
      return;
    }
    try {
      await api.updateVisitStatus(visitId, 'Rescheduled', rescheduleNote);
      setReschedulingVisitId(null);
      setRescheduleNote('');
      await loadDashboardData();
    } catch (err) {
      alert('Failed to reschedule');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Host Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-emerald-900 to-forest-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold mb-2 border border-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Verified Host Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Manage your verified listings, review client inspection requests, and manage booking pipelines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-emerald-950 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs text-gray-500 block">Total Listed Properties</span>
          <span className="text-2xl font-bold text-gray-900 block mt-1">{properties.length}</span>
          <span className="text-[10px] text-emerald-800 font-semibold mt-1 block">
            {properties.filter(p => p.status === 'Available').length} Available For Sale
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs text-gray-500 block">Pending Bookings</span>
          <span className="text-2xl font-bold text-amber-600 block mt-1">
            {bookings.filter(b => b.status === 'Pending').length}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Requires action</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs text-gray-500 block">Scheduled Visits</span>
          <span className="text-2xl font-bold text-emerald-800 block mt-1">
            {visits.filter(v => v.status === 'Pending' || v.status === 'Confirmed').length}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Site tours</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs text-gray-500 block">Properties Sold</span>
          <span className="text-2xl font-bold text-blue-700 block mt-1">
            {properties.filter(p => p.status === 'Sold').length}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Closed registry</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'properties' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Listings ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'bookings' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Client Booking Requests ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'visits' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Site Visit Requests ({visits.length})</span>
        </button>
      </div>

      {/* TAB 1: PROPERTIES */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          {properties.length > 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Property</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {properties.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <span className="font-bold text-gray-900 block">{p.title}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 font-semibold text-gray-700">
                            {p.category} • {p.propertyType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {p.locality}, {p.city}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-900">
                          {formatPrice(p.price)}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdateStatus(p.id, e.target.value as any)}
                            className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                              p.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : p.status === 'Booked'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onViewDetails(p)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Properties Listed Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Begin showcasing your residential houses or land parcels across Tamil Nadu.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Add Your First Property
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOKING REQUESTS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div key={b.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono block">{b.id}</span>
                      <h4 className="text-sm font-bold text-gray-900">{b.propertyTitle}</h4>
                      <p className="text-xs text-gray-500">{b.propertyLocation}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      b.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client Name:</span>
                      <span className="font-bold text-gray-900">{b.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact:</span>
                      <span className="text-emerald-800 font-semibold">{b.userPhone} • {b.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Requested Date & Time:</span>
                      <span className="font-medium text-gray-800">{b.preferredDate} at {b.preferredTime}</span>
                    </div>
                    {b.message && (
                      <p className="pt-1 text-gray-600 italic">"{b.message}"</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {b.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Booking</span>
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'Rejected')}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'Completed')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <BookmarkCheck className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Booking Requests</h3>
              <p className="text-xs text-gray-500">Client purchase requests will be shown here for confirmation.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SITE VISITS */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {visits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map(v => (
                <div key={v.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono block">{v.id}</span>
                      <h4 className="text-sm font-bold text-gray-900">{v.propertyTitle}</h4>
                      <p className="text-xs text-gray-500">{v.propertyLocation}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      v.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      v.status === 'Rescheduled' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client:</span>
                      <span className="font-bold text-gray-900">{v.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact:</span>
                      <span className="text-emerald-800 font-semibold">{v.userPhone} • {v.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scheduled Date:</span>
                      <span className="font-medium text-gray-800">{v.preferredDate} at {v.preferredTime}</span>
                    </div>
                    {v.rescheduleNote && (
                      <p className="text-purple-800 text-[11px] mt-1 bg-purple-50 p-1.5 rounded">
                        <strong>Note:</strong> {v.rescheduleNote}
                      </p>
                    )}
                  </div>

                  {/* Reschedule Input Mode */}
                  {reschedulingVisitId === v.id ? (
                    <div className="p-3 bg-purple-50 rounded-xl space-y-2 border border-purple-200">
                      <label className="text-[11px] font-bold text-purple-900 block">Propose Alternative Time / Note:</label>
                      <input
                        type="text"
                        value={rescheduleNote}
                        onChange={(e) => setRescheduleNote(e.target.value)}
                        placeholder="e.g. Can we meet at 4:30 PM instead?"
                        className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-purple-300 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReschedulingVisitId(null)}
                          className="px-2.5 py-1 text-xs text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRescheduleVisit(v.id)}
                          className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-bold"
                        >
                          Send Reschedule
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {v.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateVisitStatus(v.id, 'Confirmed')}
                            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Visit</span>
                          </button>
                          <button
                            onClick={() => { setReschedulingVisitId(v.id); setRescheduleNote(''); }}
                            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-xs font-bold"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleUpdateVisitStatus(v.id, 'Rejected')}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {v.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateVisitStatus(v.id, 'Completed')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
              <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No Visit Requests</h3>
              <p className="text-xs text-gray-500">Client in-person inspection requests will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* ADD PROPERTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-lg font-bold text-gray-900 font-serif">Add New Property Listing</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="mt-4 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">{formError}</div>
              )}

              {/* Category Toggle */}
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCategory('house')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    category === 'house' ? 'bg-emerald-800 text-white shadow-2xs' : 'text-gray-600'
                  }`}
                >
                  Residential House
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('land')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    category === 'land' ? 'bg-emerald-800 text-white shadow-2xs' : 'text-gray-600'
                  }`}
                >
                  Land Parcel / Plot
                </button>
              </div>

              {/* Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 4 BHK Luxury Villa in Mahalingapuram"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 8500000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                  >
                    {locations.map(d => {
                      const distName = d.district || d.name;
                      return (
                        <option key={distName} value={distName}>{distName}</option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">City / Taluk</label>
                  <select
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setLocality(''); }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                  >
                    {availableCities.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Locality</label>
                  {availableLocalities.length > 0 ? (
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                    >
                      {availableLocalities.map(l => (
                        <option key={l.name} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Locality"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {category === 'house' ? 'Property Type' : 'Zoning'}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    {category === 'house' ? (
                      <>
                        <option value="Villa">Villa</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Flat">Flat</option>
                        <option value="Row House">Row House</option>
                      </>
                    ) : (
                      <>
                        <option value="Residential">Residential Plot</option>
                        <option value="Commercial">Commercial Land</option>
                        <option value="Agricultural">Agricultural Land</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Land Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    placeholder="e.g. 2400"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                {category === 'house' && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Built-up Area (sq.ft)</label>
                    <input
                      type="number"
                      value={builtUpArea}
                      onChange={(e) => setBuiltUpArea(e.target.value)}
                      placeholder="e.g. 2100"
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Road Width (ft)</label>
                  <input
                    type="number"
                    required
                    value={roadWidth}
                    onChange={(e) => setRoadWidth(e.target.value)}
                    placeholder="e.g. 33"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bedrooms / Bathrooms / Parking for house */}
              {category === 'house' && (
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Floors</label>
                    <input
                      type="number"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Car Parking</label>
                    <input
                      type="number"
                      value={parking}
                      onChange={(e) => setParking(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention construction quality, water supply, DTCP approvals, neighborhood highlights..."
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              {/* Images (one URL per line) */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Image URLs (One URL per line - leave blank for default premium photography)
                </label>
                <textarea
                  rows={2}
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              {/* Submit buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Property Listing'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
