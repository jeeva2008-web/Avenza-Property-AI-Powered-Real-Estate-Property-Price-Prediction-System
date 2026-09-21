import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './backend/db';
import { TAMIL_NADU_LOCATIONS } from './backend/locationsData';
import { runMLPrediction } from './backend/mlService';

const app = express();
const PORT = 3000;

app.use(express.json());

// Token helper (HMAC/Base64 session token)
function parseAuthHeader(req: express.Request): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    return userId || null;
  } catch {
    return null;
  }
}

function createToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Locations endpoint
app.get('/api/locations', (req, res) => {
  res.json(TAMIL_NADU_LOCATIONS);
});

// AUTH: Sign Up
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, accountType } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const type = accountType === 'host' ? 'host' : 'user';
    const { user } = db.registerUser({
      name,
      email,
      phone,
      password,
      accountType: type
    });

    const token = createToken(user.id);
    return res.status(201).json({ user, token });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

// AUTH: Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { user } = db.loginUser(email, password);
    const token = createToken(user.id);
    return res.json({ user, token });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Invalid credentials.' });
  }
});

// AUTH: Current User
app.get('/api/auth/me', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User session expired or not found' });
  }

  return res.json({ user });
});

// PROPERTIES: List & Filter
app.get('/api/properties', (req, res) => {
  try {
    const {
      category,
      district,
      city,
      locality,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      search,
      sort,
      hostId
    } = req.query;

    const properties = db.getProperties({
      category: category as string,
      district: district as string,
      city: city as string,
      locality: locality as string,
      propertyType: propertyType as string,
      status: status as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string, 10) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms as string, 10) : undefined,
      search: search as string,
      sort: sort as any,
      hostId: hostId as string
    });

    return res.json(properties);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PROPERTIES: Single details
app.get('/api/properties/:id', (req, res) => {
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }
  return res.json(property);
});

// PROPERTIES: Create (Host only)
app.post('/api/properties', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to add a property' });

  const host = db.getUserById(userId);
  if (!host || host.accountType !== 'host') {
    return res.status(403).json({ error: 'Only registered host accounts can add properties.' });
  }

  try {
    const body = req.body;
    if (!body.title || !body.category || !body.price || !body.locality) {
      return res.status(400).json({ error: 'Missing required property details.' });
    }

    const created = db.createProperty({
      ...body,
      hostId: host.id,
      hostName: host.name,
      hostEmail: host.email,
      hostPhone: host.phone,
      status: body.status || 'Available'
    });

    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// PROPERTIES: Update (Host only)
app.put('/api/properties/:id', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const updated = db.updateProperty(req.params.id, userId, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
});

// PROPERTIES: Delete (Host only)
app.delete('/api/properties/:id', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    db.deleteProperty(req.params.id, userId);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
});

// ML PREDICTION ENDPOINT
app.post('/api/predict', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.category || !payload.locality) {
      return res.status(400).json({ success: false, error: 'Category and locality are required.' });
    }

    const prediction = await runMLPrediction(payload);

    // If user is logged in, optionally auto-save prediction record
    const userId = parseAuthHeader(req);
    if (userId) {
      try {
        db.savePrediction({
          userId,
          category: prediction.category,
          district: payload.district || 'Coimbatore',
          city: payload.city || 'Pollachi',
          locality: payload.locality,
          propertyType: payload.propertyType || payload.landType || 'Residential',
          inputValues: payload,
          predictedPrice: prediction.estimated_price,
          pricePerSqft: prediction.price_per_sqft,
          estimatedRange: prediction.estimated_range,
          modelUsed: prediction.model_used,
          factors: prediction.factors
        });
      } catch (saveErr) {
        console.error('Failed to auto-save prediction history:', saveErr);
      }
    }

    return res.json(prediction);
  } catch (err: any) {
    console.error('Prediction API error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Prediction calculation failed' });
  }
});

// PREDICTIONS: History for logged-in user
app.get('/api/predictions', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to view prediction history' });

  const history = db.getPredictionsForUser(userId);
  return res.json(history);
});

// BOOKINGS
app.post('/api/bookings', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to submit a booking request' });

  const user = db.getUserById(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  try {
    const { propertyId, preferredDate, preferredTime, message } = req.body;
    const property = db.getPropertyById(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const booking = db.createBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyCategory: property.category,
      propertyPrice: property.price,
      propertyLocation: `${property.locality}, ${property.city}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      hostId: property.hostId,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '11:00 AM',
      message: message || ''
    });

    return res.status(201).json(booking);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.get('/api/bookings', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = db.getUserById(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  if (user.accountType === 'host') {
    return res.json(db.getBookingsForHost(user.id));
  } else {
    return res.json(db.getBookingsForUser(user.id));
  }
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { status } = req.body;
    const updated = db.updateBookingStatus(req.params.id, userId, status);
    return res.json(updated);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
});

// VISITS
app.post('/api/visits', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to request a property visit' });

  const user = db.getUserById(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  try {
    const { propertyId, preferredDate, preferredTime, message, name, phone, email } = req.body;
    const property = db.getPropertyById(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const visit = db.createVisit({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyCategory: property.category,
      propertyPrice: property.price,
      propertyLocation: `${property.locality}, ${property.city}`,
      userId: user.id,
      userName: name || user.name,
      userEmail: email || user.email,
      userPhone: phone || user.phone,
      hostId: property.hostId,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '04:00 PM',
      message: message || ''
    });

    return res.status(201).json(visit);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.get('/api/visits', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = db.getUserById(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  if (user.accountType === 'host') {
    return res.json(db.getVisitsForHost(user.id));
  } else {
    return res.json(db.getVisitsForUser(user.id));
  }
});

app.patch('/api/visits/:id/status', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { status, rescheduleNote } = req.body;
    const updated = db.updateVisitStatus(req.params.id, userId, status, rescheduleNote);
    return res.json(updated);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
});

// ENQUIRIES
app.post('/api/enquiries', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to send an enquiry' });

  const user = db.getUserById(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  try {
    const { propertyId, message } = req.body;
    const property = db.getPropertyById(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const enquiry = db.createEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      hostId: property.hostId,
      message: message || 'Interested in this property'
    });

    return res.status(201).json(enquiry);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.get('/api/enquiries', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = db.getUserById(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  if (user.accountType === 'host') {
    return res.json(db.getEnquiriesForHost(user.id));
  } else {
    return res.json(db.getEnquiriesForUser(user.id));
  }
});

// SAVED PROPERTIES (Wishlist)
app.post('/api/saved-properties/toggle', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to save properties' });

  const { propertyId } = req.body;
  if (!propertyId) return res.status(400).json({ error: 'Property ID is required' });

  const result = db.toggleSavedProperty(userId, propertyId);
  return res.json(result);
});

app.get('/api/saved-properties', (req, res) => {
  const userId = parseAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Please login to view saved properties' });

  const saved = db.getSavedPropertiesForUser(userId);
  return res.json(saved);
});

// ----------------- VITE / STATIC SERVING -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AVENZA PROPERTY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
