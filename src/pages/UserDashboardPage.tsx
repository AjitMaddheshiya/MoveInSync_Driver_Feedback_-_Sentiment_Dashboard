import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FeedbackEntry, EntityType, SentimentType } from '../types';
import './UserDashboardPage.css';

interface RideHistory {
  id: string;
  date: string;
  driverName: string;
  pickupLocation: string;
  dropoffLocation: string;
  rating: number;
  feedbackId?: string;
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { state, isAuthenticated, isUser, isAdmin } = useApp();
  const { user, feedbackEntries } = state;
  
  const [rides, setRides] = useState<RideHistory[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Redirect if not authenticated or if admin
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else if (isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Generate mock ride history based on feedback entries
  useEffect(() => {
    const mockRides: RideHistory[] = [
      {
        id: 'RIDE001',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        driverName: 'John Smith',
        pickupLocation: '123 Main Street',
        dropoffLocation: '456 Oak Avenue',
        rating: 4.5,
        feedbackId: feedbackEntries[0]?.id,
      },
      {
        id: 'RIDE002',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        driverName: 'Sarah Johnson',
        pickupLocation: '789 Pine Road',
        dropoffLocation: '321 Elm Boulevard',
        rating: 5,
      },
      {
        id: 'RIDE003',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        driverName: 'Mike Davis',
        pickupLocation: '555 Center Mall',
        dropoffLocation: '777 Airport Terminal',
        rating: 3.5,
      },
      {
        id: 'RIDE004',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        driverName: 'Emily Brown',
        pickupLocation: '100 University campus',
        dropoffLocation: '200 Station Road',
        rating: 4,
      },
      {
        id: 'RIDE005',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        driverName: 'David Wilson',
        pickupLocation: 'Hospital Main Entrance',
        dropoffLocation: 'Home Address',
        rating: 4.8,
      },
    ];
    setRides(mockRides);
  }, [feedbackEntries]);

  const getSentimentIcon = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp size={16} className="sentiment-icon positive" />;
      case 'negative':
        return <TrendingDown size={16} className="sentiment-icon negative" />;
      default:
        return <Minus size={16} className="sentiment-icon neutral" />;
    }
  };

  const getSentimentClass = (sentiment: SentimentType) => {
    return `sentiment-badge ${sentiment}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserFeedback = () => {
    return feedbackEntries.slice(0, 10);
  };

  if (!user || isAdmin()) {
    return null;
  }

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <div className="user-welcome">
          <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p>Track your rides and share feedback</p>
        </div>
        <button className="give-feedback-btn" onClick={() => navigate('/feedback')}>
          <Send size={18} />
          Give Feedback
        </button>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <Car size={24} />
          <div className="stat-content">
            <span className="stat-value">{rides.length}</span>
            <span className="stat-label">Total Rides</span>
          </div>
        </div>
        <div className="stat-card">
          <Star size={24} />
          <div className="stat-content">
            <span className="stat-value">
              {(rides.reduce((sum, r) => sum + r.rating, 0) / rides.length).toFixed(1)}
            </span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>
        <div className="stat-card">
          <MessageSquare size={24} />
          <div className="stat-content">
            <span className="stat-value">{getUserFeedback().length}</span>
            <span className="stat-label">Feedback Given</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="ride-history-section">
          <div className="section-header">
            <h2><Car size={20} /> Your Ride History</h2>
            <span className="section-count">{rides.length} rides</span>
          </div>
          
          <div className="ride-list">
            {rides.map((ride) => (
              <div key={ride.id} className="ride-card">
                <div className="ride-date">
                  <Calendar size={14} />
                  {formatDate(ride.date)}
                </div>
                <div className="ride-details">
                  <div className="ride-driver">
                    <div className="driver-avatar">{ride.driverName.charAt(0)}</div>
                    <span className="driver-name">{ride.driverName}</span>
                  </div>
                  <div className="ride-route">
                    <div className="route-point">
                      <MapPin size={14} className="pickup" />
                      <span>{ride.pickupLocation}</span>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-point">
                      <MapPin size={14} className="dropoff" />
                      <span>{ride.dropoffLocation}</span>
                    </div>
                  </div>
                </div>
                <div className="ride-rating">
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  <span>{ride.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="feedback-history-section">
          <div className="section-header">
            <h2><MessageSquare size={20} /> Your Feedback History</h2>
            <span className="section-count">{getUserFeedback().length} submissions</span>
          </div>
          
          {getUserFeedback().length > 0 ? (
            <div className="feedback-list">
              {getUserFeedback().map((feedback) => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-header">
                    <span className="feedback-type">{feedback.entityType}</span>
                    <span className={getSentimentClass(feedback.sentiment)}>
                      {getSentimentIcon(feedback.sentiment)}
                      {feedback.sentiment}
                    </span>
                  </div>
                  <div className="feedback-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= feedback.score ? '#F59E0B' : 'none'}
                        color="#F59E0B"
                      />
                    ))}
                    <span className="rating-value">{feedback.score}/5</span>
                  </div>
                  {feedback.text && (
                    <p className="feedback-text">{feedback.text}</p>
                  )}
                  {feedback.tags && feedback.tags.length > 0 && (
                    <div className="feedback-tags">
                      {feedback.tags.map((tag, index) => (
                        <span key={index} className="feedback-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="feedback-meta">
                    <Clock size={12} />
                    <span>{formatDate(feedback.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-feedback">
              <MessageSquare size={48} />
              <p>No feedback yet</p>
              <button onClick={() => navigate('/feedback')}>
                Give your first feedback
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
