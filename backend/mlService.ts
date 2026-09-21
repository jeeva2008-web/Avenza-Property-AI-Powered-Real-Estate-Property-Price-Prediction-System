import { execFile } from 'child_process';
import path from 'path';
import { MLPredictionResponse, PropertyCategory } from '../src/types';

const PREDICT_SCRIPT_PATH = path.join(process.cwd(), 'ml', 'predict.py');

export function cleanNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const str = String(val).trim();
  const match = str.match(/[-+]?\d*\.?\d+/);
  if (match) {
    const num = parseFloat(match[0]);
    return isNaN(num) ? fallback : num;
  }
  return fallback;
}

export async function runMLPrediction(payload: {
  category: PropertyCategory;
  district: string;
  city: string;
  locality: string;
  propertyType: string;
  builtUpArea?: number;
  landArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  parking?: number;
  propertyAge?: number;
  roadWidth?: number;
  nearbyFacilities?: Record<string, number>;
  distMainRoad?: number;
  distSchool?: number;
  distHospital?: number;
  distTransport?: number;
}): Promise<MLPredictionResponse> {
  // Sanitize all inputs so numbers are clean
  const sanitizedPayload = {
    category: payload.category,
    district: payload.district || 'Coimbatore',
    city: payload.city || 'Pollachi',
    locality: payload.locality || 'Mahalingapuram',
    propertyType: payload.propertyType,
    landType: payload.propertyType,
    builtUpArea: cleanNumber(payload.builtUpArea, 1800),
    landArea: cleanNumber(payload.landArea, 2400),
    bedrooms: cleanNumber(payload.bedrooms, 3),
    bathrooms: cleanNumber(payload.bathrooms, 3),
    floors: cleanNumber(payload.floors, 2),
    parking: cleanNumber(payload.parking, 1),
    propertyAge: cleanNumber(payload.propertyAge, 1),
    roadWidth: cleanNumber(payload.roadWidth, 33),
    distMainRoad: cleanNumber(payload.distMainRoad, 0.5),
    distSchool: cleanNumber(payload.distSchool, 1.0),
    distHospital: cleanNumber(payload.distHospital, 1.5),
    distTransport: cleanNumber(payload.distTransport, 1.0),
    nearbyFacilities: payload.nearbyFacilities || {}
  };

  return new Promise((resolve, reject) => {
    execFile(
      'python3',
      [PREDICT_SCRIPT_PATH, JSON.stringify(sanitizedPayload)],
      { maxBuffer: 1024 * 1024 * 4 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('Python ML execution error:', stderr || error.message);
          return reject(new Error(stderr || error.message));
        }

        try {
          const result = JSON.parse(stdout.trim());
          if (result.success === false) {
            return reject(new Error(result.error || 'ML prediction returned failure'));
          }
          resolve(result as MLPredictionResponse);
        } catch (parseErr) {
          console.error('Failed to parse ML response JSON:', stdout);
          reject(new Error('Invalid output format from ML prediction engine'));
        }
      }
    );
  });
}
