import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Driver, FeedbackEntry } from '../../types';
import { useApp } from '../../context/AppContext';
import { getScoreBadgeClass, formatDate } from '../../data/mockData';
import { X, AlertTriangle } from 'lucide-react';
import './DriverDetailModal.css';

interface DriverDetailModalProps {
  driver: Driver;
  onClose: () => void;
}

export default function DriverDetailModal({ driver, onClose }: DriverDetailModalProps) {
  const { getDriverFeedbackHistory } = useApp();
  const feedbackHistory = getDriverFeedbackHistory(driver.id);

  // Generate trend data for the last 30 days
  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayFeedback = feedbackHistory.filter(f => 
        f.timestamp.split('T')[0] === dateStr
      );
      
      const avgScore = dayFeedback.length > 0
        ? dayFeedback.reduce((sum, f) => sum + f.score, 0) / dayFeedback.length
        : null;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: avgScore,
      });
    }
    
    return data;
  }, [feedbackHistory]);

  // Generate tag breakdown data
  const tagData = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    feedbackHistory.forEach(feedback => {
      feedback.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [feedbackHistory]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal driver-detail-modal">
        <div className="modal-header">
          <div className="driver-detail-header">
            <h2 className="modal-title">{driver.name}</h2>
            <div className="driver-detail-meta">
              <span className="driver-id">{driver.id}</span>
              <span className={`badge ${getScoreBadgeClass(driver.averageScore)}`}>
                {driver.averageScore.toFixed(1)} ★
              </span>
              {driver.isAlert && (
                <span className="badge badge-danger">
                  <AlertTriangle size={12} />
                  Alert
                </span>
              )}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Stats */}
          <div className="driver-stats">
            <div className="stat-item">
              <div className="stat-value">{driver.totalTrips}</div>
              <div className="stat-label">Total Trips</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{feedbackHistory.length}</div>
              <div className="stat-label">Feedback Count</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{driver.trendValue > 0 ? '+' : ''}{driver.trendValue.toFixed(1)}</div>
              <div className="stat-label">vs Last Week</div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="detail-section">
            <h3 className="section-title">Sentiment Trend (30 Days)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={4}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tag Breakdown */}
          {tagData.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Feedback Tags Breakdown</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={tagData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Feedback History Table */}
          <div className="detail-section">
            <h3 className="section-title">Feedback History</h3>
            <div className="feedback-history-list">
              {feedbackHistory.slice(0, 20).map((feedback: FeedbackEntry) => (
                <div key={feedback.id} className="feedback-history-item">
                  <div className="feedback-history-header">
                    <span className={`badge ${getScoreBadgeClass(feedback.score)}`}>
                      {feedback.score} ★
                    </span>
                    <span className={`badge badge-${feedback.sentiment === 'positive' ? 'success' : feedback.sentiment === 'neutral' ? 'warning' : 'danger'}`}>
                      {feedback.sentiment}
                    </span>
                    <span className="feedback-type">
                      {feedback.entityType}
                    </span>
                    <span className="feedback-time">
                      {formatDate(feedback.timestamp)}
                    </span>
                  </div>
                  <p className="feedback-text">{feedback.text}</p>
                  {feedback.tags.length > 0 && (
                    <div className="feedback-tags">
                      {feedback.tags.map((tag) => (
                        <span key={tag} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
