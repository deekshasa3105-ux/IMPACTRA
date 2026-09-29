import { IssueCategory, WardInfo } from '../types';

// Real-world city center simulation (San Francisco / Metropolis inspired coordinates)
export const CITY_CENTER: [number, number] = [37.7749, -122.4194];

// Municipal Wards with geographical polygons and supervisor depots
export const MUNICIPAL_WARDS: WardInfo[] = [
  {
    id: 'ward-1',
    name: 'Ward 1 - Downtown & Civic Core',
    code: 'W1-CIV',
    zone: 'Central Urban',
    supervisor: 'Marcus Vance, PE',
    depotPhone: '(555) 019-4821',
    center: [37.783, -122.416],
    bounds: [
      [37.792, -122.428],
      [37.792, -122.404],
      [37.774, -122.404],
      [37.774, -122.428],
    ],
    color: '#3B82F6', // Vibrant Royal Blue
  },
  {
    id: 'ward-2',
    name: 'Ward 2 - Waterfront & Marina District',
    code: 'W2-MAR',
    zone: 'Northern Coastal',
    supervisor: 'Helena Silva',
    depotPhone: '(555) 019-7734',
    center: [37.801, -122.435],
    bounds: [
      [37.812, -122.450],
      [37.812, -122.420],
      [37.792, -122.420],
      [37.792, -122.450],
    ],
    color: '#06B6D4', // Vibrant Cyan
  },
  {
    id: 'ward-3',
    name: 'Ward 3 - Sunset Hills & Greenway',
    code: 'W3-SNT',
    zone: 'Western Residential',
    supervisor: 'David Chen',
    depotPhone: '(555) 019-3329',
    center: [37.760, -122.470],
    bounds: [
      [37.774, -122.495],
      [37.774, -122.445],
      [37.745, -122.445],
      [37.745, -122.495],
    ],
    color: '#10B981', // Vibrant Emerald
  },
  {
    id: 'ward-4',
    name: 'Ward 4 - Mission & Arts Corridor',
    code: 'W4-MSN',
    zone: 'Southern Commercial',
    supervisor: 'Rosa Hernandez',
    depotPhone: '(555) 019-8910',
    center: [37.755, -122.418],
    bounds: [
      [37.774, -122.435],
      [37.774, -122.400],
      [37.738, -122.400],
      [37.738, -122.435],
    ],
    color: '#F59E0B', // Vibrant Amber
  },
  {
    id: 'ward-5',
    name: 'Ward 5 - Industrial Logistics & Port Bay',
    code: 'W5-PRT',
    zone: 'Eastern Industrial',
    supervisor: 'Arthur Kowalski',
    depotPhone: '(555) 019-5561',
    center: [37.740, -122.385],
    bounds: [
      [37.765, -122.400],
      [37.765, -122.370],
      [37.720, -122.370],
      [37.720, -122.400],
    ],
    color: '#8B5CF6', // Vibrant Purple
  },
];

// Helper: Point in polygon algorithm for accurate ward detection
export function getWardByCoordinates(lat: number, lng: number): WardInfo {
  for (const ward of MUNICIPAL_WARDS) {
    const poly = ward.bounds;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0],
        yi = poly[i][1];
      const xj = poly[j][0],
        yj = poly[j][1];
      const intersect =
        yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    if (inside) return ward;
  }

  // Fallback to nearest ward by Euclidean distance
  let closestWard = MUNICIPAL_WARDS[0];
  let minDistance = Infinity;
  for (const ward of MUNICIPAL_WARDS) {
    const d = Math.hypot(lat - ward.center[0], lng - ward.center[1]);
    if (d < minDistance) {
      minDistance = d;
      closestWard = ward;
    }
  }
  return closestWard;
}

// Simulated reverse geocoding with realistic urban streets
const STREET_NAMES = [
  'Market Street',
  'Mission Boulevard',
  'Valencia Way',
  'Montgomery Avenue',
  'Columbus Promenade',
  'Folsom Expressway',
  'Geary Boulevard',
  'Van Ness Corridor',
  'California Street',
  'Embarcadero Way',
  'Harrison Street',
  'Howard Crossway',
];

const LANDMARKS = [
  'near Metro Station Plaza',
  'outside Public Library branch',
  'adjacent to Community Park',
  'in front of Elementary School',
  'near Bus Stop Shelter #42',
  'by Corner Pharmacy',
  'near Fire Station 14',
  'along bicycle commuter lane',
];

export function reverseGeocodeEstimate(lat: number, lng: number): { address: string; neighborhood: string } {
  const ward = getWardByCoordinates(lat, lng);
  const hash = Math.abs(Math.floor((lat * 1000 + lng * 1000) * 100));
  const street = STREET_NAMES[hash % STREET_NAMES.length];
  const number = (hash % 850) + 120;
  const landmark = LANDMARKS[hash % LANDMARKS.length];

  return {
    address: `${number} ${street} (${landmark})`,
    neighborhood: ward.name.split(' - ')[1] || 'Metro Zone',
  };
}

// Smart classification dictionary and confidence scoring
interface CategoryRule {
  category: IssueCategory;
  name: string;
  keywords: string[];
  department: string;
  defaultUrgency: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
  color: string;
  bgBadge: string;
}

export const CATEGORY_DEFINITIONS: Record<IssueCategory, CategoryRule> = {
  streetlights: {
    category: 'streetlights',
    name: 'Broken Streetlights',
    keywords: [
      'light',
      'lamp',
      'streetlight',
      'dark',
      'flicker',
      'bulb',
      'pole',
      'luminaire',
      'blackout',
      'night',
      'visibility',
    ],
    department: 'Bureau of Street Lighting & Electrical',
    defaultUrgency: 'medium',
    icon: 'SunDim',
    color: '#D97706', // Sunny Amber
    bgBadge: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  drainage: {
    category: 'drainage',
    name: 'Blocked Drainage & Flooding',
    keywords: [
      'drain',
      'drainage',
      'clog',
      'flood',
      'water',
      'gutter',
      'manhole',
      'storm',
      'sewer',
      'standing water',
      'puddle',
      'overflow',
    ],
    department: 'Water & Stormwater Utility',
    defaultUrgency: 'high',
    icon: 'Droplets',
    color: '#0284C7', // Vivid Ocean Blue
    bgBadge: 'bg-sky-100 text-sky-900 border-sky-300',
  },
  roads: {
    category: 'roads',
    name: 'Unsafe Roads & Potholes',
    keywords: [
      'pothole',
      'road',
      'asphalt',
      'crater',
      'bump',
      'crack',
      'pavement',
      'lane',
      'tarmac',
      'dented',
      'tire damage',
      'rough',
      'hole',
    ],
    department: 'Department of Public Works - Roadway Division',
    defaultUrgency: 'high',
    icon: 'AlertTriangle',
    color: '#E11D48', // Bright Crimson/Rose
    bgBadge: 'bg-rose-100 text-rose-900 border-rose-300',
  },
  traffic: {
    category: 'traffic',
    name: 'Traffic Signal & Signage Outage',
    keywords: [
      'traffic light',
      'signal',
      'stop sign',
      'crosswalk',
      'pedestrian signal',
      'intersection',
      'sign',
      'blinking red',
      'speed limit',
    ],
    department: 'Municipal Transportation Agency (MTA)',
    defaultUrgency: 'critical',
    icon: 'SlidersHorizontal',
    color: '#7C3AED', // Bright Violet
    bgBadge: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  water_pipeline: {
    category: 'water_pipeline',
    name: 'Water Main & Hydrant Leak',
    keywords: [
      'pipe',
      'burst',
      'leak',
      'gushing',
      'hydrant',
      'water main',
      'pressure',
      'valve',
      'meter box',
    ],
    department: 'City Water Infrastructure Commission',
    defaultUrgency: 'critical',
    icon: 'Activity',
    color: '#0D9488', // Teal
    bgBadge: 'bg-teal-100 text-teal-900 border-teal-300',
  },
  sanitation: {
    category: 'sanitation',
    name: 'Waste & Illegal Dumping',
    keywords: [
      'garbage',
      'trash',
      'dumping',
      'waste',
      'bin',
      'litter',
      'debris',
      'mattress',
      'refuse',
      'cleanup',
    ],
    department: 'Sanitation & Resource Recovery',
    defaultUrgency: 'medium',
    icon: 'Trash2',
    color: '#16A34A', // Vibrant Emerald
    bgBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  sidewalk: {
    category: 'sidewalk',
    name: 'Damaged Sidewalk & Curb Hazard',
    keywords: [
      'sidewalk',
      'curb',
      'concrete',
      'trip hazard',
      'walkway',
      'root heave',
      'ramp',
      'wheelchair access',
    ],
    department: 'Pedestrian Safety & Sidewalk Repair',
    defaultUrgency: 'medium',
    icon: 'Footprints',
    color: '#EA580C', // Bright Orange
    bgBadge: 'bg-orange-100 text-orange-900 border-orange-300',
  },
};

// Automatic categorization algorithm that evaluates user input
export function autoCategorizeIssue(
  title: string,
  description: string
): { category: IssueCategory; confidence: number; detectedKeywords: string[] } {
  const combined = `${title} ${description}`.toLowerCase();
  let bestCategory: IssueCategory = 'roads';
  let bestScore = 0;
  let bestKeywords: string[] = [];

  for (const [catKey, rule] of Object.entries(CATEGORY_DEFINITIONS)) {
    let score = 0;
    const foundKeywords: string[] = [];
    for (const kw of rule.keywords) {
      if (combined.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
        foundKeywords.push(kw);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = catKey as IssueCategory;
      bestKeywords = foundKeywords;
    }
  }

  // Confidence 0 to 1
  const confidence = bestScore > 0 ? Math.min(0.98, 0.45 + bestScore * 0.12) : 0.3;

  return {
    category: bestCategory,
    confidence: Number(confidence.toFixed(2)),
    detectedKeywords: bestKeywords,
  };
}

// Web Notifications API helper
export async function requestPushNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendCivicPushNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch {
      // Fallback handled by in-app toast/drawer
    }
  }
}
