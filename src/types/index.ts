export type IssueCategory =
  | 'streetlights'
  | 'drainage'
  | 'roads'
  | 'traffic'
  | 'water_pipeline'
  | 'sanitation'
  | 'sidewalk';

export type IssueStatus =
  | 'reported'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface WardInfo {
  id: string;
  name: string;
  code: string;
  zone: string;
  supervisor: string;
  depotPhone: string;
  center: [number, number]; // [lat, lng]
  bounds: [number, number][]; // Polygon coordinates
  color: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: IssueStatus;
  authorName: string;
  authorRole: 'citizen' | 'field_worker' | 'official' | 'system';
  department?: string;
  notes: string;
  photoUrl?: string;
}

export interface IssueComment {
  id: string;
  authorName: string;
  authorRole: 'resident' | 'staff';
  text: string;
  timestamp: string;
}

export interface ReportedIssue {
  id: string; // e.g. "CP-2026-409"
  title: string;
  description: string;
  category: IssueCategory;
  urgency: UrgencyLevel;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
    neighborhood?: string;
  };
  wardId: string;
  wardName: string;
  reportedAt: string;
  reportedBy: {
    name: string;
    phone?: string;
    email?: string;
    isVerified: boolean;
    residentId: string;
  };
  upvotes: number;
  upvotedByMe?: boolean;
  photoUrl?: string;
  resolvedPhotoUrl?: string;
  assignedCrew?: {
    crewId: string;
    crewName: string;
    leadWorker: string;
    vehicleNumber: string;
    eta?: string;
  };
  timeline: TimelineEvent[];
  comments: IssueComment[];
  subscribers: string[]; // List of user emails or IDs
}

export type UserRole = 'resident' | 'field_worker' | 'official';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  wardId?: string;
  department?: string;
  badgeNumber?: string;
  isVerified: boolean;
  avatarSeed: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  issueId: string;
  type: 'status_change' | 'crew_assigned' | 'resolved' | 'community_vote';
  read: boolean;
}

export type ThemePreset =
  | 'slate'
  | 'midnight'
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'twilight'
  | 'obsidian';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  description: string;
  bgHex: string;
  cardHex: string;
  textHex: string;
  swatchGradient: string;
  isDark: boolean;
  appClass: string;
}

