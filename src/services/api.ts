import { 
  Property, 
  User, 
  BookingRequest, 
  VisitRequest, 
  Enquiry, 
  PredictionRecord, 
  MLPredictionResponse, 
  PropertyCategory 
} from '../types';
import { DistrictInfo } from '../../backend/locationsData';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('avenza_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async signup(data: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to sign up');
    return json;
  },

  async login(data: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to login');
    return json;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Session expired');
    return json;
  },

  // Locations
  async getLocations(): Promise<DistrictInfo[]> {
    const res = await fetch(`${BASE_URL}/locations`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  // Properties
  async getProperties(params?: Record<string, any>): Promise<Property[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'All') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${BASE_URL}/properties?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json();
  },

  async getProperty(id: string): Promise<Property> {
    const res = await fetch(`${BASE_URL}/properties/${id}`);
    if (!res.ok) throw new Error('Failed to fetch property details');
    return res.json();
  },

  async createProperty(data: Partial<Property>): Promise<Property> {
    const res = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create property');
    return json;
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const res = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update property');
    return json;
  },

  async deleteProperty(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || 'Failed to delete property');
    }
    return true;
  },

  // ML Prediction
  async predictPrice(payload: any): Promise<MLPredictionResponse> {
    const res = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.error || 'Failed to calculate price prediction');
    }
    return json;
  },

  async getPredictionHistory(): Promise<PredictionRecord[]> {
    const res = await fetch(`${BASE_URL}/predictions`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to load prediction history');
    return res.json();
  },

  // Bookings
  async createBooking(data: { propertyId: string; preferredDate: string; preferredTime: string; message: string }): Promise<BookingRequest> {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit booking');
    return json;
  },

  async getBookings(): Promise<BookingRequest[]> {
    const res = await fetch(`${BASE_URL}/bookings`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to load bookings');
    return res.json();
  },

  async getHostBookings(): Promise<BookingRequest[]> {
    return this.getBookings();
  },

  async updateBookingStatus(id: string, status: string): Promise<BookingRequest> {
    const res = await fetch(`${BASE_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update booking status');
    return json;
  },

  async updatePropertyStatus(id: string, status: 'Available' | 'Booked' | 'Sold'): Promise<Property> {
    return this.updateProperty(id, { status });
  },

  // Visits
  async createVisit(data: { propertyId: string; preferredDate: string; preferredTime: string; message: string; name?: string; phone?: string; email?: string }): Promise<VisitRequest> {
    const res = await fetch(`${BASE_URL}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to schedule visit');
    return json;
  },

  async getVisits(): Promise<VisitRequest[]> {
    const res = await fetch(`${BASE_URL}/visits`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to load visits');
    return res.json();
  },

  async getHostVisits(): Promise<VisitRequest[]> {
    return this.getVisits();
  },

  async updateVisitStatus(id: string, status: string, rescheduleNote?: string): Promise<VisitRequest> {
    const res = await fetch(`${BASE_URL}/visits/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status, rescheduleNote })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update visit status');
    return json;
  },

  // Enquiries
  async createEnquiry(data: { propertyId: string; message: string }): Promise<Enquiry> {
    const res = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to send enquiry');
    return json;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch(`${BASE_URL}/enquiries`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to load enquiries');
    return res.json();
  },

  // Saved / Wishlist
  async toggleSaved(propertyId: string): Promise<{ saved: boolean }> {
    const res = await fetch(`${BASE_URL}/saved-properties/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ propertyId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to toggle saved');
    return json;
  },

  async saveProperty(propertyId: string): Promise<void> {
    await this.toggleSaved(propertyId);
  },

  async removeSavedProperty(propertyId: string): Promise<void> {
    await this.toggleSaved(propertyId);
  },

  async getSavedProperties(): Promise<Property[]> {
    const res = await fetch(`${BASE_URL}/saved-properties`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to load saved properties');
    return res.json();
  }
};
