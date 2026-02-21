import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedbackEntry, EntityType, SentimentType } from '../../types';
import { getScoreBadgeClass, formatDate } from '../../data/mockData';
import { Filter, MessageSquare, Car, Smartphone, Shield } from 'lucide-react';
import './FeedbackTimeline.css';

const ENTITY_ICONS: Record<EntityType, typeof MessageSquare> = {
  driver: Car,
  trip: MessageSquare,
  app: Smartphone,
  marshal: Shield,
};

const PAGE_SIZE = 10;

export default function FeedbackTimeline() {
  const { state, getFilteredFeedback, setFilterConfig } = useApp();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const feedbackEntries = getFilteredFeedback();
  const { filterConfig } = state;

  const visibleFeedback = feedbackEntries.slice(0, visibleCount);
  const hasMore = visibleCount < feedbackEntries.length;

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  const handleEntityFilter = (entityType: EntityType | 'all') => {
    setFilterConfig({ entityType });
  };

  const handleSentimentFilter = (sentiment: SentimentType | 'all') => {
    setFilterConfig({ sentiment });
  };

  return (
    <div className="feedback-timeline">
      {/* Filters */}
      <div className="timeline-filters">
        <button 
          className={`btn btn-ghost ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>

        {showFilters && (
          <div className="filter-panels">
            <div className="filter-group">
              <label>Entity Type</label>
              <div className="filter-buttons">
                {(['all', 'driver', 'trip', 'app', 'marshal'] as const).map((type) => (
                  <button
                    key={type}
                    className={`filter-btn ${filterConfig.entityType === type ? 'active' : ''}`}
                    onClick={() => handleEntityFilter(type)}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Sentiment</label>
              <div className="filter-buttons">
                {(['all', 'positive', 'neutral', 'negative'] as const).map((sentiment) => (
                  <button
                    key={sentiment}
                    className={`filter-btn ${filterConfig.sentiment === sentiment ? 'active' : ''} ${sentiment !== 'all' ? `sentiment-${sentiment}` : ''}`}
                    onClick={() => handleSentimentFilter(sentiment)}
                  >
                    {sentiment === 'all' ? 'All' : sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="timeline-list">
        {visibleFeedback.map((entry: FeedbackEntry) => {
          const IconComponent = ENTITY_ICONS[entry.entityType];
          
          return (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-icon">
                <IconComponent size={18} />
              </div>
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-entity">
                    {entry.entityType.charAt(0).toUpperCase() + entry.entityType.slice(1)}
                  </span>
                  <span className={`badge ${getScoreBadgeClass(entry.score)}`}>
                    {entry.score} ★
                  </span>
                  <span className={`badge badge-${entry.sentiment === 'positive' ? 'success' : entry.sentiment === 'neutral' ? 'warning' : 'danger'}`}>
                    {entry.sentiment}
                  </span>
                </div>
                
                <p className="timeline-text">{entry.text}</p>
                
                {entry.tags.length > 0 && (
                  <div className="timeline-tags">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="timeline-meta">
                  <span>{entry.driverName}</span>
                  <span>•</span>
                  <span>{formatDate(entry.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {feedbackEntries.length === 0 && (
          <div className="empty-state">
            <p>No feedback entries found</p>
          </div>
        )}
      </div>

      {/* Loader */}
      {hasMore && (
        <div ref={loaderRef} className="timeline-loader">
          <div className="spinner"></div>
          <span>Loading more...</span>
        </div>
      )}
    </div>
  );
}
