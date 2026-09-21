import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Property, 
  User, 
  BookingRequest, 
  VisitRequest, 
  Enquiry, 
  PredictionRecord 
} from '../src/types';
import { SAMPLE_PROPERTIES, SAMPLE_HOSTS } from './sampleData';

const DB_DIR = path.join(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'storage.json');

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  properties: Property[];
  bookings: BookingRequest[];
  visits: VisitRequest[];
  enquiries: Enquiry[];
  predictions: PredictionRecord[];
  savedProperties: { userId: string; propertyId: string; createdAt: string }[];
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: [],
      properties: [],
      bookings: [],
      visits: [],
      enquiries: [],
      predictions: [],
      savedProperties: []
    };
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading existing database file, re-seeding:', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    // Seed sample hosts with default password "AvenzaHost2026!"
    const seededUsers: StoredUser[] = SAMPLE_HOSTS.map(h => {
      const { hash, salt } = hashPassword('AvenzaHost2026!');
      return {
        ...h,
        passwordHash: hash,
        salt
      };
    });

    // Also seed a default sample client user:
    const { hash: uHash, salt: uSalt } = hashPassword('AvenzaUser2026!');
    seededUsers.push({
      id: "user_avenza_demo",
      name: "Rajesh Kannan",
      email: "rajesh.demo@avenza.com",
      phone: "+91 98401 22334",
      accountType: "user",
      createdAt: "2026-02-10T10:00:00.000Z",
      passwordHash: uHash,
      salt: uSalt
    });

    this.data = {
      users: seededUsers,
      properties: [...SAMPLE_PROPERTIES],
      bookings: [
        {
          id: "BKG-101",
          propertyId: "AVN-H-1001",
          propertyTitle: "Grand 4 BHK Royal Villa with Landscaped Lawn",
          propertyCategory: "house",
          propertyPrice: 13500000,
          propertyLocation: "Mahalingapuram, Pollachi",
          userId: "user_avenza_demo",
          userName: "Rajesh Kannan",
          userEmail: "rajesh.demo@avenza.com",
          userPhone: "+91 98401 22334",
          hostId: "host_avenza_01",
          preferredDate: "2026-03-25",
          preferredTime: "11:00 AM",
          message: "Interested in purchasing this villa. Requesting discussion with host.",
          status: "Confirmed",
          createdAt: "2026-03-15T09:00:00.000Z"
        }
      ],
      visits: [
        {
          id: "VST-201",
          propertyId: "AVN-L-2001",
          propertyTitle: "DTCP Approved Residential Villa Plot in Prime Mahalingapuram",
          propertyCategory: "land",
          propertyPrice: 5280000,
          propertyLocation: "Mahalingapuram, Pollachi",
          userId: "user_avenza_demo",
          userName: "Rajesh Kannan",
          userEmail: "rajesh.demo@avenza.com",
          userPhone: "+91 98401 22334",
          hostId: "host_avenza_01",
          preferredDate: "2026-03-26",
          preferredTime: "04:30 PM",
          message: "Would like to inspect the corner layout road and dimensions in person.",
          status: "Pending",
          createdAt: "2026-03-16T14:30:00.000Z"
        }
      ],
      enquiries: [
        {
          id: "ENQ-301",
          propertyId: "AVN-H-1002",
          propertyTitle: "Charming 3 BHK Independent House with Car Porch",
          userId: "user_avenza_demo",
          userName: "Rajesh Kannan",
          userEmail: "rajesh.demo@avenza.com",
          userPhone: "+91 98401 22334",
          hostId: "host_avenza_02",
          message: "Is bank loan approval from SBI or HDFC already in place for this property?",
          createdAt: "2026-03-16T15:00:00.000Z"
        }
      ],
      predictions: [
        {
          id: "PRED-9001",
          userId: "user_avenza_demo",
          date: "2026-03-14T11:20:00.000Z",
          category: "house",
          district: "Coimbatore",
          city: "Pollachi",
          locality: "Mahalingapuram",
          propertyType: "Villa",
          inputValues: {
            builtUpArea: 2800,
            landArea: 3000,
            bedrooms: 4,
            bathrooms: 4,
            roadWidth: 40,
            propertyAge: 1
          },
          predictedPrice: 12880000,
          pricePerSqft: 4600,
          estimatedRange: "₹1.22 Cr - ₹1.35 Cr",
          modelUsed: "Gradient Boosting Regressor (Trained ML Model)",
          factors: [
            {
              factor: "Prime Locality (Mahalingapuram)",
              impact: "+₹18.4 Lakhs",
              description: "High residential demand area in central Pollachi",
              type: "positive"
            },
            {
              factor: "Built-up & Land Area",
              impact: "+₹85.0 Lakhs",
              description: "Generous 2,800 sq.ft living space",
              type: "positive"
            },
            {
              factor: "Road Width (40 ft)",
              impact: "+₹6.2 Lakhs",
              description: "Wide avenue road accessibility",
              type: "positive"
            }
          ]
        }
      ],
      savedProperties: [
        {
          userId: "user_avenza_demo",
          propertyId: "AVN-H-1001",
          createdAt: "2026-03-15T08:30:00.000Z"
        }
      ]
    };

    this.save();
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- USER AUTHENTICATION ---
  public registerUser(params: {
    name: string;
    email: string;
    phone: string;
    password: string;
    accountType: 'user' | 'host';
  }): { user: User } {
    const existing = this.data.users.find(u => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please login.');
    }

    const { hash, salt } = hashPassword(params.password);
    const newUser: StoredUser = {
      id: `${params.accountType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: params.name.trim(),
      email: params.email.toLowerCase().trim(),
      phone: params.phone.trim(),
      accountType: params.accountType,
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt
    };

    this.data.users.push(newUser);
    this.save();

    const { passwordHash, salt: _, ...safeUser } = newUser;
    return { user: safeUser };
  }

  public loginUser(email: string, password: string): { user: User } {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error('No account found with this email address.');
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new Error('Incorrect password. Please try again.');
    }

    const { passwordHash, salt: _, ...safeUser } = user;
    return { user: safeUser };
  }

  public getUserById(id: string): User | null {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, salt: _, ...safeUser } = user;
    return safeUser;
  }

  // --- PROPERTIES ---
  public getProperties(query?: {
    category?: string;
    district?: string;
    city?: string;
    locality?: string;
    status?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    hostId?: string;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest';
  }): Property[] {
    let result = [...this.data.properties];

    if (query?.hostId) {
      result = result.filter(p => p.hostId === query.hostId);
    }

    if (query?.category) {
      result = result.filter(p => p.category === query.category);
    }

    if (query?.status) {
      result = result.filter(p => p.status === query.status);
    }

    if (query?.district && query.district !== 'All') {
      result = result.filter(p => p.district.toLowerCase() === query.district?.toLowerCase());
    }

    if (query?.city && query.city !== 'All') {
      result = result.filter(p => p.city.toLowerCase() === query.city?.toLowerCase());
    }

    if (query?.locality && query.locality !== 'All') {
      result = result.filter(p => p.locality.toLowerCase().includes(query.locality?.toLowerCase() || ''));
    }

    if (query?.propertyType && query.propertyType !== 'All') {
      result = result.filter(p => p.propertyType === query.propertyType);
    }

    if (query?.minPrice !== undefined && !isNaN(query.minPrice)) {
      result = result.filter(p => p.price >= query.minPrice!);
    }

    if (query?.maxPrice !== undefined && !isNaN(query.maxPrice)) {
      result = result.filter(p => p.price <= query.maxPrice!);
    }

    if (query?.bedrooms !== undefined && !isNaN(query.bedrooms) && query.bedrooms > 0) {
      result = result.filter(p => (p.bedrooms || 0) >= query.bedrooms!);
    }

    if (query?.bathrooms !== undefined && !isNaN(query.bathrooms) && query.bathrooms > 0) {
      result = result.filter(p => (p.bathrooms || 0) >= query.bathrooms!);
    }

    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) ||
        p.locality.toLowerCase().includes(s) ||
        p.city.toLowerCase().includes(s) ||
        p.district.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
      );
    }

    if (query?.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (query?.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }

  public getPropertyById(id: string): Property | null {
    return this.data.properties.find(p => p.id === id) || null;
  }

  public createProperty(property: Omit<Property, 'id' | 'createdAt'>): Property {
    const count = this.data.properties.length + 1001;
    const prefix = property.category === 'house' ? 'AVN-H' : 'AVN-L';
    const id = `${prefix}-${count}`;

    const newProp: Property = {
      ...property,
      id,
      createdAt: new Date().toISOString()
    };

    this.data.properties.unshift(newProp);
    this.save();
    return newProp;
  }

  public updateProperty(id: string, hostId: string, updates: Partial<Property>): Property {
    const index = this.data.properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    const existing = this.data.properties[index];
    if (existing.hostId !== hostId) {
      throw new Error('Unauthorized: You can only edit properties you own.');
    }

    const updated: Property = {
      ...existing,
      ...updates,
      id: existing.id,
      hostId: existing.hostId,
      updatedAt: new Date().toISOString()
    };

    this.data.properties[index] = updated;
    this.save();
    return updated;
  }

  public deleteProperty(id: string, hostId: string): boolean {
    const index = this.data.properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    if (this.data.properties[index].hostId !== hostId) {
      throw new Error('Unauthorized: You can only delete properties you own.');
    }

    this.data.properties.splice(index, 1);
    this.save();
    return true;
  }

  // --- BOOKINGS ---
  public createBooking(booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>): BookingRequest {
    const newBooking: BookingRequest = {
      ...booking,
      id: `BKG-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    this.data.bookings.unshift(newBooking);
    this.save();
    return newBooking;
  }

  public getBookingsForUser(userId: string): BookingRequest[] {
    return this.data.bookings.filter(b => b.userId === userId);
  }

  public getBookingsForHost(hostId: string): BookingRequest[] {
    return this.data.bookings.filter(b => b.hostId === hostId);
  }

  public updateBookingStatus(id: string, hostId: string, status: BookingRequest['status']): BookingRequest {
    const item = this.data.bookings.find(b => b.id === id);
    if (!item) throw new Error('Booking request not found');
    if (item.hostId !== hostId) throw new Error('Unauthorized to update this booking');
    item.status = status;
    this.save();
    return item;
  }

  // --- VISITS ---
  public createVisit(visit: Omit<VisitRequest, 'id' | 'createdAt' | 'status'>): VisitRequest {
    const newVisit: VisitRequest = {
      ...visit,
      id: `VST-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    this.data.visits.unshift(newVisit);
    this.save();
    return newVisit;
  }

  public getVisitsForUser(userId: string): VisitRequest[] {
    return this.data.visits.filter(v => v.userId === userId);
  }

  public getVisitsForHost(hostId: string): VisitRequest[] {
    return this.data.visits.filter(v => v.hostId === hostId);
  }

  public updateVisitStatus(id: string, hostId: string, status: VisitRequest['status'], rescheduleNote?: string): VisitRequest {
    const item = this.data.visits.find(v => v.id === id);
    if (!item) throw new Error('Visit request not found');
    if (item.hostId !== hostId) throw new Error('Unauthorized to update this visit');
    item.status = status;
    if (rescheduleNote) item.rescheduleNote = rescheduleNote;
    this.save();
    return item;
  }

  // --- ENQUIRIES ---
  public createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt'>): Enquiry {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `ENQ-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnquiry);
    this.save();
    return newEnquiry;
  }

  public getEnquiriesForUser(userId: string): Enquiry[] {
    return this.data.enquiries.filter(e => e.userId === userId);
  }

  public getEnquiriesForHost(hostId: string): Enquiry[] {
    return this.data.enquiries.filter(e => e.hostId === hostId);
  }

  // --- PREDICTIONS ---
  public savePrediction(prediction: Omit<PredictionRecord, 'id' | 'date'>): PredictionRecord {
    const newPred: PredictionRecord = {
      ...prediction,
      id: `PRED-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString()
    };
    this.data.predictions.unshift(newPred);
    this.save();
    return newPred;
  }

  public getPredictionsForUser(userId: string): PredictionRecord[] {
    return this.data.predictions.filter(p => p.userId === userId);
  }

  // --- SAVED / WISHLIST ---
  public toggleSavedProperty(userId: string, propertyId: string): { saved: boolean } {
    const index = this.data.savedProperties.findIndex(s => s.userId === userId && s.propertyId === propertyId);
    if (index !== -1) {
      this.data.savedProperties.splice(index, 1);
      this.save();
      return { saved: false };
    } else {
      this.data.savedProperties.push({
        userId,
        propertyId,
        createdAt: new Date().toISOString()
      });
      this.save();
      return { saved: true };
    }
  }

  public getSavedPropertiesForUser(userId: string): Property[] {
    const savedIds = this.data.savedProperties
      .filter(s => s.userId === userId)
      .map(s => s.propertyId);
    return this.data.properties.filter(p => savedIds.includes(p.id));
  }

  public isPropertySaved(userId: string, propertyId: string): boolean {
    return this.data.savedProperties.some(s => s.userId === userId && s.propertyId === propertyId);
  }
}

export const db = new Database();
