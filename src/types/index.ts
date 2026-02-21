// Feature Flag Configuration
export interface FeatureFlags {
  driverFeedback: boolean;
  tripFeedback: boolean;
  appFeedback: boolean;
  marshalFeedback: boolean;
}

// Feedback Types
export type SentimentType = 'positive' | 'neutral' | 'negative';
export type EntityType = 'driver' | 'trip' | 'app' | 'marshal';

export interface FeedbackTag {
  id: string;
  label: string;
}

export interface FeedbackSection {
  entityType: EntityType;
  title: string;
  rating: number;
  tags: string[];
  comment: string;
  tagsAvailable: FeedbackTag[];
}

export interface FeedbackSubmission {
  sections: FeedbackSection[];
  submittedAt: string;
}

// Driver Types
export interface Driver {
  id: string;
  name: string;
  totalTrips: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  recentFeedback: FeedbackEntry[];
  isAlert: boolean;
}

export interface FeedbackEntry {
  id: string;
  entityType: EntityType;
  sentiment: SentimentType;
  score: number;
  timestamp: string;
  text: string;
  tags: string[];
  driverId: string;
  driverName: string;
}

// Dashboard Types
export interface DashboardMetrics {
  totalFeedback: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  averageScore: number;
  driversBelowThreshold: number;
  // Category breakdown
  driverCount: number;
  tripCount: number;
  appCount: number;
  marshalCount: number;
}

export interface Alert {
  id: string;
  driverId: string;
  driverName: string;
  currentScore: number;
  threshold: number;
  timestamp: string;
  isRead: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Date Range
export type DateRange = 'today' | '7days' | '30days';

// Sort Configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Filter Configuration
export interface FilterConfig {
  scoreRange: [number, number] | null;
  searchQuery: string;
  entityType: EntityType | 'all';
  sentiment: SentimentType | 'all';
}
