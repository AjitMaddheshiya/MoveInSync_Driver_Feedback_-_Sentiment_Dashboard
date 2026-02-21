import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  FeatureFlags, 
  Driver, 
  Alert, 
  FeedbackEntry, 
  DateRange,
  SortConfig,
  FilterConfig,
  DashboardMetrics,
  User,
  UserRole
} from '../types';
import { 
  defaultFeatureFlags, 
  mockDrivers, 
  mockAlerts, 
  mockFeedbackEntries,
  getMetricsByDateRange 
} from '../data/mockData';

// Storage keys
const STORAGE_KEYS = {
  FEEDBACK_ENTRIES: 'driverFeedback_feedbackEntries',
  DRIVERS: 'driverFeedback_drivers',
  ALERTS: 'driverFeedback_alerts',
  USER: 'driverFeedback_user',
};

// Load from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
  }
  return defaultValue;
};

// Save to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// Helper function to calculate metrics from feedback entries
const calculateMetrics = (feedbackEntries: FeedbackEntry[], dateRange: DateRange, drivers: Driver[]): DashboardMetrics => {
  const now = new Date();
  let startDate: Date;
  
  switch (dateRange) {
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
  
  const filteredFeedback = feedbackEntries.filter(
    f => new Date(f.timestamp) >= startDate
  );
  
  const positiveCount = filteredFeedback.filter(f => f.sentiment === 'positive').length;
  const neutralCount = filteredFeedback.filter(f => f.sentiment === 'neutral').length;
  const negativeCount = filteredFeedback.filter(f => f.sentiment === 'negative').length;
  const averageScore = filteredFeedback.length > 0
    ? filteredFeedback.reduce((sum, f) => sum + f.score, 0) / filteredFeedback.length
    : 0;
  
  // Category breakdown
  const driverCount = filteredFeedback.filter(f => f.entityType === 'driver').length;
  const tripCount = filteredFeedback.filter(f => f.entityType === 'trip').length;
  const appCount = filteredFeedback.filter(f => f.entityType === 'app').length;
  const marshalCount = filteredFeedback.filter(f => f.entityType === 'marshal').length;
  
  return {
    totalFeedback: filteredFeedback.length,
    positiveCount,
    neutralCount,
    negativeCount,
    averageScore: Math.round(averageScore * 10) / 10,
    driversBelowThreshold: drivers.filter(d => d.averageScore < 2.5).length,
    driverCount,
    tripCount,
    appCount,
    marshalCount,
  };
};

// Helper function to recalculate driver scores based on feedback
const recalculateDriverScores = (drivers: Driver[], feedbackEntries: FeedbackEntry[]): Driver[] => {
  return drivers.map(driver => {
    const driverFeedback = feedbackEntries.filter(f => f.driverId === driver.id);
    const totalScore = driverFeedback.reduce((sum, f) => sum + f.score, 0);
    const avgScore = driverFeedback.length > 0 
      ? Math.round((totalScore / driverFeedback.length) * 10) / 10 
      : driver.averageScore;
    
    return {
      ...driver,
      averageScore: avgScore,
      isAlert: avgScore < 2.5,
      recentFeedback: driverFeedback.slice(0, 5),
    };
  });
};

// State Interface
interface AppState {
  featureFlags: FeatureFlags;
  drivers: Driver[];
  alerts: Alert[];
  feedbackEntries: FeedbackEntry[];
  dateRange: DateRange;
  metrics: DashboardMetrics;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  selectedDriver: Driver | null;
  isLoading: boolean;
  user: User | null;
}

// Action Types
type AppAction =
  | { type: 'SET_FEATURE_FLAGS'; payload: FeatureFlags }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_SORT_CONFIG'; payload: SortConfig }
  | { type: 'SET_FILTER_CONFIG'; payload: Partial<FilterConfig> }
  | { type: 'SET_SELECTED_DRIVER'; payload: Driver | null }
  | { type: 'ADD_FEEDBACK'; payload: FeedbackEntry }
  | { type: 'MARK_ALERT_READ'; payload: string }
  | { type: 'CLEAR_ALL_ALERTS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

// Initial State - Load from localStorage or use defaults
const getInitialState = (): AppState => {
  const storedFeedback = loadFromStorage<FeedbackEntry[]>(STORAGE_KEYS.FEEDBACK_ENTRIES, []);
  const storedDrivers = loadFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, []);
  const storedAlerts = loadFromStorage<Alert[]>(STORAGE_KEYS.ALERTS, []);
  const storedUser = loadFromStorage<User | null>(STORAGE_KEYS.USER, null);
  
  // If no stored data, use mock data
  const feedbackEntries = storedFeedback.length > 0 ? storedFeedback : mockFeedbackEntries;
  const drivers = storedDrivers.length > 0 ? storedDrivers : mockDrivers;
  const alerts = storedAlerts.length > 0 ? storedAlerts : mockAlerts;
  
  return {
    featureFlags: defaultFeatureFlags,
    drivers,
    alerts,
    feedbackEntries,
    dateRange: '7days',
    metrics: calculateMetrics(feedbackEntries, '7days', drivers),
    sortConfig: { key: 'averageScore', direction: 'desc' },
    filterConfig: {
      scoreRange: null,
      searchQuery: '',
      entityType: 'all',
      sentiment: 'all',
    },
    selectedDriver: null,
    isLoading: false,
    user: storedUser,
  };
};

const initialState: AppState = getInitialState();

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FEATURE_FLAGS':
      return { ...state, featureFlags: action.payload };
    
    case 'SET_DATE_RANGE':
      return {
        ...state,
        dateRange: action.payload,
        metrics: calculateMetrics(state.feedbackEntries, action.payload, state.drivers),
      };
    
    case 'SET_SORT_CONFIG':
      return { ...state, sortConfig: action.payload };
    
    case 'SET_FILTER_CONFIG':
      return { 
        ...state, 
        filterConfig: { ...state.filterConfig, ...action.payload } 
      };
    
    case 'SET_SELECTED_DRIVER':
      return { ...state, selectedDriver: action.payload };
    
    case 'ADD_FEEDBACK': {
      const newFeedbackEntries = [action.payload, ...state.feedbackEntries];
      const updatedDrivers = recalculateDriverScores(state.drivers, newFeedbackEntries);
      return {
        ...state,
        feedbackEntries: newFeedbackEntries,
        drivers: updatedDrivers,
        metrics: calculateMetrics(newFeedbackEntries, state.dateRange, updatedDrivers),
        alerts: updatedDrivers
          .filter(d => d.isAlert && !state.alerts.some(a => a.driverId === d.id))
          .map(driver => ({
            id: `ALT${driver.id.slice(3)}`,
            driverId: driver.id,
            driverName: driver.name,
            currentScore: driver.averageScore,
            threshold: 2.5,
            timestamp: new Date().toISOString(),
            isRead: false,
          })),
      };
    }
    
    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload ? { ...alert, isRead: true } : alert
        ),
      };
    
    case 'CLEAR_ALL_ALERTS':
      return {
        ...state,
        alerts: state.alerts.map(alert => ({ ...alert, isRead: true })),
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOGIN':
      return { ...state, user: action.payload };
    
    case 'LOGOUT':
      return { ...state, user: null };
    
    default:
      return state;
  }
}

// Context Interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void;
  setDateRange: (range: DateRange) => void;
  setSortConfig: (config: SortConfig) => void;
  setFilterConfig: (config: Partial<FilterConfig>) => void;
  selectDriver: (driver: Driver | null) => void;
  addFeedback: (feedback: FeedbackEntry) => void;
  markAlertRead: (alertId: string) => void;
  clearAllAlerts: () => void;
  getUnreadAlertCount: () => number;
  getFilteredDrivers: () => Driver[];
  getFilteredFeedback: () => FeedbackEntry[];
  getDriverById: (id: string) => Driver | undefined;
  getDriverFeedbackHistory: (driverId: string) => FeedbackEntry[];
  // Auth functions
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist to localStorage when state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FEEDBACK_ENTRIES, state.feedbackEntries);
  }, [state.feedbackEntries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DRIVERS, state.drivers);
  }, [state.drivers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ALERTS, state.alerts);
  }, [state.alerts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, state.user);
  }, [state.user]);

  // Helper functions
  const updateFeatureFlags = (flags: Partial<FeatureFlags>) => {
    dispatch({ 
      type: 'SET_FEATURE_FLAGS', 
      payload: { ...state.featureFlags, ...flags } 
    });
  };

  const setDateRange = (range: DateRange) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: range });
  };

  const setSortConfig = (config: SortConfig) => {
    dispatch({ type: 'SET_SORT_CONFIG', payload: config });
  };

  const setFilterConfig = (config: Partial<FilterConfig>) => {
    dispatch({ type: 'SET_FILTER_CONFIG', payload: config });
  };

  const selectDriver = (driver: Driver | null) => {
    dispatch({ type: 'SET_SELECTED_DRIVER', payload: driver });
  };

  const addFeedback = (feedback: FeedbackEntry) => {
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
  };

  const markAlertRead = (alertId: string) => {
    dispatch({ type: 'MARK_ALERT_READ', payload: alertId });
  };

  const clearAllAlerts = () => {
    dispatch({ type: 'CLEAR_ALL_ALERTS' });
  };

  const getUnreadAlertCount = () => {
    return state.alerts.filter(a => !a.isRead).length;
  };

  const getFilteredDrivers = () => {
    let drivers = [...state.drivers];
    const { searchQuery, scoreRange } = state.filterConfig;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      drivers = drivers.filter(
        d => d.name.toLowerCase().includes(query) || d.id.toLowerCase().includes(query)
      );
    }

    if (scoreRange) {
      drivers = drivers.filter(
        d => d.averageScore >= scoreRange[0] && d.averageScore <= scoreRange[1]
      );
    }

    // Sort
    const { key, direction } = state.sortConfig;
    drivers.sort((a, b) => {
      let aVal = a[key as keyof Driver];
      let bVal = b[key as keyof Driver];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return drivers;
  };

  const getFilteredFeedback = () => {
    let feedback = [...state.feedbackEntries];
    const { entityType, sentiment, searchQuery } = state.filterConfig;

    if (entityType !== 'all') {
      feedback = feedback.filter(f => f.entityType === entityType);
    }

    if (sentiment !== 'all') {
      feedback = feedback.filter(f => f.sentiment === sentiment);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      feedback = feedback.filter(
        f => f.text.toLowerCase().includes(query) || f.driverName.toLowerCase().includes(query)
      );
    }

    return feedback;
  };

  const getDriverById = (id: string) => {
    return state.drivers.find(d => d.id === id);
  };

  const getDriverFeedbackHistory = (driverId: string) => {
    return state.feedbackEntries.filter(f => f.driverId === driverId);
  };

  // Auth functions
  const login = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const isAuthenticated = () => {
    return state.user !== null;
  };

  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  const isUser = () => {
    return state.user?.role === 'user';
  };

  const value: AppContextType = {
    state,
    dispatch,
    updateFeatureFlags,
    setDateRange,
    setSortConfig,
    setFilterConfig,
    selectDriver,
    addFeedback,
    markAlertRead,
    clearAllAlerts,
    getUnreadAlertCount,
    getFilteredDrivers,
    getFilteredFeedback,
    getDriverById,
    getDriverFeedbackHistory,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
