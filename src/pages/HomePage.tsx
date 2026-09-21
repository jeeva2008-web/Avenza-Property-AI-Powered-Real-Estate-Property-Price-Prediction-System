import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Layers, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react';
import { Property } from '../types';
import { DistrictInfo } from '../../backend/locationsData';
import { api } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';

interface HomePageProps {
  onNavigate: (page: string, filterParams?: any) => void;
  onViewDetails: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
  onContactHost: (property: Property) => void;
  onBookProperty: (property: Property) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
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

  // Search Bar State
  const [searchCategory, setSearchCategory] = useState<'all' | 'house' | 'land'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Coimbatore');
  const [selectedCity, setSelectedCity] = useState<string>('Pollachi');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Featured filter
  const [featuredTab, setFeaturedTab] = useState<'all' | 'house' | 'land'>('all');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [locs, props] = await Promise.all([
          api.getLocations(),
          api.getProperties({ status: 'Available' }) // exclude sold from available showcase
        ]);
        setLocations(locs);
        setProperties(props);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const currentDistrictObj = locations.find(d => (d.district || d.name) === selectedDistrict);
  const availableCities = currentDistrictObj ? currentDistrictObj.cities : [];
  const currentCityObj = availableCities.find(c => c.name === selectedCity);
  const availableLocalities = currentCityObj ? currentCityObj.localities : [];

  const handleDistrictChange = (d: string) => {
    setSelectedDistrict(d);
    const dist = locations.find(x => (x.district || x.name) === d);
    if (dist && dist.cities.length > 0) {
      setSelectedCity(dist.cities[0].name);
      setSelectedLocality('');
    } else {
      setSelectedCity('');
      setSelectedLocality('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = {
      category: searchCategory === 'all' ? undefined : searchCategory,
      district: selectedDistrict,
      city: selectedCity,
      locality: selectedLocality,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    };

    if (searchCategory === 'land') {
      onNavigate('land', params);
    } else {
      onNavigate('houses', params);
    }
  };

  const filteredFeatured = properties.filter(p => {
    if (featuredTab === 'all') return true;
    return p.category === featuredTab;
  }).slice(0, 6);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-forest-950 text-white pt-12 pb-24 lg:pt-16 lg:pb-32 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Main Hero Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/80 text-emerald-200 text-xs font-semibold shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Real Estate Platform for Tamil Nadu</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.15]">
              Find Your Perfect Property Across Tamil Nadu
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto font-light leading-relaxed">
              Discover verified luxury homes and fertile land, explore regional hubs, and obtain accurate market valuations powered by trained machine learning.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('houses')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Explore Houses</span>
              </button>

              <button
                onClick={() => onNavigate('land')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800/90 text-white hover:bg-emerald-800 border border-emerald-600/60 text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Explore Land</span>
              </button>

              <button
                onClick={() => onNavigate('prediction')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>AI Price Prediction</span>
              </button>
            </div>
          </div>

          {/* Search Panel Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-gray-900">
            
            {/* Category Toggle Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
              <button
                type="button"
                onClick={() => setSearchCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  searchCategory === 'all'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Properties
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('house')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  searchCategory === 'house'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Houses Only</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('land')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  searchCategory === 'land'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Land Only</span>
              </button>
            </div>

            {/* Filter Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* District */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">
                    Tamil Nadu District
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                    <select
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium text-gray-900"
                    >
                      {locations.map(d => {
                        const distName = d.district || d.name;
                        return (
                          <option key={distName} value={distName}>
                            {distName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* City / Taluk */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">
                    City / Taluk
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedLocality('');
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium text-gray-900"
                  >
                    <option value="">All Cities / Taluks</option>
                    {availableCities.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locality */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">
                    Locality / Area
                  </label>
                  {availableLocalities.length > 0 ? (
                    <select
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium text-gray-900"
                    >
                      <option value="">All Localities ({availableLocalities.length})</option>
                      {availableLocalities.map(loc => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Mahalingapuram, Kovilpalayam..."
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  )}
                </div>

              </div>

              {/* Price Range & Submit Button */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 items-end">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">
                    Min Budget (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500000 (25L)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">
                    Max Budget (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15000000 (1.5 Cr)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Verified Listings</span>
                  </button>
                </div>
              </div>

              {/* Quick Pollachi Localities Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                <span className="font-semibold text-emerald-900">Popular Pollachi Hubs:</span>
                {['Mahalingapuram', 'Kovilpalayam', 'Anaimalai', 'Kinathukadavu', 'Suleeswaranpatti', 'Aliyar', 'Palakkad Road'].map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => {
                      setSelectedDistrict('Coimbatore');
                      setSelectedCity('Pollachi');
                      setSelectedLocality(loc);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 hover:text-emerald-900 text-gray-700 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </form>

          </div>

        </div>
      </section>

      {/* Available Properties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct Host Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Properties Available For Sale
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Active verified properties ready for immediate inspection and registry across Tamil Nadu.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setFeaturedTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                featuredTab === 'all' ? 'bg-white text-emerald-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Available
            </button>
            <button
              onClick={() => setFeaturedTab('house')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                featuredTab === 'house' ? 'bg-white text-emerald-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Houses
            </button>
            <button
              onClick={() => setFeaturedTab('land')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                featuredTab === 'land' ? 'bg-white text-emerald-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Land Parcels
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredFeatured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatured.map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onViewDetails={onViewDetails}
                onRequestVisit={onRequestVisit}
                onContactHost={onContactHost}
                onBookProperty={onBookProperty}
                isSaved={savedIds.includes(prop.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-700">No properties found matching this criteria.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate(featuredTab === 'land' ? 'land' : 'houses')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-emerald-300 hover:border-emerald-600 text-emerald-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all"
          >
            <span>View All {featuredTab === 'land' ? 'Land Parcels' : 'House Listings'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </section>

      {/* AI Machine Learning Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-forest-900 to-emerald-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#f59e0b20_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Scikit-Learn Machine Learning Engine</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
              Instant AI Property Valuation Across Tamil Nadu
            </h2>

            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Trained on real Tamil Nadu municipal guideline rates, proximity metrics (schools, hospitals, transit, highways), road widths, and floor dimensions. Compare predictions across <strong>Gradient Boosting</strong>, <strong>Random Forest</strong>, and <strong>Linear Regression</strong> models.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onNavigate('prediction')}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Calculate Your Property Value</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>R² Score: 0.9846 • Transparent Factor Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Focus: Pollachi & Tamil Nadu Corridors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            Key Real Estate Regions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Explore deep localized inventory across Pollachi municipality and premier Tamil Nadu growth corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Mahalingapuram */}
          <div 
            onClick={() => onNavigate('houses', { district: 'Coimbatore', city: 'Pollachi', locality: 'Mahalingapuram' })}
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition-colors">
              Mahalingapuram, Pollachi
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Prime residential center, wide roads, premier schools and medical institutions.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
              <span>View Available Properties</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Kovilpalayam & Anaimalai */}
          <div 
            onClick={() => onNavigate('houses', { district: 'Coimbatore', city: 'Pollachi', locality: 'Kovilpalayam' })}
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition-colors">
              Kovilpalayam & Anaimalai
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Suburban living, tranquil coconut estates, and high-value gated farm plots.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
              <span>View Available Properties</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Kinathukadavu Corridor */}
          <div 
            onClick={() => onNavigate('land', { district: 'Coimbatore', city: 'Pollachi', locality: 'Kinathukadavu' })}
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition-colors">
              Kinathukadavu & Negamam
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Coimbatore-Pollachi high-speed highway expansion and commercial development.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
              <span>View Available Properties</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: Aliyar & Foothills */}
          <div 
            onClick={() => onNavigate('houses', { district: 'Coimbatore', city: 'Pollachi', locality: 'Aliyar' })}
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition-colors">
              Aliyar Dam & Foothills
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Scenic resort properties, luxury holiday villas, and fertile agricultural land.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
              <span>View Available Properties</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
