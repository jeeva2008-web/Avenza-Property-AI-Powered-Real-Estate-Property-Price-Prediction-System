export type PropertyCategory = 'house' | 'land';

export type HouseType = 
  | 'Independent House' 
  | 'Villa' 
  | 'Apartment' 
  | 'Flat' 
  | 'Duplex' 
  | 'Row House';

export type LandType = 
  | 'Residential' 
  | 'Commercial' 
  | 'Agricultural';

export type PropertyStatus = 'Available' | 'Booked' | 'Sold';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Completed';

export type VisitStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Rescheduled';

export interface NearbyFacilities {
  school?: number; // km
  hospital?: number;
  supermarket?: number;
  busStop?: number;
  railwayStation?: number;
  metro?: number;
  bankAtm?: number;
  park?: number;
  mainRoad?: number;
  highway?: number;
}

export interface Property {
  id: string; // e.g. "AVN-H-1042" or "AVN-L-2015"
  title: string;
  category: PropertyCategory;
  propertyType: HouseType | LandType;
  status: PropertyStatus;
  district: string;
  city: string;
  locality: string;
  address: string;
  price: number;
  landArea: number; // sq.ft
  builtUpArea?: number; // sq.ft (houses)
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  parking?: number;
  propertyAge?: number; // years
  roadWidth: number; // feet
  furnished?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  description: string;
  images: string[];
  nearbyFacilities: NearbyFacilities;
  hostId: string;
  hostName: string;
  hostEmail: string;
  hostPhone: string;
  createdAt: string;
  updatedAt?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: 'user' | 'host';
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCategory: PropertyCategory;
  propertyPrice: number;
  propertyLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  hostId: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCategory: PropertyCategory;
  propertyPrice: number;
  propertyLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  hostId: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: VisitStatus;
  rescheduleNote?: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  hostId: string;
  message: string;
  createdAt: string;
}

export interface PredictionFactor {
  factor: string;
  impact: string; // e.g. "+₹4.2 Lakhs (Prime Locality)" or "High Value Driver"
  description: string;
  type: 'positive' | 'neutral' | 'negative';
}

export interface PredictionRecord {
  id: string;
  userId: string;
  date: string;
  createdAt?: string;
  category: PropertyCategory;
  district: string;
  city: string;
  locality: string;
  propertyType: string;
  inputValues: Record<string, any>;
  predictedPrice: number;
  pricePerSqft: number;
  estimatedRange: string;
  modelUsed: string;
  factors: PredictionFactor[];
}

export interface ModelMetrics {
  modelName: string;
  r2: number;
  mae: number;
  rmse: number;
  isBest?: boolean;
}

export interface MLPredictionResponse {
  success: boolean;
  category: PropertyCategory;
  estimated_price: number;
  price_per_sqft: number;
  estimated_range: string;
  model_used: string;
  evaluation_metrics: {
    best_model: string;
    r2_score: number;
    mae: number;
    rmse: number;
    models_evaluated: ModelMetrics[];
  };
  factors: PredictionFactor[];
  error?: string;
}
