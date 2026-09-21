import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Building2, 
  Layers, 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  HelpCircle, 
  ShieldCheck, 
  BarChart3, 
  Award,
  Clock,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { MLPredictionResponse } from '../types';
import { DistrictInfo } from '../../backend/locationsData';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/PropertyCard';

interface PredictionPageProps {
  onNavigate: (page: string, filters?: any) => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();
  const [locations, setLocations] = useState<DistrictInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'house' | 'land'>('house');

  // Common location states
  const [district, setDistrict] = useState('Coimbatore');
  const [city, setCity] = useState('Pollachi');
  const [locality, setLocality] = useState('Mahalingapuram');

  // House Form State
  const [propertyType, setPropertyType] = useState('Villa');
  const [builtUpArea, setBuiltUpArea] = useState<number | string>(2800);
  const [landArea, setLandArea] = useState<number | string>(3200);
  const [bedrooms, setBedrooms] = useState<number | string>(4);
  const [bathrooms, setBathrooms] = useState<number | string>(4);
  const [floors, setFloors] = useState<number | string>(2);
  const [parking, setParking] = useState<number | string>(2);
  const [propertyAge, setPropertyAge] = useState<number | string>(1);
  const [roadWidth, setRoadWidth] = useState<number | string>(40);

  // House Facilities Distances (km)
  const [distSchool, setDistSchool] = useState<number | string>(0.8);
  const [distHospital, setDistHospital] = useState<number | string>(1.2);
  const [distSupermarket, setDistSupermarket] = useState<number | string>(0.5);
  const [distBusStop, setDistBusStop] = useState<number | string>(0.4);
  const [distRailMetro, setDistRailMetro] = useState<number | string>(2.2);
  const [distBankAtm, setDistBankAtm] = useState<number | string>(0.5);
  const [distPark, setDistPark] = useState<number | string>(0.3);
  const [distMainRoad, setDistMainRoad] = useState<number | string>(0.2);

  // Land Form State
  const [landType, setLandType] = useState('Residential');
  const [landOnlyArea, setLandOnlyArea] = useState<number | string>(2400);
  const [landRoadWidth, setLandRoadWidth] = useState<number | string>(33);
  const [landDistMainRoad, setLandDistMainRoad] = useState<number | string>(0.4);
  const [landDistSchool, setLandDistSchool] = useState<number | string>(1.0);
  const [landDistHospital, setLandDistHospital] = useState<number | string>(1.5);
  const [landDistTransport, setLandDistTransport] = useState<number | string>(0.8);

  // Execution State
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<MLPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocations() {
      try {
        const locs = await api.getLocations();
        setLocations(locs);
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    }
    loadLocations();
  }, []);

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

  const handleCityChange = (c: string) => {
    setCity(c);
    const ct = availableCities.find(x => x.name === c);
    if (ct && ct.localities.length > 0) {
      setLocality(ct.localities[0].name);
    } else {
      setLocality('');
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let payload: any;
      if (activeTab === 'house') {
        payload = {
          category: 'house',
          district,
          city,
          locality,
          propertyType,
          builtUpArea: Number(builtUpArea),
          landArea: Number(landArea),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          floors: Number(floors),
          parking: Number(parking),
          propertyAge: Number(propertyAge),
          roadWidth: Number(roadWidth),
          nearbyFacilities: {
            school: Number(distSchool),
            hospital: Number(distHospital),
            supermarket: Number(distSupermarket),
            busStop: Number(distBusStop),
            railwayStation: Number(distRailMetro),
            bankAtm: Number(distBankAtm),
            park: Number(distPark),
            mainRoad: Number(distMainRoad)
          }
        };
      } else {
        payload = {
          category: 'land',
          district,
          city,
          locality,
          landType,
          landArea: Number(landOnlyArea),
          roadWidth: Number(landRoadWidth),
          distMainRoad: Number(landDistMainRoad),
          distSchool: Number(landDistSchool),
          distHospital: Number(landDistHospital),
          distTransport: Number(landDistTransport)
        };
      }

      const res = await api.predictPrice(payload);
      setPredictionResult(res);

      // Scroll to result smoothly
      const resElem = document.getElementById('prediction-results-view');
      if (resElem) {
        resElem.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Scikit-Learn Machine Learning Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
          AI Property Price Prediction
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
          Accurately forecast house and land market values across Tamil Nadu using trained Regression and Gradient Boosting models calibrated on municipal land guidelines and proximity metrics.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-xl mx-auto flex p-1.5 bg-gray-100/90 rounded-2xl border border-gray-200">
        <button
          onClick={() => { setActiveTab('house'); setPredictionResult(null); setError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'house'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span>PREDICT HOUSE PRICE</span>
        </button>

        <button
          onClick={() => { setActiveTab('land'); setPredictionResult(null); setError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'land'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>PREDICT LAND PRICE</span>
        </button>
      </div>

      {/* Main Input Form Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md">
        <form onSubmit={handlePredict} className="space-y-8">
          
          {/* Section 1: Location Selection */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 pb-2 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>1. Location In Tamil Nadu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
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
                <label className="text-xs font-semibold text-gray-700 block mb-1">City / Taluk</label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                >
                  {availableCities.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Locality</label>
                {availableLocalities.length > 0 ? (
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                  >
                    {availableLocalities.map(loc => (
                      <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Mahalingapuram"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Property Specifications */}
          {activeTab === 'house' ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 pb-2 border-b border-gray-100">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>2. House Specifications & Dimensions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="Villa">Villa (+25% Premium)</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Duplex">Duplex House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Row House">Row House</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Built-up Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    min={300}
                    max={25000}
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Land / Plot Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    min={400}
                    max={50000}
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Road Width (ft)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={120}
                    value={roadWidth}
                    onChange={(e) => setRoadWidth(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                    <option value={5}>5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value={1}>1 Bathroom</option>
                    <option value={2}>2 Bathrooms</option>
                    <option value={3}>3 Bathrooms</option>
                    <option value={4}>4 Bathrooms</option>
                    <option value={5}>5+ Bathrooms</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Floors</label>
                  <select
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value={1}>1 (Ground Floor)</option>
                    <option value={2}>2 (G + 1)</option>
                    <option value={3}>3 (G + 2)</option>
                    <option value={4}>4 (G + 3)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Parking / Property Age</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={parking}
                      onChange={(e) => setParking(e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                    >
                      <option value={0}>0 Car</option>
                      <option value={1}>1 Car</option>
                      <option value={2}>2 Cars</option>
                      <option value={3}>3+ Cars</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Age (yrs)"
                      min={0}
                      max={60}
                      value={propertyAge}
                      onChange={(e) => setPropertyAge(e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 pb-2 border-b border-gray-100">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>2. Land Parcel Specifications</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Zoning & Land Type</label>
                  <select
                    value={landType}
                    onChange={(e) => setLandType(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="Residential">Residential Plot</option>
                    <option value="Commercial">Commercial Land (+55% Premium)</option>
                    <option value="Agricultural">Agricultural Land / Farm</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Land Extent (sq.ft)</label>
                  <input
                    type="number"
                    required
                    min={600}
                    max={200000}
                    value={landOnlyArea}
                    onChange={(e) => setLandOnlyArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    ≈ {(Number(landOnlyArea) / 435.6).toFixed(1)} Cents ({((Number(landOnlyArea) / 43560)).toFixed(2)} Acres)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Road Frontage Width (ft)</label>
                  <input
                    type="number"
                    required
                    min={12}
                    max={150}
                    value={landRoadWidth}
                    onChange={(e) => setLandRoadWidth(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Nearby Facilities & Distance Metrics */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>3. Proximity Metrics (Distance in Kilometers)</span>
              </div>
              <span className="text-[11px] font-normal text-gray-500 lowercase">Used by ML model to calculate amenity score</span>
            </div>

            {activeTab === 'house' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-gray-600 block mb-1 font-medium">School (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={20}
                    value={distSchool}
                    onChange={(e) => setDistSchool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Hospital (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={25}
                    value={distHospital}
                    onChange={(e) => setDistHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Supermarket (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={15}
                    value={distSupermarket}
                    onChange={(e) => setDistSupermarket(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Bus Stop (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={10}
                    value={distBusStop}
                    onChange={(e) => setDistBusStop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Railway / Metro (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={40}
                    value={distRailMetro}
                    onChange={(e) => setDistRailMetro(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Bank / ATM (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={10}
                    value={distBankAtm}
                    onChange={(e) => setDistBankAtm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Park (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={15}
                    value={distPark}
                    onChange={(e) => setDistPark(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Main Road (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.05}
                    max={15}
                    value={distMainRoad}
                    onChange={(e) => setDistMainRoad(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Main Road Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.05}
                    max={20}
                    value={landDistMainRoad}
                    onChange={(e) => setLandDistMainRoad(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">School Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.2}
                    max={20}
                    value={landDistSchool}
                    onChange={(e) => setLandDistSchool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Hospital Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.2}
                    max={25}
                    value={landDistHospital}
                    onChange={(e) => setLandDistHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Transport Hub (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={20}
                    value={landDistTransport}
                    onChange={(e) => setLandDistTransport(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{loading ? 'Executing Trained ML Regression Models...' : `Calculate AI ${activeTab === 'house' ? 'House' : 'Land'} Valuation`}</span>
          </button>
        </form>
      </div>

      {/* PREDICTION RESULTS DISPLAY */}
      {predictionResult && (
        <div id="prediction-results-view" className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Main Valuation Summary Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-forest-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-emerald-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-800/80">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 inline-block mb-2">
                  AI VALUATION REPORT
                </span>
                <h3 className="text-xl font-bold font-serif">
                  {locality}, {city} • {activeTab === 'house' ? propertyType : landType}
                </h3>
              </div>

              {user ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 text-emerald-200 text-xs font-medium border border-emerald-700">
                  <BookmarkCheck className="w-4 h-4 text-amber-300" />
                  <span>Saved to your Prediction History</span>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                  Sign in to save this prediction
                </button>
              )}
            </div>

            {/* Big Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <span className="text-xs text-emerald-300 block font-medium">Estimated Property Value</span>
                <span className="text-3xl sm:text-4xl font-bold text-amber-300 font-serif block mt-1">
                  {formatPrice(predictionResult.estimated_price)}
                </span>
                <span className="text-xs text-gray-300 block mt-1 font-mono">
                  (₹{predictionResult.estimated_price.toLocaleString('en-IN')})
                </span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <span className="text-xs text-emerald-300 block font-medium">Calculated Rate / Sq.Ft</span>
                <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">
                  ₹{predictionResult.price_per_sqft.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400 block mt-1">
                  Across {activeTab === 'house' ? builtUpArea : landOnlyArea} sq.ft
                </span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <span className="text-xs text-emerald-300 block font-medium">Market Value Range</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-200 block mt-1">
                  {predictionResult.estimated_range}
                </span>
                <span className="text-xs text-gray-400 block mt-1">
                  Expected 95% confidence interval
                </span>
              </div>
            </div>

            {/* Model Badge */}
            <div className="pt-4 border-t border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Selected Best Predictor: <strong>{predictionResult.model_used}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span>R² Score: <strong>{predictionResult.evaluation_metrics.r2_score.toFixed(4)}</strong></span>
                <span>•</span>
                <span>MAE: <strong>₹{(predictionResult.evaluation_metrics.mae / 100000).toFixed(2)} Lakhs</strong></span>
              </div>
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>Model Comparison & Performance Benchmarks</span>
                </h4>
                <p className="text-xs text-gray-500">Evaluated on 80/20 train-test splits on Tamil Nadu real-estate data</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg">
                Verified Accuracy
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2.5 font-semibold">Algorithm</th>
                    <th className="py-2.5 font-semibold">R² Score (Variance Explained)</th>
                    <th className="py-2.5 font-semibold">Mean Absolute Error (MAE)</th>
                    <th className="py-2.5 font-semibold">Root Mean Squared Error (RMSE)</th>
                    <th className="py-2.5 font-semibold text-right">Selection Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {predictionResult.evaluation_metrics.models_evaluated.map((m) => (
                    <tr key={m.modelName} className={m.isBest ? 'bg-emerald-50/60 font-bold' : ''}>
                      <td className="py-3 text-gray-900 flex items-center gap-1.5">
                        {m.isBest && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{m.modelName}</span>
                      </td>
                      <td className="py-3 text-gray-700">{(m.r2 * 100).toFixed(2)}% ({m.r2.toFixed(4)})</td>
                      <td className="py-3 text-gray-700">₹{(m.mae / 100000).toFixed(2)} Lakhs</td>
                      <td className="py-3 text-gray-700">₹{(m.rmse / 100000).toFixed(2)} Lakhs</td>
                      <td className="py-3 text-right">
                        {m.isBest ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-white">
                            Selected
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[10px]">Evaluated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Factor Breakdown: Why this price? */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Why This Price? Factor Influence Breakdown</span>
              </h4>
              <p className="text-xs text-gray-500">Key valuation drivers specific to this property configuration</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {predictionResult.factors.map((factor, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span>{factor.factor}</span>
                    <span className="text-emerald-800 font-mono">{factor.impact}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-emerald-950">Looking to purchase in this locality?</h4>
              <p className="text-xs text-emerald-800 mt-0.5">Explore active verified listings currently available in {locality} & {city}.</p>
            </div>
            <button
              onClick={() => onNavigate(activeTab === 'house' ? 'houses' : 'land', { district, city, locality })}
              className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-2 shrink-0"
            >
              <span>View Listings in {locality}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
