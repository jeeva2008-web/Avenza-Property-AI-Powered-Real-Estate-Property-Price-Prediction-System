import React from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Compass, 
  Heart,
  Calendar, 
  PhoneCall, 
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
  onContactHost: (property: Property) => void;
  onBookProperty: (property: Property) => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string) => void;
}

export function formatPrice(num: number): string {
  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    const lakhs = num / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onRequestVisit,
  onContactHost,
  onBookProperty,
  isSaved = false,
  onToggleSave
}) => {
  const { user, openAuthModal } = useAuth();

  const handleProtectedAction = (action: () => void) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    action();
  };

  const statusColors = {
    Available: 'bg-emerald-600 text-white shadow-xs',
    Booked: 'bg-amber-600 text-white shadow-xs',
    Sold: 'bg-gray-600 text-white'
  };

  const isHouse = property.category === 'house';
  const effectiveArea = isHouse ? (property.builtUpArea || property.landArea) : property.landArea;
  const ratePerSqft = effectiveArea > 0 ? Math.round(property.price / effectiveArea) : 0;

  return (
    <div 
      id={`property-card-${property.id}`}
      className="group bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center z-10">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${statusColors[property.status]}`}>
            {property.status}
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/95 text-emerald-900 shadow-xs backdrop-blur-xs">
            {property.propertyType}
          </span>
        </div>

        {/* Wishlist Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProtectedAction(() => onToggleSave(property.id));
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 shadow-xs backdrop-blur-xs transition-colors z-10"
            title={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-emerald-950/90 text-white px-3 py-1.5 rounded-xl backdrop-blur-md shadow-md">
            <span className="text-base font-bold tracking-tight text-amber-300">
              {formatPrice(property.price)}
            </span>
            <span className="text-[11px] text-emerald-200/90 ml-1.5">
              (₹{ratePerSqft.toLocaleString('en-IN')}/sq.ft)
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium px-2 py-1 rounded-md bg-white/80 text-gray-700 backdrop-blur-xs shadow-xs">
            {property.id}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{property.district}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(property)}
            className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-emerald-800 transition-colors cursor-pointer mb-3"
          >
            {property.title}
          </h3>

          {/* Property Specific Metrics */}
          <div className="grid grid-cols-2 gap-2 py-3 px-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-gray-700 mb-4">
            {isHouse ? (
              <>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Built-up: <strong>{property.builtUpArea || 0} sq.ft</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bedrooms: <strong>{property.bedrooms || 0} BHK</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Baths: <strong>{property.bathrooms || 0}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Parking: <strong>{property.parking || 0} Car</strong></span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 col-span-2">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Land Area: <strong>{property.landArea.toLocaleString('en-IN')} sq.ft</strong> ({((property.landArea / 43560)).toFixed(2)} Acres)</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Road Width: <strong>{property.roadWidth} Feet Frontage</strong></span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          {/* Primary View Details Button */}
          <button
            onClick={() => onViewDetails(property)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <span>More Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Secondary 3 Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleProtectedAction(() => onRequestVisit(property))}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 hover:text-emerald-900 text-[11px] font-medium transition-colors"
              title="Request a Visit"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Visit</span>
            </button>

            <button
              onClick={() => handleProtectedAction(() => onContactHost(property))}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 hover:text-emerald-900 text-[11px] font-medium transition-colors"
              title="Contact Host"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>Contact</span>
            </button>

            <button
              onClick={() => handleProtectedAction(() => onBookProperty(property))}
              disabled={property.status !== 'Available'}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                property.status === 'Available'
                  ? 'border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900'
                  : 'border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              title={property.status === 'Available' ? "Book Property" : `Property is ${property.status}`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
