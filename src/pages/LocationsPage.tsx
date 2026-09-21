import React, { useState, useEffect } from 'react';
import { MapPin, Search, Building2, Layers, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { DistrictInfo } from '../../backend/locationsData';
import { api } from '../services/api';

interface LocationsPageProps {
  onNavigate: (page: string, filters?: any) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onNavigate }) => {
  const [locations, setLocations] = useState<DistrictInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Coimbatore');

  useEffect(() => {
    async function loadLocs() {
      try {
        const data = await api.getLocations();
        setLocations(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadLocs();
  }, []);

  const activeDistrict = locations.find(d => (d.district || d.name).toLowerCase() === selectedDistrict.toLowerCase()) || locations[0];
  const activeDistrictName = activeDistrict ? (activeDistrict.district || activeDistrict.name) : '';

  const filteredDistricts = locations.filter(d => {
    const dName = d.district || d.name;
    return (
      dName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cities.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.localities.some(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>Tamil Nadu Real Estate Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
          Explore Tamil Nadu Property Locations
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Comprehensive geographic coverage spanning municipal corporations, taluk headquarters, and prime residential colonies across Tamil Nadu.
        </p>
      </div>

      {/* Pollachi Spotlight Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-forest-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 inline-block">
            REGIONAL SPOTLIGHT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Pollachi & Anaimalai Foothills Region
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Pollachi is Tamil Nadu's green paradise and premier agricultural & educational hub. High demand residential layouts and farm parcels available across Mahalingapuram, Kovilpalayam, Anaimalai, Suleeswaranpatti, Kinathukadavu, Aliyar, and surrounding corridors.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('houses', { district: 'Coimbatore', city: 'Pollachi' })}
              className="px-4 py-2 bg-white text-emerald-950 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>View Houses in Pollachi</span>
            </button>
            <button
              onClick={() => onNavigate('land', { district: 'Coimbatore', city: 'Pollachi' })}
              className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 border border-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>View Land Parcels in Pollachi</span>
            </button>
          </div>
        </div>
      </div>

      {/* District Selector & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: District List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search district or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white shadow-2xs"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-2 max-h-[600px] overflow-y-auto space-y-1 shadow-2xs">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
              Tamil Nadu Districts ({filteredDistricts.length})
            </p>
            {filteredDistricts.map(d => {
              const dName = d.district || d.name;
              const isSelected = activeDistrictName === dName;
              return (
                <button
                  key={dName}
                  onClick={() => setSelectedDistrict(dName)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isSelected 
                      ? 'bg-emerald-800 text-white font-bold shadow-xs' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                    <span>{dName}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {d.cities.length} {d.cities.length === 1 ? 'City' : 'Cities'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cities & Localities of Selected District */}
        <div className="lg:col-span-2 space-y-6">
          {activeDistrict && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-serif">
                    {activeDistrictName} District
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click on any locality to directly view available properties.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('houses', { district: activeDistrictName })}
                  className="px-3.5 py-1.5 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  <span>All in {activeDistrictName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cities and Localities */}
              <div className="space-y-6">
                {activeDistrict.cities.map(c => (
                  <div key={c.name} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        <span>{c.name}</span>
                      </h4>
                      <span className="text-xs text-gray-500">{c.localities.length} Localities mapped</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {c.localities.map(loc => (
                        <button
                          key={loc.name}
                          onClick={() => onNavigate('houses', { district: activeDistrictName, city: c.name, locality: loc.name })}
                          className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-600 hover:text-emerald-900 text-xs text-gray-700 transition-all font-medium shadow-2xs flex items-center gap-1.5 group"
                        >
                          <span>{loc.name}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
