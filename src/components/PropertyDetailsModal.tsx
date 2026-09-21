import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Compass, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building,
  GraduationCap,
  HeartPulse,
  ShoppingCart,
  Bus,
  Train,
  Landmark,
  Trees,
  Navigation,
  Lock,
  BookmarkCheck,
  PhoneCall
} from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from './PropertyCard';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onRequestVisit: (property: Property) => void;
  onContactHost: (property: Property) => void;
  onBookProperty: (property: Property) => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onRequestVisit,
  onContactHost,
  onBookProperty,
  isSaved,
  onToggleSave
}) => {
  const { user, openAuthModal } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!property) return null;

  const isHouse = property.category === 'house';
  const effectiveArea = isHouse ? (property.builtUpArea || property.landArea) : property.landArea;
  const ratePerSqft = effectiveArea > 0 ? Math.round(property.price / effectiveArea) : 0;

  const facilitiesList = [
    { key: 'school', label: 'School', icon: GraduationCap, dist: property.nearbyFacilities.school },
    { key: 'hospital', label: 'Hospital', icon: HeartPulse, dist: property.nearbyFacilities.hospital },
    { key: 'supermarket', label: 'Supermarket', icon: ShoppingCart, dist: property.nearbyFacilities.supermarket },
    { key: 'busStop', label: 'Bus Stop', icon: Bus, dist: property.nearbyFacilities.busStop },
    { key: 'railwayStation', label: 'Railway Station', icon: Train, dist: property.nearbyFacilities.railwayStation },
    { key: 'metro', label: 'Metro', icon: Train, dist: property.nearbyFacilities.metro },
    { key: 'bankAtm', label: 'Bank / ATM', icon: Landmark, dist: property.nearbyFacilities.bankAtm },
    { key: 'park', label: 'Park', icon: Trees, dist: property.nearbyFacilities.park },
    { key: 'mainRoad', label: 'Main Road', icon: Navigation, dist: property.nearbyFacilities.mainRoad },
    { key: 'highway', label: 'Highway', icon: Navigation, dist: property.nearbyFacilities.highway },
  ].filter(f => f.dist !== undefined && f.dist !== null);

  const handleProtectedAction = (action: () => void) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-800 text-white">
              {property.id}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-emerald-800">
              {property.category.toUpperCase()} • {property.propertyType}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
              property.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {property.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs relative">
              <img
                src={property.images[selectedImageIndex] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white">
                <span className="text-xl font-bold text-amber-300">{formatPrice(property.price)}</span>
                <span className="text-xs text-gray-300 ml-2">(₹{ratePerSqft.toLocaleString('en-IN')}/sq.ft)</span>
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Location */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {isHouse ? (
              <>
                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Built-up Area</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.builtUpArea || 0} sq.ft</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Plot / Land Area</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.landArea} sq.ft</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Bed className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Bedrooms</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.bedrooms || 0} BHK</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Bath className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Bathrooms</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.bathrooms || 0} Baths</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Building className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Floors</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.floors || 1} Floor(s)</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Car className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Parking</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.parking || 1} Car Space</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Property Age</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.propertyAge || 0} Years</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Road Width</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.roadWidth} Feet</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-white rounded-xl border border-gray-200/60 col-span-2">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Total Land Extent</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {property.landArea.toLocaleString('en-IN')} sq.ft 
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      ({(property.landArea / 43560).toFixed(2)} Acres / {(property.landArea / 435.6).toFixed(1)} Cents)
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Road Frontage</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.roadWidth} Feet</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200/60">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                    <Building className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Zoning Category</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">{property.propertyType}</div>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Property Overview</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {property.description}
            </p>
          </div>

          {/* Nearby Facilities */}
          {facilitiesList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Nearby Facilities & Connectivity</h2>
                <span className="text-xs text-emerald-700 font-medium">Approximate driving distance</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {facilitiesList.map(f => {
                  const Icon = f.icon;
                  return (
                    <div key={f.key} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{f.label}</p>
                        <p className="text-gray-500 font-medium">{f.dist} km</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map / Location Simulation Context */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Location Map Context</h2>
            <div className="relative aspect-21/9 rounded-2xl bg-emerald-950/10 border border-emerald-900/10 overflow-hidden flex items-center justify-center p-4">
              <div className="text-center space-y-1 z-10 bg-white/95 px-6 py-3 rounded-2xl shadow-sm border border-gray-200">
                <MapPin className="w-6 h-6 text-emerald-700 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-gray-900">{property.locality}, {property.city}</p>
                <p className="text-xs text-gray-500">Tamil Nadu, India • GPS: {property.coordinates?.lat.toFixed(4) || '10.6609'}, {property.coordinates?.lng.toFixed(4) || '77.0048'}</p>
              </div>
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
          </div>

          {/* Host Contact Section (Protected) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-amber-50/30 border border-emerald-200/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Verified Property Host</h3>
                <p className="text-xs text-emerald-800">Authorized representative for this listing</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-800 text-white rounded-lg">
                Direct Host
              </span>
            </div>

            {user ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] text-gray-500 block">Host Name</span>
                  <span className="text-sm font-bold text-gray-900">{property.hostName}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] text-gray-500 block">Contact Phone</span>
                  <a href={`tel:${property.hostPhone}`} className="text-sm font-bold text-emerald-800 hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{property.hostPhone}</span>
                  </a>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] text-gray-500 block">Email Address</span>
                  <a href={`mailto:${property.hostEmail}`} className="text-sm font-bold text-emerald-800 hover:underline truncate block">
                    {property.hostEmail}
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-xl border border-dashed border-emerald-300 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Host Contact Information is Protected</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Please Login or Sign Up to view direct host phone number and email.</p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl"
                  >
                    Login to View Contact
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl"
                  >
                    Sign Up Free
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs text-gray-500 block">Listed Asking Price</span>
            <span className="text-2xl font-bold text-emerald-900 font-serif">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleProtectedAction(() => onContactHost(property))}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-900 bg-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Contact Host</span>
            </button>

            <button
              onClick={() => handleProtectedAction(() => onRequestVisit(property))}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Request Visit</span>
            </button>

            <button
              onClick={() => handleProtectedAction(() => onBookProperty(property))}
              disabled={property.status !== 'Available'}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                property.status === 'Available'
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>Book Property</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
