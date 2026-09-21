import React, { useState, useEffect } from 'react';
import { Building2, Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { Property } from '../types';
import { DistrictInfo } from '../../backend/locationsData';
import { api } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';

interface HousesPageProps {
  initialFilters?: any;
  onViewDetails: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
  onContactHost: (property: Property) => void;
  onBookProperty: (property: Property) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const HousesPage: React.FC<HousesPageProps> = ({
  initialFilters,
  onViewDetails,
  onRequestVisit,
  onContactHost,
  onBookProperty,
  savedIds,
  onToggleSave
}) => {
  const [locations, setLocations] = useState<DistrictInfo[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [district, setDistrict] = useState<string>(initialFilters?.district || 'All');
  const [city, setCity] = useState<string>(initialFilters?.city || 'All');
  const [locality, setLocality] = useState<string>(initialFilters?.locality || '');
  const [propertyType, setPropertyType] = useState<string>('All');
  const [bedrooms, setBedrooms] = useState<string>('All');
  const [bathrooms, setBathrooms] = useState<string>('All');
  const [status, setStatus] = useState<string>(initialFilters?.status || 'Available');
  const [minPrice, setMinPrice] = useState<string>(initialFilters?.minPrice ? String(initialFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters?.maxPrice ? String(initialFilters.maxPrice) : '');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  useEffect(() => {
    async function loadLocations() {
      try {
        const locs = await api.getLocations();
        setLocations(locs);
      } catch (err) {
        console.error(err);
      }
    }
    loadLocations();
  }, []);

  useEffect(() => {
    async function fetchHouses() {
      setLoading(true);
      try {
        const data = await api.getProperties({
          category: 'house',
          district: district !== 'All' ? district : undefined,
          city: city !== 'All' ? city : undefined,
          locality: locality ? locality : undefined,
          propertyType: propertyType !== 'All' ? propertyType : undefined,
          status: status !== 'All' ? status : undefined,
          bedrooms: bedrooms !== 'All' ? parseInt(bedrooms, 10) : undefined,
          bathrooms: bathrooms !== 'All' ? parseInt(bathrooms, 10) : undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sort
        });
        setProperties(data);
      } catch (err) {
        console.error('Failed to load houses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHouses();
  }, [district, city, locality, propertyType, bedrooms, bathrooms, status, minPrice, maxPrice, sort]);

  const currentDistrictObj = locations.find(d => (d.district || d.name) === district);
  const availableCities = currentDistrictObj ? currentDistrictObj.cities : [];
  const currentCityObj = availableCities.find(c => c.name === city);
  const availableLocalities = currentCityObj ? currentCityObj.localities : [];

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setCity('All');
    setLocality('');
  };

  const handleReset = () => {
    setDistrict('All');
    setCity('All');
    setLocality('');
    setPropertyType('All');
    setBedrooms('All');
    setBathrooms('All');
    setStatus('Available');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Residential Properties</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            Houses for Sale in Tamil Nadu
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Explore villas, independent houses, apartments, and duplexes across all districts with direct host contact.
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          >
            <option value="newest">Newest Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span>Search & Filter Houses</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          
          {/* District */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">District</label>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
            >
              <option value="All">All Tamil Nadu</option>
              {locations.map(d => {
                const distName = d.district || d.name;
                return (
                  <option key={distName} value={distName}>{distName}</option>
                );
              })}
            </select>
          </div>

          {/* City / Taluk */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">City / Taluk</label>
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); setLocality(''); }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
            >
              <option value="All">All Cities / Taluks</option>
              {availableCities.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Locality */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Locality</label>
            {availableLocalities.length > 0 ? (
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
              >
                <option value="">All Localities ({availableLocalities.length})</option>
                {availableLocalities.map(l => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="e.g. Mahalingapuram"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            )}
          </div>

          {/* Property Type */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">House Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
            >
              <option value="All">All House Types</option>
              <option value="Villa">Luxury Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Duplex">Duplex House</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="Row House">Row House</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
            >
              <option value="All">Any Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5+ BHK</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Bathrooms</label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
            >
              <option value="All">Any Bathrooms</option>
              <option value="1">1+ Bath</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
              <option value="4">4+ Baths</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Min Price (INR)</label>
            <input
              type="number"
              placeholder="e.g. 4000000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Max Price (INR)</label>
            <input
              type="number"
              placeholder="e.g. 20000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-gray-700">Listing Status:</span>
              <div className="flex items-center gap-2">
                {['Available', 'Booked', 'Sold', 'All'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      status === st 
                        ? 'bg-emerald-800 text-white shadow-2xs' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'Available' ? 'Available Only' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-medium text-emerald-800">
              Showing <strong>{properties.length}</strong> matching houses
            </div>
          </div>

        </div>
      </div>

      {/* House Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={onViewDetails}
              onRequestVisit={onRequestVisit}
              onContactHost={onContactHost}
              onBookProperty={onBookProperty}
              isSaved={savedIds.includes(property.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Houses Match Your Exact Filters</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try loosening price constraints, adjusting bedrooms, or clearing locality to see more houses across Tamil Nadu.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
