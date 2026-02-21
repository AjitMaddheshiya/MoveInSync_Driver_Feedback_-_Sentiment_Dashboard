import { Driver, FeedbackEntry, FeatureFlags, Alert } from '../types';

// Feature Flags Configuration
export const defaultFeatureFlags: FeatureFlags = {
  driverFeedback: true,
  tripFeedback: true,
  appFeedback: false,
  marshalFeedback: false,
};

// Available Tags per Entity Type
export const feedbackTags: Record<string, { id: string; label: string }[]> = {
  driver: [
    { id: 'rash-driving', label: 'Rash Driving' },
    { id: 'safe-driving', label: 'Safe Driving' },
    { id: 'very-polite', label: 'Very Polite' },
    { id: 'rude', label: 'Rude' },
    { id: 'good-communication', label: 'Good Communication' },
    { id: 'late-pickup', label: 'Late Pickup' },
    { id: 'early-arrival', label: 'Early Arrival' },
    { id: 'clean-vehicle', label: 'Clean Vehicle' },
  ],
  trip: [
    { id: 'punctual', label: 'Punctual' },
    { id: 'late', label: 'Late' },
    { id: 'accurate-route', label: 'Accurate Route' },
    { id: 'wrong-route', label: 'Wrong Route' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'uncomfortable', label: 'Uncomfortable' },
    { id: 'smooth-ride', label: 'Smooth Ride' },
    { id: 'bumpy-ride', label: 'Bumpy Ride' },
  ],
  app: [
    { id: 'easy-to-use', label: 'Easy to Use' },
    { id: 'confusing', label: 'Confusing' },
    { id: 'fast', label: 'Fast' },
    { id: 'slow', label: 'Slow' },
    { id: 'reliable', label: 'Reliable' },
    { id: 'crashes', label: 'Crashes Often' },
  ],
  marshal: [
    { id: 'helpful', label: 'Helpful' },
    { id: 'unprofessional', label: 'Unprofessional' },
    { id: 'safe', label: 'Safe' },
    { id: 'unsafe', label: 'Unsafe' },
    { id: 'professional', label: 'Professional' },
  ],
};

// Generate mock drivers
const driverNames = [
  'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Williams', 'Michael Brown',
  'Emily Davis', 'James Wilson', 'Jennifer Moore', 'Robert Taylor', 'Lisa Anderson',
  'William Thomas', 'Amanda Jackson', 'Christopher White', 'Jessica Harris', 'Daniel Martin',
  'Ashley Thompson', 'Matthew Robinson', 'Stephanie Clark', 'Andrew Lewis', 'Nicole Walker'
];

export const mockDrivers: Driver[] = driverNames.map((name, index) => {
  const averageScore = Math.round((2 + Math.random() * 3) * 10) / 10; // 2.0 - 5.0
  const trendValue = Math.round((Math.random() * 2 - 1) * 10) / 10; // -1.0 to 1.0
  const trend = trendValue > 0.3 ? 'up' : trendValue < -0.3 ? 'down' : 'stable';
  
  return {
    id: `DRV${String(index + 1).padStart(4, '0')}`,
    name,
    totalTrips: Math.floor(50 + Math.random() * 450),
    averageScore,
    trend,
    trendValue,
    recentFeedback: [],
    isAlert: averageScore < 2.5,
  };
});

// Generate mock feedback entries
const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
const entityTypes: ('driver' | 'trip' | 'app' | 'marshal')[] = ['driver', 'trip', 'app', 'marshal'];

const feedbackTexts = [
  'Great service! The driver was very professional.',
  'The ride was comfortable and on time.',
  'Driver was rude and arrived late.',
  'Amazing experience, will recommend to others.',
  'Route was not accurate, took longer than expected.',
  'Very polite driver, clean vehicle.',
  'Had some issues with the app, but overall okay.',
  'The marshal was very helpful during boarding.',
  'Trip was smooth and comfortable.',
  'Driver drove rashly, felt unsafe.',
  'Excellent service, always punctual.',
  'App was slow but driver was good.',
];

const generateFeedbackEntries = (count: number): FeedbackEntry[] => {
  const entries: FeedbackEntry[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const score = Math.floor(Math.random() * 5) + 1;
    let sentiment: 'positive' | 'neutral' | 'negative';
    
    if (score >= 4) sentiment = 'positive';
    else if (score >= 3) sentiment = 'neutral';
    else sentiment = 'negative';
    
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000);
    
    // Select random tags
    const availableTags = feedbackTags[entityType] || [];
    const numTags = Math.floor(Math.random() * 3);
    const selectedTags = availableTags
      .sort(() => Math.random() - 0.5)
      .slice(0, numTags)
      .map(t => t.label);
    
    entries.push({
      id: `FB${String(i + 1).padStart(6, '0')}`,
      entityType,
      sentiment,
      score,
      timestamp: timestamp.toISOString(),
      text: feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)],
      tags: selectedTags,
      driverId: driver.id,
      driverName: driver.name,
    });
  }
  
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const mockFeedbackEntries = generateFeedbackEntries(150);

// Populate recent feedback for each driver
mockDrivers.forEach(driver => {
  driver.recentFeedback = mockFeedbackEntries
    .filter(f => f.driverId === driver.id)
    .slice(0, 5);
});

// Generate alerts
export const mockAlerts: Alert[] = mockDrivers
  .filter(d => d.isAlert)
  .map(driver => ({
    id: `ALT${driver.id.slice(3)}`,
    driverId: driver.id,
    driverName: driver.name,
    currentScore: driver.averageScore,
    threshold: 2.5,
    timestamp: new Date().toISOString(),
    isRead: false,
  }));

// Helper functions
export const getSentimentFromScore = (score: number): 'positive' | 'neutral' | 'negative' => {
  if (score >= 4) return 'positive';
  if (score >= 3) return 'neutral';
  return 'negative';
};

export const getScoreColor = (score: number): string => {
  if (score >= 4) return 'var(--color-success)';
  if (score >= 2.5) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

export const getScoreBadgeClass = (score: number): string => {
  if (score >= 4) return 'badge-success';
  if (score >= 2.5) return 'badge-warning';
  return 'badge-danger';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getMetricsByDateRange = (range: 'today' | '7days' | '30days') => {
  const now = new Date();
  let startDate: Date;
  
  switch (range) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }
  
  const filteredFeedback = mockFeedbackEntries.filter(
    f => new Date(f.timestamp) >= startDate
  );
  
  const positiveCount = filteredFeedback.filter(f => f.sentiment === 'positive').length;
  const neutralCount = filteredFeedback.filter(f => f.sentiment === 'neutral').length;
  const negativeCount = filteredFeedback.filter(f => f.sentiment === 'negative').length;
  const averageScore = filteredFeedback.length > 0
    ? filteredFeedback.reduce((sum, f) => sum + f.score, 0) / filteredFeedback.length
    : 0;
  
  return {
    totalFeedback: filteredFeedback.length,
    positiveCount,
    neutralCount,
    negativeCount,
    averageScore: Math.round(averageScore * 10) / 10,
    driversBelowThreshold: mockDrivers.filter(d => d.averageScore < 2.5).length,
  };
};
